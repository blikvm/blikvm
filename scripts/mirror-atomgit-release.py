#!/usr/bin/env python3
"""Mirror one published BliKVM firmware release and verify anonymous downloads."""

import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
from tempfile import TemporaryDirectory
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urlsplit
from urllib.request import Request, urlopen

SOURCE = "blikvm/blikvm"
DESTINATION = "weixin_43053387/blikvm-firmware-mirror"
API = f"https://api.atomgit.com/api/v5/repos/{DESTINATION}/releases"
WEB = f"https://gitcode.com/{DESTINATION}/releases"
CHECKSUMS = "SHA256SUMS"
TAG_PATTERN = r"v[0-9]+\.[0-9]+\.[0-9]+(?:-[A-Za-z0-9][A-Za-z0-9.-]*)?"
ASSET_PATTERN = r"[A-Za-z0-9][A-Za-z0-9._-]*"
BLOCK_SIZE = 1024 * 1024


class MirrorError(Exception):
    """An error safe to print without credentials or signed URLs."""


def gh(*args):
    return subprocess.check_output(["gh", *args, "--repo", SOURCE], text=True)


def api(token, route="", method="GET", fields=None, allow_missing=False):
    query = {"access_token": token}
    data = None
    if method == "GET":
        query.update(fields or {})
    else:
        data = json.dumps(fields).encode()
    request = Request(API + route + "?" + urlencode(query), data=data,
                      method=method, headers={"Content-Type": "application/json"})
    try:
        with urlopen(request, timeout=30) as response:
            return json.load(response)
    except HTTPError as exc:
        if allow_missing and exc.code == 404:
            return None
        raise MirrorError(f"AtomGit {method} failed with HTTP {exc.code}") from None
    except (URLError, OSError, ValueError):
        raise MirrorError(f"AtomGit {method} did not return valid JSON") from None


def digest(stream, maximum):
    sha = hashlib.sha256()
    size = 0
    for block in iter(lambda: stream.read(BLOCK_SIZE), b""):
        size += len(block)
        if size > maximum:
            raise MirrorError("Asset exceeds its expected size")
        sha.update(block)
    return size, sha.hexdigest()


def local_digest(path, expected_size):
    with path.open("rb") as stream:
        return digest(stream, expected_size)


def public_digest(tag, name, expected_size):
    url = f"{WEB}/download/{tag}/{name}"
    with urlopen(Request(url, headers={"Accept-Encoding": "identity"}), timeout=90) as response:
        if urlsplit(response.url).scheme != "https" or response.status != 200:
            raise MirrorError(f"Unexpected anonymous download response for {name}")
        return digest(response, expected_size)


def verify_public(tag, name, expected):
    for delay in (0, 2, 5, 10):
        if delay:
            time.sleep(delay)
        try:
            actual = public_digest(tag, name, expected[0])
        except (HTTPError, URLError, OSError):
            continue
        if actual != expected:
            raise MirrorError(f"AtomGit checksum or size mismatch for {name}")
        print(f"Verified public download: {name} ({actual[0]} bytes)", flush=True)
        return
    raise MirrorError(f"Could not download {name} anonymously from AtomGit")


def upload(token, tag, path):
    grant = api(token, f"/{tag}/upload_url", fields={"file_name": path.name})
    try:
        url = grant["url"]
        parsed = urlsplit(url)
        if parsed.scheme != "https" or not parsed.hostname or parsed.username:
            raise MirrorError(f"Invalid upload URL for {path.name}")
        headers = {key: value for key, value in grant["headers"].items()
                   if key.lower() in {"content-type", "x-obs-acl", "x-obs-callback",
                                      "x-obs-meta-project-id"}}
        # Keep the signed URL and callback headers out of the process arguments and logs.
        config = [f"url = {json.dumps(url)}"]
        config.extend(f"header = {json.dumps(f'{key}: {value}')}" for key, value in headers.items())
        transfer = subprocess.run(
            ["curl", "--disable", "--config", "-", "--silent", "--show-error", "--fail",
             "--connect-timeout", "20", "--speed-time", "45", "--speed-limit", "65536",
             "--max-time", "900", "--upload-file", str(path), "--output", os.devnull,
             "--write-out", "%{http_code} %{size_upload}"],
            input="\n".join(config) + "\n", capture_output=True, text=True, check=False,
        )
        status, _, sent = transfer.stdout.partition(" ")
        if transfer.returncode or status not in {"200", "201", "204"}:
            status = status if re.fullmatch(r"[0-9]{3}", status) else "unknown"
            sent = sent if sent.isdecimal() else "unknown"
            raise MirrorError(f"Upload of {path.name} failed (curl {transfer.returncode}, HTTP {status}, {sent} bytes sent)")
    except (OSError, KeyError, TypeError, ValueError):
        raise MirrorError(f"Upload of {path.name} failed") from None


def read_manifest(path):
    entries = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        match = re.fullmatch(rf"([a-fA-F0-9]{{64}}) [ *]({ASSET_PATTERN})", line)
        if not match:
            raise MirrorError("Invalid entry in the upstream SHA256SUMS")
        checksum, name = match.groups()
        if name == CHECKSUMS or name in entries:
            raise MirrorError("Duplicate or recursive entry in the upstream SHA256SUMS")
        entries[name] = checksum.lower()
    if not entries:
        raise MirrorError("The upstream SHA256SUMS is empty")
    return entries


def stage_assets(tag, release, directory):
    sizes = {}
    for asset in release["assets"]:
        name = asset["name"]
        if not re.fullmatch(ASSET_PATTERN, name) or name in sizes:
            raise MirrorError("Unsafe or duplicate GitHub asset name")
        sizes[name] = asset["size"]
    if CHECKSUMS not in sizes or sizes[CHECKSUMS] > 1024 * 1024:
        raise MirrorError("The GitHub release has no usable SHA256SUMS")
    gh("release", "download", tag, "--dir", str(directory), "--pattern", CHECKSUMS)
    manifest_path = directory / CHECKSUMS
    if manifest_path.stat().st_size != sizes[CHECKSUMS]:
        raise MirrorError("GitHub SHA256SUMS size changed during download")
    checksums = read_manifest(manifest_path)
    if not checksums.keys() <= sizes.keys():
        raise MirrorError("GitHub release is missing assets named in SHA256SUMS")
    args = ["release", "download", tag, "--dir", str(directory)]
    for name in checksums:
        args.extend(("--pattern", name))
    gh(*args)
    verified = {}
    for name, sha in checksums.items():
        expected = sizes[name], sha
        if local_digest(directory / name, expected[0]) != expected:
            raise MirrorError(f"GitHub checksum or size mismatch for {name}")
        verified[name] = expected
    verified[CHECKSUMS] = local_digest(manifest_path, sizes[CHECKSUMS])
    return verified


def sync(tag, token, release, directory, verified):
    lookup = f"/tags/{tag}"
    existing = api(token, lookup, allow_missing=True)
    body = (
        f"GitHub upstream: {release['url']}\n\n"
        "Use only the files listed in SHA256SUMS as the official BliKVM mirror. "
        "Other attachments are not part of the upstream release.\n\n"
        "请以 SHA256SUMS 中列出的文件为准，下载后核对 SHA256。"
    )
    fields = {"name": release["name"] or tag, "body": body}
    if release["isPrerelease"]:
        fields["release_status"] = "pre"
    if existing is None:
        api(token, method="POST", fields={**fields, "tag_name": tag})
    elif existing.get("prerelease") and not release["isPrerelease"]:
        fields["release_status"] = "latest"
    assets = (existing or {}).get("assets") or []
    existing_names = {asset["name"] for asset in assets}
    for name, expected in verified.items():
        if name not in existing_names:
            print(f"Uploading {name}", flush=True)
            upload(token, tag, directory / name)
        verify_public(tag, name, expected)
    if existing is not None:
        api(token, f"/{tag}", method="PATCH", fields=fields)
    print(f"Mirrored {len(verified)} verified files: {WEB}/{tag}", flush=True)


def main():
    if len(sys.argv) != 2 or not re.fullmatch(TAG_PATTERN, sys.argv[1]):
        raise MirrorError("Pass one published firmware tag such as v3.0.3")
    tag = sys.argv[1]
    token = os.environ.get("ATOMGIT_TOKEN")
    if not token:
        raise MirrorError("ATOMGIT_TOKEN is missing. Configure the GitHub Actions repository secret.")
    release = json.loads(gh("release", "view", tag, "--json",
                            "tagName,isDraft,isPrerelease,name,url,assets"))
    if release["isDraft"] or release["tagName"] != tag:
        raise MirrorError("Only published GitHub releases can be mirrored")
    with TemporaryDirectory(prefix="blikvm-atomgit-") as temp:
        directory = Path(temp)
        verified = stage_assets(tag, release, directory)
        sync(tag, token, release, directory, verified)


if __name__ == "__main__":
    try:
        main()
    except MirrorError as exc:
        sys.exit(str(exc))
    except (OSError, subprocess.CalledProcessError, ValueError, KeyError, TypeError):
        sys.exit("Mirror failed while reading GitHub release metadata or staged assets")

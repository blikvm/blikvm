#!/usr/bin/env python3
"""Regression coverage for AtomGit upload retries and publication checks."""

import contextlib
import importlib.util
import io
from pathlib import Path
import subprocess
import unittest
from unittest.mock import call, patch
from urllib.error import HTTPError

spec = importlib.util.spec_from_file_location(
    "mirror_atomgit_release", Path(__file__).with_name("mirror-atomgit-release.py")
)
mirror = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mirror)

TAG = "v3.0.6"
TOKEN = "test-token"
ASSET = Path("firmware.img.xz")
EXPECTED = (1024, "a" * 64)
MISSING = {"assets": []}
REGISTERED = {"assets": [{"name": ASSET.name}]}


class MirrorTestCase(unittest.TestCase):
    def setUp(self):
        self.stack = contextlib.ExitStack()
        self.addCleanup(self.stack.close)
        self.stack.enter_context(contextlib.redirect_stdout(io.StringIO()))
        self.sleep = self.stack.enter_context(patch.object(mirror.time, "sleep"))


class UploadTests(MirrorTestCase):
    def setUp(self):
        super().setUp()
        self.verify = self.stack.enter_context(patch.object(mirror, "verify_public"))

    def test_low_speed_uses_a_fresh_grant(self):
        grants = [
            {"url": f"https://storage.example/upload?grant={name}",
             "headers": {"Content-Type": "application/octet-stream"}}
            for name in ("initial", "fresh")
        ]
        results = [
            subprocess.CompletedProcess([], 28, "100 128", "private detail"),
            subprocess.CompletedProcess([], 0, "200 1024", ""),
        ]
        with patch.object(mirror, "api", side_effect=[grants[0], MISSING, grants[1]]) as api, \
             patch.object(mirror.subprocess, "run", side_effect=results) as curl:
            mirror.upload_and_verify(TOKEN, TAG, ASSET, EXPECTED)
        grant_request = call(TOKEN, f"/{TAG}/upload_url", fields={"file_name": ASSET.name})
        self.assertEqual(api.call_args_list, [grant_request, call(TOKEN, f"/tags/{TAG}"), grant_request])
        self.assertEqual(curl.call_count, 2)
        for index, invocation in enumerate(curl.call_args_list):
            args, = invocation.args
            self.assertEqual(args[args.index("--speed-time") + 1], "120")
            self.assertEqual(args[args.index("--speed-limit") + 1], "32768")
            self.assertEqual(args[args.index("--max-time") + 1], "1200")
            self.assertNotIn(grants[index]["url"], args)
            self.assertIn(grants[index]["url"], invocation.kwargs["input"])
        self.sleep.assert_called_once_with(10)
        self.verify.assert_called_once_with(TAG, ASSET.name, EXPECTED)

    def test_late_registration_after_full_upload_never_reuploads(self):
        failure = mirror.UploadError(ASSET.name, 28, "100", "1024")
        with patch.object(mirror, "upload", side_effect=failure) as upload, \
             patch.object(mirror, "api", side_effect=[MISSING, REGISTERED]) as api:
            mirror.upload_and_verify(TOKEN, TAG, ASSET, EXPECTED)
        upload.assert_called_once_with(TOKEN, TAG, ASSET)
        self.assertEqual(api.call_count, 2)
        self.sleep.assert_called_once_with(5)
        self.verify.assert_called_once_with(TAG, ASSET.name, EXPECTED)

    def test_upload_conflict_reuses_registered_file(self):
        failure = mirror.UploadError(ASSET.name, 22, "409", "0")
        with patch.object(mirror, "upload", side_effect=failure) as upload, \
             patch.object(mirror, "api", return_value=REGISTERED):
            mirror.upload_and_verify(TOKEN, TAG, ASSET, EXPECTED)
        upload.assert_called_once()
        self.verify.assert_called_once_with(TAG, ASSET.name, EXPECTED)

    def test_temporary_grant_and_lookup_failures_are_retried(self):
        failure = mirror.AtomGitAPIError("GET", 503)
        with patch.object(mirror, "upload", side_effect=[failure, None]) as upload, \
             patch.object(mirror, "api", side_effect=[failure, MISSING]):
            mirror.upload_and_verify(TOKEN, TAG, ASSET, EXPECTED)
        self.assertEqual(upload.call_count, 2)
        self.assertEqual(self.sleep.call_args_list, [call(10), call(5)])
        self.verify.assert_called_once_with(TAG, ASSET.name, EXPECTED)

    def test_retry_budget_is_bounded(self):
        failure = mirror.UploadError(ASSET.name, 52, "100", "512")
        with patch.object(mirror, "upload", side_effect=failure) as upload, \
             patch.object(mirror, "api", return_value=MISSING):
            with self.assertRaises(mirror.UploadError):
                mirror.upload_and_verify(TOKEN, TAG, ASSET, EXPECTED)
        self.assertEqual(upload.call_count, 2)
        self.verify.assert_not_called()

    def test_permanent_rejection_is_not_retried(self):
        failure = mirror.UploadError(ASSET.name, 22, "403", "0")
        with patch.object(mirror, "upload", side_effect=failure) as upload, \
             patch.object(mirror, "api") as api:
            with self.assertRaises(mirror.UploadError):
                mirror.upload_and_verify(TOKEN, TAG, ASSET, EXPECTED)
        upload.assert_called_once()
        api.assert_not_called()
        self.verify.assert_not_called()

    def test_failed_metadata_lookup_does_not_allow_a_second_put(self):
        failure = mirror.UploadError(ASSET.name, 28, "100", "512")
        with patch.object(mirror, "upload", side_effect=failure) as upload, \
             patch.object(mirror, "api", side_effect=mirror.AtomGitAPIError("GET")) as api:
            with self.assertRaises(mirror.AtomGitAPIError):
                mirror.upload_and_verify(TOKEN, TAG, ASSET, EXPECTED)
        upload.assert_called_once()
        self.assertEqual(api.call_count, 3)
        self.verify.assert_not_called()


class VerificationTests(MirrorTestCase):
    def test_existing_wrong_checksum_stops_sync_without_upload(self):
        release = {"url": "https://github.com/blikvm/blikvm/releases/tag/v3.0.6",
                   "isPrerelease": False, "name": "BliKVM 3.0.6"}
        with patch.object(mirror, "api", return_value=REGISTERED) as api, \
             patch.object(mirror, "public_digest", return_value=(1024, "b" * 64)), \
             patch.object(mirror, "upload") as upload:
            with self.assertRaisesRegex(mirror.MirrorError, "checksum or size mismatch"):
                mirror.sync(TAG, TOKEN, release, Path("."), {ASSET.name: EXPECTED})
        upload.assert_not_called()
        api.assert_called_once_with(TOKEN, f"/tags/{TAG}", allow_missing=True)

    def test_public_download_waits_for_the_new_attachment(self):
        pending = HTTPError("https://storage.example/path", 404, "", {}, None)
        with patch.object(mirror, "public_digest", side_effect=[pending] * 4 + [EXPECTED]):
            mirror.verify_public(TAG, ASSET.name, EXPECTED)
        self.assertEqual(self.sleep.call_args_list, [call(2), call(5), call(10), call(20)])


if __name__ == "__main__":
    unittest.main()

#!/usr/bin/python3
# -*- coding:utf8 -*-
# eg: python3 update.py v1.4.2
import json
import os
import sys
import subprocess
import requests
import platform
from enum import Enum
import re
import argparse
from typing import Optional, Tuple

download_path = "/tmp/kvm_update/"
update_result = False

# Define board type string
pi4b_board = "Raspberry Pi 4 Model B"
cm4b_board = "Raspberry Pi Compute Module 4"
h616_board = "MangoPi Mcore"

code_owner = "blikvm"
code_repo = "blikvm"
file_name = ""

DEPS = ["libconfig-dev", "jq", "libxkbcommon0", "libgpiod-dev"]


class BoardType(Enum):
    UNKNOWN = 0
    V1_CM4 = 1
    V3_HAT = 2
    V2_PCIE = 3
    V4_H616 = 4

def install_dependencies():
    print("Installing dependencies:", " ".join(DEPS), flush=True)
    if os.geteuid() != 0:
        print("Please run as root to install dependencies. Example: sudo python3 update.py")
        return False
    try:
        subprocess.check_call("apt-get update", shell=True)
    except subprocess.CalledProcessError:
        print("apt-get update failed (ignored, will continue)", flush=True)
    try:
        cmd = "apt-get install -y " + " ".join(DEPS)
        print(cmd, flush=True)
        subprocess.check_call(cmd, shell=True)
        print("Dependencies installed successfully", flush=True)
        return True
    except subprocess.CalledProcessError:
        print("Failed to install dependencies. Please run manually: apt-get install " + " ".join(DEPS), flush=True)
        return False
    
# Execute command and get output
def execmd(cmd):
    result = ""
    try:
        output = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
        result = output.decode("utf-8")
    except subprocess.CalledProcessError as e:
        print("Error: ", e.returncode, e.output)
    return result

# Get board type by checking system information
def get_board_type():
    # Check if the board is Raspberry Pi 4 Model B
    if pi4b_board in execmd("cat /proc/device-tree/model"):
        type = BoardType.V3_HAT
    # Check if the board is Raspberry Pi Compute Module 4
    elif cm4b_board in execmd("cat /proc/device-tree/model"):
        type = BoardType.V2_PCIE
    # Check if the board is Mango Pi Mcore
    elif h616_board in execmd("cat /proc/device-tree/model"):
        type = BoardType.V4_H616
    else:
        type = BoardType.UNKNOWN
    return type

def download_release_file(owner, repo, tag_name, file_name, download_path):
    """
    Download a specific file from the latest release of a GitHub repository and display progress.

    Args:
        owner (str): The owner of the GitHub repository.
        repo (str): The name of the GitHub repository.
        tag_name (str): The tag name of the release to download from.
        file_name (str): The name of the file to download.
        download_path (str): The path to download the file to.

    Returns:
        bool: True if the file was downloaded successfully, False otherwise.
    """
    # Get the latest release
    releases_url = f'https://api.github.com/repos/{owner}/{repo}/releases/tags/{tag_name}'
    response = requests.get(releases_url)
    if response.status_code != 200:
        print(f'Error getting release information: {response.content}')
        return False
    release_data = response.json()

    # Find the file in the release assets
    asset = next((a for a in release_data['assets'] if a['name'] == file_name), None)
    if asset is None:
        print(f'Could not find asset with name {file_name}')
        return False

    # Download the file with progress
    file_url = asset['browser_download_url']
    response = requests.get(file_url, stream=True)
    if response.status_code != 200:
        print(f'Error downloading file: {response.content}')
        return False

    # Save the file to the specified download path and print progress percentage
    file_path = os.path.join(download_path, file_name)
    total_size = int(response.headers.get('content-length', 0))
    downloaded_size = 0
    block_size = 1024  # 1 Kilobyte
    previous_progress = 0 
    with open(file_path, 'wb') as f:
        for data in response.iter_content(block_size):
            downloaded_size += len(data)
            f.write(data)
            progress_percentage = (downloaded_size / total_size) * 100
            now_progress = int(progress_percentage)
            pre_progress = int(previous_progress)
            if now_progress != pre_progress:
                bar_length = 40
                filled_length = int(bar_length * now_progress // 100)
                bar = '█' * filled_length + '-' * (bar_length - filled_length)
                print(f'\rDownload progress: |{bar}| {progress_percentage:.2f}%', end='\r', flush=True)
                previous_progress = progress_percentage

    if total_size != 0 and downloaded_size != total_size:
        print(f'Error downloading file: downloaded {downloaded_size} out of {total_size} bytes')
        return False
    print(f'{file_name} downloaded to {file_path} successfully.', flush=True)
    return True

def version_to_tuple(version):
    version_numbers = re.findall(r'\d+', version)
    return tuple(map(int, version_numbers))


# ---- New helper functions for source selection and downloads ----

def _parse_ping_avg_ms(output: str) -> Optional[float]:
    """Parse average RTT from ping output (ms). Supports Linux variants.
    Returns None if not found.
    """
    try:
        for line in output.splitlines():
            # Typical formats:
            # rtt min/avg/max/mdev = 10.317/10.317/10.317/0.000 ms
            # round-trip min/avg/max/stddev = 10.317/10.317/10.317/0.000 ms
            if ('min/avg' in line) and ('=' in line):
                right = line.split('=', 1)[1].strip()
                # e.g., '10.317/10.317/10.317/0.000 ms'
                first_field = right.split()[0]
                parts = first_field.split('/')
                if len(parts) >= 2:
                    return float(parts[1])
        return None
    except Exception:
        return None


def ping_host_avg_ms(host: str, count: int = 3, timeout_sec: int = 10) -> Optional[float]:
    """Ping a host and return average RTT in ms, or None on failure."""
    # Use IPv4 to avoid IPv6-only anomalies, disable reverse lookup with -n
    cmd = ["ping", "-n", "-4", "-c", str(count), host]
    try:
        cp = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout_sec,
        )
        if cp.returncode != 0 and not cp.stdout:
            return None
        return _parse_ping_avg_ms(cp.stdout or cp.stderr or "")
    except Exception:
        return None


def choose_source_by_ping(ping_count: int = 3) -> Tuple[str, dict]:
    """Ping github.com and gitee.com, return chosen source ('github'|'gitee') and the measured averages dict."""
    github_avg = ping_host_avg_ms("github.com", count=ping_count)
    gitee_avg = ping_host_avg_ms("gitee.com", count=ping_count)

    # Decide with sensible fallbacks
    measurements = {"github": github_avg, "gitee": gitee_avg}
    # Prefer the one with a valid (non-None) and smaller average
    candidates = [(k, v) for k, v in measurements.items() if v is not None]
    if candidates:
        chosen = min(candidates, key=lambda x: x[1])[0]
        return chosen, measurements
    # If both failed, default to gitee (often more reachable in CN networks)
    return "gitee", measurements


def get_latest_tag_from_source(source: str, owner: str, repo: str, timeout_sec: int = 10) -> Optional[str]:
    """Get latest release tag from the specified source using public APIs with graceful fallbacks."""
    headers = {"User-Agent": "blikvm-updater/1.0", "Accept": "application/json"}
    try:
        if source == "github":
            url = f"https://api.github.com/repos/{owner}/{repo}/releases/latest"
            resp = requests.get(url, headers=headers, timeout=timeout_sec)
            if resp.status_code == 200:
                data = resp.json()
                return data.get("tag_name")
            else:
                # Fallback: list releases and pick the first
                url = f"https://api.github.com/repos/{owner}/{repo}/releases?per_page=1"
                resp = requests.get(url, headers=headers, timeout=timeout_sec)
                if resp.status_code == 200 and isinstance(resp.json(), list) and resp.json():
                    return resp.json()[0].get("tag_name")
                return None
        elif source == "gitee":
            # Try Gitee latest API, then fallback to releases list
            url = f"https://gitee.com/api/v5/repos/{owner}/{repo}/releases/latest"
            resp = requests.get(url, headers=headers, timeout=timeout_sec)
            if resp.status_code == 200:
                data = resp.json()
                # Gitee's API also uses tag_name for releases
                tag = data.get("tag_name") or data.get("tag")
                if tag:
                    return tag
            # Fallback to releases list
            url = f"https://gitee.com/api/v5/repos/{owner}/{repo}/releases?per_page=1"
            resp = requests.get(url, headers=headers, timeout=timeout_sec)
            if resp.status_code == 200 and isinstance(resp.json(), list) and resp.json():
                item = resp.json()[0]
                return item.get("tag_name") or item.get("tag")
            return None
        else:
            return None
    except Exception:
        return None


def download_asset_direct(source: str, owner: str, repo: str, tag_name: str, file_name: str, download_path: str) -> bool:
    """Download release asset from source via direct URL pattern with progress bar."""
    if source == "github":
        file_url = f"https://github.com/{owner}/{repo}/releases/download/{tag_name}/{file_name}"
    elif source == "gitee":
        file_url = f"https://gitee.com/{owner}/{repo}/releases/download/{tag_name}/{file_name}"
    else:
        print(f"Unsupported source: {source}")
        return False

    try:
        response = requests.get(file_url, stream=True, timeout=20)
    except Exception as e:
        print(f"Error downloading file: {e}")
        return False

    if response.status_code != 200:
        print(f"Error downloading file from {source} (HTTP {response.status_code}). URL: {file_url}")
        return False

    os.makedirs(download_path, exist_ok=True)
    file_path = os.path.join(download_path, file_name)
    total_size = int(response.headers.get('content-length', 0))
    downloaded_size = 0
    block_size = 1024
    previous_progress = 0
    with open(file_path, 'wb') as f:
        for data in response.iter_content(block_size):
            if not data:
                continue
            downloaded_size += len(data)
            f.write(data)
            if total_size:
                progress_percentage = (downloaded_size / total_size) * 100
                now_progress = int(progress_percentage)
                pre_progress = int(previous_progress)
                if now_progress != pre_progress:
                    bar_length = 40
                    filled_length = int(bar_length * now_progress // 100)
                    bar = '█' * filled_length + '-' * (bar_length - filled_length)
                    print(f'\rDownload progress: |{bar}| {progress_percentage:.2f}%', end='\r', flush=True)
                    previous_progress = progress_percentage

    if total_size != 0 and downloaded_size != total_size:
        print(f'Error downloading file: downloaded {downloaded_size} out of {total_size} bytes')
        return False
    print(f'{file_name} downloaded to {file_path} successfully.', flush=True)
    return True


def main():
    print("Welcome to use the upgrade script. Please confirm that you have used git related commands before upgrading the script to ensure that update.by is in the latest state.")
    # Argument parsing: optional version and optional source
    parser = argparse.ArgumentParser(description="blikvm updater")
    parser.add_argument("version", nargs="?", help="Specify version tag, e.g. v1.4.2")
    parser.add_argument("--source", choices=["github", "gitee"], help="Force update source (default: auto by ping)")
    parser.add_argument("--ping-count", type=int, default=3, help="Ping count for source selection (default: 3)")
    args = parser.parse_args()

    install_dependencies()
    board_type = get_board_type()
    print("Board type:", board_type)
    global update_result
    sh_path = os.path.split(os.path.realpath(__file__))[0]

    specified_version = args.version
    forced_source = args.source
    ping_count = args.ping_count

    # Remove/clear download directory
    cmd = "rm -rf /tmp/kvm_update"
    output = subprocess.check_output(cmd, shell = True, cwd=sh_path )

    # Create the download path
    cmd = "mkdir /tmp/kvm_update"
    output = subprocess.check_output(cmd, shell = True, cwd=sh_path )

    #start update
    file = open('/tmp/kvm_update/update_status.json','w')
    file.write('{\"update_status\": 0}')
    file.close()
    a=1
    while(a>0):
        latest_version = ''
        run_version = ''
    # Decide source
        if forced_source:
            chosen_source = forced_source
            print(f"Source specified by user: {chosen_source}")
        else:
            chosen_source, ms = choose_source_by_ping(ping_count=ping_count)
            print(f"Ping results (avg ms): github={ms.get('github')}, gitee={ms.get('gitee')} -> choose {chosen_source}")
        other_source = "gitee" if chosen_source == "github" else "github"

        if specified_version:
            # Use the specified version
            latest_version = specified_version
            print(f"Specified version: {latest_version}")
        else:
            # Get the latest tag from chosen source if no version is specified
            latest_version = get_latest_tag_from_source(chosen_source, code_owner, code_repo)
            if latest_version:
                print("The latest release tag for blikvm is ", latest_version)
            else:
                if not forced_source:
                    # Fallback to the other source automatically
                    print(f"Failed to get latest tag from {chosen_source}, trying {other_source}...")
                    alt_tag = get_latest_tag_from_source(other_source, code_owner, code_repo)
                    if alt_tag:
                        chosen_source = other_source
                        latest_version = alt_tag
                        other_source = "gitee" if chosen_source == "github" else "github"  # swap
                        print("The latest release tag for blikvm is ", latest_version)
                    else:
                        print("Cannot find the latest release tag from both sources.")
                        return
                else:
                    print("Cannot find the latest release tag from ", chosen_source)
                    return

        # get local tag
        run_json = '/usr/bin/blikvm/package.json'
        if not os.path.exists(run_json):
            run_version="v1.0.0"
            print("get local version failed ",run_json," is not exit")
        else:
            with open(run_json,'r',encoding='utf8')as fp_r:
                json_data = json.load(fp_r)
                run_version = json_data['version']
                print("The local version is ",run_version)
       
        # compare version
        if latest_version != run_version:
            print("Upgrading ", run_version , " ==> ", latest_version)
            # download tar pack
            cmd = ""
            if board_type == BoardType.V1_CM4 or board_type == BoardType.V3_HAT or board_type == BoardType.V2_PCIE:
                # cmd = "curl -kLJo release.tar.gz https://github.com/ThomasVon2021/blikvm/releases/download/" + tag[0:-1] + "/release.tar.gz"
                file_name = "blikvm-v1-v2-v3.deb"
            elif board_type == BoardType.V4_H616:
                # cmd = "curl -kLJo release.tar.gz https://github.com/ThomasVon2021/blikvm/releases/download/" + tag[0:-1] + "/release-h616-v4.tar.gz"
                file_name = "blikvm-v4.deb"
            else:
                print("get unknow board")
            try:
                print("Download package: ", file_name, f"from {chosen_source}, please wait...")
                ok = download_asset_direct(chosen_source, code_owner, code_repo, latest_version, file_name, download_path)
                if not ok:
                    if not forced_source:
                        # Fallback to the other source for download
                        print(f"Download from {chosen_source} failed, trying {other_source}...")
                        ok = download_asset_direct(other_source, code_owner, code_repo, latest_version, file_name, download_path)
                        if ok:
                            chosen_source = other_source
                        else:
                            print("Download release package failed from both sources, check network")
                            break
                    else:
                        print("Download release package failed, check network")
                        break
            except Exception as e:
                if not forced_source:
                    print(f"Exception downloading from {chosen_source}: {e}. Trying {other_source}...")
                    try:
                        ok = download_asset_direct(other_source, code_owner, code_repo, latest_version, file_name, download_path)
                        if ok:
                            chosen_source = other_source
                        else:
                            print("Download release package failed from both sources, check network")
                            break
                    except Exception as e2:
                        print("Download release package failed from both sources due to exception:", e2)
                        break
                else:
                    print("Download release package failed, check network: ", e)
                    break
            print("Download release package success, start to install, please wait 60s...",  flush=True)
            release_tar = download_path + file_name
            if os.path.exists(release_tar):   

                cmd = "dpkg -i " + file_name
                output = subprocess.check_output(cmd, shell = True, cwd=download_path)
                print(output)       
                update_result = True
                print("If any abnormalities are found when upgrading from the old version to the latest version, the system can be restored by flashing it again.")
                print("If you cannot log in with your original password, it may be due to a version upgrade and reset configuration to default. If you have changed the web or SSH password, you will need to update the configuration again. Config path is /mnt/exec/release/config/app.json",  flush=True)
                print("Upgrade successful!",  flush=True)
        else:
            print("There is no latest stable version available.")
        a = 0
    result_cnt = ""
    if update_result == True:
        result_cnt = "{\"update_status\": 1}"
    else:
        result_cnt = "{\"update_status\": 2}"

    file = open('/tmp/kvm_update/update_status.json','w')
    file.write(result_cnt)
    file.close()


if __name__ == '__main__':
    main()

# BliKVM Python API example

English · [简体中文](README_CN.md)

Use screenshots and USB keyboard/mouse APIs from your computer. Requires Python 3.10 or newer, with **no third-party dependencies**. Nothing needs to be installed on the KVM.

The default device address is `https://192.168.8.173`. Set `--url https://YOUR_DEVICE` to use a different device. Global options go before the command.

## Read status and capture a screenshot

From this directory:

```sh
python3 blikvm_demo.py --url https://YOUR_DEVICE info
python3 blikvm_demo.py --url https://YOUR_DEVICE snapshot captures/screenshot.jpg
```

Certificate verification is enabled by default. Use `--ca-file device-ca.pem` with a trusted device certificate/CA in PEM format. For testing a self-signed device only, `--insecure` skips certificate verification:

```sh
python3 blikvm_demo.py --url https://YOUR_DEVICE --insecure info
```

When device authentication is enabled, supply an API token through the environment. The account/token needs viewing and input permissions:

```sh
read -r -s BLIKVM_TOKEN
export BLIKVM_TOKEN
```

Paste the token and press Enter after running `read` (Bash or Zsh). Do not put real tokens in source files or shared logs. A token is not required when global device authentication is disabled.

## Send keyboard and mouse input

The following examples **operate the attached computer**. Check the target screen first. They use the default address and a self-signed certificate for local testing; adapt the global options for your device.

```sh
# Absolute coordinates, normalized to 0..1
python3 blikvm_demo.py --insecure move 0.5 0.5
python3 blikvm_demo.py --insecure click 0.5 0.5
python3 blikvm_demo.py --insecure click 0.5 0.5 --button right

# Click a pixel in a 1920x1080 screenshot (zero-based coordinates)
python3 blikvm_demo.py --insecure click-pixel 480 270 --width 1920 --height 1080

# Tap a key or a combination; keys are released automatically
python3 blikvm_demo.py --insecure key Enter
python3 blikvm_demo.py --insecure key KeyA
python3 blikvm_demo.py --insecure shortcut ControlLeft KeyA

# Wheel increments are HID units, not pixels; start with +1 or -1
python3 blikvm_demo.py --insecure wheel 0 1

# Relative movement requires relative/dual mouse mode
python3 blikvm_demo.py --insecure relative 24 -12
```

Pixel conversion uses `toX = x / (width - 1)` and `toY = y / (height - 1)`. Use the actual dimensions of the full captured image, excluding browser chrome and letterboxing. Do not assume every capture is 1080p.

## Run a complete sequence

Capture → click → wait → tap a key → wait → capture:

```sh
python3 blikvm_demo.py --insecure demo \
  --x 0.5 --y 0.5 --key Enter --wait 1 --output-dir captures/demo
```

This writes `before.jpg` and `after.jpg`. It clicks and presses Enter; it does not include AI/OCR or determine whether the target application completed the intended task.

## Use as a Python module

```python
from blikvm_demo import BliKVMClient

client = BliKVMClient("https://YOUR_DEVICE", ca_file="device-ca.pem")
# Reads BLIKVM_TOKEN automatically; alternatively, pass token=...
client.screenshot("captures/before.jpg")
client.click_pixel(480, 270, width=1920, height=1080)
client.shortcut("ControlLeft", "KeyA")
client.press("Escape")
client.screenshot("captures/after.jpg")
```

## API mapping and behavior

| Operation | Endpoint |
| --- | --- |
| Authentication state | GET /api/v1/auth/state |
| Mouse mode | GET /api/v1/hid/mode |
| Screenshot | GET /api/v1/video/snapshot |
| Single key, mouse and wheel | POST /api/v1/hid/events |
| Key combination | POST /api/v1/hid/shortcuts |

Input requests are never retried automatically: a timed-out action might already have executed. HTTP success does not prove that the target application completed a task; inspect the next screenshot.

Absolute movement and coordinate clicks check mouse mode first. The example does not modify USB classes or mouse mode. Relative movement and wheel increments are limited to -127..127 per call, and target OS settings affect their behavior.

The current events endpoint does not reliably preserve a held mouse button across movement events, so this example intentionally provides no drag command.

## Local tests

```sh
python3 -m unittest -v test_demo.py
```

Tests use a temporary local HTTP server and send no input to a real device.

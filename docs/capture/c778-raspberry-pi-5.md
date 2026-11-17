---
title: C778 · Raspberry Pi 5B guide
---

# C778 on Raspberry Pi 5B

Use the [C778 Linux driver repository](https://github.com/blikvm/c778-lt6911uxe) to capture HDMI video over CSI and HDMI audio over I²S on Raspberry Pi 5B.

## Prepare the hardware

- Raspberry Pi 5B with a 64-bit system (aarch64), kernel `6.18.50+rpt-rpi-2712`.
- C778, its dedicated 5V supply and a compatible four-lane 22-pin CSI cable.
- An HDMI source, such as a computer or media player, and HDMI cable.
- For audio, I²S wires and an HDMI source configured for **48 kHz stereo PCM**.

Check the Pi system:

```bash
uname -m
uname -r
```

The repository loader checks the kernel version. Install headers matching the running kernel.

## Connect C778

Power off the Pi and C778 before wiring:

1. Connect one C778 MIPI output to Pi **CAM/DISP 0**. Check cable contact orientation against the [hardware manual](/docs/device-guides/C778).
2. Connect the computer or player's HDMI output to C778 **VIDEO-IN**.
3. For audio, wire I²S as below. GPIO numbers use **BCM numbering**.
4. Connect C778's dedicated 5V supply, then boot the Pi. Never connect 5V to a CSI 3.3V pin.

| C778 I²S | Pi BCM GPIO | Physical pin |
| --- | --- | --- |
| SCK / SCLK | GPIO18 | 12 |
| WFS / WS | GPIO19 | 35 |
| SD / SDOUT | GPIO20 | 38 |
| GND | GND | e.g. 39 |

C778 supplies the audio clocks and Pi receives them. MCLK is not needed for this connection. Video travels over CSI; audio uses the separate I²S wires.

## Download and load the driver

Run on the Pi:

```bash
sudo apt update
sudo apt install build-essential git device-tree-compiler v4l-utils kmod ffmpeg alsa-utils
sudo apt install "linux-headers-$(uname -r)"

git clone https://github.com/blikvm/c778-lt6911uxe.git
cd c778-lt6911uxe
make -j4
bash scripts/load.sh
```

`C778 development driver is bound on CSI0` confirms that the video driver is bound.

## Capture video

Enable video output on your HDMI source, then inspect the input, configure capture and read 120 frames:

```bash
bash scripts/status.sh
bash scripts/configure-capture.sh
bash scripts/capture.sh 120
```

`status.sh` reports HDMI input resolution. `configure-capture.sh` reports the capture node, dimensions and pixel format. `capture.sh` checks capture; it does not open a preview or save video.

### Preview video

This example uses **3840×2160 UYVY** input. Select that mode on the HDMI source and rerun `configure-capture.sh`. For another resolution, replace the dimensions with the actual capture values.

```bash
. ./scripts/find-path.sh
c778_find_path
ffplay -f v4l2 -input_format uyvy422 -video_size 3840x2160 \
  -i "$C778_VIDEO"
```

Run in a terminal on the Pi graphical desktop. Press `f` for fullscreen or `q` to quit. Close the preview before running another video capture command.

### Save an image

For 3840×2160 UYVY input:

```bash
mkdir -p results
. ./scripts/find-path.sh
c778_find_path
v4l2-ctl -d "$C778_VIDEO" --stream-mmap=4 --stream-skip=5 \
  --stream-count=1 --stream-to=results/frame.uyvy
ffmpeg -f rawvideo -pixel_format uyvy422 -video_size 3840x2160 \
  -i results/frame.uyvy -frames:v 1 -update 1 results/frame.png
```

The image is saved as `results/frame.png` in the repository.

## Capture audio

Play content with sound on the HDMI source, configured for **48 kHz stereo PCM**. Load the audio configuration from the repository directory:

```bash
dtc -@ -I dts -O dtb -o c778-audio.dtbo c778-audio.dts
sudo dtoverlay "$PWD/c778-audio.dtbo"
arecord -l
```

The card list should include `C778-I2S`. Record ten seconds:

```bash
mkdir -p results
arecord -D hw:C778I2S,0 -f S32_LE -r 48000 -c 2 -d 10 results/audio.wav
```

Play through the Pi's default audio output:

```bash
aplay results/audio.wav
```

Audio is saved as `results/audio.wav`. If silent, check source volume, PCM output settings, I²S signal wires and GND.

## After reboot

The driver and audio overlay are loaded temporarily. After reboot, run from the repository:

```bash
bash scripts/load.sh
bash scripts/configure-capture.sh
sudo dtoverlay "$PWD/c778-audio.dtbo"
```

After changing source resolution, stop preview/capture and rerun `configure-capture.sh`.

[Back to C778](/docs/device-guides/C778) · [RV1126B guide](/docs/capture/c778-rv1126b)

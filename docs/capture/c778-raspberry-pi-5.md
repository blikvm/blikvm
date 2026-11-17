---
title: C778 · Raspberry Pi 5B guide
---

# C778 on Raspberry Pi 5B

Use the public [C778 Linux driver repository](https://github.com/blikvm/c778-lt6911uxe) for the current **single CSI0, full-frame** development workflow. It uses `c778_lt6911uxe` with the distribution RP1-CFE driver.

## Tested environment and limits

- Raspberry Pi 5 Model B Rev 1.0, aarch64; kernel `6.18.50+rpt-rpi-2712`.
- One four-lane CAM/DISP 0 path: a recorded 600-frame test delivered complete 3840×2160 UYVY buffers at about 60 fps.
- The test logged `DPHY: Datarate 2495 Mbps out of range`; long-term 4K60 integrity is still unresolved.
- Dual CSI, stitching, 1080p120, calibrated color, active hotplug and other kernels are not established by this result.

Do not force-load a module on another kernel or downgrade blindly. Build against matching installed headers. Chip identity does not identify a reproducible firmware release; record firmware/profile information when known.

## Connect and capture

Power down before changing FPC or GPIO wiring. Give C778 its dedicated 5V supply; never inject 5V into the Pi CSI 3.3V pin. Connect the tested C778 output to Pi CAM/DISP 0 with a compatible four-lane 22-pin FPC. Check contact orientation against the [hardware manual](/docs/device-guides/C778).

Run on the Pi:

```bash
uname -m
uname -r
uname -v
sudo apt update
sudo apt install build-essential git device-tree-compiler v4l-utils kmod
sudo apt install "linux-headers-$(uname -r)"
git clone https://github.com/blikvm/c778-lt6911uxe.git
cd c778-lt6911uxe
make -j4
bash scripts/load.sh
bash scripts/status.sh
bash scripts/configure-capture.sh
bash scripts/capture.sh 120
```

Connect a valid HDMI source before configuring capture. The scripts discover actual media/video nodes; do not assume `/dev/video0`. Loading is temporary unless the optional factory startup is installed. Reboot removes the runtime configuration. See the repository for exact supported kernel, troubleshooting and capture-image examples.

## Audio and factory loopback

The Pi can also generate the source: **HDMI1 → C778 HDMI input → CSI0/I²S → Pi → HDMI0 monitor**. The second output displays the captured path rather than simply duplicating the source.

| C778 I²S | Pi BCM GPIO | Physical pin |
| --- | --- | --- |
| SCK / SCLK | 18 | 12 |
| WFS / WS | 19 | 35 |
| SD / SDOUT | 20 | 38 |
| GND | GND | e.g. 39 |

C778 supplies the clocks and Pi receives them. CSI video alone does not provide audio. The optional audio overlay creates `C778-I2S`; it is tested with 48 kHz stereo PCM, S32_LE capture. A registered card is not proof of non-silent audio.

See the repository's [audio and factory setup](https://github.com/blikvm/c778-lt6911uxe/blob/main/docs/pi5-audio-factory.md) for the overlay, dependencies, installation and uninstall commands. The desktop test shows moving bars, counters and a large green/red audio label, with separate 1000/1500 Hz left/right test tones. It needs desktop autologin and the documented display layout. Audio replay is segmented and delayed; it does not establish A/V synchronization.

The earlier test program passed 10/10 software reboots with distinct Boot IDs, active video preview and recent 1000 Hz detection. This covered the older left-channel detector, not cold-power starts or the newer stereo classifier. Keep those evidence sets separate.

## Acceptance evidence

Record board revisions, kernel/build, source commit, DTBO and firmware hashes, wiring, source timing, actual format/fps and frame sequences. Check colors, complete image content, both audio channels, cable/mode recovery and cold starts separately. A green audio label or running player is not a complete production acceptance test.

[Back to C778](/docs/device-guides/C778) · [RV1126B guide](/docs/capture/c778-rv1126b)

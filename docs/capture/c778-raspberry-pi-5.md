---
title: C778 · Raspberry Pi 5B guide
---

# C778 on Raspberry Pi 5B

This guide describes the **one HDMI input → two CSI half-frame paths → host-side stitching** profile. Each path carries 960×1080 @ 120 fps, forming a complete 1920×1080 image after correct pairing. Verify left/right ordering and colors before measuring frame rate.

:::info Scope of the existing software
The available factory-test bundle requires the exact kernel `6.18.39+rpt-rpi-2712`. It is not a universal installer for every Raspberry Pi image. Production driver source, installer and firmware-version mapping are being organized. The commands below apply to an already configured development environment or the matching test bundle, not an arbitrary clean system.
:::

## Hardware and environment

- Raspberry Pi 5B, host power supply, cooling and a bootable 64-bit Linux system with terminal access.
- C778, its dedicated 5V lead and two verified compatible 22-pin FPC cables.
- An HDMI source and cable supporting the target timing. Begin with static text/color bars, then use motion video.
- Both CAM/DISP ports available for C778; stop other camera and capture applications.

Pi 5 has two four-lane MIPI ports labeled CAM/DISP 0 and CAM/DISP 1; see the [official Raspberry Pi connector description](https://www.raspberrypi.com/documentation/computers/sbcs.html). Verify module pinout, FPC contact orientation and host pins together.

## Wiring

1. Turn off both devices and check power polarity and FPC orientation against the [C778 connector reference](/docs/device-guides/C778#connectors-and-power).
2. For split operation, connect both C778 MIPI outputs to the two Pi CAM/DISP ports. The existing factory-test convention is P3=LEFT→CSI0 and P1=RIGHT→CSI1. This internal naming must still be mapped explicitly to C778's MIPI0/MIPI1 silkscreen using the actual wiring.
3. Connect I²S separately if audio is needed; the video factory test does not verify recording.
4. Connect the HDMI source, supply C778 with 5V, then boot the Pi.

Do not infer left/right paths from cable color or fixed `/dev/videoX` numbers. Identify the media entities and actual image halves, then record their correspondence.

## Inspect the system and capture paths

Run on the Pi:

```bash
uname -m
uname -r
uname -v
cat /proc/device-tree/model
v4l2-ctl --list-devices
for media in /dev/media*; do
  [ -e "$media" ] || continue
  media-ctl -d "$media" -p
done
```

`v4l2-ctl` and `media-ctl` are normally provided by `v4l-utils`; on Raspberry Pi OS they can be installed from the system package repositories. The factory-test bundle carries its own runtime tools.

The existing test stack uses `anran_lt6911uxe`, `anran_rp1_cfe` and a dedicated DTBO. Loading the bridge module alone does not establish a working host CSI path. Discover two distinct capture paths and verify consistent pad and video-queue formats.

## Existing factory-test bundle

Obtain the complete matching `uxe-factory-test` folder from support and preserve all files and executable permissions. The bundle can deploy test modules and boot configuration. Back up boot configuration first. Investigate existing camera/driver conflicts rather than forcing an overwrite.

The current bundle requires:

| Check | Exact value |
| --- | --- |
| Architecture | aarch64 / BCM2712 |
| Kernel | `6.18.39+rpt-rpi-2712` |
| Build | `#1 SMP PREEMPT Debian 1:6.18.39-1+rpt1 (2026-07-29)` |
| `/sys/kernel/notes` SHA-256 | `b552b3ec76cc19236e62f85f613db2ef61c213ff9de1d45da5e0cd5fb6caa987` |

```bash
# Verify first. Do not load bundled modules on a mismatched kernel.
uname -r
uname -v
sha256sum /sys/kernel/notes

# Run only on the matching target Pi.
cd ~/uxe-factory-test
sudo ./test
```

- `REBOOT_REQUIRED`: deployment completed; capture has **not** passed. Reboot manually with `sudo reboot`, then run `sudo ./test` again from the same folder.
- `PASS`: this particular run passed the bundle's concurrent capture checks.
- `KERNEL_BUILD_MISMATCH`: stop; do not force-load modules.
- Other failures: keep the report and logs in the corresponding `results/<run-directory>/`.

Do not blindly downgrade to an old kernel to match a test bundle, or assume historical package versions remain available. A production release should provide a reproducible source build or matching system image.

To revert configuration added by the bundle:

```bash
cd ~/uxe-factory-test
sudo ./test --restore
# Reboot manually if requested.
```

## Verify image content

A passing data-path test still needs content checks:

1. Color bars and text: exclude RGB/BGR swaps, mirroring and exchanged channels.
2. Stitching boundary: confirm a 1920×1080 image with no missing or repeated columns.
3. Motion or a source frame counter: verify both halves come from the same source frame; independent fps readings are insufficient.
4. HDMI disconnection/reconnection, resolution changes and reboot recovery.

The existing desktop preview script limits its output to 60 fps. It can help inspect image content but **cannot prove 120 fps display or encoding performance**.

## Keep acceptance evidence

Record host and module revisions, system/kernel, driver commit, DTBO and firmware hashes, input timing, both capture formats, measured fps, sequence/timestamps, color and synchronization checks, test duration and kernel errors.

[Back to C778](/docs/device-guides/C778) · [RV1126B guide](/docs/capture/c778-rv1126b)

---
title: Linux integration and troubleshooting
---

# Linux integration for HDMI capture modules

For C790, C792 and legacy TC358743 modules. Video uses CSI and audio uses separate I²S. These are not USB cameras; ribbon wiring still needs matching board drivers and device tree.

## 1. Check hardware

Power off before connecting. Check pin count, pitch, contact direction, CSI lanes and power against the model guide. C792 also provides HDMI passthrough and separate 5V power; do not apply C790 audio wiring to C779.

Start with an ordinary unencrypted HDMI desktop signal in a mode supported by both module and host. Check input, CSI output and application encoding limits separately.

## 2. Prepare drivers and device tree

Record board, system, kernel and ribbon type:

```sh
uname -a
cat /etc/os-release
```

On Raspberry Pi, consult the overlays README for your installed kernel for `tc358743` interfaces, lanes and parameters. Audio also requires checking `tc358743-audio` and board I²S support. The [Raspberry Pi kernel overlay reference](https://github.com/raspberrypi/linux/blob/rpi-6.18.y/arch/arm/boot/dts/overlays/README) is a reference branch, not a replacement for your installed version's documentation.

Pi 5 / CM5 CSI controllers differ from earlier boards; do not copy Pi 4 configurations unchanged. Other platforms need matching CSI receiver, I²C, clock and power definitions. Back up boot configuration and follow the system supplier's integration instructions.

## 3. Identify devices and signal

Use your distribution's `v4l-utils`, plus `alsa-utils` for audio checks. These read-only checks do not assume `/dev/video0`:

```sh
v4l2-ctl --list-devices
ls -l /dev/media* /dev/video* /dev/v4l-subdev*
```

Select the capture-related nodes from the list. Replace `X` below with actual numbers:

```sh
media-ctl -d /dev/mediaX -p
v4l2-ctl -d /dev/videoX --all
v4l2-ctl -d /dev/videoX --list-formats-ext
```

Inspect TC358743, CSI receiver and node links. Some drivers expose HDMI timing queries on a subdevice; when supported:

```sh
v4l2-ctl -d /dev/v4l-subdevX --query-dv-timings
```

An unsupported ioctl may mean the wrong node or driver interface, not broken hardware. See the [Linux subdevice interface](https://www.kernel.org/doc/html/latest/userspace-api/media/v4l/dev-subdev.html) for video-node relationships.

## 4. Verify picture and audio

Choose the confirmed capture node and enumerated format in a local capture application. Verify locally before encoding or streaming. For manual media-pipeline configuration, follow that board driver's examples rather than another controller's pad numbers or formats.

Check audio independently:

```sh
arecord -l
arecord --help
```

Audio-capable models need I²S wiring, ALSA configuration and a compatible HDMI audio source. Select recording parameters from the actual sound card's supported formats. Working video does not establish audio connectivity.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| No capture node | Driver, device tree, I²C detection, CSI selection and power |
| Node but no signal | HDMI source, ribbon direction, EDID and timings |
| High-resolution drops / corruption | Frame rate, CSI lanes, cables, host bandwidth and app settings |
| C792 passthrough works but capture fails | CSI is a separate path; inspect its driver and formats |
| Video without sound | Model audio support, I²S, ALSA and source audio output |

Provide board / module, OS / kernel versions, wiring photos and check output when reporting problems. Not every board / kernel combination has been tested on hardware for this guide.

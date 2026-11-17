---
title: C778 · 树莓派 5B 使用指南
---

# C778 接入 Raspberry Pi 5B

本指南使用 [C778 Linux 驱动仓库](https://github.com/blikvm/c778-lt6911uxe)，通过树莓派 5B 的 CSI 接口采集 HDMI 图像，通过 I²S 接口采集 HDMI 音频。

## 准备设备

- Raspberry Pi 5B，64 位系统（aarch64），内核 `6.18.50+rpt-rpi-2712`。
- C778、独立 5V 电源和兼容的四 Lane 22Pin CSI 排线。
- HDMI 视频源，例如电脑或播放器，以及 HDMI 线。
- 需要声音时，准备 I²S 连接线，并将 HDMI 源设置为 **48 kHz 双声道 PCM**。

先在树莓派终端确认系统：

```bash
uname -m
uname -r
```

仓库加载脚本会检查内核版本，安装的 headers 应与当前运行内核一致。

## 连接 C778

关闭树莓派和 C778 电源后接线：

1. 将 C778 的一个 MIPI 输出连接到树莓派 **CAM/DISP 0**，按[硬件手册](/docs/device-guides/C778)核对排线接点方向。
2. 将电脑或播放器的 HDMI 输出连接到 C778 的 **VIDEO-IN**。
3. 需要采集音频时，按下表连接 I²S。GPIO 使用 **BCM 编号**。
4. 为 C778 接入独立 5V 电源，再启动树莓派。不要将 5V 接入 CSI 的 3.3V 引脚。

| C778 I²S | 树莓派 BCM GPIO | 物理针脚 |
| --- | --- | --- |
| SCK / SCLK | GPIO18 | 12 |
| WFS / WS | GPIO19 | 35 |
| SD / SDOUT | GPIO20 | 38 |
| GND | GND | 例如 39 |

此接法由 C778 提供音频时钟，树莓派接收；不需要连接 MCLK。视频走 CSI，音频走独立的 I²S 连接。

## 下载并加载驱动

在树莓派执行：

```bash
sudo apt update
sudo apt install build-essential git device-tree-compiler v4l-utils kmod ffmpeg alsa-utils
sudo apt install "linux-headers-$(uname -r)"

git clone https://github.com/blikvm/c778-lt6911uxe.git
cd c778-lt6911uxe
make -j4
bash scripts/load.sh
```

看到 `C778 development driver is bound on CSI0` 表示视频驱动已绑定。

## 获取图像

让 HDMI 源输出画面，然后检查输入、配置采集并读取 120 帧：

```bash
bash scripts/status.sh
bash scripts/configure-capture.sh
bash scripts/capture.sh 120
```

`status.sh` 显示 HDMI 输入分辨率；`configure-capture.sh` 显示实际采集节点、宽高和像素格式。`capture.sh` 用于检查采集，不会弹出预览窗口或保存视频。

### 预览画面

以下示例用于 **3840×2160、UYVY** 输入。先从 HDMI 源选择该输出模式，并重新执行 `configure-capture.sh`；使用其他分辨率时，将命令中的宽高替换为实际采集值。

```bash
. ./scripts/find-path.sh
c778_find_path
ffplay -f v4l2 -input_format uyvy422 -video_size 3840x2160 \
  -i "$C778_VIDEO"
```

在树莓派图形桌面的终端运行预览，按 `f` 切换全屏，按 `q` 退出。退出预览后再运行其他视频采集命令。

### 保存一张图片

同样以 3840×2160、UYVY 为例：

```bash
mkdir -p results
. ./scripts/find-path.sh
c778_find_path
v4l2-ctl -d "$C778_VIDEO" --stream-mmap=4 --stream-skip=5 \
  --stream-count=1 --stream-to=results/frame.uyvy
ffmpeg -f rawvideo -pixel_format uyvy422 -video_size 3840x2160 \
  -i results/frame.uyvy -frames:v 1 -update 1 results/frame.png
```

图片保存在仓库的 `results/frame.png`。

## 获取音频

确认 HDMI 源正在播放带声音的内容，并已设置为 **48 kHz 双声道 PCM**。在仓库目录加载音频配置：

```bash
dtc -@ -I dts -O dtb -o c778-audio.dtbo c778-audio.dts
sudo dtoverlay "$PWD/c778-audio.dtbo"
arecord -l
```

声卡列表中应出现 `C778-I2S`。录制 10 秒音频：

```bash
mkdir -p results
arecord -D hw:C778I2S,0 -f S32_LE -r 48000 -c 2 -d 10 results/audio.wav
```

使用树莓派默认音频输出播放录音：

```bash
aplay results/audio.wav
```

音频保存在 `results/audio.wav`。如果没有声音，检查 HDMI 源的音量和 PCM 设置，以及 I²S 信号线与 GND 接线。

## 重启后使用

以上驱动和音频配置为临时加载，重启后在仓库目录重新执行：

```bash
bash scripts/load.sh
bash scripts/configure-capture.sh
sudo dtoverlay "$PWD/c778-audio.dtbo"
```

HDMI 源切换分辨率后，先停止预览或采集，再重新执行 `configure-capture.sh`。

[返回 C778 手册](/docs/device-guides/C778) · [RV1126B 示例](/docs/capture/c778-rv1126b)

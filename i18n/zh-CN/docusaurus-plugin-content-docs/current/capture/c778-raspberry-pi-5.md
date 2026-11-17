---
title: C778 · 树莓派 5B 使用指南
---

# C778 接入 Raspberry Pi 5B

当前公开开发流程请使用 [C778 Linux 驱动仓库](https://github.com/blikvm/c778-lt6911uxe)：**单路 CSI0 采集完整画面**，使用 `c778_lt6911uxe` 和系统自带 RP1-CFE。

## 已验证环境与边界

- Raspberry Pi 5 Model B Rev 1.0、aarch64，内核 `6.18.50+rpt-rpi-2712`。
- CAM/DISP 0 四 Lane：已有 600 帧短时测试，完整 3840×2160 UYVY，约 60 fps。
- 测试仍有 `DPHY: Datarate 2495 Mbps out of range` 告警，长期 4K60 数据完整性尚待排查。
- 此结果不覆盖双 CSI、左右拼接、1080p120、校准颜色、采集中热插拔及其他内核。

不要强制加载不匹配的模块，也不要盲目降级。需要与运行内核匹配的 headers。芯片 ID 不能代替固件版本与指纹，已知时应记录固件和输出模式。

## 接线与视频采集

接线前关闭电源。C778 使用独立 5V 供电，不能把 5V 接入 Pi CSI 的 3.3V 引脚。使用兼容的四 Lane 22Pin 排线，将待测 C778 输出接到 Pi CAM/DISP 0，按[硬件手册](/docs/device-guides/C778)核对接点方向。

在 Pi 上执行：

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

配置采集前应接好有效 HDMI 源。脚本会查找实际 media/video 节点，不应假定 `/dev/video0`。默认仅临时加载，重启后需要重新运行；可选产测自启动另行安装。精确内核要求、排障与保存图片示例以仓库为准。

## 音频与产测回环

同一台 Pi 可生成测试源：**HDMI1 → C778 HDMI 输入 → CSI0/I²S → Pi → HDMI0 显示器**。显示器预览的是采集返回的路径。

| C778 I²S | 树莓派 BCM GPIO | 物理针脚 |
| --- | --- | --- |
| SCK / SCLK | 18 | 12 |
| WFS / WS | 19 | 35 |
| SD / SDOUT | 20 | 38 |
| GND | GND | 例如 39 |

C778 提供时钟，Pi 使用时钟接收模式。CSI 视频不包含此音频路径，需要独立 I²S 配置。音频 overlay 创建 `C778-I2S`，当前验证格式为 48 kHz 双声道 PCM、S32_LE 采集；仅出现声卡不能证明已采集到声音。

参见仓库[音频与产测配置](https://github.com/blikvm/c778-lt6911uxe/blob/main/docs/pi5-audio-factory.md)，获取依赖、安装、自启动和卸载步骤。测试显示动态彩条、帧号、计时及大号红绿音频状态，左/右声道分别输出 1000/1500 Hz 测试音。需要桌面自动登录并核对双屏布局。采集音频采用分段回放，有间隔和延迟，不代表音画同步已验证。

旧版程序已通过 10/10 次软件重启，Boot ID 各不相同，视频预览持续更新，检测到 1000 Hz 测试音。该记录属于旧版左声道检测程序，不应作为新版双声道判定或断电冷启动的验证证据。

## 验收记录

记录板号、内核构建、源码 commit、DTBO/固件指纹、接线、输入时序、实际格式/帧率和帧序号。另行检查完整画面、颜色、左右声道、拔插/切换时序恢复与断电启动。音频绿色或播放器运行不等同于完整量产验收。

[返回 C778 手册](/docs/device-guides/C778) · [RV1126B 示例](/docs/capture/c778-rv1126b)

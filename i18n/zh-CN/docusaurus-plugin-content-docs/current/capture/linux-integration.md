---
title: Linux 接入与排查
---

# HDMI 采集模块的 Linux 接入

适用于 C790、C792 及采用 TC358743 的历史模块。模块输出 CSI 视频；音频另走 I²S。它们不是 USB 摄像头，连接 CSI 排线后仍需要匹配的主板驱动与设备树。

## 1. 核对硬件

断电连接，按型号页核对排线针数、间距、触点方向、CSI 通道数与供电。C792 另有 HDMI 环出和独立 5V 供电；C779 不应套用 C790 的音频接线。

先用普通、未加密的 HDMI 桌面信号验证，选择模块与主板共同支持的输入模式。输入规格、CSI 输出和应用编码能力分别核对。

## 2. 准备驱动与设备树

记录主板、系统、内核与排线类型：

```sh
uname -a
cat /etc/os-release
```

树莓派系统应查阅当前安装内核对应的 overlays README，确认 `tc358743` 的接口、通道与参数；音频配置需另核对 `tc358743-audio` 和主板 I²S 支持。参考[树莓派内核的设备树说明](https://github.com/raspberrypi/linux/blob/rpi-6.18.y/arch/arm/boot/dts/overlays/README)。该分支是参考，不能代替本机版本文档。

Pi 5 / CM5 与早期主板的 CSI 控制器不同，不应直接复制 Pi 4 的设备树配置。非树莓派平台需要对应 CSI 接收端、I²C、时钟与供电定义。修改启动配置前备份文件，并以系统供应方的适配说明为准。

## 3. 识别设备与信号

准备系统发行版提供的 `v4l-utils`；需要音频检查时准备 `alsa-utils`。以下是只读检查，不依赖固定的 `/dev/video0`：

```sh
v4l2-ctl --list-devices
ls -l /dev/media* /dev/video* /dev/v4l-subdev*
```

从列出的设备选择与采集链路对应的节点。下面的 `X` 是占位符，必须替换为实际编号：

```sh
media-ctl -d /dev/mediaX -p
v4l2-ctl -d /dev/videoX --all
v4l2-ctl -d /dev/videoX --list-formats-ext
```

检查 TC358743、CSI 接收端及节点之间的连接。部分驱动把 HDMI 时序查询放在子设备节点；支持时可使用：

```sh
v4l2-ctl -d /dev/v4l-subdevX --query-dv-timings
```

若返回“不支持该 ioctl”，先核对节点和驱动接口，不能仅凭这一条判断模块损坏。[Linux 子设备接口说明](https://www.kernel.org/doc/html/latest/userspace-api/media/v4l/dev-subdev.html)解释了视频节点与子设备的关系。

## 4. 验证画面与音频

在系统自带的采集应用中选择已确认的采集节点和枚举得到的格式。先在本机验证画面，再接编码或网络服务。若应用要求手工配置 media pipeline，使用该主板驱动的示例，不套用其他控制器的 pad 编号或像素格式。

音频独立检查：

```sh
arecord -l
arecord --help
```

有音频功能的型号需完成 I²S 接线与 ALSA 配置，并让 HDMI 源输出兼容的音频格式；根据声卡实际支持的格式选择录制参数。视频正常并不代表音频链路已建立。

## 常见问题

| 现象 | 优先检查 |
| --- | --- |
| 找不到采集节点 | 驱动、设备树、I²C 探测、CSI 接口选择与供电 |
| 有节点但无信号 | HDMI 源输出、排线方向、EDID 与输入时序 |
| 高分辨率掉帧或花屏 | 输入帧率、CSI 通道、线材、主板带宽与应用配置 |
| C792 环出正常但不能采集 | 环出与 CSI 是不同链路，继续检查 CSI 驱动和格式 |
| 有画面没有声音 | 型号是否支持音频、I²S 接线、ALSA 声卡与源设备音频输出 |

提交问题时附主板型号、模块型号、系统与内核版本、排线连接照片，以及以上检查输出。本页提供接入流程与检查方法，尚未对每种主板 / 内核组合进行实机验证。

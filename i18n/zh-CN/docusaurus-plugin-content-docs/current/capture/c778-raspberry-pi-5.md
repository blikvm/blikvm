---
title: C778 · 树莓派 5B 使用指南
---

# C778 接入 Raspberry Pi 5B

本指南优先整理 **一个 HDMI 输入 → 双路 CSI 半幅 → 主机拼接** 的方案。两路各为 960×1080 @ 120 fps，目标完整画面为 1920×1080。先确认左右半幅与颜色，再做帧率验收。

:::info 当前适用范围
现有材料提供 Pi 5 厂测包，内核精确匹配 `6.18.39+rpt-rpi-2712`，不是任意树莓派系统的通用安装包。正式驱动源码、安装器与固件锁定表仍在整理。本页面的命令用于已配置的开发环境或配套厂测包，不保证全新系统仅执行几条命令即可使用。
:::

## 准备硬件与环境

- Raspberry Pi 5B、主机电源、散热与可登录的 64 位 Linux 系统。
- C778、配套 5V 电源线、两条经确认兼容的 22Pin FPC 排线。
- 能输出目标时序的 HDMI 视频源与线材。先使用静态文字/色条，再测试运动画面。
- 两个 CAM/DISP 接口均留给 C778；停止其他相机或采集程序。

Pi 5 提供两个四 Lane MIPI 接口，标为 CAM/DISP 0 和 CAM/DISP 1，接口能力见 [树莓派官方资料](https://www.raspberrypi.com/documentation/computers/sbcs.html)。接线必须同时核对 C778 的线序、排线接点方向与主机引脚。

## 接线

1. 关闭 Pi 和 C778 电源，按 [接口图](/zh-CN/docs/device-guides/C778#接口与供电) 核对电源极性与排线接点。
2. 双路模式将两个 C778 MIPI 输出分别接入 Pi 的两个 CAM/DISP 口。当前厂测约定 P3=LEFT→CSI0、P1=RIGHT→CSI1；正式接线照片还需将该内部命名与 C778 的 MIPI0/MIPI1 丝印逐一核对。
3. 需要音频时单独连接 I²S；本节视频厂测不覆盖录音。
4. 接入 HDMI 源，为 C778 提供 5V，然后启动 Pi。

**不要根据排线颜色或固定 `/dev/videoX` 编号猜左右通道。**第一次连接先确认 media 实体、实际半幅内容，再记录稳定的对应关系。

## 确认系统和采集路径

在 Pi 的终端执行：

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

`v4l2-ctl` 和 `media-ctl` 通常由 `v4l-utils` 提供；使用 Raspberry Pi OS 时可通过系统软件源安装。厂测包另带所需运行时。

现有厂测栈使用 `anran_lt6911uxe`、`anran_rp1_cfe` 两个模块和专用 DTBO。只有 LT 芯片模块不代表主机 CSI 路径已适配。先发现两条不同的 capture path，再确认各级 pad 和 video 队列格式一致。

## 使用现有厂测包

向技术支持获取匹配的完整 `uxe-factory-test` 目录；保留全部文件与执行权限。该包会部署测试驱动和启动片段，首次运行前备份启动配置；若已有相机/驱动配置冲突，应先停止并查清冲突，不要强制覆盖。

当前包要求：

| 检查项 | 精确值 |
| --- | --- |
| 架构 | aarch64 / BCM2712 |
| 内核 | `6.18.39+rpt-rpi-2712` |
| 构建版本 | `#1 SMP PREEMPT Debian 1:6.18.39-1+rpt1 (2026-07-29)` |
| `/sys/kernel/notes` SHA-256 | `b552b3ec76cc19236e62f85f613db2ef61c213ff9de1d45da5e0cd5fb6caa987` |

```bash
# 先确认版本和指纹，不匹配时不要加载包内 .ko
uname -r
uname -v
sha256sum /sys/kernel/notes

# 在匹配的目标 Pi 上执行
cd ~/uxe-factory-test
sudo ./test
```

- `REBOOT_REQUIRED`：部署完成，需要手动重启；**还未通过采集验收**。执行 `sudo reboot` 后，再在相同目录运行 `sudo ./test`。
- `PASS`：本次双路数据链路通过包内验收条件。
- `KERNEL_BUILD_MISMATCH`：内核构建不一致，停止；不要强制加载模块。
- 其他失败：保留 `results/<本次测试目录>/` 下报告和日志。

不要为匹配旧测试包盲目降级内核，也不要假设上述历史软件包版本一直可从软件源下载；正式发布应提供源码构建或匹配镜像。

撤销由测试包新增的配置：

```bash
cd ~/uxe-factory-test
sudo ./test --restore
# 如果提示需要重启，再手动重启
```

## 检查实际画面

厂测通过还需要检查以下内容：

1. 彩条和文字方向：排除 RGB/BGR 颠倒、左右反转和通道交换。
2. 左右分割边界：两路拼接后宽度为 1920、高度为 1080，无重叠或缺列。
3. 运动画面或源帧计数：确认两个半幅来自同一源帧，不能只看各自 fps。
4. 断开/重接 HDMI、切换分辨率和重启后的自动恢复。

已有桌面预览脚本会将输出限制为 60 fps；它可以辅助检查内容，**不能用于证明 120 fps 的实时显示或编码能力**。

## 留存验收结果

正式发布前至少记录：主板版本、C778 板号、系统/内核、驱动 commit、DTBO 与芯片固件 SHA-256、输入时序、两路格式、实际 fps、序号/时间戳、颜色和同步检查、持续时间与错误日志。

[返回 C778 手册](/zh-CN/docs/device-guides/C778) · [RV1126B 示例](/zh-CN/docs/capture/c778-rv1126b)

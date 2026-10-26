---
sidebar_position: 1
title: BliKVM 使用手册
---

# BliKVM 使用手册

BliKVM 通过 HDMI 采集画面、USB 模拟键鼠和介质，让你在浏览器中管理另一台电脑，包括 BIOS / UEFI 与操作系统安装。被控电脑无需安装远程桌面客户端；可选电源控制需要额外接线。

本文档介绍当前软件。可用功能取决于硬件、系统构建、浏览器和账号权限；界面未提供的功能不能仅凭型号或 demo 推断支持。

## 从你的任务开始

| 想完成的任务 | 阅读入口 |
| --- | --- |
| 烧录 SD 卡或重装系统 | [完整烧录步骤](/zh-CN/docs/getting-started/flashing-os) |
| 第一次连接与登录 | [首次使用](/zh-CN/docs/getting-started/first-steps) |
| 认识控制台和设置 | [网页界面](/zh-CN/docs/getting-started/web-interface) |
| 分配账号、权限与双重验证 | [账号与安全](/zh-CN/docs/getting-started/auth) |
| 调整画面或排查远程黑屏 | [视频模式](/zh-CN/docs/video/video-modes)、[WebRTC](/zh-CN/docs/video/webrtc) |
| 让键鼠、虚拟网卡或摄像头工作 | [USB 功能](/zh-CN/docs/peripheral-devices/usb) |
| 装系统或传文件 | [虚拟介质](/zh-CN/docs/peripheral-devices/msd) |
| 从外网访问 | [选择远程方式](/zh-CN/docs/network/internet-access/overview) |
| 更新、恢复或排查设备 | [更新](/zh-CN/docs/function/update)、[诊断](/zh-CN/docs/function/diagnostics)、[恢复出厂](/zh-CN/docs/function/factory-reset) |
| 查看文件位置与接口 | [持久化目录与日志](/zh-CN/docs/development/architecture)、[API](/zh-CN/docs/development/api) |

## 硬件与接线

![BliKVM 型号示意](/assets/images/version_all.png)

- [v1 CM4](/zh-CN/docs/device-guides/BliKVM-v1-guide)
- [v2 PCIe](/zh-CN/docs/device-guides/BliKVM-v2-guide) 与[安装](/zh-CN/docs/installation-instructions/BliKVM-v2-installation)
- [v3 HAT](/zh-CN/docs/device-guides/BliKVM-v3-guide) 与[安装](/zh-CN/docs/installation-instructions/BliKVM-v3-installation)
- [v4 Allwinner](/zh-CN/docs/device-guides/BliKVM-v4-guide)
- [BliSwitch v1](/zh-CN/docs/device-guides/BliSwitch-v1-guide)、[v2](/zh-CN/docs/device-guides/BliSwitch-v2-guide)及[网页切换流程](/zh-CN/docs/peripheral-devices/kvm-switch)
- [ATX](/zh-CN/docs/accessories/atx-guide)、[USB / 电源分离器](/zh-CN/docs/accessories/usb-splitter-guide)、[HDMI 转 CSI / I²S](/zh-CN/docs/accessories/hdmi-csi-i2s)、[C792](/zh-CN/docs/device-guides/C792)

型号页用于接口、供电、接线与机械参数；软件操作统一查阅任务指南。输入信号、采集能力、编码输出和本地环出是不同指标，不能将某一项的最高规格视为全部功能规格。

## 使用与验证边界

先在局域网验证真实画面与输入，再配置公网入口。文档中的 demo 图片均注明模拟性质，不代表实机性能、安装或恢复已经验证。需要帮助时，按[诊断模板](/zh-CN/docs/function/diagnostics)整理版本和复现信息，可通过项目社区联系维护者。

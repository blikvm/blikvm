---
sidebar_position: 1
title: BliKVM manual
---

# BliKVM manual

BliKVM captures HDMI and emulates USB input and storage so you can manage another computer in a browser, including BIOS / UEFI and OS installation. The controlled computer needs no remote desktop client. Optional power control requires additional wiring.

This manual describes the current software. Available functions depend on hardware, system image, browser and account permissions. A model name or demo screen alone does not establish support.

## Start with your task

| Task | Guide |
| --- | --- |
| Flash an SD card or reinstall | [Flashing and recovery](/docs/getting-started/flashing-os) |
| Connect and sign in for the first time | [First steps](/docs/getting-started/first-steps) |
| Find console tools and settings | [Web interface](/docs/getting-started/web-interface) |
| Manage accounts, permissions and 2FA | [Accounts and security](/docs/getting-started/auth) |
| Adjust video or troubleshoot a black screen | [Video modes](/docs/video/video-modes), [WebRTC](/docs/video/webrtc) |
| Configure input, USB networking or cameras | [USB functions](/docs/peripheral-devices/usb) |
| Install an OS or transfer files | [Virtual media](/docs/peripheral-devices/msd) |
| Connect from outside your LAN | [Remote access options](/docs/network/internet-access/overview) |
| Update, recover or troubleshoot | [Updates](/docs/function/update), [Diagnostics](/docs/function/diagnostics), [Factory reset](/docs/function/factory-reset) |
| Find device files or API documentation | [Persistent directories and logs](/docs/development/architecture), [API](/docs/development/api) |

## Hardware and wiring

![BliKVM models](/assets/images/version_all.png)

- [v4 Allwinner](/docs/device-guides/BliKVM-v4-guide)
- [v3 HAT](/docs/device-guides/BliKVM-v3-guide) and [assembly](/docs/installation-instructions/BliKVM-v3-installation)
- [v2 PCIe](/docs/device-guides/BliKVM-v2-guide) and [assembly](/docs/installation-instructions/BliKVM-v2-installation)
- [v1 CM4](/docs/device-guides/BliKVM-v1-guide)
- [BliSwitch v1](/docs/device-guides/BliSwitch-v1-guide), [v2](/docs/device-guides/BliSwitch-v2-guide) and [web switching](/docs/peripheral-devices/kvm-switch)
- [ATX](/docs/accessories/atx-guide), [USB splitter](/docs/accessories/usb-splitter-guide), [HDMI to CSI / I²S](/docs/accessories/hdmi-csi-i2s), [C792](/docs/device-guides/C792)

Model guides cover connectors, power, wiring and mechanical specifications. Software tasks use the shared guides. HDMI input, capture, encoding and local passthrough are different capabilities; the highest specification of one does not describe them all.

## Validation and support

Verify real video and input on the LAN before configuring remote access. Demo screenshots are labeled as simulations and do not establish hardware performance or successful installation or recovery. For help, use the [diagnostic template](/docs/function/diagnostics) to collect versions and reproduction details for the project community.

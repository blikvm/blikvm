# USB/PWR 分离器

## **1. 简介**

![image-20220107110102815](/assets/images/usb-splitter/usb-splitter.png)

该适配器允许 Raspberry Pi 4 使用 Pi USB-C 电源适配器供电，同时通过单独的 USB-C 连接访问 USB OTG 数据。

USB-C (RPI4) `<=>` USB-C (USB) 和 USB-C (PWR)

|   USB-C(RPI4)   |  USB Type-C(USB)  |  USB Type-C(PWR)  |
|:---------------:|:-----------------:|:-----------------:|
|       5V        |                   |        5V         |
|       D-        |        D-         |                   |
|       D+        |        D+         |                   |
|  CC1 10k 到 5V  |  CC1 5.1k 到 GND  |  CC1 5.1k 到 GND  |
|  CC2 10k 到 5V  |  CC2 5.1k 到 GND  |  CC2 5.1k 到 GND  |
|       GND       |        GND        |        GND        |

要将适配器与 Raspberry Pi 4 一起使用，您需要：

- 一根 USB-C 到 USB-C 的电缆[1]，连接 Pi4 和适配器板
- 一根 USB-C 到 USB-C 或 Type-A 的电缆，连接适配器板和 PC
- 电源[2]，通过官方 Raspberry Pi USB Type-C 电源适配器供电。

[1] 尽管 USB-C 电缆通常设计用于更高电流，我仍建议尽可能使用短的电源线连接到 Pi，以减少电压降。

[2] **请注意** 由于此板上的上拉/下拉电阻，它只能与 5V 电源一起使用，为 5V 设备供电。

这种适配器不符合 USB 规范。它是为与官方 Raspberry Pi USB-C 电源适配器和 Raspberry Pi 一起使用而设计的，与其他电源适配器/充电器和设备一起使用可能会导致问题或损坏。

## 连接与验证

1. 断电后，将 `RPI4` 端连接 Raspberry Pi 4 的 USB-C 接口。
2. 将 `USB` 数据端连接电脑，使用支持数据传输的线缆。
3. 将 `PWR` 端连接匹配的 5V 电源，再启动树莓派。
4. 检查树莓派供电是否稳定；在已配置 USB gadget 的系统上，检查电脑是否识别预期的 USB 设备。

分离器本身不提供 USB 键盘、网卡或虚拟磁盘功能，这些由主板的 OTG 控制器和系统配置提供。仅有电源正常而电脑未识别设备时，先检查数据线、接口方向及 gadget 配置。

## **2. 机械图**

![image-20220107154909710](/assets/images/usb-splitter/usb-splitter-size.png)

## **3. 测试视频**

:::info "USB 分离器视频"
    <iframe style={{width: '100%', maxWidth: '100%', aspectRatio: '16 / 9', height: 'auto'}} width="560" height="315" src="https://www.youtube.com/embed/4Od5MjBHbhY" title="YouTube 视频播放器" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
:::

## **4. 3D 打印外壳**

:::info "USB 分离器的简单卡扣式外壳。"
    ![](/assets/images/usb-splitter/splitter_3d.png)
    ![](/assets/images/usb-splitter/splitter_3d_case.png)
:::

[下载文件](https://www.printables.com/model/370776-usb-splitter-case-blicube-blikvm)

## **购买链接**

[购买](https://www.aliexpress.com/item/1005003793429781.html)
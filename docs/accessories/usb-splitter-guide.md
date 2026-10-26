# USB/PWR Splitter

## **1. Introduction**

![image-20220107110102815](/assets/images/usb-splitter/usb-splitter.png)

The adaptor allows the Raspberry Pi 4 to be used with a Pi USB-C power supply while allowing access to USB OTG data over a separate USB-C connection.

USB-C (RPI4) `<=>` USB-C (USB) and USB-C (PWR)

|   USB-C(RPI4)   |  USB Type-C(USB)  |  USB Type-C(PWR)  |
|:---------------:|:-----------------:|:-----------------:|
|       5V        |                   |        5V         |
|       D-        |        D-         |                   |
|       D+        |        D+         |                   |
|  CC1 10k to 5V  |  CC1 5.1k to GND  |  CC1 5.1k to GND  |
|  CC2 10k to 5V  |  CC2 5.1k to GND  |  CC2 5.1k to GND  |
|       GND       |        GND        |        GND        |

To use the adaptor with the Raspberry Pi 4 you need.

- USB-C to USB-C cable[1] between Pi4 and the adaptor board
- USB-C to USB-C or Type-A between adaptor board and PC
- Power[2] via Official Raspberry Pi USB Type-C Power Supply.

[1] Whilst USB-C cables are generally designed for higher current I still advise using short power cable to the Pi where possible to reduce voltage drop.

[2] **PLEASE NOTE** With the Pu/Pd resistors on this board it can only be used with 5V supply to power a 5V device.

An adaptor of this kind does not fall within the USB specification. It's designed for use with the official Raspberry Pi USB-C power supply and raspberry pi, use with other power supplies/chargers and devices may cause issues/damage.

## Connection and verification

1. With power disconnected, attach `RPI4` to the Raspberry Pi 4 USB-C port.
2. Connect `USB` to the computer using a data-capable cable.
3. Connect `PWR` to a matching 5V supply, then start the Pi.
4. Check stable power and, on a gadget-configured image, expected USB enumeration on the computer.

The splitter itself provides no keyboard, network or virtual-disk function. These depend on the board's OTG controller and system configuration. For stable power without enumeration, check the data cable, orientation and gadget setup.

## **2.Mechanical Diagram**

![image-20220107154909710](/assets/images/usb-splitter/usb-splitter-size.png)

## **3.Test video**

:::info "USB splitter Video"
    <iframe style={{width: '100%', maxWidth: '100%', aspectRatio: '16 / 9', height: 'auto'}} width="560" height="315" src="https://www.youtube.com/embed/4Od5MjBHbhY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
:::

## **4.3D printable case**

:::info "A simple snap fit case for the USB splitter."
    ![](/assets/images/usb-splitter/splitter_3d.png)
    ![](/assets/images/usb-splitter/splitter_3d_case.png)
:::

[Download file](https://www.printables.com/model/370776-usb-splitter-case-blicube-blikvm)

## **Purchase Link**

[Purchase](https://www.aliexpress.com/item/1005003793429781.html)

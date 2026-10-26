# Multiport BliSwitch v2 (8-port)

## BliSwitch v2 8-port KVM+ATX switch

![main](/assets/images/Product-Datasheet-BliSwitch-v2.assets/front.png)
![main](/assets/images/Product-Datasheet-BliSwitch-v2.assets/back.png)
The BliSwitch v2 is an 8-channel KVM+ATX switch for 8 hosts to share input and power.
Function: 8 hosts share a keyboard, mouse, and display, with power control for all.
Switch Method: Button or USB control. BliSwitch v2 works on its own, but for KVM-Over-IP it needs BliKVM or other KVM.
![main](/assets/images/Product-Datasheet-BliSwitch-v2.assets/main.png)

:::info "BliSwitchv2 Introduction"
    <iframe style={{width: '100%', maxWidth: '100%', aspectRatio: '16 / 9', height: 'auto'}} width="560" height="315" src="https://www.youtube.com/embed/BipzzTIIIQg?si=8Ygw3gYhE-Sgm6mF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
:::

:::warning "BliSwitch v2 Power Supply Logic"
    In addition to the power supply port, the v2 can also be powered via USB from the connected controlled PCs. The specific port providing power depends on which port has the higher voltage. When using the v2 with a KVM, if you notice abnormal behavior such as the KVM restarting during switching or external keyboards malfunctioning, it indicates that one of your controlled PCs is powering the KVM. To prevent this issue, you need to add a [USB splitter board](/docs/accessories/usb-splitter-guide) to the KVM's USB-PC port.
:::

## **Features**
* **ATX on each port(support button and remote control)**
* **Full control via web ui**
* **Compatible with BLIKVM V1, V2, V3 V4 and PikVM hardware.**


## **Port Definition**

![Interface](/assets/images/Product-Datasheet-BliSwitch-v2.assets/interface-en.png)

## **Product Parameters**

| Brand    | BLI                                             |
| -------- | ----------------------------------------------- |
| Name     | 8-port KVM+ATX switcher                         |
| Model    | BliSwitch v2                                    |
| Function | Eight hosts share a set of keyboard, mouse, and display, power control of 8 hosts |
| Material | All metal                                       |
| Resolution | 1080P60Hz                                     |
| Switching Method | Button switching or USB control module switching |
| Power Supply | 5V1A                                        |

## **Control Protocol**
:::info "If you want to use Blicube's switch on other platforms, please refer to the following protocol"
    * Communication baud rate is 19200
    * The message to switch to channel 1 is SW1\r\nG01gA
    * The message to switch to channel 2 is SW2\r\nG02gA
    * The message to switch to channel 3 is SW3\r\nG03gA
    * The message to switch to channel 4 is SW4\r\nG04gA
    * The message to switch to channel 5 is SW5\r\nG05gA
    * The message to switch to channel 6 is SW6\r\nG06gA
    * The message to switch to channel 7 is SW7\r\nG07gA
    * The message to switch to channel 8 is SW8\r\nG08gA
    * The message returned by the switch for the current channel is: G01gA, G02gA, G03gA, G04gA, G05gA, G06gA, G07gA, G08gA
:::

## Software configuration

After wiring, open **Settings → KVM Switch** to select device, control port and channels. Verify that HDMI, USB and power actions refer to the same computer. See [Multi-computer switching](../peripheral-devices/kvm-switch.md).

Current BliKVM software does not require PiKVM YAML or old-service restarts. Do not infer a fixed control port from USB insertion order.

## **Connection Reference**
![connect](/assets/images/Product-Datasheet-BliSwitch-v2.assets/connect.png)

## **Dimensions**

![Dimensions](/assets/images/Product-Datasheet-BliSwitch-v2.assets/Dimensions.png)


## **Shipping List**

| Product                  | Quantity | Remarks |
|-------------------------| -------- | ------- |
| BliSwitch v4 switcher   | 1        |         |
| Mounting ears           | 2        |         |
| ATX cable male end      | 8        |         |
| ATX cable female end    | 8        |         |
| Full-height PCIe bracket| 8        |         |
| Half-height PCIe bracket| 8        |         |
| ATX board               | 8        |         |
| Control cable           | 1        |         |
| USB cable               | 1        |         |
| Rubber pads             | 4        |         |
| M2.5x5 countersunk screws | 10     |         |

![Dimensions](/assets/images/Product-Datasheet-BliSwitch-v2.assets/packlist-removebg-preview.png)

## **Buy link**

[Buy Bliswitch v2](https://www.aliexpress.com/item/1005008024603865.html)

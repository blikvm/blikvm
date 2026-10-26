# BliSwitch v2

## 8口KVM+ATX切换器


![main](/assets/images/Product-Datasheet-BliSwitch-v2.assets/front.png)
![main](/assets/images/Product-Datasheet-BliSwitch-v2.assets/back.png)

BliSwitch v2是一款8通道KVM+ATX切换器，使8台主机共享一套键盘、鼠标和HDMI屏幕，且实现对8台主机的开关机控制。
BliSwitch v2可以独立工作，如果需要远程通过IP通知切换，它需要搭配BliKVM或者其它KVM。

![main](/assets/images/Product-Datasheet-BliSwitch-v2.assets/main.png)

:::info "BliSwitchv2 介绍视频"
    <iframe style={{width: '100%', maxWidth: '100%', aspectRatio: '16 / 9', height: 'auto'}} src="//player.bilibili.com/player.html?isOutside=true&aid=114246314688652&bvid=BV1CnZYYDECA&cid=29136127131&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
:::

:::warning "BliSwitch v2供电逻辑"
    v2出了供电端口外，也会由与被控PC连接的USB供电，具体哪个端口供电，取决于哪个端口的电压高。当v2与KVM配合时，如果发现KVM工作异常，譬如在切换时KVM可能会重启，或者外接的键盘工作失灵，那说明你的某台被控PC在给KVM供电，为了杜绝此问题，需要在KVM的USB-PC口增加一个[USB分电板](/zh-CN/docs/accessories/usb-splitter-guide).
:::

## **功能特点**
* **每个端口支持ATX（支持按键和远程控制）**
* **通过Web界面实现全面控制**
* **兼容BliKVM V1、V2、V3、V4以及PikVM硬件**


## **端口定义**

![Interface](/assets/images/Product-Datasheet-BliSwitch-v2.assets/interface-en.png)

## **产品参数**

| 品牌     | BLI                                             |
| -------- | ----------------------------------------------- |
| 品名     | 8口KVM+ATX切换器                                |
| 型号     | BliSwitch v2                                    |
| 功能     | 八台主机共享一套键鼠和显示器，8台主机开关机控制 |
| 材质     | 全金属                                          |
| 分辨率   | 1080P60Hz                                       |
| 切换方式 | 按键切换 或 USB控制模块切换                     |
| 供电     | 5V1A                                            |

## 控制协议
:::info "若您希望将blicube的switch用在其它平台上，请参考下面的协议"
    * 通信波特率为19200
    * 切换到1通道发送给switch的消息为SW1\r\nG01gA
    * 切换到2通道发送给switch的消息为SW2\r\nG02gA
    * 切换到3通道发送给switch的消息为SW3\r\nG03gA
    * 切换到4通道发送给switch的消息为SW4\r\nG04gA
    * 切换到1通道发送给switch的消息为SW5\r\nG05gA
    * 切换到2通道发送给switch的消息为SW6\r\nG06gA
    * 切换到3通道发送给switch的消息为SW7\r\nG07gA
    * 切换到4通道发送给switch的消息为SW8\r\nG08gA
    * switch返回当前所在通道消息为:G01gA,G02gA,G03gA,G04gA,G05gA,G06gA,G07gA,G08gA
:::

## 软件配置

接线后在**设置 → KVM 切换**中选择设备、控制端口和通道，再验证 HDMI、USB 与电源动作是否对应同一电脑。完整流程见[多主机切换](../peripheral-devices/kvm-switch.md)。

当前软件无需写入 PiKVM YAML 或重启旧服务，不能根据 USB 插入顺序固定猜测控制端口。

## **连接参考**
![connect](/assets/images/Product-Datasheet-BliSwitch-v2.assets/connect.png)

## **尺寸**

![Dimensions](/assets/images/Product-Datasheet-BliSwitch-v2.assets/Dimensions.png)


## **发货清单**

| 产品                     | 数量 |备注｜
|-------------------------| ---- |---|
| BliSwitch v4切换器 | 1    ||
| 挂耳                | 2    ||
| ATX线 公头         | 8   | |
| ATX线 母头         | 8    | |
| 全高PCIe挡板        | 8    | |
| 半高PCIe挡板        | 8    | |
| ATX板              | 8    | |
| 控制线              | 1    | |
| USB线         | 1    | |
| 胶垫         | 4    | |
| M2.5x5 沉头螺钉 | 10    | |

![Dimensions](/assets/images/Product-Datasheet-BliSwitch-v2.assets/packlist-removebg-preview.png)

## **购买链接**

[淘宝链接](https://item.taobao.com/item.htm?id=844629346441)

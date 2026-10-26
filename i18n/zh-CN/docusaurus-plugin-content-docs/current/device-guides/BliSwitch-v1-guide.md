# BliSwitch v1

## 4端口KVM切换器

:::tip "BliKVM-Switch-V1.0实际使用和测试视频，支持BliKVM和PiKVM"
    <iframe style={{width: '100%', maxWidth: '100%', aspectRatio: '16 / 9', height: 'auto'}} width="560" height="315" src="//player.bilibili.com/player.html?aid=349888644&bvid=BV16R4y1m7Pt&cid=955481186&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
:::

## **简介**
BliKVM-Switch-V1.0为四通道HDMI+USB切换器，支持机器按键切换，桌面控制器切换，KVM远程切换，3种切换模式。切换器本身最高支持4K@60HZ的输入，即插即用，免驱动。  
BliKVM-Switch-V1.0使用和XH-HK4401相同的硬件方案,AG7210 HDMI切换芯片最高支持到4K@60Hz，CH444G USB切换芯片支持USB2.0。不同的是BliKVM-Switch-V1.0配备有KVM USB cable,可以通过KVM USB cable连接BliKVM-Switch-V1.0,实现对KVM端口的选择。
BliSwitch v1可以独立工作，如果需要远程通过IP通知切换，它需要搭配BliKVM或者其它KVM。BliKVM-Switch-V1.0适配BliKVM和PiKVM。

:::tip "注意事项"
    * switch可以直接从输入电脑的USB取电，即一般不需要给switch供电，即可正常工作；
    * 若被控电脑的USB供电无法使switch工作，可以对switch进行单独供电使用；
    * switch套装只提供了USB电源线，并没有提供电源适配器，需要客户自行配置电源适配器（5V）；
    * **桌面控制器**可以通过USB电缆控制切换，对于不使用KVM的客户，当您在设备旁边时，这是除使用switch设备上按钮切换之外的另一种切换方式；
    * HDMI输入最高支持**4096x2160/60Hz**；
    * 4K 60Hz的HDMI输入, 功率大概是200mW;
:::

## **接口示意图**

:::warning "这里需要两根USB线，连接switch和kvm硬件，一根用于传输控制切换通道信息，一根用于传输鼠标键盘数据，具体连接可以参考面说明。"
:::

:::info "正面和反面接口示意图，右侧图中的control接口即为远程控制接口, 一头为USB-A，另一头为micro usb并且标签带有kvm字样的线，为控制线，其中micro usb口与switch的control接口连接，USB-A接口与KVM的USB口连接。"
    ![en1](/assets/images/switch/interface-en1.png)
    BliKVM v4 连接 switch 示意图:
    ![](/assets/images/switch/BliSwitch-v1-BliKVM-v4.png)
:::

:::info "侧面接口示意图"
    ![en2](/assets/images/switch/interface-en2.png)
:::

:::info "设备连接示意图"
    ![en3](/assets/images/switch/interface-en3.png)
:::



## 软件配置

接线后在**设置 → KVM 切换**中选择设备、控制端口和通道，再验证 HDMI、USB 与电源动作是否对应同一电脑。完整流程见[多主机切换](../peripheral-devices/kvm-switch.md)。

当前软件无需写入 PiKVM YAML 或重启旧服务，不能根据 USB 插入顺序固定猜测控制端口。

## **控制协议**

:::info "若您希望将blicube的switch用在其它平台上，请参考下面的协议"
    * 通信波特率为19200
    * 切换到1通道发送给switch的消息为**SW1\r\nG01gA**
    * 切换到2通道发送给switch的消息为**SW2\r\nG02gA**
    * 切换到3通道发送给switch的消息为**SW3\r\nG03gA**
    * 切换到4通道发送给switch的消息为**SW4\r\nG04gA**
    * switch返回当前所在通道消息为:**G01gA**,**G02gA**,**G03gA**,**G04gA**
:::


## **发货清单**

| 产品                     | 数量 |备注｜
|-------------------------| ---- |---|
| KVM Switch切换器（4通道)  | 1    |110mm * 60mm * 33mm|
| USB桌面控制器             | 1    ||
| USB数据线                | 4    |长度: 1.2m|
| HDMI（标准接头）线         | 4   |长度: 1.5m|
| USB电源线                 | 1    |长度: 0.8m|
| KVM USB线                 | 1    |长度: 1.5m|
| USB桌面控制线              | 1    |长度: 1m|

## **购买链接**

[淘宝链接](https://item.taobao.com/item.htm?id=698047414626)



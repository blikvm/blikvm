<h1 align="center">BliKVM - 开源软硬件一体KVM解决方案</h1>
<p align="center">
<a href="README.md">English Documents</a>
</p>
<p align="center">
  <a href="https://www.blicube.com">BliKVM</a> 是一款开源软件的KVM专业设备，目前有4个版本，v1 CM4, v2 PCIe, v3 HAT, v4 Allwinner。该设备在于帮助用户通过得到控制设备的HDMI
画面和鼠标键盘，去远程管理服务器、工作站或个人PC等。 无论目标设备的操作系统是否能正常运行，可以通过BLIKVM解决目标设备的一切问题。如：配置BIOS系统，通过使用远程CD-ROM或者闪存驱动器给目标设备重新安装操作系统。和基于软件的远程管理方式不同，你无需在被控电脑安装任何软件，做到无侵入式控制。
</p>

<p align="center">
  <a href="https://github.com/ThomasVon2021/blikvm/stargazers">
    <img alt="GitHub Stars" src="https://img.shields.io/github/stars/ThomasVon2021/blikvm?color=ffcb2f&label=%E2%AD%90%20on%20GitHub">
  </a>
  <a href="https://discord.gg/9Y374gUF6C">
    <img alt="Discord Server" src="https://img.shields.io/discord/943534043515977768?color=0&label=discord%20server&logo=discord">
  </a>
  <a href="https://qm.qq.com/q/V0qWcbNoIi">
    <img alt="QQ Group" src="https://img.shields.io/badge/QQ%E7%BE%A4-join-12B7F5?logo=tencentqq">
  </a>
</p>

![](/images/hardware-connect.png)
## 概览

| __中文界面__ | __英文界面__ |
|--------------------------------------------|-------------------------------------------|
| ![chinese](/images/web/web-chinese.png) | ![PCB - Back](/images/web/web-english.png) |


## 功能特点

- **视频捕获**（HDMI/DVI/VGA）
- **键盘转发**
- **鼠标转发**
- **虚拟U盘（重装系统）**
- **ATX** 使用 ATX 功能控制服务器电源
- Wake-on-LAN(远程唤醒)
- **全屏模式**
- 通过 **Web UI** 访问
- 支持 **多语言** 切换
- 对 Pi 进行 **健康监控**
- PWM **风扇** 控制器
- 支持 **PoE**
- **串口** 控制台端口
- **I2C** 显示器连接器
- **实时时钟（RTC）**

## 支持

- 查看 [文档](https://wiki.blicube.com/blikvm/)！
- 加入 [Discord 社区聊天](https://discord.gg/9Y374gUF6C) 获取新闻、提问和支持！如果是中国用户，可以加入[飞书](https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=ebfgce4a-deb3-4275-a337-cce905ebe2fb)。
- 下载 [BLIKVM OS](https://wiki.blicube.com/blikvm/en/flashing_os/)。

## 购买

- [购买 - BliKVM CM4 v1 版本](https://www.aliexpress.com/item/1005003262886521.html)
- [购买 - BliKVM PCIe v2 版本](https://www.aliexpress.com/item/1005004572837650.html)
- [购买 - BliKVM HAT v3 版本](https://www.aliexpress.com/item/1005004377930400.html)
- [购买 - BliKVM Allwinner v4 版本](https://www.aliexpress.com/item/3256805673100994.html)

## 其他购买链接

- [购买 - PiKVM ATX 电源适配器](https://www.aliexpress.com/item/1005003761450893.html)
- [购买 - PiKVM USB 分配器](https://www.aliexpress.com/item/1005003793429781.html)
- [购买 - PiKVM HDMI 转 CSI 板](https://www.aliexpress.com/item/1005002861310912.html)

## 视频

- [CM4 版本评测（由 `Geerling Engineering` 提供）](https://www.youtube.com/watch?v=3OPd7svT3bE) 
- [PCIe 版本评测（由 `Geerling Engineering` 提供）](https://www.youtube.com/watch?v=cVWF3u-y-Zg)
- [CM4 版本评测（由 `Geerling Engineering` 提供）](https://www.youtube.com/watch?v=3OPd7svT3bE) 
- [PCIe 版本评测（由 `Geerling Engineering` 提供）](https://www.youtube.com/watch?v=cVWF3u-y-Zg) 
- [CM4 版本功能概览](https://www.youtube.com/watch?v=aehOawHklGE)
- [CM4 版本开箱](https://www.youtube.com/watch?v=d7I9l5yG5M8)

## 硬件版本

![图片标题](/images/version_all.png)

## 开发者
前后端分离的软件架构：
![](/images/docs_image/arch.drawio.png)
更多详情请查看 [dev-readme](dev-readme.md) 文件。

## 参与贡献
我们欢迎来自社区的贡献！无论是改进固件、添加新功能，还是完善文档，您的建议和改动都非常宝贵。

## 报告 Bug 和提出新功能请求
  如果您在使用项目时遇到问题、发现了 bug，或者您有新的功能请求或改进建议，请提出问题。我们欢迎您的建议，因为它们有助于我们不断改进项目，满足更多用户的需求。

## 捐赠
该项目由开源爱好者开发。如果您认为 BliKVM 对您有用，或者它曾帮助您避免不必要的服务器故障巡检，您可以通过 [Patreon](https://www.patreon.com/blikvm) 或 [Paypal](https://www.paypal.me/blikvm) 支持我们，或者购买我们的设备。这些资金将用于购买新的硬件（树莓派板和其他组件），以测试和维护各种配置的 BliKVM，并且通常将更多时间投入到该项目中。本页面底部列出了所有通过捐赠帮助项目发展的人的名字。我们由衷感谢您的支持！

如果您希望在生产中使用 BliKVM，我们接受修改以满足您需求或实现您所需的自定义功能的订单。通过 [在线聊天](https://discord.gg/9Y374gUF6C) 或电子邮件联系我们：info@blicube.com。

## 致谢

BliKVM 项目离不开许多开源项目的卓越和慷慨贡献，
其中最值得一提的包括：

- [PiKVM](https://github.com/pikvm/pikvm)
- [TinyPilot](https://github.com/tiny-pilot/tinypilot)


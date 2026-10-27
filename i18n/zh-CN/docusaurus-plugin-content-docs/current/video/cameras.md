# 外接摄像头与浏览器摄像头转发

两种摄像头方向不同，均独立于电脑 HDMI 画面。

[![浏览器摄像头转发设置](/assets/images/software-current-zh/camera-zh-detail.png)](/assets/images/software-current-zh/camera-zh.png)

*Demo 截图：仅展示界面和模拟状态，未执行设备配置、摄像头授权或通道切换。点击可查看完整原图。*

## 查看接在 BliKVM 上的 USB 摄像头

入口：**设置 → 视频与摄像头 → 外接 USB 摄像头**。

1. 将支持的摄像头接到 BliKVM USB 主机端。
2. 使用自动检测，必要时刷新设备；手动设备路径仅供了解设备节点的管理员使用。
3. 打开流，确认预览，再按需关闭。账号需要摄像头观看权限。

设备可识别不等于其输出编码受支持；出现未识别或不支持编码时，核对硬件与系统支持，不要直接修改 HDMI 输入节点。

## 将管理电脑摄像头提供给被控电脑

### 视频说明

<iframe
  src="https://player.bilibili.com/player.html?isOutside=true&aid=117512016497527&bvid=BV1XmxT6CEhq&cid=43095425735&p=1"
  title="BliKVM UVC 摄像头转发视频说明"
  style={{width: '100%', aspectRatio: '16 / 9', height: 'auto', border: 0, display: 'block'}}
  scrolling="no"
  loading="lazy"
  allowFullScreen
></iframe>

[在哔哩哔哩打开视频](https://www.bilibili.com/video/BV1XmxT6CEhq/)。

### 操作步骤

入口：**设置 → 视频与摄像头 → 浏览器摄像头转发**。

1. 在[自定义 USB 功能](../peripheral-devices/usb.md)中启用 UVC 类别，检查端点预算并等待重枚举。
2. 通过可信 HTTPS 打开页面，使用有摄像头发送权限的账号，允许浏览器摄像头授权。
3. 打开摄像头，再启用写入 USB UVC。管理员可按页面选择 UVC 档位。
4. 在被控电脑的相机或会议程序中选择对应 USB 摄像头，确认画面。
5. 结束后停止转发并关闭摄像头。

当前提供 720p30、480p30、480p15 等档位，实际以设备选项为准。同一时刻只允许一个浏览器发布者；切换 USB 档位可能重连键鼠等复合设备。此路径接收浏览器 H.264/WebRTC，再由原生服务转换为 USB UVC MJPEG，不要求独立的旧版转码脚本。

摄像头画面和隐私授权需在管理电脑与被控电脑两端分别核对。Demo 截图只展示设置入口，不证明实际相机已转发。

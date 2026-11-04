---
title: WebRTC 集成示例
---

这个精简示例展示如何接收 BliKVM 的画面、声音，并控制被控电脑的键盘和鼠标。页面支持中英文切换，无前端框架，也不需要安装 npm 依赖。

**源码仓库：**[blikvm/blikvm-web-client](https://github.com/blikvm/blikvm-web-client)。仓库现为原生 WebRTC 精简示例，旧版 Vue／Janus 客户端保留在 Git 历史中。

## 快速运行

设备固件须提供 `/api/v1/stream/webrtc/signaling`。本示例已在 RV1126B **3.0.3** 固件上验证，浏览器接收并解码 **1920×1080、约 60 fps 的 H.264**。其它平台和输入时序以设备能力为准，不代表所有平台都支持 1080p60。

```sh
git clone https://github.com/blikvm/blikvm-web-client.git
cd blikvm-web-client
python3 serve.py --device DEVICE_IP --ca-cert /path/to/trusted-device.crt --port 10027
```

通过可信渠道从自己的设备取得 HTTPS 证书。本地代理会验证该证书，请不要改为跳过 TLS 校验。此运行方式需要 Python 3。

1. 打开 `http://127.0.0.1:10027/`，选择简体中文或 English。
2. 使用现有设备账号登录，再点击“连接视频”。
3. 声音默认静音，勾选“开启声音”后收听。
4. HID 握手完成后，勾选“启用键鼠”并聚焦画面即可操作。设备鼠标模式应为绝对模式或双模式。
5. 点击“断开”关闭媒体和输入；重连会创建新会话。

简化登录表单不实现二次验证。对于启用 2FA 的账号，应将示例与设备 API 同源部署，并先通过设备正常登录流程完成验证。

## 使用的接口

| 接口或通道 | 用途 |
| --- | --- |
| `POST /api/v1/auth/login` | 建立 HttpOnly 浏览器会话 Cookie |
| `OPTIONS /api/v1/stream/webrtc/signaling` | 从 Link 响应头取得 STUN／TURN 配置 |
| `GET /api/v1/stream/webrtc/signaling` 升级为 WebSocket | 交换 SDP、ICE 与心跳 |
| WebRTC 媒体轨道 | 主画面 H.264 与 Opus 音频 |
| WebRTC `hidrpc` DataChannel | 键盘鼠标报文 |

信令地址和 HID 报文格式与 BliKVM 自带 Web 客户端一致。为了便于阅读，示例将输入放在一个可靠有序通道中；完整客户端另有用于高频鼠标移动的不可靠通道。示例不包含终端、API RPC、虚拟媒体或电源控制。

第一个 SDP Offer 通过 `data.codec: "h264"` 指定编码。远端 SDP Answer 设置完成前，应缓存收到的 ICE 候选。连接期间保持信令打开，每 20 秒发送 `ping`，退出时关闭 WebSocket 和 PeerConnection。画面本身通过 WebRTC 媒体通道传输。

## 鉴权和权限

画面需要 `kvm.view`，声音需要 `audio.listen`，控制需要 `kvm.input`。建立视频连接不会自动获得输入权限；只有收到 HID 握手确认，页面才允许开启控制。

浏览器 WebSocket 无法自定义 Authorization 请求头，应使用同源会话 Cookie。服务端客户端可在握手的 Authorization 头中携带 API Token。不要将令牌写入 URL 或前端源码。

生产集成应使用与设备 API 同源的 HTTPS，或经过鉴权的网关。附带代理仅用于本地开发，绑定到回环地址，不作为公网服务。直接以 `file://` 打开页面，或从任意第三方站点直接跨域调用设备，不属于本示例支持的部署方式。

## 输入行为和边界

鼠标坐标按画面实际内容区域计算，排除等比例缩放产生的黑边。键盘使用物理 `KeyboardEvent.code`，支持修饰键和最多六个普通键同时按下，包括 Ctrl+A+S。失焦、隐藏页面、关闭控制或断开连接时，会释放已按下的键和鼠标按钮。

输入法组合文本、剪贴板粘贴，以及被浏览器或操作系统保留的快捷键不在本示例范围内。HID 报文发送成功，也不等于被控应用已完成对应操作。

## 文件结构和相关文档

- `index.html`、`app.js`、`i18n.js`：中英文页面。
- `receiver.js`：媒体接收、SDP／ICE 和连接生命周期。
- `hid.js`：输入报文、坐标转换和释放处理。
- `serve.py`：可选的 Python 本地代理。
- `hid.test.mjs`：输入回归测试，运行 `node hid.test.mjs`。

完整设备契约见 [OpenAPI](./api.mdx)，物理键名见[键码参考](./keyboard-api.md)。示例仓库的中英文 README 还提供运行方式和 HID 报文布局。

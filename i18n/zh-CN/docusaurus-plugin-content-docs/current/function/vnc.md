# VNC 服务

使用兼容的 VNC 客户端查看被控电脑的 HDMI 画面，并通过 USB 操作键盘和鼠标。
被控电脑无需安装 VNC 代理程序。

入口为 **设置 → 高级与诊断 → VNC 服务**。本文对应 **App 3.0.3-dev.16**
验证过的界面；各型号的可用版本以所选 Release 说明为准，旧 App 可能没有此入口。

## 启用服务

1. 在 BliKVM 视频设置中选择 **H.264**，并确认 HDMI 画面正常。
2. 打开 **VNC 服务**，启用 VNC，选择未占用的 TCP 端口，点击 **保存并应用**。
3. 确认服务运行中。默认端口为 **5900**。
4. 使用设备地址和自己的**网页账号**连接。VNC 默认关闭，保存此配置不会重启
   App 或网页视频服务。

VNC 和网页共用一路 H.264 硬件编码。两边同时观看时，BliKVM 会分别发送编码后的
视频，增加出站流量。只有客户端接入时，VNC 才订阅视频。停止读取数据的 VNC 连接
可独立超时，网页可以继续播放。关闭 VNC 会结束其现有连接。

## 兼容的 VNC 客户端 {#客户端与连接参数}

客户端必须支持 **Open H.264 编码（50）** 和 **VeNCrypt X509Plain**。
请核对对应操作系统的具体发行包。

| 平台 | 客户端 | BliKVM 验证情况 |
| --- | --- | --- |
| macOS | [DeskVNC Viewer 0.35.3（通用 DMG）](https://github.com/psmux/DeskVNC/releases/download/v0.35.3/DeskVNCViewer_0.35.3_universal.dmg) | 已在 Intel Mac 上连接 BliKVM v4，验证画面和键鼠。安装包也包含 Apple Silicon 版本。 |
| Linux | 启用 FFmpeg H.264 支持的 [TigerVNC 1.14.1](https://github.com/TigerVNC/tigervnc/releases/tag/v1.14.1) | 已在 BliKVM v4 上验证实时画面。请选用包含 H.264 的发行包或构建版本。 |
| Windows x64 | [TigerVNC Viewer 1.16.2（独立 EXE）](https://sourceforge.net/projects/tigervnc/files/stable/1.16.2/vncviewer64-1.16.2.exe/download) | 已检查该发行包，包含 Open H.264 和 X509Plain。这个 Windows 版本尚未实连 BliKVM。 |

在 DeskVNC 的连接栏输入设备地址和端口（例如 `kvm.example.com:5900`），再使用
BliKVM 网页账号登录。在 TigerVNC 中，如果有编码选项，请选择 **H.264**。

官方 **TigerVNC 1.16.2 macOS DMG** 缺少 Open H.264。实测 **RealVNC Viewer
6.21.118** 无法协商所需的认证方式。iOS 和 iPadOS 可使用 BliKVM 网页界面，
这两个平台的原生 VNC 客户端兼容性尚未验证。

### TigerVNC 命令行示例

如果设备证书对 `kvm.example.com` 有效，可使用：

```sh
vncviewer -SecurityTypes X509Plain -AutoSelect=0 -PreferredEncoding=H264 kvm.example.com::5900
```

请替换为实际的设备域名与端口。TigerVNC 的 `::5900` 表示 TCP 端口，和 `:0`
这样的显示编号不同。在客户端登录窗口中输入网页用户名和密码。使用自建 CA 时，
可能还需要通过客户端的 `-X509CA` 参数指定 CA 证书。

## TLS 证书与 SSH 隧道

VNC 强制使用 TLS，并沿用设备的 HTTPS 证书。请在客户端核验设备身份。
直接连接应使用受信任且名称与连接地址匹配的证书，参见[HTTPS 与证书](../network/https.md)。

出厂证书可能只包含回环地址名称，没有包含 DHCP 分配的设备 IP。
此时可通过 SSH 隧道连接回环地址。先通过可信渠道核对设备 SSH 主机指纹，
再通过已认证的 SSH 连接导出**公钥证书**：

```sh
ssh root@device-address 'cat /data/vault/tls/server.crt' > device.crt
ssh -N -L 15900:127.0.0.1:5900 root@device-address
```

保持隧道开启，在另一个终端中运行：

```sh
vncviewer -SecurityTypes X509Plain -X509CA ./device.crt -AutoSelect=0 -PreferredEncoding=H264 localhost::15900
```

如果实际 SSH 系统账号不是 `root`，请替换账号；SSH 与网页账号分别管理。
此示例要求证书包含 `localhost`。核对证书，如果与已确认的设备身份不一致，请停止连接。
私钥应留在设备上，连接配置不需要关闭证书校验。

## 账号与权限

- **查看者**：观看画面。
- **操作员／管理员**：在设备权限与 USB 功能允许的范围内操作键鼠。
- **设备配置权限**：在网页中配置 VNC 服务。

即使关闭了网页界面鉴权，VNC 仍要求真实、已启用的网页账号。
账号、密码或权限变更会撤销受影响的会话。没有单独的八字符 VNC 密码。
需要双重验证码的账号无法通过 X509Plain 登录；此类账号请继续使用网页界面。

最多允许**两个 VNC 连接**，包括正在登录的连接。VNC 与网页用户共用输入，
操作前请协调。

## 配置保存与当前限制

启用状态和端口在 App 重启及正常升级后保留；恢复出厂设置后回到默认关闭状态。
可通过 UI，或受保护的 `GET /api/v1/vnc`、`PUT /api/v1/vnc` 管理；
设备 `/docs` 和 `/openapi.yaml` 提供具体接口参数。

当前实现支持 H.264 视频与键鼠控制，不提供 raw/JPEG 回退、H.265、VNC 音频、
剪贴板粘贴或虚拟介质传输。音频、虚拟介质等功能继续使用网页工具。
VNC 不会自动切换视频模式；绝对／相对鼠标配置仍由原有键鼠设置统一管理。

## 排查问题

| 现象 | 检查内容 |
| --- | --- |
| 没有 VNC 入口 | App 版本、所选 Release 的功能说明及设备配置权限。 |
| 服务无法启动 | TCP 端口是否占用、HTTPS 证书与私钥是否有效且可读，以及页面错误。修复后重新保存。 |
| 登录后客户端断开 | 客户端发行包的 H.264 支持、设备视频模式、HDMI 信号及两个连接的上限。 |
| 登录被拒绝 | 网页用户名／密码、账号启用状态、权限和双重验证策略。API Token 不是 VNC 密码。 |
| 证书警告 | 设备身份、证书名称和 CA 信任。名称不匹配与密码错误是不同的问题。 |
| 有画面但键鼠无效 | 账号输入权限、USB 键鼠功能、USB 数据线及被控电脑的 USB 状态。 |
| 外部网络连不上端口 | 设备地址、VPN 路由和防火墙策略。VNC 开关不会创建路由器映射，参见[远程接入](../network/internet-access/overview.md)。 |

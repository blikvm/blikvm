// Each feature links to the guide that describes its setup and requirements.
export const featureGroups = [
  {
    id: 'console',
    title: ['远程控制台', 'Remote console'],
    features: [
      ['浏览器远程控制', 'Browser remote control', '通过 HDMI 查看被控电脑，包括 BIOS 和启动画面。', 'View the target over HDMI, including BIOS and boot screens.', 'getting-started/web-interface'],
      ['USB 键鼠', 'USB keyboard and mouse', '通过 USB HID 操作被控电脑，支持屏幕键盘和键鼠转发。', 'Control the target through USB HID using keyboard and mouse forwarding or the on-screen keyboard.', 'peripheral-devices/keyboard-mouse/hid-passthrough'],
      ['鼠标模式与防休眠', 'Mouse modes and jiggler', '按操作场景选择鼠标模式，或使用鼠标微动保持活动。', 'Choose a mouse mode or use the mouse jiggler to keep the target active.', 'peripheral-devices/keyboard-mouse/mouse-jiggler'],
      ['组合键与宏', 'Shortcuts and macros', '发送快捷键或运行配置好的按键序列。', 'Send shortcuts or run a configured key sequence.', 'peripheral-devices/keyboard-mouse/shortcuts'],
      ['文本输入与 OCR', 'Text input and OCR', '通过模拟键盘输入文本，或识别画面中选定区域的文字。', 'Type text through keyboard emulation or recognize text in a selected region of the screen.', 'peripheral-devices/paste-ocr'],
      ['界面偏好', 'Interface preferences', '调整控制台主题、语言和界面偏好。', 'Adjust console theme, language, and interface preferences.', 'function/interface-preferences'],
    ],
  },
  {
    id: 'media',
    title: ['画面、音频与摄像头', 'Video, audio, and cameras'],
    features: [
      ['HDMI 视频与串流', 'HDMI video and streaming', '按设备和浏览器支持选择 H.264 / H.265 WebRTC 或 MJPEG。', 'Choose H.264 or H.265 over WebRTC, or MJPEG, where supported by the device and browser.', 'video/video-modes'],
      ['截图与录制', 'Screenshots and recording', '保存远程画面截图，或使用浏览器支持的录制功能。', 'Save a remote frame or record using supported browser functionality.', 'video/video-modes'],
      ['EDID', 'EDID', '在支持的设备上管理 HDMI 输入向电脑声明的显示模式。', 'Manage the display modes advertised to the computer on supported devices.', 'video/edid'],
      ['HDMI 环出', 'HDMI passthrough', '带 HDMI 输出的硬件可连接本地显示器，软件控制取决于平台。', 'Connect a local monitor on hardware with HDMI output. Software controls vary by platform.', 'video/hdmi-passthrough'],
      ['远程音频与模拟麦克风', 'Remote audio and microphone emulation', '在浏览器收听被控电脑声音，或将管理端麦克风转发成被控端的 USB 麦克风。', 'Listen to target audio or forward the management microphone as a USB microphone on the target.', 'peripheral-devices/two-way-audio'],
      ['第二路 USB 摄像头', 'Secondary USB camera', '通过 BliKVM 的 USB 主机口接入兼容摄像头，查看独立于 HDMI 的画面。', 'Connect a compatible camera to the BliKVM USB host port for a feed separate from HDMI.', 'video/cameras'],
      ['UVC 摄像头转发', 'UVC camera forwarding', '将管理端摄像头转发为被控电脑识别的 USB 摄像头，需要相应 USB 功能和浏览器权限。', 'Present the management camera as a USB camera on the target, with supported USB functions and browser permissions.', 'video/cameras'],
      ['HDMI 分析与延迟检查', 'HDMI analysis and latency', '查看输入信号信息，排查采集与串流链路。', 'Inspect input signal information and troubleshoot capture and streaming.', 'video/latency'],
    ],
  },
  {
    id: 'recovery',
    title: ['装机、恢复与电源', 'Installation, recovery, and power'],
    features: [
      ['虚拟光驱与闪存盘', 'Virtual CD/DVD and flash drive', '挂载 ISO 启动安装或救援环境，或用虚拟闪存盘传文件。需要 USB 数据连接和存储功能。', 'Boot an installer or rescue image from ISO, or transfer files using a virtual flash drive. Requires USB data and storage support.', 'peripheral-devices/msd'],
      ['USB 功能配置', 'USB function configuration', '按设备支持启用键鼠、存储、麦克风和摄像头等 USB 类。', 'Enable supported USB classes such as keyboard, mouse, storage, microphone, and camera.', 'peripheral-devices/usb'],
      ['ATX 电源和复位', 'ATX power and reset', '通过兼容的 ATX 控制板和主板接线操作电源、复位并查看电源状态。', 'Use a compatible ATX board and motherboard wiring for power, reset, and status.', 'function/atx'],
      ['网络唤醒', 'Wake-on-LAN', '发送唤醒包。被控电脑的固件、网卡和网络需支持。', 'Send a wake packet to a target with compatible firmware, network adapter, and network.', 'function/wake-on-lan'],
      ['串口终端', 'Serial terminal', '在配置了兼容串口设备和接线的情况下打开终端。', 'Open a terminal with a compatible serial device and wiring.', 'function/serial-terminal'],
      ['多机切换', 'Multi-computer switching', '一台 BliKVM 搭配 BliSwitch v1 或 v2，可在最多 4 台或 8 台电脑之间切换 HDMI 和 USB。v2 接好 ATX 后支持逐台电源控制。', 'Switch HDMI and USB between up to 4 computers with BliSwitch v1 or 8 with v2. The v2 supports per-host power control with ATX wiring.', 'peripheral-devices/kvm-switch'],
    ],
  },
  {
    id: 'network',
    title: ['网络与远程访问', 'Networking and remote access'],
    features: [
      ['本地网络与固定 IP', 'LAN and static IP', '查看地址和配置固定 IP、网关与 DNS。', 'Inspect addresses and configure a static IP, gateway, and DNS.', 'network/static-ip'],
      ['Wi-Fi 与 v4 面板配网', 'Wi-Fi and v4 front-panel setup', '在有无线硬件和驱动的设备上配网。v4 面板配网需要相应系统镜像。', 'Connect supported wireless hardware. Front-panel setup on v4 requires a compatible system image.', 'network/wifi'],
      ['VPN 与组网', 'VPN and overlay networking', '按设备和部署条件使用 WireGuard、Tailscale 或 ZeroTier。', 'Use WireGuard, Tailscale, or ZeroTier as supported by your device and deployment.', 'network/internet-access/overview'],
      ['反向代理、隧道与云接入', 'Proxy, tunnel, and cloud access', '按部署选择远程入口，并分别验证登录、WebRTC 媒体链路和操作权限。', 'Choose a remote entry point and verify sign-in, the WebRTC media path, and permissions separately.', 'network/internet-access/overview'],
      ['动态 DNS', 'Dynamic DNS', '使用 DDNS 更新域名记录，适合公网地址会变化的部署。', 'Update DNS records when the deployment’s public address changes.', 'function/ddns-go'],
      ['VNC 服务', 'VNC service', '在支持的配置上用兼容的 VNC 客户端查看画面和操作键鼠。', 'View video and send input with a compatible VNC client on supported configurations.', 'function/vnc'],
    ],
  },
  {
    id: 'security',
    title: ['账号与安全', 'Accounts and security'],
    features: [
      ['账号、角色与权限', 'Accounts, roles, and permissions', '按管理员、操作员和查看者分配权限，可单独授权电源、媒体和输入等操作。', 'Assign administrator, operator, or viewer roles and grant specific actions such as power, media, and input.', 'getting-started/auth'],
      ['双因素认证', 'Two-factor authentication', '在账号设置中配置验证器应用。', 'Set up an authenticator app in account settings.', 'getting-started/auth'],
      ['HTTPS 与证书', 'HTTPS and certificates', '管理设备 HTTPS 证书，为浏览器和 API 客户端配置证书信任。', 'Manage the device’s HTTPS certificate and configure trust for browsers and API clients.', 'network/certificates'],
      ['IP 访问规则', 'IP access rules', '按来源地址限制访问。', 'Restrict access by source address.', 'network/security'],
    ],
  },
  {
    id: 'automation',
    title: ['开发与自动化', 'Development and automation'],
    features: [
      ['REST API 与 OpenAPI', 'REST API and OpenAPI', '查阅认证、请求参数和响应结构，集成设备操作。', 'Use the authentication, request, and response reference to integrate device operations.', 'development/api'],
      ['键盘 API 与 Keycode', 'Keyboard API and keycodes', '查阅按键编码，按用途选择单键、组合键或文本输入接口。', 'Look up keycodes and choose endpoints for single keys, combinations, or text input.', 'development/keyboard-api'],
      ['系统脚本', 'System scripts', '在支持的系统和 App 上管理手动任务、开机任务及常驻服务。脚本运行在 BliKVM 上。', 'Manage manual tasks, startup tasks, and resident services with a compatible system and app. Scripts run on BliKVM.', 'function/scripts'],
      ['Prometheus 指标', 'Prometheus metrics', '在诊断设置中启用监控指标，按 API 认证和权限配置采集端。', 'Enable metrics in diagnostics and configure the collector with the required API authentication and permissions.', 'function/diagnostics'],
    ],
  },
  {
    id: 'maintenance',
    title: ['升级与维护', 'Updates and maintenance'],
    features: [
      ['首次烧录与重装', 'First flash and reinstall', '按型号选择系统镜像，按手册烧录到相应的启动介质。', 'Choose an image for your model and follow the guide to flash the appropriate boot media.', 'getting-started/flashing-os'],
      ['App 更新与 A/B 系统更新', 'App updates and A/B system updates', '分别使用匹配平台的 App 包或 A/B 系统更新包。A/B 更新还需满足设备启动条件。', 'Use the matching app package or A/B system bundle. A/B updates also require compatible boot firmware and system support.', 'function/update'],
      ['设备信息、日志与诊断', 'Device information, logs, and diagnostics', '查看系统与 App 版本，查看实时日志或导出诊断资料。', 'Check system and app versions, view live logs, or export diagnostics.', 'function/diagnostics'],
      ['SSH 管理', 'SSH administration', '按设备系统与账号设置使用 SSH 进行维护。', 'Maintain the device over SSH according to system and account settings.', 'function/ssh'],
      ['恢复出厂设置', 'Factory reset', '按设备手册清除配置并重新初始化设备。', 'Clear configuration and reinitialize the device following the guide.', 'function/factory-reset'],
      ['设备屏幕与前面板', 'Device display and front panel', '在支持的型号上查看本地状态。v4 的面板操作见设备指南。', 'View local status on supported models. See the v4 guide for front-panel controls.', 'device-guides/BliKVM-v4-guide'],
    ],
  },
];

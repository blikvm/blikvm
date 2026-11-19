# IPMI、SoL 与 Redfish

这些服务管理直接连接到 BliKVM 的一台被控主机。在包含此页面的 App 版本中，用管理员账号打开**设置 → 设备维护 → IPMI 与 Redfish**。两个服务默认关闭，设置会自动保存。

电源操作通过主机的 [ATX 接线](./atx.md)执行。验证电源功能前，按设备说明连接适用的主板电源、复位和电源状态线。

## IPMI 电源控制与 SoL 串口

1. 填写 **IPMI 监听地址**。使用 BliKVM 自身在管理网络上的 IP。IPMI 在该地址的 UDP 623 端口监听。
2. 设置 **IPMI 用户名**和 **IPMI 密码**。用户名使用 1–16 个可打印 ASCII 字符，密码使用 12–20 个，均不能包含空格。在 IPMI 客户端中使用这组凭据。
3. 点击**启用 IPMI**。必填项缺失或无效时，页面会弹出提示，开关保持关闭。
4. 在管理电脑上执行以下命令，将示例地址和用户名替换为实际配置，并按提示输入 IPMI 密码。

```sh
ipmitool -I lanplus -C 17 -H 192.0.2.10 -U YOUR_IPMI_USER -a power status
```

要使用 SoL（Serial over LAN），先用匹配的适配器连接目标主机的[物理串口](./serial-terminal.md)。在**设置 → 设备维护 → 串口设置**中选择实际端口及匹配的波特率，并勾选**此串口连接的是目标设备，而非 KVM 本机系统控制台**。启用 IPMI 后，再点击**启用 SoL 串口控制台**。尚未配置目标串口、串口不可用或已分配给 KVM 切换器时，页面会弹出提示。

```sh
ipmitool -I lanplus -C 17 -H 192.0.2.10 -U YOUR_IPMI_USER -a sol activate
```

## Redfish 电源与本地镜像

点击**启用 Redfish**，使用 BliKVM 网页的 HTTPS 地址访问。HTTP Basic 认证使用拥有相应权限的 BliKVM 网页账号。开启双重认证的账号可使用带相应权限的 BliKVM API 令牌。

| 操作 | 请求 | 请求体或返回值 |
| --- | --- | --- |
| 获取服务入口 | `GET /redfish/v1/` | 服务链接 |
| 查询电源状态 | `GET /redfish/v1/Systems/0` | `PowerState` |
| 开机 | `POST /redfish/v1/Systems/0/Actions/ComputerSystem.Reset` | `{"ResetType":"On"}` |
| 查看挂载状态 | `GET /redfish/v1/Managers/BMC/VirtualMedia/MSD` | 当前虚拟介质状态 |
| 挂载已保存的镜像 | `POST /redfish/v1/Managers/BMC/VirtualMedia/MSD/Actions/VirtualMedia.InsertMedia` | `{"Image":"rescue.iso"}` |
| 弹出镜像 | `POST /redfish/v1/Managers/BMC/VirtualMedia/MSD/Actions/VirtualMedia.EjectMedia` | `{}` |

先将镜像上传至 BliKVM，再把文件名传给 `InsertMedia`。从链接直接挂载 ISO 时，请使用网页中的[虚拟介质](../peripheral-devices/msd.md#从链接直接挂载-iso)。

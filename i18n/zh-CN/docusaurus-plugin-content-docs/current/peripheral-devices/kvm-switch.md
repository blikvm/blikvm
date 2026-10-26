# 多主机 KVM 切换

入口：**设置 → KVM 切换**。需要受支持的外接切换器、控制线及 HDMI / USB 连接。切换器控制线与键鼠 USB 数据线不是同一用途。

[![KVM 切换设置](/assets/images/software-current-zh/switch-zh-detail.png)](/assets/images/software-current-zh/switch-zh.png)

*Demo 截图：仅展示界面和模拟状态，未执行设备配置、摄像头授权或通道切换。点击可查看完整原图。*

## 配置并切换

1. 按 [BliSwitch v1](../device-guides/BliSwitch-v1-guide.md) 或 [v2](../device-guides/BliSwitch-v2-guide.md) 的接口图连接。
2. 管理员在配置中选择匹配的设备类型、控制端口和通道信息，启用后读取当前状态。
3. 具有切换权限的用户选择目标通道，等待 HDMI / USB 重新连接。
4. 确认画面、键鼠和必要的 ATX 状态都对应同一台电脑，再执行操作。

通道名称只是标签，不会验证物理接线。切换期间可能短暂黑屏；请求成功不代表 USB 和 HDMI 都已稳定。若状态不符，刷新并核对控制端口、通道映射、线序及供电。

安装系统、挂载虚拟介质或发送强制电源动作前，先确认当前通道，避免影响另一台电脑。硬件支持的最高 HDMI 切换带宽，也不能直接当作 BliKVM 网络编码能力。

# BliKVM Python API 示例

[English](README.md) · 简体中文

Python 3.10+，仅使用标准库，无需 pip。运行在你的电脑上，不需要在 KVM 上安装 Python。
默认地址为 `https://192.168.8.173`；使用 `--url https://你的设备地址` 指定其他设备。

## 查询与截图

```bash
python3 blikvm_demo.py --insecure info
python3 blikvm_demo.py --insecure snapshot captures/screenshot.jpg
```

`--insecure` 跳过自签名证书检查，仅用于测试；有设备证书/CA 的 PEM 文件时，使用 `--ca-file device-ca.pem`。默认验证证书。
全局选项（`--url`、`--insecure` 等）必须放在子命令之前。

开启鉴权时，通过环境变量提供 Token，所属账号需要画面和键鼠权限：

```bash
read -r -s BLIKVM_TOKEN
export BLIKVM_TOKEN
```

执行 read 后粘贴 Token 并回车；不将 Token 写入源码或作为命令行参数。关闭鉴权时无需配置。

## 发送键鼠事件

以下命令会操作被控电脑，先确认画面中的目标。

```bash
# 绝对移动与点击：归一化坐标 0～1
python3 blikvm_demo.py --insecure move 0.5 0.5
python3 blikvm_demo.py --insecure click 0.5 0.5
python3 blikvm_demo.py --insecure click 0.5 0.5 --button right

# 根据 1920×1080 截图中的像素位置点击（从 0 开始）
python3 blikvm_demo.py --insecure click-pixel 480 270 --width 1920 --height 1080

# 单键、组合键：按下后自动松开
python3 blikvm_demo.py --insecure key Enter
python3 blikvm_demo.py --insecure key KeyA
python3 blikvm_demo.py --insecure shortcut ControlLeft KeyA

# 滚轮增量不是像素数，建议从 ±1 开始
python3 blikvm_demo.py --insecure wheel 0 1

# 相对移动：需要 relative/dual；程序不会自动修改配置
python3 blikvm_demo.py --insecure relative 24 -12
```

像素转换：`toX = x / (width - 1)`，`toY = y / (height - 1)`。使用完整被控截图的实际尺寸，不能包含网页工具栏或留白，也不要假设永远是 1080p。

## 完整演示

先截图 → 点击 → 等待 → 按键 → 等待 → 再截图：

```bash
python3 blikvm_demo.py --insecure demo \
  --x 0.5 --y 0.5 --key Enter --wait 1 --output-dir captures/demo
```

输出 before.jpg 和 after.jpg。此命令会点击和按 Enter，不含 AI/OCR，也不会自动判断结果。

## 作为 Python 模块使用

```python
from blikvm_demo import BliKVMClient

client = BliKVMClient("https://192.168.8.173", insecure=True)
# 开启鉴权时自动读取 BLIKVM_TOKEN，也可传 token=...
client.screenshot("captures/before.jpg")
client.click_pixel(480, 270, width=1920, height=1080)
client.shortcut("ControlLeft", "KeyA")
client.press("Escape")
client.screenshot("captures/after.jpg")
```

使用的接口：

| 操作 | API |
| --- | --- |
| 鉴权状态 | GET /api/v1/auth/state |
| 鼠标模式 | GET /api/v1/hid/mode |
| 截图 | GET /api/v1/video/snapshot |
| 单键、鼠标、滚轮 | POST /api/v1/hid/events |
| 组合键 | POST /api/v1/hid/shortcuts |

HTTP 成功表示设备接受/发送了操作，不保证目标软件完成任务。输入请求不自动重试，避免重复点击。当前 events API 不能可靠执行“按住鼠标再移动”的拖拽，因此没有提供拖拽命令。

绝对移动和带坐标点击会先检查鼠标模式，不符合时直接报错，不修改 USB Classes 或模式。相对位移和滚轮单次限制在 -127～127，实际效果仍受目标系统设置影响。

## 本地验证

```bash
python3 -m unittest -v test_demo.py
```

测试只使用本机临时 HTTP 服务，不发送设备键鼠事件。

# 键盘 API 与按键编码

集成键盘控制时，请使用本页列出的**按键编码字符串**。例如，字母 A 的物理按键是 `KeyA`，回车是 `Enter`，左 Ctrl 是 `ControlLeft`。

## 编码规则

- `key` 按 `KeyboardEvent.code` 风格命名，区分大小写。它不是浏览器旧的数字 `keyCode`、`KeyboardEvent.key` 字符值、ASCII 或 USB HID 数字 usage ID。不要传 `65`、`A`、`a` 或 `Ctrl`。
- 编码表示按键位置，最终字符由被控电脑的键盘布局、Shift、锁定键和输入法决定。`KeyA` 不保证输出大写 A；美式布局的大写 A 应发送 `ShiftLeft` + `KeyA`。
- 主键区 `Digit1` 和小键盘 `Numpad1` 不同，`Enter` 和 `NumpadEnter` 也不同。
- 下表仅列出当前后端支持的编码，不代表支持所有浏览器按键。`Fn`、媒体音量键、F13–F24 等不在当前支持清单中。`NonUSHash` 是后端使用的名称，不一定能从浏览器事件中直接取得；国际键需结合实际键盘布局验证。

使用前先阅读 [OpenAPI](./api.mdx)，在设备中创建具备相应键鼠控制权限的 API Token。以下示例假设 `BLIKVM_URL` 为设备 HTTPS 地址、`BLIKVM_API_TOKEN` 为 Token，且设备证书已受信任。请求会向被控电脑发送实际输入，请在文本编辑器中确认焦点后测试。

## 单键：轻按、按住与释放

`POST /api/v1/hid/events`，请求头为 `Content-Type: application/json` 和 `Authorization: Bearer …`。

| 操作 | JSON 请求体 | 行为 |
| --- | --- | --- |
| 轻按回车 | `{"type":"keyboard","key":"Enter"}` | 省略 state，按下后自动释放 |
| 按住左 Shift | `{"type":"keyboard","key":"ShiftLeft","state":true}` | 保持按下，调用方负责释放 |
| 释放 | `{"type":"keyboard","key":"ShiftLeft","state":false}` | 清空当前键盘按键状态，不只是释放指定键；key 仍须有效 |
| 按下并立即释放 | `{"type":"keyboard","key":"Enter","state":true,"finish":true}` | 等同一次轻按；finish 仅在 state=true 时起作用 |

```sh
curl --fail-with-body --show-error \
  --header "Authorization: Bearer $BLIKVM_API_TOKEN" \
  --header 'Content-Type: application/json' \
  --data '{"type":"keyboard","key":"Enter"}' \
  "$BLIKVM_URL/api/v1/hid/events"
```

**该接口每次设置的是完整的单键状态，不是增量追加。** 先按住 `ControlLeft`，再单独发送 `KeyC`，不会构成 Ctrl+C。轻按完成后也会清空键盘状态。组合键请使用下面的接口，避免多个客户端同时发送键盘输入。

`CapsLock`、`NumLock`、`ScrollLock` 作为轻按处理，即使 `state=true` 也不会持续按住。它们会切换被控电脑的锁定状态，不是“设为开启”指令；Num Lock 也会影响小键盘行为。

## 组合键：一次提交完整组合

`POST /api/v1/hid/shortcuts` 接收 `shortcuts` 字符串数组。数组是一组**同时按下**的键，随后自动全部释放；不是逐个键依次输入。

| 组合 | JSON 请求体 |
| --- | --- |
| Ctrl+C | `{"shortcuts":["ControlLeft","KeyC"]}` |
| Ctrl+V | `{"shortcuts":["ControlLeft","KeyV"]}` |
| Ctrl+Alt+Delete | `{"shortcuts":["ControlLeft","AltLeft","Delete"]}` |
| Alt+Tab | `{"shortcuts":["AltLeft","Tab"]}` |
| Windows+R | `{"shortcuts":["MetaLeft","KeyR"]}` |
| 大写 A（美式布局） | `{"shortcuts":["ShiftLeft","KeyA"]}` |

```sh
curl --fail-with-body --show-error \
  --header "Authorization: Bearer $BLIKVM_API_TOKEN" \
  --header 'Content-Type: application/json' \
  --data '{"shortcuts":["ControlLeft","KeyC"]}' \
  "$BLIKVM_URL/api/v1/hid/shortcuts"
```

当前键盘报告最多携带 **6 个非修饰键**，修饰键单独计位。不要把长文本作为一个 shortcuts 数组提交。Ctrl+V 触发的是被控电脑自己的剪贴板；它不会把调用方剪贴板内容传过去。文本输入请参阅 [粘贴与文本提取](../peripheral-devices/paste-ocr.md) 以及设备 OpenAPI 中的 paste 接口。

## 批量按键：依次执行多组输入

`POST /api/v1/hid/paste` 可以在一次请求中发送一段按键序列，无需为每个按键分别调用单键接口。虽然路径叫 paste，**请求体接收的是 sequence，不是 text 或 lang**；需要由调用方根据被控电脑的键盘布局将文本转换为按键组。

```json
{
  "delay": 35,
  "sequence": [
    ["KeyA"],
    ["KeyB"],
    ["ShiftLeft", "KeyC"],
    ["Enter"]
  ]
}
```

以上依次轻按 A、B、Shift+C 和回车。每个内层数组是一组同时按下的键；外层数组指定执行顺序。按美式布局解释字符，最终结果仍受 Caps Lock、输入法和焦点影响。

```sh
curl --fail-with-body --show-error \
  --header "Authorization: Bearer $BLIKVM_API_TOKEN" \
  --header 'Content-Type: application/json' \
  --data '{"delay":35,"sequence":[["KeyA"],["KeyB"],["ShiftLeft","KeyC"],["Enter"]]}' \
  "$BLIKVM_URL/api/v1/hid/paste"
```

- 每组按下后保持 delay 毫秒，全部释放，再间隔 delay 毫秒执行下一组；因此每组大约耗时 `2 × delay`，另加传输与处理时间。
- delay 必须为整数；省略时实际为 **5 ms**，小于 5 的值按 5 处理，大于 250 的值按 250 处理。需要重复按同一个键时使用多个组，例如 `[["KeyA"],["KeyA"]]`，每组之间会释放。
- 一次最多 **1024 个非空按键组**；空白编码会修剪，空组被移除。请直接提交下方清单中的有效编码，不依赖后端忽略无效编码的行为。
- 每组独立，修饰键不会跨组保持。例如连续 Ctrl+A、Ctrl+C 应写 `[["ControlLeft","KeyA"],["ControlLeft","KeyC"]]`。
- 请求在序列执行期间保持打开，全部执行后才返回；它不是后台任务。大量输入应拆成多个批次，等待上一批完成后再发送下一批，并设置足够的客户端超时。例如 1024 组、delay=35 时，仅保持与间隔就约需 71.68 秒。
- 断开连接、权限被撤销或写入失败时，可能已经执行了一部分。服务端退出时会尝试清空按键状态；重试前先查看被控电脑画面，避免整批重放造成重复输入。不要与网页或其他客户端并发发送键盘输入。

### 三种接口如何选择

| 需求 | 接口 | 发送方式 |
| --- | --- | --- |
| 单个键轻按或按住 | `/api/v1/hid/events` | 一个 key，通过 state / finish 控制 |
| 一次组合键 | `/api/v1/hid/shortcuts` | shortcuts 中的键同时按下约 35 ms，然后全部释放；不能自定义时长 |
| 多个键或多组组合键依次执行 | `/api/v1/hid/paste` | sequence 按组依次执行，每组内部同时按下，可配置 delay |

详情和更多请求示例见 [OpenAPI](./api.mdx) 或设备自身 `/docs`。这三个接口不会直接设置被控电脑剪贴板，也不提供任意 Unicode 到输入法事件的自动转换。

## 完整支持清单

本页按官网当前契约和后端映射核对，共 **107** 个编码。可下载 [JSON 编码清单](/api/keyboard-codes.json) 供集成时校验；其中 codes 数组包含所有有效编码，backendRevision 记录核对版本。设备固件不同，请优先核对设备 `/openapi.yaml` 中的 `HidKeyboardCode` 枚举。官网快照不是设备运行时能力查询。

符号名称按常见美式布局说明；本表中的描述不作为 API 参数传入。

### 修饰键

| 编码 | 按键 |
| --- | --- |
| `ControlLeft` | 左 Ctrl |
| `ShiftLeft` | 左 Shift |
| `AltLeft` | 左 Alt |
| `MetaLeft` | 左 Windows / Command |
| `ControlRight` | 右 Ctrl |
| `ShiftRight` | 右 Shift |
| `AltRight` | 右 Alt / AltGr |
| `MetaRight` | 右 Windows / Command |

### 字母键

| 编码 | 按键 |
| --- | --- |
| `KeyA` | A |
| `KeyB` | B |
| `KeyC` | C |
| `KeyD` | D |
| `KeyE` | E |
| `KeyF` | F |
| `KeyG` | G |
| `KeyH` | H |
| `KeyI` | I |
| `KeyJ` | J |
| `KeyK` | K |
| `KeyL` | L |
| `KeyM` | M |
| `KeyN` | N |
| `KeyO` | O |
| `KeyP` | P |
| `KeyQ` | Q |
| `KeyR` | R |
| `KeyS` | S |
| `KeyT` | T |
| `KeyU` | U |
| `KeyV` | V |
| `KeyW` | W |
| `KeyX` | X |
| `KeyY` | Y |
| `KeyZ` | Z |

### 主键区数字

| 编码 | 按键 |
| --- | --- |
| `Digit1` | 主键区 1 |
| `Digit2` | 主键区 2 |
| `Digit3` | 主键区 3 |
| `Digit4` | 主键区 4 |
| `Digit5` | 主键区 5 |
| `Digit6` | 主键区 6 |
| `Digit7` | 主键区 7 |
| `Digit8` | 主键区 8 |
| `Digit9` | 主键区 9 |
| `Digit0` | 主键区 0 |

### 功能键

| 编码 | 按键 |
| --- | --- |
| `F1` | F1 |
| `F2` | F2 |
| `F3` | F3 |
| `F4` | F4 |
| `F5` | F5 |
| `F6` | F6 |
| `F7` | F7 |
| `F8` | F8 |
| `F9` | F9 |
| `F10` | F10 |
| `F11` | F11 |
| `F12` | F12 |

### 数字小键盘

| 编码 | 按键 |
| --- | --- |
| `NumLock` | 数字锁定 |
| `NumpadDivide` | 小键盘除号 |
| `NumpadMultiply` | 小键盘乘号 |
| `NumpadSubtract` | 小键盘减号 |
| `NumpadAdd` | 小键盘加号 |
| `NumpadEnter` | 小键盘回车 |
| `Numpad1` | 小键盘 1 |
| `Numpad2` | 小键盘 2 |
| `Numpad3` | 小键盘 3 |
| `Numpad4` | 小键盘 4 |
| `Numpad5` | 小键盘 5 |
| `Numpad6` | 小键盘 6 |
| `Numpad7` | 小键盘 7 |
| `Numpad8` | 小键盘 8 |
| `Numpad9` | 小键盘 9 |
| `Numpad0` | 小键盘 0 |
| `NumpadDecimal` | 小键盘小数点 |
| `NumpadEqual` | 小键盘等号 |

### 编辑、方向、符号与其他键

| 编码 | 按键 |
| --- | --- |
| `Enter` | 主键区回车 |
| `Escape` | Esc |
| `Backspace` | 退格 |
| `Tab` | 制表 |
| `Space` | 空格 |
| `Minus` | 减号 / 下划线 |
| `Equal` | 等号 / 加号 |
| `BracketLeft` | 左方括号 / 左花括号 |
| `BracketRight` | 右方括号 / 右花括号 |
| `Backslash` | 反斜杠 / 竖线 |
| `NonUSHash` | 非美式 # / ~ 键 |
| `Semicolon` | 分号 / 冒号 |
| `Quote` | 单引号 / 双引号 |
| `Backquote` | 反引号 / 波浪号 |
| `Comma` | 逗号 / 小于号 |
| `Period` | 句号 / 大于号 |
| `Slash` | 斜杠 / 问号 |
| `CapsLock` | 大小写锁定 |
| `PrintScreen` | 截屏 |
| `ScrollLock` | 滚动锁定 |
| `Pause` | 暂停 |
| `Insert` | 插入 |
| `Home` | 行首 |
| `PageUp` | 上一页 |
| `Delete` | 删除 |
| `End` | 行尾 |
| `PageDown` | 下一页 |
| `ArrowRight` | 向右 |
| `ArrowLeft` | 向左 |
| `ArrowDown` | 向下 |
| `ArrowUp` | 向上 |
| `IntlBackslash` | ISO 键盘额外反斜杠键 |
| `ContextMenu` | 菜单键 |

## 排查无输入

核对 USB 数据连接、键盘功能开关、账号与 Token 权限及设备契约。HTTP 400 可能是编码或请求格式错误，401/403 与认证或权限有关，409 表示 HID 被禁用，503 表示 HID 不可用；请同时读取响应 error。返回成功表示输入已提交，不证明目标应用已执行操作。若按住后发生异常，可在连接恢复后发送有效 key 且 state=false 的键盘事件清空状态。

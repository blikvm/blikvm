# 按键编码参考

键盘接口使用 `KeyA`、`Enter`、`ControlLeft` 这样的**编码字符串**。本页用于查找有效编码；具体参数、调用示例、执行时序和限制统一见 OpenAPI。

## 编码规则

- 编码区分大小写，采用 `KeyboardEvent.code` 风格；不要传数字 keyCode、ASCII 或字符值，例如 `65`、`A`、`a`、`Ctrl`。
- 编码表示物理按键，实际字符由被控电脑的键盘布局、修饰键、锁定状态和输入法决定。主键区 `Digit1` 与小键盘 `Numpad1` 不同。
- 仅支持下列编码，不涵盖所有浏览器按键；`Fn`、媒体音量键及 F13–F24 不在清单中。`NonUSHash` 是后端使用的名称，国际键需结合实际布局验证。

## 选择接口

| 需求 | OpenAPI 接口说明 |
| --- | --- |
| 单键轻按、按住或释放 | [POST /api/v1/hid/events](/zh-CN/api-reference#tag/hid/operation/postHidEvent) |
| 一组同时按下的组合键 | [POST /api/v1/hid/shortcuts](/zh-CN/api-reference#tag/hid/operation/postHidShortcuts) |
| 多组按键依次执行 | [POST /api/v1/hid/paste](/zh-CN/api-reference#tag/hid/operation/postHidPaste) |

认证与契约来源见 [OpenAPI](./api.mdx)。

## 完整支持清单

共 **107** 个编码，可下载 [JSON 编码清单](/api/keyboard-codes.json) 用于集成校验。设备版本不同时，以设备 `/openapi.yaml` 中的 `HidKeyboardCode` 为准。下表符号名称按常见美式布局说明，描述文字不是 API 参数。

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

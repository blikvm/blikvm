# Key code reference

Keyboard endpoints use **code strings** such as `KeyA`, `Enter` and `ControlLeft`. Use this page to look up supported codes. Parameters, request examples, timing and limits are documented in OpenAPI.

## Code format

- Codes are case-sensitive and follow `KeyboardEvent.code` naming. Do not send numeric keyCode, ASCII or character values such as `65`, `A`, `a` or `Ctrl`.
- Codes identify physical keys; the target layout, modifiers, lock state and input method determine characters. Main `Digit1` and keypad `Numpad1` are different keys.
- Only the codes below are supported, not the full browser code set. `Fn`, media volume keys and F13–F24 are not listed. `NonUSHash` is a backend name; verify international keys against the target layout.

## Choose an endpoint

| Need | OpenAPI endpoint reference |
| --- | --- |
| Tap, hold or release one key | [POST /api/v1/hid/events](/api-reference#tag/hid/operation/postHidEvent) |
| One simultaneous key combination | [POST /api/v1/hid/shortcuts](/api-reference#tag/hid/operation/postHidShortcuts) |
| Multiple key groups in order | [POST /api/v1/hid/paste](/api-reference#tag/hid/operation/postHidPaste) |

See [OpenAPI](./api.mdx) for authentication and contract sources.

## Complete supported codes

There are **107** codes. Download the [JSON code list](/api/keyboard-codes.json) for integration validation. If firmware versions differ, use `HidKeyboardCode` in the device's own `/openapi.yaml`. Punctuation labels assume a common US layout; labels are not API arguments.

### Modifiers

| Code | Key |
| --- | --- |
| `ControlLeft` | Left Ctrl |
| `ShiftLeft` | Left Shift |
| `AltLeft` | Left Alt |
| `MetaLeft` | Left Windows / Command |
| `ControlRight` | Right Ctrl |
| `ShiftRight` | Right Shift |
| `AltRight` | Right Alt / AltGr |
| `MetaRight` | Right Windows / Command |

### Letters

| Code | Key |
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

### Main digits

| Code | Key |
| --- | --- |
| `Digit1` | Main digit 1 |
| `Digit2` | Main digit 2 |
| `Digit3` | Main digit 3 |
| `Digit4` | Main digit 4 |
| `Digit5` | Main digit 5 |
| `Digit6` | Main digit 6 |
| `Digit7` | Main digit 7 |
| `Digit8` | Main digit 8 |
| `Digit9` | Main digit 9 |
| `Digit0` | Main digit 0 |

### Function keys

| Code | Key |
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

### Numeric keypad

| Code | Key |
| --- | --- |
| `NumLock` | Num Lock |
| `NumpadDivide` | Keypad divide |
| `NumpadMultiply` | Keypad multiply |
| `NumpadSubtract` | Keypad subtract |
| `NumpadAdd` | Keypad add |
| `NumpadEnter` | Keypad Enter |
| `Numpad1` | Keypad 1 |
| `Numpad2` | Keypad 2 |
| `Numpad3` | Keypad 3 |
| `Numpad4` | Keypad 4 |
| `Numpad5` | Keypad 5 |
| `Numpad6` | Keypad 6 |
| `Numpad7` | Keypad 7 |
| `Numpad8` | Keypad 8 |
| `Numpad9` | Keypad 9 |
| `Numpad0` | Keypad 0 |
| `NumpadDecimal` | Keypad decimal |
| `NumpadEqual` | Keypad equal |

### Editing, navigation, punctuation and other keys

| Code | Key |
| --- | --- |
| `Enter` | Main Enter |
| `Escape` | Esc |
| `Backspace` | Backspace |
| `Tab` | Tab |
| `Space` | Space |
| `Minus` | Minus / underscore |
| `Equal` | Equal / plus |
| `BracketLeft` | Left bracket / brace |
| `BracketRight` | Right bracket / brace |
| `Backslash` | Backslash / vertical bar |
| `NonUSHash` | Non-US # / ~ |
| `Semicolon` | Semicolon / colon |
| `Quote` | Single / double quote |
| `Backquote` | Backquote / tilde |
| `Comma` | Comma / less-than |
| `Period` | Period / greater-than |
| `Slash` | Slash / question mark |
| `CapsLock` | Caps Lock |
| `PrintScreen` | Print Screen |
| `ScrollLock` | Scroll Lock |
| `Pause` | Pause |
| `Insert` | Insert |
| `Home` | Home |
| `PageUp` | Page Up |
| `Delete` | Delete |
| `End` | End |
| `PageDown` | Page Down |
| `ArrowRight` | Right arrow |
| `ArrowLeft` | Left arrow |
| `ArrowDown` | Down arrow |
| `ArrowUp` | Up arrow |
| `IntlBackslash` | Extra ISO backslash key |
| `ContextMenu` | Context menu |

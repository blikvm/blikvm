# Keyboard API and key codes

Use the **code strings** listed here when integrating keyboard control: `KeyA` for the physical A key, `Enter` for Return, and `ControlLeft` for left Ctrl.

## Code format

- Codes follow `KeyboardEvent.code` naming and are case-sensitive. They are not legacy numeric browser `keyCode`, `KeyboardEvent.key` character values, ASCII, or numeric USB HID usage IDs. Do not send `65`, `A`, `a`, or `Ctrl`.
- Codes identify physical keys. The target computer's layout, modifiers, lock state and input method determine characters. For uppercase A on a US layout, send `ShiftLeft` + `KeyA`.
- `Digit1` differs from `Numpad1`; `Enter` differs from `NumpadEnter`.
- Only the listed codes are supported. This is not the entire browser code set: `Fn`, media volume keys and F13–F24 are not supported by the current mapping. `NonUSHash` is a backend name that may require browser-side normalization. Verify international keys with the target layout.

Read [OpenAPI](./api.mdx) and create an API token with the appropriate keyboard/input permission. Examples assume `BLIKVM_URL` is the device HTTPS origin, `BLIKVM_API_TOKEN` is the token, and the certificate is trusted. Requests send real input to the target computer; test with focus in a text editor.

## Single keys: tap, hold and release

Send `POST /api/v1/hid/events` with `Content-Type: application/json` and `Authorization: Bearer …`.

| Action | JSON body | Behavior |
| --- | --- | --- |
| Tap Enter | `{"type":"keyboard","key":"Enter"}` | Omit state to press and release automatically |
| Hold left Shift | `{"type":"keyboard","key":"ShiftLeft","state":true}` | Caller must release it |
| Release | `{"type":"keyboard","key":"ShiftLeft","state":false}` | Clears all current keyboard keys, not just the named key; key must still be valid |
| Press and release | `{"type":"keyboard","key":"Enter","state":true,"finish":true}` | A tap; finish applies only when state=true |

```sh
curl --fail-with-body --show-error \
  --header "Authorization: Bearer $BLIKVM_API_TOKEN" \
  --header 'Content-Type: application/json' \
  --data '{"type":"keyboard","key":"Enter"}' \
  "$BLIKVM_URL/api/v1/hid/events"
```

**Each request replaces the complete single-key state; it does not add a key.** Holding `ControlLeft` and then sending `KeyC` separately does not produce Ctrl+C. A completed tap also clears the keyboard state. Use the shortcut endpoint below for combinations and avoid concurrent input from multiple clients.

`CapsLock`, `NumLock` and `ScrollLock` are taps even with `state=true`. They toggle the target lock state rather than explicitly enabling it. Num Lock also changes keypad behavior.

## Combinations: submit all keys together

`POST /api/v1/hid/shortcuts` accepts a `shortcuts` string array. Keys in the array are pressed **together**, then released automatically; they are not typed in sequence.

| Combination | JSON body |
| --- | --- |
| Ctrl+C | `{"shortcuts":["ControlLeft","KeyC"]}` |
| Ctrl+V | `{"shortcuts":["ControlLeft","KeyV"]}` |
| Ctrl+Alt+Delete | `{"shortcuts":["ControlLeft","AltLeft","Delete"]}` |
| Alt+Tab | `{"shortcuts":["AltLeft","Tab"]}` |
| Windows+R | `{"shortcuts":["MetaLeft","KeyR"]}` |
| Uppercase A (US layout) | `{"shortcuts":["ShiftLeft","KeyA"]}` |

```sh
curl --fail-with-body --show-error \
  --header "Authorization: Bearer $BLIKVM_API_TOKEN" \
  --header 'Content-Type: application/json' \
  --data '{"shortcuts":["ControlLeft","KeyC"]}' \
  "$BLIKVM_URL/api/v1/hid/shortcuts"
```

The current report holds up to **6 non-modifier keys**, with modifier bits separate. Do not submit text as one shortcut array. Ctrl+V uses the target computer's clipboard; it does not transfer the caller's clipboard. For text input, see [Paste and OCR](../peripheral-devices/paste-ocr.md) and the paste endpoint in the device contract.

## Complete supported codes

The website contract and backend mapping agree on **107** codes. Download the [JSON code list](/api/keyboard-codes.json) for client-side validation: codes contains supported strings and backendRevision identifies the checked backend revision. When firmware differs, use `HidKeyboardCode` in the device's own `/openapi.yaml`. The website snapshot is not a device capability query.

Punctuation labels describe a common US layout; labels are not API arguments.

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

## Troubleshooting

Check the USB data cable, keyboard function, account/token permissions and device contract. HTTP 400 can indicate an invalid code or body; 401/403 concern authentication or permissions, 409 means HID is disabled and 503 means HID is unavailable. Read the error body too. Success means input was submitted, not that a target application completed an action. After an interrupted hold, reconnect and send a keyboard event with a valid key and state=false to clear the keyboard state.

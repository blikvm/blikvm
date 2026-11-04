---
title: WebRTC integration demo
---

A small reference client for receiving BliKVM video/audio and controlling the host's keyboard and mouse. Its page supports English and Simplified Chinese, with no frontend framework or npm installation.

**Source:** [blikvm/blikvm-web-client](https://github.com/blikvm/blikvm-web-client). The repository now contains this minimal native-WebRTC example; older Vue/Janus code remains available in Git history.

## Quick start

Use firmware that exposes `/api/v1/stream/webrtc/signaling`. The example was tested with RV1126B firmware **3.0.3** and browser-decoded **1920×1080 H.264 at approximately 60 fps**. Other boards and input timings depend on device capabilities; this is not a promise of 1080p60 on every platform.

```sh
git clone https://github.com/blikvm/blikvm-web-client.git
cd blikvm-web-client
python3 serve.py --device DEVICE_IP --ca-cert /path/to/trusted-device.crt --port 10027
```

Obtain the HTTPS certificate from your own device through a trusted channel. The local proxy checks that certificate; do not replace validation with an insecure TLS option. Python 3 is required for this run mode.

1. Open `http://127.0.0.1:10027/` and choose English or 简体中文.
2. Sign in with an existing device account, then select **Connect**.
3. Audio starts muted. Select **Enable audio** to listen.
4. After the HID handshake, select **Enable keyboard & mouse** and focus the video to control the host. The device should use absolute or dual mouse mode.
5. Select **Disconnect** to close media and input. Reconnecting creates a fresh session.

The simple sign-in form does not implement 2FA. For those accounts, serve the demo on the same origin as the device API and complete the normal device login flow first.

## Integration interfaces

| Interface | Purpose |
| --- | --- |
| `POST /api/v1/auth/login` | Establish an HttpOnly browser session cookie |
| `OPTIONS /api/v1/stream/webrtc/signaling` | Discover STUN/TURN configuration from Link headers |
| `GET /api/v1/stream/webrtc/signaling` → WebSocket | Exchange SDP, ICE and heartbeats |
| WebRTC media tracks | Main H.264 video and Opus audio |
| WebRTC `hidrpc` DataChannel | Keyboard and mouse reports |

This is the same signaling endpoint and HID report format used by the built-in BliKVM Web client. To keep the example small, input uses one reliable ordered channel; the full client also separates high-frequency pointer motion onto unreliable channels. No terminal, API RPC, virtual media or power control is included.

The first SDP offer specifies `data.codec: "h264"`. Queue remote ICE candidates until the SDP answer has been applied. Keep signaling open, send `ping` every 20 seconds, and close both the WebSocket and PeerConnection when finished. Media itself does not travel in the WebSocket response body.

## Authentication and permissions

Video requires `kvm.view`, audio requires `audio.listen` and control requires `kvm.input`. A connection alone does not grant input permission: the control checkbox becomes available only after the HID acknowledgement.

Browsers cannot attach an arbitrary Authorization header to their WebSocket handshake. Use the existing same-origin session cookie. Server-side clients may use an API token in the Authorization handshake header. Do not place tokens in URLs or frontend source.

For production integration, serve the page on the same HTTPS origin as the device API, or use an authenticated gateway. The included proxy is a loopback-only development tool, not an Internet-facing service. Opening the HTML via `file://` or calling the device directly from an arbitrary third-party origin is not this example's supported deployment mode.

## Input behavior and limits

Mouse coordinates use the displayed video's actual content area and exclude letterboxing. Keyboard events use physical `KeyboardEvent.code` values, with modifiers and up to six ordinary keys; combinations such as Ctrl+A+S are supported. Blur, page hiding, disabling input and disconnect release held keys/buttons.

IME composition, clipboard pasting and browser/OS-reserved shortcuts are outside this example. A successful HID send is not an acknowledgement that a host application has completed an action.

## Files and further reading

- `index.html`, `app.js`, `i18n.js`: bilingual page.
- `receiver.js`: media, SDP/ICE and connection lifetime.
- `hid.js`: input reports, coordinates and release handling.
- `serve.py`: optional Python development proxy.
- `hid.test.mjs`: input regression tests; run `node hid.test.mjs`.

See [OpenAPI](./api.mdx) for the current device contract and [Key code reference](./keyboard-api.md) for physical key names. The repository's bilingual README contains the run commands and HID message layout.

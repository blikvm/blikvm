# WebRTC connection troubleshooting

WebRTC uses a negotiated media path. Opening the BliKVM page establishes web connectivity only, not media connectivity.

Select an offered mode under **Settings → Video & Cameras → HDMI Video → Advanced Settings**. See [Video modes](./video-modes.md) for codec and browser requirements.

## Diagnose in order

1. **Verify LAN capture.** Confirm supported computer HDMI output. Compare MJPEG if offered.
2. **Check the browser.** Use a current browser with the selected decoder. Compare H.264 / H.265 only when both are offered. A missing decoder differs from an ICE failure.
3. **Compare LAN and remote.** For remote-only failure, check NAT, firewall, VPN routes and media configuration. An HTTPS proxy need not carry negotiated media.
4. **Check advertised addresses.** With Ethernet, Wi-Fi and VPN, the browser must reach the offered media endpoint. Inspect current service settings and diagnostics, not old Janus paths.
5. **Check ICE conditions.** STUN discovers addresses; it does not relay media. TURN needs a deployed, reachable service and configuration. Public STUN alone cannot support every topology.

## Configure STUN / TURN

In **HDMI Video → Advanced Settings → WebRTC Network**:

1. Disable the STUN / TURN toggle before editing its fields; enabled fields are read-only.
2. Enter reachable STUN server URLs one per line, then enable NAT traversal (STUN).
3. For a relay, enter your provider's TURN URL, username and password, add servers if needed, then enable TURN.
4. Toggling validates and saves configuration. Confirm the save notice and reconnect video. Editing fields alone does not save.

Use `stun:host:port`, `turn:host:port` or `turns:host:port` as appropriate, replacing placeholders with provider values. A relay does not replace HDMI validation; avoid arbitrary port exposure without understanding the topology.

## Reporting a problem

Provide app / system versions, model, browser / OS, mode, LAN versus remote results and exact connection errors. Remove passwords, tokens and private configuration.

Current software does not use the old Janus paths or `kvmd-web` restart flow. For a temporary comparison, switch to another offered mode before changing unrelated network settings.

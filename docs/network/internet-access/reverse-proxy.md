# Reverse proxy

A reverse proxy can provide a domain and certificate and forward HTTPS to BliKVM. It handles pages, APIs and signaling; WebRTC media still needs a separately reachable ICE path.

## Deployment checklist

1. Confirm the proxy can reach the device's HTTPS address.
2. Configure domain and certificates, appropriate original Host / forwarding information and WebSocket upgrades.
3. Set long-connection timeouts and upload limits suitable for media and update packages.
4. Use a deployment that verifies the upstream certificate. Keep device authentication enabled.
5. Test page access, login, WebRTC, terminal and necessary uploads separately.

Native signaling includes WebSocket paths, so old static-page-only proxy configurations are insufficient. Write configuration for your actual proxy, ports, certificates and topology.

## Common failures

| Symptom | Check |
| --- | --- |
| Static page works but login fails | Cookies, origin information, HTTPS and authentication forwarding |
| Video stays connecting | WebSocket signaling and separate media path; see [WebRTC](../../video/webrtc.md) |
| Upload interrupted | Body-size limits, buffering and timeouts |
| Unexpected IP rule behavior | Actual proxy and device source addresses; not every forwarded header is trusted |

For a fixed-port media path, HTTPS may use the proxy but UDP requires separate [forwarding](./port-forwarding.md). For VPN access, inspect VPN addresses and routing.

# HTTP tunnels and Cloudflare Tunnel

HTTP tunnels can expose the device page through a domain, but are not complete WebRTC media tunnels. There is no generic one-click Cloudflare Tunnel installer in the current interface; manage it on your tunnel host.

## Integrate

1. Confirm the tunnel host can reach the device's HTTPS address.
2. Follow your service's deployment procedure to forward the domain to device HTTPS and establish upstream certificate trust.
3. Keep device authentication enabled and check WebSocket, cookies, long connections and upload limits.
4. Test external login, then video, terminals and input independently.

If pages work but media fails, do not repeatedly disable authentication or switch to insecure protocols. Use a configured reachable TURN / VPN media path or another available mode appropriate to the deployment. See [Reverse proxy](./reverse-proxy.md) and [WebRTC](../../video/webrtc.md).

The deployment owner must check provider access policies, bandwidth and terms. A third-party HTTP tunnel should not be assumed to provide unlimited video relay.

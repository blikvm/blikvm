# Public port forwarding

You need an inbound public address and control of the router or forwarding server. A router rule alone normally cannot bypass carrier CGNAT; use a VPN or managed relay path instead.

## Configure a fixed WebRTC UDP port

1. On the LAN, open **Settings → Remote Access → Port Forwarding**.
2. Enable fixed UDP and select an unused port (`1024–65535` in the interface). Enter an advertised public IPv4 if required.
3. Save and apply. Service restart may interrupt video and terminals.
4. Create HTTPS TCP and matching fixed UDP forwarding rules on the router / public server and allow them through firewalls. The web setting configures the device, not your router.

Example with default HTTPS:

```text
Public TCP 443 → BliKVM HTTPS 443
Public UDP selected-port → BliKVM UDP same-port
```

For a changed web port, adjust HTTPS rules and URLs. Keep internal and external UDP ports identical so the advertised endpoint matches the mapping. Disabling fixed mode restores random-port operation and stops using its manual advertised address.

## Verify and recover

Test page and video externally; LAN clients can retain local addresses. If fixed transport is unavailable, inspect port conflicts and service state, or disable fixed mode and apply. Use strong authentication and trusted HTTPS publicly. [STUN / TURN](../../video/webrtc.md) remains in advanced video settings and is not replaced by this page.

# Choose a remote access method

Verify the LAN using [First steps](../../getting-started/first-steps.mdx). Remote access includes a web entry, authentication and a media path; opening the homepage is only one check.

| Method | Requirements | Also verify |
| --- | --- | --- |
| WireGuard | Managed VPN service and configuration | Routes, nonconflicting addresses, both peers online |
| Tailscale / ZeroTier | Reachable control service and device authorization | Account / network approval, policies, direct or relay path |
| Port forwarding | Inbound public address and router access | HTTPS and WebRTC UDP, authentication and firewall |
| Reverse proxy / HTTP tunnel | Managed proxy or tunnel deployment | WebSocket, timeouts and a separate media path |
| BliKVM cloud | Device capability and deployed cloud binding support | Cloud authorization, direct connectivity or your TURN; cloud does not relay video |

## Verification order

1. Use a real external network, such as a phone hotspot, rather than relying on LAN hairpin routing.
2. Test login, sustained video and a harmless input action.
3. Test reconnection and required virtual-media / terminal functions.
4. Compare LAN and remote results, recording browser, mode, versions and error text.

Methods may be combined, but add one at a time. DDNS updates DNS only; it provides no VPN, forwarding or relay. See [IP access rules](../security.md).

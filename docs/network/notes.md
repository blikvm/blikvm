# Network connections and routing

BliKVM uses its network for the web interface, media negotiation, VPN, DDNS and updates. Verify LAN access before remote access, and avoid changing address, port and routing at once.

## Inspect connections

Open **Settings → Network → Interfaces & Addresses** for interface, MAC, IPv4, IPv6 and DHCP information. Ethernet, Wi-Fi and VPN interfaces may each have different addresses.

- [Static IP and DHCP](./static-ip.md): addresses, gateways and DNS.
- [Wi-Fi](./wifi.md): wireless and supported hotspots.
- [HTTPS and ports](./https.md): web entry and certificates.
- [Remote access options](./internet-access/overview.md): VPN, forwarding and tunnels.

## Select an uplink

Open **Settings → Network → Uplink & Routing** to inspect Ethernet, Wi-Fi and default routes. Choose and apply a preferred uplink, or use automatic to restore system route priorities. This affects new outbound IPv4 / IPv6 connections, without rewriting dedicated VPN routes.

Record the current address and a working entry before changes. Resolve overlapping interface subnets first. After changing the uplink, check DNS, outbound access and remote video, not only the local page.

## Check each layer

| Check | Establishes | Does not establish |
| --- | --- | --- |
| Open device page | Address and web port are reachable | WebRTC connectivity |
| Sign in | Authentication and access rules allow login | Permission to control or maintain |
| View video | HDMI and selected media transport work | USB input works |
| Control computer | Input permission and USB link work | All optional ATX and virtual-media functions were tested |

For a working page but no remote picture, see [WebRTC troubleshooting](../video/webrtc.md). Old Janus interface-blocking configuration does not apply to the current multi-interface implementation.

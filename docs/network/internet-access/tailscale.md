# Tailscale

Open **Settings → Remote Access → Tailscale**. The image must include the service, and your management computer must join a reachable network.

## Join the network

1. Obtain a valid Auth key from your Tailscale management environment.
2. Enter it on the device. Set the control-service URL, hostname, advertised routes and subnet-route acceptance as needed.
3. Save and enable the service. The saved key is reused as described by the interface; enter a new value when replacing it.
4. Wait for a VPN address and complete any control-side approval and access policy.
5. Test login and video from another authorized client at the displayed address.

You do not need to advertise the whole LAN merely to access BliKVM. A blank control URL uses the service default; a self-hosted service must be compatible and reachable.

## Incomplete connection

“Enabled, waiting for connection” is different from joined. Check key validity, device time, DNS, uplink and control-side approval. If an address exists but access fails, check policies and routes. For a working page but no video, see [WebRTC](../../video/webrtc.md).

Use the built-in management entry; no external installer script is required. Auth keys are credentials and must stay out of screenshots and shared logs.

# ZeroTier

Open **Settings → Remote Access → ZeroTier**. The image must include the service; the management computer should join the same authorized virtual network.

## Configure

1. Create or select your network in its controller and obtain the Network ID.
2. Enter the ID on BliKVM, save and enable.
3. Inspect Node ID, join state and network name, then authorize that node in the controller.
4. Wait for readiness and an assigned address, then connect from an authorized client.
5. Verify login, video and input; a running service alone is insufficient.

## Troubleshooting

For pending authorization, compare Node IDs in the controller. For a joined node without an address, check address allocation. For page access without media, check virtual-network policies and [WebRTC](../../video/webrtc.md).

Enabling the service and authorizing the node are separate steps; do not reinstall ZeroTier using the old guide. Record the previous network and a working LAN entry before changing networks.

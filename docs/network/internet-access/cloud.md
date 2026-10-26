# BliKVM cloud platform

Open **Settings → Remote Access → BliKVM Cloud Platform** when supported by the device and system. The current v4 and Raspberry Pi integrations do not expose cloud binding; use actual device capabilities on other platforms too.

## Bind

1. Enable device authentication and sign in as administrator.
2. Create a pairing code in your cloud console.
3. Enter the correct platform address and code on the device and bind.
4. Wait for connected status, then open the device from the cloud.
5. Test video and input externally. Device network diagnostics can test configured STUN / TURN availability but cannot replace a full browser-to-device test.

## Media and unbinding

The cloud provides access management and **does not relay video**. Media uses direct WebRTC or your configured TURN. If direct connectivity fails, check TURN or use VPN.

Unbind and review the cloud device list before transfer or retirement. Factory reset clears local binding; if remote unbinding is unconfirmed, also remove the entry manually in the cloud account. Keep pairing codes and credentials out of public screenshots.

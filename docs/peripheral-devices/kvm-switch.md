# Multi-computer KVM switching

Open **Settings → KVM Switch**. Use a supported external switch, control cable and HDMI / USB wiring. The switch control cable differs from the keyboard / mouse USB data connection.

## Configure and switch

1. Wire the device using [BliSwitch v1](../device-guides/BliSwitch-v1-guide.md) or [v2](../device-guides/BliSwitch-v2-guide.md) diagrams.
2. As administrator, select matching device type, control port and channel settings. Enable and read current status.
3. An authorized user selects the target channel and waits for HDMI / USB reconnection.
4. Confirm picture, input and any ATX status all refer to the same computer before acting.

Channel names are labels, not wiring verification. A brief black screen is possible during switching. Request success does not establish stable USB and HDMI. Refresh and check the control port, mapping, wire order and power if status differs.

Check the channel before installation, media mounting or forced power actions to avoid affecting another computer. Maximum HDMI switch bandwidth is not BliKVM network-encoding capacity.

# Wake-on-LAN

Open **Settings → Network → Wake on LAN**. WOL sends a Magic Packet to the computer's network card without ATX wiring, but requires motherboard, firmware, NIC and standby-power support.

## Use WOL

1. Enable the required wake functions in BIOS / UEFI and OS NIC settings.
2. Add the device name and correct MAC address.
3. Confirm the network between BliKVM and the computer allows the wake packet through.
4. With power-action permission, send wake and observe whether the computer actually starts.

“Sent” confirms packet transmission only. Wake may fail across subnets, wireless links, complete power loss or particular shutdown states. Test on the same LAN first.

WOL does not provide reliable forced shutdown or reset; use correctly wired [ATX control](./atx.md) for those actions.

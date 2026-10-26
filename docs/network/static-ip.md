# Static IP and DHCP

Open **Settings → Network → Interfaces & Addresses** with device-configuration permission. A router DHCP reservation is usually the easiest way to keep a stable address with central management.

## Set static IPv4

1. Record the interface, current address and MAC; identify the physical interface you intend to change.
2. Select static IPv4 and fill in address, subnet mask, gateway and DNS. Use an unoccupied address on the correct subnet.
3. Save, review the old and new values in confirmation, then apply.
4. If disconnected, reconnect at the new address and test login, video and device outbound access.

For a `192.168.1.0/24` LAN, have the administrator allocate an unused address. Do not copy an example or choose an address that DHCP may allocate elsewhere. An isolated network without a gateway may support local access while VPN and DDNS remain unavailable.

## Return to DHCP

Choose DHCP, save and apply. Find the new address on the device display or router lease list. IPv6 appears separately; a link-local address is not a public address.

## Lost access after saving

Check subnets, conflicts, gateway, VLAN and IP rules. Change one interface at a time. Without a backup entry, make changes where you can physically recover the device. Current configuration does not require `raspi-config`, `armbian-config` or old network-file edits.

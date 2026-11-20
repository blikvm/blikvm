# USB 4G adapter

A USB 4G adapter lets BliKVM use mobile data as a network uplink. The **Huawei E8372h-820 in HiLink USB Ethernet mode** was verified on **BliKVM v4 (H616), Raspberry Pi 4B, and RV1126B (TC358743)**. These instructions describe that adapter. Use a BliKVM App with the USB 4G status card and a system with USB Ethernet driver support. On RV1126B, upgrade to a system build that includes the CDC Ethernet driver.

## Connect and check status

1. Insert a SIM with an active data plan into the adapter and plug it into a **USB host port on BliKVM**. Keep a working Ethernet or Wi-Fi management connection during setup.
2. Open **Settings → Network → Network Details** and look for **USB 4G network adapter**. In USB Ethernet mode the adapter should assign an IPv4 address and gateway via DHCP. The card shows the interface, IPv4 address, gateway, and bytes received and sent on the device.
3. If the adapter's subnet overlaps your Ethernet or Wi-Fi subnet, change the LAN subnet in the adapter's HiLink settings. For example, the test adapter used gateway `192.168.9.1` on `192.168.9.0/24` while the management network used a different subnet.

If the card reports USB serial mode, unplug the adapter, wait a few seconds, and reconnect it. If it stays in startup mode or reports a missing network interface, check that the adapter enters HiLink USB Ethernet mode and that the installed system includes the USB Ethernet driver.

## Use 4G as a backup

Keep Ethernet or Wi-Fi preferred in **Settings → Network → Uplink & Routing**. **Standby IPv4 uplink** means another interface currently has the preferred IPv4 default route. If that route is removed, the 4G adapter can take over. **Active IPv4 uplink** means the adapter is selected by the default route. To verify remote access, test your existing [VPN connection](./internet-access/overview.md) over 4G and check that it returns to the preferred link after reconnection. Video streams and downloads use the SIM data plan whenever they travel over 4G.

# Wi-Fi connection

Wi-Fi requires supported hardware and a current system driver. Use the real device's menus; software cannot add missing wireless hardware.

## Join a network

1. Sign in over Ethernet first and open Wi-Fi under **Settings → Network**.
2. Scan, choose an SSID, enter its password and connect. Use the offered manual entry for hidden networks.
3. Wait for connection and address updates, then verify the wireless address under **Interfaces & Addresses**.
4. Test that address from another device on the wireless network before removing Ethernet.

Client isolation, guest networks and VLANs can block management access even when Wi-Fi is connected. For drops, check signal, band, power and network rules rather than changing global configuration-directory permissions.

## v4: front-panel Wi-Fi setup

Images containing the newer v4 display provisioning service and matching driver support holding **BUTTON 1 + BUTTON 2 together for about 3 seconds** without Ethernet. Join the temporary hotspot shown on the display and open `http://192.168.4.1`. Choose your network; the hotspot stops during connection. Then use the new IP displayed on the LCD.

See [v4 Wi-Fi setup](/docs/device-guides/BliKVM-v4-guide#wifi-setup) for illustrations, retry and exit steps. The hotspot password is generated each time; use the real display. If QR scanning fails, enter the SSID and password manually. Older images may lack this feature; an app version alone does not establish support.

## Hotspot and uplink

The temporary physical-button provisioning hotspot differs from a persistent web-configured AP. Persistent hotspot settings depend on platform capability and do not establish whether v4 local provisioning is supported. Raspberry Pi and other platforms do not use the v4 button procedure.

With Ethernet and Wi-Fi connected, choose a preferred uplink under [Uplink & Routing](./notes.md). A wireless connection does not guarantee Internet access; VPN and DDNS also need routing, DNS and correct time.

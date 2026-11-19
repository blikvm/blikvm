# IPMI, Serial over LAN and Redfish

These services manage the single computer attached to BliKVM. Open **Settings → Maintenance → IPMI and Redfish** as an administrator on an App version that includes this page. Both services are off by default. The page saves settings automatically.

Power operations use the [ATX connection](./atx.md) to the computer. Connect the applicable motherboard power, reset and power-state leads before testing those operations.

## IPMI power and Serial over LAN

1. Enter the **IPMI listen address**. Use the IP address assigned to BliKVM on the management network. IPMI listens on UDP 623 at that address.
2. Create an **IPMI username** and **IPMI password**. The username accepts 1–16 printable ASCII characters and the password 12–20. Both exclude spaces. Use these credentials in the IPMI client.
3. Turn on **Enable IPMI**. If a required field is missing or invalid, the page shows an alert and leaves IPMI off.
4. From a management computer, run the following command. Replace the address and username. When prompted, enter the IPMI password.

```sh
ipmitool -I lanplus -C 17 -H 192.0.2.10 -U YOUR_IPMI_USER -a power status
```

For Serial over LAN (SoL), connect an adapter matched to the target computer's [serial port](./serial-terminal.md). In **Settings → Maintenance → Serial Settings**, select the port and matching baud rate and mark it as connected to the target device. Turn on **Enable Serial over LAN** after enabling IPMI. The page shows an alert if the target port has not been configured, is unavailable, or belongs to the KVM switch.

```sh
ipmitool -I lanplus -C 17 -H 192.0.2.10 -U YOUR_IPMI_USER -a sol activate
```

## Redfish power and local media

Turn on **Enable Redfish** and connect over HTTPS to the same address used for the BliKVM web interface. Use a BliKVM account with the required permissions via HTTP Basic authentication. For accounts with two-factor authentication, use a scoped BliKVM API token.

| Operation | Request | Body or result |
| --- | --- | --- |
| Discover the service | `GET /redfish/v1/` | Service links |
| Read power state | `GET /redfish/v1/Systems/0` | `PowerState` |
| Power on | `POST /redfish/v1/Systems/0/Actions/ComputerSystem.Reset` | `{"ResetType":"On"}` |
| Read media state | `GET /redfish/v1/Managers/BMC/VirtualMedia/MSD` | Current virtual-media status |
| Mount a stored image | `POST /redfish/v1/Managers/BMC/VirtualMedia/MSD/Actions/VirtualMedia.InsertMedia` | `{"Image":"rescue.iso"}` |
| Eject the image | `POST /redfish/v1/Managers/BMC/VirtualMedia/MSD/Actions/VirtualMedia.EjectMedia` | `{}` |

Upload the image to BliKVM first and pass its filename to `InsertMedia`. Use [Virtual Media](../peripheral-devices/msd.md#mount-an-iso-directly-from-a-url) in the web interface to mount an ISO from a URL.

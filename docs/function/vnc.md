# VNC service

Use a compatible VNC viewer to view the controlled computer's HDMI picture and
operate its USB keyboard and mouse. The target computer needs no VNC agent.

Open **Settings → Advanced & Diagnostics → VNC Service**. This guide describes
the layout validated with App **3.0.3-dev.16**. Check the selected release notes
for availability on your model; older Apps may not have this entry.

## Enable the service

1. Select **H.264** in BliKVM's video settings and confirm that HDMI has a picture.
2. Open **VNC Service**, enable VNC, select an unused TCP port, and **Save and apply**.
3. Confirm that the service is running. The default port is **5900**.
4. Connect using the device's address and your **web account**. VNC is disabled by
   default; saving this setting does not restart the App or the web video stream.

VNC and the web viewer share one hardware H.264 encoder. When both are open,
BliKVM sends the encoded video separately to each viewer, which adds network
traffic. BliKVM subscribes to video for VNC only while a VNC viewer is connected.
A stalled VNC connection can time out independently of the web stream. Turning
VNC off closes its connections.

## Compatible VNC clients {#compatible-viewer-and-connection-settings}

The viewer must support **Open H.264 encoding (50)** and **VeNCrypt X509Plain**.
Check the exact package for your operating system.

| Platform | Client | BliKVM compatibility |
| --- | --- | --- |
| macOS | [DeskVNC Viewer 0.35.3 (Universal DMG)](https://github.com/psmux/DeskVNC/releases/download/v0.35.3/DeskVNCViewer_0.35.3_universal.dmg) | Video, keyboard and mouse verified on BliKVM v4 from an Intel Mac. The installer also includes an Apple Silicon build. |
| Linux | [TigerVNC 1.14.1](https://github.com/TigerVNC/tigervnc/releases/tag/v1.14.1) built with FFmpeg H.264 support | Live video verified on BliKVM v4. Use a distribution package or build that includes H.264. |
| Windows x64 | [TigerVNC Viewer 1.16.2 (standalone EXE)](https://sourceforge.net/projects/tigervnc/files/stable/1.16.2/vncviewer64-1.16.2.exe/download) | Open H.264 and X509Plain are present in this package. A live BliKVM connection with this Windows build is still unverified. |

In DeskVNC, enter the device address and port (for example,
`kvm.example.com:5900`) in the connection bar, then sign in with your BliKVM web
account. In TigerVNC, select **H.264** in the encoding options if available.

The official **TigerVNC 1.16.2 macOS DMG** lacks Open H.264. **RealVNC Viewer
6.21.118** could not negotiate the required authentication in testing. On
iOS and iPadOS, use the BliKVM web interface. Native VNC compatibility is
unverified on those platforms.

### TigerVNC command-line example

For a device with a certificate valid for `kvm.example.com`:

```sh
vncviewer -SecurityTypes X509Plain -AutoSelect=0 -PreferredEncoding=H264 kvm.example.com::5900
```

Replace the hostname and port with your device's values. TigerVNC's `::5900`
notation specifies a TCP port, rather than display number `:0`. Enter your web
username and password in the viewer's login dialog. A custom CA may require the
viewer's `-X509CA` option.

## TLS certificates and an SSH tunnel

VNC requires TLS and uses the device's HTTPS certificate. Verify its identity in
your viewer. Use a trusted certificate whose names match the connection address
for direct access; see [HTTPS and certificates](../network/https.md).

A factory certificate may contain only loopback names, rather than the device's
DHCP address. An SSH tunnel allows a loopback connection with that certificate.
First verify the device's SSH host fingerprint through a trusted source. Copy
only its **public certificate** through the authenticated SSH connection:

```sh
ssh root@device-address 'cat /data/vault/tls/server.crt' > device.crt
ssh -N -L 15900:127.0.0.1:5900 root@device-address
```

Keep the tunnel open and run the viewer in another terminal:

```sh
vncviewer -SecurityTypes X509Plain -X509CA ./device.crt -AutoSelect=0 -PreferredEncoding=H264 localhost::15900
```

Use the actual OS SSH account if it differs from `root`; SSH and web accounts
are separate. The tunnel example requires the certificate to cover `localhost`.
Inspect the certificate and stop if it differs from the identity you verified.
Keep the private key on the device. Disabling certificate verification is not a
connection setup step.

## Accounts and permissions

- **Viewer:** watch the screen.
- **Operator / administrator:** keyboard and mouse input, subject to device
  permissions and enabled USB functions.
- **Device configuration permission:** configure the VNC service in the web UI.

VNC always requires a real, enabled web account, including when web
interface authentication is disabled. Account, password and permission changes
revoke affected sessions. There is no separate eight-character VNC password.
Accounts requiring a two-factor code cannot log in through X509Plain; use the
web interface when that account policy applies.

At most **two VNC connections** are allowed, including logins in progress.
Authorized clients share input with web users. Coordinate before acting.

## Settings and current limits

The enabled state and port survive an App restart and ordinary upgrades. Factory
reset returns VNC to its disabled default. Configure it through the UI or the
protected `GET /api/v1/vnc` and `PUT /api/v1/vnc` endpoints; device-local API
parameters are documented at `/docs` and `/openapi.yaml`.

This implementation supports H.264 video and keyboard/mouse control. It has no
raw/JPEG fallback, H.265, VNC audio, clipboard paste or virtual-media transport.
Continue using the web UI for audio, virtual media and other browser tools.
It does not change video mode automatically. Absolute and relative USB mouse
configuration remains in the existing keyboard/mouse settings.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| No VNC entry | App version, release availability and device configuration permission. |
| Service cannot start | An unused TCP port, a readable valid HTTPS certificate/key pair and the displayed error. Save again after fixing the cause. |
| Viewer disconnects after login | H.264 support in the viewer build, H.264 video mode, HDMI signal and the two-connection limit. |
| Login rejected | Web username/password, enabled account, account permissions and the two-factor policy. An API token is not a VNC password. |
| Certificate warning | Expected device identity, certificate names and CA trust. A hostname mismatch is distinct from a wrong password. |
| Picture works but input does not | Account input permission, enabled keyboard/mouse USB functions, the USB data cable and the target computer's USB state. |
| Remote network cannot reach the port | Device address, VPN routing and firewall policy. The VNC switch does not create router forwarding rules; see [remote access](../network/internet-access/overview.md). |

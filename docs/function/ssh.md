# Device terminal and SSH

**Settings → Advanced & Diagnostics → SSH Terminal** opens BliKVM's own management shell, rather than the controlled computer's desktop or serial port. The web terminal uses an authenticated real-time channel.

## Web terminal

1. Sign in with device-terminal permission.
2. Open the terminal and identify the environment with read-only commands such as `date` and `uname -a`.
3. Perform maintenance appropriate to the image. Close the terminal and sign out when finished.

An administrator terminal can change the device system. Unknown scripts, incorrect partition commands and network changes can interrupt remote access. A disconnected page does not necessarily stop a background task.

## Separate SSH client

If the image provides SSH, connect using the actual address, port and OS account:

```sh
ssh username@device-address
```

Web and OS accounts are managed separately. Neither `admin/admin` nor an old image's `blikvm/blikvm` is guaranteed to apply. If a host fingerprint changes, check for reinstallation or reset before updating trust.

For a connected device's serial port use the [serial terminal](./serial-terminal.md). The current web terminal does not require storing an OS SSH password in old web configuration.

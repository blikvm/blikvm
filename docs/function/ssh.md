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

## Persistent Linux users on native A/B systems

Pi4B, V4 and RV1126B system/App `3.0.5-dev.2026111502` introduces native account
management with the same commands on all three platforms. Install the matching
signed **system update** first; an App-only update does not add this OS feature.
As root:

```sh
adduser ops
passwd ops
```

The commands prompt for passwords. Connect with `ssh ops@BLIKVM_ADDRESS`; the
user can change its own password using `passwd`. The default `/home/ops` lives
on persistent `/data/home`. Public-key login uses the normal
`/home/ops/.ssh/authorized_keys`: owned by `ops`, `.ssh` mode 0700 and file mode
0600. Web accounts and their roles are independent of these Linux accounts. The runtime `blikvm.env` file can contain Web management credentials and is readable only by root.

To grant full system administration, run as root:

```sh
addgroup ops wheel
```

Reconnect as `ops`, then run `sudo -i` and enter **ops's own password**. Use
`delgroup ops wheel` to revoke the role; existing privileged sessions must also
be closed. Use `deluser ops` to remove the login account; its home remains unless
explicitly removed. Avoid reusing a removed account's UID while its files remain.
No separate Web interface is provided for Linux users.

The existing root password, root authorized keys and SSH host identity are
preserved. Root can still run `passwd root`; the Web SSH-password action still
changes root only and requires the current root password. Keep a working root
connection while verifying a new login.

Supported App and A/B updates preserve custom users, passwords, memberships and
homes. The root filesystem remains read-only; native commands update dedicated
persistent account files through system-owned links. Do not replace these links
or attempt to remount SquashFS writable. Custom boot services use the same
[System Scripts](./scripts.md) directory and executor as the Web interface.

An old system does not support this account layout. New users are unavailable
there, and passwords changed under the new layout are not mirrored into the
legacy root-only store. New data remains when returning to a supporting system;
this is not a promise of old-system credential compatibility. Factory reset
removes custom users and homes. Back up data before reflashing.

The OS keeps `/data/work/conf` root-owned with mode 0700. This also protects
credentials if an older App recreates a 0644 configuration file during rollback.
Use a matching system/App for the new script-management layout.

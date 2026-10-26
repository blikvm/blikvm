# Factory reset

Open **Settings → Device & System → Factory Reset**. This deletes managed user data; it is different from a reboot, app rollback or system reinstallation.

## What is removed and retained

| Removed | Not restored or deleted by this action |
| --- | --- |
| Device accounts, passwords, 2FA, sessions and API tokens | Installed app / OS versions and update rollback metadata |
| Settings, network / VPN / plugin state and cloud binding | Hardware identity and calibration |
| Custom EDID, scripts, terminal history and virtual media | Browser preferences and the image's built-in SSH password |
| TLS certificates and SSH host keys | Unmanaged files, manual credential backups and external data |

This is not secure erasure. Software rollback cannot recover deleted user data.

## Preparation and procedure

1. Back up needed files and settings, arrange physical recovery access, finish media writes and eject.
2. As an administrator, review the deletion scope and enter your current password and 2FA code if enabled.
3. Review the final confirmation and submit. The device queues the reset and goes through two reboots; wait for completion.
4. Networking may return to DHCP. Find the address again and verify the new TLS / SSH fingerprints before trusting them.
5. Reconfigure accounts, network and services, then verify basic functions.

The feature is available only on images with the native data layout and default initialization mechanism. Do not force-delete directories after failed prechecks. An interrupted reset may retain a reset request and prevent app startup; resolve the reported cause rather than deleting the request to hide an incomplete state.

If cloud unbinding was not confirmed, remove the device manually in the cloud console too. No factory reset was executed while preparing this documentation.

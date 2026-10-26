# Storage space and data

The current native system separates application files, runtime data and private credentials. Virtual-media space is not the same as free space on the root filesystem.

## Inspect and free space

1. Check image and flash-drive storage usage in **Virtual Media**.
2. Finish writes and eject on the controlled computer before deleting unused images or files.
3. Use [diagnostics](./diagnostics.md) to distinguish logs, failed uploads, images and other usage.
4. Back up before any offline partition adjustment and follow the installed image's layout instructions.

## Avoid old expansion commands

A/B systems have active, standby and data areas. Old instructions that resize a fixed `/dev/mmcblk0p2`, run `raspi-config` or arbitrary scripts can damage boot and rollback layouts. A larger card does not mean every partition needs manual expansion.

Reinstallation and factory reset can lose data; updates are not backups. Save required virtual-media files, VPN configuration and custom scripts separately, protecting private keys and account backups.

See [Persistent directories and logs](../development/architecture.md) for file locations. Ordinary use does not require deleting state directories or remounting the entire read-only system writable.

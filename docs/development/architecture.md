# Persistent directories and logs

These common device paths help with inspection and maintenance through [SSH](../function/ssh.md) or the device terminal. They describe current image defaults; older images and custom deployments may differ.

## Persistent directories

| Path | Contents / purpose |
| --- | --- |
| `/data/work/conf/` | Device configuration; the common environment file is `blikvm.env` |
| `/data/work/state/` | Persistent app state and function settings; files depend on enabled functions |
| `/data/work/msd/images/` | Virtual-media images |
| `/data/vault/` | Private certificates and keys; TLS files are usually `tls/server.crt` and `tls/server.key` |
| `/data/app/` | Installed application and web assets; `ui-dist/` holds the UI and is managed by updates |

### Inspect or edit configuration

Check the directory and back up the specific file first. For example:

```sh
cd /data/work/conf
ls -lah
cp -p blikvm.env "blikvm.env.backup-$(date +%Y%m%d-%H%M%S)"
vi blikvm.env
```

Appropriate OS permissions are required. If a file is absent, check the installed image's layout rather than creating it and assuming it will be read. Some older startup scripts use `/userdata/conf/blikvm.env`; inspect the actual startup configuration.

Saving a file does not apply it automatically. Reload or restart as required by the function. Prefer web settings to avoid conflicting manual and UI writes. Updates may replace `/data/app/`; keep lasting configuration in its designated directory.

## Logs

Common logs are in `/var/log/`. An image may provide only some of these:

| File | Purpose |
| --- | --- |
| `/var/log/kvmserver.log` | Application startup and runtime |
| `/var/log/blikvm-go-server.log` | Application log used by some images |
| `/var/log/blikvm-update-restart.log` | Updates and service restart |
| `/var/log/blikvm-app-track-health.log` | App health tracking and rollback |
| `/var/log/blikvm-lcd.log` | v4 display service, when installed |

Inspect available files before selecting a log:

```sh
ls -lh /var/log/*blikvm* /var/log/kvmserver.log
# Last 100 lines
tail -n 100 /var/log/kvmserver.log
# Follow new lines; Ctrl+C to stop
tail -f /var/log/kvmserver.log
```

`/var/log/` may not survive reboot; save evidence promptly. Depending on the image, crash records may be in `/data/work/crashdump/` or `/data/work/state/crashdump/`. Use actual device configuration. You can also export a [diagnostic bundle](../function/diagnostics.md).

Private keys, account state and logs may contain sensitive data. Review before sharing. Do not clear all of `/data/work/` to fix one setting.

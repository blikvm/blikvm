# System scripts and third-party software

**3.0.5 stable package compatibility:** App 3.0.5 requires System 3.0.5 or newer on all three platforms. Upgrade an older system, including a 3.0.5 development system, with its matching signed system package before installing the App. The development-version references below record when individual features first became available.

BliKVM can store third-party programs and their configuration on persistent storage and manage manual tasks, startup tasks and resident services through System Scripts. Use the Web interface or manage the same files over SSH.

Scripts execute on **BliKVM itself**, not on the controlled computer, and are separate from browser keyboard macros. Only administrators can manage scripts in the Web interface. The SSH examples require root access to the device.

This guide applies to system/App `3.0.5-dev.2026111502` and later supporting the unified script executor. An older system may have a scripts page without the corresponding startup service. An App update alone may not add that capability; follow the release notes for the matching system update.

## Where to store software and configuration

Use `/data/work/extensions/<software-name>/` for third-party software. Create subdirectories such as `bin/`, `config/` and `state/` as needed.

For a program called `myservice`:

| Path | Purpose |
| --- | --- |
| `/data/work/extensions/myservice/` | Program, dependencies, configuration and data to retain |
| `/data/init.d/myservice.sh` | Startup script shown in System Scripts |
| `/data/init.d/.config/myservice.sh.conf` | Execution mode and restart policy |
| `/data/init.d/.state/myservice.sh/` | Execution status, managed-task output log and working directory |
| A software-specific directory under `/run/` | Temporary sockets, PID files and other files recreated after a reboot |

Routine App and A/B system updates preserve these persistent data. **Factory reset removes managed scripts, settings and extension software. Back up important data separately before reflashing an image as well.**

Script management starts processes; it does not install software dependencies. Choose software compatible with the device CPU architecture, libraries and kernel capabilities. Copying an installation archive into the extension directory does not complete its installation.

## Manage scripts in the Web interface

Open **Settings → Maintenance → System Scripts**.

1. Prepare a `.sh` file beginning with `#!/bin/sh` (POSIX) or `#!/bin/bash` (Bash), upload it and select **View**. Bash scripts require system/App `3.0.5-dev.2026111605` or later.
2. For a short task, keep **Manual only** and select **Run** to inspect its output.
3. For long-running software, choose **Resident service** and configure the restart policy and delay. Do not use manual execution to keep VPN clients or similar daemons running.
4. Changes to the mode and policy are saved and applied automatically. Check that the state becomes **Running**, and inspect the log if needed.
5. To stop a service and disable startup, choose **Manual only**. In a managed mode, **Restart** asks the executor to stop the old process before starting a replacement.

The power icon in the list indicates startup status. Change the execution mode under **View**; the icon is not a separate start/stop control.

### Execution modes

| Mode | Behavior | Typical use |
| --- | --- | --- |
| Manual only | Does not start at boot; runs only when explicitly requested | Short checks and maintenance tasks |
| Run once at startup | Runs once per device boot; first enablement, script or configuration changes, and explicit restart also trigger execution | One-time initialization tasks |
| Resident service | Starts when enabled, starts again at subsequent boots and handles exits according to the selected policy | Foreground VPN clients, monitoring agents and similar services |

Manual execution in the Web interface has a 60-second limit and displays up to 128 KiB of output. Resident tasks do not have this manual-execution time limit.

### Restart policies

| Policy | Behavior |
| --- | --- |
| Restart on failure `on-failure` | Restarts after an abnormal exit or a nonzero exit code; does not restart after a successful exit |
| Always restart `always` | Restarts after any exit, including a successful exit |
| Do not restart `never` | Leaves an exited process stopped until an explicit restart |

The restart delay accepts 1–60 seconds. One-time startup tasks do not use the resident-service restart policy.

**Running** means the process is executing, not that its application connection has succeeded. For example, check a VPN client's own status command to confirm connectivity.

## One directory and one executor

The Web interface, SSH and boot startup share `/data/init.d/` and the same OS-owned executor. These directories are root-private; an SSH administrator can use `sudo` after joining `wheel` (see [Linux accounts](./ssh.md)).

The first supporting system boot migrates old scripts and policies automatically. Original script/config directories are archived in `/data/init.d/.legacy-backup/`; the old runtime directory moves to `.state` so relative working files survive. Existing names, modes and restart policies are retained. Raw supported shell scripts are automatically adapted with their original start body preserved. Migration conflicts stop without overwriting either copy and can be retried after resolving the conflict. New raw imports retain a content-addressed original in `.legacy-backup/imports`.

For a new script, use `start/stop/status`, with the marker immediately after the shebang:

```sh
#!/bin/sh
# BLIKVM_INITD=1
case "${1:-start}" in
  start) exec /data/work/extensions/myservice/bin/myservice ;;
  stop) : ;; # The executor stops the owned foreground process group.
  status) exec /etc/init.d/S98blikvm-scripts status myservice.sh ;;
  *) exit 2 ;;
esac
```

Foreground services are preferred. A daemonized program must implement its own real `stop` and `status` actions: `status` returns zero only while that instance is alive. These actions have a two-second execution bound. The executor retains the running script snapshot for stopping it, even if its source is replaced. If a daemon fails to stop, the executor reports failure, retains its ownership record and refuses to start a replacement. Correct its stop action before retrying.

An SSH-created `SNN*.sh` with no policy defaults to once at startup, in filename order. Other unconfigured names default to manual. A new Web upload explicitly defaults to manual; editing an existing SSH startup script preserves its policy.

App and supporting A/B updates preserve the new layout. An old OS does not read `/data/init.d`: migration does not provide old-OS startup compatibility. Preserve migration backups until the new system is verified; stop the active owner before any manual restoration. Factory reset also clears custom Linux accounts and homes.

## Use the command line over SSH

Connect from your computer, replacing `BLIKVM_ADDRESS` with the device address:

```sh
ssh root@BLIKVM_ADDRESS
```

Unless a command is explicitly marked as running on your computer, run the following commands in the BliKVM SSH terminal.

Check the startup executor first:

```sh
/usr/libexec/blikvm-script-supervisor version
/etc/init.d/S98blikvm-scripts status
```

The executor described here uses protocol version `3`. If a file is missing, the service is unavailable or only a legacy script entry exists, check the system and App versions first. Do not remount the system partition to add startup files manually.

### Upload a third-party program

Download and extract a compatible program first. Run the following upload example **on your computer**; `./myservice` is the program file you have prepared:

```sh
ssh root@BLIKVM_ADDRESS \
  'mkdir -p /data/work/extensions/myservice/bin && cat > /data/work/extensions/myservice/bin/myservice.new && chmod 700 /data/work/extensions/myservice/bin/myservice.new && mv -f /data/work/extensions/myservice/bin/myservice.new /data/work/extensions/myservice/bin/myservice' \
  < ./myservice
```

This uses SSH without requiring an SFTP server on the device. Place the program's other required files in its own extension directory. Before updating running software, stop its service as described below.

### Create a working example service

This example writes a log line every 10 seconds and needs no additional software. For a real deployment, replace the example program in its extension directory with your software.

```sh
umask 077
mkdir -p /data/work/extensions/demo-service \
  /data/init.d /data/init.d/.config

cat > /data/work/extensions/demo-service/run.sh <<'EOF'
#!/bin/sh
while :; do
    printf '%s demo-service is running\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    sleep 10
done
EOF
chmod 700 /data/work/extensions/demo-service/run.sh

cat > /data/init.d/demo-service.sh <<'EOF'
#!/bin/sh
exec /bin/sh /data/work/extensions/demo-service/run.sh
EOF
chmod 700 /data/init.d/demo-service.sh
```

For a binary program, a startup script can use this form. Adjust the arguments according to that program's documentation:

```sh
#!/bin/sh
exec /data/work/extensions/myservice/bin/myservice \
    --config /data/work/extensions/myservice/config/config.json
```

Keep this example in the foreground. For software that daemonizes, use a native init script with correct stop/status actions as described above. Use absolute paths, because the script's default working directory is `/data/init.d/.state/<script-name>/`.

### Start a service and enable startup

Write the configuration for the example:

```sh
cat > /data/init.d/.config/.demo-service.tmp <<'EOF'
MODE=service
ENABLED=1
RESTART_POLICY=on-failure
RESTART_DELAY_SEC=5
EOF
mv -f /data/init.d/.config/.demo-service.tmp \
  /data/init.d/.config/demo-service.sh.conf
```

The executor applies it automatically; there is no need to restart the device or Web service. Scripts created over SSH also appear in the Web script list.

Configuration is one `KEY=VALUE` per line, not a shell script. Do not add `export`. Write to a temporary file and rename it so the executor does not read a partially written configuration.

### Inspect status and logs

After the first start, run:

```sh
cat /data/init.d/.state/demo-service.sh/status
tail -n 80 /data/init.d/.state/demo-service.sh/output.log
```

Follow new output:

```sh
tail -f /data/init.d/.state/demo-service.sh/output.log
```

Pressing `Ctrl+C` stops the log viewer, not the service. In the status file, `STATE=running` means the process is running, `STATE=backoff` means it is waiting for a policy-driven restart, and `RESTART_COUNT` counts automatic restarts of the current managed task.

Managed scripts write standard output and standard error to `output.log`, which retains approximately the latest 1 MiB. Logs written directly by the software follow that software's own settings.

### Control a task through the shared executor

```sh
/etc/init.d/S98blikvm-scripts start demo-service.sh
/etc/init.d/S98blikvm-scripts status demo-service.sh
/etc/init.d/S98blikvm-scripts restart demo-service.sh
/etc/init.d/S98blikvm-scripts stop demo-service.sh
```

`stop` leaves the task stopped for the current executor session. Set manual mode below to disable the next boot startup too. `start` on an already running task does not duplicate it. Use the controller rather than executing a managed script directly.

### Restart requests from other integrations

For a **Resident service** or **Run once at startup** task, write a new restart request:

```sh
mkdir -p /data/init.d/.state/demo-service.sh
cat /proc/sys/kernel/random/uuid \
  > /data/init.d/.state/demo-service.sh/restart.tmp
mv -f /data/init.d/.state/demo-service.sh/restart.tmp \
  /data/init.d/.state/demo-service.sh/restart
```

Each request has different content, allowing the executor to recognize it. **Manual only** tasks do not respond to this request.

Changes to a startup script under `/data/init.d/` or its `.conf` trigger reapplication. After replacing a program inside the extension directory, or changing that program's own configuration, restart the task explicitly. This request also starts a service again after a successful exit when its policy is `on-failure` or `never`.

Do not restart a resident task by running `sh /data/init.d/demo-service.sh` again. That bypasses the executor and may create a second instance.

### Stop a service and disable startup

```sh
cat > /data/init.d/.config/.demo-service.tmp <<'EOF'
MODE=manual
ENABLED=0
RESTART_POLICY=never
RESTART_DELAY_SEC=5
EOF
mv -f /data/init.d/.config/.demo-service.tmp \
  /data/init.d/.config/demo-service.sh.conf
```

The executor stops the managed process and its descendants. To start again from this disabled state and restore startup, write the earlier `MODE=service` configuration again.

Do not use `kill` as a substitute for disabling the task: if its configuration remains enabled, the executor may start it again according to its restart policy.

### Run a short task manually

Prepare a short script:

```sh
cat > /data/init.d/hello.sh <<'EOF'
#!/bin/sh
printf 'Hello from BliKVM\n'
printf 'Working directory: %s\n' "$PWD"
EOF

/etc/init.d/S98blikvm-scripts exec hello.sh
```

The controller prints a JSON result and uses the same working directory, log, status, 60-second limit and 128 KiB output limit as Web Run. Killing/disconnecting the control client cancels the manual task and its child processes. Use resident mode for long-running software.

### Run once at startup

Write the following configuration for the short task:

```sh
cat > /data/init.d/.config/.hello.tmp <<'EOF'
MODE=once
ENABLED=1
RESTART_POLICY=never
RESTART_DELAY_SEC=5
EOF
mv -f /data/init.d/.config/.hello.tmp \
  /data/init.d/.config/hello.sh.conf
```

It runs when first enabled and once after each subsequent boot. Restarting only the Web service does not repeat a completed task during the same boot. To run it again now, use the earlier restart-request commands with `hello.sh` in place of `demo-service.sh`.

### Remove a task and uninstall software

First select **Manual only** and confirm that the task has stopped (`STATE=stopped`, or an exited state with `PID=0`). Then remove its script and configuration:

```sh
rm -f /data/init.d/demo-service.sh \
  /data/init.d/.config/demo-service.sh.conf
```

The runtime directory may still contain historical logs and status. Clean it up if needed after confirming the task has stopped. **Deleting a script does not uninstall its extension software or automatically remove the software's configuration and identity.** Back up important data and remove the software's extension directory separately when it is no longer needed.

## Manage NetBird through System Scripts

NetBird can run as independent third-party software. The following example uses NetBird `0.81.5` for basic IPv4 peer access on V4; the script-management feature does not install it by default. Prepare its directories, then place the compatible official binary in the version directory:

```sh
umask 077
mkdir -p /data/work/extensions/netbird/versions/0.81.5 \
  /data/work/extensions/netbird/state \
  /data/init.d /data/init.d/.config
chmod 700 /data/work/extensions/netbird /data/work/extensions/netbird/state
```

```text
/data/work/extensions/netbird/
├── versions/0.81.5/netbird
├── run.sh
├── netbird
└── state/
```

Here, `netbird` is a CLI wrapper for daily use. `state/` retains authorization and identity; do not recreate or clear it on every start.

### Foreground launcher

Save this as `/data/work/extensions/netbird/run.sh`:

```sh
#!/bin/sh
set -eu
umask 077
ROOT=/data/work/extensions/netbird
STATE=$ROOT/state
mkdir -p /run/netbird "$STATE"
chmod 700 /run/netbird "$STATE"
export NB_STATE_DIR="$STATE"
export XDG_CONFIG_HOME="$STATE/xdg-config"
export NB_DISABLE_SSH_CONFIG=true
export NB_WG_KERNEL_DISABLED=true
export NB_USE_LEGACY_ROUTING=true
export NB_LOG_MAX_SIZE_MB=2
exec "$ROOT/versions/0.81.5/netbird" \
    --config "$STATE/default.json" \
    --daemon-addr unix:///run/netbird/control.sock \
    --log-file /run/netbird/client.log service run
```

These parameters use userspace WireGuard and legacy routing for this basic V4 peer-access example. Other platforms, subnet routing and exit-node scenarios require configuration appropriate to their firmware support; do not assume the same settings apply.

Save `/data/work/extensions/netbird/netbird` as the CLI entry:

```sh
#!/bin/sh
set -eu
export NB_STATE_DIR=/data/work/extensions/netbird/state
export XDG_CONFIG_HOME="$NB_STATE_DIR/xdg-config"
export NB_DISABLE_SSH_CONFIG=true
exec /data/work/extensions/netbird/versions/0.81.5/netbird \
    --config "$NB_STATE_DIR/default.json" \
    --daemon-addr unix:///run/netbird/control.sock \
    --log-file /run/netbird/client.log "$@"
```

Set permissions and create the script-management entry:

```sh
chmod 700 /data/work/extensions/netbird/run.sh \
  /data/work/extensions/netbird/netbird

cat > /data/init.d/netbird.sh <<'EOF'
#!/bin/sh
exec /data/work/extensions/netbird/run.sh
EOF
chmod 700 /data/init.d/netbird.sh
```

Choose **Resident service / Restart on failure / 5 seconds** in the UI, or write the following over SSH:

```sh
cat > /data/init.d/.config/.netbird.tmp <<'EOF'
MODE=service
ENABLED=1
RESTART_POLICY=on-failure
RESTART_DELAY_SEC=5
EOF
mv -f /data/init.d/.config/.netbird.tmp \
  /data/init.d/.config/netbird.sh.conf
```

For first use, authorize the account after the service starts:

```sh
/data/work/extensions/netbird/netbird up --no-browser \
  --disable-dns --disable-client-routes --disable-server-routes
```

Open the authorization URL shown in the terminal and sign in to your own account. This example provides peer access without taking over DNS or enabling client/server routes. When authorization files already exist, stop the old instance, preserve and migrate its complete identity directory, update old paths and then enable the new entry. Do not delete the existing identity just to migrate it.

For daily checks:

```sh
/data/work/extensions/netbird/netbird status
tail -n 80 /run/netbird/client.log
```

To restart or disable NetBird, use the same script-management commands above with `netbird.sh` in place of `demo-service.sh`. The executor starts it after a device reboot. Cloud session expiry remains subject to the NetBird account's authorization policy.

## Troubleshooting

- **The UI reports an unavailable executor:** Check the matching system and App versions and `S98blikvm-scripts status`. Startup execution is a system capability; having a frontend page does not mean an old system already includes it.
- **A script cannot be uploaded or executed:** Names must start with an English letter or digit, contain only letters, digits, periods, underscores and hyphens, and end in `.sh`. Files must be regular files, not symlinks, and no larger than 256 KiB. Begin with `#!/bin/sh`, use LF line endings and avoid Bash-specific syntax.
- **A task stays in restart backoff:** Inspect `LAST_EXIT_CODE` and logs. Check the program path, dependencies, permissions and configuration rather than only reducing the delay.
- **The process is running but the VPN is not connected:** Inspect the VPN's own status, network, account authorization and software logs. The executor does not treat process liveness as a successful application connection.
- **A stopped process starts again:** Confirm `MODE=manual` and `ENABLED=0`, and rule out another independent startup method. Use one startup manager per resident process.
- **Configuration disappears after reboot:** Check that the program's configuration, identity and databases are stored in its extension directory. Do not store data that must survive a reboot under `/run/`.

For standalone HTTPS renewal reference scripts and configuration, see [Certificate import and optional renewal](../network/certificates.md).

## Bash scripts

With system/App `3.0.5-dev.2026111605` or later, Web uploads, SSH-created files,
manual execution and boot services all honor the exact first line: `#!/bin/sh`
or `#!/bin/bash`. Bash scripts are syntax-checked and run with Bash, including
native `start/stop/status` actions. They do not source interactive login files.
The running snapshot retains its interpreter for cleanup after a source edit.
An older executor rejects Bash uploads with a system-update message.
`#!/usr/bin/env bash` and shebang arguments are not supported.

For example, upload this as a manual task:

```bash
#!/bin/bash
items=(one two three)
printf '%s\n' "${items[@]}"
```

Changing a shebang does not convert Bash syntax into POSIX syntax. Keep
`#!/bin/sh` on scripts intended for that interpreter.

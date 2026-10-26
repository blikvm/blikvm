# System scripts

Open **Settings → Advanced & Diagnostics → System Scripts**. Administrators manage scripts executed on BliKVM itself, not the controlled computer or browser keyboard macros.

## Upload and run

1. Prepare a compatible `.sh` file. The interpreter is POSIX `/bin/sh`; do not assume Bash extensions are available.
2. Review uploaded contents, run manually and inspect exit status and logs.
3. Confirm reliable manual operation before choosing startup execution.

## Execution modes

| Mode | Behavior |
| --- | --- |
| Manual only | Runs only when explicitly requested. |
| Once at startup | Runs a startup task, not a persistent service. |
| Persistent service | Manages a long-running process with always, on-failure or no restart, and a restart delay. |

Running, restart backoff, exited and failed are distinct states. Saving a configuration does not establish task completion. A faulty persistent task may consume resources repeatedly; check restart policy and device load.

Scripts may access device data and network. Avoid unknown scripts and credentials in shared files. Factory reset removes managed scripts and settings; back up important content separately.

#!/bin/sh
# Copy to /data/work/scripts/certificate-renewal.sh and enable service mode.
set -u
BASE=${BLIKVM_ACME_DIR:-/data/work/extensions/lego}
interval=${BLIKVM_ACME_INTERVAL:-43200}
case "$interval" in ''|*[!0-9]*) echo 'Invalid renewal interval' >&2;exit 1;; esac
[ "$interval" -ge 1 ] && [ "$interval" -le 86400 ] || exit 1
sleeper=
trap '[ -z "$sleeper" ] || kill "$sleeper" 2>/dev/null; exit 0' TERM INT
while :; do
 if "$BASE/bin/renew-once.sh"; then
  printf 'Certificate renewal check completed\n'
 else
  printf 'Certificate renewal check failed; inspect the extension log\n' >&2
 fi
 sleep "$interval" & sleeper=$!
 wait "$sleeper"
 sleeper=
done

#!/bin/sh
# Optional extension. Never installed or enabled by the default App.
set -eu
umask 077
BASE=${BLIKVM_ACME_DIR:-/data/work/extensions/lego}
CONFIG="$BASE/config/renewal.env"
[ -r "$CONFIG" ] || { echo 'ACME configuration is missing' >&2; exit 1; }
# This root-owned file is trusted shell configuration, not an HTTP input.
. "$CONFIG"
: "${ACME_DOMAIN:?Set ACME_DOMAIN in renewal.env}"
: "${ACME_DNS_PROVIDER:?Set ACME_DNS_PROVIDER in renewal.env}"
: "${ACME_ACCEPT_TOS:?Accept the CA subscriber agreement before setting ACME_ACCEPT_TOS=1}"
[ "$ACME_ACCEPT_TOS" = 1 ] || exit 1
[ -x "$BASE/bin/lego" ] || { echo 'Install the official lego client first' >&2; exit 1; }
command -v flock >/dev/null || { echo 'flock is required for exclusive renewal' >&2; exit 1; }
mkdir -p "$BASE/state/production"
exec 9>"$BASE/state/renew.lock"
flock -n 9 || exit 0
export ACME_DOMAIN
set -- run --domains "$ACME_DOMAIN" --dns "$ACME_DNS_PROVIDER" --path "$BASE/state/production" --account-id "${ACME_ACCOUNT_ID:-blikvm}" --server "${ACME_SERVER:-letsencrypt}" --accept-tos --http-timeout 30 --cert.timeout 120 --deploy-hook "$BASE/bin/deploy.sh"
if [ -n "${ACME_DNS_RESOLVER:-}" ]; then set -- "$@" --dns.resolvers "$ACME_DNS_RESOLVER"; fi
"$BASE/bin/lego" --log.format text "$@"

# Also retry a previously failed deployment when the certificate is not due.
"$BASE/bin/deploy.sh"

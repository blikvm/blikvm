#!/bin/sh
set -eu
umask 077
BASE=${BLIKVM_ACME_DIR:-/data/work/extensions/lego}
. "$BASE/config/renewal.env"
: "${ACME_DOMAIN:?ACME_DOMAIN is required}"
# One DNS hostname only: do not permit paths, wildcards or multiple names.
case "$ACME_DOMAIN" in ''|*[!a-zA-Z0-9.-]*|.*|*..*|-*|*.) echo 'Use one DNS hostname' >&2; exit 1;; esac
exec "${BLIKVM_SERVER_BIN:-/data/app/server/kvmserver}" --subcomponent certificate-import \
 --certificate-file "$BASE/state/production/certificates/$ACME_DOMAIN.crt" \
 --private-key-file "$BASE/state/production/certificates/$ACME_DOMAIN.key"

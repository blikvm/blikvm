# IP access rules and audit

Authentication determines who may act; IP rules restrict where access originates. Open **Settings → Accounts & Security → IP Access Control** as administrator.

## Set IP rules

1. Identify the current source and record an alternate administrator entry. VPNs and proxies can change the address seen by the device.
2. Add IPv4, IPv6 or CIDR entries to the allowlist or blocklist.
3. Review entries and select allowlist, blocklist or disabled mode.
4. Verify from the actual management network after applying.

Allowlist mode requires valid entries. The implementation rejects changes directly blocking the current source, but that does not guarantee every future proxy route will work. Arbitrary forwarded headers are not automatically verified client addresses.

## Audit and automation credentials

Administrators can inspect the audit area in account management. `GET /api/v1/audit` requires audit-read permission. Interpret events using actor, time, action and result; a request record does not prove hardware action completion.

Personal API tokens can receive a subset of the account's permissions and an expiry. Full tokens appear only when created; save them securely and revoke them when no longer needed. See [Accounts](../getting-started/auth.mdx) and [API](../development/api.mdx).

Browser sessions, API tokens, VPN keys and OS SSH credentials have independent lifecycles. Troubleshoot authentication, permissions, IP rules, network and capabilities separately.

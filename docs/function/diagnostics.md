# Troubleshooting, logs and monitoring

Open **Settings → Advanced & Diagnostics → Troubleshooting** with the required management permissions.

## Collect information

1. Record model, app / system versions, browser, selected mode and reproduction steps.
2. Compare LAN and remote behavior. Identify power, HDMI, USB, network, authentication or update-task failures.
3. Adjust log level if necessary, reproduce once, then view live logs or download diagnostics.
4. Restore the normal log level afterward. The page states that reboot returns it to warning level; do not retain debug logging indefinitely.

Diagnostic bundles may contain configuration, logs, addresses and device details. Review sensitive content before sharing; do not publish full private configuration or tokens. Export success does not prove a problem was fixed.

## Video and system monitoring

- See [HDMI analysis and latency](../video/latency.md) for video details.
- Enable Prometheus in advanced settings if needed and check its status. Collectors must meet API authentication and permissions; do not expose monitoring publicly by default.
- For permission errors check roles; for missing capabilities check image components before reinstalling drivers.

## Support template

```text
Device model / app version / system version:
Browser and OS:
Access path (LAN, VPN, proxy, etc.):
Repeatable reproduction steps:
Expected / actual result:
LAN comparison and exact error text:
Log excerpt with credentials removed:
```

Demo status and read-only checks do not count as hardware validation. See the [FAQ](../getting-started/faq.mdx) for an initial checklist.

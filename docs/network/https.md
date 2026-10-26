# HTTPS, certificates and web ports

The current web interface uses HTTPS, with HTTP serving redirects. Open **Settings → Network → Web Service Ports** and use the configuration reported by your device.

## Change ports

1. Record the current HTTPS address and check that new ports are unused.
2. Enter the HTTP redirect and HTTPS ports, then **Save and apply**.
3. The service restarts and may interrupt video and terminals. Reconnect using the new address, retaining `:port` for nondefault ports.
4. Update reverse proxies, router mappings, bookmarks and firewalls as needed.

## First access and trusted certificates

Self-signed certificates may trigger a browser warning. The administrator should check address and certificate before managing trust; unfamiliar-site warnings should not be ignored. Camera, microphone and clipboard functions generally need a secure context. Page access alone does not establish browser permission.

A [reverse proxy](./internet-access/reverse-proxy.md) can provide certificates for a trusted domain. Device certificate locations are documented in [Persistent directories and logs](../development/architecture.md). There is no universal web certificate-upload wizard. Certificate renewal, key permissions and service restart depend on the installed image, rather than old `app.json` settings.

Factory reset regenerates device TLS and SSH identities and may change the address. Verify fingerprints again. Browser trust and preferences are not automatically cleared by device reset.

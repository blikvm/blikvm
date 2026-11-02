# HTTPS, certificates and web ports

The current web interface uses HTTPS, with HTTP serving redirects. Open **Settings → Network → Web Service Ports** and use the configuration reported by your device.

## Change ports

1. Record the current HTTPS address and check that new ports are unused.
2. Enter the HTTP redirect and HTTPS ports, then **Save and apply**.
3. The service restarts and may interrupt video and terminals. Reconnect using the new address, retaining `:port` for nondefault ports.
4. Update reverse proxies, router mappings, bookmarks and firewalls as needed.

## First access and trusted certificates

Self-signed certificates may trigger a browser warning. The administrator should check address and certificate before managing trust; unfamiliar-site warnings should not be ignored. Camera, microphone and clipboard functions generally need a secure context. Page access alone does not establish browser permission.

Apps with certificate management support manual import and hot loading under **Settings → Network → HTTPS & Certificates**. See [Certificate import and optional renewal](./certificates.md) for steps and ACME reference scripts. Update a matching App if this entry is absent on an older version. A [reverse proxy](./internet-access/reverse-proxy.md) can also provide domain certificates; see [Persistent directories and logs](../development/architecture.md) for storage paths.

Factory reset regenerates device TLS and SSH identities and may change the address. Verify fingerprints again. Browser trust and preferences are not automatically cleared by device reset.

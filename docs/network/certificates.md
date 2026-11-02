# Certificate import and optional renewal

## Choose the task first

- **Replace a certificate only**: open Settings → Network → HTTPS & Certificates, select the certificate chain and matching unencrypted PEM private key, validate, review the domain/validity result, then apply. Neither lego nor DNS API credentials are needed. New HTTPS connections use the new identity while established connections remain open. Restoring the default requires confirmation and clients may need to trust its self-signed certificate.
- **Enable renewal**: follow the advanced setup below. Initial setup still needs a client, domain/DNS authorization, CA terms acceptance and startup configuration. Only after that does the worker check every 12 hours. The current Web interface has no one-click ACME installer or DNS-credential wizard.

Use an App that includes HTTPS & Certificates and the root certificate import command. Copying reference scripts cannot add that capability to an older App. Startup also requires a system with the [common script manager](../function/scripts.md). Check these commands in the device SSH terminal first:

```sh
/data/app/server/kvmserver --subcomponent certificate-status
/usr/libexec/blikvm-script-supervisor version
/etc/init.d/S98blikvm-scripts status
```

No third-party ACME client or renewal job is enabled by importing a certificate.


The default image does not install lego or enable renewal. Importing a certificate
in **Settings → Network → HTTPS & Certificates** also does not enable renewal.
Certificate management requires a real administrator browser session. API tokens
and no-auth mode cannot replace HTTPS identity. PEM private keys must be unencrypted.

This recipe targets lego **5.6.0** (v5 command syntax) and the App's root-only
`certificate-import` command. Reference scripts are maintained in the public documentation repository, not installed by the App.
All user software, settings and state stay under `/data/work/extensions/lego/`.


## Install the optional client and reference scripts

Obtain the matching ARM64 release from [https://github.com/go-acme/lego/releases/tag/v5.6.0](https://github.com/go-acme/lego/releases/tag/v5.6.0).
Check its SHA256 against the official checksum list before executing it. Pi4/CM4,
H616 and RV1126B are ARM64; other architectures need a matching client. Some
minimal images cannot decompress gzip with `tar`: unpack on your workstation and
copy the verified `lego` executable to the device instead. Do not disable TLS
verification to download it. Check `lego --version` after installation.

Download and unpack the [reference archive](../../static/examples/acme/acme-reference.zip) on your workstation to get `acme-reference/`. Verify it with [SHA256SUMS.txt](../../static/examples/acme/SHA256SUMS.txt); source files live in this repository under `static/examples/acme/`. This archive is not the lego client and does not install software or obtain DNS authorization.

With the verified raw `lego` executable prepared, run the following **on your workstation**, replacing `BLIKVM_ADDRESS`. `scp -O` uses legacy SCP without requiring an SFTP server on the appliance:

```sh
ssh root@BLIKVM_ADDRESS 'umask 077; mkdir -p /data/work/extensions/lego/bin'
scp -O -r ./acme-reference root@BLIKVM_ADDRESS:/data/work/extensions/lego/
scp -O ./lego root@BLIKVM_ADDRESS:/data/work/extensions/lego/bin/lego
```

Run the remaining commands **in the device SSH terminal** as root:

```sh
umask 077
mkdir -p /data/work/extensions/lego/bin /data/work/extensions/lego/config /data/work/extensions/lego/state/production
for name in renew-once.sh deploy.sh; do
  cp /data/work/extensions/lego/acme-reference/$name /data/work/extensions/lego/bin/$name
done
chmod 755 /data/work/extensions/lego/bin/lego /data/work/extensions/lego/bin/renew-once.sh /data/work/extensions/lego/bin/deploy.sh
cp /data/work/extensions/lego/acme-reference/renewal.env.example /data/work/extensions/lego/config/renewal.env
chmod 700 /data/work/extensions/lego /data/work/extensions/lego/config
chmod 600 /data/work/extensions/lego/config/renewal.env
```

Edit `renewal.env` as root: set a domain you control, its DNS provider, the ACME
server and provider authorization. Accept the CA's subscriber agreement yourself
before changing `ACME_ACCEPT_TOS` to `1`. Do not put credentials in script-management
UI text, shared logs, issue comments or Git. The environment file is trusted shell
code: only root should be able to modify it. Provider configuration differs; see
[https://go-acme.github.io/lego/dns/](https://go-acme.github.io/lego/dns/). The recipe takes one ordinary DNS hostname;
it does not configure wildcard or multi-domain certificates.

For Route 53, store a dedicated AWS shared-credentials file in
`/data/work/extensions/lego/config/aws.credentials`, owned by root with mode `600`.
Use a policy limited to the matching `_acme-challenge` TXT record and required
read operations, as documented at [https://go-acme.github.io/lego/dns/route53/](https://go-acme.github.io/lego/dns/route53/).
Do not copy a broad administrator key onto the device. Other providers use their
own environment variables in the protected environment file.

If a LAN resolver caches NXDOMAIN, set `ACME_DNS_RESOLVER` to a reachable recursive
resolver, including `:53`. This affects lego only; it does not change global DNS or
skip CA ownership validation. The device needs correct time, outbound HTTPS and
working DNS. DNS-01 does not require inbound public access to the KVM.

## First run, installation and periodic renewal

```sh
/data/work/extensions/lego/bin/renew-once.sh
```

This obtains a certificate if absent, otherwise lets lego decide whether renewal
is due. A successful run installs the pair using the root CLI. A deploy failure
is retried on the next successful check even when the certificate is not due.
The App validates identity, validity and chain structure before committing a
versioned pair. New TLS handshakes use the updated identity without restarting
the web server; established streams and TLS connections remain open. Importing
an internal/self-signed CA does not make browsers trust it automatically.

To enable persistent checks every 12 hours:

```sh
mkdir -p /data/work/scripts /data/work/scripts-config
cp /data/work/extensions/lego/acme-reference/certificate-renewal.sh /data/work/scripts/certificate-renewal.sh
cp /data/work/extensions/lego/acme-reference/certificate-renewal.sh.conf /data/work/scripts-config/certificate-renewal.sh.conf
/etc/init.d/S98blikvm-scripts start
```

The configuration is `MODE=service`, `ENABLED=1`,
`RESTART_POLICY=on-failure`, `RESTART_DELAY_SEC=5`. The existing supervisor notices
new scripts, starts them at boot and manages their process groups. In the UI,
**Advanced → Scripts** shows the process and logs; Stop alone is temporary. To
keep it stopped across restart, select Manual mode or disable its configuration.
CLI users can set `MODE=manual` and `ENABLED=0` in the same `.conf` file. The
supervisor reads it without changing read-only system files. Never place DNS
credentials in this supervisor configuration: it is not a secret store.

Only enable this after a successful first run and after configuring credentials
that will remain valid. Short-lived test credentials are unsuitable for long-term
renewal. Process running is not proof that DNS renewal succeeded: inspect the
latest check log and certificate expiry. The recipe intentionally keeps checking
after a transient error and leaves the last installed certificate in use.

## Manual root import and recovery

```sh
/data/app/server/kvmserver --subcomponent certificate-import \
  --certificate-file /root/fullchain.pem --private-key-file /root/privkey.pem
/data/app/server/kvmserver --subcomponent certificate-status
```

The CLI commits validated files locally and needs neither an API token nor a
browser password. A running App refreshes committed generations within about one
second; a stopped App reads the identity on startup. CLI output confirms the
stored identity, not a network connectivity probe. Test using the certificate's
hostname, not its LAN IP. An explicit HTTP(S) proxy may need a direct-routing
exception for an internal hostname.

Managed pairs live next to the configured certificate, normally under
`/data/vault/tls/server.crt.managed/`; canonical certificate/key paths resolve
through a shared `current` symlink. Keep the complete TLS directory when backing
up; copying only the two symlinks is insufficient. Do not overwrite these links
with `cp`: use the UI or CLI import. Previous generations remain available for
root recovery. User certificates are not silently replaced on expiry; the UI
reports expired/not-yet-valid status. A factory reset deletes managed identities
and extensions; A/B/App updates retain `/data` in the supported layout.

Do not install staging certificates on a device used for normal browsing.
Use a separate protected state directory and test domain for staging experiments;
this production recipe intentionally does not expose a force-renew switch.

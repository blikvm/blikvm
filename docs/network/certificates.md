# HTTPS certificates and optional automatic renewal

## Replace your own certificate

Open **Settings → Network → HTTPS & Certificates**. Select the PEM certificate
chain and matching unencrypted PEM private key, validate them, review the domain
and validity information, then apply. No DNS credentials or ACME client are needed.
New connections use the validated certificate without restarting the App.
Restoring the default requires confirmation; clients may need to trust its
self-signed certificate again.

Certificate changes require an actual administrator browser session. API tokens
and no-auth mode cannot replace the device's HTTPS identity. Importing a
certificate does not install or enable automatic renewal.

## Optional guided renewal setup

The optional `blikvm-acme` command combines client installation, protected DNS
configuration, initial issuance, deployment and startup management. The image does
not include lego or enable renewal by default. The tool and examples are maintained
in this documentation repository, not bundled into the backend App.

Requirements:

- A compatible App with the root certificate-import command, and a system with the
  [common script manager](../function/scripts.md).
- An ARM64 Pi4/CM4, V4/H616 or RV1126B image with `curl`, `flock`, `sha256sum`,
  `gzip`, `tar` and standard BusyBox shell tools. Python is not needed on the KVM.
- A DNS hostname you control, working DNS, correct device time and outbound HTTPS.
  DNS-01 does not require exposing the KVM to the public Internet.
- Dedicated Route53 or Cloudflare DNS credentials. Other providers, wildcard names
  and multiple-domain certificates are outside this guided tool's scope.

Check App capability before running its certificate subcommands:

```sh
/data/app/server/kvmserver --help 2>&1 | grep -- '-certificate-file'
/usr/libexec/blikvm-script-supervisor version
```

If the first command finds nothing, update a matching signed App first. Copying
this tool cannot add certificate support to an older App. Confirm that the script
supervisor supports service mode before enabling startup.

### Copy the tool

Download the [reference archive](../../static/examples/acme/acme-reference.zip)
and [SHA256SUMS.txt](../../static/examples/acme/SHA256SUMS.txt), then verify the
archive checksum and extract it on your workstation. Source files are in
`static/examples/acme/`. These downloads contain the tool and reference scripts,
not the third-party lego executable or any DNS credentials.

Run on your workstation, replacing `BLIKVM_ADDRESS`:

```sh
ssh root@BLIKVM_ADDRESS 'umask 077; mkdir -p /data/work/extensions/lego/bin; chmod 700 /data/work/extensions/lego /data/work/extensions/lego/bin'
scp -O ./acme-reference/blikvm-acme root@BLIKVM_ADDRESS:/data/work/extensions/lego/bin/blikvm-acme
```

Then run in the device's SSH terminal as root:

```sh
chmod 700 /data/work/extensions/lego/bin/blikvm-acme
/data/work/extensions/lego/bin/blikvm-acme configure
```

The wizard asks for the hostname, DNS provider, credentials, optional recursive
resolver and acceptance of the current Let's Encrypt subscriber agreement. It
fetches official **lego 5.6.0 for linux/arm64**, checks the pinned archive and binary
SHA256 values, stores settings with root-only permissions, obtains and validates
the certificate, and offers to enable automatic checks after the first successful
run. Existing account data and HTTPS identity are retained on failure.

Secret input is hidden. You can also import a dedicated root-owned credentials
file with mode `600`. Do not put DNS secrets into process arguments, Git, issue
comments, or the System Scripts UI. The tool does not create DNS accounts or grant
DNS permissions for you.

For an offline installation, obtain the exact official archive from the
[lego 5.6.0 release](https://github.com/go-acme/lego/releases/tag/v5.6.0), copy it to
the KVM, and pass its absolute path. The same pinned checks remain mandatory:

```sh
/data/work/extensions/lego/bin/blikvm-acme configure --archive /data/work/extensions/lego/lego_v5.6.0_linux_arm64.tar.gz
```

### DNS authorization

**Route53:** use a dedicated AWS shared-credentials file with a `[default]` profile
containing `aws_access_key_id` and `aws_secret_access_key` (and
`aws_session_token` for temporary credentials). The wizard asks for region and an
optional hosted-zone ID. Limit writes to the matching `_acme-challenge` TXT record;
include only the required read operations described in the
[lego Route53 documentation](https://go-acme.github.io/lego/dns/route53/). Never copy
an administrator key onto the appliance.

**Cloudflare:** use an API token restricted to the relevant zone with **DNS:Edit**
and **Zone:Read**, as described in the
[lego Cloudflare documentation](https://go-acme.github.io/lego/dns/cloudflare/).
The tool passes it through protected token files, not command arguments. This
adapter needs its own real-provider acceptance test when used; mocked tests do
not prove that a user's DNS policy is sufficient.

Credentials must stay valid for continued renewal. Temporary test credentials
must be replaced with an appropriate long-term arrangement before leaving the
service enabled. If your resolver caches NXDOMAIN, the wizard can select a
reachable recursive resolver (`host:53`) for lego only. This does not change
system DNS or skip ownership validation.

### Commands and startup

```sh
/data/work/extensions/lego/bin/blikvm-acme status
/data/work/extensions/lego/bin/blikvm-acme renew
/data/work/extensions/lego/bin/blikvm-acme log
/data/work/extensions/lego/bin/blikvm-acme enable
/data/work/extensions/lego/bin/blikvm-acme disable
```

`renew` performs a normal check; lego decides whether renewal is due. There is no
production force-renew option. Deployment is retried after a successful check if
a previous import failed. `status` shows the current certificate, last check,
last successful check, last certificate change, next check, and configured versus
observed service state. A running process alone is not proof of successful renewal.
The protected log retains the latest production attempt and redacts configured
credential values; treat it as private diagnostic data.

`enable` requires a successful first check and uses the common script manager:

- `/data/work/scripts/certificate-renewal.sh`
- `/data/work/scripts-config/certificate-renewal.sh.conf`

The service uses `MODE=service`, `ENABLED=1`, `RESTART_POLICY=on-failure` and
`RESTART_DELAY_SEC=5`. View it in **Advanced → Scripts**. Successful checks are
scheduled 12 hours apart; failed checks retry after 5, 15, then 60 minutes. The
schedule is persistent, so a service restart does not force a new issuance.
`disable` stops automatic checks through the manager and preserves the certificate,
account and settings. The supervisor applies configuration changes asynchronously.

To reconfigure a running setup, run `disable` first, then `configure`. The new
profile must pass a fresh check before it can be enabled. The tool keeps protected
configuration backups and refuses to overwrite an existing legacy/custom startup
script. For a legacy reference recipe, disable that entry in System Scripts,
back up and move its script out of `/data/work/scripts/`, then run the new wizard.
Do not run the old worker and this manager together.

### Test before deployment

```sh
/data/work/extensions/lego/bin/blikvm-acme configure --prepare-only
/data/work/extensions/lego/bin/blikvm-acme test
/data/work/extensions/lego/bin/blikvm-acme renew
/data/work/extensions/lego/bin/blikvm-acme enable
```

`--prepare-only` downloads/verifies the client and saves configuration, but does
not request a certificate or enable startup. `test` uses Let's Encrypt staging in
a separate state directory; it never deploys the staging certificate or updates
production success status. Passing staging does not install a publicly trusted
certificate. Only run production `renew` when the domain and authorization are
ready. Failed issuance or validation leaves the installed HTTPS identity in use.

## Storage, updates and manual import

Programs, credentials, ACME accounts, issued files and manager state live under
`/data/work/extensions/lego/`. The common startup entries live in the paths above.
The tool does not write the read-only system filesystem. Supported A/B and App
updates retain `/data`; a factory reset removes extensions and custom identities.

Root users can also import a certificate without the optional manager:

```sh
/data/app/server/kvmserver --subcomponent certificate-import \
  --certificate-file /root/fullchain.pem --private-key-file /root/privkey.pem
/data/app/server/kvmserver --subcomponent certificate-status
```

The App checks the pair, validity, domains and chain structure before an atomic
commit. The running HTTPS listener refreshes committed identity within about one
second without restarting streams. CLI status describes stored identity; verify
actual access using the certificate's hostname. Importing a private/self-signed
CA does not make clients trust it automatically.

Managed identities normally live in `/data/vault/tls/server.crt.managed/`.
Certificate/key paths resolve through one shared `current` generation. Back up the
complete TLS directory; copying only symlinks is insufficient. Do not overwrite
those links with `cp`: use UI or CLI import. Previous generations remain available
for root recovery. Expired user certificates are reported, not silently replaced.

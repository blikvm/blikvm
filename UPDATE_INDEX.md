# Public update index

`static/updates/index.json` is the small public notification index. Devices read
this one JSON file; package downloads remain on the GitHub Release page. The
website also publishes it at `/updates/index.json`.

Run `node scripts/sync-update-index.mjs` after uploading release assets. The
Refresh public update index workflow runs on Release publication/edit/removal
and can be manually dispatched after assets finish uploading. It fetches all
Release metadata centrally, ignores drafts/legacy packages/full images, and
selects the highest SemVer independently per target, track and channel. A
Release marked prerelease (or an asset with a prerelease version) never enters
stable. Each candidate contains only `version` and the official `releaseUrl`.
An absent candidate is null, not an up-to-date claim. Errors preserve the old
index. Asset replacement with the same filename/version does not change the
notification unless its Release URL changes.

App targets: bcm2711, sun50i, rv1126b. System targets: bcm2711, sun50i,
rv1126b-tc358743, rv1126b-lt6911uxe, rv1126b-lt7911uxc. RV App entries are shared
across capture variants; system entries always match the specific bridge.

CI writes only the index file, then explicitly dispatches the website deploy
workflow because a GITHUB_TOKEN push cannot trigger it automatically. If
Actions are unavailable, run the generator locally, review/merge the generated
index, then manually deploy the website as usual. Do not publish input dumps,
private tokens, signing keys, or unreleased build artifacts.

Validation: `node --test scripts/sync-update-index.test.mjs`.

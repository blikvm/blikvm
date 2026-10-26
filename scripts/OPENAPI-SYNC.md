# OpenAPI synchronization

`yarn build` and `yarn start` run `yarn sync:openapi` first. The script fetches
`openapi/openapi.yaml` from `blikvm/web_server_go` on `main`, validates the OpenAPI
3 YAML and writes `static/api/current/openapi.yaml` plus `metadata.json`. The legacy `/openapi.yaml` URL is updated to the same contract.

The deployed site is a static snapshot. Backend changes appear after the next
website build, not immediately when the backend changes. The device's own
`/openapi.yaml` remains authoritative for that device version.

## Private backend repository

Add `OPENAPI_SOURCE_TOKEN` to the website repository's GitHub Actions secrets.
Use a fine-grained token with read-only Contents access to the backend repository.
The default website `GITHUB_TOKEN` does not grant access to a different private
repository. The deployment workflow already passes the dedicated secret to build.
Do not put the credential in source files or browser-side environment variables.

Optional server-side overrides:

- `OPENAPI_SOURCE_REPOSITORY`, `OPENAPI_SOURCE_REF`, `OPENAPI_SOURCE_PATH` select
  the backend repository/ref/path (prefer a release tag if publishing versioned docs).
- `OPENAPI_SOURCE_URL` reads another HTTPS endpoint, e.g. a published contract.
  A GitHub token is sent only to api.github.com or raw.githubusercontent.com.
- `OPENAPI_SOURCE_FILE` reads a local backend contract instead of fetching.

No credential or private local file path is emitted in public metadata. Only the
contract intentionally selected for publication is copied; no backend source code
is included. Verify that this API contract is intended for public documentation.

## Local development

Either set `OPENAPI_SOURCE_FILE` for the build, or create the ignored file
`.openapi-source.local.json` containing `{"file":"/absolute/backend/openapi/openapi.yaml"}`.
CI ignores that local configuration. Reading a local file does not fetch/pull that
backend checkout; the API page explicitly labels the local preview accordingly.
For a contract downloaded at a verified backend commit, the local configuration
can also include `"commit":"<40-character SHA>"` to retain its provenance.

Synchronization errors (permission, timeout, invalid YAML/contract) fail the build
instead of silently publishing an outdated snapshot. The previous validated YAML
is preserved if fetching or validation fails. `yarn serve` only previews the last
build and does not run synchronization. Directly invoking `docusaurus build`
bypasses Yarn's prebuild hook; use `yarn build` for a publishable build.

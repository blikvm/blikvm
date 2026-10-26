# Published OpenAPI snapshot

`openapi.yaml` is the website API contract snapshot. `metadata.json` records its
synchronization time, checksum and source. `static/openapi.yaml` is a compatibility
alias of the same file. The current manually downloaded snapshot was verified at
backend commit f601a851ddcc9f05160ac37e6daad2d858465b36 (2026-10-23).

Website builds synchronize the configured backend contract before compilation.
See `scripts/OPENAPI-SYNC.md` for private-repository access and local development.
Always prefer the running device's own contract when versions differ.

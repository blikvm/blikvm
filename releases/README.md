# Release maintenance

GitHub Releases in this public repository are the user-facing download and release-note destination.

The canonical bilingual template, reviewed per-version text and finalization checks are maintained in the build repository **[blikvm/blikvm-release](https://github.com/blikvm/blikvm-release)**. Maintainers should follow its **[release-note guide](https://github.com/blikvm/blikvm-release/blob/main/docs/release-notes.md)** and use `packaging/publish-release.sh` after builds and asset upload.

This website repository does not maintain a duplicate template or release-body update workflow. The build repository may require maintainer access. Public users can read the published notes and download firmware on the [Releases page](https://github.com/blikvm/blikvm/releases).

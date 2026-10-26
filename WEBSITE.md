# Website and documentation maintenance

This repository contains the BliKVM project landing page, firmware Releases,
the full Docusaurus website and bilingual product manuals. The production site
remains at https://blikvm.com/ with existing URLs unchanged.

## Content

- `README.md`, `README_CN.md`, `images/`: project overview and product gallery.
- `docs/`: English manuals; `i18n/zh-CN/`: Chinese manuals and translations.
- `src/`: website pages and shared components; `static/`: images and demo build.
- `sidebars.js`, `sidebars.zh-CN.js`: the matching product-manual navigation.
- `scripts/`: OpenAPI synchronization and PDF export.

Keep both language versions aligned. Firmware binaries belong in Releases,
not in the Git tree. Frontend and backend implementation repositories remain
private; this repository contains public documentation and a prebuilt demo.

## Local development

Use Node.js 18+ and Yarn 1 (versions are pinned in `package.json`).

```sh
yarn install --frozen-lockfile
# Configure backend contract access; see scripts/OPENAPI-SYNC.md.
yarn start
yarn start --locale zh-CN
yarn build
yarn serve
```

`yarn build` fetches and validates the backend contract before compiling both
locales. Local development may use the ignored `.openapi-source.local.json`.
The deployed site is static; its API snapshot changes with website builds.

## Production deployment

Pushes to `master` automatically run **Deploy Docusaurus** in this repository.
It tests contract synchronization, builds the website, publishes `gh-pages`,
and uploads to the existing production server. It can also be run manually.
`https://blikvm.com/site-version.json` records the repository, commit and build time.

Required Actions secrets: `OPENAPI_SOURCE_TOKEN`, `SERVER_HOST`, `SERVER_USER`,
`SERVER_SSH_KEY`, and `FRONTEND_DEMO_SSH_KEY` for demo synchronization. These
are encrypted repository settings, never files in Git.

To update the demo, run **Sync latest frontend demo** on `master`. It builds
`blikvm/web_client_vanilla`, updates `static/demo/` and its version metadata,
then calls the website deployment workflow. Check `/demo/version.json` afterward.

Website source was migrated from `blikvm/BliKVM-Website` at commit
037e760d9cc7863e560d7337dac503fd124aabe2. The old repository is a private backup;
all future website and documentation changes belong here.

## 中文维护说明

官网和中英文文档统一在本仓库维护，现有官网地址不变。中文文档位于
`i18n/zh-CN/`，英文文档位于 `docs/`；修改时同步正文、导航及图片。
推送 `master` 后自动部署。Demo 更新请运行本仓库的
**Sync latest frontend demo**，固件镜像继续发布到 Releases。
原 `BliKVM-Website` 仓库仅作为私有备份，不再承担生产部署。

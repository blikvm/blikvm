# Website and documentation maintenance

This repository contains the BliKVM project landing page, firmware Releases,
the full Docusaurus website and bilingual product manuals. The production site
remains at https://blikvm.com/ with existing URLs unchanged.

## Content

- `README.md`, `README_CN.md`, `images/`: project overview and product gallery.
- `docs/`: English manuals; `i18n/zh-CN/`: Chinese manuals and translations.
- `src/`: website pages and shared components; `static/`: images and demo build.
- `sidebars.js`, `sidebars.zh-CN.js`: the matching product-manual navigation.
- `scripts/`: OpenAPI/demo synchronization and PDF export.

Keep both language versions aligned. Firmware binaries belong in Releases,
not in the Git tree. Frontend and backend implementation repositories remain
private; this repository contains public documentation and a prebuilt demo.

## Local development

Use Node.js 22 and Yarn 1 (the website minimum is recorded in `package.json`).

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
It checks out the latest frontend `main`, builds its demo under Node.js 22,
tests/stages the demo and contract/index synchronization, builds the website,
publishes `gh-pages`, and uploads to the existing production server. It can
also be run manually. Every website deployment refreshes the demo, preventing
a later documentation deployment from restoring the older tracked snapshot.
`https://blikvm.com/site-version.json` records the repository, commit and build time.

Required Actions secrets: `OPENAPI_SOURCE_TOKEN`, `SERVER_HOST`, `SERVER_USER`,
`SERVER_SSH_KEY`, and `FRONTEND_DEMO_SSH_KEY` for demo synchronization. These
are encrypted repository settings, never files in Git.

To update the demo, run **Sync latest frontend demo** on `master`. It builds
`blikvm/web_client_vanilla` through the same reusable website workflow. It
replaces `static/demo/` in the runner workspace and records the exact source
commit in `/demo/version.json`. The tracked demo remains a fallback snapshot;
Actions do not commit or push generated Demo files to protected `master`.
Source/workflow changes still go through pull requests.

Demo staging removes stale bundles and excludes `data/`. Missing entry assets,
an incorrect `/demo/` base, escaping paths, symbolic links or invalid provenance
fail before the previous snapshot is replaced. Run staging regression checks
with `node --test scripts/sync-demo.test.mjs`. Check the completed workflow,
`https://blikvm.com/demo/` and `/demo/version.json` after deployment. A frontend
merge becomes live on the next manual Demo run or ordinary website deployment;
no scheduled deployments or device firmware/App updates are added.

Website source was migrated from `blikvm/BliKVM-Website` at commit
037e760d9cc7863e560d7337dac503fd124aabe2. The old repository is a private backup;
all future website and documentation changes belong here.

## 中文维护说明

官网和中英文文档统一在本仓库维护，现有官网地址不变。中文文档位于
`i18n/zh-CN/`，英文文档位于 `docs/`；修改时同步正文、导航及图片。
使用 Node.js 22 和 Yarn 1。推送 `master` 后自动部署；更新 Demo 可运行本仓库的
**Sync latest frontend demo** 并选择 `master`。两种入口复用同一部署流程，都会
构建最新前端 `main`，在运行器中更新 Demo，然后发布官网，避免文档部署覆盖成旧 Demo。
工作流不向受保护的 `master` 推送打包结果，源码与工作流修改仍通过 PR 合并；仓库中的
`static/demo/` 是后备快照。`/demo/version.json` 与工作流摘要记录实际前端提交及构建时间。
同步保留 `data/` 排除规则，移除旧资源；缺失入口资源、错误基路径、越界路径、符号链接或
无效版本记录会阻止替换和部署。可用 `node --test scripts/sync-demo.test.mjs` 运行回归检查。
前端合并后需手动运行一次或等待下一次官网部署；没有增加定时部署，也不更新设备固件／App。
固件镜像继续发布到 Releases。
原 `BliKVM-Website` 仓库仅作为私有备份，不再承担生产部署。

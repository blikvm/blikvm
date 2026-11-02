# 证书导入与可选自动续期

## 先选择需要的功能

- **只替换证书**：打开“设置 → 网络 → HTTPS 与证书”，选择证书链和匹配的未加密 PEM 私钥，先点击“校验”，检查域名、有效期和校验结果，再点击“应用”。不需要安装 lego 或申请 DNS API 凭据。应用后新 HTTPS 连接使用新证书，已有连接保持在线。恢复默认需另行确认，之后客户端可能需要重新信任自签名证书。
- **需要自动续期**：继续阅读下面的高级配置。首次仍需准备客户端、域名和 DNS 服务商授权、接受 CA 协议，并启用启动服务；配置成功后才会每 12 小时自动检查。当前网页没有一键 ACME 安装或 DNS 凭据配置向导。

设备需要包含“HTTPS 与证书”界面及 root 证书导入命令的 App。旧版 App 不能仅靠复制示例脚本增加证书导入能力；需要开机自启时，系统还应支持[系统脚本管理](../function/scripts.md)。先在设备 SSH 中确认以下命令可用：

```sh
/data/app/server/kvmserver --subcomponent certificate-status
/usr/libexec/blikvm-script-supervisor version
/etc/init.d/S98blikvm-scripts status
```

默认不安装第三方 ACME 客户端，也不会因导入证书而自动启用续期。


默认镜像不安装 lego，也不启用自动续期。通过“设置 → 网络 → HTTPS 与证书”
导入证书同样不会启用续期。网页证书管理仅允许真实管理员会话；API Token
及关闭鉴权的模式不能修改 HTTPS 身份。私钥须为未加密的 PEM 文件。

本示例适配 **lego 5.6.0**（v5 命令语法）及 App 提供的 root 证书导入命令。
参考脚本由公共文档仓库维护，不随 App 安装。用户程序、配置与账户状态统一放在 `/data/work/extensions/lego/`。


## 可选安装

从 [https://github.com/go-acme/lego/releases/tag/v5.6.0](https://github.com/go-acme/lego/releases/tag/v5.6.0) 下载匹配的 ARM64 客户端，
执行前按官方校验列表核对 SHA256。Pi4/CM4、H616、RV1126B 均为 ARM64；其他架构
需选择匹配程序。部分精简系统的 tar 无法解压 gzip，可以在电脑上校验、解包，再
复制原始 lego 可执行文件到设备。不要关闭 HTTPS 校验来下载。安装后检查 `lego --version`。

下载并在电脑上解压[参考脚本压缩包](../../../../../static/examples/acme/acme-reference.zip)，得到 `acme-reference/` 目录；可用[SHA256SUMS.txt](../../../../../static/examples/acme/SHA256SUMS.txt) 核验。参考源码在本仓库 `static/examples/acme/`。这不是 lego 客户端，也不会自动安装或获取 DNS 权限。

准备好已核验的 `lego` 原始可执行文件后，在**电脑**终端执行以下命令，把 `BLIKVM_ADDRESS` 换为设备地址。`scp -O` 使用传统 SCP，避免依赖设备上的 SFTP 服务：

```sh
ssh root@BLIKVM_ADDRESS 'umask 077; mkdir -p /data/work/extensions/lego/bin'
scp -O -r ./acme-reference root@BLIKVM_ADDRESS:/data/work/extensions/lego/
scp -O ./lego root@BLIKVM_ADDRESS:/data/work/extensions/lego/bin/lego
```

接下来的命令在**设备 SSH** 中以 root 执行：

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

以 root 编辑 `renewal.env`，配置自己控制的域名、DNS 服务商、ACME 服务及授权。
自行阅读并接受 CA 订户协议后，才能将 `ACME_ACCEPT_TOS` 设置为 `1`。
配置是受信任的 Shell 代码，必须仅允许 root 修改。不要将密钥放入脚本 UI 正文、
共享日志、Issue 或 Git。各服务商配置不同，参阅 [https://go-acme.github.io/lego/dns/](https://go-acme.github.io/lego/dns/)。
示例仅处理一个普通 DNS 域名，不配置通配符或多域名证书。

Route 53 使用独立的 AWS shared-credentials 文件，建议位置为
`/data/work/extensions/lego/config/aws.credentials`，root 所有、权限 600。
授权仅允许修改该域名的 `_acme-challenge` TXT 记录，并包含必要只读查询权限；
参阅 [https://go-acme.github.io/lego/dns/route53/](https://go-acme.github.io/lego/dns/route53/)。不要复制管理员广泛权限密钥到设备。
其他 DNS 服务商使用各自的环境变量，同样保存于受保护配置中。

若局域网 DNS 缓存旧 NXDOMAIN，可将 `ACME_DNS_RESOLVER` 配为可达的递归 DNS 地址，
包含 `:53`。该配置仅影响 lego，不修改全局 DNS，也不跳过 CA 的域名归属验证。
设备需要正确时间、可用 DNS 和出站 HTTPS；DNS-01 不要求从公网访问 KVM。

## 首次运行与定期续期

```sh
/data/work/extensions/lego/bin/renew-once.sh
```

没有证书时申请，否则由 lego 判断是否到期需要续期。成功后通过 root CLI 部署。
如果证书已签发、部署失败，下次成功检查仍会重试部署，避免因“未到续期时间”而遗漏。
App 会先检查私钥匹配、有效期及证书链结构，再提交成对版本。新 TLS 握手使用新证书，
无需重启 Web 服务，已有连接与视频流保持在线。企业或自签名 CA 仍需客户端自行信任。

首次运行成功且已配置长期有效凭据后，启用每 12 小时检查：

```sh
mkdir -p /data/work/scripts /data/work/scripts-config
cp /data/work/extensions/lego/acme-reference/certificate-renewal.sh /data/work/scripts/certificate-renewal.sh
cp /data/work/extensions/lego/acme-reference/certificate-renewal.sh.conf /data/work/scripts-config/certificate-renewal.sh.conf
/etc/init.d/S98blikvm-scripts start
```

配置为 `MODE=service`、`ENABLED=1`、`RESTART_POLICY=on-failure`、
`RESTART_DELAY_SEC=5`。现有脚本监督器发现文件后管理进程组，并在开机后启动。
用户在“高级 → 脚本”查看运行状态和日志；单击停止只是临时停止，需切为手动模式或
禁用配置才能在重启后持续停用。命令行可修改同一个 `.conf` 文件，将 `MODE` 改为
`manual`、`ENABLED` 改为 `0`；监督器自动读取，无需修改只读系统。
监督器配置不是密钥存储，不能放 DNS 凭据。

临时测试凭据不适合长期自动续期。“进程运行中”不等于续期成功，应核对最近日志和
证书到期时间。脚本在临时错误后继续定期检查，失败时保留当前已安装证书。

## 命令行导入与恢复

```sh
/data/app/server/kvmserver --subcomponent certificate-import \
  --certificate-file /root/fullchain.pem --private-key-file /root/privkey.pem
/data/app/server/kvmserver --subcomponent certificate-status
```

命令仅供 root 使用，不需要网页密码或 API Token。运行中的 App 约 1 秒内加载已提交
版本；停止的 App 在下次启动时加载。命令输出确认的是存储状态，不代替网络访问验证。
使用证书对应域名访问，不要直接使用局域网 IP。存在 HTTP(S) 代理时，内网域名可能
需要直连例外。

版本化文件通常位于 `/data/vault/tls/server.crt.managed/`；标准证书与私钥路径通过
共同的 current 链接解析。备份必须保留完整 TLS 目录，不能只复制两个符号链接。
不要直接用 cp 覆盖链接，请使用 UI 或 CLI 导入。上一版本保留以便 root 恢复。
用户证书到期后不会被悄悄覆盖为自签名证书，UI 会显示过期或尚未生效。
受支持的 A/B 和 App 更新保留 `/data`；恢复出厂设置会清除证书、扩展与配置。

测试环境证书不要用于日常访问。测试应使用独立域名和受保护状态目录；此生产示例
刻意不提供强制续期选项，避免反复签发触及 CA 限额。

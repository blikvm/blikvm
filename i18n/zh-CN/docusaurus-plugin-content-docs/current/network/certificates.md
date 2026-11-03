# HTTPS 证书与可选自动续期

## 替换自己的证书

打开 **设置 → 网络 → HTTPS 与证书**，选择 PEM 证书链及匹配的未加密 PEM
私钥，先校验，核对域名与有效期后再应用。不需要安装 lego 或提供 DNS 凭据。
新连接会使用通过校验的证书，不需要重启 App。恢复默认证书需要确认，客户端
可能需要重新信任设备的自签名证书。

修改证书必须使用真实管理员网页会话，API Token 和免登录模式不能替换 HTTPS
身份。导入证书不会自动安装或开启续期服务。

## 可选的引导式自动续期

可选命令 `blikvm-acme` 将客户端安装、DNS 凭据配置、首次签发、部署和开机自启
集中到一个入口。镜像默认不安装 lego，也不开启续期。工具和参考脚本由本公开
文档仓库维护，不打包进后端 App。

使用条件：

- App 支持 root 证书导入命令，系统支持[通用脚本管理](../function/scripts.md)。
- ARM64 的 Pi4/CM4、V4/H616 或 RV1126B 镜像，具备 `curl`、`flock`、
  `sha256sum`、`gzip`、`tar` 和常规 BusyBox 工具；设备不需要 Python。
- 一个由你管理 DNS 的域名，设备时间、DNS 和出站 HTTPS 正常。DNS-01 验证不
  要求把 KVM 暴露到公网。
- 专用的 Route53 或 Cloudflare DNS 凭据。此引导暂不支持其他服务商、泛域名
  或一张证书包含多个域名。

先检查 App 能力，再执行证书子命令：

```sh
/data/app/server/kvmserver --help 2>&1 | grep -- '-certificate-file'
/usr/libexec/blikvm-script-supervisor version
```

第一条没有结果时，请先升级匹配硬件的签名 App。复制工具不能让旧 App 获得证书
导入能力。开启自启前还应确认通用脚本执行器支持服务模式。

### 复制工具

下载[参考文件压缩包](../../../../../static/examples/acme/acme-reference.zip)
和 [SHA256SUMS.txt](../../../../../static/examples/acme/SHA256SUMS.txt)，在电脑上核对
压缩包的 SHA256 后解压。源文件位于仓库的 `static/examples/acme/`。压缩包包含
工具和参考脚本，不包含第三方 lego 程序或任何 DNS 凭据。

在电脑终端执行，替换 `BLIKVM_ADDRESS` 为设备地址：

```sh
ssh root@BLIKVM_ADDRESS 'umask 077; mkdir -p /data/work/extensions/lego/bin; chmod 700 /data/work/extensions/lego /data/work/extensions/lego/bin'
scp -O ./acme-reference/blikvm-acme root@BLIKVM_ADDRESS:/data/work/extensions/lego/bin/blikvm-acme
```

然后在设备 SSH 终端以 root 执行：

```sh
chmod 700 /data/work/extensions/lego/bin/blikvm-acme
/data/work/extensions/lego/bin/blikvm-acme configure
```

向导会询问域名、DNS 服务商、凭据、可选的递归 DNS，以及是否接受当前
Let's Encrypt 订户协议；随后下载官方 **lego 5.6.0 linux/arm64**，核对固定的
压缩包和可执行文件 SHA256，将配置以仅 root 可读的权限保存，签发并校验证书，
成功后询问是否开启开机自动检查。失败时保留原有 ACME 账户和设备 HTTPS 身份。

粘贴密钥时输入不回显，也可以导入 root 所有、权限为 `600` 的专用凭据文件。
不要把密钥放进命令参数、Git、Issue 或脚本管理 UI。工具不会替你注册 DNS
服务商账号或授予 DNS 权限。

如设备不能直接下载，可从 [lego 5.6.0 官方发布页](https://github.com/go-acme/lego/releases/tag/v5.6.0)
取得完全一致的 ARM64 压缩包，复制到设备后传入绝对路径；固定哈希检查仍然生效：

```sh
/data/work/extensions/lego/bin/blikvm-acme configure --archive /data/work/extensions/lego/lego_v5.6.0_linux_arm64.tar.gz
```

### DNS 授权

**Route53：**使用专用 AWS shared-credentials 文件，包含 `[default]` 配置段、
`aws_access_key_id` 和 `aws_secret_access_key`；临时凭据还需
`aws_session_token`。向导会询问区域和可选的托管区 ID。仅允许修改对应的
`_acme-challenge` TXT 记录，并提供必要只读权限，参考
[lego Route53 文档](https://go-acme.github.io/lego/dns/route53/)。不要把管理员密钥复制到设备。

**Cloudflare：**创建限定到目标 Zone 的 API Token，具备 **DNS:Edit** 和
**Zone:Read**，参考 [lego Cloudflare 文档](https://go-acme.github.io/lego/dns/cloudflare/)。
工具通过受保护的 Token 文件传递凭据，不放进进程参数。实际使用该适配器时仍需
完成真实服务商验收；模拟测试不能证明用户的 DNS 策略一定可用。

长期续期要求凭据持续有效，短期测试密钥不能用于无人值守的长期运行。如果局域网
DNS 缓存了 NXDOMAIN，可在向导里为 lego 单独指定可达递归解析器（`host:53`），
这不会修改系统全局 DNS，也不会跳过域名所有权验证。

### 日常命令与自启

```sh
/data/work/extensions/lego/bin/blikvm-acme status
/data/work/extensions/lego/bin/blikvm-acme renew
/data/work/extensions/lego/bin/blikvm-acme log
/data/work/extensions/lego/bin/blikvm-acme enable
/data/work/extensions/lego/bin/blikvm-acme disable
```

`renew` 执行正常检查，由 lego 判断是否到续期时间，不提供生产环境强制续期选项。
上次部署失败时，下次检查成功会再次尝试导入。`status` 显示当前证书、上次检查、
上次成功、上次证书变化、下次检查，以及配置的自启和实际进程状态。进程运行不等于
续期成功。受保护日志保留最近一次生产检查并脱敏已配置凭据，仍应按私有诊断数据处理。

`enable` 要求首次检查成功，通过现有通用脚本管理器接入：

- `/data/work/scripts/certificate-renewal.sh`
- `/data/work/scripts-config/certificate-renewal.sh.conf`

使用 `MODE=service`、`ENABLED=1`、`RESTART_POLICY=on-failure` 和
`RESTART_DELAY_SEC=5`。在 **高级 → 脚本** 中查看进程与日志。检查成功后间隔
12 小时再检查；失败后依次等待 5 分钟、15 分钟、60 分钟重试。计划保存在数据盘，
进程重启不会强制重新签发。`disable` 经通用管理器停止自动检查，保留现有证书、
账户与配置；执行器异步应用配置变化。

重新配置时先执行 `disable`，再执行 `configure`。新配置必须重新检查成功才能
开启自启。工具保存仅 root 可读的配置备份，并拒绝覆盖已有的旧版或自定义同名启动
脚本。若曾安装旧参考方案，请先在脚本管理中禁用该项，备份并移走
`/data/work/scripts/` 内的旧脚本，再运行新向导；不要同时运行两个续期进程。

### 先测试再部署

```sh
/data/work/extensions/lego/bin/blikvm-acme configure --prepare-only
/data/work/extensions/lego/bin/blikvm-acme test
/data/work/extensions/lego/bin/blikvm-acme renew
/data/work/extensions/lego/bin/blikvm-acme enable
```

`--prepare-only` 只下载校验客户端并保存配置，不签发证书、不开启自启。`test`
使用独立目录中的 Let's Encrypt 测试环境，不部署测试证书，也不改写生产成功状态。
测试通过不代表设备已经安装公开受信任证书。确认域名与授权可用后再执行生产
`renew`；签发或校验失败时，原 HTTPS 身份继续使用。

## 存储、升级与手动导入

程序、凭据、ACME 账户、签发文件和状态统一保存在 `/data/work/extensions/lego/`，
通用启动入口使用上方两个路径。工具不写只读系统分区。受支持的 A/B 和 App 升级
保留 `/data`；恢复出厂会清除扩展和自定义证书。

不使用可选管理工具时，root 也可以直接导入：

```sh
/data/app/server/kvmserver --subcomponent certificate-import \
  --certificate-file /root/fullchain.pem --private-key-file /root/privkey.pem
/data/app/server/kvmserver --subcomponent certificate-status
```

App 校验证书与私钥匹配、时间、域名及证书链结构，通过后原子提交。运行中的 HTTPS
监听器约一秒内读取已提交身份，不需要重启视频。CLI 状态描述存储身份，仍应使用
证书对应域名验证实际访问。导入私有或自签名 CA，不会自动让浏览器信任它。

受管理身份通常保存在 `/data/vault/tls/server.crt.managed/`，证书与私钥路径通过
共同的 `current` 指向同一代文件。备份时保留整个 TLS 目录，仅复制两个软链接不够。
不要用 `cp` 覆盖这些链接，应使用 UI 或 CLI 导入。历史代文件保留供 root 恢复。
用户证书过期时会报告状态，不会被静默替换。

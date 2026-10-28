# 系统脚本与第三方软件

BliKVM 支持把第三方程序及其配置放在持久化数据分区，并通过“系统脚本”管理手动任务、开机任务和常驻服务。可以使用 Web 界面，也可以通过 SSH 操作同一组文件。

脚本在 **BliKVM 设备自身**执行，不是被控电脑上的命令，也不是浏览器键盘宏。Web 界面仅管理员可管理脚本；SSH 示例需要设备的 root 权限。

本指南适用于包含新版通用脚本执行器的系统和 App。旧系统可能只有脚本界面，却缺少配套启动服务；仅升级 App 不一定能补齐该能力，应按发行说明升级配套系统。

## 软件与配置放在哪里

第三方软件统一使用 `/data/work/extensions/<软件名>/`，可按需划分 `bin/`、`config/`、`state/` 等子目录。

以 `myservice` 为例：

| 路径 | 用途 |
| --- | --- |
| `/data/work/extensions/myservice/` | 软件程序、依赖、配置和需要保留的数据 |
| `/data/work/scripts/myservice.sh` | 在脚本管理中显示的启动脚本 |
| `/data/work/scripts-config/myservice.sh.conf` | 运行模式和重启策略 |
| `/data/work/scripts-runtime/myservice.sh/` | 执行状态、受管任务的输出日志和工作目录 |
| `/run/` 下的软件专属目录 | 临时 socket、PID 等重启后可重建的文件 |

普通 App 更新和 A/B 系统更新会保留上述 `/data/work/` 数据。**恢复出厂设置会清除受管理脚本、配置及扩展软件；重新烧录镜像前也应单独备份。**

脚本管理负责启动进程，不负责安装软件依赖。请选用与设备 CPU 架构、动态库及内核能力兼容的软件；只把安装包复制到扩展目录，并不代表已经完成安装。

## 在 Web 界面管理

入口：**设置 → 高级与诊断 → 系统脚本**。

1. 准备一个以 `#!/bin/sh` 开头的 `.sh` 文件，上传后点击“查看”。
2. 短任务可保持“仅手动执行”，点击“运行”检查输出。
3. 长期运行的软件选择“常驻服务”，配置重启策略及延迟。不要用手动执行模式长期运行 VPN 等守护进程。
4. 模式和策略修改后自动保存并应用。观察状态是否进入“运行中”，必要时查看日志。
5. 需要停止服务并关闭开机自启时，改为“仅手动执行”；托管模式下，列表的“重启”操作由管理器先停止旧进程，再启动新进程。

列表中的电源图标表示开机自启状态；修改运行模式需要进入“查看”，该图标不是单独的启停按钮。

### 运行模式

| 模式 | 行为 | 适用场景 |
| --- | --- | --- |
| 仅手动执行 | 不随开机启动，明确执行时才运行 | 检查、维护等短任务 |
| 开机执行一次 | 每次设备启动执行一次；首次启用、修改脚本或配置、主动重启也会触发执行 | 一次性初始化任务 |
| 常驻服务 | 启用后启动进程，后续随设备启动，并按策略处理退出 | VPN 客户端、监控代理等前台服务 |

Web 界面的手动执行最长为 60 秒，输出最多显示 128 KiB。常驻任务不受这次手动执行时限约束。

### 重启策略

| 策略 | 行为 |
| --- | --- |
| 失败时重启 `on-failure` | 进程异常退出或退出码非 0 时重启；正常退出不重启 |
| 始终重启 `always` | 进程退出后重启，包括正常退出 |
| 不自动重启 `never` | 进程退出后保持停止，等待主动重启 |

重启延迟支持 1～60 秒。一次性开机任务不使用常驻服务的重启策略。

“运行中”表示进程正在执行，不等于软件业务已连接成功。例如 VPN 还需要通过其自身的状态命令确认连接状态。

## 通过 SSH 使用命令行

在你的电脑上连接设备，将 `BLIKVM_ADDRESS` 替换为设备地址：

```sh
ssh root@BLIKVM_ADDRESS
```

除明确标注“在电脑上执行”的上传命令外，下面的命令均在 BliKVM 的 SSH 终端中执行。

先检查启动执行器：

```sh
/usr/libexec/blikvm-script-supervisor version
/etc/init.d/S98blikvm-scripts status
```

本指南对应的执行器协议版本为 `2`。文件不存在、服务不可用或只有旧版脚本入口时，应先核对系统与 App 的配套版本；不要通过重新挂载系统分区来手工补启动文件。

### 上传第三方程序

先下载、解压适配设备的程序。下面是在**你的电脑上执行**的上传示例，`./myservice` 表示已准备好的程序文件：

```sh
ssh root@BLIKVM_ADDRESS \
  'mkdir -p /data/work/extensions/myservice/bin && cat > /data/work/extensions/myservice/bin/myservice.new && chmod 700 /data/work/extensions/myservice/bin/myservice.new && mv -f /data/work/extensions/myservice/bin/myservice.new /data/work/extensions/myservice/bin/myservice' \
  < ./myservice
```

该方式只依赖 SSH，不要求设备提供 SFTP。软件所需的其他文件也应放在自己的扩展目录中。更新已运行的软件前，先按下文停止对应服务。

### 创建一个可直接运行的示例服务

下面的示例每 10 秒输出一条日志，无需安装额外软件。实际使用时，可把扩展目录中的示例程序换成自己的软件。

```sh
umask 077
mkdir -p /data/work/extensions/demo-service \
  /data/work/scripts /data/work/scripts-config

cat > /data/work/extensions/demo-service/run.sh <<'EOF'
#!/bin/sh
while :; do
    printf '%s demo-service is running\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    sleep 10
done
EOF
chmod 700 /data/work/extensions/demo-service/run.sh

cat > /data/work/scripts/demo-service.sh <<'EOF'
#!/bin/sh
exec /bin/sh /data/work/extensions/demo-service/run.sh
EOF
chmod 700 /data/work/scripts/demo-service.sh
```

实际二进制软件的启动脚本可以使用下面的形式，程序参数需按该软件的说明调整：

```sh
#!/bin/sh
exec /data/work/extensions/myservice/bin/myservice \
    --config /data/work/extensions/myservice/config/config.json
```

常驻进程应保持在前台。不要在启动命令后加 `&`，也不要启用软件自己的后台化选项；管理器负责进程生命周期。请使用绝对路径，因为脚本的默认工作目录是 `/data/work/scripts-runtime/<脚本名>/`。

### 启动服务并启用开机自启

为上面的示例写入配置：

```sh
cat > /data/work/scripts-config/.demo-service.tmp <<'EOF'
MODE=service
ENABLED=1
RESTART_POLICY=on-failure
RESTART_DELAY_SEC=5
EOF
mv -f /data/work/scripts-config/.demo-service.tmp \
  /data/work/scripts-config/demo-service.sh.conf
```

执行器会自动应用配置，不需要重启设备或 Web 服务。SSH 创建的脚本也会出现在 Web 脚本列表中。

配置文件是逐行的 `KEY=VALUE`，不是 Shell 脚本，不要添加 `export`。使用临时文件再重命名，可以避免执行器读到尚未写完的配置。

### 查看状态和日志

首次启动后，执行：

```sh
cat /data/work/scripts-runtime/demo-service.sh/status
tail -n 80 /data/work/scripts-runtime/demo-service.sh/output.log
```

持续查看日志：

```sh
tail -f /data/work/scripts-runtime/demo-service.sh/output.log
```

按 `Ctrl+C` 只会结束日志查看，不会停止服务。状态中的 `STATE=running` 表示进程正在运行，`STATE=backoff` 表示等待按策略重启，`RESTART_COUNT` 表示当前受管任务的自动重启次数。

受管脚本的标准输出和标准错误保留在 `output.log` 中，文件保留最新约 1 MiB。软件自行写入的日志由该软件自己的配置决定。

### 重启一个受管任务

对“常驻服务”或“开机执行一次”任务，写入新的重启请求：

```sh
mkdir -p /data/work/scripts-runtime/demo-service.sh
cat /proc/sys/kernel/random/uuid \
  > /data/work/scripts-runtime/demo-service.sh/restart.tmp
mv -f /data/work/scripts-runtime/demo-service.sh/restart.tmp \
  /data/work/scripts-runtime/demo-service.sh/restart
```

每次生成不同的请求内容，执行器会处理此次重启。“仅手动执行”模式不响应该请求。

修改 `/data/work/scripts/` 中的启动脚本或对应 `.conf` 会触发重新应用。只替换扩展目录中的程序、或修改软件自己的配置后，应主动重启任务。已正常退出且策略为 `on-failure` 或 `never` 的服务，也可通过此方式再次启动。

不要重复执行 `sh /data/work/scripts/demo-service.sh` 来重启常驻任务，这会绕过管理器并可能产生第二个实例。

### 停止服务并关闭开机自启

```sh
cat > /data/work/scripts-config/.demo-service.tmp <<'EOF'
MODE=manual
ENABLED=0
RESTART_POLICY=never
RESTART_DELAY_SEC=5
EOF
mv -f /data/work/scripts-config/.demo-service.tmp \
  /data/work/scripts-config/demo-service.sh.conf
```

执行器会停止受管进程及其子进程。从该停止状态重新启动并恢复自启时，重新写入前面的 `MODE=service` 配置即可。

不要只用 `kill` 代替停用操作：配置仍启用时，管理器可能按重启策略把进程重新拉起。

### 手动运行短任务

准备一个短脚本：

```sh
cat > /data/work/scripts/hello.sh <<'EOF'
#!/bin/sh
printf 'Hello from BliKVM\n'
printf 'Working directory: %s\n' "$PWD"
EOF

mkdir -p /data/work/scripts-runtime/hello.sh
(
    cd /data/work/scripts-runtime/hello.sh
    /bin/sh /data/work/scripts/hello.sh
)
```

该 SSH 命令的输出显示在当前终端，不会自动生成管理器的运行状态或写入其 `output.log`。前台运行还会受到当前 SSH 会话的影响；长期进程应使用常驻模式。

### 设置开机执行一次

对上面的短任务写入：

```sh
cat > /data/work/scripts-config/.hello.tmp <<'EOF'
MODE=once
ENABLED=1
RESTART_POLICY=never
RESTART_DELAY_SEC=5
EOF
mv -f /data/work/scripts-config/.hello.tmp \
  /data/work/scripts-config/hello.sh.conf
```

首次启用会执行，后续每次开机再执行一次。同一启动周期内，仅重启 Web 服务不会重复执行已经完成的任务。若需现在再执行一次，可按前面的重启请求方法，把路径中的 `demo-service.sh` 换成 `hello.sh`。

### 删除任务和卸载软件

先切换为“仅手动执行”，确认任务已停止（`STATE=stopped`，或已退出且 `PID=0`）后，再删除对应脚本与配置：

```sh
rm -f /data/work/scripts/demo-service.sh \
  /data/work/scripts-config/demo-service.sh.conf
```

对应运行目录中可能仍保留历史日志和状态，确认任务已停止后可按需清理。**删除脚本不会卸载扩展软件，也不会自动删除软件的配置和身份。** 确认不再需要并完成备份后，再单独删除它自己的扩展目录。

## 用 NetBird 接入脚本管理

NetBird 可以作为独立第三方软件使用。下面以 V4 上的 NetBird `0.81.5` 基础 IPv4 节点访问配置为例，软件本身不会随本功能默认安装。先准备目录，再把兼容的官方程序放入对应版本目录：

```sh
umask 077
mkdir -p /data/work/extensions/netbird/versions/0.81.5 \
  /data/work/extensions/netbird/state \
  /data/work/scripts /data/work/scripts-config
chmod 700 /data/work/extensions/netbird /data/work/extensions/netbird/state
```

```text
/data/work/extensions/netbird/
├── versions/0.81.5/netbird
├── run.sh
├── netbird
└── state/
```

其中 `netbird` 是方便日常操作的 CLI 包装脚本。`state/` 保存授权和身份，不能每次启动都重新创建或清空。

### 前台启动脚本

保存为 `/data/work/extensions/netbird/run.sh`：

```sh
#!/bin/sh
set -eu
umask 077
ROOT=/data/work/extensions/netbird
STATE=$ROOT/state
mkdir -p /run/netbird "$STATE"
chmod 700 /run/netbird "$STATE"
export NB_STATE_DIR="$STATE"
export XDG_CONFIG_HOME="$STATE/xdg-config"
export NB_DISABLE_SSH_CONFIG=true
export NB_WG_KERNEL_DISABLED=true
export NB_USE_LEGACY_ROUTING=true
export NB_LOG_MAX_SIZE_MB=2
exec "$ROOT/versions/0.81.5/netbird" \
    --config "$STATE/default.json" \
    --daemon-addr unix:///run/netbird/control.sock \
    --log-file /run/netbird/client.log service run
```

这组参数采用用户态 WireGuard 和旧路由模式，适用于这里的 V4 基础节点访问示例。其他平台以及子网路由、出口网关等场景，应按对应固件的支持情况配置，不能直接套用。

保存 `/data/work/extensions/netbird/netbird`，作为 CLI 入口：

```sh
#!/bin/sh
set -eu
export NB_STATE_DIR=/data/work/extensions/netbird/state
export XDG_CONFIG_HOME="$NB_STATE_DIR/xdg-config"
export NB_DISABLE_SSH_CONFIG=true
exec /data/work/extensions/netbird/versions/0.81.5/netbird \
    --config "$NB_STATE_DIR/default.json" \
    --daemon-addr unix:///run/netbird/control.sock \
    --log-file /run/netbird/client.log "$@"
```

设置权限，再创建供脚本管理识别的入口：

```sh
chmod 700 /data/work/extensions/netbird/run.sh \
  /data/work/extensions/netbird/netbird

cat > /data/work/scripts/netbird.sh <<'EOF'
#!/bin/sh
exec /data/work/extensions/netbird/run.sh
EOF
chmod 700 /data/work/scripts/netbird.sh
```

通过 UI 选择“常驻服务 / 失败时重启 / 5 秒”，或通过 SSH 写入：

```sh
cat > /data/work/scripts-config/.netbird.tmp <<'EOF'
MODE=service
ENABLED=1
RESTART_POLICY=on-failure
RESTART_DELAY_SEC=5
EOF
mv -f /data/work/scripts-config/.netbird.tmp \
  /data/work/scripts-config/netbird.sh.conf
```

首次使用时，在服务启动后进行账号授权：

```sh
/data/work/extensions/netbird/netbird up --no-browser \
  --disable-dns --disable-client-routes --disable-server-routes
```

按终端提示打开授权地址，登录自己的账号。上述示例用于节点间访问，不接管 DNS，也不启用客户端和服务端路由。已有授权文件时应先停用旧实例，保留并迁移完整身份目录，更新旧路径后再启用新入口，不要为迁移而删除原身份。

日常检查：

```sh
/data/work/extensions/netbird/netbird status
tail -n 80 /run/netbird/client.log
```

需要重启或停用 NetBird 时，使用前文相同的脚本管理命令，把 `demo-service.sh` 改为 `netbird.sh`。设备重启后由脚本管理器启动；云端会话过期仍按 NetBird 账号的授权策略处理。

## 常见问题

- **界面提示执行器不可用**：检查配套系统、App 版本及 `S98blikvm-scripts status`。启动服务属于系统能力，只有前端页面并不代表旧系统已经具备该能力。
- **脚本无法上传或执行**：名称需以英文字母或数字开头，只使用字母、数字、点、下划线、短横线，以 `.sh` 结尾；文件不超过 256 KiB，需为普通文件，不能用软链接替代。首行必须为 `#!/bin/sh`，使用 LF 换行，勿依赖 Bash 专有语法。
- **一直等待重启**：查看 `LAST_EXIT_CODE` 和日志，检查程序路径、依赖、权限及配置；不要仅缩短重启延迟。
- **状态为运行中，但 VPN 未连上**：检查 VPN 自身状态、网络、账号授权和软件日志；管理器不会把“进程存活”当作业务连接成功。
- **停止后又启动**：确认已改为 `MODE=manual`、`ENABLED=0`，并排除其他独立启动方式。一个常驻进程应只有一个启动管理入口。
- **重启后配置丢失**：检查软件自己的配置、身份和数据库是否放在扩展目录；不要把需要保留的数据写入 `/run/`。

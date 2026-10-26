# 持久化目录与日志

本页列出设备上的常用文件位置，方便通过[SSH](../function/ssh.md)或[网页终端](../function/serial-terminal.md)查看和维护。以下为当前镜像的默认布局；旧镜像或自定义部署可能使用不同路径。

## 持久化目录

| 路径 | 内容与用途 |
| --- | --- |
| `/data/work/conf/` | 设备配置目录；常用环境配置文件为 `blikvm.env` |
| `/data/work/state/` | 应用持久状态与各功能配置；具体文件取决于启用的功能 |
| `/data/work/msd/images/` | 虚拟介质镜像文件 |
| `/data/vault/` | 证书、密钥等私密材料；TLS 证书和私钥通常位于 `tls/server.crt`、`tls/server.key` |
| `/data/app/` | 当前安装的应用与网页文件；网页资源在 `ui-dist/`，由升级流程管理 |

### 查看或修改配置

先进入目录确认文件，再备份需要修改的文件。例如，维护环境配置时：

```sh
cd /data/work/conf
ls -lah
cp -p blikvm.env "blikvm.env.backup-$(date +%Y%m%d-%H%M%S)"
vi blikvm.env
```

示例需要具备相应系统权限。文件不存在时先核对当前镜像的路径，不要创建一份同名文件就假定服务会读取。部分旧镜像的启动脚本读取 `/userdata/conf/blikvm.env`，应以设备实际启动配置为准。

保存配置不等于已经生效；按所改功能要求重新加载或重启。优先使用网页提供的设置，避免网页与手工修改互相覆盖。`/data/app/` 中的文件可能在升级时被替换，长期配置应放在对应配置目录。

## 日志目录

常用服务日志位于 `/var/log/`。不同镜像可能只存在其中一部分：

| 文件 | 用途 |
| --- | --- |
| `/var/log/kvmserver.log` | 应用服务运行及启动日志 |
| `/var/log/blikvm-go-server.log` | 部分镜像使用的应用服务日志 |
| `/var/log/blikvm-update-restart.log` | 更新与服务重启过程 |
| `/var/log/blikvm-app-track-health.log` | 应用健康检查及回退相关记录 |
| `/var/log/blikvm-lcd.log` | v4 小屏服务运行记录（配备对应服务时） |

先查看当前实际存在的日志，再选择文件：

```sh
ls -lh /var/log/*blikvm* /var/log/kvmserver.log
# 查看最近 100 行
tail -n 100 /var/log/kvmserver.log
# 持续跟踪新增日志，按 Ctrl+C 退出
tail -f /var/log/kvmserver.log
```

`/var/log/` 不保证跨重启保留，遇到问题时及时保存。崩溃记录在不同镜像中可能位于 `/data/work/crashdump/` 或 `/data/work/state/crashdump/`，以设备实际配置为准。也可使用[诊断与日志](../function/diagnostics.md)导出诊断包。

证书私钥、账号状态和日志可能包含敏感信息，分享排查材料前先检查内容。不要通过清空整个 `/data/work/` 来处理单个配置问题。

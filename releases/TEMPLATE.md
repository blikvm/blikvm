<!-- Fill placeholders from actual release metadata and validation records. Remove unused optional sections. Never publish this comment or unfilled placeholders. -->
**{{Stable / Pre-release}} / {{正式版 / 预发布}}** · System **{{SYSTEM_VERSION}}** · App **{{APP_VERSION}}**

{{One sentence describing the value of this release.}} / {{一句话说明本次更新的价值。}}

## Downloads / 下载

| Hardware / 硬件 | Flash image / 烧录镜像 | A/B system / 系统升级 | App / 应用升级 |
| --- | --- | --- | --- |
| BliKVM v1 / v2 / v3 — Pi 4B / CM4 | {{actual image asset link}} | {{actual system asset link}} | {{actual App asset link}} |
| BliKVM v4 — H616 | {{actual image asset link}} | {{actual system asset link}} | {{actual App asset link}} |
| {{Other hardware and capture variant actually provided}} | {{actual asset link or Not provided / 本版未提供}} | {{actual asset link or Not provided / 本版未提供}} | {{actual asset link or Not provided / 本版未提供}} |

{{Actual SHA256SUMS link}} · {{Actual BUILD-INFO link, only if provided}}

## English

### What changed

- **{{Added / Improved / Fixed — feature}}:** {{User-visible change compared with the stated baseline.}}

### Upgrade instructions

| Your situation | Package and action |
| --- | --- |
| New installation or reinstall | {{Image filename, flashing guide link, and data overwrite warning}} |
| Existing compatible A/B system | {{System package, supported starting versions, bundled App and reboot behavior}} |
| App-only update | {{App package, minimum OS, compatibility constraints and data impact}} |

{{Hardware/capture restrictions; legacy-system migration; breaking changes and backup requirements when relevant. Verify downloads using the actual checksum file.}}

### Known issues and validation scope

- **Known issue:** {{Affected models/versions, impact, confirmed workaround; or state that no separate issue list was provided.}}
- **Verified:** {{Actual devices, update methods and tested features.}}
- **Not verified:** {{Remaining scope; distinguish missing coverage from a confirmed defect.}}

<details>
<summary>Technical validation and build records</summary>

{{Measured hardware, sampling duration and conditions; signature/checksum checks; actual test results; source/build record links.}}

</details>

## 简体中文

### 主要变化

- **{{新增／改进／修复 — 功能}}：**{{与英文对等的用户可感知变化。}}

### 升级说明

| 当前情况 | 选择与操作 |
| --- | --- |
| 首次安装或重装 | {{镜像文件名、烧录教程链接及覆盖数据提示}} |
| 已有兼容 A/B 系统 | {{系统包、支持的起始版本、内置 App 与重启行为}} |
| 仅更新 App | {{App 包、最低系统要求、兼容限制及数据影响}} |

{{与英文一致的硬件／采集芯片限制、旧系统迁移、不兼容变更及相关备份要求；使用实际校验文件校验下载。}}

### 已知问题与验证范围

- **已知问题：**{{受影响型号／版本、影响及已确认规避方式；或说明未提供单独问题清单。}}
- **已经验证：**{{实际设备、升级方式及测试功能。}}
- **尚未验证：**{{剩余范围；缺少覆盖不等同于已确认缺陷。}}

<details>
<summary>技术验证与构建记录</summary>

{{与英文对等的实测设备、采样条件、签名／摘要检查、测试结果及源码／构建信息链接。}}

</details>

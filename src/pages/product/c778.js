import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useSiteLanguage from '@site/src/components/useSiteLanguage';
import s from './c778.module.css';

export default function C778() {
  const {base, t, zh} = useSiteLanguage();
  return <Layout title={t('C778 · LT6911UXE HDMI 转 CSI-2', 'C778 · LT6911UXE HDMI to CSI-2')} description={t('C778 HDMI 转双路 MIPI CSI-2 模块，含 I²S 音频接口、Pi 5 与 RV1126B 接入指南。', 'C778 HDMI-to-MIPI CSI-2 module with I²S audio and platform integration guides.')}>
    <main className={s.page}>
      <section className={s.hero}>
        <div><Link to={`${base}/products`}>{t('← HDMI 采集模块', '← HDMI capture modules')}</Link>
          <p className={s.eyebrow}>BLICUBE / C778</p>
          <h1>{t('C778 HDMI 转 MIPI CSI-2 模块', 'C778 HDMI to MIPI CSI-2 module')}</h1>
          <p className={s.lead}>{t('基于龙迅 LT6911UXE，支持最高 4K60 和 1080p120 HDMI 输入。双 CSI 接口支持默认复制与左右半幅输出，配备独立 5V 供电和 I²S 音频接口。', 'Powered by Lontium LT6911UXE, supporting up to 4K60 and 1080p120 HDMI input. Dual CSI ports offer default duplicate and optional left/right split output, with dedicated 5V power and I²S audio.')}</p>
          <div className={s.actions}><Link className="button button--primary" to={`${base}/docs/device-guides/C778`}>{t('查看使用手册', 'Read the manual')}</Link><a className="button button--secondary" href="#platforms">{t('选择开发平台', 'Choose your platform')}</a></div>
          <p className={s.small}>{t('视频通过 CSI 传输。使用前需匹配主机驱动、设备树与芯片固件。', 'Video is carried over CSI. Match the host driver, device tree and chip firmware before use.')}</p>
        </div>
        <figure className={s.heroImage}><img src={`${base}/assets/images/c778/c778-front-cutout-v1.png`} alt={t('C778 模块正面实拍', 'C778 front view')}/><figcaption>C778 · LT6911UXE</figcaption></figure>
      </section>
      <div className={s.metrics}>{[['LT6911UXE',t('HDMI 桥接芯片','HDMI bridge')],['2 × 22Pin',t('MIPI CSI-2 接口','MIPI CSI-2 connectors')],['I²S',t('独立数字音频','Separate digital audio')],['56 × 56 mm',t('PCB 尺寸','PCB dimensions')]].map(([v,l])=><div key={v}><strong>{v}</strong><span>{l}</span></div>)}</div>
      <section className={s.section}>
        <p className={s.eyebrow}>DUAL CSI-2 OUTPUT</p><h2>{t('一个 HDMI 输入，两种输出模式', 'One HDMI input, two output profiles')}</h2>
        <p>{t('默认复制模式让 MIPI0 和 MIPI1 分别输出相同的完整画面，可选用单口或同时使用双口。左右半幅模式将一幅图像分到两条 CSI 通路，主机接收后配对拼接。', 'The default duplicate profile sends the same full image to MIPI0 and MIPI1, for one or two receiver paths. The split profile sends left/right halves over separate CSI paths for host-side pairing and stitching.')}</p>
        <img className={s.modeDiagram} src={`${base}/assets/images/c778/output-copy-${zh ? 'zh' : 'en'}.svg`} alt={t('默认复制输出模式', 'Default duplicate output profile')}/>
        <img className={s.modeDiagram} src={`${base}/assets/images/c778/output-split-${zh ? 'zh' : 'en'}.svg`} alt={t('左右半幅输出模式', 'Left/right split output profile')}/>
        <p className={s.note}>{t('4K60、1080p120 描述 HDMI 输入能力。主机实际采集、显示和编码规格需匹配所用固件、像素格式、CSI 带宽与应用性能。', '4K60 and 1080p120 describe HDMI input capability. Actual host capture, display and encoding also depend on firmware, pixel format, CSI bandwidth and application performance.')}</p>
      </section>
      <section id="platforms" className={s.section}><p className={s.eyebrow}>PLATFORM GUIDES</p><h2>{t('按主机选择接入方式', 'Choose the integration path for your host')}</h2><div className={s.platforms}>
        <article><span className={s.status}>{t('优先验证', 'Validation priority')}</span><h3>Raspberry Pi 5B</h3><p>{t('双 CAM/DISP 接入，配套 LT 驱动、RP1-CFE 和设备树。现有厂测包依赖精确内核版本。', 'Dual CAM/DISP connection with LT and RP1-CFE drivers plus a device-tree overlay. The existing test bundle requires an exact kernel match.')}</p><Link to={`${base}/docs/capture/c778-raspberry-pi-5`}>{t('查看 Pi 5B 指南 →', 'Read the Pi 5B guide →')}</Link></article>
        <article><span className={s.status}>{t('适配中', 'Integration in progress')}</span><h3>RV1126B</h3><p>{t('以 Luckfox Aura 为例，整理单路四 Lane CSI、I²C 与 I²S 接入。板级连接和输出模式需实物确认。', 'Luckfox Aura reference integration using one four-lane CSI path, I²C and I²S. Board wiring and output modes need hardware verification.')}</p><Link to={`${base}/docs/capture/c778-rv1126b`}>{t('查看 RV1126B 指南 →', 'Read the RV1126B guide →')}</Link></article>
      </div></section>
      <section className={s.section}><p className={s.eyebrow}>HARDWARE</p><h2>{t('接口与安装尺寸', 'Connectors and mounting dimensions')}</h2><div className={s.diagrams}><figure><img src={`${base}/assets/images/c778/interfaces-${zh ? "zh.png" : "en.svg"}`} alt={t('C778 接口定义','C778 connectors')}/><figcaption>{t('HDMI、双 MIPI、5V 与 I²S 接口','HDMI, dual MIPI, 5V and I²S interfaces')}</figcaption></figure><figure><img src={`${base}/assets/images/c778/dimensions.png`} alt={t('C778 尺寸图','C778 dimensions')}/><figcaption>56 × 56 mm · 4 × Φ2.75 mm</figcaption></figure></div></section>
      <section className={s.section}><h2>{t('产品规格与包装', 'Specifications and package contents')}</h2><div className={s.specs}>
        <dl>{[[t('型号','Model'),'C778'],[t('视频输入','Video input'),'HDMI · 4K60 / 1080p120'],[t('视频输出','Video output'),'MIPI CSI-2 × 2 / 22Pin'],[t('音频接口','Audio interface'),'I²S'],[t('供电','Power input'),'5V'],[t('尺寸 / 孔径','PCB size / mounting holes'),'56 × 56 mm / Φ2.75 mm']].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        <div><h3>{t('包装清单','Package contents')}</h3><ul><li>{t('C778 模块 × 1','C778 module × 1')}</li><li>{t('5V 电源线，15 cm × 1','5V power cable, 15 cm × 1')}</li><li>{t('22Pin、15 cm FPC 排线 × 2','22-pin, 15 cm FPC cables × 2')}</li><li>{t('I²S 连接线，5Pin / 4线，15 cm × 1','I²S cable, 5-pin / 4 wires, 15 cm × 1')}</li></ul><p className={s.small}>{t('以最终销售 SKU 为准，主机与 HDMI 线另备。供电电流、接口电平及正式兼容模式表正在补齐。', 'Subject to the final sales SKU. Host and HDMI cable are separate. Power-current limits, interface levels and release compatibility modes are being finalized.')}</p></div>
      </div><img className={s.packageImage} src={`${base}/assets/images/c778/${zh ? "c778-package-contents-v3.png" : "c778-package-contents-en-v2.png"}`} alt={t("C778 包装清单示意", "C778 package contents illustration")}/></section>
      <section className={s.closing}><h2>{t('先确认平台，再开始连接','Confirm your platform before connecting')}</h2><p>{t('手册包含接线顺序、平台环境、验证方法和故障信息收集。驱动仓库与正式下载准备好后，将在此处提供入口。','The manual covers wiring, platform requirements, validation and diagnostics. Driver repository and release-download links will be added when ready.')}</p><Link className="button button--primary" to={`${base}/docs/device-guides/C778`}>{t('打开 C778 手册 →','Open the C778 manual →')}</Link></section>
    </main>
  </Layout>;
}

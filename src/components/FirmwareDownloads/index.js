import useSiteLanguage from '../useSiteLanguage';
import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './styles.module.css';

const releasesUrl = 'https://github.com/blikvm/blikvm/releases';



export default function FirmwareDownloads() {
  const {t, base} = useSiteLanguage();
  const flashGuide = base + '/docs/getting-started/flashing-os';
  const platforms = [
  {
    id: 'pi',
    models: 'BliKVM v1 / v2 / v3',
    hardware: 'Raspberry Pi CM4 / Pi 4B',
    images: [1, 2, 3].map(version => ({src: `/img/product/blikvm-v${version}-transp.webp`, label: `BliKVM v${version}`})),
    description: t("v1、v2 和 v3 使用同一组镜像。下载时选择文件名包含 v1-v2-v3 的完整系统镜像。", "v1, v2 and v3 share the same image family. Choose a full system image whose filename includes v1-v2-v3."),
    filename: t("blikvm-v1-v2-v3-<版本>.img.xz", "blikvm-v1-v2-v3-<version>.img.xz"),
    guides: [['v1 CM4', 'BliKVM-v1-guide'], ['v2 PCIe', 'BliKVM-v2-guide'], ['v3 HAT', 'BliKVM-v3-guide']],
  },
  {
    id: 'v4',
    models: 'BliKVM v4',
    hardware: 'Allwinner H616',
    image: '/img/product/blikvm-v4-transp.webp',
    description: t("v4 使用独立镜像。下载时选择文件名包含 v4 的完整系统镜像，不能使用 v1 / v2 / v3 的镜像。", "v4 uses its own image. Choose a full system image with v4 in its filename; v1 / v2 / v3 images are incompatible."),
    filename: t("blikvm-v4-<版本>.img.xz", "blikvm-v4-<version>.img.xz"),
    guides: [['v4 Allwinner', 'BliKVM-v4-guide']],
  },
];
  return (
    <Layout title={t("下载固件", "Firmware downloads")} description={t("BliKVM v1、v2、v3、v4 系统镜像下载与烧录指南。", "System images and flashing instructions for BliKVM v1, v2, v3 and v4.")}>
      <main className={styles.page}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>{t("BliKVM 系统镜像", "BliKVM system images")}</span>
          <h1>{t("下载固件", "Firmware downloads")}</h1>
          <p>{t("v1–v4 镜像统一发布在 GitHub Releases。先确认设备型号，再选择完整镜像或对应升级包。", "All v1–v4 images are published on GitHub Releases. Identify your model before selecting a full image or update package.")}</p>
          <div className={styles.actions}>
            <a className="button button--primary" href={releasesUrl}>{t("打开 GitHub Releases ↗", "Open GitHub Releases ↗")}</a>
            <Link className="button button--secondary" to={flashGuide}>{t("查看烧录教程", "Read the flashing guide")}</Link>
          </div>
        </header>

        <section aria-labelledby="choose-hardware">
          <div className={styles.sectionHeading}>
            <span className={styles.step}>01</span>
            <div><h2 id="choose-hardware">{t("选择你的设备", "Choose your device")}</h2><p>{t("下面是镜像文件的命名示例，版本号以 Releases 附件为准。", "Filenames below are examples; use the versions provided in release assets.")}</p></div>
          </div>
          <div className={styles.platforms}>
            {platforms.map(platform => (
              <article className={styles.card} key={platform.id}>
                {platform.images ? (
                  <div className={styles.productGallery}>
                    {platform.images.map(image => (
                      <figure key={image.src}>
                        <img src={image.src} alt={image.label} width="180" height="140" />
                        <figcaption>{image.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <img className={styles.productImage} src={platform.image} alt={platform.models + t(" 设备示意", " device illustration")} width="320" height="180" />
                )}
                <p className={styles.hardware}>{platform.hardware}</p>
                <h3>{platform.models}</h3>
                <p>{platform.description}</p>
                <div className={styles.filename}><span>{t("完整镜像文件名", "Full image filename")}</span><code>{platform.filename}</code></div>
                <a className="button button--primary button--outline" href={releasesUrl}>{t("前往 Releases 选择镜像 ↗", "Choose an image on Releases ↗")}</a>
                <div className={styles.guideLinks}>
                  <span>{t("设备指南：", "Device guides: ")}</span>
                  {platform.guides.map(([label, id]) => <Link key={id} to={base + '/docs/device-guides/' + id}>{label}</Link>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.packageSection} aria-labelledby="choose-package">
          <div className={styles.sectionHeading}>
            <span className={styles.step}>02</span>
            <div><h2 id="choose-package">{t("选择正确的文件", "Choose the right file")}</h2><p>{t("给 SD 卡烧录系统时，选择完整镜像；已有系统的升级包另有用途。", "Use a full image for SD flashing. Update packages serve an existing compatible installation.")}</p></div>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.packageTable}>
              <thead><tr><th>{t("你要做什么", "Task")}</th><th>{t("选择的文件", "File")}</th><th>{t("操作方式", "Procedure")}</th></tr></thead>
              <tbody>
                <tr><td><strong>{t("首次安装 / 重装系统", "First install / reinstall")}</strong></td><td><code>.img.xz</code>{t(" 完整镜像", " full image")}</td><td>{t("按教程解压并写入 SD 卡，或按型号要求写入 eMMC。写盘会覆盖目标介质。", "Extract and write to SD, or follow the model-specific eMMC procedure. Writing overwrites the target medium.")}</td></tr>
                <tr><td>{t("更新系统", "Update system")}</td><td><code>.raucb</code>{t(" 系统升级包", " system bundle")}</td><td>{t("用于兼容的 A/B 系统，通过网页系统升级入口上传。", "Upload through system updates on a compatible A/B system.")}</td></tr>
                <tr><td>{t("更新网页与应用服务", "Update UI and app")}</td><td><code>.tar.gz</code>{t(" App 升级包", " app archive")}</td><td>{t("通过网页应用升级入口上传，按发布说明确认系统兼容性。", "Upload through app updates and check system compatibility in release notes.")}</td></tr>
              </tbody>
            </table>
          </div>
          <p className={styles.note}>{t("三类文件都要匹配设备平台。升级包不能代替烧录镜像，GitHub 自动提供的 Source code 压缩包也不是可烧录镜像。", "All package types must match the platform. Update bundles and GitHub-generated Source code archives are not flashable disk images.")}</p>
          <Link to={`${base}/docs/function/update`}>{t("查看应用 / 系统升级说明 →", "Read app / system update instructions →")}</Link>
        </section>

        <section className={styles.nextSteps} aria-labelledby="download-and-flash">
          <div className={styles.sectionHeading}>
            <span className={styles.step}>03</span>
            <div><h2 id="download-and-flash">{t("下载、校验，然后烧录", "Download, verify, then flash")}</h2></div>
          </div>
          <ol>
            <li>{t("打开 Releases，阅读所选版本的发布说明，确认型号和安装要求。标有 ", "Open Releases and read the selected version’s model and installation requirements. ")}<strong>Pre-release</strong>{t(" 的是预发布版本。", " indicates a preview release.")}</li>
            <li>{t("展开该版本的 ", "Expand the release’s ")}<strong>Assets</strong>{t(" 附件列表，下载对应型号的 ", " list and download the model’s ")}<code>.img.xz</code>{t(" 和发布方提供的 ", " plus the publisher’s ")}<code>SHA256SUMS</code>{t(" 校验文件。", " checksum file.")}</li>
            <li>{t("按校验文件核对下载内容，再跟随烧录教程完成写入、校验和首次启动。", "Verify the download against the checksum file, then follow the guide for writing, verification and first boot.")}</li>
          </ol>
          <div className={styles.actions}>
            <Link className="button button--primary" to={flashGuide}>{t("开始烧录 SD 卡 / eMMC", "Flash SD / eMMC")}</Link>
            <Link to={`${base}/docs/getting-started/first-steps`}>{t("已装好系统？进入首次使用 →", "Already installed? First steps →")}</Link>
          </div>
          <p className={styles.note}>{t("发布版本、附件和兼容范围以 GitHub Releases 的说明为准。", "GitHub release notes define versions, assets and compatibility.")}</p>
        </section>
      </main>
    </Layout>
  );
}

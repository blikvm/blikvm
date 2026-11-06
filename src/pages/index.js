import {getProducts} from '@site/src/components/ChineseProductCatalog/data';
import useSiteLanguage from '@site/src/components/useSiteLanguage';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import demoPreview from '@site/images/blikvm-readme-hero.png';

import styles from './index.module.css';
import Translate from '@docusaurus/Translate';

import React, { useCallback, useEffect, useRef, useState } from 'react';

function LazyVideo({ src, title }) {
  const youtubeId = src.match(/^https:\/\/www\.youtube\.com\/embed\/([\w-]{11})$/)?.[1];
  const poster = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : undefined;
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleClick = useCallback(() => setIsLoaded(true), []);

  if (!isVisible || !isLoaded) {
    return (
      <button
        ref={ref}
        type="button"
        className={styles.videoPlaceholder}
        style={poster ? {backgroundImage: `url("${poster}"), var(--video-placeholder-background)`} : undefined}
        onClick={handleClick}
        aria-label={`Load ${title}`}
      >
        <span className={styles.videoPlayButton} aria-hidden="true" />
      </button>
    );
  }

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      className={styles.videoItem}
      allowFullScreen
      loading="lazy"
    />
  );
}


export default function Home() {
  const { siteConfig, i18n: { currentLocale } } = useDocusaurusContext();
  const {zh, base, t} = useSiteLanguage();
  const familyImage = useBaseUrl('/img/blikvm-family-homepage.png');
  const hpCaseImage = useBaseUrl('/assets/images/cases/hp-bios-kvm-orch.png');
  const hpCaseUrl = useBaseUrl('/cases/hp-bios');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const { pathname, search, hash } = window.location;

    const preferredLocaleKey = 'blikvm.preferredLocale';

    const safeGetPreferredLocale = () => {
      try {
        return window.localStorage?.getItem(preferredLocaleKey) || null;
      } catch {
        return null;
      }
    };

    const safeSetPreferredLocale = (locale) => {
      try {
        window.localStorage?.setItem(preferredLocaleKey, locale);
      } catch {
        // ignore
      }
    };

    const referrer = typeof document !== 'undefined' ? document.referrer : '';

    // 记录用户“显式”语言切换：
    // - 从中文站点切到根路径（英文默认语言）时，优先写入 en，避免被自动跳回中文。
    if ((pathname === '/' || pathname === '/index.html') && referrer.includes('/zh-CN/')) {
      safeSetPreferredLocale('en');
      return;
    }

    // - 从英文站点切到 /zh-CN/ 时，记录为 zh-CN。
    if (pathname.startsWith('/zh-CN') && !referrer.includes('/zh-CN/')) {
      safeSetPreferredLocale('zh-CN');
      return;
    }

    // 仅在访问根路径时做一次性语言判断。
    if (pathname !== '/' && pathname !== '/index.html') return;

    // 如果用户已经有偏好（手动选择过语言），尊重用户选择。
    if (safeGetPreferredLocale()) return;

    const languages = window.navigator.languages?.length
      ? window.navigator.languages
      : [window.navigator.language];

    const isChinese = languages.some((lang) => String(lang).toLowerCase().startsWith('zh'));
    if (!isChinese) return;

    // 跳转到中文站点，并保留 query/hash。
    safeSetPreferredLocale('zh-CN');
    window.location.replace(`/zh-CN/${search}${hash}`);
  }, []);

  // 商店链接配置
  const storeLinks = {
    'en': 'https://blicube.aliexpress.com/store/1101755276',
    'zh-CN': 'https://shop110478222.taobao.com'
  };

  // 获取当前语言的商店链接
  const currentStoreLink = storeLinks[currentLocale] || storeLinks['en'];


  const intro = t(
    '从进 BIOS 排障到挂载镜像重装系统，打开浏览器就能操作，被控电脑无需安装客户端。BliKVM 支持签名更新和网页诊断。支持 A/B 更新的设备会保留原系统供回退，新系统通过启动健康检查后才确认升级。搭配 BliSwitch 可管理 4 台或 8 台电脑，也可通过 OpenAPI 接入自动化测试。',
    'Troubleshoot BIOS or mount an installer from your browser without installing software on the target. BliKVM supports signed updates and web diagnostics. On devices with A/B updates, the previous system remains available for rollback, and the new version is committed only after boot health checks pass. Add BliSwitch to manage four or eight computers, or use OpenAPI to automate tests.',
  );
  const catalog = getProducts(zh);
  const models = catalog.filter(({group}) => group === 'blikvm');
  const switches = ['bliswitch-v1', 'bliswitch-v2'].map((id) => catalog.find((product) => product.id === id));
  const switchUses = {
    'bliswitch-v1': t('4 台电脑共享 HDMI 和 USB 键鼠', 'HDMI and USB switching for 4 computers'),
    'bliswitch-v2': t('8 台电脑共享 HDMI 和 USB，接好 ATX 后可逐台开机或复位', 'HDMI and USB switching for 8 computers, with per-host power and reset when wired for ATX'),
  };
  const modelUses = {
    'blikvm-v4': t('想直接部署，选独立一体机。', 'Choose a self-contained unit for a standalone setup.'),
    'blikvm-v3': t('已有树莓派 4B，选 HAT 扩展板。', 'Add a HAT to a Raspberry Pi 4B you already own.'),
    'blikvm-v2': t('需要装进机箱，选 PCIe 形态。', 'Choose the PCIe form factor for installation inside a PC.'),
    'blikvm-v1': t('用 Raspberry Pi CM4 搭建独立 KVM。', 'Build a standalone KVM around a Raspberry Pi CM4.'),
  };
  const tasks = [
    {title: t('远程排障', 'Troubleshoot remotely'), description: t('从开机画面进入 BIOS，即使系统无法启动也能查看画面、操作键鼠。', 'View the boot screen and use the keyboard and mouse in BIOS even when the operating system is unavailable.'), to: '/docs/getting-started/web-interface', label: t('了解控制台', 'Explore the console')},
    {title: t('装机与恢复', 'Install and recover'), description: t('把安装或救援镜像挂载成虚拟介质；接入 ATX 后，还可以远程控制电源和复位。', 'Mount an installer or rescue image as virtual media, and add ATX control for remote power and reset.'), to: '/docs/getting-started/first-steps', label: t('查看使用指南', 'Read the user guide')},
    {title: t('自动化集成', 'Build automations'), description: t('通过 OpenAPI 把 KVM 操作接入测试流程，例如发送按键、验证 BIOS 设置。', 'Use OpenAPI to integrate KVM actions into test workflows, such as sending keystrokes for BIOS verification.'), to: '/docs/development/api', label: t('查看 API 文档', 'Read the API guide')},
    {title: t('摄像头与麦克风', 'Camera and microphone'), description: t('使用 UVC 摄像头转发、模拟 USB 麦克风或第二路摄像头，扩展远程音视频场景。', 'Extend remote audio and video with UVC camera forwarding, USB microphone emulation, or a second camera input.'), to: '/docs/video/cameras', label: t('查看摄像头指南', 'Read the camera guide')},
  ];

  // 视频链接配置，根据不同语言提供不同的视频
  const videoLinks = {
    en: [
      "https://www.youtube.com/embed/sbH9-fmWBS8",
      "https://www.youtube.com/embed/HG7g3Qrupcw",
      "https://www.youtube.com/embed/3OPd7svT3bE",
      "https://www.youtube.com/embed/cVWF3u-y-Zg",
      "https://www.youtube.com/embed/Mvfjzb_EUvE",
      "https://www.youtube.com/embed/Wn5UXY4W6E0"
    ],
    'zh-CN': [
      "//player.bilibili.com/player.html?isOutside=true&aid=836180766&bvid=BV1vg4y1S7Qk&cid=1404763711&p=1",
      "//player.bilibili.com/player.html?isOutside=true&aid=410062899&bvid=BV1cG411k7Cs&cid=1374719019&p=1",
      "//player.bilibili.com/player.html?isOutside=true&aid=896215077&bvid=BV1GA4y1Q7PK&cid=589734284&p=1",
      "//player.bilibili.com/player.html?isOutside=true&aid=903015761&bvid=BV1yP4y1R7mC&cid=904511706&p=1",
      "//player.bilibili.com/player.html?isOutside=true&aid=986760434&bvid=BV1Qt4y1M7Mc&cid=867564506&p=1",
      "//player.bilibili.com/player.html?isOutside=true&aid=115122823499281&bvid=BV1Y6aGzxEZw&cid=32071549711&p=1"
    ]
  };
  
  // 获取当前语言的视频链接，如果没有对应语言的链接，则使用英文链接
  const currentVideoLinks = videoLinks[currentLocale] || videoLinks.en;

  return (
    <Layout
      wrapperClassName={styles.chineseHome}
      title={`Welcome to ${siteConfig.title}`}
      description={intro}>


      <header className={styles.homeHero}>
        <div className={styles.homeHeroInner}>
          <div>
            <span className={styles.demoEyebrow}>BliKVM · KVM OVER IP</span>
            <h1>{t('电脑进不了系统，也能远程控制', 'Control your computer, even when it won’t boot')}</h1>
            <p>{intro}</p>
            <div className={styles.heroActions}>
              <a href="#demo-preview" className={styles.heroPrimary}>{t('在线体验', 'Try the demo')} <span aria-hidden="true">↓</span></a>
              <a href="#products" className={styles.heroSecondary}>{t('选择型号', 'Choose a model')}</a>
              <Link to={`${base}/docs/`}>{t('查看文档', 'Documentation')}</Link>
            </div>
          </div>
          <img src={familyImage} alt={t('BliKVM v1 CM4、v2 PCIe、v3 HAT 和 v4 Allwinner', 'BliKVM v1 CM4, v2 PCIe, v3 HAT, and v4 Allwinner')} width={1098} height={332} decoding="async" fetchPriority="high" />
        </div>
      </header>

      <section id="demo-preview" className={styles.demoShowcase} aria-labelledby="demo-preview-heading">
        <div className={styles.demoShowcaseInner}>
          <span className={styles.demoEyebrow}><Translate id="homepage.demoPreview.badge">INTERACTIVE DEMO</Translate></span>
          <h2 id="demo-preview-heading"><Translate id="homepage.demoPreview.title">Your computer, in your browser</Translate></h2>
          <p className={styles.demoIntro}><Translate id="homepage.demoPreview.description">Explore remote video, keyboard control, and virtual media in the BliKVM console.</Translate></p>
          <figure className={styles.demoFigure}>
            <div className={styles.demoScreen}>
              <img src={demoPreview} alt={currentLocale === 'zh-CN' ? 'BliKVM 在线演示的远程桌面、虚拟介质和键盘' : 'BliKVM demo with a remote desktop, virtual media, and keyboard'} width={2400} height={1860} loading="lazy" decoding="async" />
              <div className={styles.demoAction}>
                <a className={styles.demoLaunch} href="https://blikvm.com/demo/">
                  <span aria-hidden="true">▶</span>
                  <Translate id="homepage.demoPreview.cta">Try the BliKVM Console</Translate>
                </a>
              </div>
            </div>
            <figcaption><Translate id="homepage.demoPreview.caption">Try the BliKVM interface with a simulated desktop. No hardware needed.</Translate></figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.homeBand} aria-labelledby="wiring-heading">
        <div className={styles.homeInner}>
          <div className={styles.homeSectionHeading}>
            <span className={styles.demoEyebrow}>{t('工作原理', 'HOW IT WORKS')}</span>
            <h2 id="wiring-heading">{t('从接线到远程控制', 'From cables to remote control')}</h2>
            <p>{t('以 BliKVM v4 为例：画面走 HDMI，键鼠走 USB，浏览器通过网络访问 BliKVM。', 'BliKVM v4 example: HDMI carries video, USB carries keyboard and mouse input, and your browser connects over the network.')}</p>
          </div>
          <figure className={styles.wiring}>
            <div className={styles.wiringFlow}>
              <div className={styles.wiringNode}>
                <svg viewBox="0 0 64 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="4" width="54" height="32" rx="4"/><path d="M32 36v8m-10 0h20M5 29h54"/></svg>
                <strong>{t('被控电脑', 'Target computer')}</strong>
                <small>{t('无需安装客户端', 'No software on the target')}</small>
              </div>
              <div className={styles.wiringConnection}>
                <span>HDMI / USB</span><span className={styles.wireLine} aria-hidden="true" />
              </div>
              <div className={clsx(styles.wiringNode, styles.wiringDevice)}>
                <img src={`${base}/img/product/blikvm-v4-transp.webp`} alt="" loading="lazy" />
                <strong>BliKVM v4</strong>
                <small>{t('使用独立供电', 'Separately powered')}</small>
              </div>
              <div className={styles.wiringConnection}>
                <span>{t('网络', 'Network')}</span><span className={styles.wireLine} aria-hidden="true" />
              </div>
              <div className={styles.wiringNode}>
                <svg viewBox="0 0 64 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="5" width="54" height="38" rx="5"/><path d="M5 15h54m-46-5h1m5 0h1m5 0h1m3 13-6 6 6 6m7-12 6 6-6 6"/></svg>
                <strong>{t('你的浏览器', 'Your browser')}</strong>
                <small>{t('查看画面、操作键鼠', 'View video and send input')}</small>
              </div>
            </div>
            <figcaption>{t('需要远程开机或复位时，可按设备手册选接 ATX 电源控制。', 'For remote power and reset, connect optional ATX control as described in your device guide.')}</figcaption>
          </figure>
          <div className={styles.homeLinks}>
            <Link to={`${base}/docs/getting-started/first-steps`}>{t('查看快速入门 →', 'Read the quick start →')}</Link>
            <Link to={`${base}/docs/device-guides/BliKVM-v4-guide`}>{t('查看 v4 接线指南 →', 'See the v4 wiring guide →')}</Link>
          </div>
        </div>
      </section>

      <section id="products" className={clsx(styles.homeBand, styles.homeTint)} aria-labelledby="models-heading">
        <div className={styles.homeInner}>
          <div className={styles.homeSectionHeading}>
            <span className={styles.demoEyebrow}>{t('硬件选型', 'CHOOSE YOUR HARDWARE')}</span>
            <h2 id="models-heading">{t('哪款 BliKVM 适合你？', 'Which BliKVM is right for you?')}</h2>
            <p>{t('按你已有的硬件和安装方式选择。', 'Start with the hardware you have and how you want to install it.')}</p>
          </div>
          <div className={styles.modelGrid}>
            {models.map((model) => (
              <article className={styles.modelCard} key={model.id}>
                <div className={styles.modelImage}><img src={`${base}${model.img}`} alt="" loading="lazy" /></div>
                <div className={styles.modelBody}>
                  <h3>{model.title}</h3>
                  <strong>{model.description}</strong>
                  <p>{modelUses[model.id]}</p>
                  <div className={styles.modelLinks}>
                    <Link to={`${base}/product/${model.id}`}>{t('产品详情', 'Details')}</Link>
                    <Link to={`${base}/docs/${model.manual}`}>{t('安装手册', 'Manual')}</Link>
                    {model.buy && <a href={model.buy}>{t('购买 ↗', 'Buy ↗')}</a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.homeLinks}>
            <Link to={`${base}/products`}>{t('查看全部产品与配件 →', 'See all products and accessories →')}</Link>
          </div>
        </div>
      </section>

      <section className={styles.homeBand} aria-labelledby="tasks-heading">
        <div className={styles.homeInner}>
          <div className={styles.homeSectionHeading}>
            <span className={styles.demoEyebrow}>{t('功能与场景', 'WHAT YOU CAN DO')}</span>
            <h2 id="tasks-heading">{t('你可以用 BliKVM 做什么？', 'What can you do with BliKVM?')}</h2>
          </div>
          <section id="multi-host" className={styles.switchShowcase} aria-labelledby="multi-host-heading">
            <div className={styles.switchIntro}>
              <span className={styles.demoEyebrow}>{t('一控多', 'MULTI-HOST CONTROL')}</span>
              <h3 id="multi-host-heading">{t('一台 BliKVM，管理多台电脑', 'One BliKVM, multiple computers')}</h3>
              <p>{t(
                '把多台电脑接到 BliSwitch，在同一个浏览器控制台选择要操作的电脑。实验台、机柜或多台主机可以共用一台 BliKVM。',
                'Connect your computers to a BliSwitch and select the one to control from the same browser console. Share one BliKVM across a test bench, rack, or group of PCs.',
              )}</p>
              <Link to={`${base}/product/bliswitch-compare`}>{t('比较两款 BliSwitch →', 'Compare BliSwitch models →')}</Link>
            </div>
            <div className={styles.switchModels}>
              {switches.map((model) => (
                <Link className={styles.switchModel} to={`${base}/product/${model.id}`} key={model.id}>
                  <img src={`${base}${model.img}`} alt="" loading="lazy" />
                  <div>
                    <strong>{model.title}</strong>
                    <span>{switchUses[model.id]}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          <div className={styles.taskGrid}>
            {tasks.map(({title, description, to, label}) => (
              <article className={styles.taskCard} key={to}>
                <h3>{title}</h3><p>{description}</p><Link to={`${base}${to}`}>{label} →</Link>
              </article>
            ))}
          </div>
          <div className={styles.homeLinks}>
            <Link to={`${base}/features`}>{t('查看完整功能清单 →', 'See the full feature list →')}</Link>
          </div>
        </div>
      </section>

      <section id="use-cases" className={styles.useCasesSection}>
        <span className={styles.useCasesBadge}><Translate id="homepage.UseCase">Use Cases</Translate></span>
        <Link to={hpCaseUrl} className={styles.featuredCase}>
          <div className={styles.featuredCaseImage}><img src={hpCaseImage} alt={currentLocale === 'zh-CN' ? 'KVM-Orch HP BIOS 测试控制台' : 'KVM-Orch HP BIOS test console'} loading="lazy" width="1586" height="993" /></div>
          <div className={styles.featuredCaseBody}>
            <span className={styles.featuredCaseBadge}><Translate id="homepage.hpCaseBadge">Community case study</Translate></span>
            <h3><Translate id="homepage.hpCaseTitle">HP PC BIOS testing with BliKVM</Translate></h3>
            <p><Translate id="homepage.hpCaseSummary">See how a user-built KVM-Orch console brings remote video, BIOS test cases, execution logs and screenshot evidence into one workflow.</Translate></p>
            <div className={styles.featuredCaseTags}><span>BIOS</span><span>WebRTC</span><span>OCR</span></div>
            <span className={styles.featuredCaseCta}><Translate id="homepage.hpCaseCta">Explore the case study</Translate><span aria-hidden="true"> ↗</span></span>
          </div>
        </Link>
      </section>

      <section id="reviews" className={styles.videoSection}>
        <div className={styles.videoHeader}>
          <span className={styles.trustBadge}>
            <Translate id="homepage.videoTrustBadge">
              Trusted by Thousands of Customers Worldwide
            </Translate>
          </span>
          <h2 className={styles.videoTitle}>
            <Translate id="homepage.videoTitle1">
              Over
            </Translate> <span className={styles.highlight}>10,000</span>
             <Translate id="homepage.videoTitle2">
              BliKVMs are currently serving.
            </Translate>
          </h2>
          <a href={currentStoreLink} className={styles.orderButton}>
            <Translate id="homepage.orderButton">
              Order Now!
            </Translate>
          </a>
        </div>
        <div className={styles.videoGrid}>
          {currentVideoLinks.map((videoSrc, index) => (
            <LazyVideo
              key={`video-${index}`}
              src={videoSrc}
              title={`Video ${index + 1}`}
            />
          ))}
        </div>
      </section>

    </Layout>
  );
}

import ChineseProductCatalog from '@site/src/components/ChineseProductCatalog';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';
import Translate from '@docusaurus/Translate';

import React, { useCallback, useEffect, useRef, useState } from 'react';

function LazyVideo({ src, title }) {
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


  // 产品购买链接配置
  const productBuyLinks = {
    // BliKVM 产品链接
    'v4': {
      'en': "https://www.aliexpress.com/item/1005005859415746.html",
      'zh-CN': "https://item.taobao.com/item.htm?id=730202747005&skuId=5232532439357&spm=a21xtw.29178619.0.0"
    },
    'v3': {
      'en': "https://www.aliexpress.com/item/1005004377930400.html",
      'zh-CN': "https://item.taobao.com/item.htm?id=676852578588&spm=a21xtw.29178619.0.0"
    },
    'v2': {
      'en': "https://www.aliexpress.com/item/1005004572837650.html",
      'zh-CN': "https://item.taobao.com/item.htm?id=679753758084&spm=a21xtw.29178619.0.0"
    },
    'v1': {
      'en': "https://aliexpress.com/item/1005003262886521.html",
      'zh-CN': "https://item.taobao.com/item.htm?id=668763563893&spm=a21xtw.29178619.0.0"
    },
    // BliSwitch 产品链接
    'bliswitch-v2': {
      'en': "https://www.aliexpress.com/item/1005008024603865.html",
      'zh-CN': "https://item.taobao.com/item.htm?id=844629346441&skuId=5624793497687&spm=a21xtw.29178619.0.0"
    },
    'bliswitch-v1': {
      'en': "https://aliexpress.com/item/1005005149590635.html",
      'zh-CN': "https://item.taobao.com/item.htm?id=698047414626&skuId=5116323395530&spm=a21xtw.29178619.0.0"
    },
    // Peripheral 产品链接
    'C792': {
      'en': "https://aliexpress.com/item/1005009325895459.html",
      'zh-CN': "https://item.taobao.com/item.htm?id=940263795279&skuId=6006324019050&spm=a21xtw.29178619.0.0"
    },
    'C790': {
      'en': "https://www.aliexpress.com/item/1005002861310912.html",
      'zh-CN': "https://item.taobao.com/item.htm?id=592007124730&spm=a21xtw.29178619.0.0"
    },
    'C779': {
      'en': "https://www.aliexpress.com/item/1005003033156483.html",
      'zh-CN': "https://item.taobao.com/item.htm?id=592007124730&skuId=4551174557715&spm=a21xtw.29178619.0.0"
    },
    'splitter': {
      'en': "https://aliexpress.com/item/1005003793429781.html",
      'zh-CN': "https://item.taobao.com/item.htm?id=674651463244&spm=a21xtw.29178619.0.0"
    }
  };

  // 获取当前语言的产品购买链接
  const getCurrentBuyLink = (productId) => {
    if (productBuyLinks[productId] && productBuyLinks[productId][currentLocale]) {
      return productBuyLinks[productId][currentLocale];
    }
    return productBuyLinks[productId]?.['en'] || '';
  };

  // BliKVM 产品
  const blikvmProducts = [
    {
      id: "v4",
      img: "/img/product/blikvm-v4-transp.webp",
      title: "BliKVM v4",
      description: "All-in-One Solution",
      width: 1920,
      height: 1440,
      dots: [false, false, false],
      href: "/docs/device-guides/BliKVM-v4-guide",
      buy: getCurrentBuyLink("v4"),
    },
    {
      id: "v3",
      img: "/img/product/blikvm-v3-transp.webp",
      title: "BliKVM v3",
      description: "Based on Raspberry Pi 4B",
      width: 1920,
      height: 1440,
      dots: [false, false, false],
      href: "/docs/device-guides/BliKVM-v3-guide",
      buy: getCurrentBuyLink("v3")
    },
    {
      id: "v2",
      img: "/img/product/blikvm-v2-transp.webp",
      title: "BliKVM v2",
      description: "PCIe Add-in Card",
      width: 1920,
      height: 1440,
      dots: [false, false, false],
      href: "/docs/device-guides/BliKVM-v2-guide",
      buy: getCurrentBuyLink("v2")
    },
    {
      id: "v1",
      img: "/img/product/blikvm-v1-transp.webp",
      title: "BliKVM v1",
      description: "Original Design, Plug-and-Play",
      width: 1920,
      height: 1440,
      dots: [false, false, false],
      href: "/docs/device-guides/BliKVM-v1-guide",
      buy: getCurrentBuyLink("v1")
    },
  ];

  // BliSwitch 产品
  const bliswitchProducts = [
    {
      id: "bliswitch-v2",
      img: "/img/product/bliswitch-v2-transp.webp",
      title: "BliSwitch v2",
      description: "8 IN 1 OUT & ATX Control",
      width: 1920,
      height: 1440,
      dots: [false, false, false],
      href: "/docs/device-guides/BliSwitch-v2-guide",
      buy: getCurrentBuyLink("bliswitch-v2")
    },
    {
      id: "bliswitch-v1",
      img: "/img/product/bliswitch-v1-transp.webp",
      title: "BliSwitch v1",
      description: "4 IN 1 OUT & Portable",
      width: 1920,
      height: 1440,
      dots: [false, false, false],
      href: "/docs/device-guides/BliSwitch-v1-guide",
      buy: getCurrentBuyLink("bliswitch-v1")
    },
  ];

  // Peripheral 产品
  const peripheralProducts = [
       {
      id: "C792",
      img: "/img/product/C792-transp.webp",
      title: "C792",
      description: "Video/Audio Capture & Video Passthrough",
      width: 1920,
      height: 1080,
      dots: [false, false, false],
      href: "/docs/device-guides/C792",
      buy: getCurrentBuyLink("C792")
    },
    {
      id: "C790",
      img: "/img/product/C790-transp.webp",
      title: "C790",
      description: "Video Capture & Audio Capture",
      width: 1920,
      height: 1080,
      dots: [false, false, false],
      href: "/docs/accessories/hdmi-csi-i2s#c790",
      buy: getCurrentBuyLink("C790")
    },
    {
      id: "C779",
      img: "/img/product/C779-transp.webp",
      title: "C779",
      description: "Video Capture",
      width: 1920,
      height: 1080,
      dots: [false, false, false],
      href: "/docs/accessories/hdmi-csi-i2s#c779",
      buy: getCurrentBuyLink("C779")
    },
    {
      id: "splitter",
      img: "/img/product/splitter-transp.webp",
      title: "Splitter",
      description: "USB-C Power Supply For Pi",
      width: 1920,
      height: 1440,
      dots: [false, false, false],
      href: "/docs/accessories/usb-splitter-guide",
      buy: getCurrentBuyLink("splitter")
    },
  ];

  // 轮播索引和切换逻辑
  const [startIdxKVM, setStartIdxKVM] = useState(0);
  const [startIdxSwitch, setStartIdxSwitch] = useState(0);
  const [startIdxPeripheral, setStartIdxPeripheral] = useState(0);

  const canPrevKVM = startIdxKVM > 0;
  const canNextKVM = startIdxKVM + 3 < blikvmProducts.length;
  const canPrevSwitch = startIdxSwitch > 0;
  const canNextSwitch = startIdxSwitch + 3 < bliswitchProducts.length;
  const canPrevPeripheral = startIdxPeripheral > 0;
  const canNextPeripheral = startIdxPeripheral + 3 < peripheralProducts.length;

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
      description="BliKVM - KVM Over IP">


      <header className={styles.hero}>
        <div className={styles.container}>
          {/* 左侧内容 */}
          <div className={styles.left}>
            <h1 className={styles.title}>BliKVM</h1>
            <h2 className={styles.subtitle}>KVM Over IP</h2>
            <p className={styles.description}>
              <Translate id="homepage.BlikvmIntro">
              BliKVM is the best solution for remote server management.
              </Translate>
              <br />
              <Translate id="homepage.BlikvmIntro2">
              It supports multiple platforms and ensures secure and reliable access.
              </Translate>
            </p>
            <div className={styles.buttons}>
              {(
                <a className={clsx(styles.button, styles.webButton)} href="https://blikvm.com/demo/" target="_blank" rel="noopener noreferrer">
                  {currentLocale === 'zh-CN' ? '在线体验' : 'Try the demo'}
                </a>
              )}
              <a className={clsx(styles.button, styles.iosButton)} href={currentLocale === 'zh-CN' ? '/zh-CN/docs/' : '/docs/'}>
                <Translate id="homepage.Document">
                  DOCUMENTATION
                </Translate>
              </a>
              <a className={clsx(styles.button, styles.androidButton)} href={currentStoreLink}>
                <Translate id="homepage.Store">
                  STORE
                </Translate>
              </a>
            </div>
          </div>
          {/* 右侧图片 */}
          <div className={styles.right}>
            <img
              src="/img/product/blikvm-v4-transp.webp"
              alt="BliKVM v4"
              className={styles.image}
              width={1920}
              height={1440}
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
      </header>

      <section className={styles.featuresSection} >
        <div className={styles.featuresHeader}>
          <span className={styles.featuresBadge}>BliKVM Features</span>
          <h2 className={styles.featuresTitle}>
            <Translate id="homepage.BlikvmFeature1">
              Meet All Your Needs
            </Translate>
            </h2>
          <p className={styles.featuresDescription}>
            <Translate id="homepage.BlikvmFeature2">
              We provide powerful features for your server and will continue to improve them.
            </Translate>
          </p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>🛡️</span>
            <p><Translate id="feature.NonInvasive">Non-Invasive Remote Control</Translate></p>
          </div>
          <div className={styles.featureItem}>
            <div className = {styles.featureImageIcon}>
              <img src="/img/icon/api.svg" alt="API" className={styles.featureIcon} />
            </div>
            <p><Translate id="feature.OpenApi">Open APIs</Translate></p>
          </div>
          {(
            <>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon} aria-hidden="true">🎙️</span>
                <p>{currentLocale === 'zh-CN' ? '模拟 USB 麦克风' : 'USB microphone emulation'}</p>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon} aria-hidden="true">📷</span>
                <p>{currentLocale === 'zh-CN' ? '模拟 UVC 摄像头' : 'UVC camera emulation'}</p>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon} aria-hidden="true">📹</span>
                <p>{currentLocale === 'zh-CN' ? '第二路摄像头接入' : 'Second camera input'}</p>
              </div>
            </>
          )}
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>🎥</span>
            <p><Translate id="feature.VideoCapture">Video Capture</Translate></p>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>⌨️🖱️</span>
            <p><Translate id="feature.KeyboardMouseForwarding">Keyboard/Mouse Forwarding</Translate></p>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>💿</span>
            <p><Translate id="feature.RemoteOSReinstallation">Remote OS Reinstallation</Translate></p>
          </div>
          <div className={styles.featureItem}>
            <div className = {styles.featureImageIcon}>
              <img src="/img/icon/discord.svg" alt="Discord" className={styles.featureIcon} />
            </div>
            <p><Translate id="feature.ActiveCommunity">Active Community</Translate></p>
          </div>
          <div className={styles.featureItem}>
            <div className = {styles.featureImageIcon}>
              <img src="/img/icon/power_on.svg" alt="Power" className={styles.featureIcon} />
            </div>
            <p><Translate id="feature.RemotePowerOnOff">Remote Power On/Off</Translate></p>
          </div>
          <div className={styles.featureItem}>
            <div className = {styles.featureImageIcon}>
              <img src="/img/icon/browser.svg" alt="Browser" className={styles.featureIcon} />
            </div>
            <p><Translate id="feature.AccessViaWebUI">Access via Web UI</Translate></p>
          </div>
          <div className={styles.featureItem}>
            <div className = {styles.featureImageIcon}>
              <img src="/img/icon/language.svg" alt="Language" className={styles.featureIcon} />
            </div>
            <p><Translate id="feature.MultiLanguageSwitching">Multi-Language Switching</Translate></p>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>🌐</span>
            <p><Translate id="feature.WakeOnLan">Wake-on-LAN</Translate></p>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>📊</span>
            <p><Translate id="feature.HealthMonitoring">Health Monitoring</Translate></p>
          </div>
        </div>
      </section>

      <main id="products" className={styles.productsSection}>
        <ChineseProductCatalog />
      </main>

      <section className={styles.useCasesSection}>
        <span className={styles.useCasesBadge}>Use Cases</span>
        <div className={styles.useCasesGrid}>
          <div className={styles.useCaseItem}>
            <img src="/img/icon/office.svg" alt="Office IT Management" className={styles.useCaseIcon} />
            <div className={styles.useCaseContent}>
              <h3>
                <Translate id="homepage.UseCaseTitle1">
                Office IT Management
                </Translate>
              </h3>
              <p>
                <Translate id="homepage.UseCase1">
                BliKVM helps office staff efficiently resolve all IT issues with remote operations on computers and printers in his office and can enable remote work from home.
                </Translate>
              </p>
            </div>
          </div>
          <div className={styles.useCaseItem}>
            <img src="/img/icon/data-center.svg" alt="Datacenter Remote Management" className={styles.useCaseIcon} />
            <div className={styles.useCaseContent}>
              <h3>
                <Translate id="homepage.UseCaseTitle2">
                Datacenter Remote Management
                </Translate>
              </h3>
              <p>
                <Translate id="homepage.UseCase2">
                BliKVM helps data center engineers remotely resolve the data center access issue for thousands of users by checking server statuses, adjusting configurations, and rerouting traffic within an hour.
                </Translate>
              </p>
            </div>
          </div>
          {/* <div className={styles.useCaseItem}>
            <img src="/img/remote-helpdesk-icon.png" alt="Remote Helpdesk" className={styles.useCaseIcon} />
            <div className={styles.useCaseContent}>
              <h3>Remote Helpdesk</h3>
              <p>
                Provide a self-service TinyPilot station at a remote office and allow your IT Support team to troubleshoot from afar.
              </p>
            </div>
          </div>
          <div className={styles.useCaseItem}>
            <img src="/img/server-access-icon.png" alt="On-Demand Server Access" className={styles.useCaseIcon} />
            <div className={styles.useCaseContent}>
              <h3>On-Demand Server Access</h3>
              <p>
                Plug a TinyPilot in and start troubleshooting within minutes when you need quick remote access in a server room.
              </p>
            </div>
          </div> */}
          <div className={styles.useCaseItem}>
            <img src="/img/icon/manufacturer.svg" alt="Manufacturing" className={styles.useCaseIcon} />
            <div className={styles.useCaseContent}>
              <h3>
                <Translate id="homepage.UseCaseTitle3">
                Manufacturing Management
                </Translate>
              </h3>
              <p>
                <Translate id="homepage.UseCase3">
                BliKVM helps factory operators achieve large-scale and automated production by controlling most special equipment with USB and video ports or integrating into automated processes via API.
                </Translate>
              </p>
            </div>
          </div>
          {/* <div className={styles.useCaseItem}>
            <img src="/img/broadcast-icon.png" alt="Broadcast Control Room" className={styles.useCaseIcon} />
            <div className={styles.useCaseContent}>
              <h3>Broadcast Control Room</h3>
              <p>
                TinyPilot provides a way for many team members to view and control a single computer used for audio or video broadcasting.
              </p>
            </div>
          </div> */}
        </div>
      </section>

      <section className={styles.videoSection}>
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

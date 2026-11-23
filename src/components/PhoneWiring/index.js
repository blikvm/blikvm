import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useSiteLanguage from '@site/src/components/useSiteLanguage';
import styles from './styles.module.css';

export default function PhoneWiring() {
  const {t} = useSiteLanguage();
  const deviceImage = useBaseUrl('/img/product/blikvm-v1-transp.webp');

  return (
    <figure className={styles.figure}>
      <div className={styles.diagram} aria-hidden="true">
        <div className={styles.device}>
          <div className={styles.deviceArt}>
            <span className={styles.phone} />
          </div>
          <div>
            <strong>iPhone</strong>
            <span className={styles.detail}>{t('USB-C 接口', 'USB-C port')}</span>
          </div>
        </div>

        <div className={styles.upstream}>
          <span className={styles.line} />
          <span>{t('USB-C 上行', 'USB-C upstream')}</span>
        </div>

        <div className={styles.device}>
          <div className={styles.deviceArt}>
            <span className={styles.dock}><span /><span /></span>
          </div>
          <div>
            <strong>{t('USB-C 扩展坞', 'USB-C dock')}</strong>
            <span className={styles.detail}>{t('HDMI 输出与 USB 数据', 'HDMI out and USB data')}</span>
          </div>
        </div>

        <div className={styles.paths}>
          <div className={`${styles.path} ${styles.video}`}>
            <span className={styles.dockPort}>HDMI OUT</span>
            <span className={styles.cable}>
              <span className={styles.line} />
              <span className={styles.lineLabel}>{t('HDMI 画面', 'HDMI video')}</span>
            </span>
            <span className={styles.kvmPort}>HDMI IN</span>
          </div>
          <div className={`${styles.path} ${styles.input}`}>
            <span className={styles.dockPort}>{t('USB 数据口', 'USB data port')}</span>
            <span className={styles.cable}>
              <span className={styles.line} />
              <span className={styles.lineLabel}>{t('USB 键鼠', 'USB keyboard and mouse')}</span>
            </span>
            <span className={styles.kvmPort}>OTG</span>
          </div>
        </div>

        <div className={styles.device}>
          <div className={styles.deviceArt}>
            <img src={deviceImage} alt="" loading="lazy" decoding="async" />
          </div>
          <div>
            <strong>BliKVM v1</strong>
            <span className={styles.detail}>PWR IN · 5 V / 3 A</span>
          </div>
        </div>
      </div>
      <figcaption>
        {t(
          '以 USB-C iPhone 和 BliKVM v1 为例。HDMI 将画面送到 BliKVM，USB 通过扩展坞将键鼠输入送回手机。',
          'USB-C iPhone and BliKVM v1 example. HDMI carries video to BliKVM, and USB carries keyboard and mouse input back through the dock.',
        )}
      </figcaption>
    </figure>
  );
}

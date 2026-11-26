import React from 'react';
import Layout from '@theme/Layout';
import useSiteLanguage from '@site/src/components/useSiteLanguage';
import piPreview from '@site/images/demo-console-pi.webp';
import v4Preview from '@site/images/demo-console-v4.webp';
import homeStyles from './index.module.css';
import styles from './demos.module.css';

const demos = [
  {platform: 'pi', preview: piPreview, title: 'BliKVM v1 / v2 / v3 Demo', controller: 'PC', target: 'PC'},
  {platform: 'v4', preview: v4Preview, title: 'BliKVM v4 Demo', controller: 'PC', target: 'PC'},
];

export default function Demos() {
  const {t} = useSiteLanguage();
  const title = t('在线演示', 'Interactive demos');
  const description = t(
    '在浏览器中体验 BliKVM 远程控制。演示使用模拟桌面，无需连接硬件。',
    'Try BliKVM remote control in your browser with a simulated desktop. No hardware required.',
  );

  return (
    <Layout title={title} description={description}>
      <main className={homeStyles.demoShowcase}>
        <div className={homeStyles.demoShowcaseInner}>
          <header className={styles.intro}>
            <h1>{title}</h1>
            <p className={homeStyles.demoIntro}>{description}</p>
          </header>
          <div className={styles.grid}>
            {demos.map(({platform, preview, title: name, controller, target}) => (
              <article className={styles.card} key={platform}>
                <div className={styles.details}>
                  <h2>{name}</h2>
                  <dl className={styles.devices}>
                    <div>
                      <dt>{t('控制端', 'Controller')}</dt>
                      <dd>{controller}</dd>
                    </div>
                    <div>
                      <dt>{t('被控端', 'Target')}</dt>
                      <dd>{target}</dd>
                    </div>
                  </dl>
                </div>
                <div className={homeStyles.demoScreen}>
                  <img src={preview} alt="" width={1440} height={942} decoding="async" />
                  <div className={homeStyles.demoAction}>
                    <a
                      className={homeStyles.demoLaunch}
                      href={`https://blikvm.com/demo/?platform=${platform}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`启动演示：${name}（新标签页）`, `Launch demo: ${name} (new tab)`)}
                    >
                      {t('启动演示', 'Launch demo')} <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}

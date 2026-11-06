import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useSiteLanguage from '@site/src/components/useSiteLanguage';
import {featureGroups} from '@site/src/components/FeatureCatalog/data';
import styles from './features.module.css';

export default function Features() {
  const {base, t} = useSiteLanguage();
  const title = t('BliKVM 功能清单', 'BliKVM feature list');
  const description = t(
    '按场景查找功能、适用条件和操作指南。',
    'Find features, their requirements, and setup guides by task.',
  );

  return (
    <Layout title={title} description={description}>
      <main className={styles.catalog}>
        <header className={styles.intro}>
          <h1>{title}</h1>
          <p>{description}</p>
          <p>{t(
            '实际可用功能取决于硬件型号、系统和 App 版本、账号权限，以及浏览器或配件支持。',
            'Availability depends on the hardware model, system and app versions, account permissions, and browser or accessory support.',
          )} <Link to={`${base}/docs/manuals/blikvm/`}>{t('查看各型号手册', 'See model manuals')}</Link></p>
        </header>

        <nav className={styles.jumpLinks} aria-label={t('功能分类', 'Feature categories')}>
          {featureGroups.map(({id, title: label}) => (
            <a key={id} href={`#${id}`}>{t(...label)}</a>
          ))}
        </nav>

        {featureGroups.map(({id, title: label, features}) => (
          <section key={id} id={id} className={styles.group} aria-labelledby={`${id}-heading`}>
            <h2 id={`${id}-heading`}>{t(...label)}</h2>
            <ul className={styles.list}>
              {features.map(([nameZh, nameEn, summaryZh, summaryEn, guide]) => (
                <li key={nameEn} className={styles.feature}>
                  <h3>
                    <Link to={`${base}/docs/${guide}`}>{t(nameZh, nameEn)}</Link>
                  </h3>
                  <p>{t(summaryZh, summaryEn)}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </Layout>
  );
}

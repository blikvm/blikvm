import React, {useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useSiteLanguage from '@site/src/components/useSiteLanguage';
import {featureGroups} from '@site/src/components/FeatureCatalog/data';
import styles from './features.module.css';

const channels = [
  ['服务器', 'Server'],
  ['台式机', 'Desktop'],
  ['存储', 'NAS'],
  ['实验台', 'Lab'],
];

const featuredSearches = ['ISO', 'UVC', 'Switch'];

function normalizeSearch(value) {
  return value.normalize('NFKC').toLowerCase().trim();
}

function SwitchPreview({base, t}) {
  const [selected, setSelected] = useState(0);

  return (
    <div className={styles.switchPreview}>
      <div className={styles.switchPreviewTop}>
        <img src={`${base}/img/product/bliswitch-v1-transp.webp`} alt="" width="960" height="720" />
        <div className={styles.switchStatus} role="status">
          <span>{t('当前主机', 'Active host')}</span>
          <strong>{t(...channels[selected])}</strong>
        </div>
      </div>
      <div className={styles.channels} role="group" aria-label={t('演示通道', 'Demo channels')}>
        {channels.map((name, index) => (
          <button
            key={name[1]}
            type="button"
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
          >
            <span>0{index + 1}</span>
            {t(...name)}
          </button>
        ))}
      </div>
    </div>
  );
}

function FeatureDemos({base, t, zh}) {
  const videoAnchor = zh ? '实测视频' : 'hands-on-test-video';

  return (
    <section className={styles.showcase} aria-labelledby="feature-demos-heading">
      <h2 id="feature-demos-heading">{t('上手演示', 'See it in action')}</h2>
      <div className={styles.demos}>
        <article className={styles.demo}>
          <div className={`${styles.demoVisual} ${styles.installVisual}`}>
            <img
              src={`${base}/assets/images/software-current/virtual-media-${zh ? 'zh' : 'en'}.png`}
              alt={t('模拟控制台中的虚拟光驱和 ISO 镜像列表', 'Virtual CD/DVD and ISO list in the simulated console')}
              decoding="async"
            />
            <span className={styles.visualLabel}>{t('在线模拟', 'Interactive demo')}</span>
          </div>
          <div className={styles.demoBody}>
            <h3>{t('远程装机', 'Install an OS remotely')}</h3>
            <p>{t('挂载 ISO 镜像，再从被控电脑的启动菜单进入安装程序。', 'Mount an ISO and start the installer from the target’s boot menu.')}</p>
            <a className={styles.demoLink} href="/demo/?platform=pi">
              {t('试用装机演示', 'Try the install demo')} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
        <article className={styles.demo}>
          <div className={`${styles.demoVisual} ${styles.gamepadVisual}`}>
            <img
              src={`${base}/assets/images/features/gamepad-switch-demo.jpg`}
              alt={t('实测中的 Nintendo Switch 画面和 BliKVM 手柄设置', 'Nintendo Switch screen and BliKVM gamepad settings in the hands-on test')}
              width="960"
              height="540"
              decoding="async"
            />
            <span className={styles.visualLabel}>{t('实测视频', 'Hands-on video')}</span>
          </div>
          <div className={styles.demoBody}>
            <h3>{t('远程使用游戏手柄', 'Play with a remote gamepad')}</h3>
            <p>{t('把本地手柄的按键和摇杆输入转发给远端 Nintendo Switch。', 'Forward buttons and stick input from a local controller to a remote Nintendo Switch.')}</p>
            <Link className={styles.demoLink} to={`${base}/docs/peripheral-devices/gamepad#${videoAnchor}`}>
              {t('观看实测', 'Watch the test')} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </article>
        <article className={styles.demo}>
          <div className={styles.demoVisual}>
            <span className={styles.visualLabel}>{t('切换示意', 'Switching preview')}</span>
            <SwitchPreview base={base} t={t} />
          </div>
          <div className={styles.demoBody}>
            <h3>{t('切换多台电脑', 'Switch between computers')}</h3>
            <p>{t('选择一个通道，HDMI 画面和 USB 键鼠随之切换到对应主机。', 'Select a channel to route HDMI video and USB input to that computer.')}</p>
            <Link className={styles.demoLink} to={`${base}/docs/peripheral-devices/kvm-switch`}>
              {t('查看切换步骤', 'See switching steps')} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

export default function Features() {
  const {base, t, zh} = useSiteLanguage();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const searchInput = useRef(null);
  const title = t('BliKVM 功能清单', 'BliKVM feature list');
  const description = t(
    '从浏览器操作 BIOS、重装系统、切换主机或转发外设。查找每项功能的用途、适用条件和操作指南。',
    'Access BIOS, install an OS, switch hosts, or forward peripherals from your browser. Find what each feature does, what it requires, and how to use it.',
  );
  const normalizedQuery = normalizeSearch(query);
  const searchTerms = normalizedQuery ? normalizedQuery.split(/\s+/) : [];
  const groups = featureGroups
    .filter(({id}) => category === 'all' || id === category)
    .map((group) => ({
      ...group,
      features: group.features.filter(([nameZh, nameEn, summaryZh, summaryEn, , options]) => {
        const searchable = normalizeSearch([
          nameZh, nameEn, summaryZh, summaryEn, options?.keywords, ...(options?.requirements ?? []),
        ].join(' '));
        return searchTerms.every((term) => searchable.includes(term));
      }),
    }))
    .filter(({features}) => features.length > 0);
  const resultCount = groups.reduce((count, {features}) => count + features.length, 0);
  const searchPlaceholder = t('搜索功能，例如 ISO、UVC、Switch', 'Search features, e.g. ISO, UVC, Switch');

  function clearSearch() {
    setQuery('');
    searchInput.current?.focus();
  }

  return (
    <Layout title={title} description={description}>
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className={`${styles.container} ${styles.heroInner}`}>
            <div className={styles.intro}>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
            <div className={styles.search}>
              <label className={styles.searchLabel} htmlFor="feature-search">{t('搜索功能', 'Search features')}</label>
              <div className={styles.searchField}>
                <span className={styles.searchIcon} aria-hidden="true" />
                <input
                  id="feature-search"
                  ref={searchInput}
                  type="search"
                  placeholder={searchPlaceholder}
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  aria-controls="feature-results"
                />
                {query && (
                  <button type="button" className={styles.clear} onClick={clearSearch} aria-label={t('清空搜索', 'Clear search')}>
                    ×
                  </button>
                )}
              </div>
              <div className={styles.quickSearch} role="group" aria-label={t('常用搜索', 'Quick searches')}>
                {featuredSearches.map((term) => (
                  <button
                    type="button"
                    key={term}
                    onClick={() => {
                      setCategory('all');
                      setQuery(term);
                    }}
                    aria-pressed={normalizedQuery === term.toLowerCase()}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className={styles.container}>
          {!normalizedQuery && <FeatureDemos base={base} t={t} zh={zh} />}
          <section className={styles.catalog} aria-labelledby="feature-catalog-heading">
            <div className={styles.catalogHeading}>
              <h2 id="feature-catalog-heading">{t('功能目录', 'Feature catalog')}</h2>
              <Link to={`${base}/product/blikvm-compare`}>
                {t('比较 BliKVM 型号', 'Compare BliKVM models')} <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className={styles.filters} role="group" aria-label={t('按功能分类筛选', 'Filter by category')}>
              <button type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
                {t('全部', 'All')}
              </button>
              {featureGroups.map(({id, title: label}) => (
                <button type="button" key={id} aria-pressed={category === id} onClick={() => setCategory(id)}>
                  {t(...label)}
                </button>
              ))}
            </div>
            <p className={styles.resultCount} role="status">
              {t(`找到 ${resultCount} 项功能`, `${resultCount} ${resultCount === 1 ? 'feature' : 'features'} found`)}
            </p>
            <div id="feature-results">
              {resultCount === 0 && (
                <div className={styles.empty}>
                  <p>{t('没有找到匹配的功能。', 'No matching features.')}</p>
                  <button type="button" onClick={() => {
                    setCategory('all');
                    clearSearch();
                  }}>{t('清除筛选', 'Clear filters')}</button>
                </div>
              )}
              {groups.map(({id, title: label, features}) => (
                <section key={id} id={id} className={styles.group} aria-labelledby={`${id}-heading`}>
                  <h3 id={`${id}-heading`}>{t(...label)}</h3>
                  <ul className={styles.list}>
                    {features.map(([nameZh, nameEn, summaryZh, summaryEn, guide, options]) => (
                      <li key={nameEn} className={styles.feature}>
                        <h4>
                          <Link to={`${base}/docs/${guide}`}>{t(nameZh, nameEn)}</Link>
                        </h4>
                        <p>{t(summaryZh, summaryEn)}</p>
                        {options?.requirements && (
                          <p className={styles.requirements}>
                            <strong>{t('适用条件', 'Requirements')}</strong>
                            {t(...options.requirements)}
                          </p>
                        )}
                        {options?.compare && (
                          <Link className={styles.compare} to={`${base}/product/${options.compare}-compare`}>
                            {options.compare === 'bliswitch'
                              ? t('比较 BliSwitch 型号', 'Compare BliSwitch models')
                              : t('查看型号对照', 'See model comparison')}
                            <span aria-hidden="true"> →</span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}

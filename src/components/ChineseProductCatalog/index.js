import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {getGroups, getProducts} from './data';
import useSiteLanguage from '../useSiteLanguage';
import s from './styles.module.css';

export function ManualCards() {
  const {zh, base, t} = useSiteLanguage();
  return <div className={s.grid}>{getGroups(zh).map(([id, title, desc]) => <article className={s.card} key={id}>
    <h3>{title}</h3><p>{desc}</p><Link to={`${base}/docs/manuals/${id}/`}>{t('打开使用手册 →', 'Open manual →')}</Link>
  </article>)}</div>;
}
export default function ProductCatalog({family}) {
  const {zh, base, t} = useSiteLanguage();
  return <section className={s.section}>
    <h1>{t('产品目录', 'Product catalog')}</h1>
    <p>{t('先了解产品用途，再进入对应手册完成安装与配置。', 'Choose a product, then follow its manual for installation and configuration. ')}<Link to={`${base}/docs/`}>{t('全部使用手册 →', 'All manuals →')}</Link></p>
    {getGroups(zh).filter(([id]) => !family || family.includes(id)).map(([id, title, desc]) => <section id={id} key={id}>
      <h2>{title}</h2><p>{desc}</p><div className={s.grid}>{getProducts(zh).filter(p => p.group === id).map(p => <article className={s.card} key={p.id}>
        <img src={`${base}${p.img}`} alt={p.title} loading="lazy"/><h3>{p.title}</h3><p>{p.description}</p>
        <div className={s.actions}><Link to={`${base}/product/${p.id}`}>{t('产品详情', 'Product details')}</Link><Link to={`${base}/docs/${p.manual}`}>{t('使用手册', 'Manual')}</Link>{p.buy && <a href={p.buy}>{t('购买 ↗', 'Buy ↗')}</a>}</div>
      </article>)}</div>
    </section>)}
  </section>;
}
export function ProductDetail({id}) {
  const {zh, base, t} = useSiteLanguage();
  const p = getProducts(zh).find(p => p.id === id);
  const g = getGroups(zh).find(g => g[0] === p.group);
  const notes = {
    capture: t('需要匹配主板 CSI 接口、驱动与系统；输入、环出和采集输出的规格应分别核对。', 'Match the host CSI interface, driver and system. Check input, passthrough and capture-output limits separately.'),
    splitter: t('面向 Raspberry Pi 4 的 USB-C 供电与 OTG 数据分离。使用前核对接口定义和 5V 供电要求。', 'Separates Raspberry Pi 4 USB-C power and OTG data. Check pin definitions and 5V power requirements before use.'),
    atx: t('适合需要远程触发主板电源或复位的场景。需要兼容的控制器和正确的主板接线。', 'For remotely triggering motherboard power or reset, using a compatible controller and correct wiring.'),
    bliswitch: t('用于多台电脑共享 HDMI / USB 通路。独立切换、串口控制及可用功能请按具体型号确认。', 'Shares HDMI / USB paths between computers. Check the model for independent switching, serial control and supported functions.'),
    blikvm: t('用于浏览器远程访问电脑，包括 BIOS / UEFI 和操作系统维护。安装形态、供电与接口请按型号手册确认。', 'Browser access to computers, including BIOS / UEFI and OS maintenance. Check the model manual for installation, power and connectors.'),
  };
  return <Layout title={p.title + t(' 产品介绍', ' product information')}><main className={s.detail}>
    <Link to={`${base}/products`}>{t('← 产品目录', '← Product catalog')}</Link><h1>{p.title}</h1><p>{p.description}</p><img className={s.hero} src={`${base}${p.img}`} alt={p.title}/>
    <h2>{t('用途与选型', 'Purpose and selection')}</h2><p>{g[2]}</p><p>{notes[p.group]}</p>
    <h2>{t('安装与使用', 'Installation and use')}</h2><p>{t('接口、尺寸、接线图和操作步骤集中维护在对应使用手册中。', 'The matching manual contains connectors, dimensions, wiring diagrams and operating steps.')}</p>
    <div className={s.actions}><Link className="button button--primary" to={`${base}/docs/${p.manual}`}>{t('打开型号使用手册', 'Open model manual')}</Link><Link to={`${base}/docs/manuals/${p.group}/`}>{t('系列手册', 'Family manual')}</Link><a href={p.buy}>{t('查看购买页面 ↗', 'View purchase page ↗')}</a></div>
    <p className={s.note}>{t('实际在售配置、价格和库存以购买页面为准。', 'See the purchase page for current configurations, prices and availability.')}</p>
  </main></Layout>;
}

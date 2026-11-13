import React from 'react';
import Link from '@docusaurus/Link';
import useSiteLanguage from '../useSiteLanguage';
import s from './styles.module.css';
export default function C778Cases() {
  const {base, t} = useSiteLanguage();
  const cases = [
    ['pi5', 'C778 + Raspberry Pi 5B', 'c778-raspberry-pi-5', t('树莓派 5B 连接实物展示，查看 CSI、供电与音频接入方法。', 'Raspberry Pi 5B assembly, with a guide to CSI, power and audio connections.')],
    ['rv1126b', t('C778 + 幸狐 RV1126B', 'C778 + Luckfox RV1126B'), 'c778-rv1126b', t('幸狐 RV1126B 连接实物展示，查看平台接入与 BSP 集成说明。', 'Luckfox RV1126B assembly, with platform wiring and BSP integration guidance.')],
  ];
  return <section id="use-cases" className={s.section}>
    <h2>{t('使用案例', 'Use cases')}</h2>
    <div className={s.grid}>{cases.map(([id, title, guide, desc]) => <article className={s.card} key={id}>
      <Link className={s.image} to={`${base}/docs/capture/${guide}`}><img src={`${base}/assets/images/c778/c778-${id}-case-v1.png`} alt={title} loading="lazy" /></Link>
      <div className={s.body}><h3>{title}</h3><p>{desc}</p><Link to={`${base}/docs/capture/${guide}`}>{t('查看接入指南 →', 'Read integration guide →')}</Link></div>
    </article>)}</div>
    <p className={s.note}>{t('图片基于实拍进行背景与光照处理；接线请以对应平台指南及接口定义为准。', 'Images are edited from assembly photos for background and lighting. Follow the platform guide and connector pinout when wiring.')}</p>
  </section>;
}

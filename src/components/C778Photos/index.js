import React from 'react';
import front from '@site/static/assets/images/c778/c778-front-cutout-v1.png';
import back from '@site/static/assets/images/c778/c778-back-cutout-v1.png';
import styles from './styles.module.css';
import useSiteLanguage from '../useSiteLanguage';

export default function C778Photos() {
  const {t} = useSiteLanguage();
  return <div className={styles.photos} aria-label={t("C778 正反面实物图", "C778 front and rear product views")}>
    <figure>
      <img src={front} alt={t("C778 模块正面实物修图，透明背景", "C778 front product photograph, retouched with a transparent background")} width="1214" height="1295" />
      <figcaption>{t("正面", "Front")}</figcaption>
    </figure>
    <figure>
      <img src={back} alt={t("C778 模块背面实物修图，透明背景", "C778 rear product photograph, retouched with a transparent background")} width="1231" height="1278" />
      <figcaption>{t("背面", "Rear")}</figcaption>
    </figure>
  </div>;
}

import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
const products = [
  ['C778', '/assets/images/c778/c778-front-cutout-v1.png', ['最高 4K 60Hz 采集与 HDMI 环出', '主芯片：龙迅 LT6911UXE', '支持 CSI 双通道输出', '1080P 高刷最高可达 120Hz', '支持音频采集'], ['Up to 4K 60Hz capture & HDMI loop-through', 'Main chip: Lontium LT6911UXE', 'Dual-channel CSI output', 'Up to 120Hz at 1080P', 'Audio capture supported']],
  ['C792', '/img/product/C792-transp.webp', ['最高 4K 60Hz 输入与 HDMI 环出', '最高 1080P 60Hz 采集', '主芯片：GSV2001 + TC358743', '支持音频采集'], ['Up to 4K 60Hz input & HDMI loop-through', 'Up to 1080P 60Hz capture', 'Main chips: GSV2001 + TC358743', 'Audio capture supported']],
  ['C790', '/img/product/C790-transp.webp', ['最高 1080P 输入与采集', '主芯片：东芝 TC358743XBG', '支持音频采集'], ['Up to 1080P input & capture', 'Main chip: Toshiba TC358743XBG', 'Audio capture supported']],
  ['C779', '/img/product/C779-transp.webp', ['最高 1080P 50Hz 输入与采集', '主芯片：东芝 TC358743XBG', '不支持音频采集'], ['Up to 1080P 50Hz input & capture', 'Main chip: Toshiba TC358743XBG', 'Audio capture not supported']],
];
function ProductCard({product, zh}) {
  const [model, image, cn, en] = product;
  return <Link className={styles.card} to={`${zh ? '/zh-CN' : ''}/docs/device-guides/${model}`}>
    <div className={styles.image}><img src={useBaseUrl(image)} alt={`${model} ${zh ? 'HDMI 采集模块' : 'HDMI capture module'}`} loading="lazy" /></div>
    <div className={styles.body}><h2>{model}</h2><ul className={styles.specs}>{(zh ? cn : en).map(spec => <li key={spec}>{spec}</li>)}</ul><span>{zh ? '查看使用手册' : 'Read manual'} <span aria-hidden="true">→</span></span></div>
  </Link>;
}
export default function CaptureCards({zh = false}) {
  return <div className={styles.grid}>{products.map(product => <ProductCard key={product[0]} product={product} zh={zh} />)}</div>;
}

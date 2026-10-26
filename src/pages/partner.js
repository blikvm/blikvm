import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Translate from '@docusaurus/Translate';

const partners = [
  {
    name: 'SHCHV Technology',
    logo: '/img/partner/SHCHV2.png',
    desc: 'ShenZhen, China',
    link: 'https://shchv.en.alibaba.com/search/product?SearchText=blikvm'
  },
  {
    name: '©Robu.in',
    logo: '/img/partner/ROBU.png',
    desc: 'India',
    link: 'https://robu.in/?s=blicube&post_type=product&dgwt_wcas=1'
  },
  {
    name: 'Spotpear',
    logo: '/img/partner/spotpear.png',
    desc: 'ShenZhen, China',
    link: 'https://spotpear.com/index/search/index.html?lx=0&keywords=blikvm'
  },
  // 可继续添加更多合作伙伴
];

export default function Partner() {
  const {i18n: {currentLocale}} = useDocusaurusContext();
  const visiblePartners = [...partners, {
    name: 'Seeed Studio',
    logo: '/img/partner/seeedstudio.png',
    desc: 'ShenZhen, China',
    link: 'https://www.seeedstudio.com/catalogsearch/result/?q=BliKVM&warehouse=CN+Warehouse+In+Stock%2CCN+or+US+Warehouse+In+Stock%2CCN+or+DE+Warehouse+In+Stock',
  }];
  const [tab, setTab] = useState('integrations');
  const [category, setCategory] = useState('all');

  return (
    <Layout title="Partners">
      <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 16px' }}>
        <div style={{ color: '#1a237e', fontWeight: 600, fontSize: 14, letterSpacing: 1, marginBottom: 8 }}>
          <Translate id="partner.title">
            Cooperation
          </Translate>
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 24, color: '#0a174e' }}>
          <Translate id="partner.description">
            Let BliKVM boost your business growth.
          </Translate>
        </h1>
        {/* Tab切换 */}
        <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: 24 }}>
          <div
            onClick={() => setTab('integrations')}
            style={{
              fontWeight: tab === 'integrations' ? 700 : 400,
              borderBottom: tab === 'integrations' ? '3px solid #1a237e' : 'none',
              padding: '0 24px 12px 0',
              cursor: 'pointer',
              color: tab === 'integrations' ? '#1a237e' : '#222'
            }}
          >
            <Translate id="partner.reseller">
              Resellers
            </Translate>
          </div>
          {/* <div
            onClick={() => setTab('packages')}
            style={{
              fontWeight: tab === 'packages' ? 700 : 400,
              borderBottom: tab === 'packages' ? '3px solid #1a237e' : 'none',
              padding: '0 24px 12px 0',
              cursor: 'pointer',
              color: tab === 'packages' ? '#1a237e' : '#222'
            }}
          >
            System Integrators
          </div> */}
        </div>
       
        {/* 分类下拉框（静态） */}
        {/*
        <div style={{ marginBottom: 32 }}>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #ccc',
              fontSize: 16,
              minWidth: 180
            }}
          >
            <option value="all">All Categories</option>
            <option value="cloud">云服务</option>
            <option value="crm">CRM</option>
          </select>
        </div>
        */}
        {/* 合作伙伴卡片 */}
        <div style={{
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
          marginBottom: 48
        }}>
          {visiblePartners.map((p, idx) => (
            <div key={idx} style={{
              flex: '1 1 300px',
              minWidth: 280,
              maxWidth: 340,
              background: '#fff',
              border: '1px solid #eee',
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <img src={p.logo} alt={p.name} style={{ width: p.name === 'Seeed Studio' ? 100 : 40, height: 40, objectFit: p.name === 'Seeed Studio' ? 'contain' : undefined, marginRight: 16, borderRadius: 8, background: '#fafafa' }} />
                <span style={{ fontWeight: 600, fontSize: 18 }}>{p.name}</span>
              </div>
              {/* 修改这里，将描述和图标放右侧横向排列 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', color: '#444', fontSize: 15, marginBottom: 24 }}>
                {/* 位置图标，示例用SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  style={{ width: 16, height: 16, marginRight: 6 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4-4-6-7-6-10a6 6 0 1112 0c0 3-2 6-6 10z" />
                </svg>
                <div>{p.desc}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <a href={p.link} style={{ color: '#1a237e', fontWeight: 600, fontSize: 20, textDecoration: 'none' }}>
                  <span style={{ verticalAlign: 'middle' }}>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
        {/* 如何成为合作伙伴 */}
        <div style={{
          background: '#f5f7fa',
          borderRadius: 12,
          padding: 32,
          marginBottom: 40
        }}>
          <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 16 }}>
            <Translate id="partner.ToBePartner">
              How to become our partner?
            </Translate>
          </h2>
          <ol style={{ paddingLeft: 20, marginBottom: 12 }}>
            <li>
              <Translate id="partner.ToBePartnerDescription1">
                Please send your company profile and cooperation intention to
              </Translate>  <a href="mailto:info@blicube.com">info@blicube.com</a>
            </li>
            <li>
              <Translate id="partner.ToBePartnerDescription2">
                After both parties reach an agreement, a cooperation agreement will be signed and we will officially become partners.
              </Translate>
            </li>
          </ol>
          <div style={{ marginTop: 12, color: '#1976d2', fontWeight: 500 }}>
            <Translate id="partner.welcome">
              We welcome various channel partners, distributors, system integrators, and industry solution providers to contact us, so as to jointly explore the market and achieve a win-win situation!
            </Translate>
          </div>
        </div>
      </div>
    </Layout>
  );
}
import useSiteLanguage from '../useSiteLanguage';
import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useColorMode} from '@docusaurus/theme-common';
import {RedocStandalone} from 'redoc';
import metadata from '@site/static/api/current/metadata.json';
import styles from './styles.module.css';

const specUrl = '/api/current/openapi.yaml';
export function ApiReferenceEntry() {
  const {t, base} = useSiteLanguage();
  return (
    <div className={styles.entry}>
      <div className={styles.entryIcon} aria-hidden="true">{'{ }'}</div>
      <div className={styles.entryText}>
        <h3>{t("接口参考", "API reference")}</h3>
        <p>{t("按功能搜索接口，查看请求参数、响应结构和示例。宽屏视图提供独立的接口目录与示例面板。", "Search endpoints and inspect request parameters, response schemas and examples in a dedicated full-width reference.")}</p>
        <div className={styles.actions}>
          <Link className="button button--primary" to={`${base}/api-reference`}>{t("打开接口参考 →", "Open API reference →")}</Link>
          <a href={specUrl} download="blikvm-openapi.yaml">{t("下载 OpenAPI YAML", "Download OpenAPI YAML")}</a>
        </div>
      </div>
    </div>
  );
}

function ContractViewer() {
  const {t, base} = useSiteLanguage();
  const {colorMode} = useColorMode();
  const [failed, setFailed] = useState(false);
  const options = useMemo(() => {
    const dark = colorMode === 'dark';
    return {
      hideDownloadButton: true,
      hideHostname: true,
      pathInMiddlePanel: true,
      requiredPropsFirst: true,
      sortPropsAlphabetically: false,
      jsonSampleExpandLevel: 2,
      nativeScrollbars: true,
      labels: {responses: t("响应", "Responses"), responseSamples: t("响应示例", "Response samples"), requestSamples: t("请求示例", "Request samples"), deprecated: t("已弃用", "Deprecated"), noResultsFound: t("未找到匹配接口", "No matching endpoints"), example: t("示例", "Examples"), examples: t("示例", "Examples"), default: t("默认值", "Default")},
      scrollYOffset: 60,
      theme: {
        spacing: {unit: 4, sectionHorizontal: 28, sectionVertical: 32},
        breakpoints: {small: '50rem', medium: '80rem', large: '105rem'},
        colors: {
          primary: {main: dark ? '#5ed8b5' : '#27835b'},
          text: {primary: dark ? '#e4e9ed' : '#23313b', secondary: dark ? '#a9b5bf' : '#62717c'},
          border: {light: dark ? '#34424d' : '#e2e8ed', dark: dark ? '#52606b' : '#bcc8d0'},
          ...(dark ? {responses: {
            success: {color: '#89dfbd', backgroundColor: '#20382f', tabTextColor: '#176645'},
            error: {color: '#ffadb3', backgroundColor: '#412d35', tabTextColor: '#922f3e'},
            redirect: {color: '#f6d48f', backgroundColor: '#3d3526', tabTextColor: '#795100'},
            info: {color: '#a8ccff', backgroundColor: '#26374c', tabTextColor: '#1f4d83'},
          }} : {}),
        },
        typography: {
          fontSize: '14px', lineHeight: '1.7em',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          headings: {fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif', fontWeight: '600', lineHeight: '1.4em'},
          code: {fontSize: '12px', fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', wrap: false},
        },
        sidebar: {
          width: '240px', backgroundColor: dark ? '#202930' : '#f7f9fa',
          textColor: dark ? '#c4ced5' : '#52616b', activeTextColor: dark ? '#5ed8b5' : '#247b55',
          groupItems: {textTransform: 'none'},
          level1Items: {textTransform: 'none'},
        },
        rightPanel: {width: '36%', backgroundColor: '#192832', textColor: '#e6edf2'},
        codeBlock: {backgroundColor: '#12212b'},
        ...(dark ? {schema: {nestedBackground: '#26323b', linesColor: '#44545e', typeNameColor: '#9bc8ff', typeTitleColor: '#dce5eb', requireLabelColor: '#ffadb3'}} : {}),
        extensionsHook: name => dark && name === 'UnderlinedHeader' ? 'color: #a9b5bf; border-bottom-color: #52606b;' : '',
      },
    };
  }, [colorMode, base]);
  return (
    <div className={styles.viewer}>
      {failed ? <div className={styles.error} role="alert">{t("接口参考暂时无法加载，请刷新重试，或", "The API reference could not load. Refresh or ")}<a href={specUrl}>{t("下载 YAML 文件", "download the YAML file")}</a>{t("查看。", " to inspect it.")}</div> : (
        <RedocStandalone key={colorMode} specUrl={specUrl} options={options} onLoaded={error => setFailed(Boolean(error))} />
      )}
    </div>
  );
}

export default function ApiReference() {
  const {t, base} = useSiteLanguage();
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.back} to={`${base}/docs/development/api`}>{t("← API 使用指南", "← API guide")}</Link>
        <div className={styles.titleRow}>
          <div><span className={styles.eyebrow}>BliKVM API</span><h1>{t("接口参考", "API reference")}</h1><p>{t("查阅接口、请求参数与响应示例。此页面仅供阅读，不会向设备发送控制请求。", "Browse endpoints, parameters and response examples. This read-only page sends no device control requests.")}</p></div>
          <a className="button button--secondary" href={specUrl} download="blikvm-openapi.yaml">{t("下载 OpenAPI YAML ↓", "Download OpenAPI YAML ↓")}</a>
        </div>
        <div className={styles.meta}><span>{metadata.source.kind === 'local-file' ? t("本地契约预览", "Local contract preview") : t("构建同步快照", "Build-time snapshot")}</span><span>{t("接口版本 ", "API version ")}<strong>{metadata.apiVersion}</strong></span><span>{t("同步于 ", "Synchronized ")}{metadata.syncedAt.replace('T', ' ').replace(/\.\d+Z$/, ' UTC')}</span></div>
      </header>
      <BrowserOnly fallback={<div className={styles.loading}>{t("正在加载接口参考…", "Loading API reference…")}</div>}>{() => <ContractViewer />}</BrowserOnly>
    </main>
  );
}

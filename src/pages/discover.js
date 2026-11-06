import React, {useEffect, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {deviceAddress, discoverDevices, localNetworkDenied} from '../components/DeviceDiscovery/discovery.mjs';
import styles from './discover.module.css';

const strings = {
  en: {
    title: 'My BliKVM devices',
    intro: 'Find and open BliKVM devices on your local network.',
    enable: 'Turn on Local Network Discovery (mDNS)',
    enableHelp: 'On each BliKVM, go to Settings → Network → General and turn on Local Network Discovery.',
    allow: 'Allow your browser to access the local network',
    allowHelp: 'Select Start discovery. If your browser asks for local network access, choose Allow.',
    start: 'Start discovery',
    refresh: 'Discover again',
    scanning: 'Looking for devices…',
    nearby: 'Nearby devices',
    count: n => `${n} ${n === 1 ? 'device' : 'devices'} found`,
    denied: 'Local network access is blocked. Allow it in your browser’s site settings and try again.',
    unavailable: 'Could not reach a discovery-enabled BliKVM. Check local network access, make sure your computer and devices are on the same network, or enter a device address below.',
    empty: 'No devices were found. Make sure Local Network Discovery is enabled on your BliKVM.',
    open: 'Open device',
    manual: 'Open a device by address',
    address: 'IP or .local address',
    openAddress: 'Open address',
    invalid: 'Enter a valid IP or .local address.',
    privacy: 'Device discovery and connections take place on your local network. This page does not upload your private data.',
  },
  'zh-CN': {
    title: '我的 BliKVM 设备',
    intro: '在同一个页面查找并访问局域网内的 BliKVM。',
    enable: '在设备上开启局域网发现（mDNS）',
    enableHelp: '在每台 BliKVM 的「设置 → 网络 → 常规」中开启「局域网发现」。',
    allow: '允许浏览器访问局域网',
    allowHelp: '点击「开始发现」后，如果浏览器弹出局域网访问提示，请选择「允许」。',
    start: '开始发现',
    refresh: '重新发现',
    scanning: '正在查找设备…',
    nearby: '附近设备',
    count: n => `已发现 ${n} 台设备`,
    denied: '浏览器阻止了局域网访问。请在浏览器的网站设置中允许访问，然后重试。',
    unavailable: '无法连接到已开启发现的 BliKVM。请检查浏览器权限和局域网连接，也可以在下方手动输入设备地址。',
    empty: '未发现设备。请确认 BliKVM 已开启局域网发现。',
    open: '打开设备',
    manual: '手动访问',
    address: 'IP 或 .local 地址',
    openAddress: '打开地址',
    invalid: '请输入有效的 IP 或 .local 地址。',
    privacy: '设备发现和连接均在本地完成。本页的所有操作都不会上传您的私有数据。',
  },
};

export default function DiscoveryPage() {
  const {i18n} = useDocusaurusContext();
  const copy = strings[i18n.currentLocale] ?? strings.en;
  const [status, setStatus] = useState('ready');
  const [devices, setDevices] = useState([]);
  const [invalidAddress, setInvalidAddress] = useState(false);
  const request = useRef(null);

  useEffect(() => () => {
    request.current?.abort();
    request.current = null;
  }, []);

  async function scan() {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    const timeout = setTimeout(() => controller.abort(), 30000);
    setStatus('scanning');
    setDevices([]);
    try {
      const found = await discoverDevices(controller.signal);
      if (request.current !== controller) return;
      setDevices(found);
      setStatus(found.length ? 'results' : 'empty');
    } catch {
      const denied = await localNetworkDenied();
      if (request.current === controller) setStatus(denied ? 'denied' : 'unavailable');
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) request.current = null;
    }
  }

  function openAddress(event) {
    event.preventDefault();
    const field = event.currentTarget.elements.address;
    const target = deviceAddress(field.value);
    setInvalidAddress(!target);
    if (target) window.location.assign(target);
    else field.focus();
  }

  return (
    <Layout title={copy.title} description={copy.intro}>
      <main className={styles.page}>
        <header className={styles.heading}>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </header>
        {status === 'ready' && (
          <ol className={styles.steps}>
            <li><strong>{copy.enable}</strong><p>{copy.enableHelp}</p></li>
            <li><strong>{copy.allow}</strong><p>{copy.allowHelp}</p></li>
          </ol>
        )}
        <button type="button" className="button button--primary" onClick={scan} disabled={status === 'scanning'}>
          {status === 'ready' ? copy.start : status === 'scanning' ? copy.scanning : copy.refresh}
        </button>
        {status !== 'ready' && (
          <section className={styles.results} aria-labelledby="discovery-results">
            <h2 id="discovery-results">{copy.nearby}</h2>
            <p className={styles.status} role="status">{status === 'results' ? copy.count(devices.length) : copy[status]}</p>
            {devices.length > 0 && (
              <ul className={styles.devices}>
                {devices.map(device => (
                  <li key={device.id}>
                    <div><strong>{device.name}</strong><span>{device.model}</span></div>
                    <div><code>{device.hostname}</code><span>{device.ip}</span></div>
                    <a className="button button--secondary" href={`https://${device.hostname}`}
                       target="_blank" rel="noopener noreferrer" aria-label={`${copy.open} ${device.name} (${device.hostname})`}>
                      {copy.open} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
        <p className={styles.privacy}>{copy.privacy}</p>
        <form className={styles.manual} noValidate onSubmit={openAddress}>
          <label htmlFor="discovery-address">{copy.manual}</label>
          <div>
            <input id="discovery-address" name="address" type="text" placeholder={copy.address} autoComplete="off"
                   autoCapitalize="none" spellCheck={false} required aria-invalid={invalidAddress}
                   aria-describedby={invalidAddress ? 'discovery-address-error' : undefined}
                   onChange={() => setInvalidAddress(false)} />
            <button type="submit" className="button button--secondary">{copy.openAddress}</button>
          </div>
          {invalidAddress && <p id="discovery-address-error" role="alert">{copy.invalid}</p>}
        </form>
      </main>
    </Layout>
  );
}

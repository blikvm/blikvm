import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export function validateNotes(body, release) {
  const errors = [];
  if (/\{\{|\}\}|<!--/.test(body)) errors.push('Remove template placeholders and comments.');
  if (/^# /m.test(body)) errors.push('Use the GitHub release title, not a duplicate H1.');
  const sections = ['## Downloads / 下载', '## English', '### What changed', '### Upgrade instructions', '### Known issues and validation scope', '<summary>Technical validation and build records</summary>', '## 简体中文', '### 主要变化', '### 升级说明', '### 已知问题与验证范围', '<summary>技术验证与构建记录</summary>'];
  let previous = -1;
  for (const heading of sections) {
    const at = body.indexOf(heading);
    if (at <= previous) errors.push(`Missing or out-of-order section: ${heading}`);
    previous = Math.max(previous, at);
  }
  if (!/^\*\*(?:Pre-release \/ 预发布|Stable \/ 正式版)\*\* · System \*\*[^*]+\*\* · App \*\*[^*]+\*\*/.test(body)) errors.push('Missing bilingual status and separate System/App versions.');
  const label = release.prerelease ? 'Pre-release / 预发布' : 'Stable / 正式版';
  if (!body.startsWith(`**${label}**`)) errors.push('Status differs from GitHub prerelease flag.');
  const assets = new Set(release.assets.map(a => a.browser_download_url));
  const links = [...body.matchAll(/\]\((https:\/\/github\.com\/[^\s)]+\/releases\/download\/[^\s)]+)\)/g)].map(m => m[1]);
  for (const url of links) if (!assets.has(url)) errors.push(`Download URL is not an asset of this release: ${url}`);
  for (const asset of release.assets) {
    if (/\.(?:img\.(?:xz|gz)|raucb|tar\.gz)$/.test(asset.name) || asset.name === 'SHA256SUMS' || asset.name === 'BUILD-INFO.json') {
      if (!links.includes(asset.browser_download_url)) errors.push(`Missing download: ${asset.name}`);
    }
  }
  const table = body.slice(body.indexOf('## Downloads / 下载'), body.indexOf('## English'));
  if (!/\| Hardware \/ 硬件 \| Flash image \/ 烧录镜像 \| A\/B system \/ 系统升级 \| App \/ 应用升级 \|/.test(table)) errors.push('Missing standard download table.');
  if ((body.match(/<details>/g) || []).length !== 2 || (body.match(/<\/details>/g) || []).length !== 2) errors.push('Provide two folded technical sections.');
  return errors;
}

async function main() {
  const [mode, tag] = process.argv.slice(2);
  if (!['check', 'audit', 'apply'].includes(mode) || !/^v\d+\.\d+\.\d+(?:[-.][A-Za-z0-9.-]+)?$/.test(tag || '')) throw new Error('Usage: node scripts/release-notes.mjs <check|audit|apply> <vX.Y.Z>');
  const repo = process.env.GITHUB_REPOSITORY || 'blikvm/blikvm';
  const headers = {'Accept':'application/vnd.github+json', 'User-Agent':'BliKVM-release-notes', 'X-GitHub-Api-Version':'2022-11-28'};
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  async function request(endpoint, options = {}) {
    const response = await fetch(`https://api.github.com/repos/${repo}/${endpoint}`, {...options, headers: {...headers, ...(options.headers || {})}, signal: AbortSignal.timeout(30000)});
    if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}.`);
    return response.json();
  }
  const release = await request(`releases/tags/${encodeURIComponent(tag)}`);
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const body = mode === 'audit' ? release.body || '' : await fs.readFile(path.join(root, 'releases', `${tag}.md`), 'utf8');
  const errors = validateNotes(body, release);
  if (errors.length) throw new Error(errors.join('\n'));
  if (mode === 'apply') {
    // Recheck before writing; changing attachments or release state requires fresh review.
    const latest = await request(`releases/${release.id}`);
    if (JSON.stringify(latest.assets) !== JSON.stringify(release.assets) || latest.body !== release.body || latest.tag_name !== release.tag_name || latest.prerelease !== release.prerelease || latest.draft !== release.draft) throw new Error('Release changed during validation. Review and rerun.');
    const result = await request(`releases/${release.id}`, {method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({body})});
    if (result.body !== body || result.tag_name !== release.tag_name || result.draft !== release.draft || result.prerelease !== release.prerelease) throw new Error('Release read-back mismatch.');
  }
  console.log(`${mode}: ${tag} passed; ${release.assets.length} assets checked. Only apply updates the body; no mode publishes drafts or changes tags/assets.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => {console.error(error.message);process.exitCode=1;});

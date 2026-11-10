#!/usr/bin/env node
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPOSITORY = 'blikvm/blikvm';
const TARGETS = ['bcm2711', 'sun50i', 'rv1126b', 'rv1126b-tc358743', 'rv1126b-lt6911uxe', 'rv1126b-lt7911uxc'];
const rules = [
  [/^blikvm-v1-v2-v3-app-(.+)\.tar\.gz$/, 'bcm2711', 'app'],
  [/^blikvm-v1-v2-v3-system-(.+)\.raucb$/, 'bcm2711', 'system'],
  [/^blikvm-v4-app-(.+)\.tar\.gz$/, 'sun50i', 'app'],
  [/^blikvm-v4-system-(.+)\.raucb$/, 'sun50i', 'system'],
  [/^blikvm-rv1126b-app-(.+)\.tar\.gz$/, 'rv1126b', 'app'],
  [/^blikvm-rv1126b-lt6911uxe-system-(.+)\.raucb$/, 'rv1126b-lt6911uxe', 'system'],
  [/^blikvm-rv1126b-lt7911uxc-system-(.+)\.raucb$/, 'rv1126b-lt7911uxc', 'system'],
  [/^blikvm-rv1126b-tc358743-system-(.+)\.raucb$/, 'rv1126b-tc358743', 'system'],
];
export function parseVersion(value) {
  const m = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(value);
  if (!m) throw new Error(`Invalid SemVer: ${value}`);
  const pre = m[4] ? m[4].split('.') : [];
  if (pre.some(x => /^\d+$/.test(x) && x.length > 1 && x[0] === '0')) throw new Error(`Invalid prerelease: ${value}`);
  return { core: m.slice(1, 4).map(BigInt), pre };
}
export function compareVersions(a, b) {
  const x = parseVersion(a), y = parseVersion(b);
  for (let i = 0; i < 3; i++) if (x.core[i] !== y.core[i]) return x.core[i] > y.core[i] ? 1 : -1;
  if (!x.pre.length || !y.pre.length) return x.pre.length === y.pre.length ? 0 : x.pre.length ? -1 : 1;
  for (let i = 0; i < Math.max(x.pre.length, y.pre.length); i++) {
    const l = x.pre[i], r = y.pre[i];
    if (l === undefined || r === undefined) return l === r ? 0 : l === undefined ? -1 : 1;
    if (l === r) continue;
    const ln = /^\d+$/.test(l), rn = /^\d+$/.test(r);
    if (ln && rn) return BigInt(l) > BigInt(r) ? 1 : -1;
    if (ln !== rn) return ln ? -1 : 1;
    return l > r ? 1 : -1;
  }
  return 0;
}
export function buildIndex(releases, generatedAt = new Date().toISOString()) {
  if (!Array.isArray(releases)) throw new Error('Release response must be an array');
  const targets = Object.fromEntries(TARGETS.map(t => [t, { stable: { app: null, system: null }, preview: { app: null, system: null } }]));
  const chosen = new Map();
  for (const release of releases) {
    if (release.draft || !release.published_at) continue;
    if (!Array.isArray(release.assets)) throw new Error('Published release has no asset list');
    const url = new URL(release.html_url);
    if (url.origin !== 'https://github.com' || !url.pathname.startsWith('/blikvm/blikvm/releases/tag/') || url.search || url.hash) throw new Error('Unexpected release URL');
    for (const asset of release.assets) {
      if (asset.state !== 'uploaded' || !Number.isSafeInteger(asset.size) || asset.size <= 0) continue;
      for (const [pattern, target, track] of rules) {
        const match = pattern.exec(asset.name);
        if (!match) continue;
        const version = match[1], parsed = parseVersion(version);
        const channel = release.prerelease || parsed.pre.length ? 'preview' : 'stable';
        const key = `${target}/${channel}/${track}`;
        const old = chosen.get(key);
        const cmp = old ? compareVersions(version, old.version) : 1;
        // Equal-version republishing chooses the most recently published release deterministically.
        const rank = `${release.published_at}/${String(release.id).padStart(20, '0')}`;
        if (cmp > 0 || (cmp === 0 && rank > old.rank)) {
          chosen.set(key, { version, rank });
          const candidate = { version, releaseUrl: release.html_url };
          const sha256 = assetSHA(asset);
          if (sha256) candidate.artifact = { name: asset.name, size: asset.size, sha256 };
          targets[target][channel][track] = candidate;
        }
      }
    }
  }
  return { schemaVersion: 1, generatedAt, targets };
}
function assetSHA(asset) {
  return /^sha256:[0-9a-f]{64}$/.test(asset?.digest || '') ? asset.digest.slice(7) : '';
}

function sameAsset(source, mirror) {
  return source && mirror && assetSHA(source) && source.digest === mirror.digest && source.size === mirror.size;
}

async function jsonIfAvailable(url, fetchImpl, headers) {
  try {
    const response = await fetchImpl(url, { headers, signal: AbortSignal.timeout(10000) });
    return response.ok ? response : null;
  } catch { return null; }
}

// Downloads are optional additions to schema 1. Older devices keep using
// releaseUrl, and an unavailable mirror never prevents a GitHub update.
export async function enrichIndex(index, releases, fetchImpl = fetch, token = process.env.GITHUB_TOKEN) {
  const candidates = new Map();
  for (const family of Object.values(index.targets)) {
    for (const channel of Object.values(family)) {
      for (const [track, candidate] of Object.entries(channel)) {
        if (!candidate?.artifact) continue;
        if (!candidates.has(candidate.releaseUrl)) candidates.set(candidate.releaseUrl, []);
        candidates.get(candidate.releaseUrl).push([track, candidate]);
      }
    }
  }
  const byURL = new Map(releases.map(release => [release.html_url, release]));
  await Promise.all([...candidates].map(async ([url, entries]) => {
    const release = byURL.get(url);
    const tag = url.split('/').at(-1);
    if (!release || !/^[A-Za-z0-9][A-Za-z0-9._+-]{0,160}$/.test(tag)) return;
    const upstream = new Map(release.assets.map(asset => [asset.name, asset]));
    const manifest = upstream.get('SHA256SUMS');
    const infoAsset = upstream.get('BUILD-INFO.json');
    const [mirrorResponse, infoResponse] = await Promise.all([
      jsonIfAvailable(`https://api.atomgit.com/api/v5/repos/weixin_43053387/blikvm-firmware-mirror/releases/tags/${encodeURIComponent(tag)}`, fetchImpl),
      infoAsset?.size > 0 && infoAsset.size <= 1024 * 1024 && assetSHA(infoAsset) && Number.isSafeInteger(infoAsset.id)
        ? jsonIfAvailable(`https://api.github.com/repos/${REPOSITORY}/releases/assets/${infoAsset.id}`, fetchImpl, {
            Accept: 'application/octet-stream', ...(token ? { Authorization: `Bearer ${token}` } : {}),
          })
        : null,
    ]);
    const mirror = await mirrorResponse?.json().catch(() => null);
    const mirrored = new Map((mirror?.tag_name === tag && Array.isArray(mirror.assets) ? mirror.assets : [])
      .filter(asset => asset?.type === 'attach').map(asset => [asset.name, asset]));
    let platforms = [];
    if (infoResponse) {
      try {
        const bytes = Buffer.from(await infoResponse.arrayBuffer());
        if (bytes.length === infoAsset.size && createHash('sha256').update(bytes).digest('hex') === assetSHA(infoAsset)) {
          const info = JSON.parse(bytes);
          if (Array.isArray(info.platforms)) platforms = info.platforms;
        }
      } catch { /* The signed package will enforce compatibility at installation. */ }
    }
    for (const [track, candidate] of entries) {
      const artifact = candidate.artifact;
      if (sameAsset(manifest, mirrored.get('SHA256SUMS')) &&
          sameAsset(upstream.get(artifact.name), mirrored.get(artifact.name))) {
        artifact.atomgit = true;
      }
      const platform = platforms.find(p => p?.files?.[artifact.name]?.sha256 === artifact.sha256 &&
        p.files[artifact.name].size === artifact.size);
      if (!platform) continue;
      if (track === 'app' && platform.minimumOS) {
        try { parseVersion(platform.minimumOS); artifact.minOSVersion = platform.minimumOS; }
        catch { /* Ignore malformed optional metadata. */ }
      }
      if (track === 'system' && platform.integratedAppMatchesStandalone === true && platform.appVersion) {
        try { parseVersion(platform.appVersion); artifact.bundledAppVersion = platform.appVersion; }
        catch { /* Ignore malformed optional metadata. */ }
      }
    }
  }));
  return index;
}

export async function fetchReleases(fetchImpl = fetch, token = process.env.GITHUB_TOKEN) {
  const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'BliKVM-update-index' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const releases = [];
  for (let page = 1; page <= 50; page++) {
    const response = await fetchImpl(`https://api.github.com/repos/${REPOSITORY}/releases?per_page=100&page=${page}`, { headers, signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`GitHub Release request failed (${response.status}); existing index is unchanged`);
    const items = await response.json();
    if (!Array.isArray(items)) throw new Error('Invalid GitHub release response');
    releases.push(...items);
    if (items.length < 100) return releases;
  }
  throw new Error('Release pagination limit exceeded; refusing a partial index');
}
async function main() {
  const args = process.argv.slice(2);
  const option = name => { const i = args.indexOf(name); if (i < 0) return null; if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Missing value for ${name}`); return args[i + 1]; };
  for (let i = 0; i < args.length; i += 2) if (!['--input', '--output'].includes(args[i])) throw new Error('Usage: node scripts/sync-update-index.mjs [--input releases.json] [--output static/updates/index.json]');
  const input = option('--input');
  const releases = input ? JSON.parse(await fs.readFile(input, 'utf8')) : await fetchReleases();
  const result = buildIndex(releases);
  if (!input) await enrichIndex(result, releases);
  const output = option('--output') || 'static/updates/index.json';
  try {
    const previous = JSON.parse(await fs.readFile(output, 'utf8'));
    if (previous.schemaVersion === result.schemaVersion && JSON.stringify(previous.targets) === JSON.stringify(result.targets)) {
      console.log('Update index unchanged'); return;
    }
  } catch (e) { if (e.code !== 'ENOENT') throw e; }
  await fs.mkdir(path.dirname(output), { recursive: true });
  const temp = `${output}.${process.pid}.tmp`;
  try { await fs.writeFile(temp, JSON.stringify(result, null, 2) + '\n'); await fs.rename(temp, output); }
  finally { await fs.rm(temp, { force: true }); }
  console.log(`Wrote ${output}: ${Buffer.byteLength(JSON.stringify(result))} compact bytes`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(e => { console.error(e.message); process.exitCode = 1; });

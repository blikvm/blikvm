#!/usr/bin/env node
import fs from 'node:fs/promises';
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
          targets[target][channel][track] = { version, releaseUrl: release.html_url };
        }
      }
    }
  }
  return { schemaVersion: 1, generatedAt, targets };
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

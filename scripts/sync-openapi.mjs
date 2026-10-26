import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import yaml from 'js-yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'static/api/current');
const localConfigPath = path.join(root, '.openapi-source.local.json');
let local = {};
try {
  // CI must use its declared remote source, never a developer's local checkout.
  if (!process.env.CI) local = JSON.parse(await fs.readFile(localConfigPath, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const sourceFile = process.env.OPENAPI_SOURCE_FILE || local.file;
const repository = process.env.OPENAPI_SOURCE_REPOSITORY || 'blikvm/web_server_go';
const ref = process.env.OPENAPI_SOURCE_REF || 'main';
const sourcePath = process.env.OPENAPI_SOURCE_PATH || 'openapi/openapi.yaml';
const sourceUrl = process.env.OPENAPI_SOURCE_URL ||
  `https://api.github.com/repos/${repository}/contents/${sourcePath}?ref=${encodeURIComponent(ref)}`;
const token = process.env.OPENAPI_SOURCE_TOKEN;

async function loadSource() {
  if (sourceFile) {
    let commit = !process.env.OPENAPI_SOURCE_FILE && /^[a-f0-9]{40}$/.test(local.commit || '') ? local.commit : null;
    try {
      if (!commit) commit = execFileSync('git', ['-C', path.dirname(path.resolve(sourceFile)), 'rev-parse', 'HEAD'], {encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']}).trim();
    } catch { /* A published contract file need not be in a checkout. */ }
    return {text: await fs.readFile(sourceFile, 'utf8'), source: {kind: 'local-file', commit}};
  }
  const url = new URL(sourceUrl);
  if (url.protocol !== 'https:') throw new Error('The remote OpenAPI source must use HTTPS.');
  const headers = {'User-Agent': 'BliKVM-Website-OpenAPI-Sync'};
  if (url.hostname === 'api.github.com') headers.Accept = 'application/vnd.github.raw+json';
  // A GitHub token must never be sent to an arbitrary configured host.
  if (token && ['api.github.com', 'raw.githubusercontent.com'].includes(url.hostname)) headers.Authorization = `Bearer ${token}`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, {headers, redirect: 'error', signal: AbortSignal.timeout(15000)});
      if (!response.ok) throw new Error(`OpenAPI source returned HTTP ${response.status}. Check source access and OPENAPI_SOURCE_TOKEN for a private repository.`);
      const text = await response.text();
      return {text, source: {kind: 'remote', repository, ref, path: sourcePath}};
    } catch (error) {
      if (attempt === 1) throw error;
    }
  }
}

try {
  const {text, source} = await loadSource();
  const document = yaml.load(text);
  if (!document || !/^3\./.test(String(document.openapi)) || !document.info?.title || !document.info?.version ||
      !document.paths || typeof document.paths !== 'object' || !Object.keys(document.paths).length) {
    throw new Error('Source is not a valid OpenAPI 3 contract with info and paths. The existing snapshot was not replaced.');
  }
  const metadata = {
    syncedAt: new Date().toISOString(),
    sha256: createHash('sha256').update(text).digest('hex'),
    apiVersion: String(document.info.version),
    openapiVersion: String(document.openapi),
    source,
  };
  await fs.mkdir(output, {recursive: true});
  // Validate completely before replacing the published files. Temp files are not served.
  const temporary = path.join(root, '.openapi-sync.tmp');
  try {
    await fs.writeFile(temporary, text);
    await fs.rename(temporary, path.join(output, 'openapi.yaml'));
    // Retain the existing /openapi.yaml URL for older API pages and bookmarks.
    await fs.copyFile(path.join(output, 'openapi.yaml'), path.join(root, 'static/openapi.yaml'));
    await fs.writeFile(path.join(output, 'metadata.json'), JSON.stringify(metadata, null, 2) + '\n');
  } finally {
    await fs.rm(temporary, {force: true});
  }
  console.log(`[openapi] Synced ${Object.keys(document.paths).length} paths (${source.kind}), SHA256 ${metadata.sha256.slice(0, 12)}.`);
} catch (error) {
  console.error(`[openapi] Sync failed: ${error.message}`);
  console.error('[openapi] Build stopped. Provide a readable backend contract via OPENAPI_SOURCE_FILE or configure remote access; the cached contract was not silently substituted.');
  process.exitCode = 1;
}

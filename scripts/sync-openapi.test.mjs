import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const valid = 'openapi: 3.0.3\ninfo:\n  title: Test contract\n  version: 2.0.0\npaths:\n  /health:\n    get:\n      responses:\n        "200":\n          description: OK\n';
async function fixture(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'blikvm-openapi-test-'));
  t.after(() => fs.rm(dir, {recursive: true, force: true}));
  await fs.mkdir(path.join(dir, 'scripts'));
  await fs.mkdir(path.join(dir, 'static/api/current'), {recursive: true});
  await fs.copyFile(path.join(root, 'scripts/sync-openapi.mjs'), path.join(dir, 'scripts/sync-openapi.mjs'));
  await fs.symlink(path.join(root, 'node_modules'), path.join(dir, 'node_modules'));
  await fs.writeFile(path.join(dir, 'contract.yaml'), valid);
  return dir;
}
function run(dir, overrides = {}, preload = null) {
  const env = {...process.env};
  for (const key of Object.keys(env)) if (key.startsWith('OPENAPI_') || key === 'CI') delete env[key];
  const args = [...(preload ? ['--import', preload] : []), 'scripts/sync-openapi.mjs'];
  return spawnSync(process.execPath, args, {cwd: dir, env: {...env, ...overrides}, encoding: 'utf8'});
}

test('local sync writes the exact contract, checksum and no local source path', async t => {
  const dir = await fixture(t);
  const result = run(dir, {OPENAPI_SOURCE_FILE: path.join(dir, 'contract.yaml')});
  assert.equal(result.status, 0, result.stderr);
  assert.equal(await fs.readFile(path.join(dir, 'static/api/current/openapi.yaml'), 'utf8'), valid);
  assert.equal(await fs.readFile(path.join(dir, 'static/openapi.yaml'), 'utf8'), valid);
  const raw = await fs.readFile(path.join(dir, 'static/api/current/metadata.json'), 'utf8');
  const metadata = JSON.parse(raw);
  assert.equal(metadata.sha256, createHash('sha256').update(valid).digest('hex'));
  assert.equal(metadata.source.kind, 'local-file');
  assert.ok(!raw.includes(dir));
});

test('a downloaded local snapshot retains its pinned backend commit', async t => {
  const dir = await fixture(t);
  const commit = 'f601a851ddcc9f05160ac37e6daad2d858465b36';
  await fs.writeFile(path.join(dir, '.openapi-source.local.json'), JSON.stringify({file: path.join(dir, 'contract.yaml'), commit}));
  const result = run(dir);
  assert.equal(result.status, 0, result.stderr);
  const metadata = JSON.parse(await fs.readFile(path.join(dir, 'static/api/current/metadata.json'), 'utf8'));
  assert.equal(metadata.source.commit, commit);
});

test('invalid/missing input fails and preserves the previously published contract', async t => {
  const dir = await fixture(t);
  const target = path.join(dir, 'static/api/current/openapi.yaml');
  await fs.writeFile(target, 'previous validated contract');
  for (const text of ['<html>login required</html>', 'openapi: [broken', 'openapi: 3.0.3\ninfo: {title: Empty, version: 1}\npaths: {}']) {
    await fs.writeFile(path.join(dir, 'contract.yaml'), text);
    const result = run(dir, {OPENAPI_SOURCE_FILE: path.join(dir, 'contract.yaml')});
    assert.notEqual(result.status, 0);
    assert.equal(await fs.readFile(target, 'utf8'), 'previous validated contract');
  }
  assert.notEqual(run(dir, {OPENAPI_SOURCE_FILE: path.join(dir, 'missing.yaml')}).status, 0);
});

test('CI ignores machine-local config and uses authenticated GitHub remote without publishing token', async t => {
  const dir = await fixture(t);
  await fs.writeFile(path.join(dir, '.openapi-source.local.json'), JSON.stringify({file: '/must-not-read.yaml'}));
  const mock = path.join(dir, 'mock.mjs');
  await fs.writeFile(mock, `globalThis.fetch = async (url, options) => {
    if (url.hostname !== 'api.github.com' || url.searchParams.get('ref') !== 'main' || options.headers.Authorization !== 'Bearer test-secret') throw Error('unexpected request');
    return {ok:true,text:async()=>${JSON.stringify(valid)}};
  };`);
  const result = run(dir, {CI: 'true', OPENAPI_SOURCE_TOKEN: 'test-secret'}, mock);
  assert.equal(result.status, 0, result.stderr);
  const metadata = await fs.readFile(path.join(dir, 'static/api/current/metadata.json'), 'utf8');
  assert.equal(JSON.parse(metadata).source.kind, 'remote');
  assert.ok(!metadata.includes('test-secret'));
  assert.ok(!result.stdout.includes('test-secret'));
});

test('custom HTTPS sources do not receive the GitHub token; HTTP is rejected', async t => {
  const dir = await fixture(t);
  const mock = path.join(dir, 'mock.mjs');
  await fs.writeFile(mock, `globalThis.fetch = async (url, options) => {
    if (options.headers.Authorization) throw Error('token leaked');
    return {ok:true,text:async()=>${JSON.stringify(valid)}};
  };`);
  assert.equal(run(dir, {OPENAPI_SOURCE_URL: 'https://contract.example/openapi.yaml', OPENAPI_SOURCE_TOKEN: 'test-secret'}, mock).status, 0);
  assert.notEqual(run(dir, {OPENAPI_SOURCE_URL: 'http://contract.example/openapi.yaml'}, mock).status, 0);
});

test('remote failure blocks the build and keeps the old contract', async t => {
  const dir = await fixture(t);
  const target = path.join(dir, 'static/api/current/openapi.yaml');
  await fs.writeFile(target, 'previous validated contract');
  const mock = path.join(dir, 'mock.mjs');
  await fs.writeFile(mock, 'globalThis.fetch = async () => ({ok:false,status:403});');
  const result = run(dir, {CI: 'true'}, mock);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /HTTP 403/);
  assert.equal(await fs.readFile(target, 'utf8'), 'previous validated contract');
});

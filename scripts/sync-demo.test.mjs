import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {syncDemo} from './sync-demo.mjs';

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'blikvm-demo-'));
  t.after(()=>fs.rm(root, {recursive:true, force:true}));
  const sourceDir=path.join(root,'source'), targetDir=path.join(root,'static/demo'), dist=path.join(sourceDir,'dist-demo');
  await fs.mkdir(path.join(dist,'assets'), {recursive:true});
  await fs.mkdir(path.join(dist,'data'), {recursive:true});
  await fs.mkdir(targetDir, {recursive:true});
  await fs.writeFile(path.join(dist,'index.html'), '<link href="assets/style.css" rel="stylesheet"><script type="module" src="/demo/assets/main.js"></script>');
  await fs.writeFile(path.join(dist,'assets/main.js'), 'console.log("latest demo")');
  await fs.writeFile(path.join(dist,'assets/style.css'), 'body{}');
  await fs.writeFile(path.join(dist,'data/private.json'), '{"private":true}');
  await fs.writeFile(path.join(targetDir,'old.js'), 'previous demo');
  return {sourceDir,targetDir,dist,sourceCommit:'a'.repeat(40),builtAt:'2026-10-30T00:00:00Z'};
}
test('replace stale bundles, preserve source provenance and exclude runtime data', async t=>{
  const f=await fixture(t);const version=await syncDemo(f);
  assert.equal(await fs.readFile(path.join(f.targetDir,'assets/main.js'),'utf8'),'console.log("latest demo")');
  await assert.rejects(fs.stat(path.join(f.targetDir,'old.js')), {code:'ENOENT'});
  await assert.rejects(fs.stat(path.join(f.targetDir,'data')), {code:'ENOENT'});
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(f.targetDir,'version.json'),'utf8')),version);
  assert.equal(version.sourceCommit,f.sourceCommit);assert.equal(version.basePath,'/demo/');
});
test('missing entry assets leave the previous demo intact', async t=>{
  const f=await fixture(t);await fs.rm(path.join(f.dist,'assets/main.js'));
  await assert.rejects(syncDemo(f));assert.equal(await fs.readFile(path.join(f.targetDir,'old.js'),'utf8'),'previous demo');
});
test('wrong build base is rejected before replacing existing output', async t=>{
  const f=await fixture(t);await fs.writeFile(path.join(f.dist,'index.html'),'<script src="/assets/main.js"></script>');
  await assert.rejects(syncDemo(f),/built for \/demo\//);assert.equal(await fs.readFile(path.join(f.targetDir,'old.js'),'utf8'),'previous demo');
});
test('excluded data and path traversal cannot become published entry assets', async t=>{
  const f=await fixture(t);
  for(const ref of ['/demo/data/private.json','/demo/%2e%2e/outside.css']){
    await fs.writeFile(path.join(f.dist,'index.html'),`<script src="/demo/assets/main.js"></script><link href="${ref}">`);
    await assert.rejects(syncDemo(f),/excluded or escaping/);assert.equal(await fs.readFile(path.join(f.targetDir,'old.js'),'utf8'),'previous demo');
  }
});
test('symbolic links cannot introduce files outside the frontend output', async t=>{
  const f=await fixture(t);await fs.symlink(path.join(f.targetDir,'old.js'),path.join(f.dist,'assets/linked.js'));
  await assert.rejects(syncDemo(f),/symbolic links/);assert.equal(await fs.readFile(path.join(f.targetDir,'old.js'),'utf8'),'previous demo');
});
test('invalid provenance cannot replace an existing demo', async t=>{
  const f=await fixture(t);await assert.rejects(syncDemo({...f,sourceCommit:'main'}),/source commit/);
  await assert.rejects(syncDemo({...f,builtAt:'not-a-date'}),/timestamp/);assert.equal(await fs.readFile(path.join(f.targetDir,'old.js'),'utf8'),'previous demo');
});
test('overlapping source and destination cannot remove the source tree', async t=>{
  const f=await fixture(t);await assert.rejects(syncDemo({...f,targetDir:f.sourceDir}),/overlap/);assert.equal(await fs.readFile(path.join(f.dist,'assets/main.js'),'utf8'),'console.log("latest demo")');
});

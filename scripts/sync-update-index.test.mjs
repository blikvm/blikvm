import test from 'node:test';
import assert from 'node:assert/strict';
import { buildIndex, compareVersions, parseVersion, fetchReleases } from './sync-update-index.mjs';
const asset = name => ({ name, size: 100, state: 'uploaded' });
const release = (id, assets, extra = {}) => ({ id, html_url: `https://github.com/blikvm/blikvm/releases/tag/untagged-${id}`, published_at: '2026-10-23T00:00:00Z', draft: false, prerelease: false, assets: assets.map(asset), ...extra });
test('real packaging names separate tracks and platforms; images and legacy packages are ignored', () => {
 const files=['blikvm-v1-v2-v3-app-3.0.0.tar.gz','blikvm-v1-v2-v3-system-3.0.0.raucb','blikvm-v4-app-3.0.0.tar.gz','blikvm-v4-system-3.0.0.raucb','blikvm-rv1126b-app-3.0.0.tar.gz','blikvm-rv1126b-tc358743-system-3.0.0.raucb','blikvm-v4-3.0.0.img.xz','blikvm-v4.deb'];
 const index=buildIndex([release(1,files,{prerelease:true})]);
 for(const t of Object.values(index.targets)) { assert.equal(t.stable.app,null);assert.equal(t.stable.system,null); }
 for(const target of ['bcm2711','sun50i']) for(const track of ['app','system']) assert.equal(index.targets[target].preview[track].version,'3.0.0');
 assert.equal(index.targets.rv1126b.preview.app.version,'3.0.0');
 assert.equal(index.targets['rv1126b-tc358743'].preview.system.version,'3.0.0');
 assert.equal(index.targets['rv1126b-lt6911uxe'].preview.system,null);
});
test('highest semantic version wins regardless of release order; independent track history',()=>{
 const x=buildIndex([release(1,['blikvm-v4-app-3.9.0.tar.gz']),release(2,['blikvm-v4-app-3.10.0.tar.gz']),release(3,['blikvm-v4-system-3.8.0.raucb'])]);
 assert.equal(x.targets.sun50i.stable.app.version,'3.10.0'); assert.equal(x.targets.sun50i.stable.system.version,'3.8.0');
});
test('drafts never enter index; prerelease asset suffix cannot enter stable',()=>{
 const x=buildIndex([release(1,['blikvm-v4-app-99.0.0.tar.gz'],{draft:true}),release(2,['blikvm-v4-app-3.0.1-rc.2.tar.gz'])]);
 assert.equal(x.targets.sun50i.stable.app,null);assert.equal(x.targets.sun50i.preview.app.version,'3.0.1-rc.2');
});
test('SemVer precedence and validation',()=>{
 assert.equal(compareVersions('3.0.0','3.0.0-rc.10'),1);assert.equal(compareVersions('3.0.0-rc.10','3.0.0-rc.2'),1);assert.equal(compareVersions('3.0.0+one','3.0.0+two'),0);
 for(const v of ['03.0.0','3.0','3.0.0-01'])assert.throws(()=>parseVersion(v));
});
test('reject external links, malformed release data and invalid versions',()=>{
 assert.throws(()=>buildIndex([release(1,[],{html_url:'https://other.example/releases/tag/x'})]));
 assert.throws(()=>buildIndex({}));assert.throws(()=>buildIndex([release(1,['blikvm-v4-app-not-a-version.tar.gz'])]));
});
test('GitHub API failure cannot become an empty or latest index',async()=>{
 await assert.rejects(fetchReleases(async()=>({ok:false,status:403}),'test-token'),/403/);
});
test('fetch every page rather than publish an incomplete index',async()=>{
 const calls=[];const releases=await fetchReleases(async url=>{calls.push(url);return {ok:true,json:async()=>calls.length===1?Array.from({length:100},(_,i)=>({id:i})):[{id:100}]};},'');
 assert.equal(releases.length,101);assert.equal(calls.length,2);
});

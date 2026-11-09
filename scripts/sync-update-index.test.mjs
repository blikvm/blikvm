import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildIndex, compareVersions, parseVersion, fetchReleases, enrichIndex } from './sync-update-index.mjs';
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

test('adds only matching AtomGit assets and build metadata without changing schema 1', async () => {
 const name='blikvm-v1-v2-v3-app-3.0.4.tar.gz', sys='blikvm-v1-v2-v3-system-3.0.4.raucb';
 const files={ [name]:{size:100,sha256:'a'.repeat(64)}, [sys]:{size:100,sha256:'b'.repeat(64)} };
 const info=Buffer.from(JSON.stringify({platforms:[{files,minimumOS:'3.0.4',appVersion:'3.0.4',integratedAppMatchesStandalone:true}]}));
 const entries=[{...asset(name),digest:'sha256:'+files[name].sha256},{...asset(sys),digest:'sha256:'+files[sys].sha256},
   {...asset('SHA256SUMS'),digest:'sha256:'+'c'.repeat(64)},
   {...asset('BUILD-INFO.json'),id:77,size:info.length,digest:'sha256:'+createHash('sha256').update(info).digest('hex')}];
 const releases=[release(1,[],{html_url:'https://github.com/blikvm/blikvm/releases/tag/v3.0.4',assets:entries})];
 const fetchImpl=async url => url.startsWith('https://api.github.com') ? new Response(info) : Response.json({
   tag_name:'v3.0.4',assets:[{...entries[0],type:'attach'},{...entries[1],type:'attach',size:99},{...entries[2],type:'attach'}],
 });
 const index=await enrichIndex(buildIndex(releases),releases,fetchImpl,'');
 assert.equal(index.schemaVersion,1);
 assert.deepEqual(index.targets.bcm2711.stable.app.artifact,{name,size:100,sha256:files[name].sha256,atomgit:true,minOSVersion:'3.0.4'});
 assert.deepEqual(index.targets.bcm2711.stable.system.artifact,{name:sys,size:100,sha256:files[sys].sha256,bundledAppVersion:'3.0.4'});
 const noMirror=await enrichIndex(buildIndex(releases),releases,async()=>new Response(null,{status:503}),'');
 assert.equal(noMirror.targets.bcm2711.stable.app.artifact.atomgit,undefined);
 assert.equal(noMirror.targets.bcm2711.stable.app.releaseUrl,releases[0].html_url);
});

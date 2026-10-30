import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export async function syncDemo({sourceDir, targetDir, sourceCommit, builtAt}) {
  if (!/^[a-f0-9]{40}$/.test(sourceCommit || '')) throw new Error('A full frontend source commit is required.');
  if (typeof builtAt !== 'string' || !builtAt.endsWith('Z') || !Number.isFinite(Date.parse(builtAt))) throw new Error('A UTC build timestamp is required.');
  const dist = path.resolve(sourceDir, 'dist-demo');
  const target = path.resolve(targetDir);
  if (target === dist || target.startsWith(dist + path.sep) || dist.startsWith(target + path.sep)) throw new Error('Demo source and destination overlap.');
  async function checkTree(dir) {
    for (const entry of await fs.readdir(dir, {withFileTypes:true})) {
      if (dir === dist && entry.name === 'data') continue;
      if (entry.isSymbolicLink()) throw new Error('Demo output must not contain symbolic links.');
      if (entry.isDirectory()) await checkTree(path.join(dir, entry.name));
    }
  }
  await checkTree(dist);
  const html = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
  if (!/<script\b[^>]*\bsrc=["']\/demo\/[^"']+\.js(?:[?#][^"']*)?["']/i.test(html)) throw new Error('Missing JavaScript entry built for /demo/.');
  for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)) {
    const ref = match[1];
    if (/^(?:[a-z]+:|\/\/|#)/i.test(ref)) continue;
    let relative = decodeURIComponent(ref.split(/[?#]/)[0]);
    if (relative.startsWith('/demo/')) relative = relative.slice('/demo/'.length);
    else if (relative.startsWith('/')) throw new Error('Demo asset uses an incorrect base path.');
    if (!relative) continue;
    if (relative.split('/').includes('..') || relative.split('/')[0] === 'data') throw new Error('Demo entry references an excluded or escaping path.');
    const asset = path.resolve(dist, relative);
    if (!asset.startsWith(dist + path.sep) || !(await fs.stat(asset)).isFile()) throw new Error('Demo entry references a missing file.');
  }
  await fs.mkdir(path.dirname(target), {recursive:true});
  const staged = await fs.mkdtemp(path.join(path.dirname(target), '.demo-stage-'));
  try {
    for (const entry of await fs.readdir(dist)) {
      if (entry === 'data') continue;
      await fs.cp(path.join(dist, entry), path.join(staged, entry), {recursive:true});
    }
    const version = {sourceRepository:'https://github.com/blikvm/web_client_vanilla', sourceCommit, builtAt, buildCommand:'npm run build:demo', basePath:'/demo/', excludedPaths:['data/']};
    await fs.writeFile(path.join(staged, 'version.json'), JSON.stringify(version, null, 2) + '\n');
    await fs.rm(target, {recursive:true, force:true});
    await fs.rename(staged, target);
    return version;
  } finally {
    await fs.rm(staged, {recursive:true, force:true});
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const sourceDir = path.resolve(process.argv[2] || '.demo-source');
  const targetDir = path.resolve(process.argv[3] || 'static/demo');
  const sourceCommit = execFileSync('git', ['-C', sourceDir, 'rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
  const version = await syncDemo({sourceDir, targetDir, sourceCommit, builtAt:process.env.BUILD_TIME || new Date().toISOString()});
  console.log(`Demo synchronized from ${version.sourceCommit}; built at ${version.builtAt}.`);
  if (process.env.GITHUB_STEP_SUMMARY) await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `### Online demo\nFrontend source: \`${version.sourceCommit}\`\n\nBuilt at ${version.builtAt}. [Online demo](https://blikvm.com/demo/) · [Source record](https://blikvm.com/demo/version.json)\n`);
}

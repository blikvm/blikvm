import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { mdToPdf } from 'md-to-pdf';

function toPosix(p) {
  return p.replace(/\\/g, '/');
}

function rewriteAssetLinks(markdown, staticBase) {
  // Docusaurus site-absolute assets like /assets/... and /img/...
  // Rewrite to local repo paths (relative to the temp markdown file).
  // Example: (/assets/...) -> (../static/assets/...)
  const base = staticBase.replace(/\/$/, '');
  return markdown
    // Replace inside link/image parentheses.
    .replace(/\(\/assets\//g, `(${base}/assets/`)
    .replace(/\(\/img\//g, `(${base}/img/`)
    // Fix a common fullwidth separator that breaks tables
    .replace(/备注｜/g, '备注|');
}

function convertAdmonitionsAndIframes(markdown) {
  const lines = markdown.split(/\r?\n/);
  const out = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const startMatch = line.match(/^:::(\w+)(?:\s+"([^"]+)")?\s*$/);
    if (startMatch) {
      const kind = startMatch[1].toUpperCase();
      const title = startMatch[2];

      const header = title ? `${kind}: ${title}` : kind;
      out.push(`> **${header}**`);

      i += 1;
      while (i < lines.length && !/^:::\s*$/.test(lines[i])) {
        const contentLine = lines[i];

        // Replace embedded iframes with a plain link.
        const iframeMatch = contentLine.match(/<iframe\s+[^>]*src\s*=\s*"([^"]+)"[^>]*>(?:<\/iframe>)?/i);
        if (iframeMatch) {
          let src = iframeMatch[1];
          if (src.startsWith('//')) src = `https:${src}`;
          out.push(`> Video: ${src}`);
        } else if (contentLine.trim() === '') {
          out.push('>');
        } else {
          out.push(`> ${contentLine}`);
        }

        i += 1;
      }

      // Consume closing ::: (may have trailing spaces)
      if (i < lines.length && /^:::\s*$/.test(lines[i])) {
        i += 1;
      }

      out.push('');
      continue;
    }

    out.push(line);
    i += 1;
  }

  return out.join('\n');
}

function preprocess(markdown, staticBase) {
  const step1 = rewriteAssetLinks(markdown, staticBase);
  const step2 = convertAdmonitionsAndIframes(step1);
  return step2;
}

async function main() {
  const args = process.argv.slice(2);
  const inputArg = args[0];
  const outputArg = args[1];

  if (!inputArg) {
    console.error('Usage: node scripts/export-doc-pdf.mjs <input.md> [output.pdf]');
    process.exit(2);
  }

  const repoRoot = process.cwd();
  const inputPath = path.isAbsolute(inputArg) ? inputArg : path.join(repoRoot, inputArg);

  const inputBase = path.basename(inputPath, path.extname(inputPath));
  const outputPath = outputArg
    ? (path.isAbsolute(outputArg) ? outputArg : path.join(repoRoot, outputArg))
    : path.join(repoRoot, 'exports', `${inputBase}.pdf`);

  const tmpDir = path.join(repoRoot, '.pdf-tmp');
  const tmpMdPath = path.join(tmpDir, `${inputBase}.md`);
  const cssPath = path.join(repoRoot, 'scripts', 'pdf.css');

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.mkdir(tmpDir, { recursive: true });

  const relToRootRaw = path.relative(path.dirname(tmpMdPath), repoRoot);
  const relToRoot = toPosix(relToRootRaw) || '.';
  const staticBase = relToRoot === '.' ? 'static' : `${relToRoot}/static`;

  const raw = await fs.readFile(inputPath, 'utf8');
  const processed = preprocess(raw, staticBase);
  await fs.writeFile(tmpMdPath, processed, 'utf8');

  const result = await mdToPdf(
    { path: tmpMdPath },
    {
      dest: outputPath,
      basedir: repoRoot,
      stylesheet: [toPosix(cssPath)],
      pdf_options: {
        format: 'A4',
        printBackground: true,
        margin: {
          top: '16mm',
          right: '14mm',
          bottom: '16mm',
          left: '14mm',
        },
      },
    },
  );

  if (!result?.filename) {
    console.error('PDF generation did not return a filename.');
    process.exit(1);
  }

  console.log(`PDF generated: ${result.filename}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

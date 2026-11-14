import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

console.log('Running test suite for awesome-self-improving-agents...');

// 1. Prohibited files check
const prohibited = ['CONTRIBUTING.md', 'CODE_OF_CONDUCT.md'];
for (const file of prohibited) {
  if (fs.existsSync(path.join(root, file))) {
    throw new Error(`Prohibited file exists: ${file}`);
  }
}
console.log('✔ Prohibited files check passed');

// 2. LICENSE check
const license = fs.readFileSync(path.join(root, 'LICENSE'), 'utf8');
if (!license.includes('Copyright (c) 2026 Abdullah Formuli')) {
  throw new Error('LICENSE missing copyright notice for Abdullah Formuli');
}
console.log('✔ LICENSE copyright check passed');

// 3. MAINTAINERS.md check
const maintainers = fs.readFileSync(path.join(root, 'MAINTAINERS.md'), 'utf8');
if (!maintainers.includes('Maintained solely by Abdullah Formuli. No external contributions accepted.')) {
  throw new Error('MAINTAINERS.md missing required sole maintainer notice');
}
console.log('✔ MAINTAINERS.md check passed');

// 4. README.md check
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
if (!readme.includes('Maintained solely by Abdullah Formuli. No external contributions accepted.')) {
  throw new Error('README.md missing required sole maintainer notice');
}
if (readme.includes('selfimproving-agent/awesome-self-improving-agents') || readme.includes('selfimproving-agent/awesome-Self-Improving-Agents')) {
  throw new Error('README.md contains upstream repository links');
}
if (!readme.includes('authrain-cloud-abdullahformuli/awesome-self-improving-agents')) {
  throw new Error('README.md missing canonical repository reference');
}
console.log('✔ README.md check passed');

// 5. CITATION.cff check
const citation = fs.readFileSync(path.join(root, 'CITATION.cff'), 'utf8');
if (!citation.includes('Formuli') || !citation.includes('Abdullah')) {
  throw new Error('CITATION.cff missing author name');
}
if (!citation.includes('authrain-cloud-abdullahformuli/awesome-self-improving-agents')) {
  throw new Error('CITATION.cff missing canonical repo URL');
}
console.log('✔ CITATION.cff check passed');

// 6. package.json check
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (pkg.name !== '@authrain/awesome-self-improving-agents') {
  throw new Error(`Unexpected package name: ${pkg.name}`);
}
if (!pkg.author || !pkg.author.includes('Abdullah Formuli')) {
  throw new Error('package.json missing author');
}
console.log('✔ package.json check passed');

// 7. Verify referenced images in README.md exist on disk
const imgMatches = [...readme.matchAll(/src=["'](assets\/[^"']+)["']/g)];
for (const match of imgMatches) {
  const imgPath = path.join(root, match[1]);
  if (!fs.existsSync(imgPath)) {
    throw new Error(`Referenced image not found: ${match[1]}`);
  }
}
console.log(`✔ Verified all ${imgMatches.length} embedded images exist on disk`);

// 8. LaTeX source integrity check
const texDir = path.join(root, 'Paper', 'tex');
if (!fs.existsSync(texDir)) {
  throw new Error('Paper/tex directory missing');
}
const texFiles = fs.readdirSync(texDir).filter(f => f.endsWith('.tex'));
if (texFiles.length === 0) {
  throw new Error('No .tex files found in Paper/tex');
}
for (const tf of texFiles) {
  const stat = fs.statSync(path.join(texDir, tf));
  if (stat.size === 0) {
    throw new Error(`Empty TeX file: ${tf}`);
  }
}
console.log(`✔ Verified ${texFiles.length} LaTeX source sections in Paper/tex`);

// 9. Upstream link audit in markdown and tex files
const checkDirs = [root, path.join(root, 'Paper')];
for (const d of checkDirs) {
  const files = fs.readdirSync(d, { withFileTypes: true });
  for (const f of files) {
    if (f.isFile() && (f.name.endsWith('.md') || f.name.endsWith('.tex'))) {
      const content = fs.readFileSync(path.join(d, f.name), 'utf8');
      if (content.includes('selfimproving-agent/awesome-')) {
        throw new Error(`Upstream repo link found in ${f.name}`);
      }
    }
  }
}
console.log('✔ Upstream link audit passed');

console.log('--- ALL TESTS PASSED ---');

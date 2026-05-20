import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const content = readFileSync('src/lib/blog-data.ts', 'utf8');
const existingSlugs = new Set([...content.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]));

const scriptsDir = 'scripts';
const files = readdirSync(scriptsDir);
const batchFiles = files.filter(f => f.startsWith('generate-blogs-batch') && f.endsWith('.mjs'));

console.log(`Found ${batchFiles.length} batch files.`);

const unrunBatches = [];

for (const file of batchFiles) {
  const filePath = join(scriptsDir, file);
  const fileText = readFileSync(filePath, 'utf8');
  
  // Try to match slugs in the batch file
  // Slugs are usually defined like: slug: "some-slug", or in arrays like ["some-slug",
  const slugsInFile = [];
  const matches1 = [...fileText.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
  const matches2 = [...fileText.matchAll(/^\s*\[\s*"([^"]+)"/gm)].map(m => m[1]);
  
  slugsInFile.push(...matches1, ...matches2);
  
  const uniqueSlugs = [...new Set(slugsInFile)];
  if (uniqueSlugs.length === 0) {
    console.log(`Warning: could not find slugs in ${file}`);
    continue;
  }
  
  const missingSlugs = uniqueSlugs.filter(s => !existingSlugs.has(s));
  if (missingSlugs.length > 0) {
    unrunBatches.push({ file, missingCount: missingSlugs.length, sample: missingSlugs.slice(0, 3) });
  }
}

console.log('Unrun batches:', unrunBatches.length);
unrunBatches.forEach(b => {
  console.log(`  - ${b.file}: missing ${b.missingCount} slugs (e.g. ${b.sample.join(', ')})`);
});

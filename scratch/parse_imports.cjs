const fs = require('fs');
const path = require('path');

const dir = 'dist/mobile/assets';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Regex to match imports from sibling chunks
  const regex = /import\s*\{([^}]+)\}\s*from\s*['"]\.\/([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const symbols = match[1].trim().replace(/\s+/g, ' ');
    const fromChunk = match[2];
    console.log(`Chunk [${file}] imports { ${symbols} } from [${fromChunk}]`);
  }
}

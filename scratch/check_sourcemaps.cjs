const fs = require('fs');
const path = require('path');

const dir = 'dist/mobile/assets';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js.map'));

for (const file of files) {
  if (file.includes('shared-') || file.includes('routes-') || file.includes('vendor-capacitor')) {
    const map = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    console.log(`\n=== Chunk: ${file.replace('.js.map', '')} ===`);
    console.log(map.sources.map(s => s.replace(/.*\/src\//, 'src/')));
  }
}

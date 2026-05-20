import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'src', 'lib', 'blog-data.ts');
const content = fs.readFileSync(filePath, 'utf8');
const matches = [...content.matchAll(/slug:\s*"([^"]+)"/g)];
const slugs = matches.map(m => m[1]);

console.log('Total slugs:', slugs.length);
console.log('Last 30 slugs:\n', JSON.stringify(slugs.slice(-30), null, 2));

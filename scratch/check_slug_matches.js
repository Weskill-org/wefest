import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'src', 'lib', 'blog-data.ts');
const content = fs.readFileSync(filePath, 'utf8');

const matches = [...content.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[0]);
console.log('Matches length:', matches.length);
console.log('Unique matches length:', new Set(matches).size);
console.log('First 20 matches:', matches.slice(0, 20));
console.log('Last 20 matches:', matches.slice(-20));

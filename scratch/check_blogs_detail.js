import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'src', 'lib', 'blog-data.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Parse the content to find all blogs
// A blog looks like { slug: ..., content: ... }
const blogBlocks = content.split(/\},\s*\{/);

let withContent = 0;
let withoutContent = 0;
let withoutContentSlugs = [];

blogBlocks.forEach((block, i) => {
  const slugMatch = block.match(/slug:\s*"([^"]+)"/);
  const slug = slugMatch ? slugMatch[1] : `block-${i}`;
  const hasContent = block.includes('content:');
  
  if (hasContent) {
    withContent++;
  } else {
    withoutContent++;
    withoutContentSlugs.push(slug);
  }
});

console.log('Total blogs parsed:', blogBlocks.length);
console.log('With content:', withContent);
console.log('Without content:', withoutContent);
console.log('Sample without content:', withoutContentSlugs.slice(0, 10));

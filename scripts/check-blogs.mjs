import { readFileSync } from 'fs';

const content = readFileSync('src/lib/blog-data.ts', 'utf8');

const slugMatches = [...content.matchAll(/slug:\s*"([^"]+)"/g)];
const totalSlugs = slugMatches.length;

// Check each content block for required sections
const checks = ['## H2:', 'Frequently Asked Questions', 'Conclusion', 'Key Takeaways', 'WeFest'];
let incomplete = [];

// Split by blog objects
const blogBlocks = content.split(/\}\s*,?\s*(?:\/\/[^\r\n]*)?\s*\{/);

blogBlocks.forEach((block, i) => {
  const slugMatch = block.match(/slug:\s*"([^"]+)"/);
  const slug = slugMatch ? slugMatch[1] : `block-${i}`;
  
  // Only check blocks that have content
  if (!block.includes('content:')) return;
  
  const missing = checks.filter(check => !block.includes(check));
  if (missing.length > 0) {
    incomplete.push({ slug, missing });
  }
});

console.log(`Total blogs: ${totalSlugs}`);
console.log(`Blogs checked: ${blogBlocks.filter(b => b.includes('content:')).length}`);

if (incomplete.length === 0) {
  console.log('✅ ALL BLOGS ARE COMPLETE — every blog has H2 sections, FAQ, Conclusion, Key Takeaways, and WeFest mentions.');
} else {
  console.log(`❌ ${incomplete.length} incomplete blogs found:`);
  incomplete.forEach(b => console.log(`  - ${b.slug}: missing [${b.missing.join(', ')}]`));
}

const fs = require('fs');
const content = fs.readFileSync('dist/mobile/assets/routes-company-BJkYnH4v.js', 'utf8');

// Let's find all occurrences of 'const C' and 'function C' and print their indexes and surrounding context
const regex = /\b(const|let|var|function|class)\s+C\b/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(`Found declaration at index ${match.index}:`);
  console.log(content.substring(match.index - 50, match.index + 200));
}

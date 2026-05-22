const fs = require('fs');
const content = fs.readFileSync('dist/mobile/assets/routes-company-BJkYnH4v.js', 'utf8');

// Find: const C = ... or let C = ... or function C ...
const targets = ["const C", "let C", "function C", "C="];
let found = false;
for (const target of targets) {
  const index = content.indexOf(target);
  if (index !== -1) {
    console.log(`Found "${target}" at index ${index}`);
    console.log("Surrounding code:", content.substring(index - 100, index + 300));
    found = true;
    break;
  }
}

if (!found) {
  // Let's find occurrences of C
  const regex = /\bC\b/g;
  let match;
  let count = 0;
  while ((match = regex.exec(content)) && count < 10) {
    console.log(`Occurrence ${count + 1} at index ${match.index}:`);
    console.log(content.substring(match.index - 50, match.index + 50));
    count++;
  }
}

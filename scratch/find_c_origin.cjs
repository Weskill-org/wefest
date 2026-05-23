const fs = require('fs');
const content = fs.readFileSync('dist/mobile/assets/routes-company-BJkYnH4v.js', 'utf8');

// Find all occurrences of the word C in the file and print their character indices
const regex = /\bC\b/g;
const matches = [];
let match;
while ((match = regex.exec(content)) !== null) {
  matches.push(match.index);
}
console.log(`Total occurrences of C: ${matches.length}`);

// For each occurrence, let's print 50 chars before and after to analyze where it's defined/assigned.
// Since there could be many, let's print the first 50.
console.log("First 50 occurrences of C:");
for (let i = 0; i < Math.min(matches.length, 50); i++) {
  const index = matches[i];
  console.log(`[${i}] Index ${index}: ${content.substring(Math.max(0, index - 30), Math.min(content.length, index + 30))}`);
}

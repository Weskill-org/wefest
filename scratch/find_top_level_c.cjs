const fs = require('fs');
const content = fs.readFileSync('dist/mobile/assets/routes-company-BJkYnH4v.js', 'utf8');

// Let's find any occurrences of "=C" or "C=" or "C," in the global scope
// We can use a regex to find definitions of C that are not inside functions.
// But since the file is minified, we can check all occurrences of C.
// Let's find occurrences of "C" that are likely top level variables.
const regex = /\bC\b/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const index = match.index;
  const context = content.substring(Math.max(0, index - 40), Math.min(content.length, index + 60));
  if (context.includes('const C') || context.includes('let C') || context.includes('var C') || context.includes('function C') || context.includes('class C')) {
    console.log(`Match at ${index}: ${context}`);
  }
}

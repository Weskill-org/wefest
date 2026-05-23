const fs = require('fs');
const content = fs.readFileSync('dist/mobile/assets/routes-admin-DmwFVpl7.js', 'utf8');

// Find occurrences of Qs
// Let's find: const Qs = ..., let Qs = ..., function Qs ... or similar.
const targets = ["const Qs", "let Qs", "function Qs", "Qs="];
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
  // Let's find all occurrences of Qs and print their context
  const regex = /\bQs\b/g;
  let match;
  let count = 0;
  while ((match = regex.exec(content)) && count < 10) {
    console.log(`Occurrence ${count + 1} at index ${match.index}:`);
    console.log(content.substring(match.index - 50, match.index + 50));
    count++;
  }
}

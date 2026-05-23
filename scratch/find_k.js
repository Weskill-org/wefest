const fs = require('fs');
const content = fs.readFileSync('dist/mobile/assets/routes-admin-DmwFVpl7.js', 'utf8');

// Search for the export mapping or definitions of K
// Usually in minified file, it might be: function K... or const K=... or let K; or K=... or something similar.
// Let's search for occurrences of 'K' in various contexts.

// We know the exports list looks like: export { ... K as ... }
// Let's find the exports statement at the end of the file.
const exportMatch = content.match(/export\s*\{([^}]+)\}/);
if (exportMatch) {
  console.log("Exports match:", exportMatch[0].substring(0, 500));
}

// Let's find where K is defined by splitting words or searching with regex
// Let's look for definitions around cva (class-variance-authority)
// Since class-variance-authority starts with "inline-flex items-center rounded-md border..." or similar, let's find that string!
const cvaString = "inline-flex items-center rounded-md border";
const index = content.indexOf(cvaString);
if (index !== -1) {
  console.log("Found cva string at index", index);
  console.log("Surrounding code:", content.substring(index - 200, index + 200));
} else {
  console.log("CVA string not found in routes-admin!");
}

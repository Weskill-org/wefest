const fs = require('fs');
const content = fs.readFileSync('dist/mobile/assets/routes-admin-DmwFVpl7.js', 'utf8');

const exportMatch = content.match(/export\s*\{([^}]+)\}/);
if (exportMatch) {
  console.log("Exports match:", exportMatch[0].substring(0, 500));
}

const cvaString = "inline-flex items-center rounded-md border";
const index = content.indexOf(cvaString);
if (index !== -1) {
  console.log("Found cva string at index", index);
  console.log("Surrounding code:", content.substring(index - 200, index + 200));
} else {
  console.log("CVA string not found in routes-admin!");
}

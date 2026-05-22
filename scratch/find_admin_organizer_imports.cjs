const fs = require('fs');
const content = fs.readFileSync('dist/mobile/assets/routes-admin-DmwFVpl7.js', 'utf8');

// Search for import...from"./routes-organizer-DriBxIP9.js"
const regex = /import\s*\{([^}]+)\}\s*from\s*['"]\.\/routes-organizer-DriBxIP9\.js['"]/g;
const match = regex.exec(content);
if (match) {
  console.log("Import statement found:", match[0]);
} else {
  console.log("No import from routes-organizer found in routes-admin.js");
}

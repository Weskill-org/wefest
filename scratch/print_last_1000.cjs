const fs = require('fs');
const content = fs.readFileSync('dist/mobile/assets/routes-company-BJkYnH4v.js', 'utf8');
console.log(content.substring(content.length - 1000));

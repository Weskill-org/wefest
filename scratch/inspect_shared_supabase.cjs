const fs = require('fs');
const content = fs.readFileSync('dist/mobile/assets/shared-supabase-DzUNS-IH.js', 'utf8');

// We want to find references to '_' and 'd' (which were imported from shared-utils)
// Let's print the entire content since it's only 2.59 kB
console.log(content);

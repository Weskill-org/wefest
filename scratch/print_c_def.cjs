const fs = require('fs');
const content = fs.readFileSync('dist/mobile/assets/routes-company-BJkYnH4v.js', 'utf8');

// Find variable 'C' definition: it must be a standalone identifier like const C= or function C( or let C=
// Let's find index of const C= and print 300 characters
let idx = content.indexOf('const C=');
if (idx !== -1) {
  console.log("const C= at", idx);
  console.log(content.substring(idx, idx + 300));
} else {
  idx = content.indexOf('function C(');
  if (idx !== -1) {
    console.log("function C( at", idx);
    console.log(content.substring(idx, idx + 300));
  } else {
    // Let's do regex search for definition of C
    const regex = /\b(const|let|var|function)\s+C\b/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      console.log("Regex match at", match.index);
      console.log(content.substring(match.index, match.index + 300));
    }
  }
}

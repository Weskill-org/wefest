const fs = require('fs');
const content = fs.readFileSync('dist/mobile/assets/routes-organizer-CxHz8Eu0.js', 'utf8');

// Find the definition of 'ae'
// We can use a regex to search for word boundary followed by 'ae' followed by assignment/function
const regexes = [
  /function\s+ae\b/g,
  /\bae\s*=\s*/g,
  /const\s+ae\b/g,
  /let\s+ae\b/g,
  /class\s+ae\b/g
];

for (const regex of regexes) {
  const match = content.match(regex);
  if (match) {
    console.log(`Matched: ${regex}`);
    // Find index of match and print some chars around it
    let idx = 0;
    while ((idx = content.indexOf(match[0], idx)) !== -1) {
      console.log(`Index ${idx}:`);
      console.log(content.slice(idx - 100, idx + 200));
      idx += match[0].length;
    }
  }
}

const fs = require('fs');
const path = require('path');

const dir = 'dist/mobile/assets';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

const adj = {};

// Parse imports from each file
for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  adj[file] = [];
  
  // Find all static imports, e.g. import...from"./..."
  const regex = /import\s*(?:[^'"]+|{[^}]+})\s*from\s*['"]\.\/([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    adj[file].push(match[1]);
  }
}

// Find cycles using DFS
const visited = {};
const pathSet = {};
const cycles = [];

function dfs(node) {
  visited[node] = true;
  pathSet[node] = true;
  
  const neighbors = adj[node] || [];
  for (const neighbor of neighbors) {
    if (pathSet[neighbor]) {
      // Found a cycle!
      const cyclePath = [];
      let foundNode = false;
      // We can trace the cycle path
      cycles.push({ from: node, to: neighbor });
    } else if (!visited[neighbor]) {
      dfs(neighbor);
    }
  }
  
  pathSet[node] = false;
}

for (const file of files) {
  if (!visited[file]) {
    dfs(file);
  }
}

console.log("Detected cycles between chunks:");
if (cycles.length === 0) {
  console.log("No circular dependencies detected between chunks.");
} else {
  for (const cycle of cycles) {
    console.log(`- ${cycle.from} -> ${cycle.to}`);
  }
}

console.log("\nChunk Imports Graph:");
for (const file of Object.keys(adj)) {
  if (adj[file].length > 0) {
    console.log(`${file} imports:`);
    for (const imp of adj[file]) {
      console.log(`  - ${imp}`);
    }
  }
}

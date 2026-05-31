const fs = require('fs');
const content = fs.readFileSync('c:/Users/Akshad/Projects/reellog/src/App.jsx', 'utf8');
const lines = content.split('\n');

const cssStart = lines.findIndex(l => l.includes('const CSS = `'));
let cssEnd = -1;
for (let i = cssStart + 1; i < lines.length; i++) {
  if (lines[i].includes('`;')) {
    cssEnd = i;
    break;
  }
}

console.log('Start:', cssStart, 'End:', cssEnd);

if (cssStart !== -1 && cssEnd !== -1) {
  const cssLines = lines.slice(cssStart + 1, cssEnd);
  fs.writeFileSync('c:/Users/Akshad/Projects/reellog/src/index.css', cssLines.join('\n'));
}

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
  // Extract CSS
  const cssLines = lines.slice(cssStart + 1, cssEnd);
  fs.writeFileSync('c:/Users/Akshad/Projects/reellog/src/index.css', cssLines.join('\n'));
  
  // Remove CSS from App.jsx
  lines.splice(cssStart, cssEnd - cssStart + 1);
  
  // Remove <style>{CSS}</style> from App.jsx
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<style>{CSS}</style>')) {
      lines[i] = lines[i].replace('<style>{CSS}</style>', '');
      console.log('Removed style tag at line', i);
    }
  }

  // Add import to main.jsx
  let mainContent = fs.readFileSync('c:/Users/Akshad/Projects/reellog/src/main.jsx', 'utf8');
  if (!mainContent.includes("import './index.css'")) {
    mainContent = "import './index.css';\n" + mainContent;
    fs.writeFileSync('c:/Users/Akshad/Projects/reellog/src/main.jsx', mainContent);
  }
  
  // Write back App.jsx
  fs.writeFileSync('c:/Users/Akshad/Projects/reellog/src/App.jsx', lines.join('\n'));
  console.log('Done!');
}

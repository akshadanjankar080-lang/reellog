#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/App.jsx');

// Read file
let content = fs.readFileSync(filePath, 'utf8');

console.log('Starting encoding fixes...');

// Replace broken UTF-8 patterns with working characters
const replacements = [
  // Arrows  
  [/â†'/g, '→'],
  [/â€¹/g, '<'],
  [/â€º/g, '>'],
  
  // Quotes and dashes
  [/â€™/g, "'"],
  [/â€˜/g, "'"],
  [/â€"/g, '—'],
  [/â€"/g, '-'],
  [/â€¦/g, '...'],
  
  // Icons
  [/âœ"/g, '✓'],
  [/â–¶/g, '▶'],
  [/â—Ž/g, '●'],
  [/â"€+/g, '—'],
  
  // "See all" button fix
  [/See all â†'/g, 'See all →'],
  [/See all â†'/g, 'See all →'],
  
  // Back button
  [/← Back/g, '← Back'],
];

replacements.forEach(([pattern, replacement]) => {
  const before = content.length;
  content = content.replace(pattern, replacement);
  const after = content.length;
  if (before !== after) {
    console.log(`✓ Fixed pattern: ${pattern} (${Math.abs(before - after)} chars changed)`);
  }
});

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Successfully fixed all encoding issues!');
console.log(`✓ Output file: ${filePath}`);

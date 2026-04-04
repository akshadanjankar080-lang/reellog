const fs = require('fs');
const path = require('path');

const file = 'c:/Users/Akshad/Projects/reellog/src/App.jsx';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const supaStart = lines.findIndex(l => l.includes('// ─── SUPABASE ──'));
const tmdbStart = lines.findIndex(l => l.includes('// ─── TMDB ──'));
const constantsStart = lines.findIndex(l => l.includes('// ─── CONSTANTS ──'));
const cssStart = lines.findIndex(l => l.includes('// ─── GLOBAL CSS ──'));

if (supaStart === -1 || cssStart === -1) {
  console.log("Could not find boundaries.");
  process.exit();
}

// Extract blocks
const supabaseBlock = lines.slice(supaStart, tmdbStart).filter(l => l.trim() !== '');
// Add import to Supabase
supabaseBlock.unshift('import { createClient } from "@supabase/supabase-js";\n');
// Add export
const supaExportIndex = supabaseBlock.findIndex(l => l.startsWith('const supabase'));
if (supaExportIndex > -1) {
    supabaseBlock[supaExportIndex] = supabaseBlock[supaExportIndex].replace('const supabase', 'export const supabase');
}


const constantsBlock = lines.slice(tmdbStart, cssStart).filter(l => l.trim() !== '');
// Add exports to everything in constants
for (let i = 0; i < constantsBlock.length; i++) {
   if (constantsBlock[i].startsWith('const ')) {
      constantsBlock[i] = constantsBlock[i].replace('const ', 'export const ');
   }
   if (constantsBlock[i].startsWith('function ')) {
      constantsBlock[i] = constantsBlock[i].replace('function ', 'export function ');
   }
}

// Make lib dir
const libDir = 'c:/Users/Akshad/Projects/reellog/src/lib';
if (!fs.existsSync(libDir)) fs.mkdirSync(libDir);

fs.writeFileSync(path.join(libDir, 'supabase.js'), supabaseBlock.join('\n'));
fs.writeFileSync(path.join(libDir, 'constants.js'), constantsBlock.join('\n')); // wait, react-icons are used in constants!

const fs = require('fs');
const appPath = 'c:/Users/Akshad/Projects/reellog/src/App.jsx';
let content = fs.readFileSync(appPath, 'utf8');

let changed = false;

// ── PHASE 4: Remove CategoryPage → LanguagePage definitions ──────────────────
const catStart = content.indexOf('// \u2500\u2500\u2500 CATEGORY PAGE');
const mainApp  = content.indexOf('// \u2500\u2500\u2500 MAIN APP');
if (catStart !== -1 && mainApp !== -1 && catStart < mainApp) {
  content = content.slice(0, catStart) + content.slice(mainApp);
  console.log('\u2705 Phase 4: Removed CategoryPage / GenrePage / CountryPage / LanguagePage definitions');
  changed = true;
} else {
  console.log('\u26A0\uFE0F  Phase 4: Could not find page definition boundaries (maybe already removed)');
}

// ── PHASE 5a: Remove the leftover `const CSS = \`…\`` block ──────────────────
const cssConstStart = content.indexOf('// \u2500\u2500\u2500 GLOBAL CSS');
const mainApp2      = content.indexOf('// \u2500\u2500\u2500 MAIN APP');
if (cssConstStart !== -1 && mainApp2 !== -1 && cssConstStart < mainApp2) {
  content = content.slice(0, cssConstStart) + content.slice(mainApp2);
  console.log('\u2705 Phase 5a: Removed leftover CSS const block (styles already in index.css)');
  changed = true;
} else {
  console.log('\u26A0\uFE0F  Phase 5a: CSS const block not found (may already be removed)');
}

// ── PHASE 5b: Remove unused blank lines at top (collapse 4+ consecutive blank lines to 1) ──
content = content.replace(/(\r?\n){4,}/g, '\n\n');
console.log('\u2705 Phase 5b: Cleaned up extra blank lines');

// ── PHASE 5c: Remove the <style>{CSS}</style> injection if it exists ──────────
if (content.includes('<style>{CSS}</style>')) {
  content = content.replace(/\s*<style>\{CSS\}<\/style>/g, '');
  console.log('\u2705 Phase 5c: Removed <style>{CSS}</style> tag from JSX');
} else {
  console.log('\u26A0\uFE0F  Phase 5c: No <style>{CSS}</style> found (already cleaned)');
}

// ── PHASE 5d: Remove debug console.log("APP RENDER") ────────────────────────
if (content.includes('console.log("APP RENDER")')) {
  content = content.replace(/\s*console\.log\(["']APP RENDER["']\);?\s*/g, '\n');
  console.log('\u2705 Phase 5d: Removed debug console.log');
}

if (changed) {
  fs.writeFileSync(appPath, content);
  console.log('\n\u2705\u2705 DONE! All phases complete. App.jsx is now clean and modular.\u2705\u2705');
} else {
  console.log('\n\u26A0\uFE0F  No changes were made.');
}

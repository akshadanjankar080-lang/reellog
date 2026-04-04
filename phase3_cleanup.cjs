const fs = require('fs');
const appPath = 'c:/Users/Akshad/Projects/reellog/src/App.jsx';
let content = fs.readFileSync(appPath, 'utf8');

// ── 1. Remove everything from "// ─── OTT STREAMING" through the closing }; of DEFAULT_SETTINGS
// The CSS block starts right after, so use "// ─── GLOBAL CSS" as the boundary
const ottStart = content.indexOf('// ─── OTT STREAMING PLATFORMS');
const cssComment = content.indexOf('// ─── GLOBAL CSS');
if (ottStart !== -1 && cssComment !== -1 && ottStart < cssComment) {
  content = content.slice(0, ottStart) + content.slice(cssComment);
  console.log('✅ Removed OTT + static data + explore cards + DEFAULT_SETTINGS block');
} else {
  console.log('⚠️  Could not find OTT block boundaries, skipping');
}

// ── 2. Remove the Icon component through end of AuthModal
// Start: "// ─── ICON COMPONENT"  End: just before "// ─── CATEGORY PAGE"
const iconStart = content.indexOf('// ─── ICON COMPONENT');
const categoryStart = content.indexOf('// ─── CATEGORY PAGE');
if (iconStart !== -1 && categoryStart !== -1 && iconStart < categoryStart) {
  content = content.slice(0, iconStart) + content.slice(categoryStart);
  console.log('✅ Removed Icon/PosterImage/TmdbSection/HeroCarousel/SeeAllModal/RowSection/SettingsPanel/AuthModal');
} else {
  console.log('⚠️  Could not find Icon/AuthModal boundaries, skipping');
}

fs.writeFileSync(appPath, content);
console.log('✅ Done! App.jsx is now clean and modular.');

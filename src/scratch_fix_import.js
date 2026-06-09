const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// The lines we want to replace
const target1 = `const STATUSES = ["Want to Watch", "Watching", "Watched", "Paused", "Dropped"];`;
const target2 = `const SCOLOR   = { Watched: "#b2f0c5", Watching: "#f4e08a", "Want to Watch": "#8ebbf5", Paused: "#b8b8b8", Dropped: "#f47070" };`;
const target3 = `const SICON    = { Watched: "\u2713", Watching: "\u25b6", "Want to Watch": "\u25cb", Paused: "II", Dropped: "X" };`;

// we will just replace the first one with the import, and delete the other two.
content = content.replace(target1, `import { STATUS_LABELS as STATUSES, SCOLOR, SICON, getStatusIcon, normalizeStatus } from "./lib/watchStatus";`);
content = content.replace(target2, "");
content = content.replace(target3, "");

// also the user mentioned "getStatusIcon" was manually defined around line 1437. Let's delete it too if it's there.
content = content.replace(
  /\/\/ ÃƒÂ¢Ã¢â‚¬Â Ã¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬Â Ã¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬Â Ã¢â€šÂ¬ STATUS ICON HELPER[\s\S]+?return iconMap\[status\] \|\| status;\r?\n\};\r?\n/,
  ""
);

fs.writeFileSync('src/App.jsx', content);
console.log('Fixed imports in App.jsx');

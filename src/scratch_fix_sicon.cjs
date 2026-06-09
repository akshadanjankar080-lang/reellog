const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const target = `const SICON    = { Watched: "\\u2713", Watching: "\\u25b6", "Want to Watch": "\\u25cb", Paused: "II", Dropped: "X" };`;
// Note: \u in string literal gets parsed as actual unicode chars in JS.
// To replace the raw string we read from file, if the file actually contains `\u2713` literal characters, we need to escape backslashes: `\\\\u2713`.
// If the file contains actual `✓` characters, we use `✓`.

// The user manually modified the file:
// -const SICON    = { Watched: "✓", Watching: "▶", "Want to Watch": "○", Paused: "II", Dropped: "X" };
// +import { ... } from "./lib/watchStatus";
// +const SICON    = { Watched: "\\u2713", Watching: "\\u25b6", "Want to Watch": "\\u25cb", Paused: "II", Dropped: "X" };

// So let's replace BOTH just to be sure!
content = content.replace(/const SICON    = \{ Watched: "\\u2713", Watching: "\\u25b6", "Want to Watch": "\\u25cb", Paused: "II", Dropped: "X" \};\r?\n/, "");
content = content.replace(/const SICON    = \{ Watched: "✓", Watching: "▶", "Want to Watch": "○", Paused: "II", Dropped: "X" \};\r?\n/, "");

fs.writeFileSync('src/App.jsx', content);
console.log('Fixed SICON duplicate in App.jsx');

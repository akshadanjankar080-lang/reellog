const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// The original lines we want to replace
const targetStart = `<div className="fil-row">
                    {["Watching", "Completed", "Planned", "Dropped", "Paused", "All"].map(s => {`;

const targetReplacement = `<div className="status-tabs-container">
                    {["Watching", "Completed", "Planned", "Dropped", "Paused", "All"].map(s => {`;

content = content.replace(targetStart, targetReplacement);

// Replace the button line inside that block
// We need to match the button with key={s} and className=\`fil-btn\${filterStatus === s ? " on" : ""}\`
const buttonMatch = /<button key=\{s\} className=\{\`fil-btn\$\{filterStatus === s \? " on" : ""\}\`\} onClick=\{[^>]+>\{label\}<\/button>/g;
const buttonReplace = '<button key={s} className={`status-tab-pill${filterStatus === s ? " active" : ""}`} onClick={() => setFilterStatus(s)}>{label}</button>';

content = content.replace(buttonMatch, buttonReplace);

fs.writeFileSync('src/App.jsx', content);
console.log('App.jsx updated successfully.');

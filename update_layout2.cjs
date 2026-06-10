const fs = require('fs');

let appContent = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Rename recentlyAdded to recentlyUpdated and fix sorting
appContent = appContent.replace(
  'const recentlyAdded = source.slice(0, 10);',
  'const recentlyUpdated = [...source].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 10);'
);

// Helper to extract a block properly regardless of exact spacing
function extractBlock(startText) {
  const start = appContent.indexOf(startText);
  if (start === -1) throw new Error("Start text not found: " + startText);
  
  // Find the next </section>
  const sectionEnd = appContent.indexOf('</section>', start);
  if (sectionEnd === -1) throw new Error("</section> not found after start");
  
  // Find the closing brace and parenthesis of the conditional render
  const end = appContent.indexOf(')}', sectionEnd);
  if (end === -1) throw new Error(")} not found after </section>");
  
  const endMarkerLength = 2; // for ')}'
  const jsx = appContent.substring(start, end + endMarkerLength);
  appContent = appContent.substring(0, start) + appContent.substring(end + endMarkerLength);
  return jsx;
}

const cwJsx = extractBlock('{continueWatching.length > 0 && (');
let raJsx = extractBlock('{recentlyAdded.length > 0 && (');

// Rename recentlyAdded to recentlyUpdated inside raJsx
raJsx = raJsx.replace(/recentlyAdded/g, 'recentlyUpdated');
raJsx = raJsx.replace('Recently Added', 'Recently Updated');
raJsx = raJsx.replace('Latest 10', 'Latest updates');

// 4. Update continueWatching JSX to include progress bar
// Since spacing might vary, let's use regex
const cwOldProgressRegex = /\{entry\.progress > 0 && <div [^>]*>Ep \{entry\.progress\}<\/div>\}/;
const cwNewProgress = `{entry.progress > 0 && (
                            <div style={{ marginTop: 8 }}>
                              <div style={{ fontSize:11, color:'var(--txm)', marginBottom: 4, fontWeight:500 }}>Episode {entry.progress}</div>
                              <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: \`\${Math.min((entry.progress / 24) * 100, 100)}%\` }} />
                              </div>
                            </div>
                          )}`;
const cwJsxUpdated = cwJsx.replace(cwOldProgressRegex, cwNewProgress);

// 5. Insert both below library-toolbar (before library-grid-wrap)
const gridWrapStart = appContent.indexOf('<div className="library-grid-wrap">');
if (gridWrapStart === -1) throw new Error("gridWrapStart not found");

appContent = appContent.substring(0, gridWrapStart) + 
  cwJsxUpdated + '\n\n              ' + 
  raJsx + '\n\n              ' + 
  appContent.substring(gridWrapStart);

fs.writeFileSync('src/App.jsx', appContent);

// Add CSS to index.css
let cssContent = fs.readFileSync('src/index.css', 'utf8');
if (!cssContent.includes('.progress-bar-bg')) {
  cssContent += `\n/* Progress Bar UI */
.progress-bar-bg {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: var(--acc);
  border-radius: 2px;
  transition: width 0.3s ease;
}\n`;
  fs.writeFileSync('src/index.css', cssContent);
}

console.log('Layout updated successfully.');

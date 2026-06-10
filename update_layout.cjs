const fs = require('fs');

let appContent = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Rename recentlyAdded to recentlyUpdated and fix sorting
appContent = appContent.replace(
  'const recentlyAdded = source.slice(0, 10);',
  'const recentlyUpdated = [...source].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 10);'
);

// 2. Extract continueWatching JSX
const cwStart = appContent.indexOf('{continueWatching.length > 0 && (');
if (cwStart === -1) throw new Error("cwStart not found");
const cwEndMarker = '                </section>\n              )}';
let cwEnd = appContent.indexOf(cwEndMarker, cwStart);
if (cwEnd === -1) throw new Error("cwEnd not found");
cwEnd += cwEndMarker.length;
const cwJsx = appContent.substring(cwStart, cwEnd);
appContent = appContent.substring(0, cwStart) + appContent.substring(cwEnd);

// 3. Extract recentlyAdded JSX (now recentlyUpdated)
const raStart = appContent.indexOf('{recentlyAdded.length > 0 && (');
if (raStart === -1) throw new Error("raStart not found");
const raEndMarker = '                </section>\n              )}';
let raEnd = appContent.indexOf(raEndMarker, raStart);
if (raEnd === -1) throw new Error("raEnd not found");
raEnd += raEndMarker.length;
let raJsx = appContent.substring(raStart, raEnd);
appContent = appContent.substring(0, raStart) + appContent.substring(raEnd);

// Rename recentlyAdded to recentlyUpdated inside raJsx
raJsx = raJsx.replace(/recentlyAdded/g, 'recentlyUpdated');
raJsx = raJsx.replace('Recently Added', 'Recently Updated');
raJsx = raJsx.replace('Latest 10', 'Latest updates');

// 4. Update continueWatching JSX to include progress bar
const cwOldProgress = "{entry.progress > 0 && <div style={{ fontSize:11, color:'var(--acc)', marginTop:4, fontWeight:600 }}>Ep {entry.progress}</div>}";
const cwNewProgress = `{entry.progress > 0 && (
                            <div style={{ marginTop: 8 }}>
                              <div style={{ fontSize:11, color:'var(--txm)', marginBottom: 4, fontWeight:500 }}>Episode {entry.progress}</div>
                              <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: \`\${Math.min((entry.progress / 24) * 100, 100)}%\` }} />
                              </div>
                            </div>
                          )}`;
const cwJsxUpdated = cwJsx.replace(cwOldProgress, cwNewProgress);

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
  cssContent += `
/* Progress Bar UI */
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
}
`;
  fs.writeFileSync('src/index.css', cssContent);
}

console.log('Layout updated successfully.');

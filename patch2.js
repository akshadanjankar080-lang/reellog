const fs = require('fs');
const path = require('path');
const p = path.resolve(__dirname, 'src/App.jsx');

let file = fs.readFileSync(p, 'utf8');

// 1. IMPORTS
if (!file.includes('FaCamera') && file.includes('FaArrowLeft')) {
  file = file.replace(/FaArrowLeft,/, 'FaHome,\n  FaList,\n  FaCamera,\n  FaArrowLeft,');
}

// 2. CSS MEDIA QUERIES
const cssTarget = /padding:20px 32px 32px;\s*}/;
const newCSS = `padding:20px 32px 32px;
}

/* Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬ BOTTOM NAV (MOBILE) Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬ */
.bottom-nav {
  display:none;
  position:fixed; bottom:0; left:0; right:0; z-index:900;
  height:76px; background:rgba(7,16,10,.94); backdrop-filter:blur(16px);
  border-top:1px solid rgba(255,255,255,.08); box-shadow:0 -10px 40px rgba(0,0,0,0.4);
  padding-bottom:env(safe-area-inset-bottom);
}
.bottom-nav-item {
  flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:4px; background:none; border:none; color:var(--txm);
  font-size:10px; font-weight:600; text-transform:uppercase; transition:all 0.2s ease;
}
.bottom-nav-item svg { font-size:22px; transition:transform 0.2s; }
.bottom-nav-item.active { color:var(--acc); }
.bottom-nav-item.active svg { transform:translateY(-2px) scale(1.1); filter:drop-shadow(0 0 8px var(--acc-glow)); }

/* Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬ RESPONSIVE OVERRIDES Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬ */
@media (max-width: 1024px) {
  .browse-grid, .category-grid { grid-template-columns:repeat(3,1fr); }
}
@media (max-width: 768px) {
  .nav { display:none !important; }
  .bottom-nav { display:flex !important; }
  body { padding-bottom: 90px; }
  
  .hero-wrap { margin-top: 0; min-height: 500px; height: 85vh; }
  .hero-content { bottom: 6%; left: 16px; padding-bottom: 50px; }
  .hero-title { font-size: clamp(38px, 12vw, 54px); }
  .page-header { padding: 40px 20px 24px; }
  .row-scroll { padding: 4px 20px 24px; scroll-snap-type: x mandatory; }
  .row-card { scroll-snap-align: start; width: 140px; }
  .browse-grid, .category-grid { grid-template-columns:repeat(2,1fr); }
}`;

if (!file.includes('.bottom-nav {') && cssTarget.test(file)) {
  file = file.replace(cssTarget, newCSS);
}

// 3. BOTTOM NAV COMPONENT
const authTarget = /\{\/\* Ã¢â€ â‚¬Ã¢â€ â‚¬ AUTH MODAL Ã¢â€ â‚¬Ã¢â€ â‚¬ \*\/\}\s*\{showAuth && <AuthModal onClose=\{[^}]+\} \/>\}/;

const navInject = `{/* Ã¢â€ â‚¬Ã¢â€ â‚¬ AUTH MODAL Ã¢â€ â‚¬Ã¢â€ â‚¬ */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* Ã¢â€ â‚¬Ã¢â€ â‚¬ BOTTOM NAV (MOBILE) Ã¢â€ â‚¬Ã¢â€ â‚¬ */}
      <div className="bottom-nav">
        <button className={\`bottom-nav-item\${page === "home" ? " active" : ""}\`} onClick={() => { setPage("home"); navigate("/"); setNavDropdown(null); }}>
          <FaHome /><span>Home</span>
        </button>
        <button className={\`bottom-nav-item\${page === "explore" ? " active" : ""}\`} onClick={() => { setPage("explore"); navigate("/explore"); setNavDropdown(null); }}>
          <FaCompass /><span>Explore</span>
        </button>
        <button className={\`bottom-nav-item\${page === "mylist" ? " active" : ""}\`} onClick={() => { setPage("mylist"); navigate("/"); setNavDropdown(null); }}>
          <FaList /><span>My List</span>
        </button>
        <button className="bottom-nav-item" onClick={() => { setPage("explore"); navigate("/explore"); setTimeout(() => window.dispatchEvent(new Event("open-scanner")), 50); }}>
          <FaCamera /><span>Scan</span>
        </button>
      </div>`;

if (!file.includes('className="bottom-nav"') && authTarget.test(file)) {
  file = file.replace(authTarget, navInject);
}

fs.writeFileSync(p, file);
console.log("SUCCESS! App.jsx has been patched securely.");

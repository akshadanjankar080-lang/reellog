import { useState, useEffect, useRef } from "react";

// ── CONFIG ──────────────────────────────────────────────
const SUPABASE_URL = "https://maoiguhrcvpxvmgztmqq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hb2lndWhyY3ZweHZtZ3p0bXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzE0NTcsImV4cCI6MjA4OTkwNzQ1N30.Jz1JhnSaTo1z0XYnb4rzbpmG90ceawHx6APkT0gNGI8";
const TMDB_KEY_STORAGE = "reellog_tmdb_key";
const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500";
const TMDB_BASE = "https://api.themoviedb.org/3";

// ── SUPABASE HELPERS ────────────────────────────────────
async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

const db = {
  getAll: () => sbFetch("/entries?select=*&order=created_at.desc"),
  insert: (row) => sbFetch("/entries", { method: "POST", body: JSON.stringify(row) }),
  update: (id, row) => sbFetch(`/entries?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(row) }),
  delete: (id) => sbFetch(`/entries?id=eq.${id}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }),
};

// ── CONSTANTS ───────────────────────────────────────────
const STATUSES = ["Want to Watch", "Watching", "Watched"];
const STATUS_COLOR = { "Watched": "#a8e6bc", "Watching": "#f4d06f", "Want to Watch": "#a0c4f4" };
const STATUS_ICON = { "Watched": "✓", "Watching": "▶", "Want to Watch": "◎" };
const FILTERS = ["All", "Movie", "TV Show", "Anime"];

// ── CSS ──────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --g:#a8e6bc;--gd:#6dbf8a;--gg:rgba(168,230,188,0.12);
  --bk:#060a07;--card:#0d120e;--card2:#111811;
  --b1:rgba(168,230,188,0.08);--b2:rgba(168,230,188,0.18);
  --tx:#e8f0eb;--txd:#4a6652;--txm:#8aab92;
}
html{scroll-behavior:smooth;}
body{background:var(--bk);color:var(--tx);font-family:'DM Sans',sans-serif;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:var(--bk);}
::-webkit-scrollbar-thumb{background:var(--gd);border-radius:2px;}
.nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:64px;background:rgba(6,10,7,0.88);backdrop-filter:blur(24px);border-bottom:1px solid var(--b1);}
.logo{font-family:'DM Serif Display',serif;font-size:24px;color:var(--g);letter-spacing:-0.5px;}
.logo span{color:var(--tx);}
.nav-right{display:flex;align-items:center;gap:12px;}
.badge{font-size:11px;color:var(--txd);background:var(--card);padding:4px 12px;border:1px solid var(--b1);border-radius:20px;letter-spacing:1px;}
.btn-primary{background:var(--g);color:var(--bk);border:none;padding:9px 22px;font-size:13px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;border-radius:7px;transition:all .2s;}
.btn-primary:hover{background:#c5f0d4;transform:translateY(-1px);box-shadow:0 4px 20px rgba(168,230,188,.3);}
.btn-ghost{background:none;color:var(--txm);border:1px solid var(--b1);padding:9px 18px;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;border-radius:7px;transition:all .15s;}
.btn-ghost:hover{border-color:var(--b2);color:var(--tx);}
.hero{padding:130px 48px 60px;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;top:-120px;right:-150px;width:700px;height:700px;background:radial-gradient(circle,rgba(168,230,188,.05) 0%,transparent 65%);pointer-events:none;}
.hero-tag{display:inline-flex;align-items:center;gap:8px;background:var(--gg);border:1px solid var(--b2);padding:6px 14px;border-radius:20px;font-size:11px;color:var(--g);letter-spacing:2.5px;text-transform:uppercase;margin-bottom:22px;animation:fadeUp .6s ease both;}
.hero-tag::before{content:'●';font-size:7px;animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.hero-h1{font-family:'DM Serif Display',serif;font-size:clamp(40px,6vw,76px);line-height:1.05;margin-bottom:16px;animation:fadeUp .6s .1s ease both;}
.hero-h1 em{color:var(--g);font-style:italic;}
.hero-p{font-size:16px;color:var(--txm);max-width:460px;line-height:1.75;font-weight:300;animation:fadeUp .6s .2s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.stats{display:flex;margin:0 48px;border:1px solid var(--b1);border-radius:14px;overflow:hidden;animation:fadeUp .6s .3s ease both;}
.stat{flex:1;padding:20px 28px;border-right:1px solid var(--b1);cursor:pointer;transition:background .2s;position:relative;overflow:hidden;}
.stat:last-child{border-right:none;}
.stat:hover{background:rgba(168,230,188,.03);}
.stat.active{background:rgba(168,230,188,.06);}
.stat.active::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--g);}
.stat-n{font-family:'DM Serif Display',serif;font-size:34px;line-height:1;}
.stat-l{font-size:10px;color:var(--txd);letter-spacing:2.5px;text-transform:uppercase;margin-top:5px;}
.toolbar{padding:28px 48px 0;display:flex;align-items:center;gap:20px;flex-wrap:wrap;}
.search-wrap{position:relative;max-width:560px;flex:1;}
.search-input{width:100%;background:var(--card);border:1px solid var(--b2);color:var(--tx);padding:14px 20px 14px 50px;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;border-radius:10px;transition:all .2s;}
.search-input:focus{border-color:var(--g);box-shadow:0 0 0 3px rgba(168,230,188,.1);}
.search-input::placeholder{color:var(--txd);}
.search-icon{position:absolute;left:17px;top:50%;transform:translateY(-50%);color:var(--txd);font-size:17px;}
.spin{position:absolute;right:16px;top:50%;transform:translateY(-50%);color:var(--g);font-size:13px;animation:spinning 1s linear infinite;}
@keyframes spinning{to{transform:translateY(-50%) rotate(360deg)}}
.dropdown{position:absolute;top:calc(100% + 8px);left:0;right:0;background:var(--card);border:1px solid var(--b2);border-radius:12px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.6);max-height:400px;overflow-y:auto;z-index:200;animation:dropIn .15s ease;}
@keyframes dropIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.drop-item{display:flex;align-items:center;gap:14px;padding:12px 16px;cursor:pointer;transition:background .15s;border-bottom:1px solid rgba(168,230,188,.04);}
.drop-item:last-child{border-bottom:none;}
.drop-item:hover{background:rgba(168,230,188,.07);}
.drop-poster{width:42px;height:60px;object-fit:cover;border-radius:5px;background:var(--card2);flex-shrink:0;}
.drop-info{flex:1;min-width:0;}
.drop-title{font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.drop-meta{font-size:12px;color:var(--txd);margin-top:2px;}
.drop-badge{font-size:10px;letter-spacing:1px;padding:3px 9px;background:var(--gg);color:var(--g);border:1px solid var(--b2);border-radius:5px;text-transform:uppercase;flex-shrink:0;}
.filters{display:flex;gap:8px;flex-wrap:wrap;}
.f-btn{background:var(--card);border:1px solid var(--b1);color:var(--txm);padding:7px 16px;font-size:12px;font-family:'DM Sans',sans-serif;cursor:pointer;border-radius:20px;transition:all .15s;letter-spacing:.3px;}
.f-btn:hover{border-color:var(--b2);color:var(--tx);}
.f-btn.on{background:var(--g);color:var(--bk);border-color:var(--g);font-weight:500;}
.sort-sel{background:var(--card);border:1px solid var(--b1);color:var(--txm);padding:8px 14px;font-size:12px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer;border-radius:8px;}
.grid-wrap{padding:28px 48px 100px;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:20px;}
.empty{grid-column:1/-1;text-align:center;padding:100px 0;color:var(--txd);}
.empty-icon{font-size:52px;margin-bottom:16px;opacity:.25;}
.card{background:var(--card);border:1px solid var(--b1);border-radius:14px;overflow:hidden;cursor:pointer;transition:all .28s cubic-bezier(.34,1.56,.64,1);position:relative;animation:fadeUp .4s ease both;}
.card:hover{transform:translateY(-7px) scale(1.025);border-color:var(--b2);box-shadow:0 24px 48px rgba(0,0,0,.5),0 0 0 1px rgba(168,230,188,.08);}
.card-img-wrap{position:relative;aspect-ratio:2/3;overflow:hidden;background:var(--card2);}
.card-img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease;display:block;}
.card:hover .card-img{transform:scale(1.06);}
.no-poster{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--txd);gap:8px;font-size:12px;}
.no-poster-icon{font-size:36px;opacity:.25;}
.card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(6,10,7,.95) 0%,rgba(6,10,7,.2) 50%,transparent 100%);}
.card-status{position:absolute;top:10px;right:10px;font-size:10px;letter-spacing:1px;padding:4px 10px;border-radius:20px;backdrop-filter:blur(10px);background:rgba(6,10,7,.7);border:1px solid;}
.card-btns{position:absolute;top:10px;left:10px;display:flex;gap:6px;opacity:0;transition:opacity .2s;}
.card:hover .card-btns{opacity:1;}
.card-btn{width:30px;height:30px;background:rgba(6,10,7,.8);backdrop-filter:blur(8px);border:1px solid var(--b2);border-radius:7px;color:var(--tx);font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.card-btn:hover{background:rgba(168,230,188,.2);border-color:var(--g);color:var(--g);}
.card-body{padding:14px;}
.card-title{font-size:14px;font-weight:500;line-height:1.3;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.card-row{display:flex;align-items:center;justify-content:space-between;}
.card-type{font-size:10px;letter-spacing:1px;color:var(--txd);text-transform:uppercase;}
.card-year{font-size:11px;color:var(--txd);}
.stars{display:flex;gap:2px;margin-top:8px;}
.star{font-size:12px;color:var(--b1);}
.star.on{color:#f4d06f;}
.backdrop{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.8);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;animation:bdin .2s ease;}
@keyframes bdin{from{opacity:0}to{opacity:1}}
.modal{background:var(--card);border:1px solid var(--b2);border-radius:18px;width:100%;max-width:500px;max-height:92vh;overflow-y:auto;animation:mdin .25s cubic-bezier(.34,1.56,.64,1);}
@keyframes mdin{from{opacity:0;transform:scale(.9) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
.modal-head{padding:24px 24px 0;display:flex;align-items:flex-start;gap:16px;}
.modal-poster{width:72px;height:104px;object-fit:cover;border-radius:9px;background:var(--card2);flex-shrink:0;}
.modal-info{flex:1;}
.modal-title{font-family:'DM Serif Display',serif;font-size:22px;line-height:1.2;margin-bottom:4px;}
.modal-sub{font-size:13px;color:var(--txd);}
.modal-overview{font-size:12px;color:var(--txd);margin-top:8px;line-height:1.6;font-style:italic;}
.modal-body{padding:24px;}
.field{margin-bottom:18px;}
.field-lbl{font-size:10px;letter-spacing:2.5px;color:var(--txd);text-transform:uppercase;margin-bottom:8px;display:block;}
.field-input,.field-select,.field-ta{width:100%;background:var(--bk);border:1px solid var(--b2);color:var(--tx);padding:11px 14px;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;border-radius:9px;transition:border-color .2s;}
.field-input:focus,.field-select:focus,.field-ta:focus{border-color:var(--g);}
.field-input::placeholder,.field-ta::placeholder{color:var(--txd);}
.field-ta{resize:vertical;min-height:80px;}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.pills{display:flex;gap:8px;flex-wrap:wrap;}
.pill{padding:8px 15px;border-radius:20px;font-size:12px;cursor:pointer;border:1px solid var(--b1);color:var(--txd);background:var(--bk);transition:all .15s;font-family:'DM Sans',sans-serif;}
.pill.on{font-weight:500;}
.star-row{display:flex;gap:6px;}
.star-pick{font-size:28px;cursor:pointer;color:var(--b1);transition:color .15s;}
.star-pick.on{color:#f4d06f;}
.modal-foot{padding:0 24px 24px;display:flex;gap:10px;}
.btn-save{flex:1;background:var(--g);color:var(--bk);border:none;padding:13px;font-size:13px;font-weight:500;cursor:pointer;border-radius:9px;font-family:'DM Sans',sans-serif;transition:all .2s;}
.btn-save:hover{background:#c5f0d4;}
.btn-cancel{background:none;color:var(--txm);border:1px solid var(--b1);padding:13px 20px;font-size:13px;cursor:pointer;border-radius:9px;font-family:'DM Sans',sans-serif;transition:all .15s;}
.btn-cancel:hover{border-color:var(--b2);color:var(--tx);}
.setup{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;text-align:center;}
.setup-logo{font-family:'DM Serif Display',serif;font-size:52px;color:var(--g);margin-bottom:6px;}
.setup-logo span{color:var(--tx);}
.setup-sub{font-size:15px;color:var(--txm);margin-bottom:40px;font-weight:300;}
.setup-box{background:var(--card);border:1px solid var(--b2);border-radius:18px;padding:36px;width:100%;max-width:480px;}
.setup-box h3{font-family:'DM Serif Display',serif;font-size:24px;margin-bottom:8px;}
.setup-box p{font-size:13px;color:var(--txd);line-height:1.75;margin-bottom:24px;}
.setup-box a{color:var(--g);}
.setup-steps{text-align:left;margin-bottom:24px;}
.setup-step{display:flex;gap:12px;margin-bottom:10px;font-size:13px;color:var(--txm);align-items:flex-start;}
.step-num{width:22px;height:22px;background:var(--gg);border:1px solid var(--b2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--g);flex-shrink:0;margin-top:1px;}
.setup-input{width:100%;background:var(--bk);border:1px solid var(--b2);color:var(--tx);padding:13px 16px;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;border-radius:9px;margin-bottom:12px;transition:border-color .2s;}
.setup-input:focus{border-color:var(--g);}
.setup-input::placeholder{color:var(--txd);}
.err{font-size:12px;color:#f4a0a0;margin-bottom:12px;}
.toast{position:fixed;bottom:32px;right:32px;z-index:999;background:var(--card);border:1px solid var(--b2);border-radius:10px;padding:14px 20px;font-size:13px;color:var(--tx);box-shadow:0 12px 40px rgba(0,0,0,.5);animation:fadeUp .3s ease;display:flex;align-items:center;gap:10px;}
.toast-dot{width:8px;height:8px;border-radius:50%;background:var(--g);}
.loader{display:flex;align-items:center;justify-content:center;padding:80px;gap:8px;}
.loader-dot{width:8px;height:8px;border-radius:50%;background:var(--g);animation:ldot 1.2s ease infinite;}
.loader-dot:nth-child(2){animation-delay:.2s;}
.loader-dot:nth-child(3){animation-delay:.4s;}
@keyframes ldot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}
@media(max-width:768px){
  .nav{padding:0 20px;}
  .hero{padding:100px 20px 50px;}
  .stats{margin:0 20px;}
  .toolbar{padding:20px 20px 0;flex-direction:column;align-items:stretch;}
  .search-wrap{max-width:100%;}
  .grid-wrap{padding:20px 20px 80px;}
  .grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;}
}
`;

export default function App() {
  const [tmdbKey, setTmdbKey] = useState(() => localStorage.getItem(TMDB_KEY_STORAGE) || "");
  const [keyInput, setKeyInput] = useState("");
  const [keyError, setKeyError] = useState("");
  const [showSetup, setShowSetup] = useState(() => !localStorage.getItem(TMDB_KEY_STORAGE));
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("added");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ status: "Want to Watch", rating: null, notes: "" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    db.getAll().then(d => setEntries(d || [])).catch(() => showToast("Could not load entries")).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim() || !tmdbKey) { setResults([]); setShowDrop(false); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`${TMDB_BASE}/search/multi?api_key=${tmdbKey}&query=${encodeURIComponent(search)}`);
        const data = await res.json();
        const f = (data.results || []).filter(r => r.media_type === "movie" || r.media_type === "tv").slice(0, 8);
        setResults(f); setShowDrop(f.length > 0);
      } catch {}
      setSearching(false);
    }, 400);
  }, [search, tmdbKey]);

  useEffect(() => {
    const h = e => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowDrop(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  function getType(r) {
    if (r.media_type === "movie") return "Movie";
    if ((r.genre_ids || []).includes(16)) return "Anime";
    return "TV Show";
  }

  function selectResult(r) {
    const type = getType(r);
    const year = (r.release_date || r.first_air_date || "").split("-")[0];
    setModalData({ title: r.title || r.name, type, year, poster: r.poster_path, tmdb_id: r.id, overview: r.overview });
    setForm({ status: "Want to Watch", rating: null, notes: "" });
    setEditId(null); setShowDrop(false); setSearch(""); setShowModal(true);
  }

  function openEdit(entry) {
    setModalData({ title: entry.title, type: entry.type, year: entry.year, poster: entry.poster, tmdb_id: entry.tmdb_id });
    setForm({ status: entry.status, rating: entry.rating, notes: entry.notes || "" });
    setEditId(entry.id); setShowModal(true);
  }

  function openManual() {
    setModalData({ title: "", type: "Movie", year: "", poster: null, manual: true });
    setForm({ status: "Want to Watch", rating: null, notes: "" });
    setEditId(null); setShowModal(true);
  }

  async function handleSave() {
    const title = modalData.manual ? (modalData.manualTitle || "").trim() : modalData.title;
    if (!title) return;
    setSaving(true);
    try {
      const row = { title, type: modalData.type, year: modalData.year, poster: modalData.poster, tmdb_id: modalData.tmdb_id, ...form };
      if (editId !== null) {
        await db.update(editId, row);
        setEntries(prev => prev.map(e => e.id === editId ? { ...e, ...row } : e));
        showToast("Entry updated!");
      } else {
        const [newRow] = await db.insert(row);
        setEntries(prev => [newRow, ...prev]);
        showToast("Added to catalog!");
      }
      setShowModal(false);
    } catch { showToast("Something went wrong. Try again."); }
    setSaving(false);
  }

  async function handleDelete(id) {
    await db.delete(id);
    setEntries(prev => prev.filter(e => e.id !== id));
    showToast("Removed from catalog");
  }

  async function validateAndSaveKey() {
    setKeyError("");
    const k = keyInput.trim();
    if (!k) return;
    try {
      const res = await fetch(`${TMDB_BASE}/configuration?api_key=${k}`);
      if (!res.ok) throw new Error();
      localStorage.setItem(TMDB_KEY_STORAGE, k);
      setTmdbKey(k); setShowSetup(false);
    } catch { setKeyError("Invalid API key. Please check and try again."); }
  }

  const filtered = entries
    .filter(e => filterType === "All" || e.type === filterType)
    .filter(e => filterStatus === "All" || e.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "year") return (b.year || "0").localeCompare(a.year || "0");
      return 0;
    });

  const counts = {
    Watched: entries.filter(e => e.status === "Watched").length,
    Watching: entries.filter(e => e.status === "Watching").length,
    "Want to Watch": entries.filter(e => e.status === "Want to Watch").length,
  };

  if (showSetup) return (
    <>
      <style>{CSS}</style>
      <div className="setup">
        <div className="setup-logo">Reel<span>log</span></div>
        <p className="setup-sub">Your personal movie, anime & show catalog</p>
        <div className="setup-box">
          <h3>Connect TMDB</h3>
          <p>Get a free API key to search millions of movies, shows & anime with posters automatically.</p>
          <div className="setup-steps">
            <div className="setup-step"><div className="step-num">1</div><span>Go to <a href="https://www.themoviedb.org/signup" target="_blank">themoviedb.org</a> → create a free account</span></div>
            <div className="setup-step"><div className="step-num">2</div><span>Go to <strong>Settings → API → Create → Developer</strong></span></div>
            <div className="setup-step"><div className="step-num">3</div><span>Copy your <strong>API Key (v3 auth)</strong> and paste below</span></div>
          </div>
          <input className="setup-input" placeholder="Paste TMDB API key here..." value={keyInput} onChange={e => setKeyInput(e.target.value)} onKeyDown={e => e.key === "Enter" && validateAndSaveKey()} />
          {keyError && <div className="err">{keyError}</div>}
          <button className="btn-primary" style={{ width: "100%", padding: "13px", fontSize: "14px", borderRadius: "9px", marginBottom: "10px" }} onClick={validateAndSaveKey}>Connect & Continue →</button>
          <button className="btn-ghost" style={{ width: "100%", padding: "12px" }} onClick={() => setShowSetup(false)}>Skip — add titles manually</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <nav className="nav">
        <div className="logo">Reel<span>log</span></div>
        <div className="nav-right">
          <div className="badge">{entries.length} titles</div>
          <button className="btn-primary" onClick={openManual}>+ Add Title</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-tag">Public Catalog</div>
        <h1 className="hero-h1">Every film, show<br />& <em>anime</em> — logged.</h1>
        <p className="hero-p">A shared space to track what's watched, what's next, and everything in between.</p>
      </section>

      <div className="stats">
        {Object.entries(counts).map(([s, c]) => (
          <div key={s} className={`stat${filterStatus === s ? " active" : ""}`} onClick={() => setFilterStatus(filterStatus === s ? "All" : s)}>
            <div className="stat-n" style={{ color: STATUS_COLOR[s] }}>{c}</div>
            <div className="stat-l">{s}</div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <div className="search-wrap" ref={searchRef}>
          <span className="search-icon">⌕</span>
          <input className="search-input"
            placeholder={tmdbKey ? "Search any movie, anime or show..." : "Connect TMDB to search, or add manually"}
            value={search} onChange={e => setSearch(e.target.value)}
            onFocus={() => results.length && setShowDrop(true)} disabled={!tmdbKey} />
          {searching && <span className="spin">◌</span>}
          {showDrop && (
            <div className="dropdown">
              {results.map(r => (
                <div key={r.id} className="drop-item" onClick={() => selectResult(r)}>
                  {r.poster_path
                    ? <img className="drop-poster" src={`${TMDB_IMAGE}${r.poster_path}`} alt="" />
                    : <div className="drop-poster" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🎬</div>}
                  <div className="drop-info">
                    <div className="drop-title">{r.title || r.name}</div>
                    <div className="drop-meta">{(r.release_date || r.first_air_date || "").split("-")[0]} · ★ {r.vote_average?.toFixed(1)}</div>
                  </div>
                  <div className="drop-badge">{getType(r)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="filters">
          {FILTERS.map(f => <button key={f} className={`f-btn${filterType === f ? " on" : ""}`} onClick={() => setFilterType(f)}>{f}</button>)}
        </div>
        <select className="sort-sel" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="added">Recently Added</option>
          <option value="title">Title A–Z</option>
          <option value="rating">Top Rated</option>
          <option value="year">Newest First</option>
        </select>
      </div>

      <div className="grid-wrap">
        {loading ? (
          <div className="loader"><div className="loader-dot" /><div className="loader-dot" /><div className="loader-dot" /></div>
        ) : (
          <div className="grid">
            {filtered.length === 0 && <div className="empty"><div className="empty-icon">🎬</div><div>No titles yet — add something!</div></div>}
            {filtered.map((entry, i) => (
              <div key={entry.id} className="card" style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}>
                <div className="card-img-wrap">
                  {entry.poster
                    ? <img className="card-img" src={`${TMDB_IMAGE}${entry.poster}`} alt={entry.title} loading="lazy" />
                    : <div className="no-poster"><div className="no-poster-icon">{entry.type === "Anime" ? "⛩" : entry.type === "Movie" ? "🎬" : "📺"}</div><span>{entry.type}</span></div>}
                  <div className="card-overlay" />
                  <div className="card-status" style={{ color: STATUS_COLOR[entry.status], borderColor: STATUS_COLOR[entry.status] + "44" }}>
                    {STATUS_ICON[entry.status]} {entry.status}
                  </div>
                  <div className="card-btns">
                    <button className="card-btn" onClick={e => { e.stopPropagation(); openEdit(entry); }}>✎</button>
                    <button className="card-btn" onClick={e => { e.stopPropagation(); handleDelete(entry.id); }}>✕</button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-title">{entry.title}</div>
                  <div className="card-row">
                    <span className="card-type">{entry.type}</span>
                    <span className="card-year">{entry.year}</span>
                  </div>
                  {entry.rating > 0 && (
                    <div className="stars">{[1,2,3,4,5].map(s => <span key={s} className={`star${entry.rating >= s ? " on" : ""}`}>★</span>)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && modalData && (
        <div className="backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-head">
              {modalData.poster
                ? <img className="modal-poster" src={`${TMDB_IMAGE}${modalData.poster}`} alt="" />
                : <div className="modal-poster" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: "var(--txd)" }}>🎬</div>}
              <div className="modal-info">
                {modalData.manual
                  ? <input className="field-input" placeholder="Enter title..." value={modalData.manualTitle || ""} onChange={e => setModalData(d => ({ ...d, manualTitle: e.target.value }))} style={{ marginBottom: 8 }} />
                  : <div className="modal-title">{modalData.title}</div>}
                <div className="modal-sub">{modalData.type}{modalData.year ? ` · ${modalData.year}` : ""}</div>
                {modalData.overview && <div className="modal-overview">"{modalData.overview.slice(0, 110)}..."</div>}
              </div>
            </div>
            <div className="modal-body">
              {modalData.manual && (
                <div className="field-row" style={{ marginBottom: 18 }}>
                  <div className="field">
                    <label className="field-lbl">Type</label>
                    <select className="field-select" value={modalData.type} onChange={e => setModalData(d => ({ ...d, type: e.target.value }))}>
                      {["Movie", "Anime", "TV Show"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-lbl">Year</label>
                    <input className="field-input" placeholder="2024" value={modalData.year || ""} onChange={e => setModalData(d => ({ ...d, year: e.target.value }))} />
                  </div>
                </div>
              )}
              <div className="field">
                <label className="field-lbl">Status</label>
                <div className="pills">
                  {STATUSES.map(s => (
                    <button key={s} className={`pill${form.status === s ? " on" : ""}`}
                      style={form.status === s ? { background: STATUS_COLOR[s] + "22", borderColor: STATUS_COLOR[s], color: STATUS_COLOR[s] } : {}}
                      onClick={() => setForm(f => ({ ...f, status: s }))}>
                      {STATUS_ICON[s]} {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="field-lbl">Your Rating</label>
                <div className="star-row">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`star-pick${form.rating >= s ? " on" : ""}`}
                      onClick={() => setForm(f => ({ ...f, rating: f.rating === s ? null : s }))}>★</span>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="field-lbl">Notes</label>
                <textarea className="field-ta" placeholder="Your thoughts..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editId !== null ? "Save Changes" : "Add to Catalog"}</button>
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast"><div className="toast-dot" />{toast}</div>}
    </>
  );
}

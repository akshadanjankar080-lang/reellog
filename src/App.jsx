import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE ────────────────────────────────────────────────
const supabase = createClient(
  "https://maoiguhrcvpxvmgztmqq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hb2lndWhyY3ZweHZtZ3p0bXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzE0NTcsImV4cCI6MjA4OTkwNzQ1N30.Jz1JhnSaTo1z0XYnb4rzbpmG90ceawHx6APkT0gNGI8"
);

// ─── TMDB ────────────────────────────────────────────────────
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_KEY_LS = "rl_tmdb";

// ─── CONSTANTS ───────────────────────────────────────────────
const STATUSES = ["Want to Watch", "Watching", "Watched"];
const SCOLOR = { Watched: "#a8e6bc", Watching: "#f4d06f", "Want to Watch": "#8ebbf5" };
const SICON  = { Watched: "✓", Watching: "▶", "Want to Watch": "◎" };
const PAGES  = ["explore", "mylist", "auth"];

// ─── GLOBAL CSS ──────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=DM+Serif+Display:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --g:#a8e6bc;--gd:#5db87a;--gg:rgba(168,230,188,.12);
  --bk:#07090a;--c1:#0e1210;--c2:#131a14;
  --b1:rgba(168,230,188,.07);--b2:rgba(168,230,188,.16);--b3:rgba(168,230,188,.3);
  --tx:#deeee4;--txd:#3d5445;--txm:#7a9e86;
  --red:#f47070;
}
html{scroll-behavior:smooth;}
body{background:var(--bk);color:var(--tx);font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-thumb{background:var(--gd);border-radius:2px;}
button{cursor:pointer;font-family:'DM Sans',sans-serif;}
input,select,textarea{font-family:'DM Sans',sans-serif;}
a{color:inherit;text-decoration:none;}

/* ── NAV ── */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:200;
  height:60px;display:flex;align-items:center;justify-content:space-between;
  padding:0 40px;
  background:rgba(7,9,10,.9);backdrop-filter:blur(20px);
  border-bottom:1px solid var(--b1);
}
.nav-logo{
  font-family:'Bebas Neue',sans-serif;
  font-size:26px;letter-spacing:2px;color:var(--g);
  display:flex;align-items:center;gap:6px;
}
.nav-logo span{color:var(--tx);}
.nav-logo-dot{width:6px;height:6px;border-radius:50%;background:var(--g);margin-bottom:2px;}
.nav-links{display:flex;align-items:center;gap:4px;}
.nav-link{
  padding:7px 14px;font-size:13px;color:var(--txm);
  background:none;border:none;border-radius:6px;
  transition:all .15s;letter-spacing:.3px;
}
.nav-link:hover{color:var(--tx);background:var(--b1);}
.nav-link.active{color:var(--g);background:var(--gg);}
.nav-right{display:flex;align-items:center;gap:10px;}
.nav-user{font-size:12px;color:var(--txd);letter-spacing:.5px;}
.btn-sm{
  padding:7px 16px;font-size:12px;font-weight:500;border:none;border-radius:6px;
  transition:all .2s;letter-spacing:.3px;
}
.btn-outline{background:none;border:1px solid var(--b2);color:var(--txm);}
.btn-outline:hover{border-color:var(--g);color:var(--g);}
.btn-green{background:var(--g);color:var(--bk);}
.btn-green:hover{background:#c0f0ce;transform:translateY(-1px);}

/* ── HERO ── */
.hero{
  padding:120px 40px 60px;
  position:relative;overflow:hidden;
}
.hero-bg{
  position:absolute;inset:0;
  background:
    radial-gradient(ellipse 60% 50% at 80% 30%,rgba(168,230,188,.04) 0%,transparent 70%),
    radial-gradient(ellipse 40% 40% at 20% 70%,rgba(168,230,188,.03) 0%,transparent 60%);
  pointer-events:none;
}
.hero-eyebrow{
  display:inline-flex;align-items:center;gap:8px;
  background:var(--gg);border:1px solid var(--b2);
  padding:5px 14px;border-radius:20px;
  font-size:11px;color:var(--g);letter-spacing:3px;text-transform:uppercase;
  margin-bottom:20px;animation:up .5s ease both;
}
.hero-eyebrow::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--g);animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
.hero-h1{
  font-family:'DM Serif Display',serif;
  font-size:clamp(36px,5.5vw,68px);
  line-height:1.06;margin-bottom:14px;
  animation:up .5s .08s ease both;
}
.hero-h1 em{color:var(--g);font-style:italic;}
.hero-p{
  font-size:15px;color:var(--txm);max-width:440px;
  line-height:1.8;font-weight:300;
  animation:up .5s .16s ease both;
}
.hero-actions{
  display:flex;gap:12px;margin-top:28px;flex-wrap:wrap;
  animation:up .5s .24s ease both;
}
.btn-lg{padding:12px 28px;font-size:14px;font-weight:500;border-radius:8px;border:none;transition:all .2s;}
.btn-lg-green{background:var(--g);color:var(--bk);}
.btn-lg-green:hover{background:#c0f0ce;transform:translateY(-2px);box-shadow:0 8px 24px rgba(168,230,188,.25);}
.btn-lg-ghost{background:none;border:1px solid var(--b2);color:var(--txm);}
.btn-lg-ghost:hover{border-color:var(--b2);color:var(--tx);background:var(--b1);}
@keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

/* ── STATS STRIP ── */
.stats-strip{
  display:flex;margin:0 40px;
  border:1px solid var(--b1);border-radius:12px;overflow:hidden;
  animation:up .5s .3s ease both;
}
.stat-chip{
  flex:1;padding:18px 24px;
  border-right:1px solid var(--b1);
  cursor:pointer;transition:background .2s;
  position:relative;overflow:hidden;
}
.stat-chip:last-child{border-right:none;}
.stat-chip:hover{background:rgba(168,230,188,.03);}
.stat-chip.on{background:rgba(168,230,188,.06);}
.stat-chip.on::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--g);}
.stat-n{font-family:'DM Serif Display',serif;font-size:30px;line-height:1;}
.stat-l{font-size:10px;color:var(--txd);letter-spacing:2.5px;text-transform:uppercase;margin-top:4px;}

/* ── TOOLBAR ── */
.toolbar{
  padding:24px 40px 0;
  display:flex;align-items:center;gap:16px;flex-wrap:wrap;
}
.search-wrap{position:relative;flex:1;max-width:520px;}
.search-inp{
  width:100%;background:var(--c1);border:1px solid var(--b2);
  color:var(--tx);padding:12px 18px 12px 46px;
  font-size:13px;outline:none;border-radius:9px;
  transition:all .2s;
}
.search-inp:focus{border-color:var(--g);box-shadow:0 0 0 3px rgba(168,230,188,.08);}
.search-inp::placeholder{color:var(--txd);}
.search-ico{position:absolute;left:15px;top:50%;transform:translateY(-50%);color:var(--txd);font-size:16px;pointer-events:none;}
.spin-ico{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:var(--g);animation:spinning 1s linear infinite;}
@keyframes spinning{to{transform:translateY(-50%) rotate(360deg)}}
.drop{
  position:absolute;top:calc(100% + 6px);left:0;right:0;
  background:var(--c1);border:1px solid var(--b2);border-radius:10px;
  overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.6);
  max-height:380px;overflow-y:auto;z-index:300;
  animation:dropIn .15s ease;
}
@keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
.drop-row{
  display:flex;align-items:center;gap:12px;padding:10px 14px;
  cursor:pointer;transition:background .15s;
  border-bottom:1px solid rgba(168,230,188,.04);
}
.drop-row:last-child{border-bottom:none;}
.drop-row:hover{background:rgba(168,230,188,.07);}
.drop-img{width:38px;height:54px;object-fit:cover;border-radius:4px;background:var(--c2);flex-shrink:0;}
.drop-ti{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.drop-me{font-size:11px;color:var(--txd);margin-top:2px;}
.drop-tag{font-size:10px;padding:2px 8px;background:var(--gg);color:var(--g);border:1px solid var(--b2);border-radius:4px;text-transform:uppercase;letter-spacing:1px;flex-shrink:0;}
.fil-row{display:flex;gap:6px;flex-wrap:wrap;}
.fil-btn{background:var(--c1);border:1px solid var(--b1);color:var(--txm);padding:7px 14px;font-size:12px;border-radius:20px;transition:all .15s;letter-spacing:.2px;}
.fil-btn:hover{border-color:var(--b2);color:var(--tx);}
.fil-btn.on{background:var(--g);color:var(--bk);border-color:var(--g);font-weight:500;}
.sort-sel{background:var(--c1);border:1px solid var(--b1);color:var(--txm);padding:8px 12px;font-size:12px;outline:none;border-radius:7px;margin-left:auto;}

/* ── GRID ── */
.grid-wrap{padding:24px 40px 100px;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:18px;}
.no-data{grid-column:1/-1;text-align:center;padding:80px 0;color:var(--txd);}
.no-data-icon{font-size:48px;margin-bottom:12px;opacity:.2;}

/* ── CARD ── */
.card{
  background:var(--c1);border:1px solid var(--b1);border-radius:12px;
  overflow:hidden;cursor:pointer;position:relative;
  transition:all .25s cubic-bezier(.34,1.56,.64,1);
  animation:up .4s ease both;
}
.card:hover{transform:translateY(-6px) scale(1.022);border-color:var(--b2);box-shadow:0 20px 44px rgba(0,0,0,.5),0 0 0 1px rgba(168,230,188,.07);}
.card-img-box{position:relative;aspect-ratio:2/3;overflow:hidden;background:var(--c2);}
.card-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease;}
.card:hover .card-img{transform:scale(1.05);}
.card-no-img{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--txd);gap:6px;font-size:11px;}
.card-no-icon{font-size:32px;opacity:.2;}
.card-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(7,9,10,.97) 0%,rgba(7,9,10,.3) 45%,transparent 100%);}
.card-status-tag{
  position:absolute;top:8px;right:8px;
  font-size:9px;letter-spacing:1px;padding:3px 9px;border-radius:20px;
  backdrop-filter:blur(10px);background:rgba(7,9,10,.75);border:1px solid;
  text-transform:uppercase;font-weight:500;
}
.card-owner{
  position:absolute;bottom:8px;left:8px;
  font-size:10px;color:rgba(255,255,255,.4);letter-spacing:.5px;
}
.card-btns{
  position:absolute;top:8px;left:8px;display:flex;gap:5px;
  opacity:0;transition:opacity .2s;
}
.card:hover .card-btns{opacity:1;}
.card-btn{
  width:28px;height:28px;background:rgba(7,9,10,.85);
  backdrop-filter:blur(8px);border:1px solid var(--b2);
  border-radius:6px;color:var(--tx);font-size:12px;
  display:flex;align-items:center;justify-content:center;
  transition:all .15s;
}
.card-btn:hover{background:var(--gg);border-color:var(--g);color:var(--g);}
.card-body{padding:12px;}
.card-title{font-size:13px;font-weight:500;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px;}
.card-meta-row{display:flex;align-items:center;justify-content:space-between;}
.card-type{font-size:10px;color:var(--txd);letter-spacing:1px;text-transform:uppercase;}
.card-year{font-size:11px;color:var(--txd);}
.card-stars{display:flex;gap:2px;margin-top:6px;}
.s{font-size:11px;color:var(--b2);}
.s.on{color:#f4d06f;}

/* ── MODAL ── */
.backdrop{
  position:fixed;inset:0;z-index:400;
  background:rgba(0,0,0,.82);backdrop-filter:blur(12px);
  display:flex;align-items:center;justify-content:center;padding:20px;
  animation:bkin .2s ease;
}
@keyframes bkin{from{opacity:0}to{opacity:1}}
.modal{
  background:var(--c1);border:1px solid var(--b2);border-radius:16px;
  width:100%;max-width:480px;max-height:92vh;overflow-y:auto;
  animation:mkin .25s cubic-bezier(.34,1.56,.64,1);
}
@keyframes mkin{from{opacity:0;transform:scale(.92) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
.modal-head{padding:22px 22px 0;display:flex;align-items:flex-start;gap:14px;}
.modal-poster{width:66px;height:96px;object-fit:cover;border-radius:8px;background:var(--c2);flex-shrink:0;}
.modal-ti{font-family:'DM Serif Display',serif;font-size:20px;line-height:1.2;margin-bottom:3px;}
.modal-sub{font-size:12px;color:var(--txd);}
.modal-ov{font-size:12px;color:var(--txd);margin-top:6px;line-height:1.6;font-style:italic;}
.modal-body{padding:20px 22px;}
.field{margin-bottom:16px;}
.flbl{font-size:10px;letter-spacing:2.5px;color:var(--txd);text-transform:uppercase;margin-bottom:7px;display:block;}
.finp,.fsel,.fta{
  width:100%;background:var(--bk);border:1px solid var(--b2);
  color:var(--tx);padding:10px 13px;font-size:13px;
  outline:none;border-radius:8px;transition:border-color .2s;
}
.finp:focus,.fsel:focus,.fta:focus{border-color:var(--g);}
.finp::placeholder,.fta::placeholder{color:var(--txd);}
.fta{resize:vertical;min-height:72px;}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.pills{display:flex;gap:7px;flex-wrap:wrap;}
.pill{
  padding:7px 13px;border-radius:20px;font-size:12px;
  border:1px solid var(--b1);color:var(--txd);background:var(--bk);
  transition:all .15s;
}
.pill.on{font-weight:500;}
.str-row{display:flex;gap:5px;}
.str{font-size:26px;color:var(--b2);transition:color .15s;}
.str.on{color:#f4d06f;}
.modal-foot{padding:0 22px 22px;display:flex;gap:8px;}
.btn-save{flex:1;background:var(--g);color:var(--bk);border:none;padding:12px;font-size:13px;font-weight:500;border-radius:8px;transition:all .2s;}
.btn-save:hover{background:#c0f0ce;}
.btn-save:disabled{opacity:.5;cursor:not-allowed;}
.btn-cxl{background:none;color:var(--txm);border:1px solid var(--b1);padding:12px 18px;font-size:13px;border-radius:8px;transition:all .15s;}
.btn-cxl:hover{border-color:var(--b2);color:var(--tx);}

/* ── AUTH MODAL ── */
.auth-modal{
  background:var(--c1);border:1px solid var(--b2);border-radius:18px;
  width:100%;max-width:420px;padding:36px;
  animation:mkin .25s cubic-bezier(.34,1.56,.64,1);
}
.auth-logo{font-family:'Bebas Neue',sans-serif;font-size:32px;color:var(--g);letter-spacing:2px;margin-bottom:4px;text-align:center;}
.auth-logo span{color:var(--tx);}
.auth-sub{font-size:13px;color:var(--txd);text-align:center;margin-bottom:28px;}
.auth-tabs{display:flex;border:1px solid var(--b1);border-radius:8px;overflow:hidden;margin-bottom:24px;}
.auth-tab{flex:1;padding:10px;font-size:13px;background:none;border:none;color:var(--txm);transition:all .15s;}
.auth-tab.on{background:var(--gg);color:var(--g);}
.auth-inp{width:100%;background:var(--bk);border:1px solid var(--b2);color:var(--tx);padding:12px 14px;font-size:13px;outline:none;border-radius:8px;margin-bottom:10px;transition:border-color .2s;}
.auth-inp:focus{border-color:var(--g);}
.auth-inp::placeholder{color:var(--txd);}
.auth-btn{width:100%;background:var(--g);color:var(--bk);border:none;padding:13px;font-size:14px;font-weight:500;border-radius:8px;transition:all .2s;margin-top:6px;}
.auth-btn:hover{background:#c0f0ce;}
.auth-btn:disabled{opacity:.5;cursor:not-allowed;}
.auth-err{font-size:12px;color:var(--red);margin-bottom:10px;padding:10px 12px;background:rgba(244,112,112,.08);border:1px solid rgba(244,112,112,.2);border-radius:6px;}
.auth-msg{font-size:12px;color:var(--g);margin-bottom:10px;padding:10px 12px;background:var(--gg);border:1px solid var(--b2);border-radius:6px;text-align:center;}

/* ── TOAST ── */
.toast{
  position:fixed;bottom:28px;right:28px;z-index:999;
  background:var(--c1);border:1px solid var(--b2);border-radius:9px;
  padding:12px 18px;font-size:13px;
  box-shadow:0 12px 40px rgba(0,0,0,.5);
  display:flex;align-items:center;gap:10px;
  animation:up .3s ease;
}
.toast-dot{width:7px;height:7px;border-radius:50%;background:var(--g);}

/* ── LOADER ── */
.loader{display:flex;align-items:center;justify-content:center;padding:80px;gap:7px;}
.ldot{width:7px;height:7px;border-radius:50%;background:var(--g);animation:ld 1.2s ease infinite;}
.ldot:nth-child(2){animation-delay:.2s;}
.ldot:nth-child(3){animation-delay:.4s;}
@keyframes ld{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}

/* ── TMDB SETUP ── */
.setup{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px;}
.setup-box{background:var(--c1);border:1px solid var(--b2);border-radius:18px;padding:40px;width:100%;max-width:460px;text-align:center;}
.setup-logo{font-family:'Bebas Neue',sans-serif;font-size:42px;color:var(--g);letter-spacing:2px;margin-bottom:6px;}
.setup-logo span{color:var(--tx);}
.setup-desc{font-size:13px;color:var(--txd);line-height:1.75;margin-bottom:24px;}
.setup-steps{text-align:left;margin-bottom:22px;}
.setup-step{display:flex;gap:10px;margin-bottom:9px;font-size:13px;color:var(--txm);align-items:flex-start;}
.snum{width:20px;height:20px;background:var(--gg);border:1px solid var(--b2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--g);flex-shrink:0;margin-top:1px;}
.setup-inp{width:100%;background:var(--bk);border:1px solid var(--b2);color:var(--tx);padding:12px 14px;font-size:14px;outline:none;border-radius:8px;margin-bottom:10px;transition:border-color .2s;}
.setup-inp:focus{border-color:var(--g);}
.setup-inp::placeholder{color:var(--txd);}
.setup-err{font-size:12px;color:var(--red);margin-bottom:10px;}

/* ── SECTION LABEL ── */
.section-label{
  padding:16px 40px 12px;
  display:flex;align-items:center;justify-content:space-between;
}
.section-title{font-family:'DM Serif Display',serif;font-size:20px;}
.section-sub{font-size:12px;color:var(--txd);}

/* ── EMPTY STATE ── */
.empty-state{
  grid-column:1/-1;
  display:flex;flex-direction:column;align-items:center;
  padding:80px 20px;gap:12px;
}
.empty-icon{font-size:56px;opacity:.15;}
.empty-title{font-size:15px;color:var(--txd);}
.empty-sub{font-size:13px;color:var(--txd);opacity:.6;}

@media(max-width:700px){
  .nav{padding:0 18px;}
  .hero{padding:90px 18px 48px;}
  .stats-strip{margin:0 18px;}
  .toolbar{padding:18px 18px 0;}
  .grid-wrap{padding:18px 18px 80px;}
  .grid{grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;}
  .section-label{padding:14px 18px 10px;}
}
`;

// ─── MAIN APP ────────────────────────────────────────────────
export default function App() {
  const [tmdbKey, setTmdbKey]   = useState(() => localStorage.getItem(TMDB_KEY_LS) || "");
  const [showSetup, setShowSetup] = useState(() => !localStorage.getItem(TMDB_KEY_LS));
  const [keyInput, setKeyInput] = useState("");
  const [keyErr, setKeyErr]     = useState("");

  const [session, setSession]   = useState(null);
  const [page, setPage]         = useState("explore"); // explore | mylist | auth
  const [showAuth, setShowAuth] = useState(false);

  const [allEntries, setAllEntries]   = useState([]);
  const [myEntries, setMyEntries]     = useState([]);
  const [loading, setLoading]         = useState(true);

  const [filterType, setFilterType]   = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy]           = useState("added");
  const [search, setSearch]           = useState("");
  const [results, setResults]         = useState([]);
  const [searching, setSearching]     = useState(false);
  const [showDrop, setShowDrop]       = useState(false);

  const [showModal, setShowModal]     = useState(false);
  const [modalData, setModalData]     = useState(null);
  const [editId, setEditId]           = useState(null);
  const [form, setForm]               = useState({ status: "Want to Watch", rating: null, notes: "" });
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState(null);

  const searchRef  = useRef(null);
  const debRef     = useRef(null);

  // ── Auth listener ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) { setShowAuth(false); setPage("mylist"); }
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Load all entries (public explore) ──
  useEffect(() => {
    supabase.from("entries").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setAllEntries(data || []))
      .finally(() => setLoading(false));
  }, []);

  // ── Load my entries ──
  useEffect(() => {
    if (!session) return;
    supabase.from("entries").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false })
      .then(({ data }) => setMyEntries(data || []));
  }, [session]);

  // ── TMDB search ──
  useEffect(() => {
    if (!search.trim() || !tmdbKey) { setResults([]); setShowDrop(false); return; }
    clearTimeout(debRef.current);
    debRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await fetch(`${TMDB_BASE}/search/multi?api_key=${tmdbKey}&query=${encodeURIComponent(search)}`);
        const d = await r.json();
        const f = (d.results || []).filter(x => x.media_type === "movie" || x.media_type === "tv").slice(0, 8);
        setResults(f); setShowDrop(f.length > 0);
      } catch {}
      setSearching(false);
    }, 380);
  }, [search, tmdbKey]);

  // ── Close dropdown outside ──
  useEffect(() => {
    const h = e => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowDrop(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function showT(msg) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  function getType(r) {
    if (r.media_type === "movie") return "Movie";
    if ((r.genre_ids || []).includes(16)) return "Anime";
    return "TV Show";
  }

  function selectResult(r) {
    if (!session) { setShowAuth(true); return; }
    const type = getType(r);
    const year = (r.release_date || r.first_air_date || "").split("-")[0];
    setModalData({ title: r.title || r.name, type, year, poster: r.poster_path, tmdb_id: r.id, overview: r.overview });
    setForm({ status: "Want to Watch", rating: null, notes: "" });
    setEditId(null); setShowDrop(false); setSearch(""); setShowModal(true);
  }

  function openManual() {
    if (!session) { setShowAuth(true); return; }
    setModalData({ title: "", type: "Movie", year: "", poster: null, manual: true });
    setForm({ status: "Want to Watch", rating: null, notes: "" });
    setEditId(null); setShowModal(true);
  }

  function openEdit(entry) {
    setModalData({ title: entry.title, type: entry.type, year: entry.year, poster: entry.poster, tmdb_id: entry.tmdb_id });
    setForm({ status: entry.status, rating: entry.rating, notes: entry.notes || "" });
    setEditId(entry.id); setShowModal(true);
  }

  async function handleSave() {
    const title = modalData.manual ? (modalData.manualTitle || "").trim() : modalData.title;
    if (!title || !session) return;
    setSaving(true);
    try {
      const row = {
        title, type: modalData.type, year: modalData.year,
        poster: modalData.poster, tmdb_id: modalData.tmdb_id,
        user_id: session.user.id,
        user_name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
        ...form
      };
      if (editId !== null) {
        const { data } = await supabase.from("entries").update(row).eq("id", editId).select();
        const updated = data[0];
        setAllEntries(p => p.map(e => e.id === editId ? updated : e));
        setMyEntries(p => p.map(e => e.id === editId ? updated : e));
        showT("Updated!");
      } else {
        const { data } = await supabase.from("entries").insert(row).select();
        const newRow = data[0];
        setAllEntries(p => [newRow, ...p]);
        setMyEntries(p => [newRow, ...p]);
        showT("Added to catalog!");
      }
      setShowModal(false);
    } catch { showT("Something went wrong."); }
    setSaving(false);
  }

  async function handleDelete(id) {
    await supabase.from("entries").delete().eq("id", id);
    setAllEntries(p => p.filter(e => e.id !== id));
    setMyEntries(p => p.filter(e => e.id !== id));
    showT("Removed.");
  }

  async function validateKey() {
    setKeyErr("");
    const k = keyInput.trim(); if (!k) return;
    try {
      const r = await fetch(`${TMDB_BASE}/configuration?api_key=${k}`);
      if (!r.ok) throw new Error();
      localStorage.setItem(TMDB_KEY_LS, k);
      setTmdbKey(k); setShowSetup(false);
    } catch { setKeyErr("Invalid API key. Please check and try again."); }
  }

  // ── Which entries to show ──
  const source = page === "mylist" ? myEntries : allEntries;
  const filtered = source
    .filter(e => filterType === "All" || e.type === filterType)
    .filter(e => filterStatus === "All" || e.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "year") return (b.year || "0").localeCompare(a.year || "0");
      return 0;
    });

  const counts = {
    Watched: source.filter(e => e.status === "Watched").length,
    Watching: source.filter(e => e.status === "Watching").length,
    "Want to Watch": source.filter(e => e.status === "Want to Watch").length,
  };

  // ── TMDB SETUP SCREEN ──
  if (showSetup) return (
    <>
      <style>{CSS}</style>
      <div className="setup">
        <div className="setup-box">
          <div className="setup-logo">Reel<span>log</span></div>
          <p className="setup-desc">Connect a free TMDB API key to search millions of movies, anime & shows with real posters.</p>
          <div className="setup-steps">
            <div className="setup-step"><div className="snum">1</div><span>Go to <a href="https://www.themoviedb.org/signup" target="_blank" style={{color:"var(--g)"}}>themoviedb.org</a> → create free account</span></div>
            <div className="setup-step"><div className="snum">2</div><span>Settings → API → Create → Developer</span></div>
            <div className="setup-step"><div className="snum">3</div><span>Copy your <strong>API Key (v3 auth)</strong> and paste below</span></div>
          </div>
          <input className="setup-inp" placeholder="Paste your TMDB API key..." value={keyInput} onChange={e => setKeyInput(e.target.value)} onKeyDown={e => e.key === "Enter" && validateKey()} />
          {keyErr && <div className="setup-err">{keyErr}</div>}
          <button className="auth-btn" onClick={validateKey} style={{marginBottom:10}}>Connect & Continue →</button>
          <button className="btn-lg btn-lg-ghost" style={{width:"100%",borderRadius:8}} onClick={() => setShowSetup(false)}>Skip — I'll add titles manually</button>
        </div>
      </div>
    </>
  );

  // ── MAIN RENDER ──
  return (
    <>
      <style>{CSS}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => setPage("explore")} style={{cursor:"pointer"}}>
          <div className="nav-logo-dot" />
          Reel<span>log</span>
        </div>
        <div className="nav-links">
          <button className={`nav-link${page === "explore" ? " active" : ""}`} onClick={() => setPage("explore")}>Explore</button>
          {session && <button className={`nav-link${page === "mylist" ? " active" : ""}`} onClick={() => setPage("mylist")}>My List</button>}
        </div>
        <div className="nav-right">
          {session ? (
            <>
              <span className="nav-user">{session.user.email?.split("@")[0]}</span>
              <button className="btn-sm btn-outline" onClick={() => { supabase.auth.signOut(); setPage("explore"); }}>Sign out</button>
              <button className="btn-sm btn-green" onClick={openManual}>+ Add</button>
            </>
          ) : (
            <>
              <button className="btn-sm btn-outline" onClick={() => setShowAuth(true)}>Sign in</button>
              <button className="btn-sm btn-green" onClick={() => setShowAuth(true)}>Join free</button>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO (explore only) ── */}
      {page === "explore" && (
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-eyebrow">Public Catalog</div>
          <h1 className="hero-h1">Track every film,<br />show & <em>anime.</em></h1>
          <p className="hero-p">A public space where everyone logs what they've watched, what they're watching, and what's next.</p>
          <div className="hero-actions">
            {!session && <button className="btn-lg btn-lg-green" onClick={() => setShowAuth(true)}>Start your list →</button>}
            {session && <button className="btn-lg btn-lg-green" onClick={openManual}>+ Add title</button>}
            <button className="btn-lg btn-lg-ghost" onClick={() => { setFilterType("Anime"); setPage("explore"); }}>Browse Anime</button>
          </div>
        </section>
      )}

      {/* ── MY LIST HEADER ── */}
      {page === "mylist" && (
        <div style={{padding:"100px 40px 32px"}}>
          <div style={{fontSize:11,letterSpacing:3,color:"var(--txd)",textTransform:"uppercase",marginBottom:8}}>Your collection</div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(32px,4vw,52px)",lineHeight:1.1}}>My <em style={{color:"var(--g)",fontStyle:"italic"}}>List</em></div>
          <div style={{fontSize:13,color:"var(--txd)",marginTop:8}}>{myEntries.length} titles catalogued</div>
        </div>
      )}

      {/* ── STATS STRIP ── */}
      <div className="stats-strip">
        {Object.entries(counts).map(([s, c]) => (
          <div key={s} className={`stat-chip${filterStatus === s ? " on" : ""}`} onClick={() => setFilterStatus(filterStatus === s ? "All" : s)}>
            <div className="stat-n" style={{color: SCOLOR[s]}}>{c}</div>
            <div className="stat-l">{s}</div>
          </div>
        ))}
      </div>

      {/* ── TOOLBAR ── */}
      <div className="toolbar">
        <div className="search-wrap" ref={searchRef}>
          <span className="search-ico">⌕</span>
          <input className="search-inp"
            placeholder={tmdbKey ? "Search movies, anime, shows from TMDB..." : "Add titles manually or connect TMDB"}
            value={search} onChange={e => setSearch(e.target.value)}
            onFocus={() => results.length && setShowDrop(true)}
            disabled={!tmdbKey}
          />
          {searching && <span className="spin-ico">◌</span>}
          {showDrop && (
            <div className="drop">
              {results.map(r => (
                <div key={r.id} className="drop-row" onClick={() => selectResult(r)}>
                  {r.poster_path
                    ? <img className="drop-img" src={`${TMDB_IMG}${r.poster_path}`} alt="" />
                    : <div className="drop-img" style={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🎬</div>}
                  <div style={{flex:1,minWidth:0}}>
                    <div className="drop-ti">{r.title || r.name}</div>
                    <div className="drop-me">{(r.release_date || r.first_air_date || "").split("-")[0]} · ★ {r.vote_average?.toFixed(1)}</div>
                  </div>
                  <div className="drop-tag">{getType(r)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="fil-row">
          {["All","Movie","TV Show","Anime"].map(f => (
            <button key={f} className={`fil-btn${filterType === f ? " on" : ""}`} onClick={() => setFilterType(f)}>{f}</button>
          ))}
        </div>
        <select className="sort-sel" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="added">Recently Added</option>
          <option value="title">Title A–Z</option>
          <option value="rating">Top Rated</option>
          <option value="year">Newest</option>
        </select>
      </div>

      {/* ── GRID ── */}
      <div className="grid-wrap">
        {loading ? (
          <div className="loader"><div className="ldot"/><div className="ldot"/><div className="ldot"/></div>
        ) : (
          <div className="grid">
            {filtered.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🎬</div>
                <div className="empty-title">{page === "mylist" ? "Your list is empty" : "Nothing here yet"}</div>
                <div className="empty-sub">{page === "mylist" ? "Search for a title and add it!" : "Be the first to add something"}</div>
                {page === "mylist" && <button className="btn-sm btn-green" style={{marginTop:8}} onClick={openManual}>+ Add title</button>}
              </div>
            )}
            {filtered.map((entry, i) => (
              <div key={entry.id} className="card" style={{animationDelay:`${Math.min(i*.04,.4)}s`}}>
                <div className="card-img-box">
                  {entry.poster
                    ? <img className="card-img" src={`${TMDB_IMG}${entry.poster}`} alt={entry.title} loading="lazy" />
                    : <div className="card-no-img"><div className="card-no-icon">{entry.type==="Anime"?"⛩":entry.type==="Movie"?"🎬":"📺"}</div><span>{entry.type}</span></div>}
                  <div className="card-grad" />
                  <div className="card-status-tag" style={{color:SCOLOR[entry.status],borderColor:SCOLOR[entry.status]+"44"}}>
                    {SICON[entry.status]} {entry.status}
                  </div>
                  {page === "explore" && entry.user_name && (
                    <div className="card-owner">by {entry.user_name}</div>
                  )}
                  {session && entry.user_id === session.user.id && (
                    <div className="card-btns">
                      <button className="card-btn" onClick={e=>{e.stopPropagation();openEdit(entry);}}>✎</button>
                      <button className="card-btn" onClick={e=>{e.stopPropagation();handleDelete(entry.id);}}>✕</button>
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <div className="card-title">{entry.title}</div>
                  <div className="card-meta-row">
                    <span className="card-type">{entry.type}</span>
                    <span className="card-year">{entry.year}</span>
                  </div>
                  {entry.rating > 0 && (
                    <div className="card-stars">
                      {[1,2,3,4,5].map(s=><span key={s} className={`s${entry.rating>=s?" on":""}`}>★</span>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── ADD/EDIT MODAL ── */}
      {showModal && modalData && (
        <div className="backdrop" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-head">
              {modalData.poster
                ? <img className="modal-poster" src={`${TMDB_IMG}${modalData.poster}`} alt="" />
                : <div className="modal-poster" style={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,color:"var(--txd)"}}>🎬</div>}
              <div style={{flex:1}}>
                {modalData.manual
                  ? <input className="finp" placeholder="Enter title..." value={modalData.manualTitle||""} onChange={e=>setModalData(d=>({...d,manualTitle:e.target.value}))} style={{marginBottom:6}} />
                  : <div className="modal-ti">{modalData.title}</div>}
                <div className="modal-sub">{modalData.type}{modalData.year?` · ${modalData.year}`:""}</div>
                {modalData.overview && <div className="modal-ov">"{modalData.overview.slice(0,100)}..."</div>}
              </div>
            </div>
            <div className="modal-body">
              {modalData.manual && (
                <div className="frow" style={{marginBottom:14}}>
                  <div className="field">
                    <label className="flbl">Type</label>
                    <select className="fsel" value={modalData.type} onChange={e=>setModalData(d=>({...d,type:e.target.value}))}>
                      {["Movie","Anime","TV Show"].map(t=><option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="flbl">Year</label>
                    <input className="finp" placeholder="2024" value={modalData.year||""} onChange={e=>setModalData(d=>({...d,year:e.target.value}))} />
                  </div>
                </div>
              )}
              <div className="field">
                <label className="flbl">Status</label>
                <div className="pills">
                  {STATUSES.map(s=>(
                    <button key={s} className={`pill${form.status===s?" on":""}`}
                      style={form.status===s?{background:SCOLOR[s]+"22",borderColor:SCOLOR[s],color:SCOLOR[s]}:{}}
                      onClick={()=>setForm(f=>({...f,status:s}))}>
                      {SICON[s]} {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="flbl">Rating</label>
                <div className="str-row">
                  {[1,2,3,4,5].map(s=>(
                    <span key={s} className={`str${form.rating>=s?" on":""}`}
                      onClick={()=>setForm(f=>({...f,rating:f.rating===s?null:s}))}>★</span>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="flbl">Notes</label>
                <textarea className="fta" placeholder="Your thoughts..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn-save" onClick={handleSave} disabled={saving}>{saving?"Saving...":editId!==null?"Save Changes":"Add to Catalog"}</button>
              <button className="btn-cxl" onClick={()=>setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── AUTH MODAL ── */}
      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} />}

      {/* ── TOAST ── */}
      {toast && <div className="toast"><div className="toast-dot"/>{toast}</div>}
    </>
  );
}

// ─── AUTH MODAL COMPONENT ────────────────────────────────────
function AuthModal({ onClose }) {
  const [tab, setTab]       = useState("signin");
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [name, setName]     = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr]       = useState("");
  const [msg, setMsg]       = useState("");

  async function handleAuth() {
    setErr(""); setMsg(""); setLoading(true);
    try {
      if (tab === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email, password: pass,
          options: { data: { name } }
        });
        if (error) throw error;
        setMsg("Check your email to confirm your account!");
      }
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }

  return (
    <div className="backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="auth-modal">
        <div className="auth-logo">Reel<span>log</span></div>
        <div className="auth-sub">{tab==="signin"?"Welcome back!":"Create your free account"}</div>
        <div className="auth-tabs">
          <button className={`auth-tab${tab==="signin"?" on":""}`} onClick={()=>{setTab("signin");setErr("");setMsg("");}}>Sign in</button>
          <button className={`auth-tab${tab==="signup"?" on":""}`} onClick={()=>{setTab("signup");setErr("");setMsg("");}}>Sign up</button>
        </div>
        {err && <div className="auth-err">{err}</div>}
        {msg && <div className="auth-msg">{msg}</div>}
        {tab==="signup" && (
          <input className="auth-inp" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
        )}
        <input className="auth-inp" placeholder="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="auth-inp" placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAuth()} />
        <button className="auth-btn" onClick={handleAuth} disabled={loading}>
          {loading?"Loading...":(tab==="signin"?"Sign in →":"Create account →")}
        </button>
      </div>
    </div>
  );
}

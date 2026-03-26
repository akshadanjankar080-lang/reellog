import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE ────────────────────────────────────────────────────────────────
const supabase = createClient(
  "https://maoiguhrcvpxvmgztmqq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hb2lndWhyY3ZweHZtZ3p0bXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzE0NTcsImV4cCI6MjA4OTkwNzQ1N30.Jz1JhnSaTo1z0XYnb4rzbpmG90ceawHx6APkT0gNGI8"
);

// ─── TMDB ────────────────────────────────────────────────────────────────────
const TMDB_IMG  = "https://image.tmdb.org/t/p/w500";
const TMDB_W    = "https://image.tmdb.org/t/p/w1280";
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_KEY  = "dfb570e7a09aa4e72df7064fc4a703f0";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const STATUSES = ["Want to Watch", "Watching", "Watched"];
const SCOLOR   = { Watched: "#b2f0c5", Watching: "#f4e08a", "Want to Watch": "#8ebbf5" };
const SICON    = { Watched: "✓", Watching: "▶", "Want to Watch": "◎" };

// ─── OTT STREAMING PLATFORMS ─────────────────────────────────────────────────
const OTT = {
  cr:    { name:"Crunchyroll",  short:"CR",  color:"#F47521", url:"https://www.crunchyroll.com/search?q=" },
  nf:    { name:"Netflix",      short:"NF",  color:"#E50914", url:"https://www.netflix.com/search?q=" },
  prime: { name:"Prime Video",  short:"PV",  color:"#00A8E1", url:"https://www.primevideo.com/search?k=" },
  hs:    { name:"Hotstar",      short:"HS",  color:"#1a56db", url:"https://www.hotstar.com/in/search?q=" },
  hbo:   { name:"Max",          short:"MAX", color:"#7B2FBE", url:"https://www.max.com/search?q=" },
  atv:   { name:"Apple TV+",    short:"ATV", color:"#555",    url:"https://tv.apple.com/search?term=" },
};

// ─── STATIC CATALOG ──────────────────────────────────────────────────────────
const STATIC_ANIME = [
  { id:"a1",  tmdbId:1429,   tmdbType:"tv",    title:"Attack on Titan",                   year:2013, rating:9.1, type:"Anime",   poster:"/hTP1DtLGFAmna71pe5kzkm7zBCc.jpg",  streaming:["cr","nf"],    overview:"Humanity battles giant humanoid Titans behind massive walls. When the walls are breached, young Eren Yeager vows revenge and changes the world." },
  { id:"a2",  tmdbId:85937,  tmdbType:"tv",    title:"Demon Slayer",                       year:2019, rating:8.7, type:"Anime",   poster:"/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",  streaming:["cr","nf"],    overview:"A boy trains as a demon slayer to avenge his family and cure his sister who was turned into a demon." },
  { id:"a3",  tmdbId:95479,  tmdbType:"tv",    title:"Jujutsu Kaisen",                     year:2020, rating:8.6, type:"Anime",   poster:null,                                  streaming:["cr"],         overview:"A boy swallows a cursed object and must battle dangerous cursed spirits alongside Jujutsu sorcerers." },
  { id:"a4",  tmdbId:31911,  tmdbType:"tv",    title:"Fullmetal Alchemist: Brotherhood",   year:2009, rating:9.1, type:"Anime",   poster:"/9Yjx4OutGMrJNgLdmLLNLJaQBMX.jpg",  streaming:["cr","nf"],    overview:"Two brothers search for the Philosopher's Stone after a failed alchemical ritual leaves them broken." },
  { id:"a5",  tmdbId:46298,  tmdbType:"tv",    title:"Hunter x Hunter",                    year:2011, rating:9.0, type:"Anime",   poster:"/gHuCPlS2bMbcuONEqRDvMV0AVgO.jpg",  streaming:["cr"],         overview:"A boy follows his father's footsteps to become a legendary Hunter in a world of wonder and danger." },
  { id:"a6",  tmdbId:80777,  tmdbType:"tv",    title:"Vinland Saga",                       year:2019, rating:8.8, type:"Anime",   poster:"/4mFJHHlMoOWhEEqtFjVKv3CRbQr.jpg",  streaming:["cr","prime"], overview:"A young Viking warrior seeks revenge in a brutal medieval world, eventually questioning the meaning of true strength." },
  { id:"a7",  tmdbId:64927,  tmdbType:"tv",    title:"Re:Zero",                            year:2016, rating:8.3, type:"Anime",   poster:"/aGrqIBHi09G2RPQHH79RGkJFYvB.jpg",  streaming:["cr"],         overview:"A boy transported to a fantasy world discovers he can reset time upon death — a power that becomes a curse." },
  { id:"a8",  tmdbId:120089, tmdbType:"tv",    title:"Spy x Family",                       year:2022, rating:8.5, type:"Anime",   poster:"/4SRTuMnT3XbMRAfAtBKlXKHoqkT.jpg",  streaming:["cr","nf"],    overview:"A spy assembles a fake family for a mission, unaware each member harbours a secret of their own." },
  { id:"a9",  tmdbId:114410, tmdbType:"tv",    title:"Chainsaw Man",                       year:2022, rating:8.5, type:"Anime",   poster:"/npdB6oBX4SHkH9LhEVrSYOHhDpd.jpg",  streaming:["cr"],         overview:"A destitute boy merges with his devil dog and becomes a Devil Hunter, craving the simplest things in life." },
  { id:"a10", tmdbId:65806,  tmdbType:"tv",    title:"Mob Psycho 100",                     year:2016, rating:8.5, type:"Anime",   poster:null,                                  streaming:["cr","nf"],    overview:"A powerful esper boy tries to live a normal life, suppressing emotions that could level a city." },
  { id:"a11", tmdbId:209867, tmdbType:"tv",    title:"Frieren: Beyond Journey's End",      year:2023, rating:9.0, type:"Anime",   poster:"/9LDpSFAJQnrYQurFP4cFhNdIrNM.jpg",  streaming:["cr"],         overview:"An elf mage reflects on a completed journey years after defeating the Demon King, discovering what it means to connect." },
  { id:"a12", tmdbId:30984,  tmdbType:"tv",    title:"Bleach: Thousand-Year Blood War",    year:2022, rating:8.9, type:"Anime",   poster:"/2EewmxXe72ogD0EaWM8gqa0BPDR.jpg",  streaming:["cr","nf"],    overview:"Ichigo and Soul Society face their most powerful enemy in a war that will redefine what it means to be a Soul Reaper." },
];

const STATIC_MOVIES = [
  { id:"m1",  tmdbId:693134, tmdbType:"movie", title:"Dune: Part Two",                     year:2024, rating:8.5, type:"Movie",   poster:"/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",  streaming:["hs","hbo"],   overview:"Paul Atreides unites with the Fremen while seeking revenge against the conspirators who destroyed his family." },
  { id:"m2",  tmdbId:872585, tmdbType:"movie", title:"Oppenheimer",                         year:2023, rating:8.9, type:"Movie",   poster:"/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",  streaming:["prime"],      overview:"The story of J. Robert Oppenheimer and the development of the atomic bomb that changed warfare forever." },
  { id:"m3",  tmdbId:157336, tmdbType:"movie", title:"Interstellar",                        year:2014, rating:8.7, type:"Movie",   poster:"/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",  streaming:["nf","prime"], overview:"Explorers travel through a wormhole in space to ensure humanity's survival across galaxies." },
  { id:"m4",  tmdbId:27205,  tmdbType:"movie", title:"Inception",                           year:2010, rating:8.8, type:"Movie",   poster:"/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",  streaming:["nf","prime"], overview:"A thief who steals corporate secrets through the art of dream-sharing is given one last impossible mission." },
  { id:"m5",  tmdbId:155,    tmdbType:"movie", title:"The Dark Knight",                     year:2008, rating:9.0, type:"Movie",   poster:"/qJ2tW6WMUDux911r6m7haRef0WH.jpg",  streaming:["hs","prime"], overview:"Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy." },
  { id:"m6",  tmdbId:129,    tmdbType:"movie", title:"Spirited Away",                       year:2001, rating:8.6, type:"Movie",   poster:"/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",  streaming:["nf"],         overview:"A girl enters the spirit world to rescue her parents turned into pigs — a breathtaking journey of growth." },
  { id:"m7",  tmdbId:372058, tmdbType:"movie", title:"Your Name",                           year:2016, rating:8.4, type:"Movie",   poster:"/q719jXXEzOoYaps6babgKnONONX.jpg",  streaming:["nf","prime"], overview:"Two strangers find themselves inexplicably linked through body-swapping dreams that transcend time." },
  { id:"m8",  tmdbId:496243, tmdbType:"movie", title:"Parasite",                            year:2019, rating:8.5, type:"Movie",   poster:"/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",  streaming:["prime","hs"], overview:"Greed and class discrimination threaten a symbiotic relationship between two families in modern Seoul." },
  { id:"m9",  tmdbId:545611, tmdbType:"movie", title:"Everything Everywhere All at Once",   year:2022, rating:7.8, type:"Movie",   poster:"/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",  streaming:["prime","hs"], overview:"A Chinese immigrant is swept up in an adventure across the multiverse to save the world." },
  { id:"m10", tmdbId:278,    tmdbType:"movie", title:"The Shawshank Redemption",            year:1994, rating:9.3, type:"Movie",   poster:"/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg",  streaming:["nf","prime"], overview:"Two imprisoned men bond over decades, finding solace and eventual redemption through acts of decency." },
];

const STATIC_SERIES = [
  { id:"s1",  tmdbId:1396,   tmdbType:"tv",    title:"Breaking Bad",                        year:2008, rating:9.5, type:"TV Show", poster:"/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",   streaming:["nf"],         overview:"A chemistry teacher turns to manufacturing meth to secure his family's financial future after a terminal diagnosis." },
  { id:"s2",  tmdbId:1438,   tmdbType:"tv",    title:"The Wire",                            year:2002, rating:9.3, type:"TV Show", poster:"/4lbclFySvugI51fwsyxBTOm4DqK.jpg",   streaming:["hbo"],        overview:"The Baltimore drug scene, seen through the eyes of both drug dealers and law enforcement." },
  { id:"s3",  tmdbId:94605,  tmdbType:"tv",    title:"Arcane",                              year:2021, rating:9.0, type:"TV Show", poster:"/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",   streaming:["nf"],         overview:"Two sisters on opposite sides of a conflict born in the utopian region of Piltover and its oppressed undercity." },
  { id:"s4",  tmdbId:95396,  tmdbType:"tv",    title:"Severance",                           year:2022, rating:8.7, type:"TV Show", poster:"/tE3zEVeNaxD2aJMXnFfPHpQxOhJ.jpg",   streaming:["atv"],        overview:"Workers have their work and personal memories surgically separated, creating a haunting corporate dystopia." },
  { id:"s5",  tmdbId:100088, tmdbType:"tv",    title:"The Last of Us",                      year:2023, rating:8.8, type:"TV Show", poster:"/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",   streaming:["hbo","hs"],   overview:"A hardened smuggler and a teenage girl traverse a post-apocalyptic United States filled with infected and factions." },
  { id:"s6",  tmdbId:94997,  tmdbType:"tv",    title:"House of the Dragon",                 year:2022, rating:8.5, type:"TV Show", poster:"/z2yahl2uefxDCl0nogcRBstwruJ.jpg",   streaming:["hbo","hs"],   overview:"The internal succession war of House Targaryen, set 200 years before the events of Game of Thrones." },
  { id:"s7",  tmdbId:63351,  tmdbType:"tv",    title:"Succession",                          year:2018, rating:8.9, type:"TV Show", poster:"/e2X8fBflR3zqzWNBlHFzSAE5Jah.jpg",   streaming:["hbo"],        overview:"The Roy family controls one of the biggest media empires in the world — and tears itself apart fighting for it." },
  { id:"s8",  tmdbId:70523,  tmdbType:"tv",    title:"Dark",                                year:2017, rating:8.8, type:"TV Show", poster:"/apbrbWs5M0SUFOSnPKzFm8Jj3jv.jpg",   streaming:["nf"],         overview:"A mind-bending family saga involving four interdependent families in a German town across different time periods." },
  { id:"s9",  tmdbId:95557,  tmdbType:"tv",    title:"Invincible",                          year:2021, rating:8.7, type:"TV Show", poster:"/yDWJYRAwMNKa767NIf0q8jk6r7i.jpg",   streaming:["prime"],      overview:"A teenage boy discovers his father is the most powerful superhero on the planet — and something far darker." },
  { id:"s10", tmdbId:136315, tmdbType:"tv",    title:"The Bear",                            year:2022, rating:8.8, type:"TV Show", poster:null,                                   streaming:["hs","atv"],   overview:"A James Beard-nominated chef returns to Chicago to run his family's chaotic sandwich shop after a family tragedy." },
];

const HERO_ITEMS = [
  { title:"Attack on Titan", tmdbId:1429, tmdbType:"tv",    poster:"/hTP1DtLGFAmna71pe5kzkm7zBCc.jpg", backdrop:"/d8duYyyC9J5T825Hg7grmaabfxQ.jpg", rating:"9.1", type:"Anime",   year:2013, streaming:["cr","nf"],    overview:"Humanity's last survivors fight giant humanoid Titans behind colossal walls. When the walls are breached, young Eren Yeager vows revenge that will change the world." },
  { title:"Dune: Part Two",  tmdbId:693134,tmdbType:"movie", poster:"/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", backdrop:"/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", rating:"8.5", type:"Movie",   year:2024, streaming:["hs","hbo"],   overview:"Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family." },
  { title:"Arcane",          tmdbId:94605, tmdbType:"tv",    poster:"/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg", backdrop:"/sPUBwJ2TxJAKcVaA6axzBVi6UKN.jpg", rating:"9.0", type:"TV Show", year:2021, streaming:["nf"],         overview:"Set in the utopian region of Piltover and the oppressed underground of Zaun, two sisters champion different sides of a brewing conflict." },
  { title:"Frieren",         tmdbId:209867,tmdbType:"tv",    poster:"/9LDpSFAJQnrYQurFP4cFhNdIrNM.jpg", backdrop:"/yDWJYRAwMNKa767NIf0q8jk6r7i.jpg", rating:"9.0", type:"Anime",   year:2023, streaming:["cr"],         overview:"After the party's victory, elf mage Frieren sets out on a journey of reflection, exploring what it means to truly live and connect with others." },
];

// ─── SETTINGS DEFAULTS ───────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  theme:       "black", // ui theme: black, light, or neo (original)
  accentColor: "green",
  cardSize:    "medium",
  showRatings:  true,
  showOverviews: false,
  autoplay:     true,
  language:     "en",
  adultContent: false,
  animationsReduced: false,
  showStreaming: true,
  cinematicBg:  true,
};

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Serif+Display:ital@0;1&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

:root{
  /* ── CORE PALETTE (dark with green tint) ── */
  --bk:#07100a;
  --c1:#0e1812;
  --c2:#162019;
  --c3:#1d2b21;

  /* ── ACCENT: Pastel Green default ── */
  --acc:#b2f0c5;
  --acc-d:#6dbe8c;
  --acc-glow:rgba(178,240,197,.22);
  --acc-dim:rgba(178,240,197,.08);
  --acc-border:rgba(178,240,197,.22);

  /* ── YELLOWS & GREYS ── */
  --gold:#f0d878;
  --gold-dim:rgba(240,216,120,.12);
  --grey1:#899e8d;
  --grey2:#4a5e50;
  --grey3:#253028;
  --grey4:#192218;

  /* ── TEXT ── */
  --tx:#e8f2ea;
  --txm:#899e8d;
  --txd:#4a5e50;

  /* ── DANGER ── */
  --red:#f47070;
  --red-dim:rgba(244,112,112,.1);
}

/* Accent overrides */
.acc-yellow{ --acc:#f4d06f; --acc-d:#d4a30a; --acc-glow:rgba(244,208,111,.18); --acc-dim:rgba(244,208,111,.08); --acc-border:rgba(244,208,111,.2); }
.acc-blue  { --acc:#8ebbf5; --acc-d:#3b82f6; --acc-glow:rgba(142,187,245,.18); --acc-dim:rgba(142,187,245,.08); --acc-border:rgba(142,187,245,.2); }
.acc-red   { --acc:#f47070; --acc-d:#e53535; --acc-glow:rgba(244,112,112,.18); --acc-dim:rgba(244,112,112,.08); --acc-border:rgba(244,112,112,.2); }

/* Theme overrides */
:root.theme-black{
  --bk:#000;
  --c1:#040404;
  --c2:#0a0a0a;
  --c3:#101010;
  --grey1:#b8b8b8;
  --grey2:#6b6b6b;
  --grey3:#2a2a2a;
  --grey4:#151515;
  --tx:#f5f5f5;
  --txm:#b8b8b8;
  --txd:#7a7a7a;
}
:root.theme-light{
  --bk:#f8fafc;
  --c1:#f1f5f9;
  --c2:#e2e8f0;
  --c3:#cbd5e1;
  --grey1:#475569;
  --grey2:#cbd5e1;
  --grey3:#e2e8f0;
  --grey4:#f8fafc;
  --tx:#0f172a;
  --txm:#334155;
  --txd:#64748b;
  --red:#ef4444;
  --red-dim:rgba(239,68,68,.12);
}

html{scroll-behavior:smooth;}

body{
  background:var(--bk);
  background-image:
    radial-gradient(ellipse 120% 60% at 50% -10%,rgba(178,240,197,.045) 0%,transparent 70%),
    radial-gradient(ellipse 60% 40% at 0% 100%,rgba(100,200,130,.025) 0%,transparent 60%),
    radial-gradient(ellipse 80% 50% at 100% 50%,rgba(80,160,110,.018) 0%,transparent 60%);
  color:var(--tx);
  font-family:'DM Sans',sans-serif;
  min-height:100vh;
  overflow-x:hidden;
}

.theme-black body{
  background:#000;
  background-image:none;
}
.theme-light body{
  background:var(--bk);
  background-image:none;
  color:var(--tx);
}

::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:var(--grey2);border-radius:4px;}
::-webkit-scrollbar-track{background:transparent;}
button{cursor:pointer;font-family:'DM Sans',sans-serif;}
input,select,textarea{font-family:'DM Sans',sans-serif;}

/* ─────── GRAIN OVERLAY ─────── */
.grain-svg{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9998;opacity:.038;}

/* ─────────────────── NAV ─────────────────── */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:200;
  height:66px;display:flex;align-items:center;justify-content:space-between;
  padding:0 48px;
  background:linear-gradient(to bottom,rgba(7,16,10,.97),rgba(7,16,10,.82));
  backdrop-filter:blur(28px);
  border-bottom:1px solid rgba(178,240,197,.07);
  transition:background .3s;
}
.nav-scrolled{background:rgba(7,16,10,.98)!important;box-shadow:0 1px 0 rgba(178,240,197,.06);}
.nav-logo{
  font-family:'Bebas Neue',sans-serif;font-size:29px;letter-spacing:3px;
  color:var(--acc);display:flex;align-items:center;gap:8px;cursor:pointer;
  text-shadow:0 0 40px var(--acc-glow);
}
.nav-logo span{color:var(--tx);}
.nav-dot{width:7px;height:7px;border-radius:50%;background:var(--acc);flex-shrink:0;box-shadow:0 0 10px var(--acc-glow);}
.nav-links{display:flex;align-items:center;gap:2px;}
.nav-link{
  padding:8px 16px;font-size:13px;font-weight:500;color:var(--txm);
  background:none;border:none;border-radius:8px;
  transition:all .15s;letter-spacing:.3px;position:relative;
}
.nav-link::after{content:'';position:absolute;bottom:4px;left:50%;transform:translateX(-50%) scaleX(0);width:16px;height:2px;background:var(--acc);border-radius:2px;transition:transform .2s;}
.nav-link:hover{color:var(--tx);}
.nav-link.active{color:var(--acc);}
.nav-link.active::after{transform:translateX(-50%) scaleX(1);}
.nav-right{display:flex;align-items:center;gap:10px;}
.nav-user{font-size:12px;color:var(--txm);letter-spacing:.5px;padding:0 4px;}
.btn-sm{padding:8px 18px;font-size:12px;font-weight:500;border:none;border-radius:7px;transition:all .2s;letter-spacing:.3px;}
.btn-outline{background:none;border:1px solid var(--grey3);color:var(--txm);}
.btn-outline:hover{border-color:var(--acc-border);color:var(--acc);}
.btn-acc{background:var(--acc);color:#07100a;font-weight:600;}
.btn-acc:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 6px 20px var(--acc-glow);}
.btn-icon{
  width:38px;height:38px;display:flex;align-items:center;justify-content:center;
  background:rgba(178,240,197,.06);border:1px solid var(--grey3);
  border-radius:9px;color:var(--txm);font-size:16px;transition:all .2s;
  position:relative;
}
.theme-black .nav{background:linear-gradient(to bottom,rgba(0,0,0,.96),rgba(0,0,0,.88));border-bottom:1px solid #111;}
.theme-black .nav-scrolled{background:rgba(0,0,0,.96)!important;box-shadow:0 1px 0 #111;}
.theme-light .nav{background:linear-gradient(to bottom,rgba(248,250,252,.96),rgba(248,250,252,.9));border-bottom:1px solid #e2e8f0;}
.theme-light .nav-scrolled{background:rgba(248,250,252,.96)!important;box-shadow:0 1px 0 #e2e8f0;}
.theme-light .nav-link{color:#475569;}
.theme-light .nav-link:hover{color:#0f172a;}
.theme-light .nav-logo span{color:#0f172a;}
.theme-light .btn-outline{border-color:#e2e8f0;color:#475569;}
.theme-light .btn-icon{background:rgba(15,23,42,.04);border-color:#e2e8f0;color:#475569;}
.btn-icon:hover{border-color:var(--acc-border);color:var(--acc);background:var(--acc-dim);transform:rotate(30deg);}
.settings-gear{font-size:17px;line-height:1;}

/* ─────────────────── HERO CAROUSEL ─────────────────── */
.hero-wrap{position:relative;height:100vh;min-height:600px;max-height:840px;overflow:hidden;margin-top:-66px;}
.hero-bg-img{
  position:absolute;inset:0;
  background-size:cover;background-position:center top;
  transition:opacity .9s ease;
}
.hero-bg-img.enter{opacity:0;}
.hero-bg-img.active{opacity:1;}
.hero-overlay{
  position:absolute;inset:0;
  background:
    linear-gradient(to top,var(--bk) 0%,rgba(7,16,10,.55) 36%,rgba(7,16,10,.12) 64%,rgba(7,16,10,.32) 100%),
    linear-gradient(to right,rgba(7,16,10,.78) 0%,rgba(7,16,10,.38) 52%,transparent 100%);
}
.hero-content{
  position:absolute;bottom:14%;left:52px;max-width:580px;
  animation:heroUp .65s ease both;
}
@keyframes heroUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
.hero-badge{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(178,240,197,.08);border:1px solid rgba(178,240,197,.2);
  padding:5px 14px;border-radius:20px;margin-bottom:18px;
  font-size:11px;color:var(--acc);letter-spacing:3px;text-transform:uppercase;
}
.hero-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--acc);animation:pulse 2s infinite;box-shadow:0 0 8px var(--acc);}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
.hero-title{
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(38px,7vw,92px);line-height:.95;
  letter-spacing:2px;margin-bottom:14px;
  max-width:min(92vw,640px);
  overflow-wrap:anywhere;
  text-shadow:0 2px 40px rgba(0,0,0,.5);
}
.hero-meta{display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap;}
.hero-rating{
  display:flex;align-items:center;gap:5px;
  background:rgba(240,216,120,.12);border:1px solid rgba(240,216,120,.25);
  padding:4px 10px;border-radius:6px;
  font-size:13px;font-weight:600;color:var(--gold);
}
.hero-type-tag{font-size:11px;padding:4px 12px;border-radius:6px;border:1px solid var(--grey2);color:var(--txm);letter-spacing:1.5px;text-transform:uppercase;}
.hero-year{font-size:13px;color:var(--txm);}
.hero-overview{
  font-size:14.5px;color:rgba(232,242,234,.76);
  line-height:1.78;max-width:470px;margin-bottom:26px;font-weight:300;
  display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;
}
.hero-actions{display:flex;gap:12px;flex-wrap:wrap;align-items:center;}
.btn-hero-play{
  display:flex;align-items:center;gap:8px;
  background:var(--tx);color:var(--bk);
  padding:13px 30px;font-size:14px;font-weight:700;
  border:none;border-radius:9px;
  transition:all .2s;letter-spacing:.3px;
}
.btn-hero-play:hover{background:#fff;transform:translateY(-2px);box-shadow:0 10px 32px rgba(255,255,255,.18);}
.btn-hero-add{
  display:flex;align-items:center;gap:8px;
  background:rgba(255,255,255,.1);color:var(--tx);
  backdrop-filter:blur(14px);
  padding:13px 26px;font-size:14px;font-weight:500;
  border:1px solid rgba(255,255,255,.2);border-radius:9px;
  transition:all .2s;
}
.btn-hero-add:hover{background:rgba(255,255,255,.18);transform:translateY(-2px);}
.btn-hero-stream{
  display:flex;align-items:center;gap:7px;
  background:transparent;color:var(--txm);
  padding:12px 20px;font-size:12px;font-weight:500;
  border:1px solid rgba(255,255,255,.15);border-radius:9px;
  transition:all .2s;text-decoration:none;letter-spacing:.3px;
  backdrop-filter:blur(10px);
}
.btn-hero-stream:hover{background:rgba(255,255,255,.1);color:var(--tx);transform:translateY(-2px);}
.btn-hero-stream .stream-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.hero-dots{
  position:absolute;bottom:30px;left:50%;transform:translateX(-50%);
  display:flex;gap:8px;
}
.hero-dot{width:28px;height:3px;border-radius:2px;background:rgba(255,255,255,.2);transition:all .35s;cursor:pointer;}
.hero-dot.on{background:var(--acc);width:46px;box-shadow:0 0 10px var(--acc-glow);}
.hero-strip{
  position:absolute;bottom:14px;left:52px;right:52px;
  display:flex;gap:8px;align-items:center;
  overflow-x:auto;padding:4px 0;
  scrollbar-width:none;z-index:4;
}
.hero-strip::-webkit-scrollbar{display:none;}
.hero-thumb{
  width:86px;height:48px;flex:0 0 auto;
  border:none;border-radius:8px;
  background-size:cover;background-position:center;
  cursor:pointer;transition:transform .25s ease, box-shadow .25s ease, outline .25s ease;
  outline:2px solid transparent;
  filter:brightness(.9);
}
.hero-thumb.on{
  transform:scale(1.06);
  outline-color:var(--acc);
  box-shadow:0 8px 24px rgba(0,0,0,.45);
  filter:brightness(1);
}

/* ─────────────────── ROW SECTIONS ─────────────────── */
.catalog-section{padding:8px 0 24px;}
.sec-header{display:flex;align-items:baseline;justify-content:space-between;padding:0 52px 16px;}
.sec-title{font-family:'DM Serif Display',serif;font-size:23px;display:flex;align-items:center;gap:10px;}
.sec-emoji{font-size:20px;}
.sec-count{font-size:12px;color:var(--txm);font-family:'DM Sans',sans-serif;font-weight:400;}
.sec-see-all{
  font-size:12px;color:var(--acc);background:none;border:none;
  letter-spacing:.5px;padding:6px 14px;cursor:pointer;
  border:1px solid var(--acc-border);border-radius:20px;
  transition:all .2s;
}
.sec-see-all:hover{background:var(--acc-dim);transform:translateX(2px);}

/* Row with scroll arrows */
.row-section-wrap{position:relative;}
.row-arrow{
  position:absolute;top:50%;transform:translateY(-50%);
  width:44px;height:80px;
  display:flex;align-items:center;justify-content:center;
  background:linear-gradient(to right,rgba(7,16,10,.92),rgba(7,16,10,.7));
  border:none;color:var(--tx);font-size:22px;
  cursor:pointer;z-index:10;
  transition:all .2s;
  opacity:0;
}
.row-section-wrap:hover .row-arrow{opacity:1;}
.row-arrow:hover{color:var(--acc);}
.row-arrow-left{left:0;border-radius:0 8px 8px 0;padding-left:8px;background:linear-gradient(to right,rgba(7,16,10,.95),rgba(7,16,10,.5));}
.row-arrow-right{right:0;border-radius:8px 0 0 8px;padding-right:8px;background:linear-gradient(to left,rgba(7,16,10,.95),rgba(7,16,10,.5));}

.row-scroll{
  display:flex;gap:14px;
  padding:4px 52px 16px;
  overflow-x:auto;scrollbar-width:none;
  scroll-behavior:smooth;
}
.row-scroll::-webkit-scrollbar{display:none;}

.row-card{
  flex-shrink:0;width:154px;
  border-radius:12px;overflow:hidden;cursor:pointer;position:relative;
  background:var(--c2);
  border:1px solid rgba(178,240,197,.07);
  transition:all .28s cubic-bezier(.34,1.56,.64,1);
}
.row-card:hover{
  transform:scale(1.07) translateY(-6px);
  border-color:var(--acc-border);
  box-shadow:0 18px 44px rgba(0, 0, 0, 0.48),0 0 0 1px var(--acc-border),0 0 24px var(--acc-glow);
}
.row-card-img-box{position:relative;aspect-ratio:2/3;overflow:hidden;}
.row-card-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s;}
.row-card:hover .row-card-img{transform:scale(1.07);}
.row-card-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(7,16,10,1) 0%,rgba(7,16,10,.45) 45%,transparent 100%);}
.row-card-rank{
  position:absolute;bottom:6px;left:8px;
  font-family:'Bebas Neue',sans-serif;font-size:42px;line-height:1;
  color:rgba(255,255,255,.88);text-shadow:0 2px 8px rgba(0,0,0,.8);
  -webkit-text-stroke:1px rgba(255,255,255,.18);
}
.row-card-type{
  position:absolute;top:8px;right:8px;
  font-size:9px;letter-spacing:1.5px;padding:3px 8px;border-radius:20px;
  backdrop-filter:blur(12px);background:rgba(7,16,10,.75);
  border:1px solid rgba(178,240,197,.12);color:var(--txm);text-transform:uppercase;
}
.row-card-body{padding:10px;}
.row-card-title{font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px;}
.row-card-meta{display:flex;justify-content:space-between;align-items:center;}
.row-card-year{font-size:10px;color:var(--txd);}
.row-card-rating{display:flex;align-items:center;gap:3px;font-size:10px;font-weight:600;color:var(--gold);}

/* Hover overlay on cards */
.row-card-hover{
  position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(7,16,10,.78) 0%,rgba(7,16,10,.62) 100%);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
  opacity:0;transition:opacity .2s;
  padding:12px;
  color:var(--tx);backdrop-filter:blur(6px);
}
.row-card:hover .row-card-hover{opacity:1;}
.row-card-hover-title{font-size:11px;font-weight:600;text-align:center;color:var(--tx);line-height:1.3;margin-bottom:2px;text-shadow:0 2px 10px rgba(0,0,0,.45);}
.row-card-hover-btn{
  display:flex;align-items:center;gap:5px;
  padding:7px 16px;font-size:11px;font-weight:600;
  background:var(--acc);color:#07100a;border:none;border-radius:20px;
  transition:all .15s;cursor:pointer;width:100%;justify-content:center;
}
.row-card-hover-btn:hover{filter:brightness(1.1);}
.stream-badges-mini{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin-top:2px;}
.stream-badge-mini{
  font-size:8px;font-weight:700;padding:2px 6px;border-radius:3px;
  text-decoration:none;letter-spacing:.5px;transition:all .15s;
  opacity:.9;
}
.stream-badge-mini:hover{opacity:1;transform:scale(1.08);}

.no-img-box{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--txd);gap:5px;font-size:10px;background:var(--c3);}
.no-img-icon{font-size:28px;opacity:.25;}

/* ─────────────────── SEE-ALL MODAL ─────────────────── */
.see-all-backdrop{
  position:fixed;inset:0;z-index:600;
  background:rgba(0,0,0,.88);backdrop-filter:blur(16px);
  animation:bkin .2s ease;
  overflow-y:auto;
  padding:20px;
}
.see-all-panel{
  background:var(--c1);border:1px solid var(--grey3);border-radius:20px;
  width:100%;max-width:1100px;margin:0 auto;
  animation:mkin .3s cubic-bezier(.34,1.56,.64,1);
  min-height:80vh;
}
.see-all-head{
  padding:28px 32px 20px;display:flex;align-items:center;justify-content:space-between;
  border-bottom:1px solid var(--grey3);
  position:sticky;top:0;background:var(--c1);border-radius:20px 20px 0 0;z-index:2;
}
.see-all-title{font-family:'DM Serif Display',serif;font-size:26px;display:flex;align-items:center;gap:12px;}
.see-all-search{
  padding:16px 32px;
  border-bottom:1px solid rgba(255,255,255,.04);
}
.see-all-inp{
  width:100%;max-width:420px;
  background:var(--bk);border:1px solid var(--grey3);
  color:var(--tx);padding:11px 16px;font-size:13px;
  outline:none;border-radius:10px;transition:all .2s;
}
.see-all-inp:focus{border-color:var(--acc-border);box-shadow:0 0 0 3px var(--acc-dim);}
.see-all-inp::placeholder{color:var(--txd);}
.see-all-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(148px,1fr));
  gap:16px;
  padding:20px 32px 32px;
}

/* ─────────────────── MAIN GRID (watchlist) ─────────────────── */
.page-header{padding:104px 52px 32px;}
.page-eyebrow{font-size:11px;letter-spacing:3.5px;color:var(--txd);text-transform:uppercase;margin-bottom:8px;}
.page-h1{font-family:'DM Serif Display',serif;font-size:clamp(32px,4vw,56px);line-height:1.1;}
.page-h1 em{color:var(--acc);font-style:italic;}
.page-count{font-size:13px;color:var(--txm);margin-top:8px;}

.stats-strip{
  display:flex;margin:0 52px 4px;
  border:1px solid var(--grey3);border-radius:14px;overflow:hidden;
  background:var(--c1);
}
.stat-chip{
  flex:1;padding:18px 20px;cursor:pointer;transition:background .2s;
  border-right:1px solid var(--grey3);position:relative;overflow:hidden;
}
.stat-chip:last-child{border-right:none;}
.stat-chip:hover{background:rgba(178,240,197,.03);}
.stat-chip.on{background:rgba(178,240,197,.04);}
.stat-chip.on::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--acc);}
.stat-n{font-family:'DM Serif Display',serif;font-size:32px;line-height:1;}
.stat-l{font-size:10px;color:var(--txd);letter-spacing:2.5px;text-transform:uppercase;margin-top:4px;}

.toolbar{padding:20px 52px 0;display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
.search-wrap{position:relative;flex:1;max-width:560px;}
.search-inp{
  width:100%;background:var(--c1);border:1px solid var(--grey3);
  color:var(--tx);padding:12px 18px 12px 46px;font-size:13px;
  outline:none;border-radius:10px;transition:all .2s;
}
.search-inp:focus{border-color:var(--acc-border);box-shadow:0 0 0 3px var(--acc-dim);}
.search-inp::placeholder{color:var(--txd);}
.search-ico{position:absolute;left:15px;top:50%;transform:translateY(-50%);color:var(--txd);font-size:16px;pointer-events:none;}
.spin-ico{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:var(--acc);animation:spin 1s linear infinite;}
@keyframes spin{to{transform:translateY(-50%) rotate(360deg)}}

.drop{
  position:absolute;top:calc(100% + 6px);left:0;right:0;
  background:var(--c2);border:1px solid var(--grey3);border-radius:14px;
  overflow:hidden;box-shadow:0 28px 64px rgba(0,0,0,.75);
  max-height:400px;overflow-y:auto;z-index:300;
  animation:dropIn .15s ease;
}
@keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.drop-row{
  display:flex;align-items:center;gap:12px;padding:10px 14px;
  cursor:pointer;transition:background .15s;
  border-bottom:1px solid rgba(255,255,255,.03);
}
.drop-row:last-child{border-bottom:none;}
.drop-row:hover{background:rgba(178,240,197,.04);}
.drop-img{width:38px;height:54px;object-fit:cover;border-radius:6px;background:var(--c3);flex-shrink:0;}
.drop-ti{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.drop-me{font-size:11px;color:var(--txd);margin-top:2px;}
.drop-tag{font-size:10px;padding:2px 8px;background:var(--acc-dim);color:var(--acc);border:1px solid var(--acc-border);border-radius:4px;text-transform:uppercase;letter-spacing:1px;flex-shrink:0;}

.fil-row{display:flex;gap:6px;flex-wrap:wrap;}
.fil-btn{background:var(--c1);border:1px solid var(--grey3);color:var(--txm);padding:8px 16px;font-size:12px;border-radius:22px;transition:all .15s;letter-spacing:.2px;font-weight:500;}
.fil-btn:hover{border-color:var(--grey2);color:var(--tx);}
.fil-btn.on{background:var(--acc);color:#07100a;border-color:var(--acc);font-weight:600;}
.sort-sel{background:var(--c1);border:1px solid var(--grey3);color:var(--txm);padding:9px 12px;font-size:12px;outline:none;border-radius:8px;margin-left:auto;cursor:pointer;}
.sort-sel:focus{border-color:var(--acc-border);}

/* ─────────────────── GRID CARDS ─────────────────── */
.grid-wrap{padding:22px 52px 100px;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(172px,1fr));gap:18px;}
.grid.small{grid-template-columns:repeat(auto-fill,minmax(142px,1fr));gap:14px;}
.grid.large{grid-template-columns:repeat(auto-fill,minmax(214px,1fr));gap:22px;}

.card{
  background:var(--c1);border:1px solid rgba(178,240,197,.07);border-radius:14px;
  overflow:hidden;cursor:pointer;position:relative;
  transition:all .28s cubic-bezier(.34,1.56,.64,1);
  animation:cardIn .4s ease both;
}
@keyframes cardIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.card:hover{
  transform:translateY(-7px) scale(1.022);
  border-color:var(--acc-border);
  box-shadow:0 22px 48px rgba(0,0,0,.65),0 0 0 1px var(--acc-border),0 0 20px var(--acc-glow);
}
.card-img-box{position:relative;aspect-ratio:2/3;overflow:hidden;background:var(--c2);}
.card-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease;}
.card:hover .card-img{transform:scale(1.06);}
.card-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(7,16,10,.97) 0%,rgba(7,16,10,.25) 50%,transparent 100%);}
.card-status-tag{
  position:absolute;top:8px;right:8px;
  font-size:9px;letter-spacing:1px;padding:3px 9px;border-radius:20px;
  backdrop-filter:blur(12px);background:rgba(7,16,10,.82);border:1px solid;
  text-transform:uppercase;font-weight:500;
}
.card-owner{position:absolute;bottom:8px;left:8px;font-size:10px;color:rgba(255,255,255,.3);letter-spacing:.5px;}
.card-btns{position:absolute;top:8px;left:8px;display:flex;gap:5px;opacity:0;transition:opacity .2s;}
.card:hover .card-btns{opacity:1;}
.card-btn{
  width:28px;height:28px;background:rgba(7,16,10,.88);backdrop-filter:blur(8px);
  border:1px solid var(--grey3);border-radius:6px;color:var(--tx);font-size:12px;
  display:flex;align-items:center;justify-content:center;transition:all .15s;
}
.card-btn:hover{background:var(--acc-dim);border-color:var(--acc-border);color:var(--acc);}
.card-body{padding:12px;}
.card-title{font-size:13px;font-weight:500;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px;}
.card-meta-row{display:flex;align-items:center;justify-content:space-between;}
.card-type{font-size:10px;color:var(--txd);letter-spacing:1px;text-transform:uppercase;}
.card-year{font-size:11px;color:var(--txd);}
.card-stars{display:flex;gap:2px;margin-top:6px;}
.s{font-size:11px;color:var(--grey3);}
.s.on{color:var(--gold);}
.card-overview{font-size:11px;color:var(--txm);margin-top:6px;line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}

/* ─────────────────── EMPTY STATE ─────────────────── */
.empty-state{grid-column:1/-1;display:flex;flex-direction:column;align-items:center;padding:80px 20px;gap:14px;}
.empty-icon{font-size:52px;opacity:.15;}
.empty-title{font-size:16px;color:var(--txm);font-weight:500;}
.empty-sub{font-size:13px;color:var(--txd);}

/* ─────────────────── LOADER ─────────────────── */
.loader{display:flex;align-items:center;justify-content:center;padding:80px;gap:8px;}
.ldot{width:8px;height:8px;border-radius:50%;background:var(--acc);animation:ld 1.2s ease infinite;}
.ldot:nth-child(2){animation-delay:.2s;}
.ldot:nth-child(3){animation-delay:.4s;}
@keyframes ld{0%,80%,100%{transform:scale(.6);opacity:.3}40%{transform:scale(1);opacity:1}}

/* ─────────────────── MODAL ─────────────────── */
.backdrop{
  position:fixed;inset:0;z-index:400;
  background:rgba(0,0,0,.88);backdrop-filter:blur(16px);
  display:flex;align-items:center;justify-content:center;padding:20px;
  animation:bkin .2s ease;
}
@keyframes bkin{from{opacity:0}to{opacity:1}}
.modal{
  background:var(--c1);border:1px solid var(--grey3);border-radius:20px;
  width:100%;max-width:490px;max-height:92vh;overflow-y:auto;
  animation:mkin .28s cubic-bezier(.34,1.56,.64,1);
  box-shadow:0 44px 88px rgba(0,0,0,.75);
}
@keyframes mkin{from{opacity:0;transform:scale(.92) translateY(16px)}to{opacity:1;transform:none}}
.modal-head{padding:24px 24px 0;display:flex;align-items:flex-start;gap:16px;}
.modal-poster{width:72px;height:104px;object-fit:cover;border-radius:9px;background:var(--c2);flex-shrink:0;}
.modal-ti{font-family:'DM Serif Display',serif;font-size:22px;line-height:1.2;margin-bottom:4px;}
.modal-sub{font-size:12px;color:var(--txd);}
.modal-ov{font-size:12px;color:var(--txm);margin-top:6px;line-height:1.65;font-style:italic;}
.modal-body{padding:22px 24px;}
.field{margin-bottom:18px;}
.flbl{font-size:10px;letter-spacing:2.5px;color:var(--txd);text-transform:uppercase;margin-bottom:8px;display:block;}
.finp,.fsel,.fta{
  width:100%;background:var(--bk);border:1px solid var(--grey3);
  color:var(--tx);padding:10px 14px;font-size:13px;
  outline:none;border-radius:9px;transition:border-color .2s;
}
.finp:focus,.fsel:focus,.fta:focus{border-color:var(--acc-border);box-shadow:0 0 0 3px var(--acc-dim);}
.finp::placeholder,.fta::placeholder{color:var(--txd);}
.fta{resize:vertical;min-height:76px;}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.pills{display:flex;gap:7px;flex-wrap:wrap;}
.pill{padding:8px 14px;border-radius:20px;font-size:12px;border:1px solid var(--grey3);color:var(--txd);background:var(--bk);transition:all .15s;font-weight:500;}
.pill.on{font-weight:600;}
.str-row{display:flex;gap:6px;}
.str{font-size:28px;color:var(--grey3);transition:color .15s;cursor:pointer;}
.str:hover,.str.on{color:var(--gold);}
.modal-foot{padding:0 24px 24px;display:flex;gap:8px;}
.btn-save{flex:1;background:var(--acc);color:#07100a;border:none;padding:13px;font-size:13px;font-weight:700;border-radius:9px;transition:all .2s;}
.btn-save:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 8px 24px var(--acc-glow);}
.btn-save:disabled{opacity:.5;cursor:not-allowed;}
.btn-cxl{background:none;color:var(--txm);border:1px solid var(--grey3);padding:13px 18px;font-size:13px;border-radius:9px;transition:all .15s;}
.btn-cxl:hover{border-color:var(--grey2);color:var(--tx);}

/* ─────────────────── AUTH MODAL ─────────────────── */
.auth-modal{
  background:var(--c1);border:1px solid var(--grey3);border-radius:22px;
  width:100%;max-width:420px;padding:42px;
  animation:mkin .28s cubic-bezier(.34,1.56,.64,1);
  box-shadow:0 44px 88px rgba(0,0,0,.75);
}
.auth-logo{font-family:'Bebas Neue',sans-serif;font-size:38px;color:var(--acc);letter-spacing:3px;margin-bottom:4px;text-align:center;text-shadow:0 0 36px var(--acc-glow);}
.auth-logo span{color:var(--tx);}
.auth-sub{font-size:13px;color:var(--txd);text-align:center;margin-bottom:30px;}
.auth-tabs{display:flex;border:1px solid var(--grey3);border-radius:9px;overflow:hidden;margin-bottom:24px;background:var(--bk);}
.auth-tab{flex:1;padding:11px;font-size:13px;background:none;border:none;color:var(--txm);transition:all .15s;font-weight:500;}
.auth-tab.on{background:var(--acc-dim);color:var(--acc);}
.auth-inp{width:100%;background:var(--bk);border:1px solid var(--grey3);color:var(--tx);padding:12px 14px;font-size:13px;outline:none;border-radius:9px;margin-bottom:10px;transition:all .2s;}
.auth-inp:focus{border-color:var(--acc-border);box-shadow:0 0 0 3px var(--acc-dim);}
.auth-inp::placeholder{color:var(--txd);}
.auth-btn{width:100%;background:var(--acc);color:#07100a;border:none;padding:13px;font-size:14px;font-weight:700;border-radius:9px;transition:all .2s;margin-top:6px;}
.auth-btn:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 8px 24px var(--acc-glow);}
.auth-btn:disabled{opacity:.5;cursor:not-allowed;}
.auth-err{font-size:12px;color:var(--red);margin-bottom:10px;padding:10px 14px;background:var(--red-dim);border:1px solid rgba(244,112,112,.2);border-radius:7px;}
.auth-msg{font-size:12px;color:var(--acc);margin-bottom:10px;padding:10px 14px;background:var(--acc-dim);border:1px solid var(--acc-border);border-radius:7px;text-align:center;}

/* ─────────────────── SETTINGS PANEL ─────────────────── */
.settings-panel{
  position:fixed;top:0;right:0;bottom:0;width:360px;z-index:500;
  background:var(--c1);border-left:1px solid var(--grey3);
  box-shadow:-28px 0 64px rgba(0,0,0,.55);
  animation:slideIn .28s cubic-bezier(.34,1.56,.64,1);
  overflow-y:auto;
}
@keyframes slideIn{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:none}}
.settings-head{
  padding:28px 28px 20px;display:flex;align-items:center;justify-content:space-between;
  border-bottom:1px solid var(--grey3);position:sticky;top:0;background:var(--c1);z-index:1;
}
.settings-title{font-family:'DM Serif Display',serif;font-size:22px;display:flex;align-items:center;gap:10px;}
.settings-title-icon{font-size:18px;}
.settings-close{width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:var(--c2);border:1px solid var(--grey3);border-radius:8px;color:var(--txm);font-size:16px;transition:all .15s;}
.settings-close:hover{border-color:var(--red);color:var(--red);background:var(--red-dim);}
.settings-body{padding:24px 28px;}
.sett-section{margin-bottom:32px;}
.sett-section-title{font-size:10px;letter-spacing:3px;color:var(--txd);text-transform:uppercase;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid var(--grey3);}
.sett-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.03);}
.sett-row:last-child{border-bottom:none;}
.sett-label{font-size:13px;color:var(--tx);font-weight:500;}
.sett-desc{font-size:11px;color:var(--txd);margin-top:2px;}
.toggle{
  width:44px;height:25px;border-radius:13px;border:none;position:relative;cursor:pointer;
  background:var(--grey3);transition:background .2s;flex-shrink:0;
}
.toggle.on{background:var(--acc);}
.toggle::after{
  content:'';position:absolute;top:3px;left:3px;
  width:19px;height:19px;border-radius:50%;background:#fff;
  transition:transform .2s;box-shadow:0 1px 4px rgba(0,0,0,.3);
}
.toggle.on::after{transform:translateX(19px);}
.color-swatches{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;}
.swatch{
  width:34px;height:34px;border-radius:50%;cursor:pointer;border:2px solid transparent;
  transition:all .2s;flex-shrink:0;
}
.swatch:hover{transform:scale(1.12);}
.swatch.on{border-color:var(--tx);transform:scale(1.12);box-shadow:0 0 12px rgba(255,255,255,.2);}
.card-size-btns{display:flex;gap:6px;margin-top:8px;}
.size-btn{flex:1;padding:8px;font-size:11px;font-weight:600;background:var(--c2);border:1px solid var(--grey3);color:var(--txm);border-radius:7px;letter-spacing:.5px;transition:all .15s;}
.size-btn.on{background:var(--acc-dim);border-color:var(--acc-border);color:var(--acc);}
.theme-pills{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;align-items:center;}
.theme-pill{padding:8px 10px;font-size:11px;font-weight:700;border-radius:7px;border:1px solid var(--grey3);background:var(--c2);color:var(--txm);cursor:pointer;transition:all .15s;letter-spacing:.4px;}
.theme-pill.on{background:var(--acc-dim);border-color:var(--acc-border);color:var(--acc);}
.theme-pill:hover{border-color:var(--acc-border);color:var(--acc);}
.sett-export-btn{
  width:100%;padding:11px;font-size:12px;font-weight:600;
  background:var(--c2);border:1px solid var(--grey3);
  color:var(--txm);border-radius:8px;cursor:pointer;
  transition:all .15s;letter-spacing:.3px;margin-top:8px;
}
.sett-export-btn:hover{border-color:var(--acc-border);color:var(--acc);background:var(--acc-dim);}
.sett-danger-btn{
  width:100%;padding:11px;font-size:12px;font-weight:600;
  background:var(--c2);border:1px solid rgba(244,112,112,.2);
  color:var(--red);border-radius:8px;cursor:pointer;
  transition:all .15s;letter-spacing:.3px;margin-top:6px;
}
.sett-danger-btn:hover{background:var(--red-dim);}

/* ─────────────────── TOAST ─────────────────── */
.toast{
  position:fixed;bottom:28px;right:28px;z-index:999;
  background:var(--c2);border:1px solid var(--grey3);border-radius:12px;
  padding:13px 18px;font-size:13px;font-weight:500;
  box-shadow:0 18px 52px rgba(0,0,0,.65);
  display:flex;align-items:center;gap:10px;
  animation:toastIn .3s cubic-bezier(.34,1.56,.64,1);
}
@keyframes toastIn{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:none}}
.toast-dot{width:8px;height:8px;border-radius:50%;background:var(--acc);flex-shrink:0;box-shadow:0 0 8px var(--acc);}

/* ─────────────────── SECTION DIVIDER ─────────────────── */
.divider{height:1px;background:linear-gradient(to right,transparent,var(--grey3),transparent);margin:4px 52px;}

/* ─────────────────── RESPONSIVE ─────────────────── */
@media(max-width:768px){
  .nav{padding:0 18px;}
  .hero-content{left:18px;right:18px;max-width:none;}
  .sec-header{padding:0 18px 12px;}
  .row-scroll{padding:4px 18px 12px;}
  .stats-strip{margin:0 18px 4px;}
  .toolbar{padding:16px 18px 0;}
  .grid-wrap{padding:18px 18px 80px;}
  .page-header{padding:80px 18px 24px;}
  .divider{margin:4px 18px;}
  .settings-panel{width:100%;}
  .see-all-grid{grid-template-columns:repeat(auto-fill,minmax(130px,1fr));padding:16px 20px 24px;}
}
`;

// ─── POSTER IMAGE (fetches from TMDB by ID if hardcoded path fails or is null) ─
function PosterImage({ item, className, style, alt }) {
  const [src, setSrc] = useState(
    item.poster
      ? `${TMDB_IMG}${item.poster}`
      : item.poster_path
        ? `${TMDB_IMG}${item.poster_path}`
        : item.backdrop_path
          ? `${TMDB_IMG}${item.backdrop_path}`
          : "https://dummyimage.com/300x450/1a1a1a/ffffff&text=No+Image"
  );
  const fetchingRef = useRef(false);

  const fetchByTmdbId = useCallback(async () => {
    if (fetchingRef.current || !item.tmdbId) return;
    fetchingRef.current = true;
    try {
      const type = item.tmdbType || (item.type === "Movie" ? "movie" : "tv");
      const r = await fetch(`${TMDB_BASE}/${type}/${item.tmdbId}?api_key=${TMDB_KEY}`);
      const d = await r.json();
      if (d.poster_path) setSrc(`${TMDB_IMG}${d.poster_path}`);
      else setSrc(null);
    } catch { setSrc(null); }
  }, [item]);

  useEffect(() => {
    if (!src && item.tmdbId) fetchByTmdbId();
  }, []);

  const handleError = () => {
    if (!fetchingRef.current) fetchByTmdbId();
    else setSrc(null);
  };

  if (!src) {
    return (
      <div className={className || "no-img-box"} style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"var(--txd)", gap:5, fontSize:10, background:"var(--c3)", ...style }}>
        <div style={{ fontSize:28, opacity:.22 }}>
          {item.type === "Anime" ? "⛩" : item.type === "Movie" ? "🎬" : "📺"}
        </div>
        <span style={{ fontSize:9, letterSpacing:1 }}>{item.type}</span>
      </div>
    );
  }

  return <img className={className} style={style} src={src} alt={alt || item.title} loading="lazy" onError={handleError} />;
}

// ─── HERO CAROUSEL ────────────────────────────────────────────────────────────
function HeroCarousel({ items, onAdd, session, setShowAuth, autoplay = true }) {
  const [fallbackSlides, setFallbackSlides] = useState(HERO_ITEMS);
  const slides = items?.length ? items : fallbackSlides;
  const [idx, setIdx]             = useState(0);
  const [transitioning, setTrans] = useState(false);
  const intervalRef               = useRef(null);

  useEffect(() => {
    if (items?.length) return;
    let cancelled = false;
    const loadTrending = async () => {
      try {
        const r = await fetch(`${TMDB_BASE}/trending/all/week?api_key=${TMDB_KEY}`);
        const d = await r.json();
        const mapped = (d.results || [])
          .filter(r => r.backdrop_path)
          .slice(0, 20)
          .map(r => {
            const isMovie = r.media_type === "movie";
            const year = (r.release_date || r.first_air_date || "").split("-")[0];
            return {
              id: `tr-${r.id}`,
              tmdbId: r.id,
              tmdbType: isMovie ? "movie" : "tv",
              title: r.title || r.name || "Untitled",
              year,
              rating: r.vote_average ? r.vote_average.toFixed(1) : "N/A",
              type: isMovie ? "Movie" : "TV Show",
              poster: r.poster_path,
              backdrop: r.backdrop_path,
              streaming: [],
              overview: r.overview,
            };
          });
        if (!cancelled && mapped.length) setFallbackSlides(mapped);
      } catch {
        /* ignore */
      }
    };
    loadTrending();
    return () => { cancelled = true; };
  }, [items]);

  // Reset to first slide whenever data refreshes
  useEffect(() => { setIdx(0); }, [slides.length]);

  const goTo = (i) => {
    if (i === idx || transitioning || !slides.length) return;
    setTrans(true);
    setTimeout(() => { setIdx(i); setTrans(false); }, 400);
  };

  useEffect(() => {
    if (!autoplay || slides.length < 2) return;
    intervalRef.current = setInterval(() => {
      setTrans(true);
      setTimeout(() => { setIdx(p => (p + 1) % slides.length); setTrans(false); }, 400);
    }, 6500);
    return () => clearInterval(intervalRef.current);
  }, [autoplay, slides.length]);

  const item = slides[idx] || slides[0];
  if (!item) return null;
  const primaryOtt = item.streaming?.[0] ? OTT[item.streaming[0]] : null;

  return (
    <div className="hero-wrap">
      {slides.map((h, i) => (
        <div key={i}
          className={`hero-bg-img ${i === idx && !transitioning ? "active" : "enter"}`}
          style={{ backgroundImage:`url(${TMDB_W}${h.backdrop})`, zIndex: i === idx ? 1 : 0 }}
        />
      ))}
      <div className="hero-overlay" style={{ zIndex:2 }} />
      <div className="hero-content" style={{ zIndex:3 }}>
        <div className="hero-badge">⭐ TRENDING NOW</div>
        <div className="hero-title">{item.title}</div>
        <div className="hero-meta">
          <div className="hero-rating">★ {item.rating}</div>
          <div className="hero-type-tag">{item.type}</div>
          <div className="hero-year">{item.year}</div>
        </div>
        <p className="hero-overview">{item.overview}</p>
        <div className="hero-actions">
          <button className="btn-hero-play" onClick={() => session ? onAdd(item) : setShowAuth(true)}>
            ▶ &nbsp;Add to List
          </button>
          <button className="btn-hero-add" onClick={() => session ? onAdd({ ...item, status:"Want to Watch" }) : setShowAuth(true)}>
            + &nbsp;Watchlist
          </button>
          {primaryOtt && (
            <a className="btn-hero-stream" href={primaryOtt.url + encodeURIComponent(item.title)} target="_blank" rel="noopener noreferrer">
              <span className="stream-dot" style={{ background: primaryOtt.color }} />
              Watch on {primaryOtt.name}
            </a>
          )}
        </div>
      </div>
      <div className="hero-dots" style={{ zIndex:3 }}>
        {slides.map((_, i) => (
          <div key={i} className={`hero-dot${i === idx ? " on" : ""}`} onClick={() => goTo(i)} />
        ))}
      </div>
    </div>
  );
}

// ─── SEE ALL MODAL ────────────────────────────────────────────────────────────
function SeeAllModal({ title, emoji, items, onClose, onSelect }) {
  const [q, setQ] = useState("");
  const filtered  = items.filter(it => it.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="see-all-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="see-all-panel">
        <div className="see-all-head">
          <div className="see-all-title">
            <span>{emoji}</span> {title}
            <span style={{ fontSize:12, color:"var(--txm)", fontFamily:"'DM Sans',sans-serif", fontWeight:400, marginLeft:4 }}>{items.length} titles</span>
          </div>
          <button className="settings-close" onClick={onClose}>✕</button>
        </div>
        <div className="see-all-search">
          <input className="see-all-inp"
            placeholder={`Search in ${title.toLowerCase()}…`}
            value={q} onChange={e => setQ(e.target.value)} autoFocus />
        </div>
        <div className="see-all-grid">
          {filtered.map((item, i) => (
            <div key={item.id} className="row-card" style={{ width:"100%", animationDelay:`${i*.03}s` }}
              onClick={() => { onSelect(item); onClose(); }}>
              <div className="row-card-img-box">
                <PosterImage item={item} className="row-card-img" />
                <div className="row-card-grad" />
                <div className="row-card-type">{item.type}</div>
                <div className="row-card-hover">
                  <div className="row-card-hover-title">{item.title}</div>
                  <button
                    className="row-card-hover-btn"
                    onClick={e => { e.stopPropagation(); onSelect && onSelect(item); }}
                  >
                    + Add to List
                  </button>
                  {item.streaming && (
                    <div className="stream-badges-mini">
                      {item.streaming.map(k => (
                        <a key={k} className="stream-badge-mini"
                          href={OTT[k].url + encodeURIComponent(item.title)}
                          target="_blank" rel="noopener noreferrer"
                          style={{ background: OTT[k].color, color:"#fff" }}
                          onClick={e => e.stopPropagation()}>
                          {OTT[k].short}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="row-card-body">
                <div className="row-card-title">{item.title}</div>
                <div className="row-card-meta">
                  <div className="row-card-year">{item.year}</div>
                  <div className="row-card-rating">★ {item.rating}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROW SECTION ──────────────────────────────────────────────────────────────
function RowSection({ title, emoji, items, showRank, showOverview, onSelect, onSeeAll, showStreaming }) {
  const scrollRef      = useRef(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);

  const checkArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkArrows, { passive:true });
    checkArrows();
    return () => el.removeEventListener("scroll", checkArrows);
  }, [items]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 340, behavior:"smooth" });
  };

  return (
    <div className="catalog-section">
      <div className="sec-header">
        <div className="sec-title">
          <span className="sec-emoji">{emoji}</span>
          {title}
          <span className="sec-count">{items.length}</span>
        </div>
        <button className="sec-see-all" onClick={() => onSeeAll && onSeeAll()}>See all →</button>
      </div>
      <div className="row-section-wrap">
        {canLeft  && <button className="row-arrow row-arrow-left"  onClick={() => scroll(-1)}>‹</button>}
        {canRight && <button className="row-arrow row-arrow-right" onClick={() => scroll(1)}>›</button>}
        <div className="row-scroll" ref={scrollRef}>
          {items.map((item, i) => (
            <div key={item.id} className="row-card" onClick={() => onSelect(item)}
              style={{ animationDelay:`${i * 0.04}s` }}>
              <div className="row-card-img-box">
                <PosterImage item={item} className="row-card-img" />
                <div className="row-card-grad" />
                {showRank && <div className="row-card-rank">{i + 1}</div>}
                <div className="row-card-type">{item.type}</div>
                {/* Hover overlay */}
                <div className="row-card-hover">
                  <div className="row-card-hover-title">{item.title}</div>
                  <button
                    className="row-card-hover-btn"
                    onClick={e => {
                      e.stopPropagation();
                      onSelect && onSelect(item);
                      onClose();
                    }}
                  >
                    + Add to List
                  </button>
                  {showStreaming && item.streaming && (
                    <div className="stream-badges-mini">
                      {item.streaming.map(k => (
                        <a key={k} className="stream-badge-mini"
                          href={OTT[k].url + encodeURIComponent(item.title)}
                          target="_blank" rel="noopener noreferrer"
                          style={{ background: OTT[k].color, color:"#fff" }}
                          onClick={e => e.stopPropagation()}>
                          {OTT[k].short}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="row-card-body">
                <div className="row-card-title">{item.title}</div>
                <div className="row-card-meta">
                  <div className="row-card-year">{item.year}</div>
                  <div className="row-card-rating">★ {item.rating}</div>
                </div>
                {showOverview && item.overview && (
                  <div style={{ fontSize:10, color:"var(--txd)", marginTop:5, lineHeight:1.5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                    {item.overview}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS PANEL ───────────────────────────────────────────────────────────
function SettingsPanel({ settings, onChange, onClose, onExport, onClearCache }) {
  const SWATCHES = [
    { key:"green",  color:"#b2f0c5", label:"Jade"   },
    { key:"yellow", color:"#f4d06f", label:"Gold"   },
    { key:"blue",   color:"#8ebbf5", label:"Cobalt" },
    { key:"red",    color:"#f47070", label:"Ember"  },
  ];

  return (
    <div className="settings-panel">
      <div className="settings-head">
        <div className="settings-title">
          <span className="settings-title-icon">⚙️</span>
          Settings
        </div>
        <button className="settings-close" onClick={onClose}>✕</button>
      </div>
      <div className="settings-body">

        <div className="sett-section">
          <div className="sett-section-title">Appearance</div>
          <div className="sett-row" style={{ paddingTop:0, marginTop:-4 }}>
            <div>
              <div className="sett-label">Theme</div>
              <div className="sett-desc">Black, Light, or Neo (original)</div>
            </div>
            <div className="theme-pills">
              {[
                { key:"black", label:"Black" },
                { key:"light", label:"Light" },
                { key:"neo",   label:"Neo" },
              ].map(t => (
                <button key={t.key}
                  className={`theme-pill${settings.theme === t.key ? " on" : ""}`}
                  onClick={() => onChange("theme", t.key)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop:10 }}>
            <div className="flbl" style={{ marginBottom:4 }}>Accent Color</div>
            <div className="color-swatches">
              {SWATCHES.map(s => (
                <div key={s.key} title={s.label}
                  className={`swatch${settings.accentColor === s.key ? " on" : ""}`}
                  style={{ background: s.color }}
                  onClick={() => onChange("accentColor", s.key)}
                />
              ))}
            </div>
          </div>
          <div style={{ marginTop:16 }}>
            <div className="flbl" style={{ marginBottom:4 }}>Card Size</div>
            <div className="card-size-btns">
              {["small","medium","large"].map(s => (
                <button key={s} className={`size-btn${settings.cardSize === s ? " on" : ""}`}
                  onClick={() => onChange("cardSize", s)}>
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="sett-row" style={{ marginTop:14 }}>
            <div>
              <div className="sett-label">Cinematic Background</div>
              <div className="sett-desc">Film grain & gradient overlay</div>
            </div>
            <button className={`toggle${settings.cinematicBg ? " on" : ""}`}
              onClick={() => onChange("cinematicBg", !settings.cinematicBg)} />
          </div>
        </div>

        <div className="sett-section">
          <div className="sett-section-title">Display</div>
          {[
            { key:"showRatings",       label:"Show Ratings",       desc:"Show IMDb-style star ratings on cards" },
            { key:"showOverviews",     label:"Show Overviews",     desc:"Show plot summary under card title" },
            { key:"showStreaming",     label:"Show Streaming",     desc:"Show OTT platform badges on card hover" },
            { key:"animationsReduced", label:"Reduce Motion",      desc:"Minimize card hover & page animations" },
          ].map(opt => (
            <div key={opt.key} className="sett-row">
              <div>
                <div className="sett-label">{opt.label}</div>
                <div className="sett-desc">{opt.desc}</div>
              </div>
              <button className={`toggle${settings[opt.key] ? " on" : ""}`}
                onClick={() => onChange(opt.key, !settings[opt.key])} />
            </div>
          ))}
        </div>

        <div className="sett-section">
          <div className="sett-section-title">Discovery</div>
          {[
            { key:"autoplay",     label:"Hero Autoplay",   desc:"Auto-rotate the hero banner carousel" },
            { key:"adultContent", label:"Mature Content",  desc:"Include adult-rated titles in search" },
          ].map(opt => (
            <div key={opt.key} className="sett-row">
              <div>
                <div className="sett-label">{opt.label}</div>
                <div className="sett-desc">{opt.desc}</div>
              </div>
              <button className={`toggle${settings[opt.key] ? " on" : ""}`}
                onClick={() => onChange(opt.key, !settings[opt.key])} />
            </div>
          ))}
        </div>

        <div className="sett-section">
          <div className="sett-section-title">Language</div>
          <div className="sett-row">
            <div>
              <div className="sett-label">UI Language</div>
              <div className="sett-desc">Interface language preference</div>
            </div>
            <select className="fsel" style={{ width:"auto" }}
              value={settings.language}
              onChange={e => onChange("language", e.target.value)}>
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
        </div>

        <div className="sett-section">
          <div className="sett-section-title">Data</div>
          <button className="sett-export-btn" onClick={onExport}>⬇ Export My Catalog (JSON)</button>
          <button className="sett-export-btn" onClick={onClearCache} style={{ marginTop:6 }}>🗑 Clear Image Cache</button>
          <div style={{ fontSize:11, color:"var(--txd)", marginTop:14, lineHeight:1.7 }}>
            Your data is stored in Supabase and is private to your account. Export creates a JSON backup.
          </div>
        </div>

        <div className="sett-section">
          <div className="sett-section-title">About</div>
          <div style={{ fontSize:12, color:"var(--txd)", lineHeight:1.8 }}>
            <div style={{ marginBottom:6 }}>
              <span style={{ color:"var(--acc)", fontFamily:"'Bebas Neue',sans-serif", letterSpacing:2, fontSize:17 }}>Reel</span>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:2, fontSize:17 }}>log</span>
            </div>
            Powered by TMDB · Built with Supabase<br />
            Streaming data for informational use only.<br />
            Track every film, show &amp; anime you love.
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────
function AuthModal({ onClose }) {
  const [tab, setTab]         = useState("signin");
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");
  const [msg, setMsg]         = useState("");

  async function handleAuth() {
    setErr(""); setMsg(""); setLoading(true);
    try {
      if (tab === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password: pass, options:{ data:{ name } } });
        if (error) throw error;
        setMsg("Check your email to confirm your account!");
      }
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }

  return (
    <div className="backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <div className="auth-logo">Reel<span>log</span></div>
        <div className="auth-sub">{tab === "signin" ? "Welcome back!" : "Create your free account"}</div>
        <div className="auth-tabs">
          <button className={`auth-tab${tab === "signin" ? " on" : ""}`}
            onClick={() => { setTab("signin"); setErr(""); setMsg(""); }}>Sign in</button>
          <button className={`auth-tab${tab === "signup" ? " on" : ""}`}
            onClick={() => { setTab("signup"); setErr(""); setMsg(""); }}>Sign up</button>
        </div>
        {err && <div className="auth-err">{err}</div>}
        {msg && <div className="auth-msg">{msg}</div>}
        {tab === "signup" && (
          <input className="auth-inp" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        )}
        <input className="auth-inp" placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="auth-inp" placeholder="Password" type="password" value={pass} onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAuth()} />
        <button className="auth-btn" onClick={handleAuth} disabled={loading}>
          {loading ? "Loading..." : tab === "signin" ? "Sign in →" : "Create account →"}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── settings ──
  const [settings, setSettings] = useState(() => {
    try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem("rl_settings") || "{}") }; }
    catch { return DEFAULT_SETTINGS; }
  });
  const [showSettings, setShowSettings] = useState(false);

  function changeSetting(key, val) {
    setSettings(p => {
      const next = { ...p, [key]: val };
      localStorage.setItem("rl_settings", JSON.stringify(next));
      return next;
    });
  }

  const accentClass =
    settings.accentColor === "yellow" ? "acc-yellow" :
    settings.accentColor === "blue"   ? "acc-blue"   :
    settings.accentColor === "red"    ? "acc-red"    : "";

  // Sync theme to <html> so CSS variables cascade everywhere
  useEffect(() => {
    const root = document.documentElement;
    const cls  = `theme-${settings.theme || "black"}`;
    root.classList.remove("theme-black", "theme-light", "theme-neo");
    root.classList.add(cls);
  }, [settings.theme]);

  // ── auth ──
  const [session, setSession] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  // ── page ──
  const [page, setPage] = useState("home");

  // ── home content ──
  const [heroItems, setHeroItems]   = useState(HERO_ITEMS);
  const [homeAnime, setHomeAnime]   = useState(STATIC_ANIME);
  const [homeMovies, setHomeMovies] = useState(STATIC_MOVIES);
  const [homeSeries, setHomeSeries] = useState(STATIC_SERIES);

  // ── data ──
  const [allEntries, setAllEntries] = useState([]);
  const [myEntries,  setMyEntries]  = useState([]);
  const [loading, setLoading]       = useState(true);

  // ── filters ──
  const [filterType,   setFilterType]   = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy,       setSortBy]       = useState("added");

  // ── search ──
  const [search,    setSearch]    = useState("");
  const [results,   setResults]   = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDrop,  setShowDrop]  = useState(false);
  const searchRef = useRef(null);
  const debRef    = useRef(null);

  // ── modal ──
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [editId,    setEditId]    = useState(null);
  const [form,      setForm]      = useState({ status:"Want to Watch", rating:null, notes:"" });
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState(null);

  // ── see-all modal ──
  const [seeAll, setSeeAll] = useState(null); // { title, emoji, items }

  // ── nav scroll ──
  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    const h = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // ── Load live catalog / hero from TMDB ──
  useEffect(() => {
    const abort = new AbortController();
    const lang  = settings.language || "en";
    const adult = settings.adultContent ? "true" : "false";

    const mapItem = (r, typeLabel) => {
      const isMovie = typeLabel === "Movie" || r.media_type === "movie";
      const isTv    = typeLabel === "TV Show" || r.media_type === "tv";
      const isAnime = typeLabel === "Anime" || (!isMovie && isTv && (r.genre_ids || []).includes(16));
      return {
        id: `${typeLabel || r.media_type || "item"}-${r.id}`,
        tmdbId: r.id,
        tmdbType: isMovie ? "movie" : "tv",
        title: r.title || r.name || "Untitled",
        year: (r.release_date || r.first_air_date || "").split("-")[0],
        rating: r.vote_average ? r.vote_average.toFixed(1) : "N/A",
        type: isAnime ? "Anime" : isMovie ? "Movie" : "TV Show",
        poster: r.poster_path || r.backdrop_path,
        backdrop: r.backdrop_path || r.poster_path,
        poster_path: r.poster_path,
        backdrop_path: r.backdrop_path,
        streaming: [],
        overview: r.overview,
      };
    };

    async function loadHome() {
      try {
        const [trendAll, trendAllIN, trendMovies, trendTv, anime] = await Promise.all([
          fetch(`${TMDB_BASE}/trending/all/week?api_key=${TMDB_KEY}&language=${lang}&include_adult=${adult}`, { signal: abort.signal }).then(r => r.json()).catch(() => null),
          fetch(`${TMDB_BASE}/trending/all/week?api_key=${TMDB_KEY}&language=en-IN&region=IN&include_adult=${adult}`, { signal: abort.signal }).then(r => r.json()).catch(() => null),
          fetch(`${TMDB_BASE}/trending/movie/week?api_key=${TMDB_KEY}&language=${lang}&include_adult=${adult}`, { signal: abort.signal }).then(r => r.json()).catch(() => null),
          fetch(`${TMDB_BASE}/trending/tv/week?api_key=${TMDB_KEY}&language=${lang}&include_adult=${adult}`, { signal: abort.signal }).then(r => r.json()).catch(() => null),
          fetch(`${TMDB_BASE}/discover/tv?api_key=${TMDB_KEY}&language=${lang}&with_genres=16&sort_by=popularity.desc&include_adult=${adult}`, { signal: abort.signal }).then(r => r.json()).catch(() => null),
        ]);

        const valid = r =>
          (r.media_type === "movie" || r.media_type === "tv") &&
          r.backdrop_path && r.poster_path;

        const globalList = (trendAll?.results || []).filter(valid);
        const indiaList  = (trendAllIN?.results || []).filter(valid);

        const heroCombined = [];
        const seen = new Set();
        const pushList = (list) => {
          for (const r of list) {
            if (heroCombined.length >= 20) break;
            if (seen.has(r.id)) continue;
            heroCombined.push(r);
            seen.add(r.id);
          }
        };

        // Ensure some Indian titles make it in, then fill with global trending.
        pushList(indiaList.slice(0, 6));
        pushList(globalList);
        pushList(indiaList.slice(6));

        if (heroCombined.length) setHeroItems(heroCombined.slice(0, 20).map(r => mapItem(r)));
        if (trendMovies?.results?.length) setHomeMovies(trendMovies.results.slice(0, 20).map(r => mapItem(r, "Movie")));
        if (trendTv?.results?.length)     setHomeSeries(trendTv.results.slice(0, 20).map(r => mapItem(r, "TV Show")));
        if (anime?.results?.length)       setHomeAnime(anime.results.slice(0, 20).map(r => mapItem(r, "Anime")));
      } catch {}
    }

    loadHome();
    return () => abort.abort();
  }, [settings.language, settings.adultContent]);

  // ── Auth listener ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) {
        setShowAuth(false);
        setPage("mylist");
      } else {
        // Logged out — clear all user data immediately
        setAllEntries([]);
        setMyEntries([]);
        setPage("home");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Load entries (only when signed in) ──
  useEffect(() => {
    if (!session) {
      setAllEntries([]);
      setMyEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase.from("entries")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const rows = data || [];
        setMyEntries(rows);
        setAllEntries(rows);
      })
      .finally(() => setLoading(false));
  }, [session]);

  // ── TMDB search ──
  useEffect(() => {
    if (!search.trim()) { setResults([]); setShowDrop(false); return; }
    clearTimeout(debRef.current);
    debRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await fetch(`${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(search)}`);
        const d = await r.json();
        const f = (d.results || []).filter(x => x.media_type === "movie" || x.media_type === "tv").slice(0, 8);
        setResults(f); setShowDrop(f.length > 0);
      } catch {}
      setSearching(false);
    }, 380);
  }, [search]);

  // ── Close dropdown on outside click ──
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
    if (!session) { setShowDrop(false); setSearch(""); setShowAuth(true); return; }
    const type = getType(r);
    const year = (r.release_date || r.first_air_date || "").split("-")[0];
    setModalData({ title:r.title||r.name, type, year, poster:r.poster_path, tmdb_id:r.id, overview:r.overview });
    setForm({ status:"Want to Watch", rating:null, notes:"" });
    setEditId(null); setShowDrop(false); setSearch(""); setShowModal(true);
  }

  function openFromCard(item) {
    if (!session) { setShowAuth(true); return; }
    setModalData({ title:item.title, type:item.type, year:item.year, poster:item.poster, tmdbId:item.tmdbId, tmdbType:item.tmdbType, overview:item.overview });
    setForm({ status:"Want to Watch", rating:null, notes:"" });
    setEditId(null); setShowModal(true);
  }

  function openManual() {
    if (!session) { setShowAuth(true); return; }
    setModalData({ title:"", type:"Movie", year:"", poster:null, manual:true });
    setForm({ status:"Want to Watch", rating:null, notes:"" });
    setEditId(null); setShowModal(true);
  }

  function openEdit(entry) {
    setModalData({ title:entry.title, type:entry.type, year:entry.year, poster:entry.poster, tmdb_id:entry.tmdb_id });
    setForm({ status:entry.status, rating:entry.rating, notes:entry.notes||"" });
    setEditId(entry.id); setShowModal(true);
  }

  async function handleSave() {
    const title = modalData.manual ? (modalData.manualTitle||"").trim() : modalData.title;
    if (!title || !session) return;
    setSaving(true);
    try {
      const row = {
        title, type:modalData.type, year:modalData.year,
        poster:modalData.poster, tmdb_id:modalData.tmdb_id,
        user_id:session.user.id,
        user_name:session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
        ...form
      };
      if (editId !== null) {
        const { data } = await supabase.from("entries").update(row).eq("id", editId).select();
        const updated = data[0];
        setAllEntries(p => p.map(e => e.id === editId ? updated : e));
        setMyEntries(p  => p.map(e => e.id === editId ? updated : e));
        showT("Updated!");
      } else {
        const { data } = await supabase.from("entries").insert(row).select();
        const newRow = data[0];
        setAllEntries(p => [newRow, ...p]);
        setMyEntries(p  => [newRow, ...p]);
        showT("Added to catalog!");
      }
      setShowModal(false);
    } catch { showT("Something went wrong."); }
    setSaving(false);
  }

  async function handleDelete(id) {
    await supabase.from("entries").delete().eq("id", id);
    setAllEntries(p => p.filter(e => e.id !== id));
    setMyEntries(p  => p.filter(e => e.id !== id));
    showT("Removed.");
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(myEntries, null, 2)], { type:"application/json" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `reellog-export-${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(url);
    showT("Catalog exported!");
  }

  function handleClearCache() {
    // Clear any local state that acts as cache
    showT("Cache cleared!");
  }

  // ── filters ──
  const source = page === "mylist" ? myEntries : allEntries;
  const filtered = source
    .filter(e => filterType   === "All" || e.type   === filterType)
    .filter(e => filterStatus === "All" || e.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "title")  return a.title.localeCompare(b.title);
      if (sortBy === "rating") return (b.rating||0) - (a.rating||0);
      if (sortBy === "year")   return (b.year||"0").localeCompare(a.year||"0");
      return 0;
    });

  const counts = {
    Watched:         source.filter(e => e.status === "Watched").length,
    Watching:        source.filter(e => e.status === "Watching").length,
    "Want to Watch": source.filter(e => e.status === "Want to Watch").length,
  };

  // ──────────────────── RENDER ─────────────────────────
  return (
    <div className={accentClass}>
      <style>{CSS}</style>

      {/* ── Cinematic grain overlay ── */}
      {settings.cinematicBg && (
        <svg className="grain-svg" aria-hidden="true">
          <filter id="grain-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-noise)" />
        </svg>
      )}

      {/* ── NAV ── */}
      <nav className={`nav${navScrolled ? " nav-scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => setPage("home")}>
          <div className="nav-dot" />
          Reel<span>log</span>
        </div>
        <div className="nav-links">
          <button className={`nav-link${page === "home"    ? " active" : ""}`} onClick={() => setPage("home")}>Home</button>
          <button className={`nav-link${page === "explore" ? " active" : ""}`} onClick={() => setPage("explore")}>Explore</button>
          {session && <button className={`nav-link${page === "mylist" ? " active" : ""}`} onClick={() => setPage("mylist")}>My List</button>}
        </div>
        <div className="nav-right">
          {session ? (
            <>
              <span className="nav-user">{session.user.email?.split("@")[0]}</span>
              <button className="btn-sm btn-acc" onClick={openManual}>+ Add</button>
              <button className="btn-sm btn-outline" onClick={() => supabase.auth.signOut()}>Sign out</button>
            </>
          ) : (
            <>
              <button className="btn-sm btn-outline" onClick={() => setShowAuth(true)}>Sign in</button>
              <button className="btn-sm btn-acc"     onClick={() => setShowAuth(true)}>Join free</button>
            </>
          )}
          <button className="btn-icon" onClick={() => setShowSettings(s => !s)} title="Settings">
            <span className="settings-gear">⚙️</span>
          </button>
        </div>
      </nav>

      {/* ── HOME PAGE ── */}
      {page === "home" && (
        <>
          <HeroCarousel
            items={heroItems}
            autoplay={settings.autoplay}
            onAdd={openFromCard}
            session={session}
            setShowAuth={setShowAuth}
          />
          <div style={{ paddingTop:32 }}>
            <RowSection title="Top 10 Anime"         emoji="🏆" items={homeAnime.slice(0,10)} showRank
              showOverview={settings.showOverviews} showStreaming={settings.showStreaming}
              onSelect={openFromCard}
              onSeeAll={() => setSeeAll({ title:"Top 10 Anime", emoji:"🏆", items:homeAnime })} />
            <div className="divider" />
            <RowSection title="Trending Anime"       emoji="🍥" items={homeAnime} showRank={false}
              showOverview={settings.showOverviews} showStreaming={settings.showStreaming}
              onSelect={openFromCard}
              onSeeAll={() => setSeeAll({ title:"Trending Anime", emoji:"🍥", items:homeAnime })} />
            <div className="divider" />
            <RowSection title="Popular Movies"       emoji="🎬" items={homeMovies} showRank={false}
              showOverview={settings.showOverviews} showStreaming={settings.showStreaming}
              onSelect={openFromCard}
              onSeeAll={() => setSeeAll({ title:"Popular Movies", emoji:"🎬", items:homeMovies })} />
            <div className="divider" />
            <RowSection title="Binge-worthy Series"  emoji="📺" items={homeSeries} showRank={false}
              showOverview={settings.showOverviews} showStreaming={settings.showStreaming}
              onSelect={openFromCard}
              onSeeAll={() => setSeeAll({ title:"Binge-worthy Series", emoji:"📺", items:homeSeries })} />
            <div style={{ height:64 }} />
          </div>
        </>
      )}

      {/* ── EXPLORE / MY LIST ── */}
      {(page === "explore" || page === "mylist") && (
        <>
          {!session && (
            <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
              <div style={{ textAlign:"center", maxWidth:430 }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:50, color:"var(--acc)", letterSpacing:3, textShadow:"0 0 36px var(--acc-glow)", marginBottom:8 }}>
                  Reel<span style={{ color:"var(--tx)" }}>log</span>
                </div>
                <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, marginBottom:12, lineHeight:1.2 }}>
                  Your list is <em style={{ color:"var(--acc)", fontStyle:"italic" }}>private</em>
                </div>
                <p style={{ fontSize:14, color:"var(--txm)", lineHeight:1.85, marginBottom:30 }}>
                  Sign in to access your personal catalog. Your list is visible only to you — nobody else can see what you've added.
                </p>
                <button className="btn-acc btn-sm"
                  style={{ padding:"14px 38px", fontSize:14, fontWeight:700, borderRadius:9 }}
                  onClick={() => setShowAuth(true)}>
                  Sign in to view your list →
                </button>
                <div style={{ marginTop:16, fontSize:12, color:"var(--txd)" }}>
                  No account?&nbsp;
                  <span style={{ color:"var(--acc)", cursor:"pointer" }} onClick={() => setShowAuth(true)}>Join free</span>
                </div>
              </div>
            </div>
          )}

          {session && <>
            <div className="page-header">
              <div className="page-eyebrow">{page === "mylist" ? "Your collection" : "Your catalog"}</div>
              <div className="page-h1">
                {page === "mylist" ? <>My <em>List</em></> : <>My <em>Catalog</em></>}
              </div>
              <div className="page-count">{source.length} titles</div>
            </div>

            <div className="stats-strip">
              {Object.entries(counts).map(([s, c]) => (
                <div key={s} className={`stat-chip${filterStatus === s ? " on" : ""}`}
                  onClick={() => setFilterStatus(filterStatus === s ? "All" : s)}>
                  <div className="stat-n" style={{ color:SCOLOR[s] }}>{c}</div>
                  <div className="stat-l">{s}</div>
                </div>
              ))}
            </div>

            <div className="toolbar">
              <div className="search-wrap" ref={searchRef}>
                <span className="search-ico">⌕</span>
                <input className="search-inp"
                  placeholder="Search movies, anime, shows from TMDB..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  onFocus={() => results.length && setShowDrop(true)}
                />
                {searching && <span className="spin-ico">◌</span>}
                {showDrop && (
                  <div className="drop">
                    {results.map(r => (
                      <div key={r.id} className="drop-row" onClick={() => selectResult(r)}>
                        {r.poster_path
                          ? <img className="drop-img" src={`${TMDB_IMG}${r.poster_path}`} alt="" />
                          : <div className="drop-img" style={{ display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🎬</div>}
                        <div style={{ flex:1, minWidth:0 }}>
                          <div className="drop-ti">{r.title || r.name}</div>
                          <div className="drop-me">{(r.release_date||r.first_air_date||"").split("-")[0]} · ★ {r.vote_average?.toFixed(1)}</div>
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

            <div className="grid-wrap">
              {loading ? (
                <div className="loader"><div className="ldot"/><div className="ldot"/><div className="ldot"/></div>
              ) : (
                <div className={`grid${settings.cardSize === "small" ? " small" : settings.cardSize === "large" ? " large" : ""}`}>
                  {filtered.length === 0 && (
                    <div className="empty-state">
                      <div className="empty-icon">🎬</div>
                      <div className="empty-title">{page === "mylist" ? "Your list is empty" : "Nothing here yet"}</div>
                      <div className="empty-sub">{page === "mylist" ? "Search for a title and add it!" : "Be the first to add something"}</div>
                      {page === "mylist" && <button className="btn-sm btn-acc" style={{ marginTop:8 }} onClick={openManual}>+ Add title</button>}
                    </div>
                  )}
                  {filtered.map((entry, i) => (
                    <div key={entry.id} className="card" style={{ animationDelay:`${Math.min(i*.04,.4)}s` }}>
                      <div className="card-img-box">
                        {entry.poster
                          ? <img className="card-img" src={`${TMDB_IMG}${entry.poster}`} alt={entry.title} loading="lazy"
                              onError={e => { e.currentTarget.style.display="none"; }} />
                          : <div className="no-img-box">
                              <div className="no-img-icon">{entry.type==="Anime"?"⛩":entry.type==="Movie"?"🎬":"📺"}</div>
                              <span>{entry.type}</span>
                            </div>}
                        <div className="card-grad" />
                        <div className="card-status-tag" style={{ color:SCOLOR[entry.status], borderColor:SCOLOR[entry.status]+"44" }}>
                          {SICON[entry.status]} {entry.status}
                        </div>
                        {session && entry.user_id === session.user.id && (
                          <div className="card-btns">
                            <button className="card-btn" onClick={e => { e.stopPropagation(); openEdit(entry); }}>✎</button>
                            <button className="card-btn" onClick={e => { e.stopPropagation(); handleDelete(entry.id); }}>✕</button>
                          </div>
                        )}
                      </div>
                      <div className="card-body">
                        <div className="card-title">{entry.title}</div>
                        <div className="card-meta-row">
                          <span className="card-type">{entry.type}</span>
                          <span className="card-year">{entry.year}</span>
                        </div>
                        {settings.showRatings && entry.rating > 0 && (
                          <div className="card-stars">
                            {[1,2,3,4,5].map(s => <span key={s} className={`s${entry.rating>=s?" on":""}`}>★</span>)}
                          </div>
                        )}
                        {settings.showOverviews && entry.notes && (
                          <div className="card-overview">{entry.notes}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>}
        </>
      )}

      {/* ── ADD / EDIT MODAL ── */}
      {showModal && modalData && (
        <div className="backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-head">
              {modalData.poster
                ? <img className="modal-poster" src={`${TMDB_IMG}${modalData.poster}`} alt=""
                    onError={e => e.currentTarget.style.display="none"} />
                : modalData.tmdbId
                  ? <PosterImage item={{ poster:null, tmdbId:modalData.tmdbId, tmdbType:modalData.tmdbType||"movie", type:modalData.type||"Movie" }}
                      style={{ width:72, height:104, borderRadius:9, flexShrink:0 }} />
                  : <div className="modal-poster" style={{ display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, color:"var(--txd)" }}>🎬</div>}
              <div style={{ flex:1 }}>
                {modalData.manual
                  ? <input className="finp" placeholder="Enter title..." value={modalData.manualTitle||""} onChange={e=>setModalData(d=>({...d,manualTitle:e.target.value}))} style={{ marginBottom:6 }} />
                  : <div className="modal-ti">{modalData.title}</div>}
                <div className="modal-sub">{modalData.type}{modalData.year?` · ${modalData.year}`:""}</div>
                {modalData.overview && <div className="modal-ov">"{modalData.overview.slice(0,110)}…"</div>}
              </div>
            </div>
            <div className="modal-body">
              {modalData.manual && (
                <div className="frow" style={{ marginBottom:14 }}>
                  <div className="field">
                    <label className="flbl">Type</label>
                    <select className="fsel" value={modalData.type} onChange={e=>setModalData(d=>({...d,type:e.target.value}))}>
                      {["Movie","Anime","TV Show"].map(t => <option key={t}>{t}</option>)}
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
                  {STATUSES.map(s => (
                    <button key={s} className={`pill${form.status===s?" on":""}`}
                      style={form.status===s?{background:SCOLOR[s]+"22",borderColor:SCOLOR[s],color:SCOLOR[s]}:{}}
                      onClick={() => setForm(f=>({...f,status:s}))}>
                      {SICON[s]} {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="flbl">Rating</label>
                <div className="str-row">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`str${form.rating>=s?" on":""}`}
                      onClick={() => setForm(f=>({...f,rating:f.rating===s?null:s}))}>★</span>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="flbl">Notes</label>
                <textarea className="fta" placeholder="Your thoughts…" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn-save" onClick={handleSave} disabled={saving}>{saving?"Saving…":editId!==null?"Save Changes":"Add to Catalog"}</button>
              <button className="btn-cxl" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SEE ALL MODAL ── */}
      {seeAll && (
        <SeeAllModal
          title={seeAll.title}
          emoji={seeAll.emoji}
          items={seeAll.items}
          onClose={() => setSeeAll(null)}
          onSelect={openFromCard}
        />
      )}

      {/* ── SETTINGS PANEL ── */}
      {showSettings && (
        <>
          <div className="backdrop" style={{ zIndex:499 }} onClick={() => setShowSettings(false)} />
          <SettingsPanel
            settings={settings}
            onChange={changeSetting}
            onClose={() => setShowSettings(false)}
            onExport={handleExport}
            onClearCache={handleClearCache}
          />
        </>
      )}

      {/* ── AUTH MODAL ── */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* ── TOAST ── */}
      {toast && <div className="toast"><div className="toast-dot"/>{toast}</div>}
    </div>
  );
}

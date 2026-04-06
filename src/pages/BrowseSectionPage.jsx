import { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  EXPLORE_CATEGORY_GROUPS,
  EXPLORE_GENRE_CARDS,
  EXPLORE_COUNTRY_CARDS,
  EXPLORE_LANGUAGE_CARDS,
  EXPLORE_SUB_FAMILY_FRIENDLY,
  EXPLORE_SUB_AWARD_WINNERS,
  EXPLORE_SUB_EDITORS_PICK,
  EXPLORE_SUB_ANIME,
  EXPLORE_SUB_FRANCHISE,
} from "../lib/constants";

// ─── Config ───────────────────────────────────────────────────────────────────

const SECTION_META = {
  category: { label: "Categories", tagline: "Every genre, every mood, every story" },
  genre: { label: "Genres", tagline: "From edge-of-seat thrillers to heartwarming dramas" },
  country: { label: "Countries", tagline: "Cinema without borders" },
  language: { label: "Languages", tagline: "The world speaks in stories" },
  "family-friendly": { label: "Family Friendly", tagline: "Great for all ages, all tastes" },
  "award-winners": { label: "Award Winners", tagline: "The very best, recognized by the world" },
  "editors-pick": { label: "Editor's Pick", tagline: "Handpicked by our curators" },
  anime: { label: "Anime", tagline: "From shōnen epics to slice-of-life gems" },
  franchise: { label: "Franchise", tagline: "Worlds that never end" },
};

const SEARCHABLE = new Set(["category", "genre", "country", "language"]);

// Full A–Z alphabet for sidebar (always shown, unavailable letters dimmed)
const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// 16-color cinematic dark gradient palette (for non-category sections)
const GRADIENTS = [
  "linear-gradient(145deg, #0d0019 0%, #1e0040 55%, #2d0060 100%)",
  "linear-gradient(145deg, #001528 0%, #003060 55%, #004880 100%)",
  "linear-gradient(145deg, #1a0800 0%, #3d1c00 55%, #5a2a00 100%)",
  "linear-gradient(145deg, #001a00 0%, #003a00 55%, #005500 100%)",
  "linear-gradient(145deg, #1a0000 0%, #3a0000 55%, #5c1010 100%)",
  "linear-gradient(145deg, #001818 0%, #003535 55%, #004848 100%)",
  "linear-gradient(145deg, #100d24 0%, #221c42 55%, #302860 100%)",
  "linear-gradient(145deg, #1a0018 0%, #3a003a 55%, #580058 100%)",
  "linear-gradient(145deg, #141800 0%, #2e3800 55%, #404d00 100%)",
  "linear-gradient(145deg, #001a10 0%, #003828 55%, #004d38 100%)",
  "linear-gradient(145deg, #18001a 0%, #360038 55%, #4e0056 100%)",
  "linear-gradient(145deg, #0d1818 0%, #1e3030 55%, #2a4242 100%)",
  "linear-gradient(145deg, #1a1200 0%, #3a2c00 55%, #544000 100%)",
  "linear-gradient(145deg, #000e1c 0%, #001e3c 55%, #002e5c 100%)",
  "linear-gradient(145deg, #1c000e 0%, #3c001e 55%, #5a002e 100%)",
  "linear-gradient(145deg, #0a1800 0%, #1e3600 55%, #2c4d00 100%)",
];

function slugify(str) {
  return (str || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// ─── Page-scoped styles ───────────────────────────────────────────────────────

const PAGE_STYLES = `
/* ── Hero ─────────────────────────────────────────────────────────────── */
.bsp-page { min-height: 100vh; background: var(--bk); padding-bottom: 80px; }

.bsp-hero {
  position: relative;
  padding: 116px 52px 72px;
  overflow: hidden;
}
.bsp-hero::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 100px;
  background: linear-gradient(to bottom, transparent, var(--bk));
  pointer-events: none; z-index: 2;
}
.bsp-orb {
  position: absolute; border-radius: 50%;
  pointer-events: none; filter: blur(100px);
  animation: bspFloat 9s ease-in-out infinite alternate;
}
.bsp-orb-1 {
  width: 560px; height: 560px;
  background: radial-gradient(ellipse, var(--acc-dim) 0%, transparent 70%);
  top: -220px; left: -80px;
}
.bsp-orb-2 {
  width: 420px; height: 420px;
  background: radial-gradient(ellipse, rgba(80,40,160,0.12) 0%, transparent 70%);
  top: -80px; right: 120px;
  animation-delay: 3s;
}
.bsp-orb-3 {
  width: 320px; height: 320px;
  background: radial-gradient(ellipse, rgba(0,80,120,0.1) 0%, transparent 70%);
  bottom: -40px; left: 38%;
  animation-delay: 6s;
}
@keyframes bspFloat {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(24px,-18px) scale(1.1); }
}
.bsp-hero-inner { position: relative; z-index: 3; }

/* Breadcrumb */
.bsp-crumb {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; color: var(--txd);
  letter-spacing: 0.8px; margin-bottom: 28px;
}
.bsp-crumb-link { cursor: pointer; transition: color .2s; }
.bsp-crumb-link:hover { color: var(--acc); }
.bsp-crumb-sep { opacity: 0.35; }
.bsp-crumb-active { color: var(--txm); }

/* Hero title */
.bsp-hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(64px, 9vw, 120px);
  line-height: 0.88;
  letter-spacing: 2px;
  background: linear-gradient(135deg, var(--tx) 20%, var(--acc) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 18px;
}
.bsp-hero-tagline {
  font-size: 16px; color: var(--txm);
  font-weight: 300; max-width: 460px;
  line-height: 1.6; margin-bottom: 8px;
  letter-spacing: 0.2px;
}
.bsp-hero-count {
  font-size: 11px; color: var(--txd);
  letter-spacing: 3px; text-transform: uppercase;
  margin-bottom: 36px;
}

/* Search */
.bsp-search-wrap { position: relative; max-width: 540px; }
.bsp-search-icon {
  position: absolute; left: 20px; top: 50%;
  transform: translateY(-50%);
  font-size: 17px; color: var(--txd);
  pointer-events: none;
}
.bsp-search {
  width: 100%;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50px;
  color: var(--tx);
  padding: 16px 52px 16px 54px;
  font-size: 15px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
}
.bsp-search:focus {
  border-color: var(--acc-border);
  background: rgba(255,255,255,0.07);
  box-shadow: 0 0 0 4px var(--acc-dim), 0 12px 40px rgba(0,0,0,0.3);
}
.bsp-search::placeholder { color: var(--txd); }
.bsp-search-clear {
  position: absolute; right: 18px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none;
  color: var(--txd); font-size: 22px;
  cursor: pointer; padding: 4px 8px;
  transition: color 0.2s; line-height: 1;
}
.bsp-search-clear:hover { color: var(--tx); }

/* Back button (fixed) */
.bsp-back {
  position: fixed; top: 78px; right: 24px; z-index: 300;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50px;
  padding: 10px 22px;
  font-size: 13px; font-weight: 500;
  color: var(--txm);
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.2px;
}
.bsp-back:hover {
  border-color: var(--acc-border);
  color: var(--acc);
  background: var(--acc-dim);
}

/* ── Section label ───────────────────────────────────────────────────── */
.bsp-section-wrap { padding: 0 52px; margin-bottom: 32px; }
.bsp-section-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.bsp-section-label {
  display: flex; align-items: center; gap: 10px;
  font-size: 11px; letter-spacing: 3px;
  color: var(--acc); text-transform: uppercase; font-weight: 700;
}
.bsp-section-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--acc); box-shadow: 0 0 8px var(--acc-glow);
  animation: bspPulse 2s ease-in-out infinite;
}
@keyframes bspPulse {
  0%,100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(0.6); opacity: 0.5; }
}
.bsp-section-count { font-size: 12px; color: var(--txd); letter-spacing: 0.5px; }

/* ── Featured grid ───────────────────────────────────────────────────── */
.bsp-featured-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* ── All grid ─────────────────────────────────────────────────────────── */
.bsp-all-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
  gap: 12px;
}

/* ── Premium Card ─────────────────────────────────────────────────────── */
.bsp-card {
  position: relative; overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.06);
  cursor: pointer; text-align: left; padding: 0;
  animation: bspCardIn 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
  transition:
    transform 0.38s cubic-bezier(0.34,1.4,0.64,1),
    box-shadow 0.38s ease,
    border-color 0.3s ease;
  will-change: transform;
}
@keyframes bspCardIn {
  from { opacity: 0; transform: translateY(24px) scale(0.94); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.bsp-card[data-size="featured"] { aspect-ratio: 2.4 / 1; }
.bsp-card[data-size="normal"]   { aspect-ratio: 3 / 2; }
.bsp-card:hover {
  transform: translateY(-8px) scale(1.04);
  border-color: var(--acc-border);
  box-shadow:
    0 24px 56px rgba(0,0,0,0.65),
    0 0 0 1px var(--acc-border),
    0 0 48px var(--acc-glow);
}
.bsp-card:active { transform: translateY(-3px) scale(1.01); }
.bsp-card-noise {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
  opacity: 0.35; mix-blend-mode: overlay;
  pointer-events: none; z-index: 1;
}
.bsp-card-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 55%, transparent 100%);
  pointer-events: none; z-index: 2;
}
.bsp-card-glow-ring {
  position: absolute; inset: 0; border-radius: 18px;
  box-shadow: inset 0 0 40px var(--acc-glow);
  opacity: 0; pointer-events: none; z-index: 3;
  transition: opacity 0.38s ease;
}
.bsp-card:hover .bsp-card-glow-ring { opacity: 1; }
.bsp-card-watermark {
  position: absolute;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 130px; line-height: 1;
  opacity: 0.055; color: #fff;
  bottom: -16px; right: -8px;
  pointer-events: none; user-select: none;
  transition: transform 0.38s ease, opacity 0.38s ease;
  z-index: 2;
}
.bsp-card:hover .bsp-card-watermark {
  transform: scale(1.18) translate(-12px,-10px);
  opacity: 0.12;
}
.bsp-card-body {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  justify-content: flex-end;
  padding: 18px 20px; z-index: 5;
}
.bsp-card-icon-wrap {
  font-size: 22px; margin-bottom: 8px;
  display: block; line-height: 1;
  filter: drop-shadow(0 2px 12px rgba(0,0,0,0.6));
  transition: transform 0.38s cubic-bezier(0.34,1.56,0.64,1);
}
.bsp-card:hover .bsp-card-icon-wrap { transform: translateY(-5px) scale(1.2); }
.bsp-card-name {
  font-size: 15px; font-weight: 700;
  color: #fff; line-height: 1.2; letter-spacing: 0.2px;
  text-shadow: 0 2px 16px rgba(0,0,0,0.7);
  transition: color 0.25s;
}
.bsp-card[data-size="featured"] .bsp-card-name {
  font-size: 19px;
  font-family: 'DM Serif Display', serif;
  font-style: italic;
}
.bsp-card:hover .bsp-card-name { color: var(--acc); }
.bsp-card-cta {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; color: var(--acc);
  letter-spacing: 0.8px; margin-top: 5px;
  opacity: 0; transform: translateY(8px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.bsp-card:hover .bsp-card-cta { opacity: 1; transform: translateY(0); }

/* ── Empty state ──────────────────────────────────────────────────────── */
.bsp-empty {
  padding: 100px 0; text-align: center;
  animation: bspCardIn 0.4s ease both;
}
.bsp-empty-icon { font-size: 44px; margin-bottom: 18px; opacity: 0.35; }
.bsp-empty-title { font-size: 19px; color: var(--txm); margin-bottom: 8px; font-weight: 500; }
.bsp-empty-sub { font-size: 14px; color: var(--txd); }

/* ════════════════════════════════════════════════════════════════════════
   CATEGORY A–Z LAYOUT
   ════════════════════════════════════════════════════════════════════════ */
.cat-wrap {
  display: flex;
  position: relative;
  padding: 0 52px 80px;
}

/* Main scrollable content area */
.cat-main {
  flex: 1;
  min-width: 0;
  padding-right: 64px; /* clearance for sidebar */
}

/* ── Letter group ──────────────────────────────────────────────────────── */
.cat-group { margin-bottom: 4px; }

/* Sticky letter header */
.cat-letter-hd {
  position: sticky;
  top: 66px; /* accounts for nav height */
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 0 5px;
  background: linear-gradient(to bottom, var(--bk) 65%, transparent 100%);
}
.cat-letter-char {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  line-height: 1;
  color: var(--acc);
  text-shadow: 0 0 16px var(--acc-glow);
  min-width: 28px;
  text-align: center;
  font-weight: 600;
}
.cat-letter-rule {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.1);
}

/* ── Category pills ────────────────────────────────────────────────────── */
.cat-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 3px 0 16px 40px; /* indent aligned under smaller letter */
}

.cat-pill {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-top-color: rgba(255,255,255,0.12);
  border-radius: 50px;
  padding: 6px 16px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--txm);
  cursor: pointer;
  letter-spacing: 0.2px;
  font-family: 'DM Sans', sans-serif;
  transition:
    background  0.2s ease,
    border-color 0.2s ease,
    color       0.2s ease,
    transform   0.2s cubic-bezier(0.34,1.56,0.64,1),
    box-shadow  0.2s ease;
  animation: bspCardIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
}
.cat-pill:hover {
  background: var(--acc-dim);
  border-color: var(--acc-border);
  color: var(--acc);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 18px rgba(0,0,0,0.3), 0 0 0 1px var(--acc-border);
}
.cat-pill:active { transform: translateY(-1px) scale(1.01); }

/* ── A–Z Sidebar ───────────────────────────────────────────────────────── */
.cat-sidebar {
  position: fixed;
  right: 18px;
  top: 58%;
  transform: translateY(-50%);
  z-index: 200; 
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 10px 6px;
  background: rgba(10,14,12,0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 24px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.4);
  /* Keep it from overlapping too far inward */
  max-height: calc(100vh - 140px);
}

.cat-sidebar-btn {
  width: 28px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  color: var(--txd);
  border-radius: 7px;
  cursor: pointer;
  background: none; border: none;
  padding: 0;
  transition: color 0.15s ease, background 0.15s ease, transform 0.15s ease;
  letter-spacing: 0.3px;
  line-height: 1;
}
.cat-sidebar-btn:hover:not(.cat-sidebar-disabled) {
  color: var(--tx);
  background: rgba(255,255,255,0.07);
  transform: scale(1.15);
}
.cat-sidebar-btn.cat-sidebar-active {
  color: var(--acc);
  background: var(--acc-dim);
  font-size: 12px;
}
.cat-sidebar-btn.cat-sidebar-disabled {
  opacity: 0.2; /* ⚠️ CSS opacity is 0–1. Do NOT set to 100 — use 0.2 for 20% */
  cursor: default;
  pointer-events: none;
}

/* Active indicator dot (to the left of active letter) */
.cat-sidebar-active-dot {
  width: 4px; height: 4px; border-radius: 50%;
  background: var(--acc); box-shadow: 0 0 6px var(--acc-glow);
  position: absolute; left: -2px;
  pointer-events: none;
  transition: top 0.2s ease;
}

/* ── Responsive ───────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .bsp-featured-grid { grid-template-columns: 1fr 1fr; }
  .cat-wrap { padding: 0 20px 80px; }
  .cat-main { padding-right: 0; }

  /* On mobile: sidebar becomes horizontal tab bar at top of section */
  .cat-sidebar {
    position: sticky;
    top: 70px;
    right: auto;
    transform: none;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    width: 100%;
    border-radius: 12px;
    padding: 8px 14px;
    max-height: none;
    margin-bottom: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
  .cat-sidebar::-webkit-scrollbar { display: none; }

  .cat-sidebar-btn {
    min-width: 28px;
    height: 30px;
    border-radius: 8px;
  }
  .cat-sidebar-active-dot { display: none; }
  .cat-pills { padding-left: 0; }
}
@media (max-width: 768px) {
  .bsp-hero { padding: 100px 20px 56px; }
  .bsp-section-wrap { padding: 0 20px; }
  .bsp-featured-grid { grid-template-columns: 1fr; }
  .bsp-all-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
  .bsp-back { top: 70px; right: 14px; }
}
`;

// ─── PremiumCard (for non-category sections) ─────────────────────────────────

function PremiumCard({ item, index, section, navigate, size = "normal" }) {
  const gradient = item.gradient ?? GRADIENTS[index % GRADIENTS.length];
  const slug = slugify(item.iso || item.name);
  const isFeat = size === "featured";
  const watermark = (item.name || "").substring(0, 2).toUpperCase();

  return (
    <button
      className="bsp-card"
      data-size={size}
      style={{ background: gradient, animationDelay: `${Math.min(index * 0.04, 0.8)}s` }}
      onClick={() => navigate(`/explore/${section}/${slug}`)}
    >
      <span className="bsp-card-noise" aria-hidden />
      <span className="bsp-card-overlay" aria-hidden />
      <span className="bsp-card-glow-ring" aria-hidden />
      <span className="bsp-card-watermark" aria-hidden>{watermark}</span>
      <div className="bsp-card-body">
        {item.icon && <span className="bsp-card-icon-wrap" aria-hidden>{item.icon}</span>}
        <div className="bsp-card-name">{item.name}</div>
        {isFeat && <div className="bsp-card-cta">Explore →</div>}
      </div>
    </button>
  );
}

// ─── SectionBlock (for non-category sections) ─────────────────────────────────

function SectionBlock({ label, count, items, section, navigate, size, gridClass }) {
  if (!items.length) return null;
  return (
    <div className="bsp-section-wrap">
      <div className="bsp-section-header">
        <div className="bsp-section-label">
          <span className="bsp-section-dot" />
          {label}
        </div>
        {count != null && <span className="bsp-section-count">{count} items</span>}
      </div>
      <div className={gridClass}>
        {items.map((item, i) => (
          <PremiumCard
            key={item.name}
            item={item}
            index={i}
            section={section}
            navigate={navigate}
            size={size}
          />
        ))}
      </div>
    </div>
  );
}

// ─── A–Z Sidebar ─────────────────────────────────────────────────────────────

function AlphabetSidebar({ available, active, onSelect }) {
  return (
    <nav className="cat-sidebar" aria-label="Jump to letter">
      {ALL_LETTERS.map(letter => {
        const exists = available.has(letter);
        const isActive = letter === active;
        return (
          <button
            key={letter}
            className={[
              "cat-sidebar-btn",
              isActive ? "cat-sidebar-active" : "",
              !exists ? "cat-sidebar-disabled" : "",
            ].join(" ").trim()}
            onClick={() => exists && onSelect(letter)}
            aria-label={`Jump to ${letter}`}
            tabIndex={exists ? 0 : -1}
          >
            {letter}
          </button>
        );
      })}
    </nav>
  );
}

// ─── Category A–Z Browse ──────────────────────────────────────────────────────

function CategoryBrowse({ filteredGroups, navigate, section, totalCount }) {
  const letters = Object.keys(filteredGroups);
  const available = useMemo(() => new Set(letters), [letters]);
  const [activeLetter, setActiveLetter] = useState(letters[0] ?? null);

  // Refs for each letter section element
  const groupRefs = useRef({});

  // IntersectionObserver — track which letter group is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting section
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveLetter(visible[0].target.dataset.letter);
        }
      },
      // Top margin = nav (~66px) + sticky header (~84px)
      { rootMargin: "-66px 0px -65% 0px", threshold: 0 }
    );

    Object.values(groupRefs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [filteredGroups]);

  // Reset when filtered groups change (search)
  const lettersKey = letters.join(",");
  useEffect(() => {
    if (letters.length > 0) setActiveLetter(letters[0]);
  }, [lettersKey]);

  // Smooth scroll to letter section
  const scrollTo = (letter) => {
    setActiveLetter(letter);
    const el = groupRefs.current[letter];
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="cat-wrap">
        {/* ── Main content ── */}
        <div className="cat-main">

          {letters.length === 0 && (
            <div className="bsp-empty">
              <div className="bsp-empty-icon">🔍</div>
              <div className="bsp-empty-title">No categories found</div>
              <div className="bsp-empty-sub">Try a different search term</div>
            </div>
          )}

          {letters.map(letter => (
            <div
              key={letter}
              className="cat-group"
              ref={el => { groupRefs.current[letter] = el; }}
              data-letter={letter}
              id={`cat-letter-${letter}`}
            >
              {/* Sticky letter heading */}
              <div className="cat-letter-hd">
                <span className="cat-letter-char">{letter}</span>
                <span className="cat-letter-rule" />
              </div>

              {/* Pill list */}
              <div className="cat-pills">
                {filteredGroups[letter].map((cat, i) => (
                  <button
                    key={`${letter}-${cat}`}
                    className="cat-pill"
                    style={{ animationDelay: `${Math.min(i * 0.03, 0.6)}s` }}
                    onClick={() => navigate(`/explore/${section}/${slugify(cat)}`)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Fixed A–Z sidebar ── */}
      <AlphabetSidebar
        available={available}
        active={activeLetter}
        onSelect={scrollTo}
      />
    </>
  );
}

// ─── BrowseHero ───────────────────────────────────────────────────────────────

function BrowseHero({ label, tagline, count, search, setSearch, hasSearch, onBack }) {
  return (
    <div className="bsp-hero">
      <div className="bsp-orb bsp-orb-1" aria-hidden />
      <div className="bsp-orb bsp-orb-2" aria-hidden />
      <div className="bsp-orb bsp-orb-3" aria-hidden />

      <div className="bsp-hero-inner">
        <div className="bsp-crumb">
          <span className="bsp-crumb-link" onClick={onBack}>Explore</span>
          <span className="bsp-crumb-sep">›</span>
          <span className="bsp-crumb-active">{label}</span>
        </div>

        <div className="bsp-hero-title">{label}</div>
        {tagline && <div className="bsp-hero-tagline">{tagline}</div>}
        <div className="bsp-hero-count">{count} {count === 1 ? "selection" : "selections"}</div>

        {hasSearch && (
          <div className="bsp-search-wrap">
            <span className="bsp-search-icon">⌕</span>
            <input
              className="bsp-search"
              placeholder={`Search ${label.toLowerCase()}…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="bsp-search-clear" onClick={() => setSearch("")}>×</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BrowseSectionPage() {
  const { section } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const meta = SECTION_META[section] ?? { label: section, tagline: "" };
  const hasSearch = SEARCHABLE.has(section);
  const q = search.trim().toLowerCase();

  // ── Category: keep grouped for A-Z layout ─────────────────────────────────
  const filteredCatGroups = useMemo(() => {
    if (section !== "category") return null;
    const next = {};
    Object.entries(EXPLORE_CATEGORY_GROUPS).forEach(([letter, cats]) => {
      const list = q ? cats.filter(c => c.toLowerCase().includes(q)) : cats;
      if (list.length) next[letter] = list;
    });
    return next;
  }, [section, q]);

  const catTotalCount = useMemo(() => {
    if (!filteredCatGroups) return 0;
    return Object.values(filteredCatGroups).flat().length;
  }, [filteredCatGroups]);

  // ── All other sections: flat item list ────────────────────────────────────
  const allItems = useMemo(() => {
    switch (section) {
      case "genre": return EXPLORE_GENRE_CARDS;
      case "country": return EXPLORE_COUNTRY_CARDS;
      case "language": return EXPLORE_LANGUAGE_CARDS;
      case "family-friendly": return EXPLORE_SUB_FAMILY_FRIENDLY;
      case "award-winners": return EXPLORE_SUB_AWARD_WINNERS;
      case "editors-pick": return EXPLORE_SUB_EDITORS_PICK;
      case "anime": return EXPLORE_SUB_ANIME;
      case "franchise": return EXPLORE_SUB_FRANCHISE;
      default: return [];
    }
  }, [section]);

  const filtered = useMemo(
    () => q ? allItems.filter(i => i.name.toLowerCase().includes(q)) : allItems,
    [allItems, q]
  );

  // Featured = first 25% of items, min 6
  const FEAT_COUNT = useMemo(() => Math.min(6, Math.floor(allItems.length * 0.25)), [allItems.length]);
  const featured = !q && filtered.length > FEAT_COUNT + 2 ? filtered.slice(0, FEAT_COUNT) : [];
  const rest = featured.length ? filtered.slice(FEAT_COUNT) : filtered;

  // Display count
  const displayCount = section === "category" ? catTotalCount : filtered.length;

  return (
    <>
      <style>{PAGE_STYLES}</style>

      <div className="bsp-page">
        {/* Fixed back button */}
        <button className="bsp-back" onClick={() => navigate("/explore")}>
          ← Explore
        </button>

        {/* Cinematic hero */}
        <BrowseHero
          label={meta.label}
          tagline={meta.tagline}
          count={displayCount}
          search={search}
          setSearch={setSearch}
          hasSearch={hasSearch}
          onBack={() => navigate("/explore")}
        />

        {/* ── CATEGORY: A–Z indexed layout ── */}
        {section === "category" && filteredCatGroups && (
          <CategoryBrowse
            filteredGroups={filteredCatGroups}
            navigate={navigate}
            section={section}
            totalCount={catTotalCount}
          />
        )}

        {/* ── ALL OTHER SECTIONS: premium card grid ── */}
        {section !== "category" && (
          <>
            {featured.length > 0 && (
              <SectionBlock
                label="Featured"
                items={featured}
                section={section}
                navigate={navigate}
                size="featured"
                gridClass="bsp-featured-grid"
              />
            )}

            {rest.length > 0 && (
              <SectionBlock
                label={q ? `Results for "${search}"` : `All ${meta.label}`}
                count={rest.length}
                items={rest}
                section={section}
                navigate={navigate}
                size="normal"
                gridClass="bsp-all-grid"
              />
            )}

            {filtered.length === 0 && (
              <div className="bsp-empty" style={{ padding: "80px 52px" }}>
                <div className="bsp-empty-icon">🔍</div>
                <div className="bsp-empty-title">No results found</div>
                <div className="bsp-empty-sub">Try a different search term</div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

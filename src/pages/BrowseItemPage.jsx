import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowUp, FiChevronDown, FiMonitor, FiSearch } from "react-icons/fi";
import { TMDB_KEY, TMDB_BASE, TMDB_IMG } from "../lib/constants";

// ─── Config ───────────────────────────────────────────────────────────────────

const SECTION_LABELS = {
  category:          "Category",
  genre:             "Genre",
  country:           "Country",
  language:          "Language",
  "family-friendly": "Family Friendly",
  "award-winners":   "Award Winners",
  "editors-pick":    "Editor's Pick",
  anime:             "Anime",
  franchise:         "Franchise",
};

const FAMILY_SAFE_GENRES = [16, 10751, 35];
const FAMILY_BLOCKED_GENRES = [27, 80, 53];
const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

// ─── Category → TMDB genre ID mapping ────────────────────────────────────────
// Maps slugified category names to TMDB genre IDs (or null for keyword-based)
const CATEGORY_GENRE_MAP = {
  "action":           { movie: [28],    tv: [10759] },
  "adventure":        { movie: [12],    tv: [10759] },
  "animation":        { movie: [16],    tv: [16] },
  "animated":         { movie: [16],    tv: [16] },
  "anime":            { movie: [16],    tv: [16] },
  "comedy":           { movie: [35],    tv: [35] },
  "crime":            { movie: [80],    tv: [80] },
  "documentary":      { movie: [99],    tv: [99] },
  "drama":            { movie: [18],    tv: [18] },
  "family-drama":     { movie: [18],    tv: [18] },
  "fantasy":          { movie: [14],    tv: [10765] },
  "history":          { movie: [36],    tv: [36] },
  "historical":       { movie: [36],    tv: [36] },
  "historical-fiction": { movie: [36], tv: [36] },
  "horror":           { movie: [27],    tv: [27] },
  "music":            { movie: [10402], tv: [10402] },
  "musical":          { movie: [10402], tv: [10402] },
  "mystery":          { movie: [9648],  tv: [9648] },
  "romance":          { movie: [10749], tv: [10749] },
  "rom-com":          { movie: [10749, 35], tv: [10749, 35] },
  "science-fiction":  { movie: [878],   tv: [10765] },
  "sci-fi":           { movie: [878],   tv: [10765] },
  "thriller":         { movie: [53],    tv: [53] },
  "war":              { movie: [10752], tv: [10768] },
  "western":          { movie: [37],    tv: [37] },
  "biography":        { movie: [36, 18],tv: [36, 18] },
  "biopic":           { movie: [36, 18],tv: [36, 18] },
  // Mood-based → closest genre match
  "dark-comedy":      { movie: [35, 18],tv: [35, 18] },
  "dark-gritty":      { movie: [18, 27],tv: [18, 27] },
  "feel-good":        { movie: [35, 10749], tv: [35] },
  "heartbreaking":    { movie: [18],    tv: [18] },
  "mind-bending":     { movie: [878, 9648], tv: [10765, 9648] },
  "psychological":    { movie: [53, 27],tv: [53, 27] },
  "supernatural":     { movie: [14, 27],tv: [10765, 27] },
  "dystopia":         { movie: [878, 28], tv: [10765, 28] },
  "post-apocalyptic": { movie: [878, 28], tv: [10765, 28] },
  "survival":         { movie: [28, 18],tv: [18, 28] },
  "heist":            { movie: [80, 28],tv: [80] },
  "spy":              { movie: [28, 53],tv: [10759] },
  "espionage":        { movie: [28, 53],tv: [10759] },
  "political":        { movie: [18, 36],tv: [18] },
  "social-drama":     { movie: [18],    tv: [18] },
  "legal-drama":      { movie: [18],    tv: [18] },
  "superhero":        { movie: [28, 878],tv: [10759, 10765] },
  "gangster":         { movie: [80, 18],tv: [80] },
  "neo-noir":         { movie: [80, 53],tv: [80] },
  "noir":             { movie: [80, 53],tv: [80] },
  "monster":          { movie: [27, 14],tv: [27] },
  "ghost":            { movie: [27],    tv: [27] },
  "zombie-apocalypse":{ movie: [27, 28],tv: [27, 28] },
  "coming-of-age":    { movie: [18],    tv: [18] },
  "teen":             { movie: [18],    tv: [18] },
  "sports":           { movie: [18, 28],tv: [18] },
  "dance":            { movie: [10402, 18], tv: [18] },
  "travel":           { movie: [99],    tv: [99] },
  "epic":             { movie: [28, 36],tv: [10759] },
  "disaster":         { movie: [28, 12],tv: [28] },
  "satire":           { movie: [35, 18],tv: [35, 18] },
  "parody":           { movie: [35],    tv: [35] },
  "mockumentary":     { movie: [35, 99],tv: [35, 99] },
  "found-footage":    { movie: [27],    tv: [27] },
  "slasher":          { movie: [27],    tv: [27] },
  "body-horror":      { movie: [27],    tv: [27] },
  "cult-classic":     { movie: [18],    tv: [18] },
  "art-house":        { movie: [18],    tv: [18] },
  "indie":            { movie: [18],    tv: [18] },
  "cyberpunk":        { movie: [878, 53],tv: [10765, 53] },
  "futuristic":       { movie: [878],   tv: [10765] },
  "time-travel":      { movie: [878, 12],tv: [10765] },
  "adaptation":       { movie: [18],    tv: [18] },
  "based-on-book":    { movie: [18],    tv: [18] },
  "based-on-game":    { movie: [28, 12],tv: [28] },
  "based-on-true-story": { movie: [99, 18], tv: [18] },
  "christmas":        { movie: [35, 10751], tv: [35] },
  "festive":          { movie: [35, 10751], tv: [35] },
  "friendship":       { movie: [18, 35],tv: [18, 35] },
  "revenge":          { movie: [28, 18],tv: [18] },
  "inspirational":    { movie: [18],    tv: [18] },
  "empowering":       { movie: [18],    tv: [18] },
};

// Fallback → try to find best match from name itself
function getGenreIds(slug) {
  if (CATEGORY_GENRE_MAP[slug]) return CATEGORY_GENRE_MAP[slug];
  // Try partial match
  const entry = Object.entries(CATEGORY_GENRE_MAP).find(([key]) => slug.includes(key) || key.includes(slug));
  if (entry) return entry[1];
  // Default: Drama + Action — broad enough to always return content
  return { movie: [18], tv: [18] };
}

// ─── TMDB fetch helpers ───────────────────────────────────────────────────────

async function fetchPage(type, genreIds, page = 1) {
  const base = `${TMDB_BASE}/discover/${type}`;
  const params = new URLSearchParams({
    api_key: TMDB_KEY,
    with_genres: genreIds.join(","),
    include_adult: "false",
    sort_by: "vote_count.desc",
    "vote_count.gte": type === "movie" ? "100" : "50",
    page,
    language: "en-US",
  });
  const res = await fetch(`${base}?${params}`);
  if (!res.ok) throw new Error(`TMDB ${type} page ${page} failed`);
  const data = await res.json();
  return data.results || [];
}

async function fetchMultiplePages(type, genreIds, pages = 3) {
  const requests = Array.from({ length: pages }, (_, i) => fetchPage(type, genreIds, i + 1));
  const results = await Promise.allSettled(requests);
  return results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value);
}

function isFamilySafeTitle(item) {
  const genres = item.genre_ids || [];
  const hasSafeGenre = genres.some(id => FAMILY_SAFE_GENRES.includes(id));
  const hasBlockedGenre = genres.some(id => FAMILY_BLOCKED_GENRES.includes(id));
  return !item.adult && hasSafeGenre && !hasBlockedGenre;
}

// ─── Page-scoped styles ───────────────────────────────────────────────────────

const STYLES = `
.bip-page { min-height: 100vh; background: var(--bk); padding-bottom: 80px; }

/* ── Header ────────────────────────────────────────────────────── */
.bip-header {
  position: relative;
  padding: 100px 52px 48px;
  overflow: hidden;
}
.bip-header::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 80px;
  background: linear-gradient(to bottom, transparent, var(--bk));
  pointer-events: none;
}
.bip-header-orb {
  position: absolute; border-radius: 50%;
  pointer-events: none; filter: blur(90px);
  opacity: .6;
}
.bip-header-orb-1 {
  width: 450px; height: 450px;
  background: radial-gradient(ellipse, var(--acc-dim) 0%, transparent 70%);
  top: -200px; left: -60px;
  animation: bipFloat 10s ease-in-out infinite alternate;
}
.bip-header-orb-2 {
  width: 360px; height: 360px;
  background: radial-gradient(ellipse, rgba(60,30,120,0.1) 0%, transparent 70%);
  top: -80px; right: 80px;
  animation: bipFloat 10s ease-in-out 4s infinite alternate;
}
@keyframes bipFloat {
  from { transform: translate(0,0); }
  to   { transform: translate(20px,-15px); }
}
.bip-inner { position: relative; z-index: 2; }

/* Breadcrumb */
.bip-crumb {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; color: var(--txd);
  letter-spacing: 0.8px; margin-bottom: 22px;
}
.bip-crumb-link { cursor: pointer; transition: color .2s; }
.bip-crumb-link:hover { color: var(--acc); }
.bip-crumb-sep { opacity: .35; }

/* Title */
.bip-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(52px, 8vw, 96px);
  line-height: .9;
  letter-spacing: 1px;
  background: linear-gradient(135deg, var(--tx) 20%, var(--acc) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}
.bip-subtitle {
  font-size: 14px; color: var(--txd);
  letter-spacing: 3px; text-transform: uppercase;
}

/* Back button */
.bip-back {
  position: fixed; top: 78px; right: 24px; z-index: 300;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50px;
  padding: 10px 22px;
  font-size: 13px; font-weight: 500;
  color: var(--txm);
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: 'DM Sans', sans-serif;
}
.bip-back:hover {
  border-color: var(--acc-border); color: var(--acc);
  background: var(--acc-dim);
}

/* ── Type tabs ─────────────────────────────────────────────────── */
.bip-tabs {
  display: flex; gap: 8px;
  padding: 0 52px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.bip-tab {
  padding: 8px 22px;
  font-size: 13px; font-weight: 600;
  border-radius: 50px;
  border: 1px solid var(--grey3);
  background: var(--c1);
  color: var(--txm);
  cursor: pointer;
  transition: all .2s;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: .3px;
}
.bip-tab:hover { border-color: var(--acc-border); color: var(--acc); }
.bip-tab.on {
  background: var(--acc); color: var(--bk);
  border-color: var(--acc); font-weight: 700;
}

/* ── Content sections ──────────────────────────────────────────── */
.bip-section { margin-bottom: 40px; }
.bip-section-head {
  display: flex; align-items: center; gap: 12px;
  padding: 0 52px 16px;
}
.bip-section-title {
  font-family: 'DM Serif Display', serif;
  font-size: 22px; color: var(--tx);
}
.bip-section-count {
  font-size: 12px; color: var(--txd);
  letter-spacing: 1.5px; text-transform: uppercase;
}

/* ── Horizontal scroll row ─────────────────────────────────────── */
.bip-row {
  display: flex; gap: 12px;
  padding: 4px 52px 16px;
  overflow-x: auto; scrollbar-width: none;
  scroll-behavior: smooth;
}
.bip-row::-webkit-scrollbar { display: none; }

/* ── Poster card ───────────────────────────────────────────────── */
.bip-card {
  flex-shrink: 0; width: 140px;
  cursor: pointer;
  animation: bipCardIn .45s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes bipCardIn {
  from { opacity: 0; transform: translateY(16px) scale(.94); }
  to   { opacity: 1; transform: none; }
}
.bip-card-poster {
  position: relative;
  aspect-ratio: 2/3;
  border-radius: 12px;
  overflow: hidden;
  background: var(--c2);
  border: 1px solid rgba(255,255,255,.06);
  box-shadow: 0 4px 16px rgba(0,0,0,.4);
  transition: transform .28s cubic-bezier(.34,1.4,.64,1), box-shadow .28s ease, border-color .28s ease;
}
.bip-card:hover .bip-card-poster {
  transform: translateY(-6px) scale(1.04);
  box-shadow: 0 14px 36px rgba(0,0,0,.55), 0 0 0 1px var(--acc-border);
  border-color: var(--acc-border);
}
.bip-card-img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: transform .4s ease;
}
.bip-card:hover .bip-card-img { transform: scale(1.07); }
.bip-card-grad {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.85) 0%, transparent 55%);
}
.bip-card-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,.75);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity .25s;
  z-index: 2;
}
.bip-card:hover .bip-card-overlay { opacity: 1; }
.bip-card-play {
  width: 38px; height: 38px; border-radius: 50%;
  background: var(--acc); color: var(--bk);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; border: none; cursor: pointer;
  transition: transform .2s;
}
.bip-card-play:hover { transform: scale(1.12); }
.bip-card-no-img {
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  color: var(--txd); gap: 6px; font-size: 10px;
  background: var(--c3); text-align: center; padding: 8px;
}
.bip-card-info { padding: 10px 2px 0; }
.bip-card-title {
  font-size: 11.5px; font-weight: 500;
  color: var(--tx); line-height: 1.35;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  margin-bottom: 3px;
}
.bip-card-meta {
  display: flex; align-items: center; gap: 6px;
}
.bip-card-year { font-size: 10px; color: var(--txd); }
.bip-card-rating {
  display: flex; align-items: center; gap: 3px;
  font-size: 10px; color: var(--gold);
  font-weight: 600;
}

/* ── Skeleton loading ──────────────────────────────────────────── */
.bip-skeleton-row {
  display: flex; gap: 12px;
  padding: 4px 52px 16px;
  overflow: hidden;
}
.bip-skeleton-card {
  flex-shrink: 0; width: 140px;
}
.bip-skeleton-poster {
  aspect-ratio: 2/3; border-radius: 12px;
  background: linear-gradient(90deg, var(--c2) 25%, var(--c3) 50%, var(--c2) 75%);
  background-size: 200% 100%;
  animation: bipShimmer 1.6s infinite;
}
.bip-skeleton-line {
  height: 11px; border-radius: 6px; margin-top: 10px;
  background: linear-gradient(90deg, var(--c2) 25%, var(--c3) 50%, var(--c2) 75%);
  background-size: 200% 100%;
  animation: bipShimmer 1.6s infinite .15s;
}
.bip-skeleton-line.short { width: 60%; margin-top: 5px; }
@keyframes bipShimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Error / empty ─────────────────────────────────────────────── */
.bip-empty {
  padding: 80px 52px; text-align: center;
}
.bip-empty-icon { font-size: 40px; margin-bottom: 14px; opacity: .35; }
.bip-empty-title { font-size: 17px; color: var(--txm); margin-bottom: 6px; }
.bip-empty-sub { font-size: 13px; color: var(--txd); }

/* ── Media type badge ──────────────────────────────────────────── */
.bip-card-badge {
  position: absolute;
  top: 8px; left: 8px;
  font-size: 9px; font-weight: 700;
  letter-spacing: 0.8px; text-transform: uppercase;
  color: rgba(255,255,255,0.9);
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 4px;
  padding: 2px 6px;
  z-index: 3;
  pointer-events: none;
}

/* ── Grid view ─────────────────────────────────────────────────── */
.bip-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 14px;
  padding: 0 52px 16px;
}
.bip-grid-refresh { animation: bipGridRefresh .24s ease; }
@keyframes bipGridRefresh {
  from { opacity: .55; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}


/* Filter bar */
.bip-filterbar {
  position: sticky;
  top: 68px;
  z-index: 110;
  margin: 0 52px 14px;
  padding: 12px 16px;
  border-radius: 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 18px 36px rgba(0,0,0,0.45), 0 0 30px rgba(52,211,153,0.12);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* Search */
.bip-fb-search {
  position: relative;
  flex: 1 1 230px;
  min-width: 180px;
}
.bip-fb-search-icon {
  position: absolute; left: 12px; top: 50%;
  transform: translateY(-50%);
  font-size: 14px; color: rgba(255,255,255,0.72);
  pointer-events: none;
}
.bip-fb-input {
  width: 100%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50px;
  color: var(--tx);
  padding: 8px 14px 8px 36px;
  font-size: 12.5px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: all .2s ease;
}
.bip-fb-input:focus {
  border-color: rgba(167,243,208,0.7);
  background: rgba(255,255,255,0.1);
  box-shadow: 0 0 0 3px rgba(74,222,128,0.2);
}
.bip-fb-input::placeholder { color: var(--txd); }

/* All / Movies / Series */
.bip-fb-pills {
  display: flex;
  gap: 4px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 50px;
  padding: 4px;
}
.bip-fb-pill {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 50px;
  border: none;
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  transition: all .2s ease;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: .2px;
  white-space: nowrap;
}
.bip-fb-pill:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
  transform: scale(1.05);
}
.bip-fb-pill.on {
  background: linear-gradient(to right, #86efac, #34d399);
  color: #04150b;
  box-shadow: 0 10px 24px rgba(52,211,153,0.35);
  font-weight: 700;
}

/* Switches */
.bip-fb-switches {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.bip-fb-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 7px;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.1);
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.72);
  cursor: pointer;
  transition: all .2s ease;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
}
.bip-fb-switch:hover {
  background: rgba(255,255,255,0.15);
  transform: scale(1.05);
}
.bip-fb-switch-track {
  width: 34px;
  height: 20px;
  border-radius: 999px;
  background: rgba(255,255,255,0.14);
  position: relative;
  transition: background .2s ease;
  border: 1px solid rgba(255,255,255,0.2);
  flex-shrink: 0;
}
.bip-fb-switch-thumb {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  background: #f8fafc;
  transition: transform .2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.35);
}
.bip-fb-switch.on .bip-fb-switch-track {
  background: #4ade80;
  border-color: #4ade80;
}
.bip-fb-switch.on .bip-fb-switch-thumb {
  transform: translateX(14px);
  background: #05220f;
}

/* Dropdowns */
.bip-fb-dropdown-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.bip-fb-dropdown { position: relative; }
.bip-fb-drop-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 184px;
  padding: 7px 12px;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.78);
  font-size: 12px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  cursor: pointer;
  transition: all .2s ease;
}
.bip-fb-drop-trigger:hover {
  background: rgba(255,255,255,0.1);
  transform: scale(1.05);
}
.bip-fb-drop-icon {
  display: inline-flex;
  align-items: center;
  color: rgba(255,255,255,0.82);
}
.bip-fb-drop-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bip-fb-drop-caret {
  margin-left: auto;
  transition: transform .2s ease;
  color: rgba(255,255,255,0.6);
}
.bip-fb-dropdown.open .bip-fb-drop-caret { transform: rotate(180deg); }
.bip-fb-drop-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  min-width: 220px;
  padding: 6px;
  border-radius: 12px;
  background: rgba(0,0,0,0.9);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 18px 34px rgba(0,0,0,0.52);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  opacity: 0;
  transform: translateY(-8px);
  pointer-events: none;
  transition: opacity .2s ease, transform .2s ease;
  z-index: 140;
}
.bip-fb-dropdown.open .bip-fb-drop-menu {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
.bip-fb-drop-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  background: transparent;
  border-radius: 10px;
  padding: 8px 10px;
  color: rgba(255,255,255,0.78);
  font-size: 12px;
  cursor: pointer;
  transition: all .2s ease;
}
.bip-fb-drop-item:hover { background: rgba(255,255,255,0.1); }
.bip-fb-drop-item.on {
  background: rgba(52,211,153,0.16);
  color: #b9ffd8;
  box-shadow: inset 0 0 0 1px rgba(52,211,153,0.25), 0 0 18px rgba(52,211,153,0.2);
}
.bip-fb-check {
  font-size: 10px;
  letter-spacing: .5px;
  text-transform: uppercase;
}

/* Count + active mode */
.bip-fb-meta {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}
.bip-fb-mode-chip {
  border-radius: 999px;
  padding: 5px 10px;
  border: 1px solid rgba(52,211,153,0.5);
  background: rgba(52,211,153,0.16);
  color: #adffd2;
  font-size: 10px;
  letter-spacing: .9px;
  text-transform: uppercase;
  box-shadow: 0 0 18px rgba(52,211,153,0.2);
}
.bip-fb-count {
  font-size: 10.5px;
  color: var(--txd);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .bip-filterbar {
    top: 64px;
    margin: 0 20px 14px;
    padding: 10px 12px;
    gap: 8px;
  }
  .bip-fb-meta {
    order: 0;
    margin-left: 0;
    width: 100%;
    justify-content: space-between;
  }
  .bip-fb-search { order: 1; flex: 1 1 100%; }
  .bip-fb-pills { order: 2; }
  .bip-fb-switches { order: 3; }
  .bip-fb-dropdown-wrap {
    order: 4;
    width: 100%;
  }
  .bip-fb-dropdown {
    flex: 1 1 0;
    min-width: 0;
  }
  .bip-fb-drop-trigger {
    width: 100%;
    min-width: 0;
  }
}
@media (max-width: 560px) {
  .bip-fb-drop-menu {
    left: 0;
    right: 0;
    min-width: 100%;
  }
}
@media (max-width: 768px) {
  .bip-header { padding: 90px 20px 40px; }
  .bip-grid { padding: 0 20px 12px; }
  .bip-back { top: 70px; right: 14px; }
  .bip-empty { padding: 60px 20px; }
}
`;

// ─── Interleave + shuffle helper ─────────────────────────────────────────────

/** Interleaves movies and TV then applies a mild window shuffle. */
function mergeShuffle(movies, tv) {
  const m = movies.map(x => ({ ...x, media_type: "movie", _id: `m-${x.id}` }));
  const t = tv.map(x    => ({ ...x, media_type: "tv",    _id: `t-${x.id}` }));
  const merged = [];
  const len = Math.max(m.length, t.length);
  for (let i = 0; i < len; i++) {
    if (i < m.length) merged.push(m[i]);
    if (i < t.length) merged.push(t[i]);
  }
  // Mild window shuffle (WINDOW=10) to break strict alternation
  const WIN = 10;
  for (let i = 0; i < merged.length; i += WIN) {
    const end = Math.min(i + WIN, merged.length);
    for (let j = end - 1; j > i; j--) {
      const k = i + Math.floor(Math.random() * (j - i + 1));
      [merged[j], merged[k]] = [merged[k], merged[j]];
    }
  }
  return merged;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkeletonGrid({ count = 20 }) {
  return (
    <div className="bip-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bip-skeleton-card">
          <div className="bip-skeleton-poster" />
          <div className="bip-skeleton-line" />
          <div className="bip-skeleton-line short" />
        </div>
      ))}
    </div>
  );
}

function PosterCard({ item, index }) {
  const posterUrl = item.poster_path ? `${TMDB_IMG}${item.poster_path}` : null;
  const title     = item.title || item.name || "Untitled";
  const year      = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating    = item.vote_average ? item.vote_average.toFixed(1) : null;
  const isMovie   = item.media_type === "movie";

  return (
    <div className="bip-card" style={{ animationDelay: `${Math.min(index * 0.025, 0.6)}s` }}>
      <div className="bip-card-poster">
        {posterUrl ? (
          <img className="bip-card-img" src={posterUrl} alt={title} loading="lazy" />
        ) : (
          <div className="bip-card-no-img">
            <span style={{ fontSize: 24, opacity: .3 }}>{isMovie ? "🎬" : "📺"}</span>
            <span>{title}</span>
          </div>
        )}
        <div className="bip-card-grad" />
        <span className="bip-card-badge">{isMovie ? "Movie" : "Series"}</span>
        <div className="bip-card-overlay">
          <button className="bip-card-play" aria-label="View">▶</button>
        </div>
      </div>
      <div className="bip-card-info">
        <div className="bip-card-title" title={title}>{title}</div>
        <div className="bip-card-meta">
          {year && <span className="bip-card-year">{year}</span>}
          {rating && <span className="bip-card-rating"><span style={{ fontSize: 9 }}>★</span> {rating}</span>}
        </div>
      </div>
    </div>
  );
}


// ─── OTT channels (mocked) ───────────────────────────────────────────────────
const OTT_CHANNELS = [
  { value: "",          label: "OTT Channel" },
  { value: "netflix",   label: "Netflix" },
  { value: "prime",     label: "Prime Video" },
  { value: "disney",    label: "Disney+" },
  { value: "apple",     label: "Apple TV+" },
  { value: "hbo",       label: "Max (HBO)" },
  { value: "hulu",      label: "Hulu" },
  { value: "paramount", label: "Paramount+" },
  { value: "peacock",   label: "Peacock" },
  { value: "zee5",      label: "ZEE5" },
  { value: "hotstar",   label: "Hotstar" },
];

// ─── FilterBar component ──────────────────────────────────────────────────────

function FilterBar({
  search, setSearch,
  mediaType, setMediaType,
  showAnime, setShowAnime,
  familyFriendly, setFamilyFriendly,
  sortBy, setSortBy,
  ottChannel, setOttChannel,
  count,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [ottOpen, setOttOpen] = useState(false);
  const sortRef = useRef(null);
  const ottRef = useRef(null);

  const sortLabel = SORT_OPTIONS.find(option => option.value === sortBy)?.label || "Popular";
  const ottLabel = OTT_CHANNELS.find(option => option.value === ottChannel)?.label || "OTT Channel";

  useEffect(() => {
    function handleOutsideClick(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) setSortOpen(false);
      if (ottRef.current && !ottRef.current.contains(event.target)) setOttOpen(false);
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setSortOpen(false);
        setOttOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="bip-filterbar">
      <div className="bip-fb-search">
        <span className="bip-fb-search-icon"><FiSearch /></span>
        <input
          className="bip-fb-input"
          placeholder="Search in this category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bip-fb-pills">
        {[["all","All"],["movies","Movies"],["tv","Series"]].map(([val, label]) => (
          <button
            key={val}
            className={`bip-fb-pill${mediaType === val ? " on" : ""}`}
            onClick={() => setMediaType(val)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bip-fb-switches">
        <button
          className={`bip-fb-switch${showAnime ? " on" : ""}`}
          onClick={() => setShowAnime(v => !v)}
        >
          <span className="bip-fb-switch-track">
            <span className="bip-fb-switch-thumb" />
          </span>
          <span>Anime</span>
        </button>

        <button
          className={`bip-fb-switch${familyFriendly ? " on" : ""}`}
          onClick={() => setFamilyFriendly(v => !v)}
        >
          <span className="bip-fb-switch-track">
            <span className="bip-fb-switch-thumb" />
          </span>
          <span>Family Friendly</span>
        </button>
      </div>

      <div className="bip-fb-dropdown-wrap">
        <div className={`bip-fb-dropdown${sortOpen ? " open" : ""}`} ref={sortRef}>
          <button
            className="bip-fb-drop-trigger"
            onClick={() => {
              setSortOpen(current => !current);
              setOttOpen(false);
            }}
          >
            <span className="bip-fb-drop-icon"><FiArrowUp /></span>
            <span className="bip-fb-drop-text">Sort: {sortLabel}</span>
            <FiChevronDown className="bip-fb-drop-caret" />
          </button>
          <div className="bip-fb-drop-menu">
            {SORT_OPTIONS.map(option => (
              <button
                key={option.value}
                className={`bip-fb-drop-item${sortBy === option.value ? " on" : ""}`}
                onClick={() => {
                  setSortBy(option.value);
                  setSortOpen(false);
                }}
              >
                <span>{option.label}</span>
                {sortBy === option.value && <span className="bip-fb-check">On</span>}
              </button>
            ))}
          </div>
        </div>

        <div className={`bip-fb-dropdown${ottOpen ? " open" : ""}`} ref={ottRef}>
          <button
            className="bip-fb-drop-trigger"
            onClick={() => {
              setOttOpen(current => !current);
              setSortOpen(false);
            }}
          >
            <span className="bip-fb-drop-icon"><FiMonitor /></span>
            <span className="bip-fb-drop-text">{ottLabel}</span>
            <FiChevronDown className="bip-fb-drop-caret" />
          </button>
          <div className="bip-fb-drop-menu">
            {OTT_CHANNELS.map(option => (
              <button
                key={option.value || "all"}
                className={`bip-fb-drop-item${ottChannel === option.value ? " on" : ""}`}
                onClick={() => {
                  setOttChannel(option.value);
                  setOttOpen(false);
                }}
              >
                <span>{option.label}</span>
                {ottChannel === option.value && <span className="bip-fb-check">On</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bip-fb-meta">
        {familyFriendly && <span className="bip-fb-mode-chip">Family Mode ON</span>}
        <div className="bip-fb-count">{count} titles</div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BrowseItemPage() {
  const { section, item } = useParams();
  const navigate = useNavigate();

  const sectionLabel = SECTION_LABELS[section] ?? section;
  const itemLabel = (item || "").split("-").map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(" ");

  // ── Raw fetched results ────────────────────────────────────────────────────
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const cacheRef              = useRef({});

  // ── Filter state ──────────────────────────────────────────────────────────
  const [search,         setSearch]         = useState("");
  const [mediaType,      setMediaType]      = useState("all");   // all|movies|tv
  const [showAnime,      setShowAnime]      = useState(false);
  const [familyFriendly, setFamilyFriendly] = useState(false);
  const [sortBy,         setSortBy]         = useState("popular"); // popular|newest|oldest
  const [ottChannel,     setOttChannel]     = useState("");
  const [isFiltering,    setIsFiltering]    = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchContent = useCallback(async () => {
    const cacheKey = `${section}::${item}`;
    if (cacheRef.current[cacheKey]) { setResults(cacheRef.current[cacheKey]); return; }

    setLoading(true); setError(null); setResults([]);
    try {
      const genreIds = getGenreIds(item);
      const [moviesRes, tvRes] = await Promise.allSettled([
        fetchMultiplePages("movie", genreIds.movie, 5),
        fetchMultiplePages("tv",    genreIds.tv,    5),
      ]);
      const rawMovies = moviesRes.status === "fulfilled" ? moviesRes.value : [];
      const rawTv     = tvRes.status     === "fulfilled" ? tvRes.value     : [];
      const movies    = rawMovies.filter((x, i, a) => a.findIndex(y => y.id === x.id) === i);
      const tv        = rawTv.filter((x, i, a)     => a.findIndex(y => y.id === x.id) === i);
      const merged    = mergeShuffle(movies, tv);
      setResults(merged);
      cacheRef.current[cacheKey] = merged;
    } catch (err) {
      console.error("BrowseItemPage:", err);
      setError("Failed to load content. Please try again.");
    } finally { setLoading(false); }
  }, [section, item]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setSearch(""); setMediaType("all"); setShowAnime(false);
    setFamilyFriendly(false); setSortBy("popular"); setOttChannel("");
    fetchContent();
  }, [section, item, fetchContent]);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 220);
    return () => clearTimeout(timer);
  }, [search, mediaType, showAnime, familyFriendly, sortBy, ottChannel, results]);

  // ── Client-side filtering + sorting ───────────────────────────────────────
  const displayResults = useMemo(() => {
    let list = [...results];

    // Media type
    if (mediaType === "movies") list = list.filter(x => x.media_type === "movie");
    if (mediaType === "tv")     list = list.filter(x => x.media_type === "tv");

    // Title search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(x => (x.title || x.name || "").toLowerCase().includes(q));
    }

    // Anime — TMDB animation genre ID = 16
    if (showAnime) list = list.filter(x => x.genre_ids?.includes(16));

    // Family friendly — remove adult content
    // Family friendly: allow Animation/Family/Comedy and block Horror/Crime/Thriller.
    if (familyFriendly) list = list.filter(isFamilySafeTitle);

    // Sort
    if (sortBy === "newest" || sortBy === "oldest") {
      list = [...list].sort((a, b) => {
        const da = a.release_date || a.first_air_date || "";
        const db = b.release_date || b.first_air_date || "";
        return sortBy === "newest" ? db.localeCompare(da) : da.localeCompare(db);
      });
    }
    // "popular" keeps the default vote_count.desc order from the API

    return list;
  }, [results, search, mediaType, showAnime, familyFriendly, sortBy]);

  const hasResults    = displayResults.length > 0;
  const showEmpty     = !loading && !error && !hasResults;

  return (
    <>
      <style>{STYLES}</style>

      <div className="bip-page">
        {/* Fixed back */}
        <button className="bip-back" onClick={() => navigate(`/explore/${section}`)}>
          ← {sectionLabel}
        </button>

        {/* ── Hero header ── */}
        <div className="bip-header">
          <div className="bip-header-orb bip-header-orb-1" />
          <div className="bip-header-orb bip-header-orb-2" />
          <div className="bip-inner">
            <div className="bip-crumb">
              <span className="bip-crumb-link" onClick={() => navigate("/explore")}>Explore</span>
              <span className="bip-crumb-sep">›</span>
              <span className="bip-crumb-link" onClick={() => navigate(`/explore/${section}`)}>{sectionLabel}</span>
              <span className="bip-crumb-sep">›</span>
              <span style={{ color: "var(--txm)" }}>{itemLabel}</span>
            </div>
            {/* Title */}
            <div className="bip-title">{itemLabel}</div>
            {/* Subtitle: count only — no "Movies & Series" label */}
            <div className="bip-subtitle">
              {loading ? "Discovering titles…" : results.length > 0 ? `${results.length} titles` : ""}
            </div>
          </div>
        </div>

        {/* ── Sticky filter bar ── */}
        {!error && (
          <FilterBar
            search={search}             setSearch={setSearch}
            mediaType={mediaType}       setMediaType={setMediaType}
            showAnime={showAnime}       setShowAnime={setShowAnime}
            familyFriendly={familyFriendly} setFamilyFriendly={setFamilyFriendly}
            sortBy={sortBy}             setSortBy={setSortBy}
            ottChannel={ottChannel}     setOttChannel={setOttChannel}
            count={displayResults.length}
          />
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div className="bip-empty">
            <div className="bip-empty-icon">⚠️</div>
            <div className="bip-empty-title">{error}</div>
            <button className="btn-outline"
              style={{ marginTop: 16, borderRadius: 9999, padding: "10px 24px" }}
              onClick={fetchContent}
            >Try Again</button>
          </div>
        )}

        {/* ── Skeleton ── */}
        {loading && !error && (
          <div style={{ padding: "0 52px", marginTop: 16 }}>
            <SkeletonGrid count={20} />
          </div>
        )}

        {/* ── Mixed grid ── */}
        {!loading && !error && hasResults && (
          <div className={`bip-grid${isFiltering ? " bip-grid-refresh" : ""}`} style={{ marginTop: 16 }}>
            {displayResults.map((itm, i) => (
              <PosterCard key={itm._id} item={itm} index={i} />
            ))}
          </div>
        )}

        {/* ── Empty ── */}
        {showEmpty && (
          <div className="bip-empty">
            <div className="bip-empty-icon">🔍</div>
            <div className="bip-empty-title">
              {results.length > 0 ? "No matches for your filters" : `No titles found for "${itemLabel}"`}
            </div>
            <div className="bip-empty-sub">
              {results.length > 0 ? "Try adjusting your search or filters" : "Try a different category"}
            </div>
          </div>
        )}
      </div>
    </>
  );
}



import { AnimatePresence, motion as Motion } from "framer-motion";
import { useDeferredValue, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import {
  FaBolt,
  FaCamera,
  FaGlobeAmericas,
  FaImage,
  FaLanguage,
  FaLayerGroup,
  FaRedoAlt,
  FaSearch,
  FaStar,
  FaTags,
  FaThLarge,
  FaTrophy,
  FaTimes,
  FaUpload,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  EXPLORE_CATEGORY_GROUPS,
  EXPLORE_COUNTRY_CARDS,
  EXPLORE_GENRE_CARDS,
  EXPLORE_LANGUAGE_CARDS,
  EXPLORE_SUB_ANIME,
  EXPLORE_SUB_AWARD_WINNERS,
  EXPLORE_SUB_EDITORS_PICK,
  EXPLORE_SUB_FAMILY_FRIENDLY,
  EXPLORE_SUB_FRANCHISE,
  TMDB_BASE,
  TMDB_IMG,
  TMDB_KEY,
  TMDB_W,
} from "../lib/constants";

const START_WITH_OPTIONS = [
  { id: "category", label: "Categories", route: "/explore/category", icon: <FaThLarge aria-hidden="true" /> },
  { id: "country", label: "Countries", route: "/explore/country", icon: <FaGlobeAmericas aria-hidden="true" /> },
  { id: "genre", label: "Genres", route: "/explore/genre", icon: <FaTags aria-hidden="true" /> },
  { id: "language", label: "Language", route: "/explore/language", icon: <FaLanguage aria-hidden="true" /> },
  { id: "family-friendly", label: "Family Friendly", route: "/explore/family-friendly", icon: <FaUsers aria-hidden="true" /> },
  { id: "award-winners", label: "Award Winners", route: "/explore/award-winners", icon: <FaTrophy aria-hidden="true" /> },
  { id: "editors-pick", label: "Editor's Pick", route: "/explore/editors-pick", icon: <FaStar aria-hidden="true" /> },
  { id: "anime", label: "Anime", route: "/explore/anime", icon: <FaBolt aria-hidden="true" /> },
  { id: "franchise", label: "Franchise", route: "/explore/franchise", icon: <FaLayerGroup aria-hidden="true" /> },
];

const START_WITH_CONTEXT_HINT = {
  category: "Tap a category lane",
  country: "Choose a country",
  genre: "Pick a genre",
  language: "Pick a language",
  "family-friendly": "Choose a family lane",
  "award-winners": "Choose an award lane",
  "editors-pick": "Choose an editor lane",
  anime: "Choose an anime lane",
  franchise: "Choose a franchise lane",
};

const QUICK_PRESETS = [
  { id: "trending", label: "Trending Now" },
  { id: "underrated", label: "Underrated Gems" },
  { id: "feel-good", label: "Feel Good" },
  { id: "dark", label: "Dark & Intense" },
  { id: "cinematic", label: "Cinematic" },
  { id: "late-night", label: "Late Night" },
];

const FEED_PAGE_SIZE = 18;
const SCAN_RESULTS_LIMIT = 8;
const TESSERACT_REMOTE_URL = "https://esm.sh/tesseract.js@5.1.1?bundle";
const TFJS_REMOTE_URL = "https://esm.sh/@tensorflow/tfjs@4.10.0";
const MOBILENET_REMOTE_URL = "https://esm.sh/@tensorflow-models/mobilenet@2.1.1";

const FEATURED_CATEGORIES = [
  "Action",
  "Adventure",
  "Drama",
  "Anime",
  "Comedy",
  "Mystery",
  "Feel Good",
  "Dark / Gritty",
];

const CATEGORY_GENRE_MAP = {
  action: 28,
  adventure: 12,
  animation: 16,
  animated: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  "science-fiction": 878,
  "sci-fi": 878,
  thriller: 53,
  war: 10752,
  western: 37,
  anime: 16,
};

let tesseractModulePromise;
let tfjsModulePromise;
let mobilenetModulePromise;

function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

function cleanDetectedText(value) {
  return String(value || "")
    .replace(/[|¦•]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreDetectedLine(line) {
  const letters = (line.match(/[a-z]/gi) || []).length;
  const digits = (line.match(/[0-9]/g) || []).length;
  const punctuation = (line.match(/[^a-z0-9\s]/gi) || []).length;
  return (letters * 4) - (digits * 2) - (punctuation * 3) - Math.abs(line.length - 22);
}

function pickScanQuery(value) {
  const lines = String(value || "")
    .split(/\r?\n/g)
    .map((line) => cleanDetectedText(line))
    .filter(Boolean);

  const candidates = lines
    .filter((line) => /[a-z]/i.test(line))
    .sort((a, b) => scoreDetectedLine(b) - scoreDetectedLine(a));

  return extractKeywords(candidates[0] || lines[0] || "");
}

function extractKeywords(rawText) {
  const cleaned = String(rawText || "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned.split(" ").filter((w) => w.length >= 3);
  return words.slice(0, 4).join(" ");
}

function generateSearchVariations(textQuery, sceneQuery) {
  const queries = new Set();
  const tWords = textQuery ? textQuery.trim().split(" ") : [];
  const sWords = sceneQuery ? sceneQuery.trim().split(" ") : [];
  
  if (tWords.length > 0 && sWords.length > 0) {
    queries.add(`${textQuery} ${sceneQuery}`);
  }
  
  if (tWords.length > 0 && tWords[0].length > 0) {
    queries.add(textQuery);
    if (tWords.length > 1) {
      queries.add(`the ${textQuery}`);
      queries.add(`${textQuery} series`);
      queries.add(tWords[0]);
    }
  }
  
  if (sWords.length > 0 && sWords[0].length > 0) {
    queries.add(sceneQuery);
  }

  return Array.from(queries).filter(Boolean);
}

function rankSmartScanResults(items, textQuery, sceneQuery) {
  const queryLower = normalizeText(textQuery);
  const sceneLower = normalizeText(sceneQuery);

  const scoredItems = items.map(item => {
    let score = 0;
    const titleLower = normalizeText(item.title);
    
    if (queryLower && titleLower === queryLower) {
      score += 50;
    } else if (queryLower && titleLower.includes(queryLower)) {
      score += 30;
    }
    
    if (queryLower) {
      const words = queryLower.split(" ");
      for (const w of words) {
        if (titleLower.includes(w) || normalizeText(item.overview).includes(w)) {
           score += 20;
           break;
        }
      }
    }
    
    if (sceneLower) {
      const sceneWords = sceneLower.split(" ");
      const categories = (item.categories || []).map(normalizeText).join(" ");
      const overview = normalizeText(item.overview);
      
      for (const sw of sceneWords) {
         if (categories.includes(sw) || overview.includes(sw)) {
           score += 15;
           break;
         }
      }
    }
    
    const popularity = Number(item.popularity) || 0;
    if (popularity > 50) score += 10;
    
    const rating = Number(item.rating) || 0;
    if (rating > 7) score += 5;
    
    let confidence = "LOW";
    if (score >= 70) confidence = "HIGH";
    else if (score >= 40) confidence = "MEDIUM";
    
    return { item: { ...item, _score: score, _confidence: confidence }, score };
  });

  return scoredItems
    .sort((a, b) => b.score - a.score || (Number(b.item.popularity) || 0) - (Number(a.item.popularity) || 0))
    .map(obj => obj.item);
}

async function loadTesseractClient() {
  if (!tesseractModulePromise) {
    tesseractModulePromise = import(/* @vite-ignore */ TESSERACT_REMOTE_URL)
      .then((module) => module.default || module);
  }

  return tesseractModulePromise;
}

async function loadMobileNetClient() {
  if (!tfjsModulePromise) {
    tfjsModulePromise = import(/* @vite-ignore */ TFJS_REMOTE_URL);
  }
  await tfjsModulePromise;

  if (!mobilenetModulePromise) {
    mobilenetModulePromise = import(/* @vite-ignore */ MOBILENET_REMOTE_URL)
      .then((module) => module.load());
  }
  return mobilenetModulePromise;
}

function slugify(value) {
  return normalizeText(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function itemKey(item) {
  return `${item.tmdbId || item.tmdb_id || item.id || item.title}-${item.tmdbType || item.type || ""}`;
}

function compareByRatingThenYear(a, b) {
  const ratingA = Number(a.rating) || 0;
  const ratingB = Number(b.rating) || 0;
  if (ratingA !== ratingB) return ratingB - ratingA;

  const yearA = Number.parseInt(a.year, 10) || 0;
  const yearB = Number.parseInt(b.year, 10) || 0;
  return yearB - yearA;
}

function dedupeMedia(items) {
  const unique = new Map();
  items.forEach((item) => {
    if (!item?.title) return;
    if (!unique.has(itemKey(item))) unique.set(itemKey(item), item);
  });
  return Array.from(unique.values());
}

function hasVisual(item) {
  return Boolean(item?.poster || item?.poster_path || item?.backdrop || item?.backdrop_path);
}

function isAnime(item) {
  return normalizeText(item?.type) === "anime" || (item?.categories || []).some((entry) => normalizeText(entry) === "anime");
}

function toPosterSrc(item, wide = false) {
  const base = wide ? TMDB_W : TMDB_IMG;
  const path = wide
    ? item.backdrop || item.backdrop_path || item.poster || item.poster_path
    : item.poster || item.poster_path || item.backdrop || item.backdrop_path;

  return path ? `${base}${path}` : "";
}

function mapTmdbResult(result, fallbackType) {
  const mediaType = result.media_type || fallbackType || (result.first_air_date ? "tv" : "movie");
  if (mediaType === "person") return null;

  const title = result.title || result.name || "";
  if (!title) return null;

  const genreIds = result.genre_ids || [];
  const inferredAnime = mediaType === "tv" && genreIds.includes(16) && normalizeText(title).includes("anime");

  return {
    id: `${mediaType}-${result.id}`,
    tmdbId: result.id,
    tmdb_id: result.id,
    tmdbType: mediaType,
    title,
    year: (result.release_date || result.first_air_date || "").slice(0, 4),
    rating: result.vote_average || 0,
    type: inferredAnime ? "Anime" : mediaType === "movie" ? "Movie" : "TV Show",
    poster: result.poster_path || null,
    poster_path: result.poster_path || null,
    backdrop: result.backdrop_path || null,
    backdrop_path: result.backdrop_path || null,
    overview: result.overview || "",
    popularity: result.popularity || 0,
    categories: [],
    streaming: [],
  };
}

function matchesQuery(item, query) {
  if (!query) return true;

  const haystack = [
    item.title,
    item.type,
    item.year,
    item.overview,
    ...(item.categories || []),
  ]
    .map(normalizeText)
    .join(" ");

  return haystack.includes(query);
}

function matchesPreset(item, presetId) {
  if (!presetId || presetId === "trending") return true;

  const categories = (item.categories || []).map(normalizeText);
  const title = normalizeText(item.title);
  const type = normalizeText(item.type);
  const rating = Number(item.rating) || 0;

  if (presetId === "underrated") {
    return rating >= 8 && rating < 9.2 && Number.parseInt(item.year, 10) <= 2022;
  }

  if (presetId === "feel-good") {
    return categories.some((entry) => ["comedy", "animation", "adventure", "feel good", "family drama", "lighthearted & fun"].includes(entry));
  }

  if (presetId === "dark") {
    return categories.some((entry) => ["drama", "crime", "thriller", "horror", "psychological", "dark / gritty"].includes(entry)) || title.includes("dark");
  }

  if (presetId === "cinematic") {
    return rating >= 8.5 || categories.some((entry) => ["adaptation", "art house", "epic", "science-fiction", "adventure"].includes(entry));
  }

  if (presetId === "late-night") {
    return type === "anime" || categories.some((entry) => ["anime", "mystery", "science-fiction", "thriller", "supernatural"].includes(entry));
  }

  return true;
}

function matchesFacet(item, facet) {
  if (!facet) return true;
  if (facet.type === "country" || facet.type === "language" || facet.type === "editors-pick" || facet.type === "franchise") return true;
  if (facet.type === "award-winners") return (Number(item.rating) || 0) >= 7.5;
  if (facet.type === "anime") return isAnime(item);
  if (facet.type === "family-friendly") {
    const categories = (item.categories || []).map(normalizeText);
    return categories.some((entry) => ["animation", "comedy", "family drama", "adventure", "feel good", "lighthearted & fun"].includes(entry));
  }

  const bucket = [item.type, ...(item.categories || [])].map(slugify);
  return bucket.includes(slugify(facet.label));
}

function scoreItem(item, { query, presetId, facet }) {
  let score = (Number(item.rating) || 0) * 30 + (Number.parseInt(item.year, 10) || 0);
  if (matchesQuery(item, query)) score += query ? 200 : 0;
  if (matchesPreset(item, presetId)) score += presetId ? 120 : 0;
  if (matchesFacet(item, facet)) score += facet ? 160 : 0;
  if (isAnime(item)) score += presetId === "late-night" ? 20 : 0;
  return score;
}

function rankLocalPool(items, context) {
  return [...items].sort((a, b) => scoreItem(b, context) - scoreItem(a, context) || compareByRatingThenYear(a, b));
}

function buildPresetUrls(presetId, page) {
  const base = `${TMDB_BASE}`;
  const common = `api_key=${TMDB_KEY}&language=en-US&include_adult=false&page=${page}`;

  if (!presetId || presetId === "trending") {
    return [`${base}/trending/all/week?api_key=${TMDB_KEY}&language=en-US&page=${page}`];
  }

  if (presetId === "underrated") {
    return [
      `${base}/discover/movie?${common}&vote_average.gte=7.7&vote_count.gte=200&vote_count.lte=2500&sort_by=vote_average.desc`,
      `${base}/discover/tv?${common}&vote_average.gte=7.7&vote_count.gte=150&vote_count.lte=2200&sort_by=vote_average.desc`,
    ];
  }

  if (presetId === "feel-good") {
    return [
      `${base}/discover/movie?${common}&with_genres=35,16,10751&sort_by=popularity.desc`,
      `${base}/discover/tv?${common}&with_genres=35,16,10751&sort_by=popularity.desc`,
    ];
  }

  if (presetId === "dark") {
    return [
      `${base}/discover/movie?${common}&with_genres=18,53,80,27&sort_by=popularity.desc`,
      `${base}/discover/tv?${common}&with_genres=18,80,9648,10765&sort_by=popularity.desc`,
    ];
  }

  if (presetId === "cinematic") {
    return [
      `${base}/discover/movie?${common}&vote_average.gte=7.8&vote_count.gte=1200&sort_by=vote_average.desc`,
      `${base}/discover/tv?${common}&vote_average.gte=7.8&vote_count.gte=800&sort_by=vote_average.desc`,
    ];
  }

  if (presetId === "late-night") {
    return [
      `${base}/discover/movie?${common}&with_genres=53,9648,878&sort_by=popularity.desc`,
      `${base}/discover/tv?${common}&with_genres=9648,18,10765&sort_by=popularity.desc`,
    ];
  }

  return [`${base}/trending/all/week?api_key=${TMDB_KEY}&language=en-US&page=${page}`];
}

function buildFacetUrls(facet, page) {
  if (!facet) return [];

  const common = `api_key=${TMDB_KEY}&language=en-US&include_adult=false&page=${page}`;

  if (facet.type === "genre" && facet.tmdbGenreId) {
    return [
      `${TMDB_BASE}/discover/movie?${common}&with_genres=${facet.tmdbGenreId}&sort_by=popularity.desc`,
      `${TMDB_BASE}/discover/tv?${common}&with_genres=${facet.tmdbGenreId}&sort_by=popularity.desc`,
    ];
  }

  if (facet.type === "country" && facet.iso) {
    return [
      `${TMDB_BASE}/discover/movie?${common}&with_origin_country=${facet.iso}&sort_by=popularity.desc`,
      `${TMDB_BASE}/discover/tv?${common}&with_origin_country=${facet.iso}&sort_by=popularity.desc`,
    ];
  }

  if (facet.type === "language" && facet.iso) {
    return [
      `${TMDB_BASE}/discover/movie?${common}&with_original_language=${facet.iso}&sort_by=popularity.desc`,
      `${TMDB_BASE}/discover/tv?${common}&with_original_language=${facet.iso}&sort_by=popularity.desc`,
    ];
  }

  if (facet.type === "family-friendly") {
    return [
      `${TMDB_BASE}/discover/movie?${common}&with_genres=16,35,10751&sort_by=popularity.desc`,
      `${TMDB_BASE}/discover/tv?${common}&with_genres=16,35,10751&sort_by=popularity.desc`,
    ];
  }

  if (facet.type === "award-winners") {
    return [
      `${TMDB_BASE}/discover/movie?${common}&vote_average.gte=7.5&vote_count.gte=250&sort_by=vote_average.desc`,
      `${TMDB_BASE}/discover/tv?${common}&vote_average.gte=7.5&vote_count.gte=200&sort_by=vote_average.desc`,
    ];
  }

  if (facet.type === "editors-pick") {
    return [
      `${TMDB_BASE}/trending/all/week?api_key=${TMDB_KEY}&language=en-US&page=${page}`,
    ];
  }

  if (facet.type === "anime") {
    return [
      `${TMDB_BASE}/discover/tv?${common}&with_genres=16&with_original_language=ja&sort_by=popularity.desc`,
      `${TMDB_BASE}/discover/movie?${common}&with_genres=16&with_original_language=ja&sort_by=popularity.desc`,
    ];
  }

  if (facet.type === "franchise") {
    return [
      `${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(`${facet.label} franchise`)}&language=en-US&page=${page}`,
    ];
  }

  if (facet.type === "category") {
    const genreId = CATEGORY_GENRE_MAP[slugify(facet.label)];
    if (genreId) {
      return [
        `${TMDB_BASE}/discover/movie?${common}&with_genres=${genreId}&sort_by=popularity.desc`,
        `${TMDB_BASE}/discover/tv?${common}&with_genres=${genreId}&sort_by=popularity.desc`,
      ];
    }
  }

  return [`${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(facet.label)}&language=en-US&page=${page}`];
}

function buildExploreUrls({ query, presetId, facet, page }) {
  if (query) {
    return [`${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=${page}`];
  }

  const facetUrls = buildFacetUrls(facet, page);
  if (facetUrls.length) return facetUrls;

  return buildPresetUrls(presetId, page);
}

async function fetchExploreItems({ query, presetId, facet, page, signal }) {
  const urls = buildExploreUrls({ query, presetId, facet, page });
  const responses = await Promise.all(
    urls.map((url) =>
      fetch(url, { signal })
        .then((response) => response.json())
        .catch(() => null)
    )
  );

  return dedupeMedia(
    responses.flatMap((payload, index) => {
      const fallbackType = urls[index].includes("/discover/tv") ? "tv" : "movie";
      return (payload?.results || [])
        .map((entry) => mapTmdbResult(entry, fallbackType))
        .filter(Boolean)
        .filter(hasVisual);
    })
  );
}

function shuffleFeedBatch(items) {
  const next = [...items];
  const windowSize = 6;

  for (let start = 0; start < next.length; start += windowSize) {
    const end = Math.min(start + windowSize, next.length);
    for (let index = end - 1; index > start; index -= 1) {
      const swapIndex = start + Math.floor(Math.random() * (index - start + 1));
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    }
  }

  return next;
}

function FeedSkeleton() {
  return (
    <div className="explore-feed-grid" aria-hidden="true">
      {Array.from({ length: FEED_PAGE_SIZE }).map((_, index) => (
        <div key={index} className="explore-feed-card-skeleton" />
      ))}
    </div>
  );
}

function SectionHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="explore-section-head">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actionLabel && onAction && (
        <button type="button" className="explore-link-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function ExploreCard({
  item,
  variant = "rail",
  hoveredItemId,
  setHoveredItemId,
  onInfo,
  onAdd,
}) {
  const cardId = itemKey(item);
  const isHovered = hoveredItemId === cardId;
  const meta = [item.type, item.year].filter(Boolean).join(" / ");
  const rating = Number(item.rating) || 0;
  const imageSrc = toPosterSrc(item, variant === "hero");

  return (
    <Motion.article
      layout
      className={`explore-card explore-card-${variant}`}
      onHoverStart={() => setHoveredItemId(cardId)}
      onHoverEnd={() => setHoveredItemId("")}
      onFocus={() => setHoveredItemId(cardId)}
      onBlur={() => setHoveredItemId("")}
      whileHover={{ y: -6, scale: variant === "hero" ? 1.01 : 1.04 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      onClick={() => onInfo(item)}
    >
      <div className="explore-card-media-wrap">
        {imageSrc ? (
          <img
            className="explore-card-media"
            src={imageSrc}
            alt={item.title || "Poster"}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="explore-card-fallback">{item.title}</div>
        )}
        <div className="explore-card-sheen" />
        <div className="explore-card-gradient" />
        <div className="explore-card-badges">
          {item.type && <span>{item.type}</span>}
          {rating > 0 && <span>{rating.toFixed(1)}</span>}
        </div>

        <AnimatePresence>
          {isHovered && (
            <Motion.div
              className="explore-card-hover"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="explore-card-hover-copy">
                <h3>{item.title}</h3>
                {meta && <p className="explore-card-hover-meta">{meta}</p>}
                {item.overview && <p className="explore-card-hover-overview">{item.overview}</p>}
              </div>
              <div className="explore-card-actions">
                <button
                  type="button"
                  className="explore-action-primary"
                  onClick={(event) => {
                    event.stopPropagation();
                    onInfo(item);
                  }}
                >
                  Info
                </button>
                <button
                  type="button"
                  className="explore-action-secondary"
                  onClick={(event) => {
                    event.stopPropagation();
                    onAdd(item);
                  }}
                >
                  Add
                </button>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="explore-card-copy">
        <h3>{item.title}</h3>
        {meta && <p>{meta}</p>}
      </div>
    </Motion.article>
  );
}

function ScanResultCard({ item, onInfo, onAdd, session }) {
  const meta = [item.type, item.year].filter(Boolean).join(" / ");
  const rating = Number(item.rating) || 0;
  const imageSrc = toPosterSrc(item);

  return (
    <article className="scan-result-card">
      <button type="button" className="scan-result-media" onClick={() => onInfo(item)}>
        <div className="explore-card-media-wrap">
          {imageSrc ? (
            <img
              className="explore-card-media"
              src={imageSrc}
              alt={item.title || "Poster"}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="explore-card-fallback">{item.title}</div>
          )}
          <div className="explore-card-sheen" />
          <div className="explore-card-gradient" />
          <div className="explore-card-badges">
            {item.type && <span>{item.type}</span>}
            {rating > 0 && <span>{rating.toFixed(1)}</span>}
          </div>
        </div>
      </button>

      <div className="scan-result-copy">
        <div>
          <h3>{item.title}</h3>
          {meta && <p>{meta}</p>}
        </div>
        <button type="button" className="scan-result-add" onClick={() => onAdd(item)}>
          {session ? "Add to My List" : "Sign In to Add"}
        </button>
      </div>
    </article>
  );
}

function ScanHeroCard({ item, onInfo, onAdd, session }) {
  const meta = [item.type, item.year].filter(Boolean).join(" / ");
  const rating = Number(item.rating) || 0;
  const imageSrc = toPosterSrc(item, false);
  const isHigh = item._confidence === "HIGH";

  return (
    <div className="scan-hero-card" style={{
      display: "flex", gap: "20px", background: "rgba(255,255,255,0.03)", 
      border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px",
      alignItems: "center"
    }}>
      <div style={{ flex: "0 0 100px", borderRadius: "8px", overflow: "hidden", aspectRatio: "2/3" }}>
        {imageSrc ? (
          <img src={imageSrc} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
           <div className="explore-card-fallback">{item.title}</div>
        )}
      </div>
      <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isHigh ? (
            <span style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
              🎯 Found a match
            </span>
          ) : (
            <span style={{ background: "rgba(234, 179, 8, 0.15)", color: "#facc15", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
              🤔 We think this is it
            </span>
          )}
        </div>
        <h3 style={{ fontSize: "20px", fontWeight: "600", margin: "0", color: "#fff" }}>{item.title}</h3>
        <p style={{ color: "rgba(255,255,255,0.6)", margin: "0", fontSize: "14px" }}>
          {meta} {rating > 0 && ` • ⭐ ${rating.toFixed(1)}`}
        </p>
        <p style={{ color: "rgba(255,255,255,0.8)", margin: "0", fontSize: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {item.overview}
        </p>
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <button type="button" onClick={() => onInfo(item)} style={{
            background: "#fff", color: "#000", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s"
          }}>
            Info
          </button>
          <button type="button" onClick={() => onAdd(item)} style={{
             background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s"
          }}>
            Add to List
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageScannerModal({
  isOpen,
  onClose,
  fileInputRef,
  previewUrl,
  selectedFileName,
  queryDraft,
  sceneDraft,
  rawDetectedText,
  results,
  error,
  isDropActive,
  isScanning,
  isSearching,
  hasScanAttempted,
  hasSearchCompleted,
  onQueryChange,
  onSceneChange,
  onChooseFile,
  onFileChange,
  onDrop,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onPrimaryAction,
  onReset,
  onInfo,
  onAdd,
  session,
}) {
  if (!isOpen) return null;

  const primaryLabel = isScanning
    ? "Scanning..."
    : isSearching
      ? "Searching..."
      : hasScanAttempted
        ? "Search Again"
        : "Scan Image";

  return (
    <div className="backdrop" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <Motion.div
        className="scan-modal"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="scan-modal-head">
          <div>
            <div className="scan-modal-kicker">Image Scanner</div>
            <h2>Scan a screenshot and jump straight into discovery.</h2>
          </div>
          <button type="button" className="scan-close-btn" onClick={onClose} aria-label="Close scan modal">
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <div
          className={`scan-upload-box${isDropActive ? " active" : ""}${previewUrl ? " has-preview" : ""}`}
          onClick={onChooseFile}
          onDrop={onDrop}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onChooseFile();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onFileChange}
          />

          {previewUrl ? (
            <div className="scan-upload-preview-wrap">
              <img className="scan-upload-preview" src={previewUrl} alt="Uploaded screenshot preview" />
              <div className="scan-upload-overlay">
                <span><FaUpload aria-hidden="true" /> Choose another screenshot</span>
              </div>
            </div>
          ) : (
            <div className="scan-upload-empty">
              <div className="scan-upload-icon"><FaImage aria-hidden="true" /></div>
              <div className="scan-upload-copy">
                <strong>Upload screenshot</strong>
                <span>Drag and drop or click to browse</span>
              </div>
            </div>
          )}
        </div>

        {selectedFileName && <div className="scan-upload-name">{selectedFileName}</div>}

        {hasScanAttempted && (
          <div className="scan-query-shell">
            <label className="scan-field-label" htmlFor="scan-query-input">Detected text</label>
            <div className="scan-query-row">
              <span className="scan-query-icon"><FaSearch aria-hidden="true" /></span>
              <input
                id="scan-query-input"
                className="scan-query-input"
                value={queryDraft}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Refine the title before searching TMDB"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onPrimaryAction();
                  }
                }}
              />
            </div>

            <label className="scan-field-label" htmlFor="scan-scene-input" style={{ marginTop: "12px" }}>Detected scene</label>
            <div className="scan-query-row" style={{ marginBottom: "8px" }}>
              <span className="scan-query-icon"><FaImage aria-hidden="true" /></span>
              <input
                id="scan-scene-input"
                className="scan-query-input"
                value={sceneDraft}
                onChange={(event) => onSceneChange(event.target.value)}
                placeholder="Refine the scene before searching TMDB"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onPrimaryAction();
                  }
                }}
              />
            </div>

            {rawDetectedText && rawDetectedText !== queryDraft && (
              <p className="scan-raw-text">OCR read: {rawDetectedText}</p>
            )}
          </div>
        )}

        <div className="scan-button-row">
          <button
            type="button"
            className="scan-primary-btn"
            onClick={onPrimaryAction}
            disabled={!previewUrl || isScanning || isSearching}
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            className="scan-secondary-btn"
            onClick={onReset}
            disabled={isScanning || isSearching}
          >
            <FaRedoAlt aria-hidden="true" /> New Screenshot
          </button>
        </div>

        {error && <div className="scan-feedback scan-feedback-error">{error}</div>}
        {!error && isSearching && <div className="scan-feedback">Searching TMDB...</div>}

        {(results.length > 0 || hasSearchCompleted) && (
          <div className="scan-results-shell">
            {(!results.length || (results[0]._confidence !== "HIGH" && results[0]._confidence !== "MEDIUM")) && (
              <div className="scan-results-head">
                <div>
                  <span className="scan-field-label">Similar Matches</span>
                  <h3>We found similar results</h3>
                </div>
                {!session && <p>Sign in to save a title to My List.</p>}
              </div>
            )}
            
            {results.length > 0 && (results[0]._confidence === "HIGH" || results[0]._confidence === "MEDIUM") && !session && (
              <div className="scan-results-head">
                <p style={{ margin: 0, paddingBottom: "12px", opacity: 0.8 }}>Sign in to save a title to My List.</p>
              </div>
            )}

            {results.length > 0 ? (
              <div className="scan-results-body">
                {(results[0]._confidence === "HIGH" || results[0]._confidence === "MEDIUM") ? (
                  <div style={{ marginBottom: "16px" }}>
                    <ScanHeroCard item={results[0]} onInfo={onInfo} onAdd={onAdd} session={session} />
                    {results.length > 1 && (
                      <div className="scan-fallback-results" style={{ marginTop: "24px" }}>
                        <span className="scan-field-label" style={{ display: "block", marginBottom: "16px", opacity: 0.7 }}>Other possible matches</span>
                        <div className="scan-results-grid">
                          {results.slice(1).map((item) => (
                            <ScanResultCard
                              key={`scan-${itemKey(item)}`}
                              item={item}
                              onInfo={onInfo}
                              onAdd={onAdd}
                              session={session}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="scan-results-grid">
                    {results.map((item) => (
                      <ScanResultCard
                        key={`scan-${itemKey(item)}`}
                        item={item}
                        onInfo={onInfo}
                        onAdd={onAdd}
                        session={session}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="scan-feedback">No results found. Edit the detected text and search again.</div>
            )}
          </div>
        )}
      </Motion.div>
    </div>
  );
}


export default function BrowseHub({
  allContent = [],
  session,
  onSelectItem,
  onRequireAuth,
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStartWith, setActiveStartWith] = useState(null);
  const [activePreset, setActivePreset] = useState("trending");
  const [activeFacet, setActiveFacet] = useState(null);
  const [hoveredItemId, setHoveredItemId] = useState("");
  const [feedItems, setFeedItems] = useState([]);
  const [feedPage, setFeedPage] = useState(1);
  const [isFeedLoading, setIsFeedLoading] = useState(false);
  const [hasMoreFeed, setHasMoreFeed] = useState(true);
  const [feedError, setFeedError] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanFile, setScanFile] = useState(null);
  const [scanPreviewUrl, setScanPreviewUrl] = useState("");
  const [scanDetectedText, setScanDetectedText] = useState("");
  const [scanQueryDraft, setScanQueryDraft] = useState("");
  const [scanSceneDraft, setScanSceneDraft] = useState("");
  const [scanResults, setScanResults] = useState([]);
  const [scanError, setScanError] = useState("");
  const [isScanDropActive, setIsScanDropActive] = useState(false);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [isSearchingScanResults, setIsSearchingScanResults] = useState(false);
  const [hasScanAttempted, setHasScanAttempted] = useState(false);
  const [hasScanSearchCompleted, setHasScanSearchCompleted] = useState(false);
  const deferredQuery = useDeferredValue(normalizeText(searchQuery));
  const sentinelRef = useRef(null);
  const scanFileInputRef = useRef(null);
  const scanAbortRef = useRef(null);
  const handleScannerEscape = useEffectEvent(() => {
    closeScanner();
  });

  const contentPool = useMemo(() => {
    return dedupeMedia(allContent.filter((item) => item?.title && hasVisual(item)));
  }, [allContent]);

  const startWithEntries = useMemo(() => {
    const categoryLane = FEATURED_CATEGORIES.filter((name) =>
      Object.values(EXPLORE_CATEGORY_GROUPS).flat().includes(name)
    );

    return {
      category: categoryLane.map((name) => ({
        id: `category-${slugify(name)}`,
        label: name,
        type: "category",
      })),
      genre: EXPLORE_GENRE_CARDS.slice(0, 8).map((entry) => ({
        id: `genre-${slugify(entry.name)}`,
        label: entry.name,
        type: "genre",
        tmdbGenreId: entry.tmdbGenreId,
      })),
      country: EXPLORE_COUNTRY_CARDS.slice(0, 8).map((entry) => ({
        id: `country-${slugify(entry.name)}`,
        label: entry.name,
        type: "country",
        iso: entry.iso,
      })),
      language: EXPLORE_LANGUAGE_CARDS.slice(0, 12).map((entry) => ({
        id: `language-${slugify(entry.name)}`,
        label: entry.name,
        type: "language",
        iso: entry.iso,
      })),
      "family-friendly": EXPLORE_SUB_FAMILY_FRIENDLY.map((entry) => ({
        id: `family-friendly-${slugify(entry.name)}`,
        label: entry.name,
        type: "family-friendly",
      })),
      "award-winners": EXPLORE_SUB_AWARD_WINNERS.map((entry) => ({
        id: `award-winners-${slugify(entry.name)}`,
        label: entry.name,
        type: "award-winners",
      })),
      "editors-pick": EXPLORE_SUB_EDITORS_PICK.map((entry) => ({
        id: `editors-pick-${slugify(entry.name)}`,
        label: entry.name,
        type: "editors-pick",
      })),
      anime: EXPLORE_SUB_ANIME.map((entry) => ({
        id: `anime-${slugify(entry.name)}`,
        label: entry.name,
        type: "anime",
      })),
      franchise: EXPLORE_SUB_FRANCHISE.map((entry) => ({
        id: `franchise-${slugify(entry.name)}`,
        label: entry.name,
        type: "franchise",
      })),
    };
  }, []);

  const contextualEntries = activeStartWith ? startWithEntries[activeStartWith] || [] : [];
  const activeStartWithOption = START_WITH_OPTIONS.find((entry) => entry.id === activeStartWith);
  const activeContextKey = `${deferredQuery}|${activePreset}|${activeFacet?.id || ""}`;

  const localRankedPool = useMemo(() => {
    return rankLocalPool(contentPool, {
      query: deferredQuery,
      presetId: activePreset,
      facet: activeFacet,
    });
  }, [contentPool, deferredQuery, activePreset, activeFacet]);

  const localFeedFallback = useMemo(() => {
    return localRankedPool.filter((item) => matchesQuery(item, deferredQuery) && matchesFacet(item, activeFacet));
  }, [localRankedPool, deferredQuery, activeFacet]);

  useEffect(() => {
    setFeedItems([]);
    setFeedPage(1);
    setHasMoreFeed(true);
    setFeedError("");
  }, [activeContextKey]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFeed() {
      if (!hasMoreFeed && feedPage > 1) return;

      setIsFeedLoading(true);
      setFeedError("");

      try {
        const remoteItems = await fetchExploreItems({
          query: deferredQuery,
          presetId: activePreset,
          facet: activeFacet,
          page: feedPage,
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        const shuffledRemote = shuffleFeedBatch(remoteItems);

        if (shuffledRemote.length) {
          setFeedItems((current) => {
            const existingKeys = new Set(current.map(itemKey));
            const nextBatch = shuffledRemote.filter((item) => !existingKeys.has(itemKey(item)));
            return dedupeMedia([...current, ...nextBatch]);
          });
          setHasMoreFeed(shuffledRemote.length >= FEED_PAGE_SIZE);
        } else {
          const start = (feedPage - 1) * FEED_PAGE_SIZE;
          const fallbackSlice = shuffleFeedBatch(localFeedFallback.slice(start, start + FEED_PAGE_SIZE));

          setFeedItems((current) => {
            const existingKeys = new Set(current.map(itemKey));
            const nextBatch = fallbackSlice.filter((item) => !existingKeys.has(itemKey(item)));
            return dedupeMedia([...current, ...nextBatch]);
          });
          setHasMoreFeed(fallbackSlice.length >= FEED_PAGE_SIZE);
        }
      } catch {
        if (!controller.signal.aborted) {
          const start = (feedPage - 1) * FEED_PAGE_SIZE;
          const fallbackSlice = localFeedFallback.slice(start, start + FEED_PAGE_SIZE);
          setFeedItems((current) => {
            const existingKeys = new Set(current.map(itemKey));
            const nextBatch = fallbackSlice.filter((item) => !existingKeys.has(itemKey(item)));
            return dedupeMedia([...current, ...nextBatch]);
          });
          setHasMoreFeed(fallbackSlice.length >= FEED_PAGE_SIZE);
          if (!fallbackSlice.length) setFeedError("Fresh recommendations are taking longer than usual.");
        }
      } finally {
        if (!controller.signal.aborted) setIsFeedLoading(false);
      }
    }

    loadFeed();
    return () => controller.abort();
  }, [
    feedPage,
    deferredQuery,
    activePreset,
    activeFacet,
    localFeedFallback,
    hasMoreFeed,
  ]);

  useEffect(() => {
    if (!sentinelRef.current || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || isFeedLoading || !hasMoreFeed) return;
        setFeedPage((current) => current + 1);
      },
      { rootMargin: "340px 0px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isFeedLoading, hasMoreFeed]);

  useEffect(() => {
    if (!scanFile) {
      setScanPreviewUrl("");
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(scanFile);
    setScanPreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [scanFile]);

  useEffect(() => {
    if (!isScannerOpen) return undefined;

    function handleEscape(event) {
      if (event.key === "Escape") {
        handleScannerEscape();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isScannerOpen, handleScannerEscape]);

  useEffect(() => {
    return () => {
      scanAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const handleOpenScanner = () => setIsScannerOpen(true);
    window.addEventListener("open-scanner", handleOpenScanner);
    return () => window.removeEventListener("open-scanner", handleOpenScanner);
  }, []);

  function resetScanState() {
    scanAbortRef.current?.abort();
    scanAbortRef.current = null;
    setScanFile(null);
    setScanPreviewUrl("");
    setScanDetectedText("");
    setScanQueryDraft("");
    setScanSceneDraft("");
    setScanResults([]);
    setScanError("");
    setIsScanDropActive(false);
    setIsScanningImage(false);
    setIsSearchingScanResults(false);
    setHasScanAttempted(false);
    setHasScanSearchCompleted(false);

    if (scanFileInputRef.current) {
      scanFileInputRef.current.value = "";
    }
  }

  function closeScanner() {
    setIsScannerOpen(false);
    resetScanState();
  }

  function handOffFromScanner(action) {
    if (!isScannerOpen) {
      action?.();
      return;
    }

    setIsScannerOpen(false);
    window.setTimeout(() => {
      action?.();
      resetScanState();
    }, 90);
  }

  function handleInfo(item) {
    handOffFromScanner(() => onSelectItem?.(item));
  }

  function handleAdd(item) {
    if (!session) {
      handOffFromScanner(() => onRequireAuth?.());
      return;
    }

    handOffFromScanner(() => onSelectItem?.(item));
  }

  function toggleStartWith(optionId) {
    setActiveStartWith((current) => {
      const nextValue = current === optionId ? null : optionId;
      if (nextValue === null) setActiveFacet(null);
      return nextValue;
    });
  }

  function togglePreset(presetId) {
    setActivePreset((current) => (current === presetId ? "trending" : presetId));
  }

  function toggleFacet(entry) {
    setActiveFacet((current) => (current?.id === entry.id ? null : entry));
  }

  function handleScanFilePicked(nextFile) {
    if (!nextFile) return;

    if (!nextFile.type?.startsWith("image/")) {
      setScanError("Upload a JPG, PNG, or WebP screenshot to scan.");
      return;
    }

    scanAbortRef.current?.abort();
    setScanFile(nextFile);
    setScanDetectedText("");
    setScanQueryDraft("");
    setScanSceneDraft("");
    setScanResults([]);
    setScanError("");
    setHasScanAttempted(false);
    setHasScanSearchCompleted(false);
    setIsScanDropActive(false);
  }

  function handleScanInputChange(event) {
    const [nextFile] = event.target.files || [];
    handleScanFilePicked(nextFile);
  }

  function openFilePicker() {
    scanFileInputRef.current?.click();
  }

  function handleScanDrop(event) {
    event.preventDefault();
    setIsScanDropActive(false);
    handleScanFilePicked(event.dataTransfer?.files?.[0] || null);
  }

  function handleScanDragEnter(event) {
    event.preventDefault();
    setIsScanDropActive(true);
  }

  function handleScanDragLeave(event) {
    event.preventDefault();
    if (event.currentTarget === event.target) {
      setIsScanDropActive(false);
    }
  }

  function handleScanDragOver(event) {
    event.preventDefault();
  }

  async function searchScannedTitle(textInputValue, sceneInputValue) {
    const nextTextQuery = cleanDetectedText(textInputValue).slice(0, 80);
    const nextSceneQuery = cleanDetectedText(sceneInputValue).slice(0, 80);
    setScanQueryDraft(nextTextQuery);
    setScanSceneDraft(nextSceneQuery);
    setHasScanSearchCompleted(false);

    if (!nextTextQuery && !nextSceneQuery) {
      setScanResults([]);
      setScanError("Edit the detected text or scene so we have something to search.");
      return;
    }

    scanAbortRef.current?.abort();
    const controller = new AbortController();
    scanAbortRef.current = controller;

    setScanError("");
    setIsSearchingScanResults(true);

    try {
      const variations = generateSearchVariations(nextTextQuery, nextSceneQuery);
      
      const fetchPromises = variations.map((query) =>
        fetchExploreItems({
          query,
          presetId: null,
          facet: null,
          page: 1,
          signal: controller.signal,
        })
      );
      
      const resultsArrays = await Promise.all(fetchPromises);
      if (controller.signal.aborted) return;
      
      const aggregatedResults = dedupeMedia(resultsArrays.flat());
      const rankedResults = rankSmartScanResults(aggregatedResults, nextTextQuery || nextSceneQuery);

      setSearchQuery(nextTextQuery || nextSceneQuery);
      setScanResults(rankedResults.slice(0, SCAN_RESULTS_LIMIT));
      setHasScanSearchCompleted(true);
    } catch {
      if (!controller.signal.aborted) {
        setScanResults([]);
        setScanError("TMDB search is taking longer than usual. Try refining the detected text.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsSearchingScanResults(false);
      }
    }
  }

  async function handlePrimaryScanAction() {
    if (!scanFile || isScanningImage || isSearchingScanResults) return;

    if (hasScanAttempted) {
      await searchScannedTitle(scanQueryDraft, scanSceneDraft);
      return;
    }

    setHasScanAttempted(true);
    setIsScanningImage(true);
    setScanError("");
    setScanResults([]);
    setHasScanSearchCompleted(false);

    try {
      const imgEl = new Image();
      imgEl.src = scanPreviewUrl;
      await new Promise((resolve, reject) => {
        imgEl.onload = resolve;
        imgEl.onerror = reject;
      });

      const [Tesseract, mobilenetModel] = await Promise.all([
        loadTesseractClient(),
        loadMobileNetClient()
      ]);
      
      const [scanResponse, labelPredictions] = await Promise.all([
        Tesseract.recognize(scanFile, "eng").catch(() => null),
        mobilenetModel.classify(imgEl).catch(() => null)
      ]);
      
      const rawText = cleanDetectedText(scanResponse?.data?.text || "");
      const suggestedQuery = pickScanQuery(scanResponse?.data?.text || "");
      
      const topLabels = (labelPredictions || []).slice(0, 2).map((p) => p.className.split(",")[0].toLowerCase());
      const suggestedScene = topLabels.join(" ");

      setScanDetectedText(rawText);
      setScanQueryDraft(suggestedQuery);
      setScanSceneDraft(suggestedScene);

      if (!suggestedQuery && !suggestedScene) {
        setScanError("We could not confidently recognize the image. Try another screenshot or type manually.");
        return;
      }

      await searchScannedTitle(suggestedQuery, suggestedScene);
    } catch {
      setScanError("Scanning failed. Try another screenshot or search with a clearer crop.");
    } finally {
      setIsScanningImage(false);
    }
  }

  return (
    <section className="browse-hub">
      <div className="explore-layout">
        <header className="explore-page-header">
          <h1>Explore</h1>
          <p>Start somewhere strong, then let the next watch find you.</p>
        </header>

        <div className="explore-search-row">
          <div className="explore-search-input-wrap">
            <input
              className="explore-search-input"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search movies, series, anime..."
              aria-label="Search movies, series, anime"
            />
          </div>
          <button type="button" className="explore-scan-btn" onClick={() => setIsScannerOpen(true)}>
            <FaCamera aria-hidden="true" />
            <span>Scan</span>
          </button>
        </div>

        <section className="explore-guide-shell">
          <div className="explore-guide-row">
            <span className="explore-guide-label">Start with:</span>
            <div className="explore-chip-row">
              {START_WITH_OPTIONS.map((option) => (
                <Motion.button
                  key={option.id}
                  type="button"
                  className={`explore-pill-btn${activeStartWith === option.id ? " active" : ""}`}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.14), 0 0 16px rgba(255,255,255,0.12)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleStartWith(option.id)}
                >
                  {option.icon} {option.label}
                </Motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence initial={false}>
            {activeStartWith && (
              <Motion.div
                className="explore-context-shell"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              >
                <div className="explore-context-head">
                  <span>
                    {START_WITH_CONTEXT_HINT[activeStartWith] || "Choose a lane"}
                  </span>
                  <button
                    type="button"
                    className="explore-link-btn"
                    onClick={() => {
                      if (activeStartWithOption?.route) navigate(activeStartWithOption.route);
                    }}
                  >
                    Open full page
                  </button>
                </div>
                <div className="explore-chip-row">
                  {contextualEntries.map((entry) => (
                    <Motion.button
                      key={entry.id}
                      type="button"
                      className={`explore-pill-btn explore-pill-subtle${activeFacet?.id === entry.id ? " active" : ""}`}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleFacet(entry)}
                    >
                      {entry.label}
                    </Motion.button>
                  ))}
                </div>
              </Motion.div>
            )}
          </AnimatePresence>

          <div className="explore-guide-row explore-guide-row-stack">
            <span className="explore-guide-label">Quick picks:</span>
            <div className="explore-chip-row">
              {QUICK_PRESETS.map((preset) => (
                <Motion.button
                  key={preset.id}
                  type="button"
                  className={`explore-pill-btn explore-pill-preset${activePreset === preset.id ? " active" : ""}`}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => togglePreset(preset.id)}
                >
                  {preset.label}
                </Motion.button>
              ))}
            </div>
          </div>
        </section>

        <section className="explore-feed-section">
          <SectionHeader
            title="Discover"
            subtitle="One continuous, mixed discovery feed with fresh titles loading as you scroll."
          />

          {feedItems.length ? (
            <Motion.div
              className="explore-feed-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {feedItems.map((item, index) => (
                <Motion.div
                  key={`feed-${itemKey(item)}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: Math.min(index, 8) * 0.03 }}
                >
                  <ExploreCard
                    item={item}
                    variant="feed"
                    hoveredItemId={hoveredItemId}
                    setHoveredItemId={setHoveredItemId}
                    onInfo={handleInfo}
                    onAdd={handleAdd}
                  />
                </Motion.div>
              ))}
            </Motion.div>
          ) : isFeedLoading ? (
            <FeedSkeleton />
          ) : (
            <div className="explore-empty-note">No recommendations landed for this combination yet.</div>
          )}

          {feedError && <div className="explore-feed-note">{feedError}</div>}
          {isFeedLoading && feedItems.length > 0 && <div className="explore-feed-note">Loading more picks...</div>}
          {!hasMoreFeed && feedItems.length > 0 && <div className="explore-feed-note">You have reached the end of this lane for now.</div>}
          <div ref={sentinelRef} className="explore-feed-sentinel" aria-hidden="true" />
        </section>

        <ImageScannerModal
          isOpen={isScannerOpen}
          onClose={closeScanner}
          fileInputRef={scanFileInputRef}
          previewUrl={scanPreviewUrl}
          selectedFileName={scanFile?.name}
          queryDraft={scanQueryDraft}
          sceneDraft={scanSceneDraft}
          rawDetectedText={scanDetectedText}
          results={scanResults}
          error={scanError}
          isDropActive={isScanDropActive}
          isScanning={isScanningImage}
          isSearching={isSearchingScanResults}
          hasScanAttempted={hasScanAttempted}
          hasSearchCompleted={hasScanSearchCompleted}
          onQueryChange={setScanQueryDraft}
          onSceneChange={setScanSceneDraft}
          onChooseFile={openFilePicker}
          onFileChange={handleScanInputChange}
          onDrop={handleScanDrop}
          onDragEnter={handleScanDragEnter}
          onDragLeave={handleScanDragLeave}
          onDragOver={handleScanDragOver}
          onPrimaryAction={handlePrimaryScanAction}
          onReset={resetScanState}
          onInfo={handleInfo}
          onAdd={handleAdd}
          session={session}
        />
      </div>
    </section>
  );
}

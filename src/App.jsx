import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// ─── lib ─────────────────────────────────────────────────────────────────────
import { supabase } from "./lib/supabase";
import {
  TMDB_IMG, TMDB_BASE, TMDB_KEY,
  STATUSES, SCOLOR, OTT,
  STATIC_ANIME, STATIC_MOVIES, STATIC_SERIES, HERO_ITEMS,
  EXPLORE_CATEGORY_GROUPS, EXPLORE_GENRE_CARDS, EXPLORE_COUNTRY_CARDS,
  EXPLORE_LANGUAGE_CARDS, EXPLORE_SUB_FAMILY_FRIENDLY, EXPLORE_SUB_ANIME,
  EXPLORE_SUB_AWARD_WINNERS, EXPLORE_SUB_FRANCHISE, EXPLORE_SUB_EDITORS_PICK,
  toGenreSlug, toCountrySlug, DEFAULT_SETTINGS,
} from "./lib/constants";

// ─── components ──────────────────────────────────────────────────────────────
import { Icon, getStatusIcon } from "./components/Icon";
import PosterImage from "./components/PosterImage";
import TmdbSection from "./components/TmdbSection";
import HeroCarousel from "./components/HeroCarousel";
import SeeAllModal from "./components/SeeAllModal";
import RowSection from "./components/RowSection";
import SettingsPanel from "./components/SettingsPanel";
import AuthModal from "./components/AuthModal";
import BrowseItemResults from "./components/BrowseItemResults";

// ─── pages ───────────────────────────────────────────────────────────────────
import CategoryPage from "./pages/CategoryPage";
import GenrePage from "./pages/GenrePage";
import CountryPage from "./pages/CountryPage";
import LanguagePage from "./pages/LanguagePage";
import BrowseSectionPage from "./pages/BrowseSectionPage";
import BrowseItemPage from "./pages/BrowseItemPage";

// ─── OTT ICON — img with text-badge fallback ────────────────────────────────
function OttIcon({ ott }) {
  const [broken, setBroken] = useState(false);
  if (!ott) return null;
  if (broken) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 20, height: 20, borderRadius: 4, fontSize: 9, fontWeight: 800,
        background: ott.color, color: "#fff", letterSpacing: 0.3, flexShrink: 0
      }}>{ott.short}</span>
    );
  }
  return (
    <img
      src={ott.logo}
      className="ott-drop-icon"
      alt={ott.name}
      onError={() => setBroken(true)}
      style={{ width: 20, height: 20, objectFit: "contain", borderRadius: 4, flexShrink: 0, background: ott.bg }}
    />
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [allEntries, setAllEntries] = useState([]);
  const [myEntries, setMyEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── settings ──
  const [settings, setSettings] = useState(() => {
    try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem("rl_settings") || "{}") }; }
    catch { return DEFAULT_SETTINGS; }
  });
  const scrollRef = useRef(0);
  const initialMountRef = useRef(true);
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
      settings.accentColor === "blue" ? "acc-blue" :
        settings.accentColor === "red" ? "acc-red" : "";

  const navigate = useNavigate();

  const handleTypeNav = (type) => {
    const slug = (type || "").toLowerCase().replace(/\s+/g, "-");
    navigate(`/category/${slug}`);
  };

  useEffect(() => {
    const saveScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", saveScroll);
    return () => window.removeEventListener("scroll", saveScroll);
  }, []);

  const updateListIfChanged = useCallback((setter, next) => {
    if (!Array.isArray(next)) return;
    setter(prev => {
      const prevLen = prev?.length || 0;
      const nextLen = next.length;
      const prevFirst = prevLen ? prev[0]?.id : null;
      const nextFirst = nextLen ? next[0]?.id : null;
      return (prevLen !== nextLen || prevFirst !== nextFirst) ? next : prev;
    });
  }, []);

  const fetchTrendingByMode = useCallback(async (mode) => {
    const lang = settings.language || "en";
    const res = await fetch(`${TMDB_BASE}/trending/all/${mode}?api_key=${TMDB_KEY}&language=${lang}`).then(r => r.json()).catch(() => null);
    if (res?.results?.length) {
      const mapR = r => {
        const title = r.title || r.name || "";
        const mediaType = r.media_type || "movie";
        return { id: r.id, tmdbId: r.id, tmdbType: mediaType, title, year: (r.release_date || r.first_air_date || "").slice(0, 4), rating: r.vote_average, type: mediaType === "movie" ? "Movie" : "TV Show", poster: r.poster_path, backdrop: r.backdrop_path, overview: r.overview, streaming: [], _rawId: r.id, _type: mediaType };
      };
      updateListIfChanged(setHomeTrending, res.results.slice(0, 20).map(mapR));
    }
  }, [settings.language, updateListIfChanged]);

  const fetchPopularByMode = useCallback(async (mode) => {
    const lang = settings.language || "en";
    const POPULAR_ENDPOINTS = {
      streaming: `${TMDB_BASE}/movie/popular?api_key=${TMDB_KEY}&language=${lang}&region=IN`,
      tv: `${TMDB_BASE}/tv/popular?api_key=${TMDB_KEY}&language=${lang}`,
      rent: `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&language=${lang}&with_watch_monetization_types=rent&watch_region=IN&sort_by=popularity.desc`,
      theaters: `${TMDB_BASE}/movie/now_playing?api_key=${TMDB_KEY}&language=${lang}&region=IN`,
    };
    const res = await fetch(POPULAR_ENDPOINTS[mode] || POPULAR_ENDPOINTS.streaming).then(r => r.json()).catch(() => null);
    if (res?.results?.length) {
      const typeLabel = mode === "tv" ? "TV Show" : "Movie";
      const mapR = r => ({ id: r.id, tmdbId: r.id, tmdbType: mode === "tv" ? "tv" : "movie", title: r.title || r.name || "", year: (r.release_date || r.first_air_date || "").slice(0, 4), rating: r.vote_average, type: typeLabel, poster: r.poster_path, backdrop: r.backdrop_path, overview: r.overview, streaming: [], _rawId: r.id, _type: mode === "tv" ? "tv" : "movie" });
      updateListIfChanged(setHomePopular, res.results.slice(0, 20).map(mapR));
    }
  }, [settings.language, updateListIfChanged]);

  const fetchFreeByMode = useCallback(async (mode) => {
    const lang = settings.language || "en";
    const freeType = mode === "movies" ? "movie" : "tv";
    const res = await fetch(`${TMDB_BASE}/discover/${freeType}?api_key=${TMDB_KEY}&language=${lang}&with_watch_monetization_types=free&watch_region=IN&sort_by=popularity.desc`).then(r => r.json()).catch(() => null);
    if (res?.results?.length) {
      const typeLabel = mode === "movies" ? "Movie" : "TV Show";
      const mapR = r => ({ id: r.id, tmdbId: r.id, tmdbType: freeType, title: r.title || r.name || "", year: (r.release_date || r.first_air_date || "").slice(0, 4), rating: r.vote_average, type: typeLabel, poster: r.poster_path, backdrop: r.backdrop_path, overview: r.overview, streaming: [], _rawId: r.id, _type: freeType });
      updateListIfChanged(setHomeFree, res.results.slice(0, 20).map(mapR));
    }
  }, [settings.language, updateListIfChanged]);

  const handleTrendTab = useCallback((mode) => {
    setTrendMode(mode);
    fetchTrendingByMode(mode);
  }, [fetchTrendingByMode]);

  const handlePopularTab = useCallback((mode) => {
    setPopularMode(mode);
    fetchPopularByMode(mode);
  }, [fetchPopularByMode]);

  const handleFreeTab = useCallback((mode) => {
    setFreeMode(mode);
    fetchFreeByMode(mode);
  }, [fetchFreeByMode]);

  // Sync theme to <html> so CSS variables cascade everywhere
  useEffect(() => {
    const root = document.documentElement;
    const cls = `theme-${settings.theme || "black"}`;
    root.classList.remove("theme-black", "theme-light", "theme-neo");
    root.classList.add(cls);
  }, [settings.theme]);

  // ── auth ──
  const [session, setSession] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  // ── page ──
  const [page, setPage] = useState("home");
  const [exploreView, setExploreView] = useState(null); // null | "categories" | "genres" | "countries" | "languages" | ...
  const [expandedSub, setExpandedSub] = useState(null);
  const [expandedSubSub, setExpandedSubSub] = useState(null);
  const [browseItem, setBrowseItem] = useState(null); // { sectionType, item } for drill-down results
  const [exploreCategorySearch, setExploreCategorySearch] = useState("");
  const [exploreGenreSearch, setExploreGenreSearch] = useState("");
  const [exploreCountrySearch, setExploreCountrySearch] = useState("");
  const [exploreLanguageSearch, setExploreLanguageSearch] = useState("");
  const [exploreFamilyFriendlySearch, setExploreFamilyFriendlySearch] = useState("");
  const [exploreAwardWinnersSearch, setExploreAwardWinnersSearch] = useState("");
  const [exploreEditorsPickSearch, setExploreEditorsPickSearch] = useState("");
  const [exploreAnimeSearch, setExploreAnimeSearch] = useState("");
  const [exploreFranchiseSearch, setExploreFranchiseSearch] = useState("");

  // ── sub-section filters (shared across Browse By subsections) ──
  const [subFilterType, setSubFilterType] = useState("All");
  const [subSortBy, setSubSortBy] = useState("added");
  const [subOttFilter, setSubOttFilter] = useState("all");
  const [subSortOpen, setSubSortOpen] = useState(false);
  const [subOttOpen, setSubOttOpen] = useState(false);

  // ── home content ──
  const [heroItems, setHeroItems] = useState(HERO_ITEMS);
  const [homeAnime, setHomeAnime] = useState(STATIC_ANIME);
  const [homeMovies, setHomeMovies] = useState(STATIC_MOVIES);
  const [homeSeries, setHomeSeries] = useState(STATIC_SERIES);

  // ── TMDB-style section data ──
  const [homeTrending, setHomeTrending] = useState([]);
  const [homePopular, setHomePopular] = useState([]);
  const [homeFree, setHomeFree] = useState([]);

  const allContent = useMemo(() => {
    const buckets = [heroItems, homeAnime, homeMovies, homeSeries, homeTrending, homePopular, homeFree, allEntries, myEntries];
    const map = new Map();
    buckets.forEach(list => list?.forEach(item => {
      const key = `${item.tmdbId || item.tmdb_id || item.id || item.title}-${item.type}`;
      if (!map.has(key)) map.set(key, item);
    }));
    return Array.from(map.values());
  }, [heroItems, homeAnime, homeMovies, homeSeries, homeTrending, homePopular, homeFree, allEntries, myEntries]);

  // ── section tab states ──
  const [trendMode, setTrendMode] = useState("day");
  const [popularMode, setPopularMode] = useState("streaming");
  const [freeMode, setFreeMode] = useState("movies");


  // ── filters ──
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("added");
  const [showAnime, setShowAnime] = useState(true);
  const [familyFriendly, setFamilyFriendly] = useState(false);
  const [ottFilter, setOttFilter] = useState("all");
  const [ottDropdownOpen, setOttDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const filterRowRef = useRef(null);

  // ── search ──
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const searchRef = useRef(null);
  const debRef = useRef(null);

  // ── modal ──
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ status: "Want to Watch", rating: null, notes: "" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // ── see-all modal ──
  const [seeAll, setSeeAll] = useState(null); // { title, emoji, items }

  // ── nav scroll ──
  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    const h = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // ── nav dropdown ──
  const [navDropdown, setNavDropdown] = useState(null);
  const navDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target)) {
        setNavDropdown(null);
      }
      if (filterRowRef.current && !filterRowRef.current.contains(e.target)) {
        setOttDropdownOpen(false);
        setSortDropdownOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (page !== "explore") {
      setExploreView(null);
      setExpandedSub(null);
      setExpandedSubSub(null);
      setBrowseItem(null);
      setExploreCategorySearch("");
      setExploreGenreSearch("");
      setExploreCountrySearch("");
      setExploreLanguageSearch("");
      setExploreFamilyFriendlySearch("");
      setExploreAwardWinnersSearch("");
      setExploreEditorsPickSearch("");
      setExploreAnimeSearch("");
      setExploreFranchiseSearch("");
      setSubFilterType("All");
      setSubSortBy("added");
      setSubOttFilter("all");
      setSubSortOpen(false);
      setSubOttOpen(false);
    }
  }, [page]);

  // Reset browseItem when navigating to a different section
  useEffect(() => {
    setBrowseItem(null);
  }, [exploreView]);

  // ── Load live catalog / hero from TMDB ──

  // ── Layer 1: TMDB provider name → OTT key ──────────────────────────────────
  const PROVIDER_MAP = {
    "Netflix": "nf",
    "Amazon Prime Video": "prime",
    "Disney Plus Hotstar": "hs",
    "Hotstar": "hs",
    "JioHotstar": "hs",
    "Disney+ Hotstar": "hs",
    "SonyLIV": "sony",
    "SonyLiv": "sony",
    "ZEE5": "zee5",
    "Zee5": "zee5",
    "Apple TV+": "atv",
    "Apple TV Plus": "atv",
    "Crunchyroll": "cr",
    "Max": "hbo",
    "HBO Max": "hbo",
  };

  // ── Layer 2a: Manual overrides by TMDB ID ───────────────────────────────────
  const MANUAL_BY_ID = {
    // Format: tmdbId: ["ott_key", ...]
    // Example: 1396: ["nf"]  (Breaking Bad)
  };

  // ── Layer 2b: Manual overrides by title ─────────────────────────────────────
  const MANUAL_BY_TITLE = {
    "Daredevil: Born Again": ["hs"],
    "Loki": ["hs"],
    "Moon Knight": ["hs"],
    "WandaVision": ["hs"],
    "The Falcon and the Winter Soldier": ["hs"],
    "Hawkeye": ["hs"],
    "Ms. Marvel": ["hs"],
    "She-Hulk: Attorney at Law": ["hs"],
    "Secret Invasion": ["hs"],
    "Echo": ["hs"],
    "Agatha All Along": ["hs"],
    "Andor": ["hs"],
    "The Mandalorian": ["hs"],
    "Obi-Wan Kenobi": ["hs"],
    "The Last of Us": ["hs"],
    "House of the Dragon": ["hs"],
    "Succession": ["hs"],
    "The Wire": ["hs"],
    "Peaky Blinders": ["nf"],
    "Squid Game": ["nf"],
    "Wednesday": ["nf"],
    "Stranger Things": ["nf"],
    "Arcane": ["nf"],
    "Dark": ["nf"],
    "Invincible": ["prime"],
    "The Boys": ["prime"],
    "Reacher": ["prime"],
    "Fallout": ["prime"],
  };

  // ── Layer 3: Keyword-based smart fallback ───────────────────────────────────
  const KEYWORD_MAP = [
    { match: ["Marvel", "Disney", "Star Wars", "Pixar", "National Geographic"], ott: ["hs"] },
    { match: ["HBO", "Warner", "Max Original", "DC"], ott: ["hs"] },
    { match: ["Amazon", "Prime Original", "Amazon Studios"], ott: ["prime"] },
    { match: ["Netflix", "Netflix Original"], ott: ["nf"] },
    { match: ["Sony", "Sony Pictures"], ott: ["sony"] },
    { match: ["ZEE", "Zee Studios"], ott: ["zee5"] },
    { match: ["Apple", "A24"], ott: ["atv"] },
  ];

  async function getOTT(id, type, title = "") {
    if (MANUAL_BY_ID[id]) return MANUAL_BY_ID[id];
    if (title && MANUAL_BY_TITLE[title]) return MANUAL_BY_TITLE[title];
    try {
      const res = await fetch(`${TMDB_BASE}/${type}/${id}/watch/providers?api_key=${TMDB_KEY}`);
      const data = await res.json();
      const flatrate = data.results?.IN?.flatrate || [];
      const mapped = [...new Set(
        flatrate.map(p => PROVIDER_MAP[p.provider_name]).filter(Boolean)
      )];
      if (mapped.length) return mapped;
    } catch { /* fall through */ }
    if (title) {
      for (const { match, ott } of KEYWORD_MAP) {
        if (match.some(kw => title.includes(kw))) return ott;
      }
    }
    return [];
  }

  useEffect(() => {
    const abort = new AbortController();
    const lang = settings.language || "en";
    const adult = settings.adultContent ? "true" : "false";
    const mapItem = (r, typeLabel) => {
      const title = r.title || r.name || "";
      const year = (r.release_date || r.first_air_date || "").slice(0, 4);
      const mediaType = r.media_type || (typeLabel === "Movie" ? "movie" : "tv");
      const resolvedType = typeLabel || (mediaType === "movie" ? "Movie" : "TV Show");

      return {

        id: r.id,
        tmdbId: r.id,
        tmdbType: mediaType,
        title,
        year,
        rating: r.vote_average,
        type: resolvedType,
        poster: r.poster_path,
        backdrop: r.backdrop_path,
        overview: r.overview,

        ott: null,
        streaming: [],

        _rawId: r.id,
        _type: mediaType,
      };
    };

    async function attachOTT(list) {
      return await Promise.all(
        list.map(async (item) => {
          const streaming = await getOTT(item._rawId, item._type, item.title || "");
          return {
            ...item,
            streaming,
            ott: streaming[0] || null,
          };
        })
      );
    }

    async function loadHome() {
      try {
        const [trendAll, trendAllIN, trendMovies, trendTv, anime] = await Promise.all([
          fetch(`${TMDB_BASE}/trending/all/week?api_key=${TMDB_KEY}&language=${lang}&include_adult=${adult}`, { signal: abort.signal }).then(r => r.json()).catch(() => null),
          fetch(`${TMDB_BASE}/trending/all/week?api_key=${TMDB_KEY}&language=-IN&region=IN&include_adult=${adult}`, { signal: abort.signal }).then(r => r.json()).catch(() => null),
          fetch(`${TMDB_BASE}/trending/movie/week?api_key=${TMDB_KEY}&language=${lang}&include_adult=${adult}`, { signal: abort.signal }).then(r => r.json()).catch(() => null),
          fetch(`${TMDB_BASE}/trending/tv/week?api_key=${TMDB_KEY}&language=${lang}&include_adult=${adult}`, { signal: abort.signal }).then(r => r.json()).catch(() => null),
          fetch(`${TMDB_BASE}/discover/tv?api_key=${TMDB_KEY}&language=${lang}&with_genres=16&sort_by=popularity.desc&include_adult=${adult}`, { signal: abort.signal }).then(r => r.json()).catch(() => null),
        ]);

        const valid = r =>
          (r.media_type === "movie" || r.media_type === "tv") &&
          r.backdrop_path && r.poster_path;

        const globalList = (trendAll?.results || []).filter(valid);
        const indiaList = (trendAllIN?.results || []).filter(valid);

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

        pushList(indiaList.slice(0, 6));
        pushList(globalList);
        pushList(indiaList.slice(6));

        if (heroCombined.length) {
          const mapped = heroCombined.slice(0, 20).map(r => mapItem(r));
          const withOTT = await attachOTT(mapped);
          setHeroItems(withOTT);
        }
        if (trendMovies?.results?.length) {
          const mapped = trendMovies.results.slice(0, 20).map(r => mapItem(r, "Movie"));
          const withOTT = await attachOTT(mapped);
          setHomeMovies(withOTT);
        }
        if (trendTv?.results?.length) {
          const mapped = trendTv.results.slice(0, 20).map(r => mapItem(r, "TV Show"));
          const withOTT = await attachOTT(mapped);
          setHomeSeries(withOTT);
        }
        if (anime?.results?.length) {
          const mapped = anime.results.slice(0, 20).map(r => mapItem(r, "Anime"));
          const withOTT = await attachOTT(mapped);
          setHomeAnime(withOTT);
        }

        // ── Trending section (day) ──
        const trendDay = await fetch(`${TMDB_BASE}/trending/all/day?api_key=${TMDB_KEY}&language=${lang}`, { signal: abort.signal }).then(r => r.json()).catch(() => null);
        if (trendDay?.results?.length) {
          const mapped = trendDay.results.slice(0, 20).map(r => mapItem(r));
          updateListIfChanged(setHomeTrending, mapped);
        }

        // ── What's Popular — streaming ──
        const popStream = await fetch(`${TMDB_BASE}/movie/popular?api_key=${TMDB_KEY}&language=${lang}&region=IN`, { signal: abort.signal }).then(r => r.json()).catch(() => null);
        if (popStream?.results?.length) {
          const mapped = popStream.results.slice(0, 20).map(r => mapItem(r, "Movie"));
          updateListIfChanged(setHomePopular, mapped);
        }

        // ── Free to watch — movies ──
        const freeMovies = await fetch(`${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&language=${lang}&with_watch_monetization_types=free&watch_region=IN&sort_by=popularity.desc`, { signal: abort.signal }).then(r => r.json()).catch(() => null);
        if (freeMovies?.results?.length) {
          const mapped = freeMovies.results.slice(0, 20).map(r => mapItem(r, "Movie"));
          updateListIfChanged(setHomeFree, mapped);
        }

      } catch { }
    }

    loadHome();
    return () => abort.abort();
  }, []);

  useEffect(() => {
    if (initialMountRef.current) {
      initialMountRef.current = false;
      window.scrollTo({
        top: scrollRef.current,
        behavior: "instant"
      });
    }
  }, []);

  // ── Auth listener ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) {
        setShowAuth(false);
        setPage("home");
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
      } catch { }
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

  async function selectResult(r) {
    if (!session) { setShowDrop(false); setSearch(""); setShowAuth(true); return; }
    const type = getType(r);
    const year = (r.release_date || r.first_air_date || "").split("-")[0];
    const tmdbType = r.media_type || (type === "Movie" ? "movie" : "tv");

    // Fetch OTT data
    const streaming = await getOTT(r.id, tmdbType, r.title || r.name || "");

    setModalData({
      title: r.title || r.name,
      type,
      year,
      poster: r.poster_path,
      tmdb_id: r.id,
      tmdbId: r.id,
      tmdbType,
      overview: r.overview,
      streaming: streaming || []
    });
    setForm({ status: "Want to Watch", rating: null, notes: "" });
    setEditId(null); setShowDrop(false); setSearch(""); setShowModal(true);
  }

  function openFromCard(item) {
    if (!session) { setShowAuth(true); return; }
    setModalData({
      title: item.title, type: item.type, year: item.year,
      poster: item.poster,
      tmdbId: item.tmdbId || item.tmdb_id,
      tmdb_id: item.tmdbId || item.tmdb_id,
      tmdbType: item.tmdbType,
      overview: item.overview,
      streaming: item.streaming || [],
    });
    setForm({ status: "Want to Watch", rating: null, notes: "" });
    setEditId(null); setShowModal(true);
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

  function handleExport() {
    const blob = new Blob([JSON.stringify(myEntries, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `reellog-export-${new Date().toISOString().slice(0, 10)}.json`;
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
    .filter(e => {
      if (filterType !== "All" && e.type !== filterType) return false;
      if (!showAnime && e.type === "Anime") return false;
      if (familyFriendly) {
        if (e.genre_ids && (e.genre_ids.includes(27) || e.genre_ids.includes(53))) return false;
        if (e.rating === "R" || e.rating === "NC-17") return false;
      }
      if (ottFilter !== "all") {
        const streamArray = e.streaming || [];
        if (e.ott !== ottFilter && !streamArray.includes(ottFilter)) return false;
      }
      return true;
    })
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

  const filteredExploreCategoryGroups = useMemo(() => {
    const search = exploreCategorySearch.trim().toLowerCase();
    const grouped = {};
    Object.entries(EXPLORE_CATEGORY_GROUPS).forEach(([letter, genres]) => {
      const list = search ? genres.filter(g => g.toLowerCase().includes(search)) : genres;
      if (list.length) grouped[letter] = list;
    });
    return grouped;
  }, [exploreCategorySearch]);

  const filteredExploreGenres = useMemo(() => {
    const search = exploreGenreSearch.trim().toLowerCase();
    return EXPLORE_GENRE_CARDS.filter(g => g.name.toLowerCase().includes(search));
  }, [exploreGenreSearch]);

  const filteredExploreCountries = useMemo(() => {
    const search = exploreCountrySearch.trim().toLowerCase();
    return EXPLORE_COUNTRY_CARDS.filter(c => c.name.toLowerCase().includes(search));
  }, [exploreCountrySearch]);

  const filteredExploreLanguages = useMemo(() => {
    const search = exploreLanguageSearch.trim().toLowerCase();
    return EXPLORE_LANGUAGE_CARDS.filter(lang => lang.name.toLowerCase().includes(search));
  }, [exploreLanguageSearch]);

  const filteredExploreFamilyFriendly = useMemo(() => {
    const search = exploreFamilyFriendlySearch.trim().toLowerCase();
    return EXPLORE_SUB_FAMILY_FRIENDLY.filter(g => g.name.toLowerCase().includes(search));
  }, [exploreFamilyFriendlySearch]);

  const filteredExploreAwardWinners = useMemo(() => {
    const search = exploreAwardWinnersSearch.trim().toLowerCase();
    return EXPLORE_SUB_AWARD_WINNERS.filter(g => g.name.toLowerCase().includes(search));
  }, [exploreAwardWinnersSearch]);

  const filteredExploreEditorsPick = useMemo(() => {
    const search = exploreEditorsPickSearch.trim().toLowerCase();
    return EXPLORE_SUB_EDITORS_PICK.filter(g => g.name.toLowerCase().includes(search));
  }, [exploreEditorsPickSearch]);

  const filteredExploreAnime = useMemo(() => {
    const search = exploreAnimeSearch.trim().toLowerCase();
    return EXPLORE_SUB_ANIME.filter(g => g.name.toLowerCase().includes(search));
  }, [exploreAnimeSearch]);

  const filteredExploreFranchise = useMemo(() => {
    const search = exploreFranchiseSearch.trim().toLowerCase();
    return EXPLORE_SUB_FRANCHISE.filter(g => g.name.toLowerCase().includes(search));
  }, [exploreFranchiseSearch]);

  const renderLibrary = (mode) => {
    const isExploreMode = mode === "explore";
    const categoryLetters = Object.keys(filteredExploreCategoryGroups);

    // ── shared filter toolbar for Browse By subsections ──
    const renderSubFilterToolbar = () => (
      <div className="custom-filter-bar" style={{ marginBottom: 16, marginTop: 4 }}>
        <div className="fil-group fil-left">
          {["All", "Movie", "TV Show", "Anime"].map(f => (
            <button key={f} className={`fil-pill${subFilterType === f ? " on" : ""}`} onClick={() => setSubFilterType(f)}>
              {f === "TV Show" ? "Series" : f}
            </button>
          ))}
        </div>
        <div className="fil-group fil-right">
          <div className="custom-dropdown">
            <button className="fil-pill drop-trigger" onClick={() => { setSubSortOpen(s => !s); setSubOttOpen(false); }}>
              Sort: {subSortBy === "added" ? "Recently Added" : subSortBy === "title" ? "Title A-Z" : subSortBy === "rating" ? "Top Rated" : "Newest"}
              <span className="caret">▼</span>
            </button>
            {subSortOpen && (
              <div className="drop-menu right-align">
                {[
                  { val: "added", lbl: "Recently Added" },
                  { val: "title", lbl: "Title A-Z" },
                  { val: "rating", lbl: "Top Rated" },
                  { val: "year", lbl: "Newest" },
                ].map(o => (
                  <div key={o.val} className={`drop-item${subSortBy === o.val ? " active" : ""}`} onClick={() => { setSubSortBy(o.val); setSubSortOpen(false); }}>
                    {o.lbl} {subSortBy === o.val && <span className="chk">✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="custom-dropdown">
            <button className="fil-pill drop-trigger" onClick={() => { setSubOttOpen(s => !s); setSubSortOpen(false); }}>
              {subOttFilter === "all" ? "All Channels" : (OTT[subOttFilter]?.name || "Channel")}
              {subOttFilter !== "all" && OTT[subOttFilter] && <OttIcon ott={OTT[subOttFilter]} />}
              <span className="caret">▼</span>
            </button>
            {subOttOpen && (
              <div className="drop-menu right-align" style={{ maxHeight: 300, overflowY: "auto" }}>
                <div className={`drop-item${subOttFilter === "all" ? " active" : ""}`} onClick={() => { setSubOttFilter("all"); setSubOttOpen(false); }}>
                  All Channels {subOttFilter === "all" && <span className="chk">✓</span>}
                </div>
                {Object.keys(OTT).map(k => (
                  <div key={k} className={`drop-item${subOttFilter === k ? " active" : ""}`} onClick={() => { setSubOttFilter(k); setSubOttOpen(false); }}>
                    <OttIcon ott={OTT[k]} />
                    {OTT[k].name} {subOttFilter === k && <span className="chk">✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );

    return (
      <>
        {isExploreMode && (
          <div style={{ padding: "104px 52px 0" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: "var(--tx)", lineHeight: 1, marginBottom: 16 }}>Browse By</div>
              <div className="browse-grid">
                <div className={`browse-item ${exploreView === "categories" ? "active" : ""}`} onClick={() => { setExploreView("categories"); navigate("/explore/category"); }}>
                  <div className="browse-icon">
                    <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </div>
                  <span className="browse-label">Category</span>
                </div>
                <div className={`browse-item ${exploreView === "genres" ? "active" : ""}`} onClick={() => { setExploreView("genres"); navigate("/explore/genre"); }}>
                  <div className="browse-icon">
                    <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="6" cy="12" r="2"></circle>
                      <circle cx="18" cy="12" r="2"></circle>
                      <path d="M8 12h8"></path>
                    </svg>
                  </div>
                  <span className="browse-label">Genre</span>
                </div>
                <div className={`browse-item ${exploreView === "countries" ? "active" : ""}`} onClick={() => { setExploreView("countries"); navigate("/explore/country"); }}>
                  <div className="browse-icon">
                    <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </div>
                  <span className="browse-label">Country</span>
                </div>
                <div className={`browse-item ${exploreView === "languages" ? "active" : ""}`} onClick={() => { setExploreView("languages"); navigate("/explore/language"); }}>
                  <div className="browse-icon">
                    <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 8l6 6"></path>
                      <path d="M4 14l6-6 2-3"></path>
                      <path d="M2 5h12"></path>
                      <path d="M7 2h1"></path>
                      <path d="M22 22l-5-10-5 10"></path>
                      <path d="M14 18h6"></path>
                    </svg>
                  </div>
                  <span className="browse-label">Language</span>
                </div>
                <div className={`browse-item ${exploreView === "family_friendly" ? "active" : ""}`} onClick={() => { setExploreView("family_friendly"); navigate("/explore/family-friendly"); }}>
                  <div className="browse-icon">
                    <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <span className="browse-label">Family Friendly</span>
                </div>
                <div className={`browse-item ${exploreView === "award_winners" ? "active" : ""}`} onClick={() => { setExploreView("award_winners"); navigate("/explore/award-winners"); }}>
                  <div className="browse-icon">
                    <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="8" r="7"></circle>
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    </svg>
                  </div>
                  <span className="browse-label">Award Winners</span>
                </div>
                <div className={`browse-item ${exploreView === "editors_pick" ? "active" : ""}`} onClick={() => { setExploreView("editors_pick"); navigate("/explore/editors-pick"); }}>
                  <div className="browse-icon">
                    <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                  <span className="browse-label">Editor's Pick</span>
                </div>
                <div className={`browse-item ${exploreView === "anime" ? "active" : ""}`} onClick={() => { setExploreView("anime"); navigate("/explore/anime"); }}>
                  <div className="browse-icon">
                    <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </div>
                  <span className="browse-label">Anime</span>
                </div>
                <div className={`browse-item ${exploreView === "franchise" ? "active" : ""}`} onClick={() => { setExploreView("franchise"); navigate("/explore/franchise"); }}>
                  <div className="browse-icon">
                    <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                      <line x1="7" y1="2" x2="7" y2="22"></line>
                      <line x1="17" y1="2" x2="17" y2="22"></line>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <line x1="2" y1="7" x2="7" y2="7"></line>
                      <line x1="2" y1="17" x2="7" y2="17"></line>
                      <line x1="17" y1="7" x2="22" y2="7"></line>
                    </svg>
                  </div>
                  <span className="browse-label">Franchise</span>
                </div>
              </div>
            </div>

            {exploreView === "categories" && (
              <>
                <div className="divider" style={{ margin: "20px 0" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "0 0 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, color: "var(--tx)", lineHeight: 1 }}>Categories</div>
                  </div>
                  <input
                    className="search-inp"
                    style={{ maxWidth: 320, borderRadius: 9999, background: "var(--c1)" }}
                    placeholder="Search category"
                    value={exploreCategorySearch}
                    onChange={e => setExploreCategorySearch(e.target.value)}
                  />
                </div>

                {browseItem?.sectionType === "categories" ? (
                  <BrowseItemResults
                    sectionType="categories"
                    item={browseItem.item}
                    onSelect={openFromCard}
                    onBack={() => setBrowseItem(null)}
                  />
                ) : (
                  <div style={{ padding: "0 0 80px" }}>
                    {categoryLetters.map((letter, idx) => (
                      <div key={letter}>
                        {idx > 0 && <div className="divider" style={{ margin: "14px 0" }} />}
                        <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "18px", alignItems: "flex-start", padding: "6px 0" }}>
                          <div className="category-letter">{letter}</div>
                          <div className="category-grid">
                            {filteredExploreCategoryGroups[letter].map(cat => (
                              <button
                                key={`${letter}-${cat}`}
                                className="category-item"
                                onClick={() => setBrowseItem({ sectionType: "categories", item: { name: cat } })}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {exploreView === "genres" && (
              <>
                <div className="divider" style={{ margin: "20px 0" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "0 0 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="page-h1" style={{ margin: 0 }}>Genres</div>
                  </div>
                  <input
                    className="search-inp"
                    style={{ maxWidth: 320, borderRadius: 9999, background: "var(--c1)" }}
                    placeholder="Search genre"
                    value={exploreGenreSearch}
                    onChange={e => setExploreGenreSearch(e.target.value)}
                  />
                </div>

                {browseItem?.sectionType === "genres" ? (
                  <BrowseItemResults
                    sectionType="genres"
                    item={browseItem.item}
                    onSelect={openFromCard}
                    onBack={() => setBrowseItem(null)}
                  />
                ) : (
                  <div className="genre-card-grid" style={{ padding: "0 0 80px" }}>
                    {filteredExploreGenres.map((genre) => (
                      <button
                        key={genre.name}
                        className="genre-card"
                        style={{ background: genre.gradient }}
                        onClick={() => setBrowseItem({ sectionType: "genres", item: genre })}
                      >
                        <span className="genre-card-emoji">{genre.icon}</span>
                        <span className="genre-card-overlay" />
                        <span className="genre-card-title">{genre.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {exploreView === "countries" && (
              <>
                <div className="divider" style={{ margin: "20px 0" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "0 0 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="page-h1" style={{ margin: 0 }}>Countries</div>
                  </div>
                  <input
                    className="search-inp"
                    style={{ maxWidth: 320, borderRadius: 9999, background: "var(--c1)" }}
                    placeholder="Search country"
                    value={exploreCountrySearch}
                    onChange={e => setExploreCountrySearch(e.target.value)}
                  />
                </div>

                {browseItem?.sectionType === "countries" ? (
                  <BrowseItemResults
                    sectionType="countries"
                    item={browseItem.item}
                    onSelect={openFromCard}
                    onBack={() => setBrowseItem(null)}
                  />
                ) : (
                  <div className="genre-card-grid" style={{ padding: "0 0 80px" }}>
                    {filteredExploreCountries.map((country) => (
                      <button
                        key={country.name}
                        className="genre-card"
                        style={{ background: country.gradient }}
                        onClick={() => setBrowseItem({ sectionType: "countries", item: country })}
                      >
                        <span className="genre-card-emoji">{country.icon}</span>
                        <span className="genre-card-overlay" />
                        <span className="genre-card-title">{country.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {exploreView === "languages" && (
              <>
                <div className="divider" style={{ margin: "20px 0" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "0 0 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="page-h1" style={{ margin: 0 }}>Languages</div>
                  </div>
                  <input
                    className="search-inp"
                    style={{ maxWidth: 320, borderRadius: 9999, background: "var(--c1)" }}
                    placeholder="Search language"
                    value={exploreLanguageSearch}
                    onChange={e => setExploreLanguageSearch(e.target.value)}
                  />
                </div>
                {renderSubFilterToolbar()}

                {browseItem?.sectionType === "languages" ? (
                  <BrowseItemResults
                    sectionType="languages"
                    item={browseItem.item}
                    onSelect={openFromCard}
                    onBack={() => setBrowseItem(null)}
                  />
                ) : (
                  <div className="genre-card-grid" style={{ padding: "0 0 80px" }}>
                    {filteredExploreLanguages.map((lang) => (
                      <button
                        key={lang.name}
                        className="genre-card"
                        style={{ background: lang.gradient }}
                        onClick={() => setBrowseItem({ sectionType: "languages", item: lang })}
                      >
                        <span className="genre-card-emoji">{lang.icon}</span>
                        <span className="genre-card-overlay" />
                        <span className="genre-card-title">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {exploreView === "family_friendly" && (
              <>
                <div className="divider" style={{ margin: "20px 0" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "0 0 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="page-h1" style={{ margin: 0 }}>Family Friendly</div>
                    <span className="sub-ac-badge" style={{ marginLeft: 16 }}>CURATED</span>
                  </div>
                  <input
                    className="search-inp"
                    style={{ maxWidth: 320, borderRadius: 9999, background: "var(--c1)" }}
                    placeholder="Search family friendly"
                    value={exploreFamilyFriendlySearch}
                    onChange={e => setExploreFamilyFriendlySearch(e.target.value)}
                  />
                </div>
                {renderSubFilterToolbar()}

                {browseItem?.sectionType === "family_friendly" ? (
                  <BrowseItemResults
                    sectionType="family_friendly"
                    item={browseItem.item}
                    onSelect={openFromCard}
                    onBack={() => setBrowseItem(null)}
                  />
                ) : (
                  <div className="genre-card-grid" style={{ padding: "0 0 80px" }}>
                    {filteredExploreFamilyFriendly.map((g) => (
                      <button
                        key={g.name}
                        className="genre-card"
                        style={{ background: g.gradient }}
                        onClick={() => setBrowseItem({ sectionType: "family_friendly", item: g })}
                      >
                        <span className="genre-card-emoji">{g.icon}</span>
                        <span className="genre-card-overlay" />
                        <span className="genre-card-title">{g.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {exploreView === "award_winners" && (
              <>
                <div className="divider" style={{ margin: "20px 0" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "0 0 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="page-h1" style={{ margin: 0 }}>Award Winners</div>
                    <span className="sub-ac-badge" style={{ marginLeft: 16 }}>ACCLAIMED</span>
                  </div>
                  <input
                    className="search-inp"
                    style={{ maxWidth: 320, borderRadius: 9999, background: "var(--c1)" }}
                    placeholder="Search award winners"
                    value={exploreAwardWinnersSearch}
                    onChange={e => setExploreAwardWinnersSearch(e.target.value)}
                  />
                </div>
                {renderSubFilterToolbar()}

                {browseItem?.sectionType === "award_winners" ? (
                  <BrowseItemResults
                    sectionType="award_winners"
                    item={browseItem.item}
                    onSelect={openFromCard}
                    onBack={() => setBrowseItem(null)}
                  />
                ) : (
                  <div className="genre-card-grid" style={{ padding: "0 0 80px" }}>
                    {filteredExploreAwardWinners.map((g) => (
                      <button
                        key={g.name}
                        className="genre-card"
                        style={{ background: g.gradient }}
                        onClick={() => setBrowseItem({ sectionType: "award_winners", item: g })}
                      >
                        <span className="genre-card-emoji">{g.icon}</span>
                        <span className="genre-card-overlay" />
                        <span className="genre-card-title">{g.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {exploreView === "editors_pick" && (
              <>
                <div className="divider" style={{ margin: "20px 0" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "0 0 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="page-h1" style={{ margin: 0 }}>Editor's Pick</div>
                    <span className="sub-ac-badge" style={{ marginLeft: 16 }}>TOP OF THE LINE</span>
                  </div>
                  <input
                    className="search-inp"
                    style={{ maxWidth: 320, borderRadius: 9999, background: "var(--c1)" }}
                    placeholder="Search editor's pick"
                    value={exploreEditorsPickSearch}
                    onChange={e => setExploreEditorsPickSearch(e.target.value)}
                  />
                </div>
                {renderSubFilterToolbar()}

                {browseItem?.sectionType === "editors_pick" ? (
                  <BrowseItemResults
                    sectionType="editors_pick"
                    item={browseItem.item}
                    onSelect={openFromCard}
                    onBack={() => setBrowseItem(null)}
                  />
                ) : (
                  <div className="genre-card-grid" style={{ padding: "0 0 80px" }}>
                    {filteredExploreEditorsPick.map((g) => (
                      <button
                        key={g.name}
                        className="genre-card"
                        style={{ background: g.gradient }}
                        onClick={() => setBrowseItem({ sectionType: "editors_pick", item: g })}
                      >
                        <span className="genre-card-emoji">{g.icon}</span>
                        <span className="genre-card-overlay" />
                        <span className="genre-card-title">{g.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {exploreView === "anime" && (
              <>
                <div className="divider" style={{ margin: "20px 0" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "0 0 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="page-h1" style={{ margin: 0 }}>Anime</div>
                    <span className="sub-ac-badge" style={{ marginLeft: 16 }}>POPULAR</span>
                  </div>
                  <input
                    className="search-inp"
                    style={{ maxWidth: 320, borderRadius: 9999, background: "var(--c1)" }}
                    placeholder="Search anime"
                    value={exploreAnimeSearch}
                    onChange={e => setExploreAnimeSearch(e.target.value)}
                  />
                </div>
                {renderSubFilterToolbar()}

                {browseItem?.sectionType === "anime" ? (
                  <BrowseItemResults
                    sectionType="anime"
                    item={browseItem.item}
                    onSelect={openFromCard}
                    onBack={() => setBrowseItem(null)}
                  />
                ) : (
                  <div className="genre-card-grid" style={{ padding: "0 0 80px" }}>
                    {filteredExploreAnime.map((g) => (
                      <button
                        key={g.name}
                        className="genre-card"
                        style={{ background: g.gradient }}
                        onClick={() => setBrowseItem({ sectionType: "anime", item: g })}
                      >
                        <span className="genre-card-emoji">{g.icon}</span>
                        <span className="genre-card-overlay" />
                        <span className="genre-card-title">{g.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {exploreView === "franchise" && (
              <>
                <div className="divider" style={{ margin: "20px 0" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "0 0 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="page-h1" style={{ margin: 0 }}>Franchise</div>
                    <span className="sub-ac-badge" style={{ marginLeft: 16 }}>MEGA HITS</span>
                  </div>
                  <input
                    className="search-inp"
                    style={{ maxWidth: 320, borderRadius: 9999, background: "var(--c1)" }}
                    placeholder="Search franchise"
                    value={exploreFranchiseSearch}
                    onChange={e => setExploreFranchiseSearch(e.target.value)}
                  />
                </div>
                {renderSubFilterToolbar()}

                {browseItem?.sectionType === "franchise" ? (
                  <BrowseItemResults
                    sectionType="franchise"
                    item={browseItem.item}
                    onSelect={openFromCard}
                    onBack={() => setBrowseItem(null)}
                  />
                ) : (
                  <div className="genre-card-grid" style={{ padding: "0 0 80px" }}>
                    {filteredExploreFranchise.map((g) => (
                      <button
                        key={g.name}
                        className="genre-card"
                        style={{ background: g.gradient }}
                        onClick={() => setBrowseItem({ sectionType: "franchise", item: g })}
                      >
                        <span className="genre-card-emoji">{g.icon}</span>
                        <span className="genre-card-overlay" />
                        <span className="genre-card-title">{g.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {mode !== "explore" && !session && (
          <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
            <div style={{ textAlign: "center", maxWidth: 430 }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 50, color: "var(--acc)", letterSpacing: 3, textShadow: "0 0 36px var(--acc-glow)", marginBottom: 8 }}>
                Reel<span style={{ color: "var(--tx)" }}>log</span>
              </div>
              <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, marginBottom: 12, lineHeight: 1.2 }}>
                Your list is <em style={{ color: "var(--acc)", fontStyle: "italic" }}>private</em>
              </div>
              <p style={{ fontSize: 14, color: "var(--txm)", lineHeight: 1.85, marginBottom: 30 }}>
                Sign in to access your personal catalog. Your list is visible only to you - nobody else can see what you've added.
              </p>
              <button className="btn-acc btn-sm"
                style={{ padding: "14px 38px", fontSize: 14, fontWeight: 700, borderRadius: 9 }}
                onClick={() => setShowAuth(true)}>
                Sign in to view your list -&gt;
              </button>
              <div style={{ marginTop: 16, fontSize: 12, color: "var(--txd)" }}>
                No account?&nbsp;
                <span style={{ color: "var(--acc)", cursor: "pointer" }} onClick={() => setShowAuth(true)}>Join free</span>
              </div>
            </div>
          </div>
        )}

        {mode !== "explore" && session && <>
          <div className="page-header">
            <div className="page-eyebrow">{mode === "mylist" ? "Your collection" : "Your catalog"}</div>
            <div className="page-h1">
              {mode === "mylist" ? <>My <em>List</em></> : <>My <em>Catalog</em></>}
            </div>
            <div className="page-count">{source.length} titles</div>
          </div>

          <div className="stats-strip">
            {Object.entries(counts).map(([s, c]) => (
              <div key={s} className={`stat-chip${filterStatus === s ? " on" : ""}`}
                onClick={() => setFilterStatus(filterStatus === s ? "All" : s)}>
                <div className="stat-n" style={{ color: SCOLOR[s] }}>{c}</div>
                <div className="stat-l">{s}</div>
              </div>
            ))}
          </div>

          <div className="toolbar">
            <div className="search-wrap" ref={searchRef}>
              <span className="search-ico">?</span>
              <input className="search-inp"
                placeholder="Search movies, anime, shows from TMDB..."
                value={search} onChange={e => setSearch(e.target.value)}
                onFocus={() => results.length && setShowDrop(true)}
              />
              {searching && <span className="spin-ico">?</span>}
              {showDrop && (
                <div className="drop">
                  {results.map(r => (
                    <div key={r.id} className="drop-row" onClick={() => selectResult(r)}>
                      {r.poster_path
                        ? <img className="drop-img" src={`${TMDB_IMG}${r.poster_path}`} alt="" />
                        : <div className="drop-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>?</div>}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="drop-ti">{r.title || r.name}</div>
                        <div className="drop-me">{(r.release_date || r.first_air_date || "").split("-")[0]}</div>
                      </div>
                      <div className="drop-tag">{getType(r)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Filter Bar Netflix Style */}
            <div className="custom-filter-bar" ref={filterRowRef}>
              <div className="fil-group fil-left">
                {["All", "Movie", "TV Show"].map(f => (
                  <button key={f} className={`fil-pill${filterType === f ? " on" : ""}`} onClick={() => setFilterType(f)}>
                    {f === "TV Show" ? "Series" : f === "Movie" ? "Movies" : f}
                  </button>
                ))}
              </div>

              <div className="fil-group fil-middle">
                <button className={`fil-pill toggle-pill${showAnime ? " on" : ""}`} onClick={() => setShowAnime(s => !s)}>
                  Show Anime {showAnime && <span className="chk">✓</span>}
                </button>
                <button className={`fil-pill toggle-pill${familyFriendly ? " on" : ""}`} onClick={() => setFamilyFriendly(s => !s)}>
                  Family Friendly {familyFriendly && <span className="chk">✓</span>}
                </button>
              </div>

              <div className="fil-group fil-right">
                <div className="custom-dropdown">
                  <button className="fil-pill drop-trigger" onClick={() => { setSortDropdownOpen(s => !s); setOttDropdownOpen(false); }}>
                    Sort: {sortBy === "added" ? "Recently Added" : sortBy === "title" ? "Title A-Z" : sortBy === "rating" ? "Top Rated" : "Newest"}
                    <span className="caret">▼</span>
                  </button>
                  {sortDropdownOpen && (
                    <div className="drop-menu right-align">
                      {[
                        { val: "added", lbl: "Recently Added" },
                        { val: "title", lbl: "Title A-Z" },
                        { val: "rating", lbl: "Top Rated" },
                        { val: "year", lbl: "Newest" }
                      ].map(o => (
                        <div key={o.val} className={`drop-item${sortBy === o.val ? " active" : ""}`} onClick={() => { setSortBy(o.val); setSortDropdownOpen(false); }}>
                          {o.lbl} {sortBy === o.val && <span className="chk">✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="custom-dropdown">
                  <button className="fil-pill drop-trigger" onClick={() => { setOttDropdownOpen(s => !s); setSortDropdownOpen(false); }}>
                    {ottFilter === "all" ? "All Channels" : (OTT[ottFilter]?.name || "Channel")}
                    {ottFilter !== "all" && OTT[ottFilter] && <OttIcon ott={OTT[ottFilter]} />}
                    <span className="caret">▼</span>
                  </button>
                  {ottDropdownOpen && (
                    <div className="drop-menu right-align" style={{ maxHeight: 300, overflowY: "auto" }}>
                      <div className={`drop-item${ottFilter === "all" ? " active" : ""}`} onClick={() => { setOttFilter("all"); setOttDropdownOpen(false); }}>
                        All Channels {ottFilter === "all" && <span className="chk">✓</span>}
                      </div>
                      {Object.keys(OTT).map(k => (
                        <div key={k} className={`drop-item${ottFilter === k ? " active" : ""}`} onClick={() => { setOttFilter(k); setOttDropdownOpen(false); }}>
                          <OttIcon ott={OTT[k]} />
                          {OTT[k].name} {ottFilter === k && <span className="chk">✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>


          </div>

          <div className="grid-wrap">
            {loading ? (
              <div className="loader"><div className="ldot" /><div className="ldot" /><div className="ldot" /></div>
            ) : (
              <div className={`grid${settings.cardSize === "small" ? " small" : settings.cardSize === "large" ? " large" : ""}`}>
                {filtered.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">?</div>
                    <div className="empty-title">{mode === "mylist" ? "Your list is empty" : "Nothing here yet"}</div>
                    <div className="empty-sub">{mode === "mylist" ? "Search for a title and add it!" : "Be the first to add something"}</div>
                    {mode === "mylist" && <button className="btn-sm btn-acc" style={{ marginTop: 8 }} onClick={openManual}>+ Add title</button>}
                  </div>
                )}
                {filtered.map((entry, i) => (
                  <div key={entry.id} className="card" style={{ animationDelay: `${Math.min(i * .04, .4)}s` }}>
                    <div className="card-img-box">
                      {entry.poster
                        ? <img className="card-img" src={`${TMDB_IMG}${entry.poster}`} alt={entry.title} loading="lazy"
                          onError={e => { e.currentTarget.style.display = "none"; }} />
                        : <div className="no-img-box">
                          <div className="no-img-icon">{entry.type === "Anime" ? "?" : entry.type === "Movie" ? "?" : "?"}</div>
                          <span>{entry.type}</span>
                        </div>}
                      <div
                        className="type-badge"
                        onClick={e => { e.stopPropagation(); handleTypeNav(entry.type); }}
                      >
                        {entry.type}
                      </div>
                      <div className="card-grad" />
                      <div className="card-status-tag" style={{ color: SCOLOR[entry.status], borderColor: SCOLOR[entry.status] + "44" }}>
                        {getStatusIcon(entry.status)} {entry.status}
                      </div>
                      {session && entry.user_id === session.user.id && (
                        <div className="card-btns">
                          <button className="card-btn" onClick={e => { e.stopPropagation(); openEdit(entry); }}>?</button>
                          <button className="card-btn" onClick={e => { e.stopPropagation(); handleDelete(entry.id); }}>?</button>
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
                          {[1, 2, 3, 4, 5].map(s => <span key={s} className={`s${entry.rating >= s ? " on" : ""}`}>?</span>)}
                        </div>
                      )}
                      {settings.showStreaming && entry.streaming?.length > 0 && (
                        <div className="card-ott-strip">
                          {entry.streaming.slice(0, 3).map(k => OTT[k] && (
                            <span key={k} className="card-ott-label"
                              style={{ background: OTT[k].color }}>
                              {OTT[k].short}
                            </span>
                          ))}
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
    );
  };
  //RENDER 
  return (
    <div className={accentClass}>

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
      <nav className={`nav${navScrolled ? " nav-scrolled" : ""}`} ref={navDropdownRef}>
        <div className="nav-logo" onClick={() => { setPage("home"); navigate("/"); setNavDropdown(null); }}>
          <div className="nav-dot" />
          Reel<span>log</span>
        </div>
        <div className="nav-links">
          <button className={`nav-link${page === "home" ? " active" : ""}`} onClick={() => { setPage("home"); navigate("/"); setNavDropdown(null); }}>
            Home
          </button>
          <div className="nav-dropdown-wrapper">
            <button className={`nav-link${page === "explore" ? " active" : ""}`} onClick={() => { setPage("explore"); navigate("/"); setNavDropdown(navDropdown === "explore" ? null : "explore"); }}>
              Explore
            </button>

          </div>
          <button className={`nav-link${page === "mylist" ? " active" : ""}`} onClick={() => { setPage("mylist"); navigate("/"); setNavDropdown(null); }}>
            My List
          </button>
        </div>
        <div className="nav-right">
          <button className="btn-icon" onClick={() => {
            if (session) { setPage("mylist"); navigate("/"); setNavDropdown(null); }
            else setShowAuth(true);
          }} title={session ? "Profile" : "Sign in / Join"}>
            <Icon name="user" size={17} />
          </button>
          <button className="btn-icon" onClick={() => { setShowSettings(s => !s); setNavDropdown(null); }} title="Settings">
            <Icon name="settings" size={17} />
          </button>
        </div>
      </nav>

      <Routes>
        {/* ── Browse By drill-down routes ─────────────────────────── */}
        <Route path="/explore/:section" element={<BrowseSectionPage />} />
        <Route path="/explore/:section/:item" element={<BrowseItemPage />} />

        {/* ── Legacy direct routes ─────────────────────────────────── */}
        <Route
          path="/genre/:slug"
          element={
            <GenrePage
              onSelect={openFromCard}
              PosterImageComponent={PosterImage}
              onTypeNav={handleTypeNav}
            />
          }
        />
        <Route
          path="/country/:slug"
          element={
            <CountryPage
              onSelect={openFromCard}
              PosterImageComponent={PosterImage}
              onTypeNav={handleTypeNav}
            />
          }
        />
        <Route
          path="/language/:code"
          element={
            <LanguagePage
              onSelect={openFromCard}
              PosterImageComponent={PosterImage}
              onTypeNav={handleTypeNav}
            />
          }
        />
        <Route
          path="/category/:type"
          element={
            <CategoryPage
              allItems={allContent}
              onSelect={openFromCard}
              PosterImageComponent={PosterImage}
              onTypeNav={handleTypeNav}
            />
          }
        />
        <Route
          path="/*"
          element={
            <>
              {/*  HOME PAGE  */}
              {page === "home" && (
                <>
                  <HeroCarousel
                    items={heroItems}
                    autoplay={settings.autoplay}
                    onAdd={openFromCard}
                    session={session}
                    setShowAuth={setShowAuth}
                  />
                  <div className="main-content">
                    <TmdbSection
                      title="Trending"
                      tabs={[{ key: "day", label: "Today" }, { key: "week", label: "This Week" }]}
                      activeTab={trendMode}
                      onTabChange={handleTrendTab}
                      items={homeTrending}
                      onSelect={openFromCard}
                      onTypeNav={handleTypeNav}
                      onSeeAll={() => setSeeAll({ title: "Trending", emoji: "fire", items: homeTrending })}
                    />
                    <div className="divider" />
                    <TmdbSection
                      title="What's Popular"
                      tabs={[
                        { key: "streaming", label: "Streaming" },
                        { key: "tv", label: "On TV" },
                        { key: "rent", label: "For Rent" },
                        { key: "theaters", label: "In Theaters" },
                      ]}
                      activeTab={popularMode}
                      onTabChange={handlePopularTab}
                      items={homePopular}
                      onSelect={openFromCard}
                      onTypeNav={handleTypeNav}
                      onSeeAll={() => setSeeAll({ title: "What's Popular", emoji: "eye", items: homePopular })}
                    />
                    <div className="divider" />
                    <TmdbSection
                      title="Free To Watch"
                      tabs={[{ key: "movies", label: "Movies" }, { key: "tv", label: "TV" }]}
                      activeTab={freeMode}
                      onTabChange={handleFreeTab}
                      items={homeFree}
                      onSelect={openFromCard}
                      onTypeNav={handleTypeNav}
                      onSeeAll={() => setSeeAll({ title: "Free To Watch", emoji: "gift", items: homeFree })}
                    />
                    <div className="divider" />
                    <TmdbSection
                      title="Binge-worthy Series"
                      tabs={[]}
                      items={homeSeries}
                      onSelect={openFromCard}
                      onTypeNav={handleTypeNav}
                      onSeeAll={() => setSeeAll({ title: "Binge-worthy Series", emoji: "play", items: homeSeries })}
                    />
                    <div style={{ height: 64 }} />
                  </div>
                </>
              )}

              {/*  EXPLORE / MY LIST */}
              {page === "explore" && renderLibrary("explore")}

              {page === "mylist" && renderLibrary("mylist")}
            </>
          }
        />
      </Routes>

      {/* ADD / EDIT MODAL */}
      {showModal && modalData && (
        <div className="backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-head">
              {modalData.poster
                ? <img className="modal-poster" src={`${TMDB_IMG}${modalData.poster}`} alt=""
                  onError={e => e.currentTarget.style.display = "none"} />
                : modalData.tmdbId
                  ? <PosterImage item={{ poster: null, tmdbId: modalData.tmdbId, tmdbType: modalData.tmdbType || "movie", type: modalData.type || "Movie" }}
                    style={{ width: 72, height: 104, borderRadius: 9, flexShrink: 0 }} />
                  : <div className="modal-poster" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "var(--txd)" }}></div>}
              <div style={{ flex: 1 }}>
                {modalData.manual
                  ? <input className="finp" placeholder="Enter title..." value={modalData.manualTitle || ""} onChange={e => setModalData(d => ({ ...d, manualTitle: e.target.value }))} style={{ marginBottom: 6 }} />
                  : <div className="modal-ti">{modalData.title}</div>}
                <div className="modal-sub">{modalData.type}{modalData.year ? ` · ${modalData.year}` : ""}</div>
                {modalData.overview && <div className="modal-ov">"{modalData.overview.slice(0, 110)}"</div>}
              </div>
            </div>
            <div className="modal-body">
              {modalData.manual && (
                <div className="frow" style={{ marginBottom: 14 }}>
                  <div className="field">
                    <label className="flbl">Type</label>
                    <select className="fsel" value={modalData.type} onChange={e => setModalData(d => ({ ...d, type: e.target.value }))}>
                      {["Movie", "Anime", "TV Show"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="flbl">Year</label>
                    <input className="finp" placeholder="2024" value={modalData.year || ""} onChange={e => setModalData(d => ({ ...d, year: e.target.value }))} />
                  </div>
                </div>
              )}
              <div className="field">
                <label className="flbl">Status</label>
                <div className="pills">
                  {STATUSES.map(s => (
                    <button key={s} className={`pill${form.status === s ? " on" : ""}`}
                      style={form.status === s ? { background: SCOLOR[s] + "22", borderColor: SCOLOR[s], color: SCOLOR[s] } : {}}
                      onClick={() => setForm(f => ({ ...f, status: s }))}>
                      {getStatusIcon(s)} {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* OTT Available On  */}
              {modalData.streaming?.length > 0 && (
                <div className="ott-section">
                  <span className="ott-section-label"> Available On</span>
                  <div className="ott-logos">
                    {modalData.streaming.map(k => OTT[k] && (
                      <a key={k} className="ott-logo-link"
                        href={OTT[k].url + encodeURIComponent(modalData.title || "")}
                        target="_blank" rel="noopener noreferrer"
                        title={`Watch on ${OTT[k].name}`}>
                        <img
                          src={OTT[k].logo}
                          alt={OTT[k].name}
                          onError={e => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextSibling.style.display = "inline";
                          }}
                        />
                        <span style={{ display: "none", fontSize: 10, fontWeight: 700, color: "var(--tx)", letterSpacing: .5 }}>{OTT[k].short}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div className="field">
                <label className="flbl">Rating</label>
                <div className="str-row">
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s} className={`str${form.rating >= s ? " on" : ""}`}
                      onClick={() => setForm(f => ({ ...f, rating: f.rating === s ? null : s }))}>★</span>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="flbl">Notes</label>
                <textarea className="fta" placeholder="Your thoughts…" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn-add" onClick={handleSave} disabled={saving}>
                {saving ? "Saving" : editId !== null ? "Save Changes" : "+ Add to List"}
              </button>
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
          onTypeNav={handleTypeNav}
        />
      )}

      {/* ── SETTINGS PANEL ── */}
      {showSettings && (
        <>
          <div className="backdrop" style={{ zIndex: 499 }} onClick={() => setShowSettings(false)} />
          <SettingsPanel
            settings={settings}
            onChange={changeSetting}
            onClose={() => setShowSettings(false)}
            onExport={handleExport}
            onClearCache={handleClearCache}
            session={session}
            onSignOut={() => { supabase.auth.signOut(); setShowSettings(false); }}
          />
        </>
      )}

      {/* ── AUTH MODAL ── */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* ── TOAST ── */}
      {toast && <div className="toast"><div className="toast-dot" />{toast}</div>}
    </div>
  );
}

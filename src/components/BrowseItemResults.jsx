import { useState, useEffect, useRef } from "react";
import PosterImage from "./PosterImage";
import { TMDB_BASE, TMDB_KEY, TMDB_IMG } from "../lib/constants";

// ─── TMDB endpoint builder per section type ────────────────────────────────
function buildUrls(sectionType, item) {
  const base = TMDB_BASE;
  const key = TMDB_KEY;

  switch (sectionType) {
    case "categories": {
      // Map category name → TMDB genre IDs (best-effort)
      const CATEGORY_GENRE_MAP = {
        action: 28, adventure: 12, animation: 16, comedy: 35, crime: 80,
        documentary: 99, drama: 18, fantasy: 14, history: 36, horror: 27,
        music: 10402, mystery: 9648, romance: 10749, "science-fiction": 878,
        thriller: 53, war: 10752, western: 37,
        // Common aliases
        "sci-fi": 878, "sci fi": 878, animated: 16,
      };
      const slug = (item.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const genreId = CATEGORY_GENRE_MAP[slug];
      if (genreId) {
        return [
          `${base}/discover/movie?api_key=${key}&with_genres=${genreId}&sort_by=popularity.desc&page=1`,
          `${base}/discover/tv?api_key=${key}&with_genres=${genreId}&sort_by=popularity.desc&page=1`,
        ];
      }
      // Fallback: keyword search
      return [`${base}/search/multi?api_key=${key}&query=${encodeURIComponent(item.name)}&page=1`];
    }

    case "genres": {
      const id = item.tmdbGenreId;
      if (id) {
        return [
          `${base}/discover/movie?api_key=${key}&with_genres=${id}&sort_by=popularity.desc&page=1`,
          `${base}/discover/tv?api_key=${key}&with_genres=${id}&sort_by=popularity.desc&page=1`,
        ];
      }
      return [`${base}/search/multi?api_key=${key}&query=${encodeURIComponent(item.name)}&page=1`];
    }

    case "countries": {
      const iso = item.iso || item.code;
      return [`${base}/discover/movie?api_key=${key}&with_origin_country=${iso}&sort_by=popularity.desc&page=1`];
    }

    case "languages": {
      const iso = item.iso || item.code;
      return [`${base}/discover/movie?api_key=${key}&with_original_language=${iso}&sort_by=popularity.desc&page=1`];
    }

    case "family_friendly":
      return [`${base}/discover/movie?api_key=${key}&certification.lte=PG&with_genres=10751&sort_by=popularity.desc&page=1`];

    case "award_winners":
      return [`${base}/discover/movie?api_key=${key}&vote_average.gte=8&sort_by=vote_count.desc&page=1`];

    case "editors_pick":
      return [`${base}/discover/movie?api_key=${key}&sort_by=vote_average.desc&vote_count.gte=1000&page=1`];

    case "anime":
      return [`${base}/discover/tv?api_key=${key}&with_genres=16&with_keywords=210024&sort_by=popularity.desc&page=1`];

    case "franchise":
      return [`${base}/discover/movie?api_key=${key}&sort_by=popularity.desc&with_release_type=3&page=1`];

    default:
      return [];
  }
}

function mapResult(r, fallbackType) {
  const mediaType = r.media_type || fallbackType || "movie";
  return {
    id: r.id,
    tmdbId: r.id,
    tmdbType: mediaType,
    title: r.title || r.name || "",
    year: (r.release_date || r.first_air_date || "").slice(0, 4),
    rating: r.vote_average,
    type: mediaType === "movie" ? "Movie" : mediaType === "tv" ? "TV Show" : "Movie",
    poster: r.poster_path,
    poster_path: r.poster_path,
    backdrop_path: r.backdrop_path,
    overview: r.overview,
    streaming: [],
  };
}

// ─── Skeleton loader for the poster grid ──────────────────────────────────
function PosterSkeleton() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
      gap: 16,
      padding: "0 0 80px",
    }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          borderRadius: 10,
          overflow: "hidden",
          background: "var(--c2)",
          aspectRatio: "2/3",
          animation: "shimmer 1.4s ease-in-out infinite alternate",
          animationDelay: `${i * 0.05}s`,
        }} />
      ))}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function BrowseItemResults({ sectionType, item, onSelect, onBack }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!item || !sectionType) return;
    setLoading(true);
    setError(null);
    setResults([]);

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    const urls = buildUrls(sectionType, item);
    if (!urls.length) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const responses = await Promise.all(
          urls.map(url =>
            fetch(url, { signal }).then(r => r.json()).catch(() => null)
          )
        );

        const seen = new Set();
        const combined = [];

        responses.forEach((res, idx) => {
          const rawList = res?.results || [];
          const fallbackType = urls[idx]?.includes("/discover/tv") ? "tv" : "movie";
          rawList.forEach(r => {
            if (!seen.has(r.id)) {
              seen.add(r.id);
              combined.push(mapResult(r, fallbackType));
            }
          });
        });

        if (!signal.aborted) {
          setResults(combined.slice(0, 20));
          setLoading(false);
        }
      } catch (e) {
        if (!signal.aborted) {
          setError("Failed to load content. Please try again.");
          setLoading(false);
        }
      }
    })();

    return () => abortRef.current?.abort();
  }, [sectionType, item]);

  const sectionLabel = {
    categories: "Category",
    genres: "Genre",
    countries: "Country",
    languages: "Language",
    family_friendly: "Family Friendly",
    award_winners: "Award Winners",
    editors_pick: "Editor's Pick",
    anime: "Anime",
    franchise: "Franchise",
  }[sectionType] || sectionType;

  return (
    <div style={{ marginTop: 0 }}>
      {/* ── Breadcrumb ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 0 16px",
        fontSize: 13,
        color: "var(--txd)",
        flexWrap: "wrap",
      }}>
        <span style={{ cursor: "pointer", color: "var(--acc)", fontWeight: 600 }}
          onClick={onBack}>
          ← Back
        </span>
        <span style={{ opacity: 0.4 }}>›</span>
        <span>Explore</span>
        <span style={{ opacity: 0.4 }}>›</span>
        <span>Browse By</span>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: "var(--txm)" }}>{sectionLabel}</span>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: "var(--tx)", fontWeight: 600 }}>
          {item.icon ? `${item.icon} ` : ""}{item.name}
        </span>
      </div>

      {/* ── Section title ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        {item.icon && (
          <span style={{ fontSize: 28 }}>{item.icon}</span>
        )}
        <div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 40,
            color: "var(--tx)",
            lineHeight: 1,
            letterSpacing: 1,
          }}>{item.name}</div>
          <div style={{ fontSize: 13, color: "var(--txd)", marginTop: 3 }}>
            {loading ? "Loading…" : `${results.length} titles found`}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {loading && <PosterSkeleton />}

      {!loading && error && (
        <div style={{
          padding: "60px 0",
          textAlign: "center",
          color: "var(--txd)",
        }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>⚠️</div>
          <div style={{ fontSize: 15, marginBottom: 16 }}>{error}</div>
          <button
            className="btn-outline"
            style={{ borderRadius: 9999, padding: "10px 20px" }}
            onClick={() => {
              setLoading(true);
              setError(null);
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div style={{
          padding: "60px 0",
          textAlign: "center",
          color: "var(--txd)",
        }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>🎬</div>
          <div style={{ fontSize: 15 }}>No titles found for this selection.</div>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div
          className="see-all-grid"
          style={{ padding: "0 0 80px" }}
        >
          {results.map((item, i) => (
            <div
              key={`${item.tmdbId}-${i}`}
              className="row-card"
              style={{ width: "100%", animationDelay: `${i * 0.03}s`, cursor: onSelect ? "pointer" : "default" }}
              onClick={() => onSelect && onSelect(item)}
            >
              <div className="row-card-img-box">
                <PosterImage item={item} className="row-card-img" />
                <div className="row-card-grad" />
                <div className="type-badge">{item.type}</div>
                <div className="row-card-hover">
                  <div className="row-card-hover-title">{item.title}</div>
                  <button
                    className="row-card-hover-btn"
                    onClick={e => { e.stopPropagation(); onSelect && onSelect(item); }}
                  >
                    + Add to List
                  </button>
                </div>
              </div>
              <div className="row-card-body">
                <div className="row-card-title">{item.title}</div>
                <div className="row-card-meta">
                  <div className="row-card-year">{item.year}</div>
                  {item.rating > 0 && (
                    <div className="row-card-rating">★ {parseFloat(item.rating).toFixed(1)}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          from { opacity: 0.35; }
          to   { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaChevronRight, FaExclamationTriangle } from "react-icons/fa";
import PosterImage from "./PosterImage";
import { TMDB_BASE, TMDB_KEY } from "../lib/constants";

function buildUrls(sectionType, item) {
  const base = TMDB_BASE;
  const key = TMDB_KEY;

  switch (sectionType) {
    case "categories": {
      const CATEGORY_GENRE_MAP = {
        action: 28,
        adventure: 12,
        animation: 16,
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
        thriller: 53,
        war: 10752,
        western: 37,
        "sci-fi": 878,
        "sci fi": 878,
        animated: 16,
      };
      const slug = (item.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const genreId = CATEGORY_GENRE_MAP[slug];
      if (genreId) {
        return [
          `${base}/discover/movie?api_key=${key}&with_genres=${genreId}&sort_by=popularity.desc&page=1`,
          `${base}/discover/tv?api_key=${key}&with_genres=${genreId}&sort_by=popularity.desc&page=1`,
        ];
      }
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

function mapResult(result, fallbackType) {
  const mediaType = result.media_type || fallbackType || "movie";
  return {
    id: result.id,
    tmdbId: result.id,
    tmdbType: mediaType,
    title: result.title || result.name || "",
    year: (result.release_date || result.first_air_date || "").slice(0, 4),
    rating: result.vote_average,
    type: mediaType === "movie" ? "Movie" : mediaType === "tv" ? "TV Show" : "Movie",
    poster: result.poster_path,
    poster_path: result.poster_path,
    backdrop_path: result.backdrop_path,
    overview: result.overview,
    streaming: [],
  };
}

function PosterSkeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
        gap: 16,
        padding: "0 0 80px",
      }}
    >
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          style={{
            borderRadius: 10,
            overflow: "hidden",
            background: "var(--c2)",
            aspectRatio: "2/3",
            animation: "shimmer 1.4s ease-in-out infinite alternate",
            animationDelay: `${index * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
}

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
          urls.map((url) => fetch(url, { signal }).then((response) => response.json()).catch(() => null))
        );

        const seen = new Set();
        const combined = [];

        responses.forEach((response, index) => {
          const rawList = response?.results || [];
          const fallbackType = urls[index]?.includes("/discover/tv") ? "tv" : "movie";
          rawList.forEach((entry) => {
            if (!seen.has(entry.id)) {
              seen.add(entry.id);
              combined.push(mapResult(entry, fallbackType));
            }
          });
        });

        if (!signal.aborted) {
          setResults(combined.slice(0, 20));
          setLoading(false);
        }
      } catch {
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

  const crumbStyle = { opacity: 0.4, display: "inline-flex", alignItems: "center" };

  return (
    <div style={{ marginTop: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 0 16px",
          fontSize: 13,
          color: "var(--txd)",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{ cursor: "pointer", color: "var(--acc)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}
          onClick={onBack}
        >
          <FaArrowLeft size={12} aria-hidden="true" />
          Back
        </span>
        <span style={crumbStyle}><FaChevronRight size={10} aria-hidden="true" /></span>
        <span>Explore</span>
        <span style={crumbStyle}><FaChevronRight size={10} aria-hidden="true" /></span>
        <span>Browse By</span>
        <span style={crumbStyle}><FaChevronRight size={10} aria-hidden="true" /></span>
        <span style={{ color: "var(--txm)" }}>{sectionLabel}</span>
        <span style={crumbStyle}><FaChevronRight size={10} aria-hidden="true" /></span>
        <span style={{ color: "var(--tx)", fontWeight: 600 }}>
          {item.icon ? `${item.icon} ` : ""}
          {item.name}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {item.icon && <span style={{ fontSize: 28 }}>{item.icon}</span>}
        <div>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 40,
              color: "var(--tx)",
              lineHeight: 1,
              letterSpacing: 1,
            }}
          >
            {item.name}
          </div>
          <div style={{ fontSize: 13, color: "var(--txd)", marginTop: 3 }}>
            {loading ? "Loading..." : `${results.length} titles found`}
          </div>
        </div>
      </div>

      {loading && <PosterSkeleton />}

      {!loading && error && (
        <div
          style={{
            padding: "60px 0",
            textAlign: "center",
            color: "var(--txd)",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 10 }}>
            <FaExclamationTriangle aria-hidden="true" />
          </div>
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

      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 16,
            paddingBottom: 80,
          }}
        >
          {results.map((result) => (
            <div
              key={`${result.tmdbType}-${result.tmdbId}`}
              className="row-card"
              style={{ width: "100%" }}
              onClick={() => onSelect?.(result)}
            >
              <div className="row-card-img-box">
                <PosterImage item={result} className="row-card-img" />
                <div className="row-card-grad" />
                <div className="type-badge">{result.type}</div>
                <div className="row-card-hover">
                  <div className="row-card-hover-title">{result.title}</div>
                  <button
                    className="row-card-hover-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelect?.(result);
                    }}
                  >
                    + Add to List
                  </button>
                </div>
              </div>
              <div className="row-card-body">
                <div className="row-card-title">{result.title}</div>
                <div className="row-card-meta">
                  <div className="row-card-year">{result.year}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

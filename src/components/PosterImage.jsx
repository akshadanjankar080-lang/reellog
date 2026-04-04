import { useState, useEffect, useRef, useCallback } from "react";
import { TMDB_IMG, TMDB_BASE, TMDB_KEY } from "../lib/constants";

export default function PosterImage({ item, className, style, alt }) {
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
      <div className={className || "no-img-box"} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--txd)", gap: 5, fontSize: 10, background: "var(--c3)", ...style }}>
        <div style={{ fontSize: 28, opacity: .22 }}>
          {item.type === "Anime" ? "⛩" : item.type === "Movie" ? "🎬" : "📺"}
        </div>
        <span style={{ fontSize: 9, letterSpacing: 1 }}>{item.type}</span>
      </div>
    );
  }

  return <img className={className} style={style} src={src} alt={alt || item.title} loading="lazy" onError={handleError} />;
}

import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TMDB_BASE, TMDB_KEY, EXPLORE_GENRE_CARDS, toGenreSlug } from "../lib/constants";
import PosterImage from "../components/PosterImage";

export default function GenrePage({ onSelect, onTypeNav }) {
  const navigate = useNavigate();
  const { slug = "" } = useParams();
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const activeGenre = useMemo(
    () => EXPLORE_GENRE_CARDS.find(g => toGenreSlug(g.name) === slug.toLowerCase()),
    [slug]
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!activeGenre) {
        setItems([]);
        setLoading(false);
        setErr("Genre not found.");
        return;
      }
      setLoading(true);
      setErr("");
      try {
        let discoverParam = "";
        if (activeGenre.tmdbGenreId) {
          discoverParam = `with_genres=${activeGenre.tmdbGenreId}`;
        } else if (activeGenre.keywordQuery) {
          const kwUrl = `${TMDB_BASE}/search/keyword?api_key=${TMDB_KEY}&query=${encodeURIComponent(activeGenre.keywordQuery)}`;
          const kwRes = await fetch(kwUrl).then(r => r.json()).catch(() => null);
          const keywordId = kwRes?.results?.[0]?.id;
          if (!keywordId) {
            if (!cancelled) {
              setItems([]);
              setErr(`No TMDB keyword found for ${activeGenre.name}.`);
              setLoading(false);
            }
            return;
          }
          discoverParam = `with_keywords=${keywordId}`;
        }

        const movieUrl = `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&${discoverParam}`;
        const tvUrl = `${TMDB_BASE}/discover/tv?api_key=${TMDB_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&${discoverParam}`;

        const [movieRes, tvRes] = await Promise.all([
          fetch(movieUrl).then(r => r.json()).catch(() => null),
          fetch(tvUrl).then(r => r.json()).catch(() => null),
        ]);

        const toCard = (r, tmdbType) => ({
          id: `${tmdbType}-${r.id}`,
          tmdbId: r.id,
          tmdbType,
          title: r.title || r.name || "",
          year: (r.release_date || r.first_air_date || "").slice(0, 4),
          rating: r.vote_average || 0,
          type: tmdbType === "movie" ? "Movie" : "TV Show",
          poster: r.poster_path,
          backdrop: r.backdrop_path,
          overview: r.overview || "",
          streaming: [],
          categories: [activeGenre.name],
        });

        const merged = [
          ...(movieRes?.results || []).map(r => toCard(r, "movie")),
          ...(tvRes?.results || []).map(r => toCard(r, "tv")),
        ].filter(item => item.title);

        if (!cancelled) {
          setItems(merged);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e?.message || "Failed to load genre titles.");
          setLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [activeGenre]);

  const filtered = useMemo(
    () => items.filter(i => i.title.toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );

  if (!activeGenre) {
    return (
      <div style={{ paddingTop: 86, minHeight: "100vh" }}>
        <div className="page-header">
          <div className="page-eyebrow">Browse</div>
          <div className="page-h1">Genre <em>Not Found</em></div>
          <div className="page-count">0 titles</div>
        </div>
        <div style={{ padding: "0 52px 40px" }}>
          <button className="btn-outline" onClick={() => navigate("/")} style={{ padding: "10px 16px", borderRadius: 10 }}>
            {"< Back"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 86, minHeight: "100vh" }}>
      <div className="page-header">
        <div className="page-eyebrow">Genre</div>
        <div className="page-h1">{activeGenre.name} <em>Titles</em></div>
        <div className="page-count">{loading ? "Loading..." : `${filtered.length} titles`}</div>
      </div>
      <div style={{ padding: "0 52px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button className="btn-outline" onClick={() => navigate("/")} style={{ padding: "10px 14px", borderRadius: 9999 }}>
          {"< Back"}
        </button>
        <input
          className="see-all-inp"
          style={{ maxWidth: 420 }}
          placeholder="Search genre titles..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {err && <div style={{ padding: "0 52px 18px", color: "var(--red)" }}>{err}</div>}

      <div className="see-all-grid" style={{ padding: "8px 52px 80px" }}>
        {!loading && filtered.map((item, i) => (
          <div key={item.id || i} className="row-card" style={{ width: "100%", animationDelay: `${i * .03}s` }}
            onClick={() => onSelect && onSelect(item)}>
            <div className="row-card-img-box">
              <PosterImage item={item} className="row-card-img" />
              <div className="row-card-grad" />
              <div
                className="type-badge"
                onClick={e => { e.stopPropagation(); onTypeNav && onTypeNav(item.type); }}
              >
                {item.type}
              </div>
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
                {item.rating > 0 && <div className="row-card-rating">★ {parseFloat(item.rating).toFixed(1)}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

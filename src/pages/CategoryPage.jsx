import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PosterImage from "../components/PosterImage";

export default function CategoryPage({ allItems, onSelect, onTypeNav }) {
  const [q, setQ] = useState("");
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);

  const navigate = useNavigate();

  const pathParts = window.location.pathname.split("/category/");
  const rawType = pathParts[1] ? decodeURIComponent(pathParts[1]) : "";

  const baseLabel =
    rawType === "movie" ? "Movie" :
      rawType === "tv-show" ? "TV Show" :
        rawType === "anime" ? "Anime" :
          rawType === "categories" ? "Categories" : "";

  const isCategoryView = rawType === "categories";

  useEffect(() => {
    setShowCategoryPanel(isCategoryView);
    setQ("");
  }, [isCategoryView]);

  const slugify = useCallback((str) => (
    (str || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  ), []);

  const categoryGroups = useMemo(() => ({
    A: ["Action", "Adaptation", "Adult Comedy", "Adventure", "Animated", "Anthology", "Art House"],
    B: ["Based on Book", "Based on Game", "Based on True Story", "Biopic", "Blood & Gore", "Body Horror", "Bottle Movies", "Bromance", "Buddy Movie", "Business"],
    C: ["Campy", "Christmas", "Coming of Age", "Concert Film", "Crime", "Cult Classic", "Cyberpunk", "Cyber Thriller"],
    D: ["Dance", "Dark Comedy", "Dark / Gritty", "Date Night", "Disaster", "Disturbing", "Documentary", "Drama", "Dystopia"],
    E: ["Empowering", "Epic", "Espionage"],
    F: ["Family Drama", "Fantasy", "Feel Good", "Festive", "Found Footage", "Friendship", "Futuristic"],
    G: ["Game Show", "Gangster"],
    H: ["Harem", "Heartbreaking", "Heist", "Highschool", "Historical", "Historical Fiction", "Horror", "Humour", "Hyperlink"],
    I: ["Indie", "Inspirational", "Isekai"],
    L: ["Legal Drama", "Lighthearted & Fun"],
    M: ["Mass Movie", "Mecha", "Mind-Bending", "Mockumentary", "Monster", "Murder Mystery", "Musical", "Mystery"],
    N: ["Neo Noir", "Noir"],
    O: ["Original Anime"],
    P: ["Parody", "Patriotic", "Period Drama", "Political", "Post-Apocalyptic", "Psychological"],
    R: ["Reality TV", "Relaxing", "Remake", "Revenge", "Romance", "Rom-Com"],
    S: ["Satire", "Seinen", "Shonen", "Short Films", "Shoujo", "Sitcom", "Slasher", "Slice of Life", "Slow Burn", "Social Drama", "Spin-Off", "Spiritual", "Spoof", "Sports", "Spy", "Stand-up", "Steamy", "Superhero", "Supernatural", "Survival"],
    T: ["Talk Show", "Teen", "Time Travel", "Tragedy", "Travel"],
    W: ["War", "Western", "Witty"],
    Y: ["Yaoi", "Yuri"],
    Z: ["Zombie Apocalypse"],
  }), []);

  const filteredCategoryGroups = useMemo(() => {
    const search = q.trim().toLowerCase();
    const next = {};
    Object.entries(categoryGroups).forEach(([letter, list]) => {
      const filteredList = search ? list.filter(name => name.toLowerCase().includes(search)) : list;
      if (filteredList.length) next[letter] = filteredList;
    });
    return next;
  }, [categoryGroups, q]);

  const orderedLetters = useMemo(() => Object.keys(categoryGroups), [categoryGroups]);
  const visibleLetters = orderedLetters.filter(l => filteredCategoryGroups[l]?.length);

  const activeCategorySlug = (!["movie", "tv-show", "anime", "categories"].includes(rawType) && rawType) ? rawType : null;
  const label = activeCategorySlug
    ? activeCategorySlug.split("-").map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(" ")
    : baseLabel;

  const items = useMemo(() => {
    const baseItems = baseLabel
      ? (allItems || []).filter(i => (i.type || "").toLowerCase() === baseLabel.toLowerCase())
      : (allItems || []);
    if (activeCategorySlug) {
      return baseItems.filter(item =>
        (item.categories || []).some(cat => slugify(cat) === activeCategorySlug)
      );
    }
    return baseItems;
  }, [allItems, baseLabel, activeCategorySlug, slugify]);

  const filtered = useMemo(() =>
    items.filter(i => i.title?.toLowerCase().includes(q.toLowerCase()))
    , [items, q]);

  if (isCategoryView) {
    return (
      <div style={{ paddingTop: 86, minHeight: "100vh", background: "var(--bk)" }}>
        <div style={{ padding: "48px 52px 72px" }}>
          <div style={{ marginBottom: 22 }}>
            <div className="browse-grid">
              <div className="browse-item" onClick={() => setShowCategoryPanel(true)}>
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span className="browse-label">Category</span>
              </div>
              <div className="browse-item">
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="6" cy="12" r="2"></circle>
                  <circle cx="18" cy="12" r="2"></circle>
                  <path d="M8 12h8"></path>
                </svg>
                <span className="browse-label">Genre</span>
              </div>
              <div className="browse-item">
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 3v18M3 12h18"></path>
                </svg>
                <span className="browse-label">Country</span>
              </div>
              <div className="browse-item">
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2v20M2 8h20M2 12h20M2 16h20"></path>
                </svg>
                <span className="browse-label">Language</span>
              </div>
              <div className="browse-item">
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="7" r="2.5"></circle>
                  <circle cx="15" cy="7" r="2.5"></circle>
                  <path d="M9 11v2c0 1-1 2-2 2H3v-2c0-2 2-4 6-4s6 2 6 4v2h-4c-1 0-2-1-2-2v-2"></path>
                  <circle cx="15" cy="14" r="2.5"></circle>
                  <path d="M18 19v-2c0-1.5-1.5-3-3-3h-2v-2"></path>
                </svg>
                <span className="browse-label">Family Friendly</span>
              </div>
              <div className="browse-item">
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2l3.5 8h8.5l-6.5 5 2.5 8-7-5-7 5 2.5-8L0 10h8.5L12 2z"></path>
                </svg>
                <span className="browse-label">Award Winners</span>
              </div>
              <div className="browse-item">
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2C6 2 6 5 6 8v4h12V8c0-3 0-6-6-6z"></path>
                  <path d="M6 12v2h12v-2M8 16h8v4H8z"></path>
                  <circle cx="10" cy="18" r="0.5" fill="currentColor"></circle>
                  <circle cx="14" cy="18" r="0.5" fill="currentColor"></circle>
                </svg>
                <span className="browse-label">Anime</span>
              </div>
              <div className="browse-item">
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 5h4v14H4zM10 5h4v14h-4zM16 5h4v14h-4z"></path>
                </svg>
                <span className="browse-label">Franchise</span>
              </div>
            </div>
          </div>

          {showCategoryPanel && (
            <div style={{ marginTop: 28 }}>
              <div className="divider" style={{ marginBottom: 22 }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <button
                    className="btn-outline"
                    style={{ borderRadius: 9999, padding: "10px 14px", background: "var(--c2)", color: "var(--tx)" }}
                    onClick={() => setShowCategoryPanel(false)}
                  >
                    {"< Back"}
                  </button>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, color: "var(--tx)", lineHeight: 1 }}>Categories</div>
                </div>
                <input
                  className="search-inp"
                  style={{ maxWidth: 320, borderRadius: 9999, background: "var(--c1)" }}
                  placeholder="Search category"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                />
              </div>

              {visibleLetters.map((letter, idx) => (
                <div key={letter}>
                  {idx > 0 && <div className="divider" style={{ margin: "14px 0" }} />}
                  <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "18px", alignItems: "flex-start", padding: "6px 0" }}>
                    <div className="category-letter">{letter}</div>
                    <div className="category-grid">
                      {filteredCategoryGroups[letter].map(cat => (
                        <button
                          key={`${letter}-${cat}`}
                          className="category-item"
                          onClick={() => navigate(`/category/${slugify(cat)}`)}
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
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 86, minHeight: "100vh" }}>
      <div className="page-header">
        <div className="page-eyebrow">Browse</div>
        <div className="page-h1">{label || "All"} <em>Titles</em></div>
        <div className="page-count">{filtered.length} titles</div>
      </div>
      <div style={{ padding: "0 52px 16px" }}>
        <input
          className="see-all-inp"
          style={{ maxWidth: 420 }}
          placeholder={`Search ${label || "all"}...`}
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>
      <div className="see-all-grid" style={{ padding: "8px 52px 80px" }}>
        {filtered.map((item, i) => (
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

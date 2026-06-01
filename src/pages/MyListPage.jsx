import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilm, FaTv, FaDragon, FaCheck, FaPlay, FaList, FaSearch, FaStar } from "react-icons/fa";
import PosterImage from "../components/PosterImage";
import { Icon } from "../components/Icon";

/**
 * MyListPage Component
 * Displays user's personal library with filtering, sorting, and search
 * Handles entry management and browsing
 */
export function MyListPage({
  session,
  entries = [],
  filterType,
  filterStatus,
  sortBy,
  search,
  searching,
  showDropdown,
  searchResults,
  settings,
  loading,
  onFilterTypeChange,
  onFilterStatusChange,
  onSortChange,
  onSearchChange,
  onSearchFocus,
  onSelectEntry,
  onSelectResult,
  onEditEntry,
  onDeleteEntry,
  onAddToList,
  onTypeNav,
  STATUSES = [],
  typeCounts = {},
  counts = {},
  continueWatching = [],
  recentlyAdded = [],
  filtered = [],
  TMDB_IMG = "",
  SCOLOR = {},
  getStatusIcon,
  getType,
}) {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const handleExplore = () => {
    navigate("/explore");
  };

  return (
    <>
      {!session && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ textAlign: "center", maxWidth: 430 }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 50, color: "var(--acc)", letterSpacing: 3, textShadow: "0 0 36px var(--acc-glow)", marginBottom: 8 }}>
              Reel<span style={{ color: "var(--tx)" }}>log</span>
            </div>
            <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, marginBottom: 12, lineHeight: 1.2 }}>
              Your list is <em style={{ color: "var(--acc)", fontStyle: "italic" }}>private</em>
            </div>
            <p style={{ fontSize: 14, color: "var(--txm)", lineHeight: 1.85, marginBottom: 30 }}>
              Sign in to build your personal catalog of movies, shows and anime. Rate them, track your status and never lose track of what to watch next.
            </p>
            <button
              className="btn-acc btn-sm"
              style={{ padding: "14px 38px", fontSize: 14, fontWeight: 700, borderRadius: 9 }}
              onClick={() => window.location.reload()}
            >
              Sign in to view your list -&gt;
            </button>
            <div style={{ marginTop: 16, fontSize: 12, color: "var(--txd)" }}>
              No account?&nbsp;
              <span style={{ color: "var(--acc)", cursor: "pointer" }} onClick={() => window.location.reload()}>
                Join free
              </span>
            </div>
          </div>
        </div>
      )}

      {session && (
        <div className="library-shell">
          {/* Hero Section */}
          <div className="library-hero">
            <div>
              <div className="library-eyebrow">Personal dashboard</div>
              <div className="library-title">My Library</div>
              <div className="library-subtitle">Track every movie, show and anime in one place.</div>
            </div>
            <div className="library-total-pill">{entries.length} titles saved</div>
          </div>

          <div className="library-dashboard">
            {/* Stats Dashboard */}
            <div className="dash-stats">
              {[
                {
                  key: "Movie",
                  label: "Movies",
                  value: typeCounts.movie,
                  icon: <FaFilm />,
                  active: filterType === "Movie",
                  onClick: () => {
                    onFilterTypeChange(filterType === "Movie" ? "All" : "Movie");
                    onFilterStatusChange("All");
                  },
                },
                {
                  key: "TV Show",
                  label: "TV Shows",
                  value: typeCounts.tv,
                  icon: <FaTv />,
                  active: filterType === "TV Show",
                  onClick: () => {
                    onFilterTypeChange(filterType === "TV Show" ? "All" : "TV Show");
                    onFilterStatusChange("All");
                  },
                },
                {
                  key: "Anime",
                  label: "Anime",
                  value: typeCounts.anime,
                  icon: <FaDragon />,
                  active: filterType === "Anime",
                  onClick: () => {
                    onFilterTypeChange(filterType === "Anime" ? "All" : "Anime");
                    onFilterStatusChange("All");
                  },
                },
                {
                  key: "Watched",
                  label: "Watched",
                  value: counts.watched,
                  icon: <FaCheck />,
                  active: filterStatus === "Watched",
                  onClick: () => {
                    onFilterStatusChange(filterStatus === "Watched" ? "All" : "Watched");
                    onFilterTypeChange("All");
                  },
                },
                {
                  key: "Watching",
                  label: "Watching",
                  value: counts.watching,
                  icon: <FaPlay />,
                  active: filterStatus === "Watching",
                  onClick: () => {
                    onFilterStatusChange(filterStatus === "Watching" ? "All" : "Watching");
                    onFilterTypeChange("All");
                  },
                },
                {
                  key: "Want to Watch",
                  label: "Want to Watch",
                  value: counts.wantToWatch,
                  icon: <FaList />,
                  active: filterStatus === "Want to Watch",
                  onClick: () => {
                    onFilterStatusChange(filterStatus === "Want to Watch" ? "All" : "Want to Watch");
                    onFilterTypeChange("All");
                  },
                },
              ].map((stat) => (
                <button key={stat.key} className={`dash-stat${stat.active ? " on" : ""}`} onClick={stat.onClick}>
                  <div className="dash-stat-icon">{stat.icon}</div>
                  <div className="dash-stat-num">{stat.value}</div>
                  <div className="dash-stat-label">{stat.label}</div>
                </button>
              ))}
            </div>

            {/* Continue Watching Section */}
            {continueWatching.length > 0 && (
              <section className="library-section">
                <div className="library-section-head">
                  <div className="library-section-title">Continue Watching</div>
                  <div className="library-section-count">{continueWatching.length} active</div>
                </div>
                <div className="library-rail">
                  {continueWatching.map((entry) => (
                    <div key={entry.id} className="library-rail-card" onClick={() => onSelectEntry(entry)}>
                      <div className="library-rail-poster">
                        {entry.poster ? (
                          <img src={`${TMDB_IMG}${entry.poster}`} alt={entry.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                        ) : (
                          <div className="no-img-box">
                            <div className="no-img-icon">{entry.type === "Movie" ? "M" : entry.type === "Anime" ? "A" : "TV"}</div>
                            <span>{entry.type}</span>
                          </div>
                        )}
                        <div className="card-grad" />
                        <div className="card-status-tag" style={{ color: SCOLOR[entry.status], borderColor: SCOLOR[entry.status] + "44" }}>
                          {getStatusIcon(entry.status)} {entry.status}
                        </div>
                      </div>
                      <div className="library-rail-body">
                        <div className="library-rail-title">{entry.title}</div>
                        <div className="library-rail-meta">
                          <span>{entry.year || "N/A"}</span>
                          <span>{entry.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recently Added Section */}
            {recentlyAdded.length > 0 && (
              <section className="library-section">
                <div className="library-section-head">
                  <div className="library-section-title">Recently Added</div>
                  <div className="library-section-count">Latest 10</div>
                </div>
                <div className="library-rail">
                  {recentlyAdded.map((entry) => (
                    <div key={entry.id} className="library-rail-card" onClick={() => onSelectEntry(entry)}>
                      <div className="library-rail-poster">
                        {entry.poster ? (
                          <img src={`${TMDB_IMG}${entry.poster}`} alt={entry.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                        ) : (
                          <div className="no-img-box">
                            <div className="no-img-icon">{entry.type === "Movie" ? "M" : entry.type === "Anime" ? "A" : "TV"}</div>
                            <span>{entry.type}</span>
                          </div>
                        )}
                        <div className="card-grad" />
                      </div>
                      <div className="library-rail-body">
                        <div className="library-rail-title">{entry.title}</div>
                        <div className="library-rail-meta">
                          <span>{entry.year || "N/A"}</span>
                          <span>{entry.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Toolbar */}
            <div className="library-toolbar">
              <div className="toolbar">
                <div className="search-wrap" ref={searchRef}>
                  <FaSearch className="search-ico" />
                  <input
                    className="search-inp"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => searchResults.length > 0 && onSearchFocus()}
                    placeholder="Search your library..."
                  />
                  {searching && <span className="spin-ico">?</span>}
                  {showDropdown && (
                    <div className="drop">
                      {searchResults.map((r) => (
                        <div key={r.id} className="drop-row" onClick={() => onSelectResult(r)}>
                          {r.poster_path ? (
                            <img className="drop-img" src={`${TMDB_IMG}${r.poster_path}`} alt="" />
                          ) : (
                            <div className="drop-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>?</div>
                          )}
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

                {/* Type Filters */}
                <div className="fil-row">
                  {[
                    { key: "All", label: "All" },
                    { key: "Movie", label: "Movies" },
                    { key: "TV Show", label: "TV Shows" },
                    { key: "Anime", label: "Anime" },
                  ].map((f) => (
                    <button key={f.key} className={`fil-btn${filterType === f.key ? " on" : ""}`} onClick={() => onFilterTypeChange(f.key)}>
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Status Filters */}
                <div className="fil-row">
                  {["All", ...STATUSES].map((s) => (
                    <button key={s} className={`fil-btn${filterStatus === s ? " on" : ""}`} onClick={() => onFilterStatusChange(s)}>
                      {s}
                    </button>
                  ))}
                </div>

                {/* Sort Select */}
                <select className="sort-sel" value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
                  <option value="added">Recently Added</option>
                  <option value="title">Title A-Z</option>
                  <option value="titleDesc">Title Z-A</option>
                  <option value="rating">Highest Rated</option>
                  <option value="year">Newest Release</option>
                  <option value="yearAsc">Oldest Release</option>
                </select>
              </div>
            </div>

            {/* Collection Grid */}
            <div className="library-grid-wrap">
              <div className="library-grid-title">Collection</div>
              {loading ? (
                <div className="loader">
                  <div className="ldot" />
                  <div className="ldot" />
                  <div className="ldot" />
                </div>
              ) : (
                <div className={`grid${settings.cardSize === "small" ? " small" : settings.cardSize === "large" ? " large" : ""}`}>
                  {filtered.length === 0 && (
                    <div className="library-empty">
                      <div className="library-empty-icon">
                        <FaFilm />
                      </div>
                      <div className="library-empty-title">Your library is waiting.</div>
                      <div className="library-empty-sub">Start building your personal collection of movies, shows and anime.</div>
                      <button className="btn-acc btn-sm" onClick={handleExplore}>
                        Explore Titles
                      </button>
                    </div>
                  )}
                  {filtered.map((entry, i) => (
                    <div key={entry.id} className="card" style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }} onClick={() => onSelectEntry(entry)}>
                      <div className="card-img-box">
                        {entry.poster ? (
                          <img className="card-img" src={`${TMDB_IMG}${entry.poster}`} alt={entry.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                        ) : (
                          <div className="no-img-box">
                            <div className="no-img-icon">{entry.type === "Movie" ? "M" : entry.type === "Anime" ? "A" : "TV"}</div>
                            <span>{entry.type}</span>
                          </div>
                        )}
                        <div className="type-badge" onClick={(e) => { e.stopPropagation(); onTypeNav(entry.type); }}>
                          {entry.type}
                        </div>
                        <div className="card-grad" />
                        <div className="card-status-tag" style={{ color: SCOLOR[entry.status], borderColor: SCOLOR[entry.status] + "44" }}>
                          {getStatusIcon(entry.status)} {entry.status}
                        </div>
                        <div className="card-overlay">
                          <button className="card-action" onClick={(e) => { e.stopPropagation(); onSelectEntry(entry); }}>
                            View Details
                          </button>
                          {session && entry.user_id === session.user.id && (
                            <>
                              <button className="card-action secondary" onClick={(e) => { e.stopPropagation(); onAddToList(entry); }}>
                                Add to List
                              </button>
                              <button className="card-action secondary" onClick={(e) => { e.stopPropagation(); onEditEntry(entry); }}>
                                Edit Entry
                              </button>
                              <button className="card-action danger" onClick={(e) => { e.stopPropagation(); onDeleteEntry(entry.id); }}>
                                Remove Entry
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="card-title">{entry.title}</div>
                        <div className="card-meta-row">
                          <span className="card-type">{entry.type}</span>
                          <span className="card-year">{entry.year}</span>
                        </div>
                        {settings.showRatings && entry.rating > 0 && (
                          <div className="card-stars">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <FaStar key={s} className={`s${entry.rating >= s ? " on" : ""}`} aria-hidden="true" />
                            ))}
                          </div>
                        )}
                        {settings.showStreaming && entry.streaming?.length > 0 && (
                          <div className="card-platforms">
                            {/* Streaming platforms would be rendered here */}
                          </div>
                        )}
                        {settings.showOverviews && entry.notes && <div className="card-overview">{entry.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

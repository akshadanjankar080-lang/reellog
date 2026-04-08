import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PosterImage from "./PosterImage";

// ── Shimmer skeleton card ──────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ flexShrink: 0, width: 150 }}>
      <div style={{
        aspectRatio: "2/3", borderRadius: 14,
        background: "linear-gradient(90deg, var(--c2) 25%, var(--c3) 50%, var(--c2) 75%)",
        backgroundSize: "200% 100%",
        animation: "tmdbShimmer 1.5s infinite",
      }} />
      <div style={{
        height: 10, borderRadius: 6, margin: "12px 4px 5px",
        background: "linear-gradient(90deg, var(--c2) 25%, var(--c3) 50%, var(--c2) 75%)",
        backgroundSize: "200% 100%",
        animation: "tmdbShimmer 1.5s infinite 0.1s",
      }} />
      <div style={{
        height: 10, borderRadius: 6, width: "65%", margin: "0 4px",
        background: "linear-gradient(90deg, var(--c2) 25%, var(--c3) 50%, var(--c2) 75%)",
        backgroundSize: "200% 100%",
        animation: "tmdbShimmer 1.5s infinite 0.2s",
      }} />
    </div>
  );
}

export default function TmdbSection({ title, tabs = [], activeTab, onTabChange, items = [], onSelect, onTypeNav, onSeeAll }) {
  const scrollRef = useRef(null);
  const scroll = dir => scrollRef.current?.scrollBy({ left: dir * 480, behavior: "smooth" });
  const hasTabs = tabs.length > 0;
  const isLoading = items.length === 0;

  return (
    <div className="tmdb-section row-section">
      <style>{`
        @keyframes tmdbShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div className="tmdb-sec-head">
        <div className="tmdb-sec-title-wrap">
          <div className="tmdb-sec-title">{title}</div>
          {hasTabs && (
            <div className="tmdb-tabs" style={{ marginLeft: 16 }}>
              {tabs.map(t => (
                <button key={t.key}
                  className={`tmdb-tab${activeTab === t.key ? " on" : ""}`}
                  onClick={() => onTabChange(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {onSeeAll && !isLoading && (
            <button className="sec-see-all" onClick={onSeeAll}>See all →</button>
          )}
          <div style={{ display: "flex", gap: 6 }}>
            <button className="row-arrow-btn" onClick={() => scroll(-1)} style={{ width: 32, height: 32, borderRadius: 50, border: "1px solid var(--grey3)", background: "none", color: "var(--txm)", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }} onMouseOver={e => e.currentTarget.style.borderColor = "var(--acc-border)"} onMouseOut={e => e.currentTarget.style.borderColor = "var(--grey3)"}><FaChevronLeft /></button>
            <button className="row-arrow-btn" onClick={() => scroll(1)} style={{ width: 32, height: 32, borderRadius: 50, border: "1px solid var(--grey3)", background: "none", color: "var(--txm)", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }} onMouseOver={e => e.currentTarget.style.borderColor = "var(--acc-border)"} onMouseOut={e => e.currentTarget.style.borderColor = "var(--grey3)"}><FaChevronRight /></button>
          </div>
        </div>
      </div>

      {/* ── Skeleton while loading ── */}
      {isLoading && (
        <div className="tmdb-scroll-inner" style={{ display: "flex", gap: 16, overflow: "hidden" }}>
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Content ── */}
      {!isLoading && (
        <div
          ref={scrollRef}
          className="tmdb-scroll-inner"
          style={{ display: "flex", gap: 16, overflowX: "auto", scrollBehavior: "smooth", scrollbarWidth: "none" }}
        >
          {items.map((item, i) => {
            const date = item.year || (item.release_date || item.first_air_date || "").slice(0, 10);
            return (
              <div key={item.id || i} className="tmdb-card" onClick={() => onSelect && onSelect(item)}>
                <div className="tmdb-card-poster">
                  <PosterImage item={item} className="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {item.type && (
                    <div
                      className="type-badge"
                      onClick={e => { e.stopPropagation(); onTypeNav && onTypeNav(item.type); }}
                    >
                      {item.type}
                    </div>
                  )}
                  <div className="card-overlay">
                    <button
                      className="card-add-btn"
                      onClick={e => { e.stopPropagation(); onSelect && onSelect(item); }}
                    >
                      + Add to List
                    </button>
                  </div>
                </div>
                <div className="tmdb-card-info">
                  <div className="tmdb-card-date">{date}</div>
                  <div className="tmdb-card-name">{item.title}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

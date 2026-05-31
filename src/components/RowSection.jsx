import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PosterImage from "./PosterImage";
import { Icon } from "./Icon";

export default function RowSection({ title, emoji, items, showRank, showOverview, onSelect, onSeeAll, onTypeNav }) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const checkArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkArrows, { passive: true });
    checkArrows();
    return () => el.removeEventListener("scroll", checkArrows);
  }, [items]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <div className="catalog-section row-section">
      <div className="sec-header">
        <div className="sec-title">
          {emoji && <Icon name={emoji} size={20} />}
          {title}
          <span className="sec-count">{items.length}</span>
        </div>
        <button className="sec-see-all" onClick={() => onSeeAll && onSeeAll()}>See all →</button>
      </div>
      <div className="row-section-wrap">
        {canLeft && <button className="row-arrow row-arrow-left" onClick={() => scroll(-1)}><FaChevronLeft /></button>}
        {canRight && <button className="row-arrow row-arrow-right" onClick={() => scroll(1)}><FaChevronRight /></button>}
        <div className="row-scroll" ref={scrollRef}>
          {items.map((item, i) => (
            <div key={item.id} className="row-card" onClick={() => onSelect(item)}
              style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="row-card-img-box">
                <PosterImage item={item} className="row-card-img" />
                <div className="row-card-grad" />
                {showRank && <div className="row-card-rank">{i + 1}</div>}
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
                    onClick={e => {
                      e.stopPropagation();
                      onSelect && onSelect(item);
                    }}
                  >
                    + Add to List
                  </button>
                </div>
              </div>
              <div className="row-card-body">
                <div className="row-card-title">{item.title}</div>
                <div className="row-card-meta">
                  <div className="row-card-year">{item.year}</div>
                </div>
                {showOverview && item.overview && (
                  <div style={{ fontSize: 10, color: "var(--txd)", marginTop: 5, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {item.overview}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { TMDB_W, TMDB_IMG, OTT, HERO_ITEMS } from "../lib/constants";
import { Icon } from "./Icon";


export default function HeroCarousel({ items, onAdd, session, setShowAuth, autoplay = true }) {
  const slides = items?.length ? items : HERO_ITEMS;
  const [idx, setIdx] = useState(0);
  const [transitioning, setTrans] = useState(false);
  const intervalRef = useRef(null);
  const thumbStripRef = useRef(null);
  const thumbRefs = useRef([]);

  const goTo = (i) => {
    if (i === idx || transitioning || !slides.length) return;
    setTrans(true);
    setTimeout(() => { setIdx(i); setTrans(false); }, 400);
  };

  const scrollThumbs = (dir) => {
    thumbStripRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  useEffect(() => {
    if (!autoplay || slides.length < 2) return;
    intervalRef.current = setInterval(() => {
      setTrans(true);
      setTimeout(() => { setIdx(p => (p + 1) % slides.length); setTrans(false); }, 400);
    }, 6500);
    return () => clearInterval(intervalRef.current);
  }, [autoplay, slides.length]);

  const activeIdx = slides.length ? Math.min(idx, slides.length - 1) : 0;
  const item = slides[activeIdx] || slides[0];
  if (!item) return null;

  return (
    <div className="hero-wrap">
      {slides.map((h, i) => (
        <div key={i}
          className={`hero-bg-img ${i === activeIdx && !transitioning ? "active" : "enter"}`}
          style={{ backgroundImage: `url(${TMDB_W}${h.backdrop})`, zIndex: i === activeIdx ? 1 : 0 }}
        />
      ))}
      <div className="hero-overlay" style={{ zIndex: 2 }} />
      <div className="hero-content" style={{ zIndex: 3 }}>
        <div className="hero-badge"><Icon name="fire" size={14} /> TRENDING NOW</div>
        <div className="hero-title">{item.title}</div>
        <div className="hero-meta">
          <div className="hero-type-tag">{item.type}</div>
          <div className="hero-year">{item.year}</div>
        </div>
        <p className="hero-overview">{item.overview}</p>
        <div className="hero-actions">
          {item.streaming?.length > 0 && (
            <button className="btn-hero-add" onClick={() => {
              const ottKey = item.streaming[0];
              const ottData = OTT[ottKey];
              if (ottData) {
                window.open(ottData.url + encodeURIComponent(item.title), '_blank');
              }
            }} title="Open in streaming app">
              {"\u25B6"}&nbsp;Watch Now
            </button>
          )}
          <button className="btn-hero-play" onClick={() => session ? onAdd(item) : setShowAuth(true)}>
            +&nbsp;Add to List
          </button>
        </div>
      </div>
      <div className="hero-thumbs-wrap" style={{ zIndex: 3 }}>
        <button className="hero-thumb-arrow" onClick={() => scrollThumbs(-1)} aria-label="Previous thumbnails"><FaChevronLeft /></button>
        <div className="hero-thumbs" ref={thumbStripRef}>
          {slides.map((h, i) => {
            const imgPath = h.backdrop || h.poster || h.backdrop_path || h.poster_path;
            const src = imgPath ? `${TMDB_IMG}${imgPath}` : null;
            return (
              <button
                key={i}
                className={`hero-thumb${i === activeIdx ? " active" : ""}`}
                onClick={() => goTo(i)}
                ref={el => { thumbRefs.current[i] = el; }}
                aria-label={`Go to ${h.title || "slide"}`}
              >
                {src
                  ? <img src={src} alt={h.title || "Hero thumbnail"} loading="lazy" />
                  : <span className="hero-thumb-fallback">{h.title || "Untitled"}</span>}
              </button>
            );
          })}
        </div>
        <button className="hero-thumb-arrow" onClick={() => scrollThumbs(1)} aria-label="Next thumbnails"><FaChevronRight /></button>
      </div>
    </div>
  );
}

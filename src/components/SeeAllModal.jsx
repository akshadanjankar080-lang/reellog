import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import PosterImage from "./PosterImage";
import { Icon } from "./Icon";

export default function SeeAllModal({ title, emoji, items, onClose, onSelect, onTypeNav }) {
  const [q, setQ] = useState("");
  const [headOpacity, setHeadOpacity] = useState(1);
  const backdropRef = useRef(null);
  const filtered = items.filter(it => it.title.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const handleBackdropScroll = (e) => {
      const scrollY = e.target.scrollTop;
      const opacity = Math.max(0, 1 - scrollY / 120);
      setHeadOpacity(opacity);
    };
    const backdrop = backdropRef.current;
    if (backdrop) {
      backdrop.addEventListener("scroll", handleBackdropScroll, { passive: true });
      return () => backdrop.removeEventListener("scroll", handleBackdropScroll);
    }
  }, []);

  return (
    <div className="see-all-backdrop" ref={backdropRef} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="see-all-panel">
        <div className="see-all-head" style={{ opacity: headOpacity, transition: "opacity 0.1s ease" }}>
          <div className="see-all-title">
            {emoji && <span style={{ marginRight: 8, display: "inline-block", verticalAlign: "middle" }}><Icon name={emoji} size={20} /></span>}
            {title}
            <span style={{ fontSize: 12, color: "var(--txm)", fontFamily: "'DM Sans',sans-serif", fontWeight: 400, marginLeft: 4 }}>{items.length} titles</span>
          </div>
          <button className="settings-close" onClick={onClose}><FaTimes /></button>
        </div>
        <div className="see-all-search">
          <input className="see-all-inp"
            placeholder={`Search in ${title.toLowerCase()}…`}
            value={q} onChange={e => setQ(e.target.value)} autoFocus />
        </div>
        <div className="see-all-grid">
          {filtered.map((item, i) => (
            <div key={item.id} className="row-card" style={{ width: "100%", animationDelay: `${i * .03}s` }}
              onClick={() => { onSelect(item); onClose(); }}>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

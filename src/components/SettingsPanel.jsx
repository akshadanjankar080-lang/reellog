import { FaTimes } from "react-icons/fa";
import { Icon } from "./Icon";

export default function SettingsPanel({ settings, onChange, onClose, onExport, onClearCache, session, onSignOut }) {
  const SWATCHES = [
    { key: "green", color: "#b2f0c5", label: "Jade" },
    { key: "yellow", color: "#f4d06f", label: "Gold" },
    { key: "blue", color: "#8ebbf5", label: "Cobalt" },
    { key: "red", color: "#f47070", label: "Ember" },
  ];

  return (
    <div className="settings-panel">
      <div className="settings-head">
        <div className="settings-title">
          <Icon name="settings" size={20} />
          Settings
        </div>
        <button className="settings-close" onClick={onClose}><FaTimes /></button>
      </div>
      <div className="settings-body">

        <div className="sett-section">
          <div className="sett-section-title">Appearance</div>
          <div className="sett-row" style={{ paddingTop: 0, marginTop: -4 }}>
            <div>
              <div className="sett-label">Theme</div>
              <div className="sett-desc">Black, Light, or Neo (original)</div>
            </div>
            <div className="theme-pills">
              {[
                { key: "black", label: "Black" },
                { key: "light", label: "Light" },
                { key: "neo", label: "Neo" },
              ].map(t => (
                <button key={t.key}
                  className={`theme-pill${settings.theme === t.key ? " on" : ""}`}
                  onClick={() => onChange("theme", t.key)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div className="flbl" style={{ marginBottom: 4 }}>Accent Color</div>
            <div className="color-swatches">
              {SWATCHES.map(s => (
                <div key={s.key} title={s.label}
                  className={`swatch${settings.accentColor === s.key ? " on" : ""}`}
                  style={{ background: s.color }}
                  onClick={() => onChange("accentColor", s.key)}
                />
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="flbl" style={{ marginBottom: 4 }}>Card Size</div>
            <div className="card-size-btns">
              {["small", "medium", "large"].map(s => (
                <button key={s} className={`size-btn${settings.cardSize === s ? " on" : ""}`}
                  onClick={() => onChange("cardSize", s)}>
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="sett-row" style={{ marginTop: 14 }}>
            <div>
              <div className="sett-label">Cinematic Background</div>
              <div className="sett-desc">Film grain &amp; gradient overlay</div>
            </div>
            <button className={`toggle${settings.cinematicBg ? " on" : ""}`}
              onClick={() => onChange("cinematicBg", !settings.cinematicBg)} />
          </div>
        </div>

        <div className="sett-section">
          <div className="sett-section-title">Display</div>
          {[
            { key: "showRatings", label: "Show Ratings", desc: "Show IMDb-style star ratings on cards" },
            { key: "showOverviews", label: "Show Overviews", desc: "Show plot summary under card title" },
            { key: "showStreaming", label: "Show Streaming", desc: "Show OTT platform badges on card hover" },
            { key: "animationsReduced", label: "Reduce Motion", desc: "Minimize card hover & page animations" },
          ].map(opt => (
            <div key={opt.key} className="sett-row">
              <div>
                <div className="sett-label">{opt.label}</div>
                <div className="sett-desc">{opt.desc}</div>
              </div>
              <button className={`toggle${settings[opt.key] ? " on" : ""}`}
                onClick={() => onChange(opt.key, !settings[opt.key])} />
            </div>
          ))}
        </div>

        <div className="sett-section">
          <div className="sett-section-title">Discovery</div>
          {[
            { key: "autoplay", label: "Hero Autoplay", desc: "Auto-rotate the hero banner carousel" },
            { key: "adultContent", label: "Mature Content", desc: "Include adult-rated titles in search" },
          ].map(opt => (
            <div key={opt.key} className="sett-row">
              <div>
                <div className="sett-label">{opt.label}</div>
                <div className="sett-desc">{opt.desc}</div>
              </div>
              <button className={`toggle${settings[opt.key] ? " on" : ""}`}
                onClick={() => onChange(opt.key, !settings[opt.key])} />
            </div>
          ))}
        </div>

        <div className="sett-section">
          <div className="sett-section-title">Language</div>
          <div className="sett-row">
            <div>
              <div className="sett-label">UI Language</div>
              <div className="sett-desc">Interface language preference</div>
            </div>
            <select className="fsel" style={{ width: "auto" }}
              value={settings.language}
              onChange={e => onChange("language", e.target.value)}>
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
        </div>

        <div className="sett-section">
          <div className="sett-section-title">Data</div>
          <button className="sett-export-btn" onClick={onExport}>⬇ Export My Catalog (JSON)</button>
          <button className="sett-export-btn" onClick={onClearCache} style={{ marginTop: 6 }}>🗑 Clear Image Cache</button>
          <div style={{ fontSize: 11, color: "var(--txd)", marginTop: 14, lineHeight: 1.7 }}>
            Your data is stored in Supabase and is private to your account. Export creates a JSON backup.
          </div>
        </div>

        {session && (
          <div className="sett-section">
            <div className="sett-section-title">Account</div>
            <button className="sett-export-btn" onClick={onSignOut}>Sign out</button>
          </div>
        )}

        <div className="sett-section">
          <div className="sett-section-title">About</div>
          <div style={{ fontSize: 12, color: "var(--txd)", lineHeight: 1.8 }}>
            <div style={{ marginBottom: 6 }}>
              <span style={{ color: "var(--acc)", fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 2, fontSize: 17 }}>Reel</span>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 2, fontSize: 17 }}>log</span>
            </div>
            Powered by TMDB · Built with Supabase<br />
            Streaming data for informational use only.<br />
            Track every film, show &amp; anime you love.
          </div>
        </div>

      </div>
    </div>
  );
}

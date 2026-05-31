/**
 * SkeletonCard — Netflix-style shimmer placeholder
 *
 * variant="grid"  → tall portrait card (matches .card in the watchlist grid)
 * variant="row"   → compact poster card (matches .tmdb-card in row sections)
 */
export default function SkeletonCard({ variant = "grid" }) {
  const isRow = variant === "row";

  // Shared shimmer block style factory
  const shimmer = (extra = {}) => ({
    background: "linear-gradient(90deg, var(--c2) 0%, var(--c3) 40%, var(--c2) 80%)",
    backgroundSize: "300% 100%",
    animation: "skeletonShimmer 1.6s ease-in-out infinite",
    borderRadius: 8,
    ...extra,
  });

  if (isRow) {
    return (
      <div style={{ flexShrink: 0, width: 150 }}>
        {/* Poster */}
        <div style={shimmer({ aspectRatio: "2/3", borderRadius: 14, border: "1px solid rgba(255,255,255,.04)" })} />
        {/* Date line */}
        <div style={shimmer({ height: 9, width: "55%", margin: "12px 4px 6px" })} />
        {/* Title line */}
        <div style={shimmer({ height: 11, margin: "0 4px 4px" })} />
        {/* Title line 2 (shorter) */}
        <div style={shimmer({ height: 11, width: "70%", margin: "0 4px" })} />
      </div>
    );
  }

  // grid variant — matches `.card` structure exactly
  return (
    <div style={{
      background: "var(--c1)",
      border: "1px solid rgba(255,255,255,.06)",
      borderRadius: 16,
      overflow: "hidden",
    }}>
      {/* Image area — 2/3 aspect ratio */}
      <div style={shimmer({ aspectRatio: "2/3", borderRadius: 0 })} />

      {/* Card body */}
      <div style={{ padding: 12 }}>
        {/* Title */}
        <div style={shimmer({ height: 12, marginBottom: 8 })} />
        {/* Meta row */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={shimmer({ height: 10, width: "38%", animationDelay: "0.1s" })} />
          <div style={shimmer({ height: 10, width: "24%", animationDelay: "0.2s" })} />
        </div>
        {/* Stars placeholder */}
        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          {[0, 0.1, 0.2, 0.3, 0.4].map((d, i) => (
            <div key={i} style={shimmer({ width: 12, height: 12, borderRadius: 3, animationDelay: `${0.3 + d}s` })} />
          ))}
        </div>
      </div>
    </div>
  );
}

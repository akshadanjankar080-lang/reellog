// ─── HomePage.jsx ──────────────────────────────────────────────────
// Pure presentation component for the homepage.
// All state lives in App.jsx and is passed down as props.
// DO NOT add state management here.
// ───────────────────────────────────────────────────────────────────

export default function HomePage({
  // hero
  heroItems,
  autoplay,
  onAdd,
  session,
  setShowAuth,
  HeroCarousel,

  // TMDB sections
  TmdbSection,

  // Trending section
  homeTrending,
  trendMode,
  onTrendTabChange,

  // Popular section
  homePopular,
  popularMode,
  onPopularTabChange,

  // Free section
  homeFree,
  freeMode,
  onFreeTabChange,

  // Binge-worthy series
  homeSeries,

  // shared callbacks
  onSelect,
  onTypeNav,
  onSeeAll,
}) {
  // Safety: if critical components aren't passed, render nothing to avoid blank screen
  if (!HeroCarousel || !TmdbSection) return null;

  return (
    <>
      <HeroCarousel
        items={heroItems ?? []}
        autoplay={autoplay}
        onAdd={onAdd}
        session={session}
        setShowAuth={setShowAuth}
      />
      <div className="main-content">
        <TmdbSection
          title="Trending"
          tabs={[{ key: "day", label: "Today" }, { key: "week", label: "This Week" }]}
          activeTab={trendMode}
          onTabChange={onTrendTabChange}
          items={homeTrending ?? []}
          onSelect={onSelect}
          onTypeNav={onTypeNav}
          onSeeAll={() => onSeeAll({ title: "Trending", emoji: "fire", items: homeTrending ?? [] })}
        />
        <div className="divider" />
        <TmdbSection
          title="What's Popular"
          tabs={[
            { key: "streaming", label: "Streaming" },
            { key: "tv",        label: "On TV" },
            { key: "rent",      label: "For Rent" },
            { key: "theaters",  label: "In Theaters" },
          ]}
          activeTab={popularMode}
          onTabChange={onPopularTabChange}
          items={homePopular ?? []}
          onSelect={onSelect}
          onTypeNav={onTypeNav}
          onSeeAll={() => onSeeAll({ title: "What's Popular", emoji: "eye", items: homePopular ?? [] })}
        />
        <div className="divider" />
        <TmdbSection
          title="Free To Watch"
          tabs={[{ key: "movies", label: "Movies" }, { key: "tv", label: "TV" }]}
          activeTab={freeMode}
          onTabChange={onFreeTabChange}
          items={homeFree ?? []}
          onSelect={onSelect}
          onTypeNav={onTypeNav}
          onSeeAll={() => onSeeAll({ title: "Free To Watch", emoji: "gift", items: homeFree ?? [] })}
        />
        <div className="divider" />
        <TmdbSection
          title="Binge-worthy Series"
          tabs={[]}
          items={homeSeries ?? []}
          onSelect={onSelect}
          onTypeNav={onTypeNav}
          onSeeAll={() => onSeeAll({ title: "Binge-worthy Series", emoji: "play", items: homeSeries ?? [] })}
        />
        <div style={{ height: 64 }} />
      </div>
    </>
  );
}

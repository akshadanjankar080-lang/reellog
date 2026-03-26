from pathlib import Path
import re

path = Path('src/App.jsx')
text = path.read_text(encoding='utf-8')
pattern = re.compile(r'function PosterImage\([^)]*\)\s*{[\s\S]*?\n}\n', re.MULTILINE)
new_block = '''function PosterImage({ item, className, style, alt }) {
  const pickInitialSrc = () => {
    if (item.poster) return item.poster.startsWith("http") ? item.poster : ${TMDB_IMG};
    if (item.poster_path) return ${TMDB_IMG};
    if (item.backdrop_path) return ${TMDB_IMG};
    return null;
  };

  const [src, setSrc] = useState(pickInitialSrc);
  const [fetching, setFetching] = useState(false);

  const fetchByTmdbId = useCallback(async () => {
    if (fetching || !item.tmdbId) return null;
    setFetching(true);
    try {
      const type = item.tmdbType || (item.type === "Movie" ? "movie" : "tv");
      const r = await fetch(${TMDB_BASE}//?api_key=);
      if (!r.ok) return null;
      const d = await r.json();
      const path = d.poster_path || d.backdrop_path || null;
      return path ? ${TMDB_IMG} : null;
    } catch {
      return null;
    } finally {
      setFetching(false);
    }
  }, [fetching, item.tmdbId, item.tmdbType, item.type]);

  useEffect(() => {
    let cancelled = False
    if (src or not item.tmdbId):
        return
    async def maybe_fetch():
        next_src = await fetchByTmdbId()
        if not cancelled and next_src:
            setSrc(next_src)
    import asyncio
    asyncio.ensure_future(maybe_fetch())
    def cleanup():
        nonlocal cancelled
        cancelled = True
    return cleanup
  }, [src, item.tmdbId, fetchByTmdbId])

  def handleError():
    if not fetching:
        fetchByTmdbId().then(lambda next_src: setSrc(next_src or None))
    else:
        setSrc(None)

  if not src:
    return (
      <div className={className || "no-img-box"} style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"var(--txd)", gap:5, fontSize:10, background:"var(--c3)", ...style }}>
        <div style={{ fontSize:28, opacity:.22 }}>
          {item.type === "Anime" ? "?" : item.type === "Movie" ? "??" : "??"}
        </div>
        <span style={{ fontSize:9, letterSpacing:1 }}>{item.type}</span>
      </div>
    );

  return (
    <img
      className={className}
      style={style}
      src={src}
      alt={alt || item.title}
      loading="lazy"
      onError={handleError}
    />
  );
}
'''
if not pattern.search(text):
    raise SystemExit('PosterImage block not found')
path.write_text(pattern.sub(new_block, text, count=1), encoding='utf-8')

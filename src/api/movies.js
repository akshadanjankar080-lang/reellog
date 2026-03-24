const OMDB_KEY = import.meta.env.VITE_OMDB_API_KEY

export async function searchMovies(query) {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${query}`
  )

  const data = await res.json()

  if (data.Response === "False") {
    throw new Error("No results found")
  }

  return data.Search.map(item => ({
    id: item.imdbID,
    title: item.Title,
    poster: item.Poster !== "N/A" ? item.Poster : null,
    year: item.Year,
    source: "OMDB"
  }))
}
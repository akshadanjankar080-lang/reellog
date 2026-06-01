import { useMemo, useCallback } from "react";

/**
 * useLibrary Hook
 * Manages library filtering, sorting, searching, and derived state
 * Keeps all library logic in one reusable place
 */
export function useLibrary(entries = []) {
  /**
   * Get counts by type
   */
  const typeCounts = useMemo(() => {
    return {
      all: entries.length,
      movie: entries.filter(e => e.type === "Movie").length,
      tv: entries.filter(e => e.type === "TV Show").length,
      anime: entries.filter(e => e.type === "Anime").length,
    };
  }, [entries]);

  /**
   * Get counts by status
   */
  const statusCounts = useMemo(() => {
    return {
      all: entries.length,
      watched: entries.filter(e => e.status === "Watched").length,
      watching: entries.filter(e => e.status === "Watching").length,
      wantToWatch: entries.filter(e => e.status === "Want to Watch").length,
      paused: entries.filter(e => e.status === "Paused").length,
      dropped: entries.filter(e => e.status === "Dropped").length,
    };
  }, [entries]);

  /**
   * Get average rating from library
   */
  const averageRating = useMemo(() => {
    const rated = entries.filter(e => e.rating);
    if (!rated.length) return 0;
    const sum = rated.reduce((acc, e) => acc + (e.rating || 0), 0);
    return (sum / rated.length).toFixed(1);
  }, [entries]);

  /**
   * Filter entries by type
   */
  const filterByType = useCallback((list, type) => {
    if (type === "All") return list;
    return list.filter(e => e.type === type);
  }, []);

  /**
   * Filter entries by status
   */
  const filterByStatus = useCallback((list, status) => {
    if (status === "All") return list;
    return list.filter(e => e.status === status);
  }, []);

  /**
   * Sort entries by field
   */
  const sortEntries = useCallback((list, sortBy) => {
    const sorted = [...list];
    switch (sortBy) {
      case "added":
        return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      case "title":
        return sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "year":
        return sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
      case "updated":
        return sorted.sort((a, b) => new Date(b.dateUpdated || b.dateAdded) - new Date(a.dateUpdated || a.dateAdded));
      default:
        return sorted;
    }
  }, []);

  /**
   * Search entries by title, overview, or categories
   */
  const searchEntries = useCallback((list, query) => {
    if (!query || query.trim() === "") return list;
    const q = query.toLowerCase();
    return list.filter(e =>
      (e.title && e.title.toLowerCase().includes(q)) ||
      (e.overview && e.overview.toLowerCase().includes(q)) ||
      (Array.isArray(e.categories) && e.categories.some(c => c.toLowerCase().includes(q)))
    );
  }, []);

  /**
   * Apply all filters and sorting
   */
  const applyFilters = useCallback((
    list,
    filterType = "All",
    filterStatus = "All",
    sortBy = "added",
    search = ""
  ) => {
    let result = [...list];

    // Apply type filter
    result = filterByType(result, filterType);

    // Apply status filter
    result = filterByStatus(result, filterStatus);

    // Apply search
    result = searchEntries(result, search);

    // Apply sorting
    result = sortEntries(result, sortBy);

    return result;
  }, [filterByType, filterByStatus, searchEntries, sortEntries]);

  return {
    typeCounts,
    statusCounts,
    averageRating,
    filterByType,
    filterByStatus,
    sortEntries,
    searchEntries,
    applyFilters,
  };
}

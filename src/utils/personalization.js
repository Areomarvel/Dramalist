export const RECENT_SEARCHES_KEY = 'adw_recent_searches';
export const RECENTLY_VIEWED_KEY = 'adw_recently_viewed';

export function getRecentSearches() {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(term) {
  const safeTerm = String(term || '').trim();
  if (!safeTerm) return;

  try {
    const existing = getRecentSearches();
    const next = [safeTerm, ...existing.filter(item => item.toLowerCase() !== safeTerm.toLowerCase())].slice(0, 8);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage issues in restricted environments.
  }
}

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecentlyViewed(item) {
  if (!item || !item.id) return;

  try {
    const existing = getRecentlyViewed();
    const next = [
      { id: item.id, title: item.title || item.name || 'Untitled', poster_path: item.poster_path || '', media_type: item.media_type || 'tv' },
      ...existing.filter(entry => String(entry.id) !== String(item.id))
    ].slice(0, 6);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage issues in restricted environments.
  }
}

export function getContinueWatching() {
  try {
    const raw = localStorage.getItem('adw_progress_tracker');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return [];

    return Object.entries(parsed)
      .map(([id, progress]) => ({ id, ...progress }))
      .filter(item => item && item.status && item.currentEpisode > 0 && item.totalEpisodes && item.currentEpisode < item.totalEpisodes)
      .slice(0, 6);
  } catch {
    return [];
  }
}

export function getRecommendedFromHistory(popularItems = [], watchlist = [], progressList = []) {
  const favorites = [...watchlist, ...progressList].map(item => {
    const title = item.title || item.name || '';
    if (!title) return null;
    return {
      id: item.id,
      title,
      media_type: item.media_type || 'tv',
      poster_path: item.poster_path || '',
      vote_average: item.vote_average || item.score || 0,
    };
  }).filter(Boolean);

  const normalized = favorites.map(item => String(item.id));

  const results = [];
  for (const item of popularItems) {
    if (!item || !item.id) continue;
    if (normalized.includes(String(item.id))) continue;
    results.push(item);
  }

  return results.slice(0, 8);
}

/**
 * useWatchlist.js
 * Custom hook for managing the user's watchlist via localStorage.
 */
import { useState, useCallback } from 'react';

const STORAGE_KEY = 'adw_watchlist';

function loadWatchlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWatchlist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => loadWatchlist());

  const addToWatchlist = useCallback((item) => {
    setWatchlist(prev => {
      if (prev.find(w => w.id === item.id && w.media_type === item.media_type)) return prev;
      const updated = [item, ...prev];
      saveWatchlist(updated);
      return updated;
    });
  }, []);

  const removeFromWatchlist = useCallback((id, mediaType) => {
    setWatchlist(prev => {
      const updated = prev.filter(w => !(w.id === id && w.media_type === mediaType));
      saveWatchlist(updated);
      return updated;
    });
  }, []);

  const isInWatchlist = useCallback((id, mediaType) => {
    return loadWatchlist().some(w => w.id === id && w.media_type === mediaType);
  }, []);

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist };
}

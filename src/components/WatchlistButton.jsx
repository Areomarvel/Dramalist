import React, { useState, useEffect } from 'react';

const WatchlistButton = ({ item, size = 'normal' }) => {
  const STORAGE_KEY = 'adw_watchlist';
  const [inWatchlist, setInWatchlist] = useState(false);
  const [animating, setAnimating] = useState(false);

  const getId = () => item?.id;
  const getType = () => item?.media_type || 'tv';

  useEffect(() => {
    const check = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        setInWatchlist(list.some(w => w.id === getId() && w.media_type === getType()));
      } catch {
        setInWatchlist(false);
      }
    };
    check();
    window.addEventListener('adw_watchlist_change', check);
    return () => window.removeEventListener('adw_watchlist_change', check);
  }, [item?.id]);

  const toggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let list = raw ? JSON.parse(raw) : [];
      if (inWatchlist) {
        list = list.filter(w => !(w.id === getId() && w.media_type === getType()));
      } else {
        list = [{ ...item, media_type: getType() }, ...list];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setInWatchlist(!inWatchlist);
      setAnimating(true);
      setTimeout(() => setAnimating(false), 400);
      window.dispatchEvent(new Event('adw_watchlist_change'));
    } catch (err) {
      console.error('Watchlist error:', err);
    }
  };

  return (
    <button
      className={`watchlist-btn ${inWatchlist ? 'active' : ''} ${animating ? 'pop' : ''} ${size === 'small' ? 'watchlist-btn-sm' : ''}`}
      onClick={toggle}
      aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
      title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {inWatchlist ? '🔖' : '🏷️'}
    </button>
  );
};

export default WatchlistButton;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const WatchlistButton = ({ item, size = 'normal' }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useAuth();
  const [animating, setAnimating] = useState(false);

  if (!item?.id) return null;

  const inWatchlist = isInWatchlist(item.id);

  const toggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);

    if (inWatchlist) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
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


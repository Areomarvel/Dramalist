import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTitle } from '../utils/translateTitle';
import WatchlistButton from '../components/WatchlistButton';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const STORAGE_KEY = 'adw_watchlist';

const Watchlist = () => {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);

  const loadList = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setWatchlist(raw ? JSON.parse(raw) : []);
    } catch {
      setWatchlist([]);
    }
  };

  useEffect(() => {
    loadList();
    window.addEventListener('adw_watchlist_change', loadList);
    return () => window.removeEventListener('adw_watchlist_change', loadList);
  }, []);

  const handleCardClick = (item) => {
    if (item.media_type === 'movie') {
      navigate(`/movie/${item.id}`);
    } else {
      navigate(`/drama/${item.id}`);
    }
  };

  return (
    <div className="app-container">
      <div className="watchlist-header">
        <h1 className="watchlist-title">🔖 My Watchlist</h1>
        <p className="watchlist-subtitle">
          {watchlist.length > 0
            ? `${watchlist.length} title${watchlist.length !== 1 ? 's' : ''} saved`
            : 'Your saved dramas & movies will appear here'}
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="watchlist-empty">
          <div className="watchlist-empty-icon">🎭</div>
          <h3>Nothing saved yet</h3>
          <p>Browse dramas and click the 🏷️ bookmark icon to save titles here.</p>
          <button className="watchlist-browse-btn" onClick={() => navigate('/')}>
            Browse Dramas
          </button>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map(item => {
            const title = formatTitle(
              item.name || item.title,
              item.original_name || item.original_title
            ) || item.name || item.title;
            const poster = item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null;
            const year = item.first_air_date || item.release_date
              ? new Date(item.first_air_date || item.release_date).getFullYear()
              : null;

            return (
              <div key={`${item.media_type}-${item.id}`} className="watchlist-card" onClick={() => handleCardClick(item)}>
                <div className="watchlist-poster">
                  {poster ? (
                    <img src={poster} alt={title} loading="lazy" />
                  ) : (
                    <div className="watchlist-poster-placeholder">
                      <span>{title?.slice(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                  {item.vote_average > 0 && (
                    <span className="rating-badge">★ {item.vote_average?.toFixed(1)}</span>
                  )}
                  <span className={`media-type-badge ${item.media_type === 'movie' ? 'movie' : 'tv'}`}>
                    {item.media_type === 'movie' ? '🎬' : '📺'}
                  </span>
                  <div className="watchlist-remove-overlay">
                    <WatchlistButton item={item} size="small" />
                  </div>
                </div>
                <div className="watchlist-info">
                  <h3 className="watchlist-item-title" title={title}>{title}</h3>
                  {year && <p className="watchlist-item-year">{year}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Watchlist;

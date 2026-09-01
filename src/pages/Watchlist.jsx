import { useNavigate } from 'react-router-dom';
import { formatTitle } from '../utils/translateTitle';
import WatchlistButton from '../components/WatchlistButton';
import { useAuth } from '../context/AuthContext';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const Watchlist = () => {
  const navigate = useNavigate();
  const { watchlist, user, openAuthModal } = useAuth();

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
          {user
            ? `Synced with your account (${user.username})`
            : 'Saved locally in your browser (Sign in to sync across devices)'}
        </p>
        {!user && (
          <button
            type="button"
            className="watchlist-sync-btn"
            onClick={() => openAuthModal('register')}
            id="watchlist-sync-btn"
          >
            ☁️ Sign in to Sync to Cloud Database
          </button>
        )}
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
          {watchlist.map((item) => {
            const title = formatTitle(
              item.name || item.title,
              item.original_name || item.original_title
            ) || item.name || item.title || 'Untitled';
            const poster = item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null;
            const year = item.first_air_date || item.release_date
              ? new Date(item.first_air_date || item.release_date).getFullYear()
              : null;

            return (
              <div key={`${item.media_type || 'tv'}-${item.id}`} className="watchlist-card" onClick={() => handleCardClick(item)}>
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


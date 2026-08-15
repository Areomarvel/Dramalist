import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePoster } from '../utils/generatePoster';
import { formatTitle } from '../utils/translateTitle';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const SurpriseMeModal = ({ isOpen, onClose, dramas = [] }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  if (!isOpen) return null;

  const handlePickRandom = () => {
    if (!dramas.length) return;
    setIsSpinning(true);

    let count = 0;
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * dramas.length);
      setSelected(dramas[idx]);
      count++;
      if (count >= 10) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  const drama = selected || (dramas.length ? dramas[Math.floor(Math.random() * dramas.length)] : null);
  if (!drama) return null;

  const title = formatTitle(drama.name || drama.title, drama.original_name || drama.original_title);
  const poster = drama.poster_path
    ? `${IMAGE_BASE_URL}${drama.poster_path}`
    : generatePoster(title);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="surprise-modal-content" onClick={e => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>

        <div className="surprise-header">
          <span className="surprise-icon">🎲</span>
          <h3>Can't Decide? Surprise Pick!</h3>
          <p>Let AsianDramaWiki choose your next binge-watch</p>
        </div>

        <div className={`surprise-card ${isSpinning ? 'spinning' : ''}`}>
          <div className="surprise-poster-wrapper">
            <img src={poster} alt={title} />
            {drama.vote_average > 0 && (
              <span className="rating-badge">★ {drama.vote_average?.toFixed(1)}</span>
            )}
          </div>
          <div className="surprise-details">
            <h4 className="surprise-title">{title}</h4>
            <p className="surprise-overview">
              {drama.overview ? drama.overview.slice(0, 140) + '…' : 'No description available.'}
            </p>
          </div>
        </div>

        <div className="surprise-actions">
          <button
            type="button"
            className="surprise-reroll-btn"
            onClick={handlePickRandom}
            disabled={isSpinning}
          >
            🔄 Roll Again
          </button>
          <button
            type="button"
            className="surprise-watch-btn"
            onClick={() => {
              onClose();
              navigate(`/drama/${drama.id}`);
            }}
          >
            🎬 Watch Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurpriseMeModal;

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTitle } from '../utils/translateTitle';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const AUTO_ROTATE_MS = 10 * 60 * 1000;

const PersonalizedSection = ({ title, items = [], emptyMessage = 'No recommendations yet.', compact = false }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (items.length <= 1) return undefined;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, AUTO_ROTATE_MS);

    return () => clearInterval(timer);
  }, [items.length]);

  const visibleCount = compact ? 4 : 5;
  const visibleItems = items.length > visibleCount
    ? [...items.slice(currentIndex), ...items.slice(0, currentIndex)].slice(0, visibleCount)
    : items;

  const rotateBy = (direction) => {
    if (!items.length) return;
    setCurrentIndex(prev => (prev + direction + items.length) % items.length);
  };

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    if (touchStartX === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 40) {
      rotateBy(deltaX < 0 ? 1 : -1);
    }
    setTouchStartX(null);
  };

  if (!items.length) {
    return (
      <div className="personalized-section">
        <div className="section-header compact-header">
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="empty-mini-card">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="personalized-section">
      <div className="section-header compact-header">
        <h2 className="section-title">{title}</h2>
      </div>

      <div
        ref={trackRef}
        className={`mini-carousel ${compact ? 'compact' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {visibleItems.map((item, index) => {
          const safeTitle = formatTitle(item.name || item.title, item.original_name || item.original_title) || item.name || item.title || 'Untitled';
          const poster = item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null;
          const route = item.media_type === 'movie' ? `/movie/${item.id}` : `/drama/${item.id}`;

          return (
            <div
              key={`${item.media_type || 'tv'}-${item.id}-${index}`}
              className="mini-carousel-card"
              onClick={() => navigate(route)}
            >
              <div className="mini-carousel-poster">
                {poster ? (
                  <img src={poster} alt={safeTitle} loading="lazy" />
                ) : (
                  <div className="mini-carousel-placeholder">{safeTitle.slice(0, 2).toUpperCase()}</div>
                )}
                {item.vote_average > 0 && (
                  <span className="rating-badge">★ {item.vote_average.toFixed(1)}</span>
                )}
              </div>
              <p className="mini-carousel-title" title={safeTitle}>{safeTitle}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalizedSection;

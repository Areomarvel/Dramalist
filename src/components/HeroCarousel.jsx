import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTitle, hasEnglishTitle } from '../utils/translateTitle';
import { generatePoster } from '../utils/generatePoster';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w1280';
const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';

const HeroCarousel = ({ recentItems = [], upcomingItems = [] }) => {
  const navigate = useNavigate();
  const validRecent = recentItems.filter(hasEnglishTitle);
  const validUpcoming = upcomingItems.filter(hasEnglishTitle);

  const allItems = [
    ...validRecent.slice(0, 5).map(i => ({ ...i, _section: 'recent' })),
    ...validUpcoming.slice(0, 5).map(i => ({ ...i, _section: 'upcoming' })),
  ];

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);
  const [generatedPosters, setGeneratedPosters] = useState({});

  const goTo = useCallback((idx) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const next = useCallback(() => {
    if (!allItems.length) return;
    goTo((current + 1) % allItems.length);
  }, [current, allItems.length, goTo]);

  const prev = useCallback(() => {
    if (!allItems.length) return;
    goTo((current - 1 + allItems.length) % allItems.length);
  }, [current, allItems.length, goTo]);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  // Generate posters for items without images
  useEffect(() => {
    allItems.forEach(item => {
      if (!item.backdrop_path && !item.poster_path) {
        const title = item.name || item.title || 'Unknown';
        if (!generatedPosters[item.id]) {
          const url = generatePoster(title, 1280, 720);
          setGeneratedPosters(prev => ({ ...prev, [item.id]: url }));
        }
      }
    });
  }, [allItems.length]);

  if (!allItems.length) return null;

  const item = allItems[current];
  const backdropUrl = item.backdrop_path
    ? `${IMAGE_BASE}${item.backdrop_path}`
    : item.poster_path
    ? `${POSTER_BASE}${item.poster_path}`
    : generatedPosters[item.id] || null;

  const title = formatTitle(item.name || item.title, item.original_name || item.original_title);

  return (
    <div className="hero-carousel">
      <div className={`hero-backdrop ${isTransitioning ? 'transitioning' : ''}`}>
        {backdropUrl && (
          <img src={backdropUrl} alt={title} className="hero-backdrop-img" />
        )}
        <div className="hero-gradient-overlay"></div>
      </div>

      <div className="hero-content">
        <span className={`hero-badge ${item._section === 'recent' ? 'badge-recent' : 'badge-upcoming'}`}>
          {item._section === 'recent' ? '🎬 Recently Released' : '📅 Coming Soon'}
        </span>
        <h2 className="hero-title">{title}</h2>
        <p className="hero-overview">
          {item.overview ? item.overview.slice(0, 160) + '…' : 'No description available.'}
        </p>
        <div className="hero-meta">
          {item.vote_average > 0 && (
            <span className="hero-rating">⭐ {item.vote_average?.toFixed(1)}</span>
          )}
          <span className="hero-date">{item.first_air_date || item.release_date || ''}</span>
        </div>
        <button className="hero-cta" onClick={() => navigate(`/drama/${item.id}`)}>
          View Details →
        </button>
      </div>

      {/* Navigation Arrows */}
      <button className="hero-arrow hero-prev" onClick={prev} aria-label="Previous">
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" fill="currentColor"/></svg>
      </button>
      <button className="hero-arrow hero-next" onClick={next} aria-label="Next">
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" fill="currentColor"/></svg>
      </button>

      {/* Dot Indicators */}
      <div className="hero-dots">
        {allItems.map((_, idx) => (
          <button
            key={idx}
            className={`hero-dot ${idx === current ? 'active' : ''}`}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Section dividers */}
      {allItems.length > 5 && (
        <div className="hero-section-labels">
          <span className="label-recent">Recent (1-5)</span>
          <span className="label-upcoming">Upcoming (6-10)</span>
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;

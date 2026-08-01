import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTitle } from '../utils/translateTitle';
import { generatePoster } from '../utils/generatePoster';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w342';

const PopularCarousel = ({ items = [], label = 'Most Popular' }) => {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [generatedPosters, setGeneratedPosters] = useState({});
  const animRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);

  // Generate fallback posters
  useEffect(() => {
    items.forEach(item => {
      if (!item.poster_path) {
        const title = item.name || item.title || '';
        if (title && !generatedPosters[item.id]) {
          const url = generatePoster(title, 300, 450);
          setGeneratedPosters(prev => ({ ...prev, [item.id]: url }));
        }
      }
    });
  }, [items.length]);

  // Continuous scroll animation
  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    const speed = 0.6; // px per frame

    const animate = () => {
      if (!pausedRef.current && track) {
        posRef.current += speed;
        const halfWidth = track.scrollWidth / 2;
        if (posRef.current >= halfWidth) {
          posRef.current = 0;
        }
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [items.length]);

  if (!items.length) return null;

  // Duplicate items for seamless loop
  const displayItems = [...items, ...items];

  return (
    <div className="popular-carousel-wrapper">
      <h3 className="popular-carousel-label">🏆 {label}</h3>
      <div
        className="popular-carousel-container"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        <div className="popular-carousel-track" ref={trackRef}>
          {displayItems.map((item, idx) => {
            const posterUrl = item.poster_path
              ? `${POSTER_BASE}${item.poster_path}`
              : generatedPosters[item.id] || null;
            const title = formatTitle(item.name || item.title, item.original_name || item.original_title);

            return (
              <div
                key={`${item.id}-${idx}`}
                className="popular-card"
                onClick={() => navigate(`/drama/${item.id}`)}
                title={title}
              >
                {posterUrl ? (
                  <img src={posterUrl} alt={title} className="popular-card-img" />
                ) : (
                  <div className="popular-card-placeholder">{title.slice(0, 20)}</div>
                )}
                <div className="popular-card-info">
                  <p className="popular-card-title">{title}</p>
                  {item.vote_average > 0 && (
                    <span className="popular-card-rating">⭐ {item.vote_average?.toFixed(1)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularCarousel;

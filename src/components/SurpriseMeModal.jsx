import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePoster } from '../utils/generatePoster';
import { formatTitle } from '../utils/translateTitle';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '37f536bf16346bfc6cfcefca8f004b89';

const ASIAN_COUNTRIES = ['KR', 'CN', 'JP', 'TH', 'TW', 'HK', 'VN', 'PH', 'ID', 'MY'];

const SORT_OPTIONS = [
  'popularity.desc',
  'popularity.asc',
  'vote_average.desc',
  'vote_count.desc',
  'first_air_date.desc',
  'first_air_date.asc',
  'release_date.asc',
  'release_date.desc',
];

const CATEGORIES = [
  { id: 'any',   label: '🎲 All',      mediaType: 'any' },
  { id: 'drama', label: '📺 Dramas',   mediaType: 'tv' },
  { id: 'movie', label: '🎬 Movies',   mediaType: 'movie' },
  { id: 'retro', label: '🕰️ Classics', mediaType: 'any', retro: true },
];

const COUNTRY_FLAGS = {
  KR: '🇰🇷', CN: '🇨🇳', JP: '🇯🇵', TH: '🇹🇭', TW: '🇹🇼',
  HK: '🇭🇰', VN: '🇻🇳', PH: '🇵🇭', ID: '🇮🇩', MY: '🇲🇾',
};

const getCountryFlag = (item) => {
  const countries = item.origin_country || item.production_countries?.map(c => c.iso_3166_1) || [];
  for (const cc of countries) {
    if (COUNTRY_FLAGS[cc]) return COUNTRY_FLAGS[cc];
  }
  return '🌏';
};

async function fetchRandomAsianItem(category) {
  const page = Math.floor(Math.random() * 40) + 1;
  const country = ASIAN_COUNTRIES[Math.floor(Math.random() * ASIAN_COUNTRIES.length)];

  let sortBy;
  if (category.retro) {
    sortBy = ['first_air_date.asc', 'release_date.asc', 'vote_count.desc'][Math.floor(Math.random() * 3)];
  } else {
    sortBy = SORT_OPTIONS[Math.floor(Math.random() * SORT_OPTIONS.length)];
  }

  let mediaType = category.mediaType;
  if (mediaType === 'any') {
    mediaType = Math.random() > 0.5 ? 'tv' : 'movie';
  }

  const params = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    sort_by: sortBy,
    page: page.toString(),
    'vote_count.gte': '5',
    with_origin_country: country,
    include_adult: 'false',
  });

  if (category.retro) {
    if (mediaType === 'tv') {
      params.set('first_air_date.lte', '2018-12-31');
    } else {
      params.set('release_date.lte', '2018-12-31');
    }
  }

  const endpoint = mediaType === 'tv' ? 'discover/tv' : 'discover/movie';
  const res = await fetch(`${BASE_URL}/${endpoint}?${params.toString()}`);
  if (!res.ok) throw new Error('TMDB fetch failed');

  const data = await res.json();
  const results = data.results || [];
  if (!results.length) throw new Error('No results');

  const item = results[Math.floor(Math.random() * results.length)];
  return { ...item, _mediaType: mediaType };
}

const SurpriseMeModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [rollCount, setRollCount] = useState(0);

  const rollRandom = useCallback(async (cat) => {
    setLoading(true);
    setError(null);
    let attempts = 0;
    while (attempts < 5) {
      try {
        const item = await fetchRandomAsianItem(cat);
        setSelected(item);
        setRollCount(prev => prev + 1);
        setLoading(false);
        return;
      } catch {
        attempts++;
      }
    }
    setError('Could not find a result. Try again!');
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      rollRandom(activeCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeCategory]);

  if (!isOpen) return null;

  const drama = selected;
  const title = drama
    ? formatTitle(drama.name || drama.title, drama.original_name || drama.original_title)
    : '';
  const poster = drama?.poster_path
    ? `${IMAGE_BASE_URL}${drama.poster_path}`
    : drama ? generatePoster(title) : null;

  const mediaType = drama?._mediaType;
  const year = drama ? (drama.first_air_date || drama.release_date || '').slice(0, 4) : '';
  const flag = drama ? getCountryFlag(drama) : '';
  const rating = drama?.vote_average > 0 ? drama.vote_average.toFixed(1) : null;

  const handleWatchDetails = () => {
    if (!drama) return;
    onClose();
    navigate(mediaType === 'movie' ? `/movie/${drama.id}` : `/drama/${drama.id}`);
  };

  return (
    <div className="sm-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="sm-sheet" onClick={e => e.stopPropagation()}>

        {/* Top bar */}
        <div className="sm-topbar">
          <span className="sm-title-row">🎲 Surprise Pick!</span>
          <button type="button" className="sm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Category pills — single scrollable row */}
        <div className="sm-pills-row">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`sm-pill${activeCategory.id === cat.id ? ' sm-pill--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="sm-body">
          {loading ? (
            <div className="sm-loading">
              <div className="sm-spinner" />
              <p>Rolling the dice…</p>
            </div>
          ) : error ? (
            <div className="sm-error">
              <span>😅</span>
              <p>{error}</p>
            </div>
          ) : drama ? (
            <div className="sm-card">
              {/* Poster — full width banner */}
              <div className="sm-poster-wrap">
                <img src={poster} alt={title} loading="lazy" />
                {/* Gradient overlay at bottom */}
                <div className="sm-poster-gradient" />
                {/* Badges overlaid on poster */}
                <div className="sm-poster-badges">
                  <span className={`sm-type-badge ${mediaType === 'movie' ? 'sm-movie' : 'sm-drama'}`}>
                    {mediaType === 'movie' ? '🎬 Movie' : '📺 Drama'}
                  </span>
                  {rating && <span className="sm-rating-badge">★ {rating}</span>}
                </div>
              </div>

              {/* Info below poster */}
              <div className="sm-info">
                <div className="sm-meta">
                  <span className="sm-flag">{flag}</span>
                  {year && <span className="sm-year">{year}</span>}
                  {activeCategory.retro && year && parseInt(year) <= 2018 && (
                    <span className="sm-classic-badge">🕰️ Classic</span>
                  )}
                  {rollCount > 1 && (
                    <span className="sm-roll-count">🎲 ×{rollCount}</span>
                  )}
                </div>
                <h4 className="sm-drama-title">{title}</h4>
                <p className="sm-overview">
                  {drama.overview
                    ? drama.overview.slice(0, 160) + (drama.overview.length > 160 ? '…' : '')
                    : 'No description available.'}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Fixed bottom buttons */}
        <div className="sm-actions">
          <button
            type="button"
            className="sm-btn sm-btn--outline"
            onClick={() => rollRandom(activeCategory)}
            disabled={loading}
          >
            {loading ? '⏳ Rolling…' : '🔄 Roll Again'}
          </button>
          <button
            type="button"
            className="sm-btn sm-btn--primary"
            onClick={handleWatchDetails}
            disabled={loading || !drama}
          >
            🎬 Watch Details
          </button>
        </div>

      </div>
    </div>
  );
};

export default SurpriseMeModal;

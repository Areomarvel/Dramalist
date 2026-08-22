import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DramaCard from '../components/DramaCard';
import HeroCarousel from '../components/HeroCarousel';
import PopularCarousel from '../components/PopularCarousel';
import AdvancedFilterModal from '../components/AdvancedFilterModal';
import SurpriseMeModal from '../components/SurpriseMeModal';
import { hasEnglishTitle, formatTitle } from '../utils/translateTitle';
import { generatePoster } from '../utils/generatePoster';
import '../App.css';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const CATEGORIES = [
  { key: 'KR', label: '🇰🇷 K-Dramas', countryParam: 'with_origin_country=KR' },
  { key: 'CN', label: '🇨🇳 C-Dramas', countryParam: 'with_origin_country=CN' },
  { key: 'JP', label: '🇯🇵 J-Dramas', countryParam: 'with_origin_country=JP' },
  { key: 'TH', label: '🇹🇭 Thai',     countryParam: 'with_origin_country=TH' },
  { key: 'ANIME', label: '🌸 Anime',   countryParam: 'with_origin_country=JP&with_genres=16' },
  { key: 'CARTOON', label: '🎨 Cartoon', countryParam: 'with_genres=16&without_origin_country=JP|KR|CN|TH' },
];

const today = new Date().toISOString().split('T')[0];

function getQueryParams(cat) {
  switch (cat) {
    case 'KR': return 'with_origin_country=KR';
    case 'CN': return 'with_origin_country=CN';
    case 'JP': return 'with_origin_country=JP';
    case 'TH': return 'with_origin_country=TH';
    case 'ANIME': return 'with_origin_country=JP&with_genres=16';
    case 'CARTOON': return 'with_genres=16&without_origin_country=JP|KR|CN|TH';
    default: return 'with_origin_country=KR';
  }
}

function Home() {
  const navigate = useNavigate();
  const [dramas, setDramas] = useState([]);
  const [category, setCategory] = useState('KR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [carouselData, setCarouselData] = useState({});
  const [popularData, setPopularData] = useState({});
  const [airingNow, setAiringNow] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  const loadCarouselData = useCallback(async (cat) => {
    const base = getQueryParams(cat);
    try {
      const [recentRes1, recentRes2, upcomingRes1, upcomingRes2] = await Promise.all([
        fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&${base}&sort_by=first_air_date.desc&first_air_date.lte=${today}&page=1`),
        fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&${base}&sort_by=first_air_date.desc&first_air_date.lte=${today}&page=2`),
        fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&${base}&sort_by=first_air_date.asc&first_air_date.gte=${today}&page=1`),
        fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&${base}&sort_by=first_air_date.asc&first_air_date.gte=${today}&page=2`),
      ]);
      const [recentData1, recentData2, upcomingData1, upcomingData2] = await Promise.all([
        recentRes1.json(), recentRes2.json(), upcomingRes1.json(), upcomingRes2.json()
      ]);

      const allRecent = [...(recentData1.results || []), ...(recentData2.results || [])];
      const allUpcoming = [...(upcomingData1.results || []), ...(upcomingData2.results || [])];

      const validRecent = allRecent.filter(hasEnglishTitle).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      const validUpcoming = allUpcoming.filter(hasEnglishTitle).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

      setCarouselData(prev => ({
        ...prev,
        [cat]: { recent: validRecent.slice(0, 5), upcoming: validUpcoming.slice(0, 5) }
      }));
    } catch (err) {
      console.error('Carousel fetch error:', err);
    }
  }, []);

  const loadPopularData = useCallback(async (cat) => {
    const base = getQueryParams(cat);
    try {
      const res = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&${base}&sort_by=popularity.desc&page=1`);
      const data = await res.json();
      const validPopular = (data.results || []).filter(hasEnglishTitle);
      setPopularData(prev => ({ ...prev, [cat]: validPopular.slice(0, 20) }));
    } catch (err) {
      console.error('Popular fetch error:', err);
    }
  }, []);

  const loadAiringNow = useCallback(async (cat) => {
    const base = getQueryParams(cat);
    try {
      const res = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&${base}&sort_by=popularity.desc&with_status=0&air_date.gte=${today}&first_air_date.lte=${today}`);
      const data = await res.json();
      const valid = (data.results || []).filter(hasEnglishTitle).slice(0, 12);
      setAiringNow(valid);
    } catch (err) {
      console.error('Airing now fetch error:', err);
    }
  }, []);

  const loadDramasByCategory = useCallback(async (cat, pageNum = 1, reset = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    setError('');
    const base = getQueryParams(cat);
    try {
      const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&${base}&sort_by=first_air_date.desc&first_air_date.lte=${today}&page=${pageNum}`);
      const data = await response.json();
      if (!response.ok || !data.results) throw new Error(data.status_message || 'Unable to load content');
      const validDramas = (data.results || []).filter(hasEnglishTitle);
      if (reset || pageNum === 1) {
        setDramas(validDramas);
      } else {
        setDramas(prev => [...prev, ...validDramas]);
      }
      setHasMore(pageNum < (data.total_pages || 1));
    } catch (fetchError) {
      console.error('Fetch Error:', fetchError);
      setError('Unable to load content. Please check your connection.');
      if (reset) setDramas([]);
    }
    setLoading(false);
    setLoadingMore(false);
  }, []);

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadDramasByCategory(category, 1, true);
  }, [category, loadDramasByCategory]);

  useEffect(() => {
    if (!carouselData[category]) loadCarouselData(category);
    if (!popularData[category]) loadPopularData(category);
    loadAiringNow(category);
  }, [category, carouselData, popularData, loadCarouselData, loadPopularData, loadAiringNow]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadDramasByCategory(category, nextPage, false);
  };

  const currentCategory = CATEGORIES.find(c => c.key === category);
  const carouselInfo = carouselData[category] || { recent: [], upcoming: [] };
  const popularList = popularData[category] || [];

  return (
    <div className="app-container">

      {/* Category Filter Tabs */}
      <div className="filter-container">
        <div className="filter-categories-left">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              className={`filter-btn ${category === cat.key ? 'active' : ''}`}
              onClick={() => setCategory(cat.key)}
              id={`filter-${cat.key.toLowerCase()}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="filter-actions-right">
          <button
            type="button"
            className="filter-btn surprise-me-btn"
            onClick={() => setIsSurpriseOpen(true)}
          >
            🎲 Surprise Me
          </button>
          <button
            type="button"
            className="filter-btn advanced-filter-btn"
            onClick={() => setIsFilterModalOpen(true)}
          >
            🎛️ Filters
          </button>
        </div>
      </div>

      <AdvancedFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={appliedFilters}
        onApplyFilters={(f) => setAppliedFilters(f)}
      />

      <SurpriseMeModal
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
        dramas={dramas}
      />

      {/* Hero Carousel: Recent + Upcoming */}
      {(carouselInfo.recent.length > 0 || carouselInfo.upcoming.length > 0) && (
        <HeroCarousel
          recentItems={carouselInfo.recent}
          upcomingItems={carouselInfo.upcoming}
        />
      )}

      {/* Popular Carousel */}
      {popularList.length > 0 && (
        <PopularCarousel
          items={popularList}
          label={`Most Popular ${currentCategory?.label || ''}`}
        />
      )}

      {/* Now Airing Section */}
      {airingNow.length > 0 && (
        <div className="now-airing-section">
          <div className="section-header" style={{ marginBottom: '16px' }}>
            <h2 className="section-title">
              📡 Now Airing — {currentCategory?.label}
            </h2>
            <span className="now-airing-status-tag">Airing This Week</span>
          </div>
          <div className="now-airing-scroll">
            {airingNow.map(item => {
              const formattedTitle = formatTitle(item.name, item.original_name);
              const poster = item.poster_path
                ? `${IMAGE_BASE_URL}${item.poster_path}`
                : generatePoster(item.name || item.original_name || 'Drama');
              return (
                <div
                  key={item.id}
                  className="now-airing-card"
                  onClick={() => navigate(`/drama/${item.id}`)}
                >
                  <div className="now-airing-poster">
                    <img src={poster} alt={formattedTitle} loading="lazy" />
                    {item.vote_average > 0 && (
                      <span className="rating-badge">★ {item.vote_average?.toFixed(1)}</span>
                    )}
                  </div>
                  <div className="now-airing-info">
                    <p className="now-airing-title" title={formattedTitle}>{formattedTitle}</p>
                    <span className="now-airing-subtext">On Air</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section Title */}
      <div className="section-header">
        <h2 className="section-title">
          Latest {currentCategory?.label}
        </h2>
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <div className="grid-skeleton">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-img"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="drama-grid">
            {dramas.length > 0 ? (
              dramas.map((drama) => <DramaCard key={drama.id} drama={drama} />)
            ) : (
              <p className="no-content-msg">No dramas found. Try a different category.</p>
            )}
          </div>

          {/* Load More */}
          {hasMore && dramas.length > 0 && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={loadingMore}
                id="load-more-dramas"
              >
                {loadingMore ? 'Loading…' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;

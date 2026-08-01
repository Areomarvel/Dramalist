import React, { useState, useEffect } from 'react';
import DramaCard from '../components/DramaCard';
import HeroCarousel from '../components/HeroCarousel';
import PopularCarousel from '../components/PopularCarousel';
import '../App.css';

const API_KEY = '37f536bf16346bfc6cfcefca8f004b89';
const BASE_URL = 'https://api.themoviedb.org/3';

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
  const [dramas, setDramas] = useState([]);
  const [category, setCategory] = useState('KR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Carousel state per category
  const [carouselData, setCarouselData] = useState({});
  const [popularData, setPopularData] = useState({});

  // Load main grid
  useEffect(() => {
    loadDramasByCategory(category);
  }, [category]);

  // Load carousel data when category changes
  useEffect(() => {
    if (!carouselData[category]) {
      loadCarouselData(category);
    }
    if (!popularData[category]) {
      loadPopularData(category);
    }
  }, [category]);

  const loadCarouselData = async (cat) => {
    const base = getQueryParams(cat);
    try {
      const [recentRes, upcomingRes] = await Promise.all([
        fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&${base}&sort_by=first_air_date.desc&first_air_date.lte=${today}&page=1`),
        fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&${base}&sort_by=first_air_date.asc&first_air_date.gte=${today}&page=1`),
      ]);
      const [recentData, upcomingData] = await Promise.all([recentRes.json(), upcomingRes.json()]);
      setCarouselData(prev => ({
        ...prev,
        [cat]: {
          recent: (recentData.results || []).slice(0, 5),
          upcoming: (upcomingData.results || []).slice(0, 5),
        }
      }));
    } catch (err) {
      console.error('Carousel fetch error:', err);
    }
  };

  const loadPopularData = async (cat) => {
    const base = getQueryParams(cat);
    try {
      const res = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&${base}&sort_by=popularity.desc&page=1`);
      const data = await res.json();
      setPopularData(prev => ({
        ...prev,
        [cat]: (data.results || []).slice(0, 20),
      }));
    } catch (err) {
      console.error('Popular fetch error:', err);
    }
  };

  const loadDramasByCategory = async (cat) => {
    setLoading(true);
    setError('');
    const base = getQueryParams(cat);
    try {
      const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&${base}&sort_by=first_air_date.desc&first_air_date.lte=${today}`);
      const data = await response.json();
      if (!response.ok || !data.results) {
        throw new Error(data.status_message || 'Unable to load content');
      }
      setDramas(data.results || []);
    } catch (fetchError) {
      console.error('Fetch Error:', fetchError);
      setError('Unable to load content. Please check your connection.');
      setDramas([]);
    }
    setLoading(false);
  };

  const currentCategory = CATEGORIES.find(c => c.key === category);
  const carouselInfo = carouselData[category] || { recent: [], upcoming: [] };
  const popularList = popularData[category] || [];

  return (
    <div className="app-container">

      {/* Category Filter Tabs */}
      <div className="filter-container">
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
        <div className="drama-grid">
          {dramas.length > 0 ? (
            dramas.map((drama) => <DramaCard key={drama.id} drama={drama} />)
          ) : (
            <p className="no-content-msg">No dramas found. Try a different category.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;

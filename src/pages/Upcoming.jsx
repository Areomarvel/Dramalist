import { useEffect, useState, useCallback } from 'react';
import DramaCard from '../components/DramaCard';
import { hasEnglishTitle } from '../utils/translateTitle';

const API_KEY = "37f536bf16346bfc6cfcefca8f004b89";
const BASE_URL = "https://api.themoviedb.org/3";

const CATEGORIES = [
  { key: 'KR', label: '🇰🇷 K-Dramas' },
  { key: 'CN', label: '🇨🇳 C-Dramas' },
  { key: 'JP', label: '🇯🇵 J-Dramas' },
  { key: 'TH', label: '🇹🇭 Thai' },
  { key: 'ANIME', label: '🌸 Anime' },
  { key: 'CARTOON', label: '🎨 Cartoon' },
];

function getQueryParams(cat) {
  const today = new Date().toISOString().split('T')[0];
  const base = `&sort_by=first_air_date.asc&first_air_date.gte=${today}`;
  switch (cat) {
    case 'KR': return `with_origin_country=KR${base}`;
    case 'CN': return `with_origin_country=CN${base}`;
    case 'JP': return `with_origin_country=JP${base}`;
    case 'TH': return `with_origin_country=TH${base}`;
    case 'ANIME': return `with_origin_country=JP&with_genres=16${base}`;
    case 'CARTOON': return `with_genres=16&without_origin_country=JP|KR|CN|TH${base}`;
    default: return `with_origin_country=KR${base}`;
  }
}

const Upcoming = () => {
  const [dramas, setDramas] = useState([]);
  const [category, setCategory] = useState('KR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUpcomingByCategory = useCallback(async (cat) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&${getQueryParams(cat)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.status_message || "Failed to fetch upcoming content");
      const valid = (data.results || []).filter(hasEnglishTitle);
      setDramas(valid);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUpcomingByCategory(category);
  }, [category, loadUpcomingByCategory]);

  return (
    <div className="app-container">
      <div className="page-hero-header">
        <h1>📅 Upcoming &amp; Airing Soon</h1>
        <p className="detail-overview">Discover the latest and upcoming content hitting the screens!</p>
      </div>

      <div className="filter-container">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            className={`filter-btn ${category === cat.key ? 'active' : ''}`}
            onClick={() => setCategory(cat.key)}
            id={`upcoming-filter-${cat.key.toLowerCase()}`}
          >
            {cat.label}
          </button>
        ))}
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
            dramas.map(drama => <DramaCard key={drama.id} drama={drama} />)
          ) : (
            <div className="no-content-msg">
              <p>No upcoming content found for this category at the moment.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Upcoming;

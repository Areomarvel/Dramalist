import React, { useEffect, useState } from 'react';
import DramaCard from '../components/DramaCard';

const API_KEY = "37f536bf16346bfc6cfcefca8f004b89";
const BASE_URL = "https://api.themoviedb.org/3";

const Upcoming = () => {
  const [dramas, setDramas] = useState([]);
  const [category, setCategory] = useState('KR');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUpcomingByCategory(category);
  }, [category]);

  const loadUpcomingByCategory = async (cat) => {
    setLoading(true);
    setError(null);

    let queryParams = '';
    // Upcoming logic: air date is in the future
    const baseQuery = `&sort_by=first_air_date.asc&first_air_date.gte=${new Date().toISOString().split('T')[0]}`;

    switch (cat) {
      case 'KR':
        queryParams = `with_origin_country=KR${baseQuery}`;
        break;
      case 'CN':
        queryParams = `with_origin_country=CN${baseQuery}`;
        break;
      case 'JP':
        queryParams = `with_origin_country=JP${baseQuery}`;
        break;
      case 'TH':
        queryParams = `with_origin_country=TH${baseQuery}`;
        break;
      case 'ANIME':
        queryParams = `with_origin_country=JP&with_genres=16${baseQuery}`;
        break;
      case 'CARTOON':
        queryParams = `with_genres=16&without_origin_country=JP|KR|CN|TH${baseQuery}`;
        break;
      default:
        queryParams = `with_origin_country=KR${baseQuery}`;
    }

    try {
      const res = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&${queryParams}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.status_message || "Failed to fetch upcoming content");
      setDramas(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h2>Upcoming & Airing Soon</h2>
      <p className="detail-overview">Discover the latest and upcoming content hitting the screens!</p>
      
      <div className="filter-container">
        <button className={`filter-btn ${category === 'KR' ? 'active' : ''}`} onClick={() => setCategory('KR')}>
          🇰🇷 K-Dramas
        </button>
        <button className={`filter-btn ${category === 'CN' ? 'active' : ''}`} onClick={() => setCategory('CN')}>
          🇨🇳 C-Dramas
        </button>
        <button className={`filter-btn ${category === 'JP' ? 'active' : ''}`} onClick={() => setCategory('JP')}>
          🇯🇵 J-Dramas
        </button>
        <button className={`filter-btn ${category === 'TH' ? 'active' : ''}`} onClick={() => setCategory('TH')}>
          🇹🇭 Thai
        </button>
        <button className={`filter-btn ${category === 'ANIME' ? 'active' : ''}`} onClick={() => setCategory('ANIME')}>
          🌸 Anime
        </button>
        <button className={`filter-btn ${category === 'CARTOON' ? 'active' : ''}`} onClick={() => setCategory('CARTOON')}>
          🎨 Cartoon
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
      
      {loading ? (
        <h2>Loading upcoming content...</h2>
      ) : (
        <div className="drama-grid">
          {dramas.length > 0 ? (
            dramas.map(drama => <DramaCard key={drama.id} drama={drama} />)
          ) : (
            <p>No upcoming content found for this category at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Upcoming;

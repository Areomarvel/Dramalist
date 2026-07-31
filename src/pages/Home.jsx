import React, { useState, useEffect } from 'react';
import DramaCard from '../components/DramaCard';
import '../App.css';

const API_KEY = '37f536bf16346bfc6cfcefca8f004b89';
const BASE_URL = 'https://api.themoviedb.org/3';

function Home() {
  const [dramas, setDramas] = useState([]);
  const [category, setCategory] = useState('KR');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDramasByCategory(category);
  }, [category]);

  const loadDramasByCategory = async (cat) => {
    setLoading(true);
    setError('');

    let queryParams = '';
    // Fetch latest (first_air_date.desc) for all these categories
    const baseQuery = `&sort_by=first_air_date.desc&first_air_date.lte=${new Date().toISOString().split('T')[0]}`;

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
      const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&${queryParams}`);
      const data = await response.json();

      if (!response.ok || !data.results) {
        throw new Error(data.status_message || 'Unable to load content');
      }

      setDramas(data.results || []);
    } catch (fetchError) {
      console.error('Fetch Error:', fetchError);
      setError('Unable to load content. Please check your network connection or API key.');
      setDramas([]);
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
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
        <h2>Loading content from the API...</h2>
      ) : (
        <div className="drama-grid">
          {dramas.length > 0 ? (
            dramas.map((drama) => <DramaCard key={drama.id} drama={drama} />)
          ) : (
            <p>No dramas found. Try a different category.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;

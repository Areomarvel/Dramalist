import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DramaCard from '../components/DramaCard';

const API_KEY = "37f536bf16346bfc6cfcefca8f004b89";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const SearchResults = () => {
  const [results, setResults] = useState({ dramas: [], people: [] });
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        
        if (data.results) {
          const dramas = data.results.filter(item => item.media_type === 'tv' || item.media_type === 'movie');
          const people = data.results.filter(item => item.media_type === 'person');
          setResults({ dramas, people });
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) return <div className="app-container"><h2>Searching...</h2></div>;

  return (
    <div className="app-container">
      <h2>Search Results for "{query}"</h2>
      
      {results.dramas.length === 0 && results.people.length === 0 && (
        <p>No results found.</p>
      )}

      {results.dramas.length > 0 && (
        <div className="search-section">
          <h3>Dramas & Movies</h3>
          <div className="drama-grid">
            {results.dramas.map(item => (
              <DramaCard key={item.id} drama={item} />
            ))}
          </div>
        </div>
      )}

      {results.people.length > 0 && (
        <div className="search-section" style={{ marginTop: '40px' }}>
          <h3>Actors & Cast</h3>
          <div className="cast-grid" style={{ flexWrap: 'wrap', overflowX: 'visible' }}>
            {results.people.map(person => (
              <div key={person.id} className="cast-card" onClick={() => navigate(`/person/${person.id}`)}>
                <img 
                  src={person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : "https://via.placeholder.com/300x450?text=No+Photo"} 
                  alt={person.name} 
                />
                <h4>{person.name}</h4>
                <p>{person.known_for_department}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

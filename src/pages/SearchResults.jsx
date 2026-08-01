import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DramaCard from '../components/DramaCard';
import { formatTitle } from '../utils/translateTitle';

const API_KEY = "37f536bf16346bfc6cfcefca8f004b89";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const SearchResults = () => {
  const [results, setResults] = useState({ dramas: [], people: [] });
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';

  useEffect(() => {
    if (!query) { setLoading(false); return; }

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

  if (loading) return null; // LoadingScreen in App.jsx handles this

  return (
    <div className="app-container">
      <h2 className="search-results-heading">
        Search Results for <span className="search-query-highlight">"{query}"</span>
      </h2>

      {results.dramas.length === 0 && results.people.length === 0 && !loading && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <p>No results found for "{query}"</p>
          <p className="no-results-hint">Try different keywords or check spelling</p>
        </div>
      )}

      {results.dramas.length > 0 && (
        <div className="search-section">
          <h3>Dramas &amp; Movies</h3>
          <div className="drama-grid">
            {results.dramas.map(item => (
              <DramaCard key={item.id} drama={item} />
            ))}
          </div>
        </div>
      )}

      {results.people.length > 0 && (
        <div className="search-section" style={{ marginTop: '40px' }}>
          <h3>Actors &amp; Cast</h3>
          <div className="cast-grid" style={{ flexWrap: 'wrap', overflowX: 'visible' }}>
            {results.people.map(person => {
              const displayName = formatTitle(person.name, person.name);
              return (
                <div
                  key={person.id}
                  className="cast-card"
                  onClick={() => navigate(`/person/${person.id}`)}
                >
                  {person.profile_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}${person.profile_path}`}
                      alt={displayName}
                      loading="lazy"
                    />
                  ) : (
                    <div className="cast-photo-placeholder">
                      <span>{person.name?.charAt(0)}</span>
                    </div>
                  )}
                  <h4>{displayName}</h4>
                  <p>{person.known_for_department}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

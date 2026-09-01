import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DramaCard from '../components/DramaCard';
import LoadingScreen from '../components/LoadingScreen';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "37f536bf16346bfc6cfcefca8f004b89";
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState({ dramas: [], people: [] });
  const [loading, setLoading] = useState(false);
  const [localQuery, setLocalQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Multi search with English language
        const multiRes = await fetch(
          `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&include_adult=false`
        );
        const multiData = await multiRes.json();

        let dramas = [];
        let people = [];

        if (multiData.results) {
          dramas = multiData.results.filter(item => item.media_type === 'tv' || item.media_type === 'movie');
          people = multiData.results.filter(item => item.media_type === 'person');
        }

        // If multi search returns few drama results, search TV specifically for extra matches
        if (dramas.length < 4) {
          const tvRes = await fetch(
            `${BASE_URL}/search/tv?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}`
          );
          const tvData = await tvRes.json();
          if (tvData.results && tvData.results.length > 0) {
            const existingIds = new Set(dramas.map(d => d.id));
            tvData.results.forEach(item => {
              if (!existingIds.has(item.id)) {
                dramas.push({ ...item, media_type: 'tv' });
                existingIds.add(item.id);
              }
            });
          }
        }

        setResults({ dramas, people });
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleLocalSearch = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  if (loading) {
    return <LoadingScreen message={`Searching for "${query}"…`} />;
  }

  // Empty state — no query param
  if (!query) {
    return (
      <div className="app-container">
        <div className="search-empty-state">
          <div className="search-empty-icon">🔍</div>
          <h2 className="search-empty-title">Search DramaInfo</h2>
          <p className="search-empty-sub">Find your favourite dramas, movies, and actors</p>
          <form className="search-empty-form" onSubmit={handleLocalSearch}>
            <input
              type="text"
              className="search-empty-input"
              placeholder="e.g. Crash Landing on You, Lee Min Ho…"
              value={localQuery}
              onChange={e => setLocalQuery(e.target.value)}
              autoFocus
              id="search-empty-input"
            />
            <button type="submit" className="search-empty-btn" id="search-empty-submit">Search</button>
          </form>
          <div className="search-suggestions">
            <p className="search-suggestions-label">Popular searches:</p>
            <div className="search-suggestion-chips">
              {['Squid Game', 'Crash Landing on You', 'My Demon', 'Alice in Borderland', 'Lee Min Ho'].map(s => (
                <button
                  key={s}
                  className="search-chip"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h2 className="search-results-heading">
        Search Results for <span className="search-query-highlight">"{query}"</span>
      </h2>

      {results.dramas.length === 0 && results.people.length === 0 && !loading && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <p>No results found for "{query}"</p>
          <p className="no-results-hint">Try checking spelling or using different keywords</p>
        </div>
      )}

      {results.dramas.length > 0 && (
        <div className="search-section">
          <h3>Dramas &amp; Movies ({results.dramas.length})</h3>
          <div className="drama-grid">
            {results.dramas.map(item => (
              <DramaCard key={`${item.media_type || 'tv'}-${item.id}`} drama={item} />
            ))}
          </div>
        </div>
      )}

      {results.people.length > 0 && (
        <div className="search-section" style={{ marginTop: '40px' }}>
          <h3>Actors &amp; Cast ({results.people.length})</h3>
          <div className="cast-grid" style={{ flexWrap: 'wrap', overflowX: 'visible' }}>
            {results.people.map(person => (
              <div
                key={person.id}
                className="cast-card"
                onClick={() => navigate(`/person/${person.id}`)}
              >
                {person.profile_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}${person.profile_path}`}
                    alt={person.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="cast-photo-placeholder">
                    <span>{person.name?.charAt(0)}</span>
                  </div>
                )}
                <h4>{person.name}</h4>
                <p>{person.known_for_department || 'Actor'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;


import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DramaCard from '../components/DramaCard';
import LoadingScreen from '../components/LoadingScreen';
import { hasEnglishTitle } from '../utils/translateTitle';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '37f536bf16346bfc6cfcefca8f004b89';
const BASE_URL = 'https://api.themoviedb.org/3';

const COUNTRY_LABELS = {
  KR: 'South Korea',
  CN: 'China',
  JP: 'Japan',
  TH: 'Thailand',
};

const GENRE_LABELS = {
  '16': 'Anime',
  '18': 'Drama',
  '35': 'Comedy',
  '10759': 'Action',
  '10765': 'Sci-Fi',
  '9648': 'Mystery',
  '10768': 'Politics',
  '10749': 'Romance',
};

function getQueryString(filters = {}) {
  const params = new URLSearchParams();

  if (filters.country) params.set('with_origin_country', filters.country);
  if (filters.genre) params.set('with_genres', filters.genre);
  if (filters.minRating > 0) params.set('vote_average.gte', String(filters.minRating));
  if (filters.startYear) params.set('first_air_date.gte', `${filters.startYear}-01-01`);

  return params.toString();
}

function FilteredResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const filters = useMemo(() => ({
    country: searchParams.get('country') || '',
    genre: searchParams.get('genre') || '',
    minRating: Number(searchParams.get('minRating') || 0),
    startYear: searchParams.get('startYear') || '',
  }), [searchParams]);

  useEffect(() => {
    setPage(1);
    setResults([]);
    setHasMore(true);
  }, [filters.country, filters.genre, filters.minRating, filters.startYear]);

  useEffect(() => {
    const query = getQueryString(filters);

    const fetchFilteredResults = async (pageNum = 1, append = false) => {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      setError('');

      try {
        const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&${query}&sort_by=first_air_date.desc&page=${pageNum}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || !data.results) {
          throw new Error(data.status_message || 'Unable to load filtered results.');
        }

        const validResults = (data.results || []).filter(hasEnglishTitle);

        setResults(prev => append ? [...prev, ...validResults] : validResults);
        setHasMore(pageNum < (data.total_pages || 1));
      } catch (err) {
        console.error('Filtered results fetch error:', err);
        setError(err.message || 'Unable to load filtered results.');
        if (!append) setResults([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    if (Object.values(filters).every(value => !value || value === 0)) {
      setResults([]);
      setLoading(false);
      setError('No filters selected. Please choose one or more filters.');
      return;
    }

    fetchFilteredResults(page, page > 1);
  }, [filters, page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const filterSummary = [
    filters.country ? COUNTRY_LABELS[filters.country] || 'Country' : null,
    filters.genre ? GENRE_LABELS[filters.genre] || 'Genre' : null,
    filters.minRating ? `Rating ${filters.minRating}+` : null,
    filters.startYear ? `From ${filters.startYear}` : null,
  ].filter(Boolean);

  if (loading) {
    return <LoadingScreen message="Loading filtered results…" />;
  }

  return (
    <div className="app-container">
      <div className="section-header" style={{ marginBottom: '20px' }}>
        <h2 className="section-title">🎛️ Filtered Results</h2>
        {filterSummary.length > 0 && (
          <span className="now-airing-status-tag" style={{ marginLeft: 'auto' }}>
            {filterSummary.join(' • ')}
          </span>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      {!error && results.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🎬</div>
          <p>No dramas match your selected filters.</p>
          <button
            type="button"
            className="search-empty-btn"
            onClick={() => navigate('/')}
            style={{ marginTop: '14px' }}
          >
            Browse Home
          </button>
        </div>
      )}

      {results.length > 0 && (
        <>
          <p className="search-empty-sub" style={{ marginBottom: '18px' }}>
            {results.length} title{results.length === 1 ? '' : 's'} found
          </p>
          <div className="drama-grid">
            {results.map((drama) => (
              <DramaCard key={drama.id} drama={drama} />
            ))}
          </div>

          {hasMore && (
            <div className="load-more-container">
              <button
                type="button"
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={loadingMore}
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

export default FilteredResults;

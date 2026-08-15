import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import ReactionBox from '../components/ReactionBox';
import ShareButton from '../components/ShareButton';
import Breadcrumbs from '../components/Breadcrumbs';
import { generatePoster } from '../utils/generatePoster';
import { formatTitle, hasEnglishTitle } from '../utils/translateTitle';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const PersonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tv');
  const [showAllTV, setShowAllTV] = useState(false);
  const [showAllMovies, setShowAllMovies] = useState(false);
  const [generatedPosters, setGeneratedPosters] = useState({});

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await fetch(`${BASE_URL}/person/${id}?api_key=${API_KEY}&append_to_response=combined_credits,external_ids`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.status_message || 'Failed to fetch person details');
        setPerson(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPerson();
  }, [id]);

  if (error) return <div className="app-container"><h2>Error: {error}</h2><button className="back-btn" onClick={() => navigate(-1)}>Go Back</button></div>;
  if (!person) return null;

  const profilePath = person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : null;

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const instagramUrl = person.external_ids?.instagram_id
    ? `https://instagram.com/${person.external_ids.instagram_id}`
    : null;

  const getReleaseTime = (item) => {
    const dateStr = item.first_air_date || item.release_date;
    return dateStr ? new Date(dateStr).getTime() : 0;
  };

  const allCredits = person.combined_credits?.cast || [];
  const tvCredits = allCredits
    .filter(c => c.media_type === 'tv')
    .filter(hasEnglishTitle)
    .sort((a, b) => getReleaseTime(b) - getReleaseTime(a));
  const movieCredits = allCredits
    .filter(c => c.media_type === 'movie')
    .filter(hasEnglishTitle)
    .sort((a, b) => getReleaseTime(b) - getReleaseTime(a));

  const INITIAL_SHOW = 12;
  const displayedTV = showAllTV ? tvCredits : tvCredits.slice(0, INITIAL_SHOW);
  const displayedMovies = showAllMovies ? movieCredits : movieCredits.slice(0, INITIAL_SHOW);

  const getGeneratedPoster = (credit) => {
    const title = credit.name || credit.title || '';
    if (!generatedPosters[credit.credit_id]) {
      const url = generatePoster(title, 300, 450);
      setGeneratedPosters(prev => ({ ...prev, [credit.credit_id]: url }));
      return url;
    }
    return generatedPosters[credit.credit_id];
  };

  return (
    <div className="app-container detail-page">
      <Breadcrumbs items={[{ label: 'Actors & Cast', to: '/' }, { label: person.name }]} />
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-header">
        {profilePath ? (
          <img src={profilePath} alt={person.name} className="detail-poster person-photo" />
        ) : (
          <div className="person-photo-placeholder">
            <span>{person.name?.charAt(0)}</span>
          </div>
        )}

        <div className="detail-info">
          <div className="detail-title-row">
            <h1 className="detail-title">{person.name}</h1>
            <div className="detail-title-actions">
              <ShareButton title={person.name} text={`Check out ${person.name} on AsianDramaWiki!`} />
            </div>
          </div>

          <div className="person-stats-row">
            {person.known_for_department && (
              <span className="person-dept-badge">{person.known_for_department}</span>
            )}
            {tvCredits.length > 0 && (
              <span className="person-credit-count">📺 {tvCredits.length} TV Shows</span>
            )}
            {movieCredits.length > 0 && (
              <span className="person-credit-count">🎬 {movieCredits.length} Movies</span>
            )}
          </div>

          <div className="detail-metadata">
            <p>
              <strong>Date of Birth:</strong>{' '}
              {person.birthday || 'N/A'}
              {person.birthday && ` (${calculateAge(person.birthday)} years old)`}
            </p>
            <p><strong>Birthplace:</strong> {person.place_of_birth || 'N/A'}</p>
            {instagramUrl && (
              <p>
                <strong>Instagram:</strong>{' '}
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="instagram-link">
                  @{person.external_ids.instagram_id}
                </a>
              </p>
            )}
          </div>

          {person.biography && (
            <div className="person-biography">
              <h3>Biography</h3>
              <p>{person.biography}</p>
            </div>
          )}

          <ReactionBox targetId={person.id} type="person" />
        </div>
      </div>

      {/* Filmography Tabs */}
      <div className="filmography-section">
        <h2>Complete Filmography</h2>
        <div className="filmography-tabs">
          <button
            className={`tab-btn ${activeTab === 'tv' ? 'active' : ''}`}
            onClick={() => setActiveTab('tv')}
            id="tab-tv"
          >
            📺 TV Shows ({tvCredits.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveTab('movies')}
            id="tab-movies"
          >
            🎬 Movies ({movieCredits.length})
          </button>
        </div>

        <div className="filmography-grid">
          {(activeTab === 'tv' ? displayedTV : displayedMovies).map(credit => {
            const posterUrl = credit.poster_path
              ? `${IMAGE_BASE_URL}${credit.poster_path}`
              : getGeneratedPoster(credit);
            const title = formatTitle(
              credit.name || credit.title,
              credit.original_name || credit.original_title
            );
            return (
              <div
                key={credit.credit_id || credit.id}
                className="filmography-card"
                onClick={() => navigate(
                  credit.media_type === 'tv' ? `/drama/${credit.id}` : `/movie/${credit.id}`
                )}
              >
                <div className="filmography-poster">
                  <img src={posterUrl} alt={title} loading="lazy" />
                  {credit.vote_average > 0 && (
                    <span className="rating-badge">★ {credit.vote_average?.toFixed(1)}</span>
                  )}
                </div>
                <div className="filmography-info">
                  <h4 className="filmography-title" title={title}>{title}</h4>
                  {credit.character && (
                    <p className="filmography-character">as {credit.character}</p>
                  )}
                  {(credit.first_air_date || credit.release_date) && (
                    <p className="filmography-year">
                      {new Date(credit.first_air_date || credit.release_date).getFullYear()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More */}
        {activeTab === 'tv' && tvCredits.length > INITIAL_SHOW && !showAllTV && (
          <button className="load-more-btn" onClick={() => setShowAllTV(true)} id="load-more-tv">
            Show All {tvCredits.length} TV Shows
          </button>
        )}
        {activeTab === 'movies' && movieCredits.length > INITIAL_SHOW && !showAllMovies && (
          <button className="load-more-btn" onClick={() => setShowAllMovies(true)} id="load-more-movies">
            Show All {movieCredits.length} Movies
          </button>
        )}
      </div>

      <div className="comments-section-wrapper">
        <CommentSection targetId={person.id} type="person" />
      </div>
    </div>
  );
};

export default PersonDetail;

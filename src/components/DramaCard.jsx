import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTitle } from '../utils/translateTitle';
import { generatePoster } from '../utils/generatePoster';

const API_KEY = "37f536bf16346bfc6cfcefca8f004b89";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const DramaCard = ({ drama = {} }) => {
  const [cast, setCast] = useState([]);
  const [generatedPoster, setGeneratedPoster] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!drama.id) return;
    const fetchCast = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${drama.id}/credits?api_key=${API_KEY}&language=en-US`
        );
        const data = await res.json();
        setCast((data.cast || []).slice(0, 3));
      } catch (err) {
        console.error("Cast error:", err);
      }
    };
    fetchCast();
  }, [drama.id]);

  // Generate poster if none available
  useEffect(() => {
    if (!drama.poster_path && drama.id) {
      const title = drama.name || drama.title || 'Unknown';
      const url = generatePoster(title);
      setGeneratedPoster(url);
    }
  }, [drama.id, drama.poster_path]);

  if (!drama.id) return null;

  const posterPath = drama.poster_path
    ? `${IMAGE_BASE_URL}${drama.poster_path}`
    : generatedPoster || null;

  const title = formatTitle(
    drama.name || drama.title,
    drama.original_name || drama.original_title
  );

  if (!title) return null;

  return (
    <div className="drama-card" onClick={() => navigate(`/drama/${drama.id}`)}>
      <div className="poster-wrapper">
        {posterPath ? (
          <img
            src={posterPath}
            alt={title}
            className="poster-img"
            loading="lazy"
          />
        ) : (
          <div className="poster-placeholder">
            <span>{(drama.name || drama.title || '?').slice(0, 2).toUpperCase()}</span>
          </div>
        )}
        {drama.vote_average > 0 && (
          <span className="rating-badge">★ {drama.vote_average?.toFixed(1)}</span>
        )}
        {drama.first_air_date && (
          <span className="year-badge">
            {new Date(drama.first_air_date).getFullYear()}
          </span>
        )}
        <div className="card-hover-overlay">
          <span className="view-details-btn">View Details</span>
        </div>
      </div>
      <div className="card-details">
        <h3 className="drama-title" title={title}>{title}</h3>
        <p className="overview-text">
          {drama.overview ? drama.overview.slice(0, 90) + "…" : "No description available."}
        </p>
        <div className="cast-section">
          <div className="cast-title">Top Cast</div>
          <ul className="cast-list">
            {cast.length > 0 ? (
              cast.map((actor) => <li key={actor.id}>{actor.name}</li>)
            ) : (
              <li className="cast-loading">Loading cast…</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DramaCard;
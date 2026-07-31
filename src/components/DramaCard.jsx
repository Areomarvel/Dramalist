import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_KEY = "37f536bf16346bfc6cfcefca8f004b89"; // Insert TMDB API key here
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const DramaCard = ({ drama = {} }) => {
  const [cast, setCast] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!drama.id) return;

    // Fetch top cast members for this show
    const fetchCast = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${drama.id}/credits?api_key=${API_KEY}&language=en-US`
        );
        const data = await res.json();
        setCast((data.cast || []).slice(0, 3)); // Store top 3 actors for the card
      } catch (err) {
        console.error("Cast error:", err);
      }
    };

    fetchCast();
  }, [drama.id]);

  if (!drama.id) {
    return (
      <div className="app-container">
        <h2>No drama selected</h2>
        <p>Load a drama item first or pass a `drama` object into `<DramaCard />`.</p>
      </div>
    );
  }

  const posterPath = drama.poster_path 
    ? `${IMAGE_BASE_URL}${drama.poster_path}` 
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <div className="drama-card">
      <div className="poster-wrapper" onClick={() => navigate(`/drama/${drama.id}`)}>
        <img src={posterPath} alt={drama.name || drama.title} className="poster-img" />
        <span className="rating-badge">★ {drama.vote_average?.toFixed(1) || 'N/A'}</span>
      </div>
      <div className="card-details">
        <h3 className="drama-title">{drama.name || drama.title}</h3>
        <p className="overview-text">
          {drama.overview ? drama.overview.slice(0, 90) + "..." : "No description available."}
        </p>
        
        <div className="cast-section">
          <div className="cast-title">Top Cast</div>
          <ul className="cast-list">
            {cast.length > 0 ? (
              cast.map((actor) => <li key={actor.id}>{actor.name}</li>)
            ) : (
              <li>Loading cast...</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DramaCard;
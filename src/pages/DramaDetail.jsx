import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactionBox from '../components/ReactionBox';
import CommentSection from '../components/CommentSection';
import StarRating from '../components/StarRating';
import { generatePoster } from '../utils/generatePoster';
import { formatTitle } from '../utils/translateTitle';

const API_KEY = "37f536bf16346bfc6cfcefca8f004b89";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const DramaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drama, setDrama] = useState(null);
  const [error, setError] = useState(null);
  const [generatedPoster, setGeneratedPoster] = useState(null);

  useEffect(() => {
    const fetchDramaDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=credits,videos`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.status_message || "Failed to fetch details");
        setDrama(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchDramaDetails();
  }, [id]);

  // Generate poster if needed
  useEffect(() => {
    if (drama && !drama.poster_path) {
      const title = drama.name || drama.original_name || 'Unknown';
      setGeneratedPoster(generatePoster(title));
    }
  }, [drama?.id]);

  if (error) return (
    <div className="app-container">
      <h2>Error: {error}</h2>
      <button className="back-btn" onClick={() => navigate('/')}>Go Back</button>
    </div>
  );
  if (!drama) return null;

  const trailer = drama.videos?.results?.find(vid => vid.type === "Trailer" && vid.site === "YouTube");
  const director = drama.created_by?.map(p => p.name).join(', ') || null;
  const networks = drama.networks?.map(n => n.name).join(', ') || null;
  const countries = drama.origin_country?.join(', ') || null;
  const languages = drama.spoken_languages?.map(l => l.english_name).join(', ') || null;
  const writers = drama.credits?.crew
    ?.filter(c => c.department === 'Writing' || c.job === 'Writer')
    .map(w => w.name).slice(0, 3).join(', ') || null;

  const posterPath = drama.poster_path
    ? `${IMAGE_BASE_URL}${drama.poster_path}`
    : generatedPoster || null;

  const title = formatTitle(drama.name, drama.original_name);

  return (
    <div className="app-container detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-header">
        {posterPath ? (
          <img src={posterPath} alt={drama.name} className="detail-poster" />
        ) : (
          <div className="detail-poster poster-placeholder-lg">
            <span>{drama.name?.slice(0, 3)}</span>
          </div>
        )}

        <div className="detail-info">
          <h1 className="detail-title">{title}</h1>
          {drama.tagline && <p className="detail-tagline">"{drama.tagline}"</p>}

          <div className="detail-stats">
            {drama.vote_average > 0 && (
              <span className="rating">★ {drama.vote_average?.toFixed(1)}/10</span>
            )}
            {drama.status && <span className="status-badge">{drama.status}</span>}
            {drama.number_of_episodes && (
              <span className="episodes-badge">📺 {drama.number_of_episodes} eps</span>
            )}
          </div>

          {drama.overview && (
            <p className="detail-overview">{drama.overview}</p>
          )}

          <div className="detail-metadata">
            {director && <p><strong>Director/Creator:</strong> {director}</p>}
            {writers && <p><strong>Writer:</strong> {writers}</p>}
            {networks && <p><strong>Network:</strong> {networks}</p>}
            {drama.first_air_date && <p><strong>Release Date:</strong> {drama.first_air_date}</p>}
            {languages && <p><strong>Language:</strong> {languages}</p>}
            {countries && <p><strong>Country:</strong> {countries}</p>}
          </div>

          <StarRating targetId={drama.id} />
          <ReactionBox targetId={drama.id} type="drama" />
        </div>
      </div>

      {/* Trailer */}
      {trailer && (
        <div className="trailer-section">
          <h2>Trailer</h2>
          <div className="video-responsive">
            <iframe
              width="853"
              height="480"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${drama.name} Trailer`}
            />
          </div>
        </div>
      )}

      {/* Cast Grid */}
      {drama.credits?.cast?.length > 0 && (
        <div className="cast-grid-section">
          <h2>Top Cast</h2>
          <div className="cast-grid">
            {drama.credits.cast.slice(0, 10).map(actor => (
              <div key={actor.id} className="cast-card" onClick={() => navigate(`/person/${actor.id}`)}>
                {actor.profile_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}${actor.profile_path}`}
                    alt={actor.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="cast-photo-placeholder">
                    <span>{actor.name?.charAt(0)}</span>
                  </div>
                )}
                <h4>{actor.name}</h4>
                <p>{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="comments-section-wrapper">
        <CommentSection targetId={drama.id} type="drama" />
      </div>
    </div>
  );
};

export default DramaDetail;

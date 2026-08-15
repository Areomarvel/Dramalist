import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactionBox from '../components/ReactionBox';
import CommentSection from '../components/CommentSection';
import StarRating from '../components/StarRating';
import WatchlistButton from '../components/WatchlistButton';
import ShareButton from '../components/ShareButton';
import Breadcrumbs from '../components/Breadcrumbs';
import { generatePoster } from '../utils/generatePoster';
import { formatTitle } from '../utils/translateTitle';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [error, setError] = useState(null);
  const [generatedPoster, setGeneratedPoster] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,similar`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.status_message || 'Failed to fetch details');
        setMovie(data);
        setSimilar((data.similar?.results || []).slice(0, 12));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (movie && !movie.poster_path) {
      setGeneratedPoster(generatePoster(movie.title || 'Unknown'));
    }
  }, [movie?.id]);

  if (error) return (
    <div className="app-container">
      <h2>Error: {error}</h2>
      <button className="back-btn" onClick={() => navigate('/')}>Go Back</button>
    </div>
  );
  if (!movie) return null;

  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const director = movie.credits?.crew?.find(c => c.job === 'Director')?.name || null;
  const writers = movie.credits?.crew?.filter(c => c.department === 'Writing').map(w => w.name).slice(0, 3).join(', ') || null;
  const languages = movie.spoken_languages?.map(l => l.english_name).join(', ') || null;
  const countries = movie.production_countries?.map(c => c.name).join(', ') || null;
  const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : generatedPoster;
  const title = formatTitle(movie.title, movie.original_title) || movie.title;

  const watchlistItem = {
    id: movie.id,
    media_type: 'movie',
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    overview: movie.overview,
  };

  return (
    <div className="app-container detail-page">
      <Breadcrumbs items={[{ label: 'Movies', to: '/' }, { label: title }]} />
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-header">
        {posterPath ? (
          <img src={posterPath} alt={title} className="detail-poster" />
        ) : (
          <div className="detail-poster poster-placeholder-lg">
            <span>{title?.slice(0, 3)}</span>
          </div>
        )}

        <div className="detail-info">
          <div className="detail-title-row">
            <h1 className="detail-title">{title}</h1>
            <div className="detail-title-actions">
              <WatchlistButton item={watchlistItem} />
              <ShareButton title={title} text={`Check out ${title} on AsianDramaWiki!`} />
            </div>
          </div>
          {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}

          <div className="detail-stats">
            {movie.vote_average > 0 && (
              <span className="rating">★ {movie.vote_average?.toFixed(1)}/10</span>
            )}
            {movie.status && <span className="status-badge">{movie.status}</span>}
            {movie.runtime && <span className="episodes-badge">🎬 {movie.runtime} min</span>}
          </div>

          {movie.overview && <p className="detail-overview">{movie.overview}</p>}

          <div className="detail-metadata">
            {director && <p><strong>Director:</strong> {director}</p>}
            {writers && <p><strong>Writer:</strong> {writers}</p>}
            {movie.release_date && <p><strong>Release Date:</strong> {movie.release_date}</p>}
            {languages && <p><strong>Language:</strong> {languages}</p>}
            {countries && <p><strong>Country:</strong> {countries}</p>}
            {movie.budget > 0 && <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>}
          </div>

          <StarRating targetId={`movie_${movie.id}`} />
          <ReactionBox targetId={`movie_${movie.id}`} type="movie" />
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
              title={`${title} Trailer`}
            />
          </div>
        </div>
      )}

      {/* Cast Grid */}
      {movie.credits?.cast?.length > 0 && (
        <div className="cast-grid-section">
          <h2>Top Cast</h2>
          <div className="cast-grid">
            {movie.credits.cast.slice(0, 10).map(actor => (
              <div key={actor.id} className="cast-card" onClick={() => navigate(`/person/${actor.id}`)}>
                {actor.profile_path ? (
                  <img src={`${IMAGE_BASE_URL}${actor.profile_path}`} alt={actor.name} loading="lazy" />
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

      {/* Similar Movies */}
      {similar.length > 0 && (
        <div className="similar-section">
          <h2>Similar Movies</h2>
          <div className="similar-grid">
            {similar.map(item => {
              const t = formatTitle(item.title, item.original_title) || item.title;
              if (!t) return null;
              const poster = item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null;
              return (
                <div key={item.id} className="similar-card" onClick={() => navigate(`/movie/${item.id}`)}>
                  <div className="similar-poster">
                    {poster ? (
                      <img src={poster} alt={t} loading="lazy" />
                    ) : (
                      <div className="similar-placeholder"><span>{t?.slice(0, 2)}</span></div>
                    )}
                    {item.vote_average > 0 && (
                      <span className="rating-badge">★ {item.vote_average?.toFixed(1)}</span>
                    )}
                  </div>
                  <p className="similar-title" title={t}>{t}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="comments-section-wrapper">
        <CommentSection targetId={`movie_${movie.id}`} type="movie" />
      </div>
    </div>
  );
};

export default MovieDetail;

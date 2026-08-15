import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactionBox from '../components/ReactionBox';
import CommentSection from '../components/CommentSection';
import StarRating from '../components/StarRating';
import WatchlistButton from '../components/WatchlistButton';
import ShareButton from '../components/ShareButton';
import ProgressTracker from '../components/ProgressTracker';
import StreamingLinks from '../components/StreamingLinks';
import EpisodeGuide from '../components/EpisodeGuide';
import ReviewSection from '../components/ReviewSection';
import Breadcrumbs from '../components/Breadcrumbs';
import { generatePoster } from '../utils/generatePoster';
import { formatTitle } from '../utils/translateTitle';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const DramaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drama, setDrama] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [expandedSeason, setExpandedSeason] = useState(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState({});
  const [error, setError] = useState(null);
  const [generatedPoster, setGeneratedPoster] = useState(null);

  useEffect(() => {
    const fetchDramaDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=credits,videos,similar`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.status_message || 'Failed to fetch details');
        setDrama(data);
        setSeasons(data.seasons?.filter(s => s.season_number > 0) || []);
        setSimilar((data.similar?.results || []).slice(0, 12));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchDramaDetails();
  }, [id]);

  useEffect(() => {
    if (drama && !drama.poster_path) {
      setGeneratedPoster(generatePoster(drama.name || drama.original_name || 'Unknown'));
    }
  }, [drama?.id]);

  const fetchSeasonEpisodes = async (seasonNum) => {
    if (seasonEpisodes[seasonNum]) {
      setExpandedSeason(expandedSeason === seasonNum ? null : seasonNum);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/tv/${id}/season/${seasonNum}?api_key=${API_KEY}`);
      const data = await res.json();
      setSeasonEpisodes(prev => ({ ...prev, [seasonNum]: data.episodes || [] }));
      setExpandedSeason(seasonNum);
    } catch {
      setExpandedSeason(expandedSeason === seasonNum ? null : seasonNum);
    }
  };

  if (error) return (
    <div className="app-container">
      <h2>Error: {error}</h2>
      <button className="back-btn" onClick={() => navigate('/')}>Go Back</button>
    </div>
  );
  if (!drama) return null;

  const trailer = drama.videos?.results?.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube');
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

  const watchlistItem = {
    id: drama.id,
    media_type: 'tv',
    name: drama.name,
    poster_path: drama.poster_path,
    vote_average: drama.vote_average,
    first_air_date: drama.first_air_date,
    overview: drama.overview,
  };

  return (
    <div className="app-container detail-page">
      <Breadcrumbs items={[{ label: 'Dramas', to: '/' }, { label: title }]} />
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
          <div className="detail-title-row">
            <h1 className="detail-title">{title}</h1>
            <div className="detail-title-actions">
              <WatchlistButton item={watchlistItem} />
              <ShareButton title={title} text={`Check out ${title} on AsianDramaWiki!`} />
            </div>
          </div>
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

          <ProgressTracker
            dramaId={drama.id}
            totalEpisodes={drama.number_of_episodes || 16}
            dramaTitle={title}
          />
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

      {/* Episode Guide */}
      {seasons.length > 0 && (
        <div className="episode-guide-section">
          <h2>Episode Guide</h2>
          <div className="seasons-list">
            {seasons.map(season => (
              <div key={season.id} className="season-block">
                <button
                  className={`season-toggle ${expandedSeason === season.season_number ? 'open' : ''}`}
                  onClick={() => fetchSeasonEpisodes(season.season_number)}
                >
                  <div className="season-toggle-left">
                    {season.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${season.poster_path}`}
                        alt={season.name}
                        className="season-thumb"
                      />
                    )}
                    <div>
                      <span className="season-name">{season.name}</span>
                      <span className="season-ep-count">{season.episode_count} episodes</span>
                    </div>
                  </div>
                  <span className="season-chevron">{expandedSeason === season.season_number ? '▲' : '▼'}</span>
                </button>

                {expandedSeason === season.season_number && (
                  <div className="episodes-list">
                    {(seasonEpisodes[season.season_number] || []).map(ep => (
                      <div key={ep.id} className="episode-row">
                        <span className="ep-number">E{ep.episode_number}</span>
                        <div className="ep-info">
                          <strong className="ep-name">{ep.name}</strong>
                          {ep.air_date && <span className="ep-date">{ep.air_date}</span>}
                          {ep.overview && <p className="ep-overview">{ep.overview}</p>}
                        </div>
                        {ep.vote_average > 0 && (
                          <span className="ep-rating">★ {ep.vote_average?.toFixed(1)}</span>
                        )}
                      </div>
                    ))}
                    {(seasonEpisodes[season.season_number] || []).length === 0 && (
                      <p className="ep-loading">Loading episodes…</p>
                    )}
                  </div>
                )}
              </div>
            ))}
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

      {/* Similar Dramas */}
      {similar.length > 0 && (
        <div className="similar-section">
          <h2>Similar Dramas</h2>
          <div className="similar-grid">
            {similar.map(item => {
              const t = formatTitle(item.name, item.original_name) || item.name;
              if (!t) return null;
              const poster = item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null;
              return (
                <div key={item.id} className="similar-card" onClick={() => navigate(`/drama/${item.id}`)}>
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

      {/* Streaming Providers */}
      <StreamingLinks title={title} />

      {/* Episode Guide & Discussion */}
      <EpisodeGuide
        totalEpisodes={drama.number_of_episodes || 16}
        dramaTitle={title}
        dramaId={drama.id}
      />

      {/* Detailed Written Reviews */}
      <ReviewSection dramaId={drama.id} />

      <div className="comments-section-wrapper">
        <CommentSection targetId={drama.id} type="drama" />
      </div>
    </div>
  );
};

export default DramaDetail;

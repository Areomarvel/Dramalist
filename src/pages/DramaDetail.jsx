import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactionBox from '../components/ReactionBox';
import CommentSection from '../components/CommentSection';
import StarRating from '../components/StarRating';
import Navbar from '../components/Navbar';

const API_KEY = "37f536bf16346bfc6cfcefca8f004b89";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const DramaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drama, setDrama] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDramaDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=credits,videos`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.status_message || "Failed to fetch details");
        setDrama(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDramaDetails();
  }, [id]);

  if (loading) return <div className="app-container"><h2>Loading Drama...</h2></div>;
  if (error) return <div className="app-container"><h2>Error: {error}</h2><button onClick={() => navigate('/')}>Go Back</button></div>;
  if (!drama) return null;

  // Extract info
  const trailer = drama.videos?.results?.find(vid => vid.type === "Trailer" && vid.site === "YouTube");
  const director = drama.created_by?.map(p => p.name).join(', ') || 'N/A';
  const networks = drama.networks?.map(n => n.name).join(', ') || 'N/A';
  const countries = drama.origin_country?.join(', ') || 'N/A';
  const languages = drama.spoken_languages?.map(l => l.english_name).join(', ') || 'N/A';
  
  // Try to find writers in the crew if possible, though TV shows often use created_by
  const writers = drama.credits?.crew?.filter(c => c.department === 'Writing' || c.job === 'Writer')
    .map(w => w.name)
    .slice(0, 3)
    .join(', ') || director; // Fallback to director/creator if no specific writer found

  const posterPath = drama.poster_path ? `${IMAGE_BASE_URL}${drama.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <div className="app-container detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-header">
        <img src={posterPath} alt={drama.name} className="detail-poster" />
        
        <div className="detail-info">
          <h1 className="detail-title">{drama.name}</h1>
          <p className="detail-tagline">{drama.tagline}</p>
          <div className="detail-stats">
            <span className="rating">★ {drama.vote_average?.toFixed(1)}</span>
            <span>{drama.status}</span>
          </div>

          <p className="detail-overview">{drama.overview}</p>

          <div className="detail-metadata">
            <p><strong>Director/Creator:</strong> {director}</p>
            <p><strong>Writer:</strong> {writers}</p>
            <p><strong>Network:</strong> {networks}</p>
            <p><strong>Episodes:</strong> {drama.number_of_episodes}</p>
            <p><strong>Release Date:</strong> {drama.first_air_date}</p>
            <p><strong>Language:</strong> {languages}</p>
            <p><strong>Country:</strong> {countries}</p>
          </div>
          
          <StarRating targetId={drama.id} />
          
          <ReactionBox targetId={drama.id} type="drama" />
        </div>
      </div>

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
              title="Embedded youtube"
            />
          </div>
        </div>
      )}

      <div className="cast-grid-section">
        <h2>Top Cast</h2>
        <div className="cast-grid">
          {drama.credits?.cast?.slice(0, 10).map(actor => (
            <div key={actor.id} className="cast-card" onClick={() => navigate(`/person/${actor.id}`)}>
              <img 
                src={actor.profile_path ? `${IMAGE_BASE_URL}${actor.profile_path}` : "https://via.placeholder.com/300x450?text=No+Photo"} 
                alt={actor.name} 
              />
              <h4>{actor.name}</h4>
              <p>{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="comments-section-wrapper">
        <CommentSection targetId={drama.id} type="drama" />
      </div>
    </div>
  );
};

export default DramaDetail;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import ReactionBox from '../components/ReactionBox';

const API_KEY = "37f536bf16346bfc6cfcefca8f004b89";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const PersonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerson = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/person/${id}?api_key=${API_KEY}&append_to_response=combined_credits,external_ids`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.status_message || "Failed to fetch person details");
        setPerson(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPerson();
  }, [id]);

  if (loading) return <div className="app-container"><h2>Loading Actor...</h2></div>;
  if (error) return <div className="app-container"><h2>Error: {error}</h2><button onClick={() => navigate(-1)}>Go Back</button></div>;
  if (!person) return null;

  const profilePath = person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : "https://via.placeholder.com/500x750?text=No+Photo";
  
  // Calculate Age
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms); 
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };

  const instagramUrl = person.external_ids?.instagram_id ? `https://instagram.com/${person.external_ids.instagram_id}` : null;
  const knownFor = person.combined_credits?.cast?.sort((a, b) => b.popularity - a.popularity).slice(0, 10) || [];

  return (
    <div className="app-container detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-header">
        <img src={profilePath} alt={person.name} className="detail-poster" />
        
        <div className="detail-info">
          <h1 className="detail-title">{person.name}</h1>
          
          <div className="detail-metadata">
            <p><strong>Date of Birth:</strong> {person.birthday || 'N/A'} ({calculateAge(person.birthday)} years old)</p>
            <p><strong>Birthplace:</strong> {person.place_of_birth || 'N/A'}</p>
            {/* Note: Blood Type and Height are not provided by TMDB API usually, mocked or N/A */}
            <p><strong>Blood Type:</strong> N/A (Not provided by API)</p>
            <p><strong>Height:</strong> N/A (Not provided by API)</p>
            {instagramUrl && (
              <p><strong>Instagram:</strong> <a href={instagramUrl} target="_blank" rel="noopener noreferrer">@{person.external_ids.instagram_id}</a></p>
            )}
          </div>

          <div className="person-biography">
            <h3>Biography</h3>
            <p>{person.biography || "No biography available."}</p>
          </div>
          
          <ReactionBox targetId={person.id} type="person" />
        </div>
      </div>

      <div className="cast-grid-section">
        <h2>Known For (Other Dramas/Movies)</h2>
        <div className="cast-grid">
          {knownFor.map(credit => (
            <div key={credit.credit_id} className="cast-card" onClick={() => navigate(credit.media_type === 'tv' ? `/drama/${credit.id}` : '#')}>
              <img 
                src={credit.poster_path ? `${IMAGE_BASE_URL}${credit.poster_path}` : "https://via.placeholder.com/300x450?text=No+Poster"} 
                alt={credit.name || credit.title} 
              />
              <h4>{credit.name || credit.title}</h4>
              <p>{credit.character}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="comments-section-wrapper">
        <CommentSection targetId={person.id} type="person" />
      </div>
    </div>
  );
};

export default PersonDetail;

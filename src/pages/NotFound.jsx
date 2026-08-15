import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-emoji">🎬</div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Scene Not Found</h2>
        <p className="not-found-desc">
          Looks like this page took an unexpected plot twist and disappeared.<br />
          Let's get you back to the story.
        </p>
        <div className="not-found-actions">
          <button className="nf-btn primary" onClick={() => navigate('/')}>
            🏠 Go Home
          </button>
          <button className="nf-btn secondary" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

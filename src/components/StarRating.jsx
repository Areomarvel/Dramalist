import React, { useState, useEffect } from 'react';

const StarRating = ({ targetId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const storageKey = `rating_drama_${targetId}`;
  const allRatingsKey = `all_ratings_drama_${targetId}`;

  // Community rating state
  const [communityAvg, setCommunityAvg] = useState(0);
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setRating(parseInt(saved, 10));

    // Load community ratings (simulated multi-user via stored array)
    const allRatingsRaw = localStorage.getItem(allRatingsKey);
    if (allRatingsRaw) {
      const allRatings = JSON.parse(allRatingsRaw);
      if (allRatings.length > 0) {
        const avg = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;
        setCommunityAvg(avg);
        setVoteCount(allRatings.length);
      }
    }
  }, [storageKey, allRatingsKey]);

  const handleRating = (value) => {
    const prevRating = rating;
    setRating(value);
    localStorage.setItem(storageKey, value);

    // Update community ratings array
    const allRatingsRaw = localStorage.getItem(allRatingsKey);
    let allRatings = allRatingsRaw ? JSON.parse(allRatingsRaw) : [];

    if (prevRating > 0) {
      // Replace previous rating
      const idx = allRatings.indexOf(prevRating);
      if (idx !== -1) allRatings[idx] = value;
      else allRatings.push(value);
    } else {
      allRatings.push(value);
    }

    localStorage.setItem(allRatingsKey, JSON.stringify(allRatings));
    const avg = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;
    setCommunityAvg(avg);
    setVoteCount(allRatings.length);
  };

  const filledStars = hover || rating;

  return (
    <div className="star-rating-container">
      <h4 className="rating-section-title">Rate this Drama</h4>

      {/* Interactive Stars */}
      <div className="stars" role="group" aria-label="Star rating">
        {[...Array(10)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span
              key={starValue}
              className={`star ${starValue <= filledStars ? 'filled' : ''}`}
              onClick={() => handleRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
              role="button"
              aria-label={`Rate ${starValue} out of 10`}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleRating(starValue)}
            >
              ★
            </span>
          );
        })}
      </div>

      {/* Rating Display */}
      <div className="rating-display-row">
        {rating > 0 && (
          <div className="your-rating-box">
            <span className="your-rating-label">Your Rating</span>
            <span className="your-rating-value">{rating}<span className="rating-max">/10</span></span>
          </div>
        )}
        {voteCount > 0 && (
          <div className="community-rating-box">
            <span className="community-label">Community Average</span>
            <span className="community-value">
              ⭐ {communityAvg.toFixed(1)}<span className="rating-max">/10</span>
            </span>
            <span className="vote-count">({voteCount} vote{voteCount !== 1 ? 's' : ''})</span>
          </div>
        )}
      </div>

      {rating === 0 && (
        <p className="rating-prompt">Click a star to rate this drama (1–10)</p>
      )}
    </div>
  );
};

export default StarRating;

import React, { useState, useEffect } from 'react';

const StarRating = ({ targetId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const storageKey = `rating_drama_${targetId}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setRating(parseInt(saved, 10));
    }
  }, [storageKey]);

  const handleRating = (value) => {
    setRating(value);
    localStorage.setItem(storageKey, value);
  };

  return (
    <div className="star-rating-container">
      <h4>Rate this Drama: {rating > 0 ? `${rating}/10` : ''}</h4>
      <div className="stars">
        {[...Array(10)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span
              key={starValue}
              className={`star ${starValue <= (hover || rating) ? 'filled' : ''}`}
              onClick={() => handleRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default StarRating;

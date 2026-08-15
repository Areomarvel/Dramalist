import React, { useState, useEffect } from 'react';

const ReviewSection = ({ dramaId }) => {
  const storageKey = `reviews_drama_${dramaId}`;

  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState('');
  const [headline, setHeadline] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [scores, setScores] = useState({
    story: 8,
    acting: 9,
    music: 8,
    rewatch: 7,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setReviews(JSON.parse(raw));
      } else {
        // Pre-seed a default review
        const defaultReviews = [
          {
            id: 101,
            author: 'CinephileAsia',
            headline: 'A Masterpiece of Emotion & Pacing!',
            body: 'From the very first episode, this drama captivated me with its rich character development, soundtrack, and gorgeous cinematography. Highly recommended for fans of emotional stories.',
            scores: { story: 9, acting: 10, music: 9, rewatch: 8 },
            overall: 9.0,
            date: '2024-06-20',
            likes: 14,
          },
        ];
        setReviews(defaultReviews);
        localStorage.setItem(storageKey, JSON.stringify(defaultReviews));
      }
    } catch {
      setReviews([]);
    }
  }, [storageKey]);

  const handleScoreChange = (cat, val) => {
    setScores(prev => ({ ...prev, [cat]: parseInt(val, 10) }));
  };

  const calculateOverall = (s) => {
    return ((s.story + s.acting + s.music + s.rewatch) / 4).toFixed(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author.trim() || !headline.trim() || !reviewBody.trim()) return;

    const newReview = {
      id: Date.now(),
      author,
      headline,
      body: reviewBody,
      scores: { ...scores },
      overall: calculateOverall(scores),
      date: new Date().toISOString().split('T')[0],
      likes: 0,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Reset
    setHeadline('');
    setReviewBody('');
    setShowForm(false);
  };

  const handleLikeReview = (reviewId) => {
    const updated = reviews.map(r =>
      r.id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r
    );
    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  return (
    <div className="review-section-container">
      <div className="review-section-header">
        <div>
          <h3>📝 Detailed User Reviews</h3>
          <p className="review-subtitle">In-depth critiques and score breakdowns by fans</p>
        </div>
        <button
          type="button"
          className="write-review-btn"
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? '✕ Cancel' : '✍️ Write a Review'}
        </button>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="review-form-card">
          <h4>Write Your Detailed Review</h4>

          <input
            type="text"
            placeholder="Your Name *"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            required
            className="review-input"
          />

          <input
            type="text"
            placeholder="Review Headline (e.g. Unforgettable Chemistry!) *"
            value={headline}
            onChange={e => setHeadline(e.target.value)}
            required
            className="review-input"
          />

          {/* Sub-rating Sliders */}
          <div className="sliders-grid">
            <div className="slider-item">
              <label>📖 Story: <strong>{scores.story}/10</strong></label>
              <input
                type="range"
                min="1"
                max="10"
                value={scores.story}
                onChange={e => handleScoreChange('story', e.target.value)}
              />
            </div>
            <div className="slider-item">
              <label>🎭 Acting & Cast: <strong>{scores.acting}/10</strong></label>
              <input
                type="range"
                min="1"
                max="10"
                value={scores.acting}
                onChange={e => handleScoreChange('acting', e.target.value)}
              />
            </div>
            <div className="slider-item">
              <label>🎵 Music & OST: <strong>{scores.music}/10</strong></label>
              <input
                type="range"
                min="1"
                max="10"
                value={scores.music}
                onChange={e => handleScoreChange('music', e.target.value)}
              />
            </div>
            <div className="slider-item">
              <label>🔄 Rewatch Value: <strong>{scores.rewatch}/10</strong></label>
              <input
                type="range"
                min="1"
                max="10"
                value={scores.rewatch}
                onChange={e => handleScoreChange('rewatch', e.target.value)}
              />
            </div>
          </div>

          <div className="overall-score-preview">
            <span>Overall Score: <strong>⭐ {calculateOverall(scores)} / 10</strong></span>
          </div>

          <textarea
            placeholder="Write your detailed review here. What worked well? What could be improved?..."
            value={reviewBody}
            onChange={e => setReviewBody(e.target.value)}
            rows={5}
            required
            className="review-input review-textarea"
          />

          <button type="submit" className="submit-review-btn">
            Publish Review
          </button>
        </form>
      )}

      {/* Reviews Feed */}
      <div className="reviews-feed">
        {reviews.length === 0 ? (
          <p className="no-reviews">No detailed reviews yet. Be the first to write one!</p>
        ) : (
          reviews.map(rev => (
            <div key={rev.id} className="review-card">
              <div className="review-card-header">
                <div className="review-author-info">
                  <div className="review-avatar">{rev.author.charAt(0).toUpperCase()}</div>
                  <div>
                    <strong className="review-author-name">{rev.author}</strong>
                    <span className="review-date">{rev.date}</span>
                  </div>
                </div>
                <div className="review-overall-badge">
                  ⭐ {rev.overall}<span className="max-score">/10</span>
                </div>
              </div>

              <h4 className="review-headline">"{rev.headline}"</h4>

              {/* Sub Score Breakdown Chips */}
              <div className="score-chips-row">
                <span className="chip">Story: {rev.scores.story}/10</span>
                <span className="chip">Acting: {rev.scores.acting}/10</span>
                <span className="chip">Music: {rev.scores.music}/10</span>
                <span className="chip">Rewatch: {rev.scores.rewatch}/10</span>
              </div>

              <p className="review-body-text">{rev.body}</p>

              <div className="review-footer">
                <button
                  type="button"
                  className="like-review-btn"
                  onClick={() => handleLikeReview(rev.id)}
                >
                  👍 Helpful ({rev.likes || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;

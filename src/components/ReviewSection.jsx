import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ReviewSection = ({ dramaId }) => {
  const { user, openAuthModal } = useAuth();
  const storageKey = `reviews_drama_${dramaId}`;

  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [headline, setHeadline] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [expandedReviews, setExpandedReviews] = useState({});
  const [scores, setScores] = useState({
    story: 9,
    acting: 9,
    music: 8,
    rewatch: 8,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setReviews(JSON.parse(raw));
      } else {
        const defaultReviews = [
          {
            id: 101,
            author: 'CinephileAsia',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CinephileAsia',
            headline: 'A Masterpiece of Emotion, Pacing, and Soundtrack!',
            body: 'From the very first episode, this drama captivated me with its rich character development, soundtrack, and gorgeous cinematography. Highly recommended for fans of emotional stories and well-written character arcs. The lead actors had unmatched chemistry and every single scene felt intentional.',
            scores: { story: 9, acting: 10, music: 9, rewatch: 8 },
            overall: 9.0,
            date: '2024-06-20',
            likes: 24,
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

  const handleWriteClick = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    setShowForm(v => !v);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!headline.trim() || !reviewBody.trim()) return;

    const newReview = {
      id: Date.now(),
      author: user.username,
      avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.username)}`,
      headline: headline.trim(),
      body: reviewBody.trim(),
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
    if (!user) {
      openAuthModal('login');
      return;
    }
    const updated = reviews.map(r =>
      r.id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r
    );
    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const toggleExpand = (id) => {
    setExpandedReviews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="review-section-container">
      <div className="review-section-header">
        <div>
          <h3>📝 Detailed User Reviews</h3>
          <p className="review-subtitle">In-depth critiques and score breakdowns by drama fans</p>
        </div>
        <button
          type="button"
          className="write-review-btn"
          onClick={handleWriteClick}
        >
          {showForm ? '✕ Cancel' : '✍️ Write a Review'}
        </button>
      </div>

      {/* Guest Lock Prompt for Reviews */}
      {!user && (
        <div className="review-guest-banner">
          <span>🔒 <strong>Sign in to publish a detailed review</strong></span>
          <button
            type="button"
            className="review-guest-btn"
            onClick={() => openAuthModal('login')}
          >
            Sign In / Create Account
          </button>
        </div>
      )}

      {/* Review Submission Form */}
      {showForm && user && (
        <form onSubmit={handleSubmit} className="review-form-card">
          <h4>Write Your Review as <strong>{user.username}</strong></h4>

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
          reviews.map(rev => {
            const isExpanded = expandedReviews[rev.id];
            const isLong = rev.body.length > 220;
            const displayText = isExpanded || !isLong ? rev.body : rev.body.slice(0, 220) + '…';

            return (
              <div key={rev.id} className="review-card">
                <div className="review-card-header">
                  <div className="review-author-info">
                    <img
                      src={rev.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(rev.author)}`}
                      alt={rev.author}
                      className="review-author-avatar-img"
                    />
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

                {/* Sub Score Breakdown Progress Bars */}
                <div className="score-bars-container">
                  <div className="score-bar-row">
                    <span className="score-bar-label">📖 Story</span>
                    <div className="score-bar-track">
                      <div className="score-bar-fill" style={{ width: `${(rev.scores.story / 10) * 100}%` }} />
                    </div>
                    <span className="score-bar-val">{rev.scores.story}/10</span>
                  </div>
                  <div className="score-bar-row">
                    <span className="score-bar-label">🎭 Acting</span>
                    <div className="score-bar-track">
                      <div className="score-bar-fill" style={{ width: `${(rev.scores.acting / 10) * 100}%` }} />
                    </div>
                    <span className="score-bar-val">{rev.scores.acting}/10</span>
                  </div>
                  <div className="score-bar-row">
                    <span className="score-bar-label">🎵 Music</span>
                    <div className="score-bar-track">
                      <div className="score-bar-fill" style={{ width: `${(rev.scores.music / 10) * 100}%` }} />
                    </div>
                    <span className="score-bar-val">{rev.scores.music}/10</span>
                  </div>
                  <div className="score-bar-row">
                    <span className="score-bar-label">🔄 Rewatch</span>
                    <div className="score-bar-track">
                      <div className="score-bar-fill" style={{ width: `${(rev.scores.rewatch / 10) * 100}%` }} />
                    </div>
                    <span className="score-bar-val">{rev.scores.rewatch}/10</span>
                  </div>
                </div>

                <p className="review-body-text">{displayText}</p>
                {isLong && (
                  <button
                    type="button"
                    className="read-more-btn"
                    onClick={() => toggleExpand(rev.id)}
                  >
                    {isExpanded ? 'Show Less ▲' : 'Read More ▼'}
                  </button>
                )}

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
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReviewSection;

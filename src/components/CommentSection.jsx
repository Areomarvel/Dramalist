import React, { useState, useEffect } from 'react';

const CLEANUP_FLAG = 'adw_comments_cleaned_v1';

const CommentSection = ({ targetId, type = 'drama' }) => {
  const storageKey = `comments_${type}_${targetId}`;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // One-time cleanup: remove any fake/seeded comments from previous dev sessions.
    // Real user comments have a numeric timestamp `id` (Date.now()).
    // We wipe any stored data on first run after this update and start fresh.
    if (!localStorage.getItem(CLEANUP_FLAG)) {
      // Clear all comment keys from localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('comments_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      localStorage.setItem(CLEANUP_FLAG, '1');
      setComments([]);
      return;
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch {
        setComments([]);
      }
    } else {
      setComments([]);
    }
  }, [storageKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;

    const commentObj = {
      id: Date.now(),
      user: userName,
      text: newComment,
      date: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }),
    };

    const updatedComments = [commentObj, ...comments];
    setComments(updatedComments);
    setNewComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    localStorage.setItem(storageKey, JSON.stringify(updatedComments));
  };

  const handleDelete = (commentId) => {
    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem(storageKey, JSON.stringify(updatedComments));
  };

  const getInitial = (name) => (name || '?').charAt(0).toUpperCase();

  return (
    <div className="comment-section">
      <div className="comment-section-header">
        <h4>💬 Comments <span className="comment-count">({comments.length})</span></h4>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="comment-input name-input"
          id="comment-name-input"
        />
        <textarea
          placeholder="Share your thoughts about this drama..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
          className="comment-input text-input"
          rows="3"
          id="comment-text-input"
        />
        <div className="comment-form-footer">
          <button type="submit" className="comment-submit-btn" id="comment-submit">
            Post Comment
          </button>
          {submitted && <span className="comment-success">✓ Comment posted!</span>}
        </div>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-card">
              <div className="comment-avatar">
                {getInitial(comment.user)}
              </div>
              <div className="comment-body">
                <div className="comment-header">
                  <strong className="comment-username">{comment.user}</strong>
                  <span className="comment-date">{comment.date}</span>
                  <button
                    className="comment-delete-btn"
                    onClick={() => handleDelete(comment.id)}
                    aria-label="Delete comment"
                    title="Delete comment"
                  >
                    ✕
                  </button>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;

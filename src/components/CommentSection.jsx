import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ targetId, type = 'drama' }) => {
  const { user, openAuthModal } = useAuth();
  const storageKey = `comments_${type}_${targetId}`;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' or 'top'
  const [submitted, setSubmitted] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch {
        setComments([]);
      }
    } else {
      // Seed initial sample comments for realistic drama discussion feel
      const sampleComments = [
        {
          id: 1001,
          user: 'DramaFanatic99',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DramaFanatic99',
          text: 'The chemistry between the lead actors in this is insane! That ending scene in Episode 4 had me on the edge of my seat.',
          date: '2 days ago',
          likes: 12,
          replies: [
            {
              id: 2001,
              user: 'KDramaAddict',
              avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=KDramaAddict',
              text: 'Agreed! The OST playing in the background made it 10x more epic.',
              date: '1 day ago',
              likes: 5,
            }
          ]
        },
        {
          id: 1002,
          user: 'BingeWatcher_KR',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BingeWatcher_KR',
          text: 'Superb pacing and brilliant direction. Definitely one of the top releases of the year!',
          date: '3 days ago',
          likes: 8,
          replies: []
        }
      ];
      setComments(sampleComments);
      localStorage.setItem(storageKey, JSON.stringify(sampleComments));
    }
  }, [storageKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!newComment.trim()) return;

    const commentObj = {
      id: Date.now(),
      user: user.username,
      avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.username)}`,
      text: newComment.trim(),
      date: 'Just now',
      likes: 0,
      replies: [],
    };

    const updatedComments = [commentObj, ...comments];
    setComments(updatedComments);
    setNewComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    localStorage.setItem(storageKey, JSON.stringify(updatedComments));
  };

  const handleLike = (commentId) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    const updated = comments.map(c =>
      c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
    );
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleAddReply = (commentId) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!replyText.trim()) return;

    const replyObj = {
      id: Date.now(),
      user: user.username,
      avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.username)}`,
      text: replyText.trim(),
      date: 'Just now',
      likes: 0,
    };

    const updated = comments.map(c =>
      c.id === commentId ? { ...c, replies: [...(c.replies || []), replyObj] } : c
    );
    setComments(updated);
    setReplyText('');
    setReplyingTo(null);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleDelete = (commentId) => {
    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem(storageKey, JSON.stringify(updatedComments));
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'top') {
      return (b.likes || 0) - (a.likes || 0);
    }
    return b.id - a.id;
  });

  return (
    <div className="comment-section">
      {/* Header & Sorting Tabs */}
      <div className="comment-section-header">
        <div className="comment-title-row">
          <h4>💬 Community Discussion <span className="comment-count">({comments.length})</span></h4>
        </div>
        <div className="comment-sort-tabs">
          <button
            type="button"
            className={`sort-tab ${sortBy === 'recent' ? 'active' : ''}`}
            onClick={() => setSortBy('recent')}
          >
            Recent
          </button>
          <button
            type="button"
            className={`sort-tab ${sortBy === 'top' ? 'active' : ''}`}
            onClick={() => setSortBy('top')}
          >
            🔥 Top Voted
          </button>
        </div>
      </div>

      {/* Guest Lock Prompt or Logged-in Comment Form */}
      {!user ? (
        <div className="comment-guest-prompt">
          <span className="comment-lock-icon">🔒</span>
          <h4>Sign In to Join the Conversation</h4>
          <p>Please sign in or create a free account to post comments, upvote reviews, and reply to fan discussions.</p>
          <button
            type="button"
            className="comment-signin-btn"
            onClick={() => openAuthModal('login')}
            id="comment-signin-btn"
          >
            Sign In / Create Account
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="comment-form-user-bar">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.username)}`}
              alt={user.username}
              className="comment-user-avatar-sm"
            />
            <span className="comment-user-label">Commenting as <strong>{user.username}</strong></span>
          </div>

          <textarea
            placeholder="Share your thoughts, episode predictions, or reviews..."
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
      )}

      {/* Comments Feed */}
      <div className="comments-list">
        {sortedComments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to start the discussion!</p>
        ) : (
          sortedComments.map(comment => (
            <div key={comment.id} className="comment-card">
              <div className="comment-card-main">
                <img
                  src={comment.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(comment.user)}`}
                  alt={comment.user}
                  className="comment-user-avatar-md"
                />
                <div className="comment-body">
                  <div className="comment-header">
                    <div className="comment-author-group">
                      <strong className="comment-username">{comment.user}</strong>
                      <span className="comment-date">{comment.date}</span>
                    </div>
                    {user && user.username === comment.user && (
                      <button
                        className="comment-delete-btn"
                        onClick={() => handleDelete(comment.id)}
                        aria-label="Delete comment"
                        title="Delete comment"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p className="comment-text">{comment.text}</p>

                  {/* Actions Row */}
                  <div className="comment-actions-row">
                    <button
                      type="button"
                      className="comment-action-btn like-btn"
                      onClick={() => handleLike(comment.id)}
                    >
                      👍 {comment.likes || 0}
                    </button>
                    <button
                      type="button"
                      className="comment-action-btn reply-btn"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    >
                      💬 Reply {(comment.replies || []).length > 0 ? `(${comment.replies.length})` : ''}
                    </button>
                  </div>

                  {/* Inline Reply Input Form */}
                  {replyingTo === comment.id && (
                    <div className="comment-reply-form">
                      <input
                        type="text"
                        placeholder={`Reply to @${comment.user}...`}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        className="comment-input reply-input-field"
                        onKeyDown={e => e.key === 'Enter' && handleAddReply(comment.id)}
                      />
                      <button
                        type="button"
                        className="comment-reply-submit"
                        onClick={() => handleAddReply(comment.id)}
                      >
                        Send
                      </button>
                    </div>
                  )}

                  {/* Nested Replies */}
                  {(comment.replies || []).length > 0 && (
                    <div className="comment-replies-list">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="comment-reply-card">
                          <img
                            src={reply.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(reply.user)}`}
                            alt={reply.user}
                            className="comment-user-avatar-sm"
                          />
                          <div className="reply-body">
                            <div className="reply-header">
                              <strong className="reply-username">{reply.user}</strong>
                              <span className="reply-date">{reply.date}</span>
                            </div>
                            <p className="reply-text">{reply.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;

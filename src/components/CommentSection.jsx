import React, { useState, useEffect } from 'react';

const CommentSection = ({ targetId, type = 'drama' }) => {
  const storageKey = `comments_${type}_${targetId}`;
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setComments(JSON.parse(saved));
    }
  }, [storageKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;

    const commentObj = {
      id: Date.now(),
      user: userName,
      text: newComment,
      date: new Date().toLocaleDateString()
    };

    const updatedComments = [commentObj, ...comments];
    setComments(updatedComments);
    setNewComment('');
    
    localStorage.setItem(storageKey, JSON.stringify(updatedComments));
  };

  return (
    <div className="comment-section">
      <h4>Comments ({comments.length})</h4>
      
      <form onSubmit={handleSubmit} className="comment-form">
        <input 
          type="text" 
          placeholder="Your Name" 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)}
          required 
          className="comment-input name-input"
        />
        <textarea 
          placeholder="Write a comment..." 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
          className="comment-input text-input"
          rows="3"
        ></textarea>
        <button type="submit" className="comment-submit-btn">Post Comment</button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-card">
              <div className="comment-header">
                <strong>{comment.user}</strong>
                <span className="comment-date">{comment.date}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;

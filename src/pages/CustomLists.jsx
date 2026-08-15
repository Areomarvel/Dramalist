import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomLists } from '../utils/useCustomLists';

const CustomLists = () => {
  const { lists, createList, toggleLikeList } = useCustomLists();
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    createList({ title, description, author });
    setTitle('');
    setDescription('');
    setAuthor('');
    setShowCreateModal(false);
  };

  return (
    <div className="app-container">
      <div className="lists-page-header">
        <div>
          <h1>📜 Curated Drama Playlists &amp; Lists</h1>
          <p className="detail-overview">Explore community created drama recommendations and theme collections.</p>
        </div>
        <button
          type="button"
          className="create-list-btn"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Custom List
        </button>
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>✕</button>
            <div className="modal-body" style={{ flexDirection: 'column' }}>
              <h3 style={{ color: 'var(--accent)', marginBottom: '16px' }}>Create New Drama List</h3>
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input
                  type="text"
                  placeholder="Your Name / Handle *"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  required
                  className="comment-input"
                />
                <input
                  type="text"
                  placeholder="Playlist Title (e.g. Best Enemies-to-Lovers) *"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="comment-input"
                />
                <textarea
                  placeholder="Describe your list theme and recommendations..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className="comment-input text-input"
                />
                <button type="submit" className="comment-submit-btn">
                  Publish List
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lists Feed */}
      <div className="lists-grid">
        {lists.map(list => (
          <div key={list.id} className="custom-list-card">
            <div className="list-card-header">
              <h3 className="list-card-title">{list.title}</h3>
              {list.isOfficial && <span className="official-badge">⭐ Featured</span>}
            </div>
            <p className="list-card-desc">{list.description}</p>
            <div className="list-card-footer">
              <span className="list-author">by {list.author}</span>
              <button
                type="button"
                className="like-list-btn"
                onClick={() => toggleLikeList(list.id)}
              >
                ❤️ {list.likes || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomLists;

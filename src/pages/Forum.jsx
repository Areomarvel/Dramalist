import React, { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'adw_forum_posts';

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [activePost, setActivePost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPosts(loadPosts());
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Image must be under 3MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setImageData(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !authorName.trim()) return;

    const newPost = {
      id: Date.now(),
      author: authorName,
      title: postTitle,
      body: postBody,
      videoUrl: videoUrl,
      imageData: imageData,
      date: new Date().toLocaleString(),
      likes: 0,
      comments: [],
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    savePosts(updated);

    // Reset form
    setPostTitle('');
    setPostBody('');
    setVideoUrl('');
    setImagePreview(null);
    setImageData(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLike = (postId) => {
    const updated = posts.map(p =>
      p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
    );
    setPosts(updated);
    savePosts(updated);
    if (activePost?.id === postId) {
      setActivePost(updated.find(p => p.id === postId));
    }
  };

  const handleAddComment = (postId) => {
    if (!commentText.trim() || !commentAuthor.trim()) return;
    const comment = {
      id: Date.now(),
      author: commentAuthor,
      text: commentText,
      date: new Date().toLocaleString(),
    };
    const updated = posts.map(p =>
      p.id === postId ? { ...p, comments: [...(p.comments || []), comment] } : p
    );
    setPosts(updated);
    savePosts(updated);
    if (activePost?.id === postId) {
      setActivePost(updated.find(p => p.id === postId));
    }
    setCommentText('');
    setCommentAuthor('');
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="app-container">
      {/* Header */}
      <div className="forum-header">
        <div>
          <h1 className="forum-title">💬 Community Forum</h1>
          <p className="forum-subtitle">Share your thoughts, reviews, and discoveries with the community</p>
        </div>
        <button
          className="forum-new-post-btn"
          onClick={() => setShowForm(v => !v)}
          id="forum-new-post"
        >
          {showForm ? '✕ Cancel' : '+ New Post'}
        </button>
      </div>

      {/* New Post Form */}
      {showForm && (
        <div className="forum-form-card">
          <h3 className="forum-form-title">Create a Post</h3>
          <form onSubmit={handleSubmitPost} className="forum-form">
            <input
              type="text"
              placeholder="Your name *"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              required
              className="forum-input"
              id="forum-author-name"
            />
            <input
              type="text"
              placeholder="Post title *"
              value={postTitle}
              onChange={e => setPostTitle(e.target.value)}
              required
              className="forum-input"
              id="forum-post-title"
            />
            <textarea
              placeholder="What's on your mind? Share your drama reviews, recommendations, or thoughts..."
              value={postBody}
              onChange={e => setPostBody(e.target.value)}
              rows={5}
              className="forum-input forum-textarea"
              id="forum-post-body"
            />

            <div className="forum-media-row">
              <div className="forum-upload-area" onClick={() => fileInputRef.current?.click()}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="forum-img-preview" />
                ) : (
                  <div className="forum-upload-placeholder">
                    <span>📷</span>
                    <span>Upload Image</span>
                    <span className="forum-upload-hint">Max 3MB</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="forum-video-input-wrapper">
                <label className="forum-label">🎬 YouTube Video URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  className="forum-input"
                  id="forum-video-url"
                />
                {embedUrl && (
                  <div className="forum-video-preview">
                    <iframe
                      src={embedUrl}
                      title="Video preview"
                      frameBorder="0"
                      allowFullScreen
                      className="forum-iframe-preview"
                    />
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="forum-submit-btn" id="forum-submit">
              📝 Post to Forum
            </button>
          </form>
        </div>
      )}

      {/* Posts Feed */}
      {posts.length === 0 ? (
        <div className="forum-empty">
          <div className="forum-empty-icon">💬</div>
          <h3>No posts yet</h3>
          <p>Be the first to start a conversation!</p>
        </div>
      ) : (
        <div className="forum-feed">
          {posts.map(post => (
            <div key={post.id} className="forum-post-card">
              {/* Post Header */}
              <div className="forum-post-header">
                <div className="forum-post-avatar">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="forum-post-author">{post.author}</span>
                  <span className="forum-post-date">{post.date}</span>
                </div>
              </div>

              {/* Post Content */}
              <h3 className="forum-post-title">{post.title}</h3>
              {post.body && <p className="forum-post-body">{post.body}</p>}

              {/* Image */}
              {post.imageData && (
                <img src={post.imageData} alt="Post image" className="forum-post-image" />
              )}

              {/* Video */}
              {post.videoUrl && getYouTubeEmbedUrl(post.videoUrl) && (
                <div className="forum-post-video">
                  <iframe
                    src={getYouTubeEmbedUrl(post.videoUrl)}
                    title={post.title}
                    frameBorder="0"
                    allowFullScreen
                    className="forum-iframe"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="forum-post-actions">
                <button
                  className="forum-action-btn forum-like-btn"
                  onClick={() => handleLike(post.id)}
                >
                  ❤️ {post.likes || 0} Like{post.likes !== 1 ? 's' : ''}
                </button>
                <button
                  className="forum-action-btn"
                  onClick={() => setActivePost(activePost?.id === post.id ? null : post)}
                >
                  💬 {(post.comments || []).length} Comment{(post.comments || []).length !== 1 ? 's' : ''}
                </button>
              </div>

              {/* Comments Section */}
              {activePost?.id === post.id && (
                <div className="forum-comments-section">
                  <div className="forum-comments-list">
                    {(post.comments || []).length === 0 ? (
                      <p className="forum-no-comments">No comments yet. Start the conversation!</p>
                    ) : (
                      (post.comments || []).map(c => (
                        <div key={c.id} className="forum-comment">
                          <div className="forum-comment-avatar">
                            {c.author.charAt(0).toUpperCase()}
                          </div>
                          <div className="forum-comment-body">
                            <div className="forum-comment-header">
                              <strong>{c.author}</strong>
                              <span className="forum-comment-date">{c.date}</span>
                            </div>
                            <p className="forum-comment-text">{c.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="forum-add-comment">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={commentAuthor}
                      onChange={e => setCommentAuthor(e.target.value)}
                      className="forum-input forum-comment-input"
                    />
                    <div className="forum-comment-input-row">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        className="forum-input"
                        onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                      />
                      <button
                        className="forum-comment-submit"
                        onClick={() => handleAddComment(post.id)}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forum;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../utils/useUserProfile';
import { useProgressTracker } from '../utils/useProgressTracker';

const AVATARS = ['🎭', '🌸', '🍿', '🎬', '🇰🇷', '🇨🇳', '🇯🇵', '🇹🇭', '⭐', '🐲'];

const Profile = () => {
  const { profile, updateProfile } = useUserProfile();
  const { allProgress } = useProgressTracker();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);

  const progressList = Object.values(allProgress);
  const completedCount = progressList.filter(p => p.status === 'completed').length;
  const watchingCount = progressList.filter(p => p.status === 'watching').length;
  const planToWatchCount = progressList.filter(p => p.status === 'plan_to_watch').length;

  // Calculate estimated watch hours (assuming avg 1 hr per ep)
  const totalEpsWatched = progressList.reduce((sum, p) => sum + (p.currentEpisode || 0), 0);
  const totalWatchHours = Math.round(totalEpsWatched * 1.1);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name, bio, avatar });
    setIsEditing(false);
  };

  return (
    <div className="app-container">
      {/* Profile Header Banner */}
      <div className="profile-card">
        <div className="profile-avatar-large">{profile.avatar || '🎭'}</div>
        <div className="profile-info-block">
          <div className="profile-title-row">
            <h1>{profile.name}</h1>
            <button
              type="button"
              className="edit-profile-btn"
              onClick={() => setIsEditing(v => !v)}
            >
              {isEditing ? '✕ Cancel' : '✏️ Edit Profile'}
            </button>
          </div>
          <p className="profile-bio-text">{profile.bio}</p>
          <span className="profile-joined">Member since {profile.joinedDate}</span>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="profile-edit-form">
          <h3>Edit Profile Information</h3>

          <label className="form-label">Avatar Emoji:</label>
          <div className="avatar-picker-grid">
            {AVATARS.map(a => (
              <button
                key={a}
                type="button"
                className={`avatar-option-btn ${avatar === a ? 'selected' : ''}`}
                onClick={() => setAvatar(a)}
              >
                {a}
              </button>
            ))}
          </div>

          <label className="form-label">Display Name:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="profile-input"
          />

          <label className="form-label">Bio / Tagline:</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            className="profile-input"
          />

          <button type="submit" className="save-profile-btn">
            Save Changes
          </button>
        </form>
      )}

      {/* Stats Dashboard Cards */}
      <h2 className="section-title" style={{ marginTop: '36px' }}>📊 Watching Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">⏱️</span>
          <span className="stat-number">{totalWatchHours}</span>
          <span className="stat-label">Hours Watched</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <span className="stat-number">{completedCount}</span>
          <span className="stat-label">Completed Dramas</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📺</span>
          <span className="stat-number">{watchingCount}</span>
          <span className="stat-label">Currently Watching</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔖</span>
          <span className="stat-number">{planToWatchCount}</span>
          <span className="stat-label">Plan to Watch</span>
        </div>
      </div>

      {/* Recent Activity List */}
      <h2 className="section-title" style={{ marginTop: '36px' }}>📜 Recent Activity</h2>
      <div className="activity-list">
        {progressList.length === 0 ? (
          <p className="no-content-msg">No watching activity recorded yet. Start tracking dramas to see stats!</p>
        ) : (
          progressList.map((item, idx) => (
            <div key={idx} className="activity-item-card">
              <span className="activity-icon">
                {item.status === 'completed' ? '✅' : '📺'}
              </span>
              <div className="activity-info">
                <strong>{item.title || 'Drama Title'}</strong>
                <span>
                  {item.status === 'completed'
                    ? 'Completed all episodes!'
                    : `Currently on Episode ${item.currentEpisode || 1} / ${item.totalEpisodes || '?'}`}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;

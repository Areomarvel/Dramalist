import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout, openAuthModal, watchlist, updateProfile: saveUserProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  const completedCount = watchlist.filter(p => p.status === 'completed').length;
  const watchingCount = watchlist.filter(p => p.status === 'watching' || !p.status).length;
  const planToWatchCount = watchlist.filter(p => p.status === 'plan_to_watch').length;

  const totalWatchHours = Math.round(watchlist.length * 16 * 1.1);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await saveUserProfile({ username: username.trim(), bio: bio.trim() });
      setSaveSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="app-container">
        <div className="profile-guest-card">
          <div className="guest-avatar-large">👤</div>
          <h2>Join DramaVault Community</h2>
          <p>
            Create an account or sign in to sync your drama watchlist across all devices,
            track episode progress, and share ratings with fellow fans.
          </p>
          <div className="guest-auth-actions">
            <button
              type="button"
              className="guest-btn signin-btn"
              onClick={() => openAuthModal('login')}
              id="guest-signin-btn"
            >
              Sign In to Your Account
            </button>
            <button
              type="button"
              className="guest-btn signup-btn"
              onClick={() => openAuthModal('register')}
              id="guest-signup-btn"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {saveSuccess && <div className="auth-success-banner">✨ {saveSuccess}</div>}

      {/* Profile Header Banner */}
      <div className="profile-card">
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.username)}`}
          alt={user.username}
          className="profile-avatar-img"
        />
        <div className="profile-info-block">
          <div className="profile-title-row">
            <div>
              <h1>{user.username}</h1>
              <span className="profile-email-badge">{user.email}</span>
            </div>
            <div className="profile-actions-row">
              <button
                type="button"
                className="edit-profile-btn"
                onClick={() => setIsEditing(v => !v)}
              >
                {isEditing ? '✕ Cancel' : '✏️ Edit Profile'}
              </button>
              <button
                type="button"
                className="logout-profile-btn"
                onClick={logout}
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
          <p className="profile-bio-text">{user.bio || 'Asian drama enthusiast & binge watcher.'}</p>
          <span className="profile-joined">
            Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
          </span>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="profile-edit-form">
          <h3>Edit Profile Information</h3>

          <label className="form-label">Username:</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
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

          <button type="submit" className="save-profile-btn" disabled={saveLoading}>
            {saveLoading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Stats Dashboard Cards */}
      <h2 className="section-title" style={{ marginTop: '36px' }}>📊 Watching Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">⏱️</span>
          <span className="stat-number">{totalWatchHours}</span>
          <span className="stat-label">Est. Hours Watched</span>
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

      {/* My Watchlist Quick Overview */}
      <h2 className="section-title" style={{ marginTop: '36px' }}>📜 My Watchlist ({watchlist.length})</h2>
      <div className="activity-list">
        {watchlist.length === 0 ? (
          <p className="no-content-msg">No dramas in your watchlist yet. Browse dramas and click "Add to Watchlist"!</p>
        ) : (
          watchlist.slice(0, 10).map((item) => (
            <div key={item.id} className="activity-item-card">
              <span className="activity-icon">
                {item.status === 'completed' ? '✅' : '📺'}
              </span>
              <div className="activity-info">
                <strong>{item.title}</strong>
                <span>
                  {item.status === 'completed'
                    ? 'Status: Completed'
                    : item.status === 'plan_to_watch'
                    ? 'Status: Plan to Watch'
                    : 'Status: Currently Watching'}
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


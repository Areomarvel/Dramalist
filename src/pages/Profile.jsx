import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme, THEMES } from '../context/ThemeContext';

const defaultGenres = ['Romance', 'Fantasy', 'Mystery'];
const coverOptions = [
  { name: 'Ocean Glow', value: 'linear-gradient(135deg, #081426 0%, #153e75 42%, #8b5cf6 100%)', accent: '#5fb6f8' },
  { name: 'Sunset Rose', value: 'linear-gradient(135deg, #190b10 0%, #5b1027 45%, #f43f5e 100%)', accent: '#fbbf24' },
  { name: 'Forest Mint', value: 'linear-gradient(135deg, #08150f 0%, #0f5d47 40%, #10b981 100%)', accent: '#a7f3d0' },
  { name: 'Golden Hour', value: 'linear-gradient(135deg, #1a1208 0%, #773b12 42%, #f59e0b 100%)', accent: '#fdba74' }
];
const genreOptions = ['Romance', 'Fantasy', 'Mystery', 'Comedy', 'Action', 'Thriller', 'Sci-Fi', 'Historical', 'Slice of Life', 'Melodrama'];

const Profile = () => {
  const { user, logout, openAuthModal, watchlist, updateProfile: saveUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [favoriteGenres, setFavoriteGenres] = useState(user?.favoriteGenres || defaultGenres);
  const [profileCover, setProfileCover] = useState(user?.profileCover || coverOptions[0].value);
  const [coverAccent, setCoverAccent] = useState(user?.coverAccent || coverOptions[0].accent);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  const completedCount = watchlist.filter(p => p.status === 'completed').length;
  const watchingCount = watchlist.filter(p => p.status === 'watching' || !p.status).length;
  const planToWatchCount = watchlist.filter(p => p.status === 'plan_to_watch').length;
  const ratedCount = watchlist.filter(item => Number(item.vote_average) > 0).length;
  const averageRating = ratedCount
    ? (watchlist.reduce((sum, item) => sum + (Number(item.vote_average) || 0), 0) / ratedCount).toFixed(1)
    : '0.0';
  const totalWatchHours = Math.round(watchlist.length * 16 * 1.1);

  const recentItems = useMemo(() => watchlist.slice(0, 4), [watchlist]);

  const achievements = useMemo(() => {
    const items = [];
    if (watchlist.length >= 1) items.push({ icon: '🎉', label: 'First Watchlist' });
    if (completedCount >= 3) items.push({ icon: '🏆', label: 'Drama Finisher' });
    if (watchingCount >= 2) items.push({ icon: '📺', label: 'Binge Starter' });
    if (favoriteGenres.length >= 3) items.push({ icon: '🌟', label: 'Genre Explorer' });
    if (ratedCount >= 2) items.push({ icon: '⭐', label: 'Top Critic' });
    return items.slice(0, 4);
  }, [completedCount, favoriteGenres.length, ratedCount, watchlist.length, watchingCount]);

  const handleGenreToggle = (genre) => {
    setFavoriteGenres(prev =>
      prev.includes(genre)
        ? prev.filter(item => item !== genre)
        : [...prev, genre]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await saveUserProfile({
        username: username.trim(),
        bio: bio.trim(),
        favoriteGenres,
        profileCover,
        coverAccent
      });
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
          <h2>Join DramaInfo Community</h2>
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

      <div className="profile-hero-card" style={{ background: user.profileCover || profileCover }}>
        <div className="profile-hero-overlay" style={{ boxShadow: `inset 0 0 0 1px ${user.coverAccent || coverAccent}` }} />
        <div className="profile-hero-inner">
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
            <div className="profile-meta-row">
              <span className="profile-joined">
                Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
              </span>
              <span className="profile-badge-inline" style={{ borderColor: user.coverAccent || coverAccent }}>
                {watchlist.length} dramas tracked
              </span>
            </div>
          </div>
        </div>
      </div>

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

          <label className="form-label">Favorite Genres:</label>
          <div className="genre-chip-grid">
            {genreOptions.map(genre => (
              <button
                key={genre}
                type="button"
                className={`genre-chip ${favoriteGenres.includes(genre) ? 'selected' : ''}`}
                onClick={() => handleGenreToggle(genre)}
              >
                {genre}
              </button>
            ))}
          </div>

          <label className="form-label">Profile Cover:</label>
          <div className="cover-picker-grid">
            {coverOptions.map(option => (
              <button
                key={option.name}
                type="button"
                className={`cover-swatch ${profileCover === option.value ? 'selected' : ''}`}
                onClick={() => {
                  setProfileCover(option.value);
                  setCoverAccent(option.accent);
                }}
                style={{ background: option.value }}
                title={option.name}
                aria-label={option.name}
              />
            ))}
          </div>

          <button type="submit" className="save-profile-btn" disabled={saveLoading}>
            {saveLoading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      )}

      <div className="profile-overview-grid">
        <div className="profile-mini-card profile-favorites-card">
          <h3>🎧 Favorite Genres</h3>
          <div className="favorite-genre-list">
            {(favoriteGenres.length ? favoriteGenres : defaultGenres).map(genre => (
              <span key={genre} className="favorite-genre-pill">{genre}</span>
            ))}
          </div>
        </div>

        <div className="profile-mini-card profile-achievements-card">
          <h3>🏅 Achievements</h3>
          <div className="achievement-list">
            {achievements.length ? achievements.map(item => (
              <div key={item.label} className="achievement-item">
                <span className="achievement-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            )) : <span className="muted-note">Start tracking dramas to unlock badges</span>}
          </div>
        </div>
      </div>

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
          <span className="stat-icon">⭐</span>
          <span className="stat-number">{averageRating}</span>
          <span className="stat-label">Avg. Rating</span>
        </div>
      </div>

      <div className="profile-lower-grid">
        <div className="profile-mini-card recent-activity-card">
          <h3>🕘 Recently Watched</h3>
          {recentItems.length === 0 ? (
            <p className="no-content-msg">Your recent drama activity will appear here.</p>
          ) : (
            <div className="recent-watch-list">
              {recentItems.map(item => (
                <div key={item.id} className="recent-watch-item">
                  <span className="recent-watch-status">{item.status === 'completed' ? '✅' : '📺'}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.status === 'completed' ? 'Completed' : item.status === 'plan_to_watch' ? 'Plan to Watch' : 'Watching'}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="profile-mini-card profile-summary-card">
          <h3>📌 Profile Summary</h3>
          <ul className="summary-list">
            <li><span>Total tracked:</span> <strong>{watchlist.length}</strong></li>
            <li><span>Plan to watch:</span> <strong>{planToWatchCount}</strong></li>
            <li><span>Rated dramas:</span> <strong>{ratedCount}</strong></li>
            <li><span>Favorite vibe:</span> <strong>{(favoriteGenres.length ? favoriteGenres : defaultGenres)[0]}</strong></li>
          </ul>
        </div>
      </div>

      <h2 className="section-title" style={{ marginTop: '36px' }}>🎨 Appearance & Theme</h2>
      <div className="theme-picker-card">
        <p className="theme-picker-desc">
          Choose a color theme that suits your style. Your preference is saved automatically.
        </p>
        <div className="theme-grid">
          {THEMES.map(t => (
            <button
              key={t.id}
              id={`theme-btn-${t.id}`}
              type="button"
              className={`theme-option-btn${theme === t.id ? ' theme-option-active' : ''}`}
              onClick={() => setTheme(t.id)}
              title={t.description}
            >
              <div className="theme-swatch-row">
                <span className="theme-swatch" style={{ background: t.preview.bg }} />
                <span className="theme-swatch" style={{ background: t.preview.card }} />
                <span
                  className="theme-swatch theme-swatch-accent"
                  style={{ background: t.preview.accent }}
                />
                <span
                  className="theme-swatch theme-swatch-accent2"
                  style={{ background: t.preview.accent2 }}
                />
              </div>
              <span className="theme-option-name">{t.name}</span>
              {theme === t.id && <span className="theme-active-tick">✓ Active</span>}
            </button>
          ))}
        </div>
      </div>

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

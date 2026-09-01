import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatTitle } from '../utils/translateTitle';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '37f536bf16346bfc6cfcefca8f004b89';
const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/multi';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const HamburgerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const Navbar = () => {
  const { user, openAuthModal, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerSearchTerm, setDrawerSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [drawerSuggestions, setDrawerSuggestions] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('asian-drama-theme');
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : true;
    setIsDarkMode(shouldUseDark);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('light-mode', !isDarkMode);
    localStorage.setItem('asian-drama-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
    setShowSearch(false);
  }, [location.pathname]);

  // Focus search input when it appears
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  const buildSuggestionList = (items = []) => {
    return items
      .filter(item => item && (item.media_type === 'movie' || item.media_type === 'tv' || item.media_type === 'person'))
      .slice(0, 6)
      .map(item => {
        const label = formatTitle(
          item.name || item.title,
          item.original_name || item.original_title || item.name || item.title
        ) || item.name || item.title || 'Unknown';

        const type = item.media_type === 'movie'
          ? 'Movie'
          : item.media_type === 'tv'
            ? 'Drama'
            : 'Actor';

        const route = item.media_type === 'person'
          ? `/person/${item.id}`
          : item.media_type === 'movie'
            ? `/movie/${item.id}`
            : `/drama/${item.id}`;

        return { id: `${item.media_type}-${item.id}`, label, type, route };
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setSearchSuggestions([]);
      setShowSearch(false);
    }
  };

  const handleDrawerSearch = (e) => {
    e.preventDefault();
    if (drawerSearchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(drawerSearchTerm.trim())}`);
      setDrawerSearchTerm('');
      setDrawerSuggestions([]);
      setIsDrawerOpen(false);
    }
  };

  const handleSuggestionSelect = (route) => {
    navigate(route);
    setSearchTerm('');
    setDrawerSearchTerm('');
    setSearchSuggestions([]);
    setDrawerSuggestions([]);
    setShowSearch(false);
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const query = searchTerm.trim();
    if (!query) {
      setSearchSuggestions([]);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `${TMDB_SEARCH_URL}?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&include_adult=false`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setSearchSuggestions(buildSuggestionList(data.results || []));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setSearchSuggestions([]);
        }
      }
    }, 220);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
    const query = drawerSearchTerm.trim();
    if (!query) {
      setDrawerSuggestions([]);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `${TMDB_SEARCH_URL}?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&include_adult=false`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setDrawerSuggestions(buildSuggestionList(data.results || []));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setDrawerSuggestions([]);
        }
      }
    }, 220);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [drawerSearchTerm]);

  const navLinks = [
    { to: '/', label: '🏠 Home' },
    { to: '/upcoming', label: '📅 Upcoming' },
    { to: '/schedule', label: '📆 Airing Schedule' },
    { to: '/watchlist', label: '🔖 My Watchlist' },
    { to: '/lists', label: '📜 Curated Lists' },
    { to: '/forum', label: '💬 Forum' },
    { to: '/profile', label: '👤 Profile & Stats' },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="navbar" role="navigation" aria-label="Main navigation">

        {/* LEFT: Hamburger Toggle */}
        <button
          type="button"
          className="nav-hamburger"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open menu"
          id="nav-hamburger"
        >
          <HamburgerIcon />
        </button>

        {/* CENTER: Brand Logo */}
        <Link to="/" className="logo-link navbar-logo-center" aria-label="DramaVault Home">
          <img src="/logo.png" alt="DramaVault" className="nav-logo" />
        </Link>

        {/* RIGHT: Actions */}
        <div className="nav-actions">
          {/* Desktop Search Icon */}
          <button
            type="button"
            className="nav-icon-btn desktop-search-btn"
            onClick={() => setShowSearch(v => !v)}
            aria-label="Search"
            id="nav-search-toggle"
          >
            <SearchIcon />
          </button>

          {/* User Auth Profile / Login Button */}
          {user ? (
            <Link to="/profile" className="nav-user-pill" title={`Logged in as ${user.username}`}>
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.username)}`}
                alt={user.username}
                className="nav-user-avatar"
              />
              <span className="nav-user-name">{user.username}</span>
            </Link>
          ) : (
            <button
              type="button"
              className="nav-auth-btn"
              onClick={() => openAuthModal('login')}
              id="nav-signin-btn"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Expandable Search Bar (Desktop) */}
      {showSearch && (
        <div className="navbar-search-bar">
          <form onSubmit={handleSearch} className="navbar-search-form">
            <SearchIcon />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search dramas, movies, actors..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="navbar-search-input"
              id="navbar-search-input"
            />
            <button type="submit" className="navbar-search-submit">Search</button>
            <button
              type="button"
              className="navbar-search-close"
              onClick={() => setShowSearch(false)}
              aria-label="Close search"
            >
              <CloseIcon />
            </button>
            {searchSuggestions.length > 0 && (
              <div className="search-suggestions-panel">
                {searchSuggestions.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    className="search-suggestion-item"
                    onClick={() => handleSuggestionSelect(item.route)}
                  >
                    <span className="search-suggestion-label">{item.label}</span>
                    <span className="search-suggestion-type">{item.type}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      )}

      {/* Drawer Overlay */}
      <div
        className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Side Drawer */}
      <aside className={`side-drawer ${isDrawerOpen ? 'open' : ''}`} aria-label="Site menu">
        <div className="drawer-header">
          <Link to="/" className="drawer-logo-link" onClick={() => setIsDrawerOpen(false)}>
            <img src="/logo.png" alt="DramaVault" className="drawer-logo" />
            <span className="drawer-site-name">DramaVault</span>
          </Link>
          <button
            type="button"
            className="drawer-close"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close menu"
            id="drawer-close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Embedded Drawer Search Input */}
        <div className="drawer-search-box">
          <form onSubmit={handleDrawerSearch} className="drawer-search-form">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search dramas, movies, actors..."
              value={drawerSearchTerm}
              onChange={e => setDrawerSearchTerm(e.target.value)}
              className="drawer-search-input"
              id="drawer-search-input"
            />
            <button type="submit" className="drawer-search-btn">Go</button>
            {drawerSuggestions.length > 0 && (
              <div className="search-suggestions-panel drawer-suggestions-panel">
                {drawerSuggestions.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    className="search-suggestion-item"
                    onClick={() => handleSuggestionSelect(item.route)}
                  >
                    <span className="search-suggestion-label">{item.label}</span>
                    <span className="search-suggestion-type">{item.type}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* User Account Drawer Card */}
        <div className="drawer-account-box">
          {user ? (
            <div className="drawer-user-info">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.username)}`}
                alt={user.username}
                className="drawer-user-avatar"
              />
              <div className="drawer-user-text">
                <span className="drawer-username">{user.username}</span>
                <span className="drawer-email">{user.email}</span>
              </div>
              <button
                type="button"
                className="drawer-logout-btn"
                onClick={() => {
                  logout();
                  setIsDrawerOpen(false);
                }}
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="drawer-auth-prompt">
              <p>Sign in to sync your drama watchlist and stats!</p>
              <div className="drawer-auth-buttons">
                <button
                  type="button"
                  className="drawer-signin-btn"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    openAuthModal('login');
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="drawer-signup-btn"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    openAuthModal('register');
                  }}
                >
                  Create Account
                </button>
              </div>
            </div>
          )}
        </div>

        <nav className="drawer-nav">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`drawer-link ${location.pathname === link.to || location.hash === `#${link.to}` ? 'active' : ''}`}
              onClick={() => setIsDrawerOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="drawer-footer">
          <div className="drawer-theme-row">
            <span className="drawer-theme-label">Theme</span>
            <button
              type="button"
              className={`theme-pill large ${!isDarkMode ? 'light' : ''}`}
              onClick={() => setIsDarkMode(prev => !prev)}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="pill-track">
                <span className="pill-thumb">{isDarkMode ? '🌙' : '☀️'}</span>
              </span>
            </button>
          </div>
          <p className="drawer-copyright">© {new Date().getFullYear()} DramaVault</p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;

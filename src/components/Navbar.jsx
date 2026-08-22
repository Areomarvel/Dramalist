import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setShowSearch(false);
    }
  };

  const handleDrawerSearch = (e) => {
    e.preventDefault();
    if (drawerSearchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(drawerSearchTerm.trim())}`);
      setDrawerSearchTerm('');
      setIsDrawerOpen(false);
    }
  };

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
        <Link to="/" className="logo-link navbar-logo-center" aria-label="AsianDramaWiki Home">
          <img src="/logo.png" alt="AsianDramaWiki" className="nav-logo" />
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
            <img src="/logo.png" alt="AsianDramaWiki" className="drawer-logo" />
            <span className="drawer-site-name">AsianDramaWiki</span>
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
          <p className="drawer-copyright">© {new Date().getFullYear()} AsianDramaWiki</p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;

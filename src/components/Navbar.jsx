import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const HamburgerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const Navbar = ({ toggleTheme, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
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
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setShowSearch(false);
    }
  };

  const navLinks = [
    { to: '/', label: '🏠 Home' },
    { to: '/upcoming', label: '📅 Upcoming' },
    { to: '/forum', label: '💬 Forum' },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="navbar" role="navigation" aria-label="Main navigation">

        {/* LEFT: Hamburger */}
        <button
          type="button"
          className="nav-hamburger"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open menu"
          id="nav-hamburger"
        >
          <HamburgerIcon />
        </button>

        {/* CENTER: Logo */}
        <Link to="/" className="logo-link navbar-logo-center" aria-label="AsianDramaWiki Home">
          <img src="/logo.png" alt="AsianDramaWiki" className="nav-logo" />
        </Link>

        {/* RIGHT: Actions */}
        <div className="nav-actions">
          {/* Search Icon */}
          <button
            type="button"
            className="nav-icon-btn"
            onClick={() => setShowSearch(v => !v)}
            aria-label="Search"
            id="nav-search-toggle"
          >
            <SearchIcon />
          </button>

          {/* Dark/Light Pill Toggle */}
          <button
            type="button"
            className={`theme-pill ${isDarkMode ? 'dark' : 'light'}`}
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            id="theme-toggle-pill"
          >
            <span className="pill-track">
              <span className="pill-thumb">
                {isDarkMode ? <MoonIcon /> : <SunIcon />}
              </span>
            </span>
          </button>
        </div>
      </nav>

      {/* Expandable Search Bar */}
      {showSearch && (
        <div className="navbar-search-bar">
          <form onSubmit={handleSearch} className="navbar-search-form">
            <SearchIcon />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search dramas, actors..."
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
            <span className="drawer-theme-label">
              {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </span>
            <button
              className={`theme-pill ${isDarkMode ? 'dark' : 'light'} large`}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <span className="pill-track">
                <span className="pill-thumb">
                  {isDarkMode ? <MoonIcon /> : <SunIcon />}
                </span>
              </span>
            </button>
          </div>
          <p className="drawer-copyright">© {new Date().getFullYear()} AsianDramaWiki</p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;

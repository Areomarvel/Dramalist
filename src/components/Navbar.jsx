import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ toggleTheme, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setShowSearch(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="logo-link" onClick={() => setIsMenuOpen(false)}>
          <img src="/logo.png" alt="AsianDramaWiki Logo" className="nav-logo" />
          <span className="logo">AsianDramaWiki</span>
        </Link>

        <button
          type="button"
          className="burger-button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
          Home
        </Link>
        <Link to="/upcoming" className="nav-link" onClick={() => setIsMenuOpen(false)}>
          Upcoming
        </Link>
      </div>

      <div className="nav-actions">
        <button
          type="button"
          className="search-toggle"
          onClick={() => setShowSearch((visible) => !visible)}
          aria-label="Search"
        >
          🔍
        </button>

        <form onSubmit={handleSearch} className={`search-box ${showSearch ? 'visible' : ''}`}>
          <input
            type="text"
            placeholder="Search dramas, actors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <button onClick={toggleTheme} className="theme-toggle" title="Toggle Theme">
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

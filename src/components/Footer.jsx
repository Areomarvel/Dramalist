import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-brand-col">
          <Link to="/" className="footer-logo-link">
            <img src="/logo.png" alt="AsianDramaWiki" className="footer-logo" />
            <span className="footer-site-name">AsianDramaWiki</span>
          </Link>
          <p className="footer-tagline">
            Your ultimate destination for K-Dramas, C-Dramas, J-Dramas, Thai Dramas, Anime &amp; Cartoons. Discover ratings, reviews, full cast filmography, streaming links, and community discussions.
          </p>
          <div className="footer-social-row">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Twitter">
              🐦
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram">
              📸
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="YouTube">
              ▶️
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Discord">
              💬
            </a>
          </div>
        </div>

        <div className="footer-nav-group">
          <div className="footer-links-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/">🏠 Home</Link></li>
              <li><Link to="/upcoming">📅 Upcoming</Link></li>
              <li><Link to="/schedule">📆 Airing Schedule</Link></li>
              <li><Link to="/watchlist">🔖 My Watchlist</Link></li>
              <li><Link to="/lists">📜 Curated Lists</Link></li>
              <li><Link to="/forum">💬 Community Forum</Link></li>
              <li><Link to="/profile">👤 Profile &amp; Stats</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links-list">
              <li><Link to="/">🇰🇷 K-Dramas</Link></li>
              <li><Link to="/">🇨🇳 C-Dramas</Link></li>
              <li><Link to="/">🇯🇵 J-Dramas</Link></li>
              <li><Link to="/">🇹🇭 Thai Dramas</Link></li>
              <li><Link to="/">🌸 Anime</Link></li>
              <li><Link to="/">🎨 Cartoons</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-links-col">
          <h4 className="footer-heading">Community</h4>
          <p className="footer-community-text">
            Join thousands of Asian drama fans. Share reviews, track your watchlists, and discuss the latest episodes!
          </p>
          <Link to="/forum" className="footer-cta-btn">
            💬 Join Discussions
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} AsianDramaWiki. All rights reserved. Data powered by TMDB API.</p>
      </div>
    </footer>
  );
};

export default Footer;

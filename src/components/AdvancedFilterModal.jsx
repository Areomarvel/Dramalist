import React, { useState } from 'react';

const GENRES = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16,    name: 'Animation / Anime' },
  { id: 35,    name: 'Comedy' },
  { id: 18,    name: 'Drama' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 9648,  name: 'Mystery' },
  { id: 10768, name: 'War & Politics' },
  { id: 10749, name: 'Romance' },
];

const COUNTRIES = [
  { code: 'KR', label: '🇰🇷 South Korea (K-Drama)' },
  { code: 'CN', label: '🇨🇳 China (C-Drama)' },
  { code: 'JP', label: '🇯🇵 Japan (J-Drama)' },
  { code: 'TH', label: '🇹🇭 Thailand (Thai Drama)' },
];

const AdvancedFilterModal = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  const [selectedGenre, setSelectedGenre] = useState(currentFilters?.genre || '');
  const [selectedCountry, setSelectedCountry] = useState(currentFilters?.country || '');
  const [minRating, setMinRating] = useState(currentFilters?.minRating || 0);
  const [startYear, setStartYear] = useState(currentFilters?.startYear || '');

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters({
      genre: selectedGenre,
      country: selectedCountry,
      minRating: Number(minRating),
      startYear,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedGenre('');
    setSelectedCountry('');
    setMinRating(0);
    setStartYear('');
    onApplyFilters({});
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="filter-modal-content" onClick={e => e.stopPropagation()}>
        <div className="filter-modal-header">
          <h3>🎛️ Advanced Search &amp; Discovery Filters</h3>
          <button type="button" className="close-filter-btn" onClick={onClose}>✕</button>
        </div>

        <div className="filter-modal-body">
          {/* Country Selection */}
          <div className="filter-group">
            <label className="filter-label">Origin Country:</label>
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="filter-select"
            >
              <option value="">All Countries</option>
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Genre Selection */}
          <div className="filter-group">
            <label className="filter-label">Genre / Category:</label>
            <div className="genre-chips-grid">
              <button
                type="button"
                className={`genre-chip ${selectedGenre === '' ? 'active' : ''}`}
                onClick={() => setSelectedGenre('')}
              >
                All Genres
              </button>
              {GENRES.map(g => (
                <button
                  key={g.id}
                  type="button"
                  className={`genre-chip ${selectedGenre === String(g.id) ? 'active' : ''}`}
                  onClick={() => setSelectedGenre(String(g.id))}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          {/* Min Rating Slider */}
          <div className="filter-group">
            <label className="filter-label">Minimum Rating: <strong>⭐ {minRating > 0 ? `${minRating}+` : 'Any'}</strong></label>
            <input
              type="range"
              min="0"
              max="9"
              step="1"
              value={minRating}
              onChange={e => setMinRating(e.target.value)}
              className="rating-slider"
            />
          </div>

          {/* Airing Year */}
          <div className="filter-group">
            <label className="filter-label">Release Year (From):</label>
            <select
              value={startYear}
              onChange={e => setStartYear(e.target.value)}
              className="filter-select"
            >
              <option value="">Any Year</option>
              {Array.from({ length: 15 }, (_, i) => 2026 - i).map(y => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-modal-footer">
          <button type="button" className="filter-reset-btn" onClick={handleReset}>
            Reset Filters
          </button>
          <button type="button" className="filter-apply-btn" onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilterModal;

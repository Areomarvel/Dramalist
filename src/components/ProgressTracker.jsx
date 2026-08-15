import React, { useState } from 'react';
import { useProgressTracker } from '../utils/useProgressTracker';

const STATUS_OPTIONS = [
  { key: 'watching', label: '📺 Watching', color: '#58a6ff' },
  { key: 'completed', label: '✅ Completed', color: '#3fb950' },
  { key: 'plan_to_watch', label: '🔖 Plan to Watch', color: '#f0c040' },
  { key: 'on_hold', label: '⏸️ On-Hold', color: '#d29922' },
  { key: 'dropped', label: '❌ Dropped', color: '#f85149' },
];

const ProgressTracker = ({ dramaId, totalEpisodes = 16, dramaTitle = '' }) => {
  const { progress, updateProgress, removeProgress } = useProgressTracker(dramaId);
  const [isOpen, setIsOpen] = useState(false);

  const status = progress?.status || null;
  const currentEp = progress?.currentEpisode || 0;

  const currentOption = STATUS_OPTIONS.find(o => o.key === status);

  const handleStatusSelect = (statusKey) => {
    updateProgress(dramaId, {
      status: statusKey,
      currentEpisode: statusKey === 'completed' ? totalEpisodes : (currentEp || 1),
      totalEpisodes,
      title: dramaTitle,
    });
  };

  const handleEpChange = (newEp) => {
    const validEp = Math.max(0, Math.min(totalEpisodes || 99, newEp));
    updateProgress(dramaId, {
      status: status || 'watching',
      currentEpisode: validEp,
      totalEpisodes,
      title: dramaTitle,
    });
  };

  return (
    <div className="progress-tracker-container">
      <div className="progress-status-bar">
        <button
          type="button"
          className={`progress-main-btn ${status ? 'active' : ''}`}
          onClick={() => setIsOpen(v => !v)}
          style={{ borderColor: currentOption ? currentOption.color : undefined }}
        >
          {currentOption ? currentOption.label : '➕ Add to Progress'}
        </button>

        {status && (
          <div className="progress-ep-counter">
            <button
              type="button"
              className="ep-step-btn"
              onClick={() => handleEpChange(currentEp - 1)}
              disabled={currentEp <= 0}
            >
              -
            </button>
            <span className="ep-counter-text">
              Ep <strong>{currentEp}</strong> / {totalEpisodes || '?'}
            </span>
            <button
              type="button"
              className="ep-step-btn"
              onClick={() => handleEpChange(currentEp + 1)}
              disabled={totalEpisodes && currentEp >= totalEpisodes}
            >
              +
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="progress-dropdown-menu">
          <p className="dropdown-title">Select Watching Status:</p>
          <div className="dropdown-options">
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.key}
                type="button"
                className={`dropdown-opt-btn ${status === opt.key ? 'selected' : ''}`}
                onClick={() => {
                  handleStatusSelect(opt.key);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {status && (
            <button
              type="button"
              className="dropdown-remove-btn"
              onClick={() => {
                removeProgress(dramaId);
                setIsOpen(false);
              }}
            >
              🗑️ Remove from Progress
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;

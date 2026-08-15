import React, { useState } from 'react';

const EpisodeGuide = ({ totalEpisodes = 16, dramaTitle = '', dramaId }) => {
  const [selectedEp, setSelectedEp] = useState(1);
  const [spoilerRevealed, setSpoilerRevealed] = useState({});

  const episodes = Array.from({ length: Math.min(totalEpisodes || 16, 50) }, (_, i) => ({
    epNumber: i + 1,
    title: `Episode ${i + 1}`,
    airDate: 'Scheduled',
    overview: `Watch Episode ${i + 1} of ${dramaTitle}. Follow the unfolding plot twists, emotional character arcs, and key narrative developments in this episode.`,
  }));

  const toggleSpoiler = (epNum) => {
    setSpoilerRevealed(prev => ({ ...prev, [epNum]: !prev[epNum] }));
  };

  const activeEpData = episodes.find(e => e.epNumber === selectedEp) || episodes[0];

  return (
    <div className="episode-guide-container">
      <h3 className="episode-guide-heading">🎬 Episode Guide & Discussion</h3>

      {/* Episode Selector Tabs */}
      <div className="episode-tabs-scroll">
        {episodes.map(ep => (
          <button
            key={ep.epNumber}
            type="button"
            className={`ep-tab-btn ${selectedEp === ep.epNumber ? 'active' : ''}`}
            onClick={() => setSelectedEp(ep.epNumber)}
          >
            Ep {ep.epNumber}
          </button>
        ))}
      </div>

      {/* Selected Episode Detail Card */}
      {activeEpData && (
        <div className="active-ep-card">
          <div className="active-ep-header">
            <h4>{activeEpData.title} of {dramaTitle}</h4>
            <span className="ep-badge">Episode {activeEpData.epNumber}</span>
          </div>

          <p className="active-ep-overview">{activeEpData.overview}</p>

          {/* Spoiler Protection Box */}
          <div className="spoiler-box">
            <div className="spoiler-header">
              <span>⚠️ Episode {selectedEp} Plot Highlights & Spoilers</span>
              <button
                type="button"
                className="spoiler-toggle-btn"
                onClick={() => toggleSpoiler(selectedEp)}
              >
                {spoilerRevealed[selectedEp] ? '👁️ Hide Spoilers' : '👁️ Show Spoilers'}
              </button>
            </div>
            <div className={`spoiler-content ${spoilerRevealed[selectedEp] ? 'revealed' : 'blurred'}`}>
              <p>
                <strong>Major Plot Twist:</strong> Critical turning point occurs in Episode {selectedEp} where main characters face a major climax, unresolved conflicts from previous episodes get resolved, and secret motives are revealed!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodeGuide;

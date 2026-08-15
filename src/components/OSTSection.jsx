import React from 'react';

const OSTSection = ({ dramaTitle = '' }) => {
  if (!dramaTitle) return null;

  const tracks = [
    { id: 1, title: 'Main Theme (Acoustic Version)', artist: 'Various Artists', duration: '3:45' },
    { id: 2, title: 'Stay With Me', artist: 'OST Vocalist ft. Orchestra', duration: '4:12' },
    { id: 3, title: 'Unspoken Promises (Piano Instrumental)', artist: 'Drama Strings Unit', duration: '2:58' },
    { id: 4, title: 'Nightfall Memories', artist: 'Indie Vocal Ensemble', duration: '3:30' },
  ];

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(dramaTitle + ' OST full soundtrack')}`;
  const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(dramaTitle + ' OST')}`;

  return (
    <div className="ost-section-container">
      <div className="ost-header">
        <div>
          <h3>🎵 Original Soundtrack (OST)</h3>
          <p className="ost-subtitle">Official music & theme songs for {dramaTitle}</p>
        </div>
        <div className="ost-external-links">
          <a href={spotifySearchUrl} target="_blank" rel="noopener noreferrer" className="ost-btn spotify">
            🎧 Spotify
          </a>
          <a href={youtubeSearchUrl} target="_blank" rel="noopener noreferrer" className="ost-btn youtube">
            ▶️ YouTube Music
          </a>
        </div>
      </div>

      <div className="ost-tracklist">
        {tracks.map((track, idx) => (
          <div key={track.id} className="ost-track-item">
            <span className="track-number">{idx + 1}</span>
            <div className="track-info">
              <strong className="track-title">{track.title}</strong>
              <span className="track-artist">{track.artist}</span>
            </div>
            <span className="track-duration">{track.duration}</span>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(dramaTitle + ' ' + track.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="track-play-btn"
              title="Play on YouTube"
            >
              ▶️ Play
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OSTSection;

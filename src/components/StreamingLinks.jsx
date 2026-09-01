const PROVIDERS = [
  { name: 'Netflix', icon: '🎬', color: '#E50914', searchUrl: (t) => `https://www.netflix.com/search?q=${encodeURIComponent(t)}` },
  { name: 'Viki (Rakuten)', icon: '🍿', color: '#00A4E4', searchUrl: (t) => `https://www.viki.com/search?q=${encodeURIComponent(t)}` },
  { name: 'iQIYI', icon: '🌟', color: '#00C853', searchUrl: (t) => `https://www.iq.com/search?query=${encodeURIComponent(t)}` },
  { name: 'WeTV (Tencent)', icon: '📺', color: '#FF9800', searchUrl: (t) => `https://wetv.vip/en/search?q=${encodeURIComponent(t)}` },
  { name: 'Disney+', icon: '✨', color: '#113CCF', searchUrl: (t) => `https://www.disneyplus.com/search?q=${encodeURIComponent(t)}` },
  { name: 'YouTube', icon: '▶️', color: '#FF0000', searchUrl: (t) => `https://www.youtube.com/results?search_query=${encodeURIComponent(t + ' full episode english sub')}` },
];

const StreamingLinks = ({ title = '' }) => {
  if (!title) return null;

  return (
    <div className="streaming-links-container">
      <h4 className="streaming-title">🌐 Where to Watch Official Streams</h4>
      <div className="streaming-badges-grid">
        {PROVIDERS.map(p => (
          <a
            key={p.name}
            href={p.searchUrl(title)}
            target="_blank"
            rel="noopener noreferrer"
            className="streaming-badge-card"
            style={{ '--provider-color': p.color }}
          >
            <span className="provider-icon">{p.icon}</span>
            <span className="provider-name">{p.name}</span>
            <span className="provider-arrow">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default StreamingLinks;

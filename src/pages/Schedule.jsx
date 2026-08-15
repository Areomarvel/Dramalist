import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DAYS = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];

const SCHEDULE_DATA = {
  mon: [
    { id: 114472, title: 'Crash Course in Romance', country: '🇰🇷 KR', network: 'tvN / Netflix', ep: 'Ep 9', time: '21:10 KST', poster: '/4DkhYvO2z6ZkH8K2f5l3A0Wf6J.jpg' },
    { id: 136283, title: 'Business Proposal', country: '🇰🇷 KR', network: 'SBS / Netflix', ep: 'Ep 5', time: '22:00 KST', poster: '/3Yg2mR46a48x5rJ6D7K9xQ2P6d.jpg' },
  ],
  tue: [
    { id: 124580, title: 'Love Between Fairy and Devil', country: '🇨🇳 CN', network: 'iQIYI', ep: 'Ep 14', time: '20:00 CST', poster: '/p8Q4m2R8x0L2.jpg' },
  ],
  wed: [
    { id: 92685, title: 'The Untamed', country: '🇨🇳 CN', network: 'Tencent Video', ep: 'Ep 22', time: '20:00 CST', poster: '/k5vC5p4eY6J2D9mF3k8Q7W.jpg' },
  ],
  thu: [
    { id: 114472, title: 'Crash Course in Romance', country: '🇰🇷 KR', network: 'tvN / Netflix', ep: 'Ep 10', time: '21:10 KST', poster: '/4DkhYvO2z6ZkH8K2f5l3A0Wf6J.jpg' },
  ],
  fri: [
    { id: 136283, title: 'Business Proposal', country: '🇰🇷 KR', network: 'SBS / Netflix', ep: 'Ep 6', time: '22:00 KST', poster: '/3Yg2mR46a48x5rJ6D7K9xQ2P6d.jpg' },
  ],
  sat: [
    { id: 124580, title: 'Love Between Fairy and Devil', country: '🇨🇳 CN', network: 'iQIYI', ep: 'Ep 15', time: '20:00 CST', poster: '/p8Q4m2R8x0L2.jpg' },
  ],
  sun: [
    { id: 92685, title: 'The Untamed', country: '🇨🇳 CN', network: 'Tencent Video', ep: 'Ep 23', time: '20:00 CST', poster: '/k5vC5p4eY6J2D9mF3k8Q7W.jpg' },
  ],
};

const Schedule = () => {
  const [activeDay, setActiveDay] = useState('mon');
  const navigate = useNavigate();

  const currentDramas = SCHEDULE_DATA[activeDay] || [];

  return (
    <div className="app-container">
      <div className="page-hero-header">
        <h1>📅 Weekly Airing Schedule</h1>
        <p className="detail-overview">Track currently broadcasting dramas and upcoming episode release times by day.</p>
      </div>

      {/* Day Selector Tabs */}
      <div className="schedule-day-tabs">
        {DAYS.map(d => (
          <button
            key={d.key}
            type="button"
            className={`schedule-tab-btn ${activeDay === d.key ? 'active' : ''}`}
            onClick={() => setActiveDay(d.key)}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Airing Cards List */}
      <div className="schedule-list">
        {currentDramas.length === 0 ? (
          <div className="no-content-msg">
            <p>No major dramas scheduled for {DAYS.find(d => d.key === activeDay)?.label} yet.</p>
          </div>
        ) : (
          currentDramas.map(item => (
            <div
              key={`${item.id}-${item.ep}`}
              className="schedule-card"
              onClick={() => navigate(`/drama/${item.id}`)}
            >
              <div className="schedule-time-badge">{item.time}</div>
              <div className="schedule-info">
                <span className="schedule-country">{item.country}</span>
                <h3 className="schedule-title">{item.title}</h3>
                <span className="schedule-meta">{item.network} • {item.ep}</span>
              </div>
              <button type="button" className="schedule-view-btn">View Drama →</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Schedule;

import React from 'react';

const DiscoveryPills = ({ items = [], selected = '', onSelect }) => {
  if (!items.length) return null;

  return (
    <div className="discovery-pills-wrap">
      {items.map(item => (
        <button
          key={item.id || item.label}
          type="button"
          className={`discovery-pill ${selected === (item.value || item.label) ? 'active' : ''}`}
          onClick={() => onSelect(item.value || item.label)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default DiscoveryPills;

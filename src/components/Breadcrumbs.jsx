import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav className="breadcrumbs-nav" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        <li className="breadcrumb-item">
          <Link to="/">🏠 Home</Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="breadcrumb-item">
            <span className="breadcrumb-separator">/</span>
            {item.to ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span className="breadcrumb-current" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

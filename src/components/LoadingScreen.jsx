import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onDone }) => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1600);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      if (onDone) onDone();
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [onDone]);

  if (!visible) return null;

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-logo-wrapper">
          <div className="loading-ring"></div>
          <div className="loading-ring ring-2"></div>
          <img src="/logo.png" alt="DramaInfo" className="loading-logo" />
        </div>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p className="loading-text">DramaInfo</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

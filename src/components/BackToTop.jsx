import React, { useEffect, useState } from 'react';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    setClicking(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setClicking(false), 600);
  };

  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''} ${clicking ? 'clicking' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      id="back-to-top-btn"
    >
      ↑
    </button>
  );
};

export default BackToTop;

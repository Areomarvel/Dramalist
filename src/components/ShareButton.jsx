import React, { useState } from 'react';

const ShareButton = ({ title, text }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    e.stopPropagation();
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: title || document.title, text: text || '', url });
      } catch {
        // User cancelled — do nothing
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback: select & copy
        const el = document.createElement('textarea');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <button
      className={`share-btn ${copied ? 'copied' : ''}`}
      onClick={handleShare}
      aria-label="Share this page"
      id="share-btn"
    >
      {copied ? '✓ Copied!' : '🔗 Share'}
    </button>
  );
};

export default ShareButton;

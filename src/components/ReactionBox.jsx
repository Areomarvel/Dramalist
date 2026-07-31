import React, { useState, useEffect } from 'react';

const ReactionBox = ({ targetId, type = 'drama' }) => {
  const storageKey = `reactions_${type}_${targetId}`;
  
  const [reactions, setReactions] = useState({
    like: 0,
    love: 0,
    shock: 0,
    sad: 0
  });

  const [hasReacted, setHasReacted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setReactions(JSON.parse(saved));
    }
    
    // Simple check if this user reacted (just in local session for demo)
    const userReacted = localStorage.getItem(`${storageKey}_user`);
    if (userReacted) setHasReacted(true);
  }, [storageKey]);

  const handleReact = (reactionType) => {
    if (hasReacted) return;

    const newReactions = { ...reactions, [reactionType]: reactions[reactionType] + 1 };
    setReactions(newReactions);
    setHasReacted(true);
    
    localStorage.setItem(storageKey, JSON.stringify(newReactions));
    localStorage.setItem(`${storageKey}_user`, 'true');
  };

  return (
    <div className="reaction-box">
      <h4>Reactions {hasReacted && <span className="reacted-text">(You reacted)</span>}</h4>
      <div className="reaction-buttons">
        <button 
          className={`react-btn ${hasReacted ? 'disabled' : ''}`}
          onClick={() => handleReact('like')}
          disabled={hasReacted}
        >
          👍 {reactions.like}
        </button>
        <button 
          className={`react-btn ${hasReacted ? 'disabled' : ''}`}
          onClick={() => handleReact('love')}
          disabled={hasReacted}
        >
          ❤️ {reactions.love}
        </button>
        <button 
          className={`react-btn ${hasReacted ? 'disabled' : ''}`}
          onClick={() => handleReact('shock')}
          disabled={hasReacted}
        >
          😲 {reactions.shock}
        </button>
        <button 
          className={`react-btn ${hasReacted ? 'disabled' : ''}`}
          onClick={() => handleReact('sad')}
          disabled={hasReacted}
        >
          😢 {reactions.sad}
        </button>
      </div>
    </div>
  );
};

export default ReactionBox;

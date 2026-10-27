import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getReactions, addReaction } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const buttons = [
  { type: 'rocket', emoji: '🚀' },
  { type: 'mindBlown', emoji: '🤯' },
  { type: 'skeptical', emoji: '🤨' },
];

// 3 reaction buttons with counts
function ReactionBar({ articleId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [counts, setCounts] = useState({ rocket: 0, mindBlown: 0, skeptical: 0 });

  // Load the counts when the component appears
  useEffect(() => {
    getReactions(articleId).then(setCounts).catch(() => {});
  }, [articleId]);

  // When a button is clicked, tell the backend and update the numbers
  const handleClick = async (type) => {
    if (!user) return navigate('/login', { state: { from: location.pathname } }); // login needed
    const updated = await addReaction(articleId, type);
    setCounts(updated);
  };

  return (
    <div className="reactions">
      {buttons.map((b) => (
        <button key={b.type} className="reaction-btn" onClick={() => handleClick(b.type)}>
          <span className="emoji">{b.emoji}</span> {counts[b.type]}
        </button>
      ))}
    </div>
  );
}

export default ReactionBar;

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getComments, postComment } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import CommentItem from './CommentItem.jsx';

// Comment form + list of all comments for one article
function CommentSection({ articleId }) {
  const [comments, setComments] = useState([]); // flat list from the backend
  const { user } = useAuth();
  const location = useLocation();
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const loadComments = () => getComments(articleId).then(setComments).catch(() => {});

  useEffect(() => {
    loadComments();
  }, [articleId]);

  // Used for both new comments and replies (parentId is empty for new comments)
  const addComment = async ({ parentId, text }) => {
    await postComment({ articleId, parentId, text });
    await loadComments();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please write a comment.');
      return;
    }
    setError('');
    try {
      await addComment({ parentId: null, text });
      setText(''); // clear the comment box
    } catch (err) {
      setError(err.response?.data?.message || 'Could not post comment.');
    }
  };

  // Only top-level comments (no parent). Replies are shown inside CommentItem.
  const topLevel = comments.filter((c) => !c.parent);

  return (
    <section className="comments">
      <h2>Discussion ({comments.length})</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <p className="meta">Commenting as <strong>{user.name}</strong></p>
          <textarea
            placeholder="What do you think?"
            value={text}
            maxLength={500}
            onChange={(e) => setText(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn">Post comment</button>
        </form>
      ) : (
        <p className="empty">
          <Link to="/login" state={{ from: location.pathname }}>Log in</Link> or{' '}
          <Link to="/signup" state={{ from: location.pathname }}>sign up</Link> to join the discussion.
        </p>
      )}

      {topLevel.length === 0 && <p className="empty">No comments yet. Start the discussion.</p>}
      {topLevel.map((c) => (
        <CommentItem key={c._id} comment={c} allComments={comments} onAdd={addComment} />
      ))}
    </section>
  );
}

export default CommentSection;

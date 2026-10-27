import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

// One comment. It shows its replies by using itself again (this is called recursion).
function CommentItem({ comment, allComments, onAdd }) {
  const [showReply, setShowReply] = useState(false);
  const { user } = useAuth();
  const [text, setText] = useState('');

  // Find the replies that belong to this comment
  const replies = allComments.filter((c) => c.parent === comment._id);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await onAdd({ parentId: comment._id, text });
    setText('');
    setShowReply(false);
  };

  return (
    <div className="comment">
      <p className="comment-head">
        <strong>{comment.name}</strong>
        <span className="meta"> {new Date(comment.createdAt).toLocaleString()}</span>
      </p>
      <p>{comment.text}</p>
      {user && (
        <button className="link-btn" onClick={() => setShowReply(!showReply)}>
          {showReply ? 'Cancel' : 'Reply'}
        </button>
      )}

      {showReply && (
        <form onSubmit={handleReply} className="comment-form reply-form">
          <textarea placeholder="Write a reply" value={text} maxLength={500} onChange={(e) => setText(e.target.value)} />
          <button type="submit" className="btn">Post reply</button>
        </form>
      )}

      {/* Replies are shown indented under the comment */}
      {replies.length > 0 && (
        <div className="replies">
          {replies.map((r) => (
            <CommentItem key={r._id} comment={r} allComments={allComments} onAdd={onAdd} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;

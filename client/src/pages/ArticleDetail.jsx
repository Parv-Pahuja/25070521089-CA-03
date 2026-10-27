import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { getArticle, getSaved, saveArticle, unsaveArticle } from '../services/api.js';
import ReactionBar from '../components/ReactionBar.jsx';
import CommentSection from '../components/CommentSection.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Full page for one article
function ArticleDetail() {
  const { id } = useParams(); // the article id from the URL
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [article, setArticle] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getArticle(id).then(setArticle).catch(() => setError('Article not found.'));
    // check if this article is already in the Mission Log
    if (user) getSaved().then((list) => setIsSaved(list.some((a) => a._id === id))).catch(() => {});
    else setIsSaved(false);
  }, [id, user]);

  const toggleSave = async () => {
    if (!user) return navigate('/login', { state: { from: location.pathname } });
    if (isSaved) await unsaveArticle(id);
    else await saveArticle(id);
    setIsSaved(!isSaved);
  };

  if (error) return <p className="error">{error}</p>;
  if (!article) return <p className="empty">Loading...</p>;

  return (
    <div className="detail">
      <Link to="/" className="back">Back to latest news</Link>
      <span className="tag">{article.category}</span>
      <h1>{article.title}</h1>
      <p className="meta">{article.newsSite} - {new Date(article.publishedAt).toLocaleDateString()}</p>
      {article.imageUrl && <img src={article.imageUrl} alt="" className="detail-img" />}
      <p className="detail-summary">{article.summary}</p>

      <div className="actions">
        <a href={article.url} target="_blank" rel="noreferrer" className="btn">Read full story</a>
        <button className={isSaved ? 'btn btn-saved' : 'btn btn-outline'} onClick={toggleSave}>
          {isSaved ? 'Saved to Mission Log' : 'Save'}
        </button>
      </div>

      <ReactionBar articleId={id} />
      <CommentSection articleId={id} />
    </div>
  );
}

export default ArticleDetail;

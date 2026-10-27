import { useEffect, useState } from 'react';
import { getTrending } from '../services/api.js';
import ArticleCard from '../components/ArticleCard.jsx';

// Most popular articles (score is calculated in the backend)
function Trending() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrending()
      .then(setArticles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1>Trending</h1>
      <p className="meta">Ranked by comments, reactions and saves.</p>
      {loading && <p className="empty">Loading...</p>}
      {!loading && articles.length === 0 && (
        <p className="empty">Nothing is trending yet. React to, comment on or save an article to get it here.</p>
      )}
      <div className="grid">
        {articles.map((a, index) => (
          <ArticleCard key={a._id} article={a}>
            <p className="score">
              #{index + 1} - score {a.score} ({a.comments} comments, {a.reactionCount} reactions, {a.saves} saves)
            </p>
          </ArticleCard>
        ))}
      </div>
    </>
  );
}

export default Trending;

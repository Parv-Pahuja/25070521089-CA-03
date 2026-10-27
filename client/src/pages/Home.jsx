import { useEffect, useState } from 'react';
import { getArticles } from '../services/api.js';
import ArticleFeed from '../components/ArticleFeed.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';

function Home() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadArticles = () =>
      getArticles(category)
        .then((data) => {
          setArticles(data);
          setError('');
        })
        .catch(() => setError('Could not load articles. Is the server running?'))
        .finally(() => setLoading(false));

    loadArticles(); // load once now

    // then load again every 60 seconds so the page feels live
    const timer = setInterval(loadArticles, 60000);

    // stop the timer when the page closes or the category changes
    return () => clearInterval(timer);
  }, [category]);

  return (
    <>
      <h1>Latest space news</h1>
      <CategoryFilter selected={category} onSelect={setCategory} />
      {loading && <p className="empty">Loading articles...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && <ArticleFeed articles={articles} />}
    </>
  );
}

export default Home;

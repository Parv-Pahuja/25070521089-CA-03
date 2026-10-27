import { useEffect, useState } from 'react';
import { getSaved, unsaveArticle } from '../services/api.js';
import SavedList from '../components/SavedList.jsx';

// Page that shows all saved articles
function MissionLog() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getSaved().then(setArticles).catch(() => {});
  }, []);

  const handleRemove = async (id) => {
    await unsaveArticle(id);
    setArticles(articles.filter((a) => a._id !== id)); // remove from screen
  };

  return (
    <>
      <h1>Mission Log</h1>
      <p className="meta">Articles you saved.</p>
      <SavedList articles={articles} onRemove={handleRemove} />
    </>
  );
}

export default MissionLog;

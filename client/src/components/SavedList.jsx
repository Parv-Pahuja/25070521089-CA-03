import ArticleCard from './ArticleCard.jsx';

// List of saved articles with a "Remove" button on each
function SavedList({ articles, onRemove }) {
  if (articles.length === 0) {
    return <p className="empty">Your Mission Log is empty. Open an article and press Save.</p>;
  }
  return (
    <div className="grid">
      {articles.map((a) => (
        <ArticleCard key={a._id} article={a}>
          <button className="link-btn" onClick={() => onRemove(a._id)}>Remove from log</button>
        </ArticleCard>
      ))}
    </div>
  );
}

export default SavedList;

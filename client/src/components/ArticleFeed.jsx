import ArticleCard from './ArticleCard.jsx';

// Shows a grid of article cards
function ArticleFeed({ articles }) {
  if (articles.length === 0) {
    return <p className="empty">No articles found in this category yet.</p>;
  }
  return (
    <div className="grid">
      {articles.map((a) => (
        <ArticleCard key={a._id} article={a} />
      ))}
    </div>
  );
}

export default ArticleFeed;

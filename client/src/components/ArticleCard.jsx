import { Link } from 'react-router-dom';

// One article box in the list. Clicking it opens the full page.
function ArticleCard({ article, children }) {
  const date = new Date(article.publishedAt).toLocaleDateString();

  return (
    <article className="card">
      <Link to={`/article/${article._id}`} className="card-link">
        {article.imageUrl && <img src={article.imageUrl} alt="" className="card-img" />}
        <div className="card-body">
          <span className="tag">{article.category}</span>
          <h3>{article.title}</h3>
          <p className="meta">{article.newsSite} - {date}</p>
          <p className="summary">{article.summary}</p>
        </div>
      </Link>
      {/* children = extra stuff from the page (like a score or a remove button) */}
      {children && <div className="card-extra">{children}</div>}
    </article>
  );
}

export default ArticleCard;

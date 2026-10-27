const categories = ['All', 'Mars', 'Launches', 'ISS', 'Moon', 'Satellites', 'Discovery', 'General'];

// Row of buttons to pick a category
function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="filters">
      {categories.map((c) => (
        <button
          key={c}
          className={c === selected ? 'filter active' : 'filter'}
          onClick={() => onSelect(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;

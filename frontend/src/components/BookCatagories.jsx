import { Link } from 'react-router-dom';

const categories = [
  { slug: 'computer-science', label: 'Computer Science', icon: '💻' },
  { slug: 'mechanical', label: 'Mechanical', icon: '⚙️' },
  { slug: 'electronics', label: 'Electronics', icon: '🔌' },
  { slug: 'electrical', label: 'Electrical', icon: '⚡' },
  { slug: 'civil', label: 'Civil', icon: '🏗️' },
  { slug: 'philosophy', label: 'Philosophy', icon: '📜' },
  { slug: 'fiction', label: 'Fiction', icon: '📖' },
  { slug: 'non-fiction', label: 'Non-Fiction', icon: '📘' },
  { slug: 'mathematics', label: 'Mathematics', icon: '📐' },
  { slug: 'physics', label: 'Physics', icon: '🔭' },
  { slug: 'chemistry', label: 'Chemistry', icon: '🧪' },
  { slug: 'biography', label: 'Biography', icon: '🖋️' },
  { slug: 'comics', label: 'Comics', icon: '🦸' },
  { slug: 'magazine', label: 'Magazine', icon: '📰' },
  { slug: 'newspaper', label: 'Newspaper', icon: '🗞️' },
  { slug: 'history', label: 'History', icon: '🏛️' },
  { slug: 'language', label: 'Programming Language', icon: '⌨️' },
];

function BookCategories() {
  return (
    <>
      <style>{`
        .cat-page {
          padding: 48px 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .cat-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }
        .cat-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          text-decoration: none;
          background: var(--card-bg);
          border: 1px solid var(--border);
          padding: 8px 18px 8px 14px;
          border-radius: 999px;
          transition: border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
          flex-shrink: 0;
        }
        .cat-back:hover {
          border-color: #A9812F;
          color: #A9812F;
          transform: translateX(-2px);
        }
        .cat-back-arrow {
          font-size: 18px;
          line-height: 1;
        }
        .cat-heading {
          text-align: center;
          flex: 1;
        }
        .cat-spacer {
          width: 90px;
          flex-shrink: 0;
        }
        .cat-eyebrow {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #A9812F;
          margin: 0 0 10px 0;
        }
        .cat-title {
          font-family: Georgia, serif;
          font-size: 30px;
          color: var(--text-primary);
          margin: 0;
        }
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        .cat-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 28px 18px;
          text-align: center;
          text-decoration: none;
          color: var(--text-primary);
          transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .cat-card:hover {
          transform: translateY(-3px);
          border-color: #A9812F;
          box-shadow: 0 12px 24px -12px rgba(0,0,0,0.2);
        }
        .cat-icon {
          font-size: 30px;
          margin-bottom: 12px;
        }
        .cat-label {
          font-size: 14px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .cat-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .cat-top-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .cat-heading {
            text-align: left;
          }
          .cat-spacer {
            display: none;
          }
        }
        @media (max-width: 420px) {
          .cat-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="cat-page">
        <div className="cat-top-row">
          <Link to="/" className="cat-back">
            <span className="cat-back-arrow">←</span> Back
          </Link>

          <div className="cat-heading">
            <p className="cat-eyebrow">Browse the Catalog</p>
            <h2 className="cat-title">Choose a Category</h2>
          </div>

          <div className="cat-spacer"></div>
        </div>

        <div className="cat-grid">
          {categories.map((cat) => (
            <Link key={cat.slug} to={`/books/${cat.slug}`} className="cat-card">
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-label">{cat.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default BookCategories;
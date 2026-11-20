import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBooks } from '../services/api';
import BookCard from './BookCard';

const categoryLabels = {
  'computer-science': 'Computer Science',
  'mechanical': 'Mechanical',
  'electronics': 'Electronics',
  'electrical': 'Electrical',
  'civil': 'Civil',
  'philosophy': 'Philosophy',
  'fiction': 'Fiction',
  'non-fiction': 'Non-Fiction',
  'mathematics': 'Mathematics',
  'physics': 'Physics',
  'chemistry': 'Chemistry',
  'biography': 'Biography',
  'comics': 'Comics',
  'magazine': 'Magazine',
  'newspaper': 'Newspaper',
  'history': 'History',
  'language': 'Programming Languages',
};

function BookList() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBooks = () => {
    setLoading(true);
    setError('');
    const params = category ? { category } : {};
    getBooks(params)
      .then((response) => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load books');
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    const params = category ? { category } : {};
    getBooks(params)
      .then((response) => {
        if (isMounted) {
          setBooks(response.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.error || 'Failed to load books');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [category]);

  const handleDelete = (deletedId) => {
    setBooks((prev) => prev.filter((book) => book.id !== deletedId));
  };

  const filteredBooks = books
    .filter((book) => (category ? book.category === category : true))
    .filter((book) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        book.title?.toLowerCase().includes(term) ||
        book.author?.toLowerCase().includes(term) ||
        book.isbn?.toLowerCase().includes(term)
      );
    });

  return (
    <>
      <style>{`
        .booklist-page {
          padding: 48px 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .booklist-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .booklist-back {
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
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
        }
        .booklist-back:hover {
          border-color: #A9812F;
          color: #A9812F;
          transform: translateX(-2px);
        }
        .booklist-back-arrow {
          font-size: 18px;
          line-height: 1;
        }
        .booklist-title {
          font-family: Georgia, serif;
          font-size: 28px;
          color: var(--text-primary);
          margin: 0;
          text-align: center;
        }
        .booklist-search-wrap {
          margin-bottom: 24px;
        }
        .booklist-search-input {
          width: 100%;
          max-width: 400px;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--card-bg);
          color: var(--text-primary);
          font-size: 14px;
        }
        .booklist-search-input:focus {
          outline: none;
          border-color: #A9812F;
        }
        .booklist-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .booklist-state-box {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 48px 24px;
          text-align: center;
        }
        .booklist-state-text {
          color: var(--text-muted);
          font-size: 15px;
          margin: 0 0 16px 0;
        }
        .booklist-retry-btn {
          background: #1C2233;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .booklist-error-banner {
          background: rgba(220, 53, 69, 0.12);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        @media (max-width: 900px) {
          .booklist-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .booklist-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="booklist-page">
        <div className="booklist-header">
          {category ? (
            <button onClick={() => navigate(-1)} className="booklist-back">
              <span className="booklist-back-arrow">←</span> Back
            </button>
          ) : <div></div>}

          <h2 className="booklist-title">
            {category ? categoryLabels[category] || category : 'All Books'}
          </h2>

          <div style={{ width: '80px' }}></div>
        </div>

        {error && (
          <div className="booklist-error-banner">
            {error}
          </div>
        )}

        <div className="booklist-search-wrap">
          <input
            type="text"
            className="booklist-search-input"
            placeholder="Search by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="booklist-state-box">
            <p className="booklist-state-text">Loading books...</p>
          </div>
        ) : error ? (
          <div className="booklist-state-box">
            <p className="booklist-state-text">{error}</p>
            <button className="booklist-retry-btn" onClick={fetchBooks}>
              Retry
            </button>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="booklist-state-box">
            <p className="booklist-state-text">
              {searchTerm
                ? 'No books match your search query.'
                : `No books found${category ? ' in this category yet' : ''}.`}
            </p>
          </div>
        ) : (
          <div className="booklist-grid">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default BookList;

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

  useEffect(() => {
    setLoading(true);
    getBooks()
      .then((response) => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  }, [category]);

  const handleDelete = (deletedId) => {
    setBooks(books.filter((book) => book.id !== deletedId));
  };

  const filteredBooks = category
    ? books.filter((book) => book.category === category)
    : books;

  if (loading) {
    return <p style={{ padding: '24px' }}>Loading books...</p>;
  }

  return (
    <>
      <style>{`
        .booklist-page {
          padding: 48px 24px;
          max-width: 1100px;
          margin: 0 auto;
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
          margin-bottom: 24px;
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
          margin: 0 0 28px 0;
          text-align: center;
        }
        .booklist-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .booklist-empty {
          text-align: center;
          color: var(--text-muted);
          padding: 40px 0;
        }

        @media (max-width: 900px) {
          .booklist-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .booklist-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="booklist-page">
        {category && (
          <button onClick={() => navigate(-1)} className="booklist-back">
            <span className="booklist-back-arrow">←</span> Back
          </button>
        )}

        <h2 className="booklist-title">
          {category ? categoryLabels[category] || category : 'All Books'}
        </h2>

        {filteredBooks.length === 0 ? (
          <p className="booklist-empty">
            No books found{category ? ' in this category yet' : ''}.
          </p>
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
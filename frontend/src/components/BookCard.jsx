import { deleteBook } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function BookCard({ book, onDelete }) {
  const { user } = useAuth();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Delete "${book.title}"?`);
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      await deleteBook(book.id, token);
      onDelete(book.id);
    } catch (error) {
      alert(error.response?.data?.error || 'Could not delete book');
    }
  };

  const isAvailable = book.available_copies > 0;

  return (
    <>
      <style>{`
        .book-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .book-card:hover {
          transform: translateY(-3px);
          border-color: #A9812F;
          box-shadow: 0 12px 24px -12px rgba(0,0,0,0.2);
        }
        .book-card-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 6px 0;
          line-height: 1.35;
        }
        .book-card-author {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0 0 14px 0;
        }
        .book-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }
        .book-card-availability {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .book-card-availability.in-stock {
          background: rgba(46, 160, 67, 0.12);
          color: #2ea043;
        }
        .book-card-availability.out-of-stock {
          background: rgba(220, 53, 69, 0.12);
          color: #dc3545;
        }
        .book-card-actions {
          display: flex;
          gap: 12px;
        }
        .book-card-actions a {
          font-size: 12px;
          font-weight: 600;
          color: #A9812F;
          text-decoration: none;
        }
        .book-card-actions a:hover {
          text-decoration: underline;
        }
        .book-card-actions button {
          font-size: 12px;
          font-weight: 600;
          color: #dc3545;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .book-card-actions button:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="book-card">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">by {book.author}</p>

        <div className="book-card-meta">
          <span className={`book-card-availability ${isAvailable ? 'in-stock' : 'out-of-stock'}`}>
            {book.available_copies} / {book.total_copies} available
          </span>

          {user && (
            <div className="book-card-actions">
              <Link to={`/edit-book/${book.id}`}>Edit</Link>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BookCard;
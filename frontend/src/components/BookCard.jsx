import { useState } from 'react';
import { deleteBook, createReservation } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function BookCard({ book, onDelete }) {
  const { user } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [inlineMsg, setInlineMsg] = useState({ type: '', text: '' });

  const handleDelete = async () => {
    try {
      await deleteBook(book.id);
      onDelete(book.id);
    } catch (error) {
      setInlineMsg({
        type: 'error',
        text: error.response?.data?.error || 'Could not delete book',
      });
      setConfirmDelete(false);
    }
  };

  const handleReserve = async () => {
    setReserving(true);
    setInlineMsg({ type: '', text: '' });
    try {
      await createReservation({ book_id: book.id });
      setInlineMsg({ type: 'success', text: 'Book reserved successfully!' });
    } catch (error) {
      setInlineMsg({
        type: 'error',
        text: error.response?.data?.error || 'Could not reserve book',
      });
    } finally {
      setReserving(false);
    }
  };

  const isAvailable = book.available_copies > 0;
  const isAdmin = user?.role === 'admin';

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
        .book-card-inline-msg {
          font-size: 12px;
          padding: 8px 10px;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        .book-card-inline-msg.success {
          background: rgba(46, 160, 67, 0.15);
          color: #2ea043;
          border: 1px solid rgba(46, 160, 67, 0.3);
        }
        .book-card-inline-msg.error {
          background: rgba(220, 53, 69, 0.15);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }
        .book-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--border);
          gap: 8px;
          flex-wrap: wrap;
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
          align-items: center;
          gap: 10px;
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
        .book-card-btn-delete {
          font-size: 12px;
          font-weight: 600;
          color: #dc3545;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .book-card-btn-delete:hover {
          text-decoration: underline;
        }
        .book-card-btn-reserve {
          font-size: 12px;
          font-weight: 600;
          color: #A9812F;
          background: rgba(169, 129, 47, 0.12);
          border: 1px solid #A9812F;
          border-radius: 6px;
          padding: 4px 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .book-card-btn-reserve:hover:not(:disabled) {
          background: #A9812F;
          color: #ffffff;
        }
        .book-card-confirm-box {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
        }
        .book-card-confirm-btn {
          background: #dc3545;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 3px 6px;
          font-size: 11px;
          cursor: pointer;
        }
        .book-card-cancel-btn {
          background: transparent;
          color: var(--text-muted);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 2px 5px;
          font-size: 11px;
          cursor: pointer;
        }
      `}</style>

      <div className="book-card">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">by {book.author}</p>

        {inlineMsg.text && (
          <div className={`book-card-inline-msg ${inlineMsg.type}`}>
            {inlineMsg.text}
          </div>
        )}

        <div className="book-card-meta">
          <span className={`book-card-availability ${isAvailable ? 'in-stock' : 'out-of-stock'}`}>
            {book.available_copies} / {book.total_copies} available
          </span>

          <div className="book-card-actions">
            {!isAvailable && user && (
              <button
                className="book-card-btn-reserve"
                onClick={handleReserve}
                disabled={reserving}
              >
                {reserving ? 'Reserving...' : 'Reserve'}
              </button>
            )}

            {isAdmin && (
              <>
                <Link to={`/edit-book/${book.id}`}>Edit</Link>
                {confirmDelete ? (
                  <div className="book-card-confirm-box">
                    <span>Delete?</span>
                    <button className="book-card-confirm-btn" onClick={handleDelete}>
                      Yes
                    </button>
                    <button
                      className="book-card-cancel-btn"
                      onClick={() => setConfirmDelete(false)}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    className="book-card-btn-delete"
                    onClick={() => setConfirmDelete(true)}
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BookCard;

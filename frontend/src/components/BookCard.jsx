// Ye component ek single book ka card dikhata hai

import { deleteBook } from '../services/api';
import { useAuth } from '../context/AuthContext';

function BookCard({ book, onDelete }) {
  const { user } = useAuth();

  const handleDelete = async () => {
    // Confirm karo pehle, taaki galti se delete na ho jaye
    const confirmDelete = window.confirm(`Delete "${book.title}"?`);
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      await deleteBook(book.id, token);
      onDelete(book.id);   // Parent (BookList) ko batao ki ye book delete ho gayi
    } catch (error) {
      alert(error.response?.data?.error || 'Could not delete book');
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
    }}>
      <h3 style={{ margin: '0 0 8px 0' }}>{book.title}</h3>
      <p style={{ margin: '4px 0', color: '#555' }}>by {book.author}</p>
      <p style={{ margin: '4px 0', fontSize: '14px' }}>Category: {book.category}</p>
      <p style={{ margin: '4px 0', fontSize: '14px' }}>
        Available: {book.available_copies} / {book.total_copies}
      </p>

      {/* Delete button sirf logged-in user ko dikhega */}
      {user && (
        <button onClick={handleDelete} style={{ marginTop: '8px', color: 'red' }}>
          Delete
        </button>
      )}
    </div>
  );
}

export default BookCard;
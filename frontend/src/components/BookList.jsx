// Ye component saari books fetch karta hai aur BookCard components me dikhata hai

import { useState, useEffect } from 'react';
import { getBooks } from '../services/api';
import BookCard from './BookCard';

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks()
      .then((response) => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  }, []);

  // Ye function BookCard se call hoga jab koi book delete ho
  const handleDelete = (deletedId) => {
    // Purani list me se deleted book hata do, baaki sab rakho
    setBooks(books.filter((book) => book.id !== deletedId));
  };

  if (loading) {
    return <p>Loading books...</p>;
  }

  return (
    <div>
      <h2>All Books</h2>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        books.map((book) => (
          <BookCard key={book.id} book={book} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
}

export default BookList;
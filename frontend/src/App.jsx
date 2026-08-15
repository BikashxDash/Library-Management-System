import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // books state - yahan backend se aayi hui books store hongi
  const [books, setBooks] = useState([]);

  // loading state - jab tak data aa nahi jata, "Loading..." dikhayenge
  const [loading, setLoading] = useState(true);

  // useEffect - page load hote hi ek baar chalega (khali [] array ki wajah se)
  useEffect(() => {
    // Backend se books fetch karo
    axios.get('http://localhost:5000/api/books')
      .then((response) => {
        setBooks(response.data);   // Books ko state me save karo
        setLoading(false);          // Loading khatam
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  }, []);   // Khali array = sirf ek baar chalega, page load hote hi

  return (
    <div style={{ padding: '20px' }}>
      <h1>Library Management System</h1>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div>
          <h2>All Books</h2>
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <strong>{book.title}</strong> by {book.author} — {book.available_copies} available
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
// Add Book page - naya book add karne ka form

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBook } from '../services/api';

function AddBookPage() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    total_copies: 1,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Ek hi function se saare fields handle ho jate hain, "name" attribute ke through
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');

    try {
      await addBook(formData, token);
      navigate('/');   // Add hone ke baad books list pe wapas bhej do
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add book');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>Add New Book</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label>Title</label><br />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Author</label><br />
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>ISBN</label><br />
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Category</label><br />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Total Copies</label><br />
          <input
            type="number"
            name="total_copies"
            value={formData.total_copies}
            onChange={handleChange}
            min="1"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ padding: '8px 16px' }}>Add Book</button>
      </form>
    </div>
  );
}

export default AddBookPage;
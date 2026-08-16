// Edit Book page - existing book ki details update karne ka form

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookById, updateBook } from '../services/api';

function EditBookPage() {
  const { id } = useParams();   // URL se book ki ID milegi, jaise /edit-book/3
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    total_copies: 1,
    available_copies: 1,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Page load hote hi existing book ki details fetch karo
  useEffect(() => {
    getBookById(id)
      .then((response) => {
        setFormData(response.data);   // Form ko existing data se bhar do
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching book:', error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');

    try {
      await updateBook(id, formData, token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update book');
    }
  };

  if (loading) return <p>Loading book details...</p>;

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>Edit Book</h2>

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
            value={formData.isbn || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Category</label><br />
          <input
            type="text"
            name="category"
            value={formData.category || ''}
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

        <div style={{ marginBottom: '12px' }}>
          <label>Available Copies</label><br />
          <input
            type="number"
            name="available_copies"
            value={formData.available_copies}
            onChange={handleChange}
            min="0"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ padding: '8px 16px' }}>Update Book</button>
      </form>
    </div>
  );
}

export default EditBookPage;
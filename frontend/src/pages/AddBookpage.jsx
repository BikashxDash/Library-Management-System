// Add Book page - naya book add karne ka form

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBook } from '../services/api';

const categories = [
  { value: 'computer-science', label: 'Computer Science' },
  { value: 'mechanical', label: 'Mechanical' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'civil', label: 'Civil' },
  { value: 'philosophy', label: 'Philosophy' },
  { value: 'fiction', label: 'Fiction' },
  { value: 'non-fiction', label: 'Non-Fiction' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'physics', label: 'Physics' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'biography', label: 'Biography' },
  { value: 'comics', label: 'Comics' },
  { value: 'magazine', label: 'Magazine' },
  { value: 'newspaper', label: 'Newspaper' },
  { value: 'history', label: 'History' },
  { value: 'language', label: 'Programming Languages' },
];

function AddBookPage() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'fiction',
    total_copies: 1,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await addBook(formData);
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .form-page {
          padding: 48px 24px;
          max-width: 550px;
          margin: 0 auto;
        }
        .form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .form-back {
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
          transition: border-color 0.15s ease, transform 0.15s ease;
        }
        .form-back:hover {
          border-color: #A9812F;
          transform: translateX(-2px);
        }
        .form-title {
          font-family: Georgia, serif;
          font-size: 26px;
          color: var(--text-primary);
          margin: 0;
          text-align: center;
        }
        .form-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .form-group {
          margin-bottom: 18px;
        }
        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .form-group input,
        .form-group select {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-page);
          color: var(--text-primary);
          font-size: 14px;
        }
        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #A9812F;
        }
        .form-error {
          background: rgba(220, 53, 69, 0.12);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        .form-submit-btn {
          width: 100%;
          padding: 14px;
          background: #1C2233;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
          margin-top: 8px;
        }
        .form-submit-btn:hover:not(:disabled) {
          background: #2a3348;
        }
      `}</style>

      <div className="form-page">
        <div className="form-header">
          <button onClick={() => navigate(-1)} className="form-back">
            ← Back
          </button>
          <h2 className="form-title">Add New Book</h2>
          <div style={{ width: '80px' }}></div>
        </div>

        <div className="form-card">
          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Book title"
                required
              />
            </div>

            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Author name"
                required
              />
            </div>

            <div className="form-group">
              <label>ISBN</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="e.g. 978-0132350884"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Total Copies</label>
              <input
                type="number"
                name="total_copies"
                value={formData.total_copies}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <button type="submit" className="form-submit-btn" disabled={loading}>
              {loading ? 'Adding Book...' : 'Add Book'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddBookPage;

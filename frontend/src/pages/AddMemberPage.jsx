// Add Member page - naya member add karne ka form

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMember } from '../services/api';

function AddMemberPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
      await addMember(formData);
      navigate('/members');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .form-page {
          padding: 48px 24px;
          max-width: 500px;
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
        .form-group input {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-page);
          color: var(--text-primary);
          font-size: 14px;
        }
        .form-group input:focus {
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
          <h2 className="form-title">Add New Member</h2>
          <div style={{ width: '80px' }}></div>
        </div>

        <div className="form-card">
          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Member name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="member@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number (10 digits)</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
              />
            </div>

            <button type="submit" className="form-submit-btn" disabled={loading}>
              {loading ? 'Adding Member...' : 'Add Member'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddMemberPage;

// Edit Member page - existing member ki details update karne ka form

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMemberById, updateMember } from '../services/api';

function EditMemberPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    is_active: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getMemberById(id)
      .then((response) => {
        setFormData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Error fetching member details');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUpdating(true);

    try {
      await updateMember(id, formData);
      navigate('/members');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update member');
    } finally {
      setUpdating(false);
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
        .form-group input[type="text"],
        .form-group input[type="email"] {
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
        .form-state-box {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 48px 24px;
          text-align: center;
        }
      `}</style>

      <div className="form-page">
        <div className="form-header">
          <button onClick={() => navigate(-1)} className="form-back">
            ← Back
          </button>
          <h2 className="form-title">Edit Member</h2>
          <div style={{ width: '80px' }}></div>
        </div>

        {loading ? (
          <div className="form-state-box">
            <p style={{ color: 'var(--text-muted)' }}>Loading member details...</p>
          </div>
        ) : (
          <div className="form-card">
            {error && <div className="form-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={Boolean(formData.is_active)}
                    onChange={handleChange}
                  />
                  <span>Active Member</span>
                </label>
              </div>

              <button type="submit" className="form-submit-btn" disabled={updating}>
                {updating ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default EditMemberPage;

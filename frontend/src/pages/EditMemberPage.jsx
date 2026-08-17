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

  useEffect(() => {
    getMemberById(id)
      .then((response) => {
        setFormData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching member:', error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Checkbox ke liye "checked" use hota hai, baaki sab ke liye "value"
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');

    try {
      await updateMember(id, formData, token);
      navigate('/members');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update member');
    }
  };

  if (loading) return <p>Loading member details...</p>;

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>Edit Member</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label>Name</label><br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Email</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Phone</label><br />
          <input
            type="text"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            {' '}Active
          </label>
        </div>

        <button type="submit" style={{ padding: '8px 16px' }}>Update Member</button>
      </form>
    </div>
  );
}

export default EditMemberPage;
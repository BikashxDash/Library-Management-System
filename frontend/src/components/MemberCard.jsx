// Ye component ek single member ka card dikhata hai

import { Link } from 'react-router-dom';
import { deleteMember } from '../services/api';
import { useAuth } from '../context/AuthContext';

function MemberCard({ member, onDelete }) {
  const { user } = useAuth();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Delete "${member.name}"?`);
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      await deleteMember(member.id, token);
      onDelete(member.id);
    } catch (error) {
      alert(error.response?.data?.error || 'Could not delete member');
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
    }}>
      <h3 style={{ margin: '0 0 8px 0' }}>{member.name}</h3>
      <p style={{ margin: '4px 0', color: '#555' }}>{member.email}</p>
      <p style={{ margin: '4px 0', fontSize: '14px' }}>Phone: {member.phone || 'N/A'}</p>
      <p style={{ margin: '4px 0', fontSize: '14px' }}>
        Status: {member.is_active ? 'Active' : 'Inactive'}
      </p>

      {user && (
        <div style={{ marginTop: '8px' }}>
          <Link to={`/edit-member/${member.id}`} style={{ marginRight: '10px' }}>Edit</Link>
          <button onClick={handleDelete} style={{ color: 'red' }}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default MemberCard;
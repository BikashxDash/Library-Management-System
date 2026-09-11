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
    <>
      <style>{`
        .member-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .member-card:hover {
          transform: translateY(-3px);
          border-color: #A9812F;
          box-shadow: 0 12px 24px -12px rgba(0,0,0,0.2);
        }
        .member-card-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 6px 0;
        }
        .member-card-email {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0 0 4px 0;
        }
        .member-card-phone {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0 0 14px 0;
        }
        .member-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }
        .member-card-status {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .member-card-status.active {
          background: rgba(46, 160, 67, 0.12);
          color: #2ea043;
        }
        .member-card-status.inactive {
          background: rgba(220, 53, 69, 0.12);
          color: #dc3545;
        }
        .member-card-actions {
          display: flex;
          gap: 12px;
        }
        .member-card-actions a {
          font-size: 12px;
          font-weight: 600;
          color: #A9812F;
          text-decoration: none;
        }
        .member-card-actions a:hover {
          text-decoration: underline;
        }
        .member-card-actions button {
          font-size: 12px;
          font-weight: 600;
          color: #dc3545;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .member-card-actions button:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="member-card">
        <h3 className="member-card-name">{member.name}</h3>
        <p className="member-card-email">{member.email}</p>
        <p className="member-card-phone">Phone: {member.phone || 'N/A'}</p>

        <div className="member-card-meta">
          <span className={`member-card-status ${member.is_active ? 'active' : 'inactive'}`}>
            {member.is_active ? 'Active' : 'Inactive'}
          </span>

          {user && (
            <div className="member-card-actions">
              <Link to={`/edit-member/${member.id}`}>Edit</Link>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MemberCard;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingUsers, approveUser, rejectUser } from '../services/api';

function PendingUsersPage() {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });


  useEffect(() => {
    let isMounted = true;
    getPendingUsers()
      .then((res) => {
        if (isMounted) {
          setPendingUsers(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.error || 'Failed to fetch pending users');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleApprove = async (id, name) => {
    setActionLoadingId(id);
    setActionMsg({ type: '', text: '' });
    try {
      await approveUser(id);
      setActionMsg({ type: 'success', text: `Approved "${name}" successfully!` });
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setActionMsg({
        type: 'error',
        text: err.response?.data?.error || `Could not approve user`,
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id, name) => {
    setActionLoadingId(id);
    setActionMsg({ type: '', text: '' });
    try {
      await rejectUser(id);
      setActionMsg({ type: 'alert', text: `Registration for "${name}" was rejected.` });
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setActionMsg({
        type: 'error',
        text: err.response?.data?.error || `Could not reject user`,
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <>
      <style>{`
        .pending-page {
          padding: 48px 24px;
          max-width: 900px;
          margin: 0 auto;
        }
        .pending-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .pending-back {
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
        .pending-back:hover {
          border-color: #A9812F;
          transform: translateX(-2px);
        }
        .pending-title {
          font-family: Georgia, serif;
          font-size: 28px;
          color: var(--text-primary);
          margin: 0;
          text-align: center;
        }
        .pending-banner {
          padding: 12px 18px;
          border-radius: 10px;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .pending-banner.success {
          background: rgba(46, 160, 67, 0.12);
          color: #2ea043;
          border: 1px solid rgba(46, 160, 67, 0.3);
        }
        .pending-banner.alert,
        .pending-banner.error {
          background: rgba(220, 53, 69, 0.12);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }
        .pending-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .pending-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          box-shadow: 0 4px 14px rgba(0,0,0,0.04);
        }
        .pending-info-name {
          font-size: 17px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }
        .pending-info-email {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0 0 6px 0;
        }
        .pending-info-date {
          font-size: 12px;
          color: #A9812F;
          font-weight: 500;
          margin: 0;
        }
        .pending-actions {
          display: flex;
          gap: 10px;
        }
        .pending-btn-approve {
          background: #2ea043;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }
        .pending-btn-approve:hover:not(:disabled) {
          opacity: 0.9;
        }
        .pending-btn-reject {
          background: transparent;
          color: #dc3545;
          border: 1.5px solid #dc3545;
          border-radius: 8px;
          padding: 9px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .pending-btn-reject:hover:not(:disabled) {
          background: rgba(220, 53, 69, 0.1);
        }
        .pending-state-box {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 48px 24px;
          text-align: center;
        }
        .pending-state-text {
          color: var(--text-muted);
          font-size: 15px;
          margin: 0;
        }
      `}</style>

      <div className="pending-page">
        <div className="pending-header">
          <button onClick={() => navigate(-1)} className="pending-back">
            ← Back
          </button>
          <h2 className="pending-title">Pending User Approvals</h2>
          <div style={{ width: '80px' }}></div>
        </div>

        {actionMsg.text && (
          <div className={`pending-banner ${actionMsg.type}`}>
            {actionMsg.text}
          </div>
        )}

        {error && (
          <div className="pending-banner error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="pending-state-box">
            <p className="pending-state-text">Loading pending users...</p>
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="pending-state-box">
            <p className="pending-state-text">🎉 No pending approvals! All registered users are approved.</p>
          </div>
        ) : (
          <div className="pending-list">
            {pendingUsers.map((u) => (
              <div key={u.id} className="pending-card">
                <div>
                  <h3 className="pending-info-name">{u.name}</h3>
                  <p className="pending-info-email">{u.email}</p>
                  <p className="pending-info-date">
                    Registered: {new Date(u.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="pending-actions">
                  <button
                    className="pending-btn-approve"
                    onClick={() => handleApprove(u.id, u.name)}
                    disabled={actionLoadingId === u.id}
                  >
                    {actionLoadingId === u.id ? 'Processing...' : '✓ Approve'}
                  </button>
                  <button
                    className="pending-btn-reject"
                    onClick={() => handleReject(u.id, u.name)}
                    disabled={actionLoadingId === u.id}
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default PendingUsersPage;

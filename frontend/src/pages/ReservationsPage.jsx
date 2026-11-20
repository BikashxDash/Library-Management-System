import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReservations, cancelReservation } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ReservationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, fulfilled, cancelled
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });


  useEffect(() => {
    let isMounted = true;
    getReservations()
      .then((res) => {
        if (isMounted) {
          setReservations(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.error || 'Failed to fetch reservations');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCancel = async (id) => {
    setCancellingId(id);
    setActionMsg({ type: '', text: '' });
    try {
      await cancelReservation(id);
      setActionMsg({ type: 'success', text: 'Reservation cancelled successfully' });
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
      );
      setConfirmCancelId(null);
    } catch (err) {
      setActionMsg({
        type: 'error',
        text: err.response?.data?.error || 'Could not cancel reservation',
      });
    } finally {
      setCancellingId(null);
    }
  };

  const isAdmin = user?.role === 'admin';
  const pageTitle = isAdmin ? 'All Reservations' : 'My Book Reservations';

  const filtered = reservations.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <>
      <style>{`
        .res-page {
          padding: 48px 24px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .res-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .res-back {
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
        .res-back:hover {
          border-color: #A9812F;
          transform: translateX(-2px);
        }
        .res-title {
          font-family: Georgia, serif;
          font-size: 28px;
          color: var(--text-primary);
          margin: 0;
          text-align: center;
        }
        .res-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .res-filter-btn {
          background: var(--card-bg);
          border: 1px solid var(--border);
          color: var(--text-primary);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .res-filter-btn:hover {
          border-color: #A9812F;
        }
        .res-filter-btn.active {
          background: #1C2233;
          color: #ffffff;
          border-color: #1C2233;
        }
        .res-banner {
          padding: 12px 18px;
          border-radius: 10px;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .res-banner.success {
          background: rgba(46, 160, 67, 0.12);
          color: #2ea043;
          border: 1px solid rgba(46, 160, 67, 0.3);
        }
        .res-banner.error {
          background: rgba(220, 53, 69, 0.12);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }
        .res-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .res-table {
          width: 100%;
          border-collapse: collapse;
        }
        .res-table th,
        .res-table td {
          padding: 14px 18px;
          text-align: left;
          border-bottom: 1px solid var(--border);
          font-size: 14px;
        }
        .res-table th {
          background: rgba(0,0,0,0.02);
          color: var(--text-muted);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        .res-badge {
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
          text-transform: capitalize;
        }
        .res-badge.pending {
          background: rgba(169, 129, 47, 0.15);
          color: #A9812F;
        }
        .res-badge.fulfilled {
          background: rgba(46, 160, 67, 0.15);
          color: #2ea043;
        }
        .res-badge.cancelled {
          background: rgba(220, 53, 69, 0.15);
          color: #dc3545;
        }
        .res-btn-cancel {
          background: none;
          color: #dc3545;
          border: none;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          padding: 0;
        }
        .res-btn-cancel:hover {
          text-decoration: underline;
        }
        .res-confirm-box {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .res-confirm-btn {
          background: #dc3545;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 3px 6px;
          font-size: 11px;
          cursor: pointer;
        }
        .res-cancel-btn {
          background: transparent;
          color: var(--text-muted);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 2px 5px;
          font-size: 11px;
          cursor: pointer;
        }
        .res-state-box {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 48px 24px;
          text-align: center;
        }
        .res-state-text {
          color: var(--text-muted);
          font-size: 15px;
          margin: 0;
        }
      `}</style>

      <div className="res-page">
        <div className="res-header">
          <button onClick={() => navigate(-1)} className="res-back">
            ← Back
          </button>
          <h2 className="res-title">{pageTitle}</h2>
          <div style={{ width: '80px' }}></div>
        </div>

        {actionMsg.text && (
          <div className={`res-banner ${actionMsg.type}`}>
            {actionMsg.text}
          </div>
        )}

        {error && (
          <div className="res-banner error">
            {error}
          </div>
        )}

        <div className="res-filters">
          <button
            className={`res-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({reservations.length})
          </button>
          <button
            className={`res-filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({reservations.filter((r) => r.status === 'pending').length})
          </button>
          <button
            className={`res-filter-btn ${filter === 'fulfilled' ? 'active' : ''}`}
            onClick={() => setFilter('fulfilled')}
          >
            Fulfilled ({reservations.filter((r) => r.status === 'fulfilled').length})
          </button>
          <button
            className={`res-filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({reservations.filter((r) => r.status === 'cancelled').length})
          </button>
        </div>

        {loading ? (
          <div className="res-state-box">
            <p className="res-state-text">Loading reservations...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="res-state-box">
            <p className="res-state-text">No reservations found matching "{filter}".</p>
          </div>
        ) : (
          <div className="res-card">
            <div style={{ overflowX: 'auto' }}>
              <table className="res-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Book</th>
                    {isAdmin && <th>Member</th>}
                    <th>Date Reserved</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td>
                        <strong>{r.book_title}</strong>
                        {r.book_author && (
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            by {r.book_author}
                          </div>
                        )}
                      </td>
                      {isAdmin && (
                        <td>
                          {r.member_name}
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {r.member_email}
                          </div>
                        </td>
                      )}
                      <td>{new Date(r.reservation_date || r.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`res-badge ${r.status}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        {r.status === 'pending' ? (
                          confirmCancelId === r.id ? (
                            <div className="res-confirm-box">
                              <span style={{ fontSize: '11px' }}>Cancel?</span>
                              <button
                                className="res-confirm-btn"
                                onClick={() => handleCancel(r.id)}
                                disabled={cancellingId === r.id}
                              >
                                {cancellingId === r.id ? '...' : 'Yes'}
                              </button>
                              <button
                                className="res-cancel-btn"
                                onClick={() => setConfirmCancelId(null)}
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              className="res-btn-cancel"
                              onClick={() => setConfirmCancelId(r.id)}
                            >
                              Cancel
                            </button>
                          )
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ReservationsPage;

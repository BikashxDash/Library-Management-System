import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactions } from '../services/api';
import { useAuth } from '../context/AuthContext';

function TransactionsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all'); // all, issued, returned
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = () => {
    setLoading(true);
    setError('');
    const params = statusFilter !== 'all' ? { status: statusFilter } : {};
    getTransactions(params)
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load transactions');
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    const params = statusFilter !== 'all' ? { status: statusFilter } : {};
    getTransactions(params)
      .then((res) => {
        if (isMounted) {
          setTransactions(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.error || 'Failed to load transactions');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [statusFilter]);

  const isAdmin = user?.role === 'admin';
  const pageTitle = isAdmin ? 'All Transactions' : 'My Issued Books & History';

  const filtered = transactions.filter((t) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      t.book_title?.toLowerCase().includes(term) ||
      t.member_name?.toLowerCase().includes(term) ||
      t.status?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <style>{`
        .tx-page {
          padding: 48px 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .tx-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .tx-back {
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
        .tx-back:hover {
          border-color: #A9812F;
          transform: translateX(-2px);
        }
        .tx-title {
          font-family: Georgia, serif;
          font-size: 28px;
          color: var(--text-primary);
          margin: 0;
          text-align: center;
        }
        .tx-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .tx-search-input {
          flex: 1;
          min-width: 250px;
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--card-bg);
          color: var(--text-primary);
          font-size: 14px;
        }
        .tx-search-input:focus {
          outline: none;
          border-color: #A9812F;
        }
        .tx-filter-group {
          display: flex;
          gap: 8px;
        }
        .tx-filter-btn {
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
        .tx-filter-btn:hover {
          border-color: #A9812F;
        }
        .tx-filter-btn.active {
          background: #1C2233;
          color: #ffffff;
          border-color: #1C2233;
        }
        .tx-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .tx-table {
          width: 100%;
          border-collapse: collapse;
        }
        .tx-table th,
        .tx-table td {
          padding: 14px 18px;
          text-align: left;
          border-bottom: 1px solid var(--border);
          font-size: 14px;
        }
        .tx-table th {
          background: rgba(0,0,0,0.02);
          color: var(--text-muted);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        .tx-badge {
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
          text-transform: capitalize;
        }
        .tx-badge.issued {
          background: rgba(169, 129, 47, 0.15);
          color: #A9812F;
        }
        .tx-badge.returned {
          background: rgba(46, 160, 67, 0.15);
          color: #2ea043;
        }
        .tx-overdue {
          color: #dc3545;
          font-weight: 600;
          font-size: 12px;
          margin-left: 6px;
        }
        .tx-state-box {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 48px 24px;
          text-align: center;
        }
        .tx-state-text {
          color: var(--text-muted);
          font-size: 15px;
          margin: 0 0 16px 0;
        }
        .tx-retry-btn {
          background: #1C2233;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .tx-error-banner {
          background: rgba(220, 53, 69, 0.12);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 14px;
        }
      `}</style>

      <div className="tx-page">
        <div className="tx-header">
          <button onClick={() => navigate(-1)} className="tx-back">
            ← Back
          </button>
          <h2 className="tx-title">{pageTitle}</h2>
          <div style={{ width: '80px' }}></div>
        </div>

        {error && (
          <div className="tx-error-banner">
            {error}
          </div>
        )}

        <div className="tx-controls">
          <input
            type="text"
            className="tx-search-input"
            placeholder="Search by book title or member name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="tx-filter-group">
            <button
              className={`tx-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button
              className={`tx-filter-btn ${statusFilter === 'issued' ? 'active' : ''}`}
              onClick={() => setStatusFilter('issued')}
            >
              Issued
            </button>
            <button
              className={`tx-filter-btn ${statusFilter === 'returned' ? 'active' : ''}`}
              onClick={() => setStatusFilter('returned')}
            >
              Returned
            </button>
          </div>
        </div>

        {loading ? (
          <div className="tx-state-box">
            <p className="tx-state-text">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="tx-state-box">
            <p className="tx-state-text">{error}</p>
            <button className="tx-retry-btn" onClick={fetchTransactions}>
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="tx-state-box">
            <p className="tx-state-text">
              {searchTerm ? 'No transactions match your search.' : 'No transactions found.'}
            </p>
          </div>
        ) : (
          <div className="tx-card">
            <div style={{ overflowX: 'auto' }}>
              <table className="tx-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Book</th>
                    {isAdmin && <th>Member</th>}
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => {
                    const isIssued = t.status === 'issued';
                    const isOverdue = isIssued && new Date(t.due_date) < new Date();
                    return (
                      <tr key={t.id}>
                        <td>#{t.id}</td>
                        <td>
                          <strong>{t.book_title}</strong>
                        </td>
                        {isAdmin && (
                          <td>
                            {t.member_name}
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {t.member_email}
                            </div>
                          </td>
                        )}
                        <td>{new Date(t.issue_date).toLocaleDateString()}</td>
                        <td>
                          {new Date(t.due_date).toLocaleDateString()}
                          {isOverdue && <span className="tx-overdue">⚠️ Overdue</span>}
                        </td>
                        <td>
                          {t.return_date ? new Date(t.return_date).toLocaleDateString() : '—'}
                        </td>
                        <td>
                          <span className={`tx-badge ${t.status}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TransactionsPage;

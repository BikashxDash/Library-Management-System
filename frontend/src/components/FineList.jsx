import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFines } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FineCard from './FineCard';

function FineList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fines, setFines] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unpaid, paid
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    let isMounted = true;
    getFines()
      .then((response) => {
        if (isMounted) {
          setFines(response.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.error || 'Error fetching fines');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdate = (updatedId) => {
    setFines((prev) =>
      prev.map((f) => (f.id === updatedId ? { ...f, status: 'paid' } : f))
    );
  };

  const isAdmin = user?.role === 'admin';
  const pageTitle = isAdmin ? 'All Fines' : 'My Fines';

  const filteredFines = fines.filter((f) => {
    if (filter === 'unpaid') return f.status === 'unpaid';
    if (filter === 'paid') return f.status === 'paid';
    return true;
  });

  const totalUnpaid = fines
    .filter((f) => f.status === 'unpaid')
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);

  return (
    <>
      <style>{`
        .finelist-page {
          padding: 48px 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .finelist-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .finelist-back {
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
          transition: border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
        }
        .finelist-back:hover {
          border-color: #A9812F;
          color: #A9812F;
          transform: translateX(-2px);
        }
        .finelist-back-arrow {
          font-size: 18px;
          line-height: 1;
        }
        .finelist-title {
          font-family: Georgia, serif;
          font-size: 28px;
          color: var(--text-primary);
          margin: 0;
          text-align: center;
        }
        .finelist-summary {
          display: flex;
          gap: 14px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .finelist-summary-chip {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 18px;
          font-size: 13px;
          color: var(--text-muted);
        }
        .finelist-summary-chip strong {
          color: var(--text-primary);
          font-size: 15px;
          margin-left: 6px;
        }
        .finelist-summary-chip.alert strong {
          color: #dc3545;
        }
        .finelist-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }
        .finelist-filter-btn {
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
        .finelist-filter-btn:hover {
          border-color: #A9812F;
        }
        .finelist-filter-btn.active {
          background: #1C2233;
          color: #ffffff;
          border-color: #1C2233;
        }
        .finelist-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .finelist-state-box {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 48px 24px;
          text-align: center;
        }
        .finelist-state-text {
          color: var(--text-muted);
          font-size: 15px;
          margin: 0 0 16px 0;
        }
        .finelist-retry-btn {
          background: #1C2233;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .finelist-error-banner {
          background: rgba(220, 53, 69, 0.12);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        @media (max-width: 900px) {
          .finelist-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .finelist-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="finelist-page">
        <div className="finelist-top">
          <button onClick={() => navigate(-1)} className="finelist-back">
            <span className="finelist-back-arrow">←</span> Back
          </button>
          <h2 className="finelist-title">{pageTitle}</h2>
          <div style={{ width: '80px' }}></div>
        </div>

        {error && (
          <div className="finelist-error-banner">
            {error}
          </div>
        )}

        <div className="finelist-summary">
          <div className="finelist-summary-chip">
            Total Records: <strong>{fines.length}</strong>
          </div>
          <div className={`finelist-summary-chip ${totalUnpaid > 0 ? 'alert' : ''}`}>
            Unpaid Total: <strong>₹{totalUnpaid}</strong>
          </div>
        </div>

        <div className="finelist-filters">
          <button
            className={`finelist-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({fines.length})
          </button>
          <button
            className={`finelist-filter-btn ${filter === 'unpaid' ? 'active' : ''}`}
            onClick={() => setFilter('unpaid')}
          >
            Unpaid ({fines.filter((f) => f.status === 'unpaid').length})
          </button>
          <button
            className={`finelist-filter-btn ${filter === 'paid' ? 'active' : ''}`}
            onClick={() => setFilter('paid')}
          >
            Paid ({fines.filter((f) => f.status === 'paid').length})
          </button>
        </div>

        {loading ? (
          <div className="finelist-state-box">
            <p className="finelist-state-text">Loading fines...</p>
          </div>
        ) : filteredFines.length === 0 ? (
          <div className="finelist-state-box">
            <p className="finelist-state-text">No fines found matching "{filter}".</p>
          </div>
        ) : (
          <div className="finelist-grid">
            {filteredFines.map((fine) => (
              <FineCard key={fine.id} fine={fine} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default FineList;

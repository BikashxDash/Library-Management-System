import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFines } from '../services/api';
import FineCard from './FineCard';

function FineList() {
  const navigate = useNavigate();
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    getFines(token)
      .then((response) => {
        setFines(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching fines:', error);
        setLoading(false);
      });
  }, []);

  const handleUpdate = (updatedId) => {
    setFines((prev) =>
      prev.map((f) => (f.id === updatedId ? { ...f, status: 'paid' } : f))
    );
  };

  if (loading) return <p style={{ padding: '24px' }}>Loading fines...</p>;

  return (
    <>
      <style>{`
        .finelist-page {
          padding: 48px 24px;
          max-width: 1100px;
          margin: 0 auto;
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
          margin-bottom: 24px;
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
          margin: 0 0 28px 0;
          text-align: center;
        }
        .finelist-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .finelist-empty {
          text-align: center;
          color: var(--text-muted);
          padding: 40px 0;
        }

        @media (max-width: 900px) {
          .finelist-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .finelist-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="finelist-page">
        <button onClick={() => navigate(-1)} className="finelist-back">
          <span className="finelist-back-arrow">←</span> Back
        </button>

        <h2 className="finelist-title">All Fines</h2>

        {fines.length === 0 ? (
          <p className="finelist-empty">No fines found.</p>
        ) : (
          <div className="finelist-grid">
            {fines.map((fine) => (
              <FineCard key={fine.id} fine={fine} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default FineList;
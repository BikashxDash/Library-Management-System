import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembers } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MemberCard from './MemberCard';

function MemberList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMembers = () => {
    setLoading(true);
    setError('');
    getMembers()
      .then((response) => {
        setMembers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Error fetching members');
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getMembers()
      .then((response) => {
        if (isMounted) {
          setMembers(response.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.error || 'Error fetching members');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const isAdmin = user?.role === 'admin';
  const pageTitle = isAdmin ? 'All Members' : 'My Member Profile';

  const filteredMembers = members.filter((member) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      member.name?.toLowerCase().includes(term) ||
      member.email?.toLowerCase().includes(term) ||
      member.phone?.includes(term)
    );
  });

  return (
    <>
      <style>{`
        .memberlist-page {
          padding: 48px 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .memberlist-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .memberlist-back {
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
        .memberlist-back:hover {
          border-color: #A9812F;
          color: #A9812F;
          transform: translateX(-2px);
        }
        .memberlist-back-arrow {
          font-size: 18px;
          line-height: 1;
        }
        .memberlist-title {
          font-family: Georgia, serif;
          font-size: 28px;
          color: var(--text-primary);
          margin: 0;
          text-align: center;
        }
        .memberlist-search-wrap {
          margin-bottom: 24px;
        }
        .memberlist-search-input {
          width: 100%;
          max-width: 400px;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--card-bg);
          color: var(--text-primary);
          font-size: 14px;
        }
        .memberlist-search-input:focus {
          outline: none;
          border-color: #A9812F;
        }
        .memberlist-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .memberlist-state-box {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 48px 24px;
          text-align: center;
        }
        .memberlist-state-text {
          color: var(--text-muted);
          font-size: 15px;
          margin: 0 0 16px 0;
        }
        .memberlist-retry-btn {
          background: #1C2233;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .memberlist-error-banner {
          background: rgba(220, 53, 69, 0.12);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        @media (max-width: 900px) {
          .memberlist-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .memberlist-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="memberlist-page">
        <div className="memberlist-header">
          <button onClick={() => navigate(-1)} className="memberlist-back">
            <span className="memberlist-back-arrow">←</span> Back
          </button>
          <h2 className="memberlist-title">{pageTitle}</h2>
          <div style={{ width: '80px' }}></div>
        </div>

        {error && (
          <div className="memberlist-error-banner">
            {error}
          </div>
        )}

        {isAdmin && members.length > 0 && (
          <div className="memberlist-search-wrap">
            <input
              type="text"
              className="memberlist-search-input"
              placeholder="Search members by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {loading ? (
          <div className="memberlist-state-box">
            <p className="memberlist-state-text">Loading members...</p>
          </div>
        ) : error ? (
          <div className="memberlist-state-box">
            <p className="memberlist-state-text">{error}</p>
            <button className="memberlist-retry-btn" onClick={fetchMembers}>
              Retry
            </button>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="memberlist-state-box">
            <p className="memberlist-state-text">
              {searchTerm ? 'No members match your search.' : 'No members found.'}
            </p>
          </div>
        ) : (
          <div className="memberlist-grid">
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onDelete={(id) => setMembers((prev) => prev.filter((m) => m.id !== id))}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MemberList;

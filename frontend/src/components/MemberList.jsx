import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembers } from '../services/api';
import MemberCard from './MemberCard';

function MemberList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMembers()
      .then((response) => {
        setMembers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching members:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: '24px' }}>Loading members...</p>;

  return (
    <>
      <style>{`
        .memberlist-page {
          padding: 48px 24px;
          max-width: 1100px;
          margin: 0 auto;
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
          margin-bottom: 24px;
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
          margin: 0 0 28px 0;
          text-align: center;
        }
        .memberlist-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .memberlist-empty {
          text-align: center;
          color: var(--text-muted);
          padding: 40px 0;
        }

        @media (max-width: 900px) {
          .memberlist-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .memberlist-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="memberlist-page">
        <button onClick={() => navigate(-1)} className="memberlist-back">
          <span className="memberlist-back-arrow">←</span> Back
        </button>

        <h2 className="memberlist-title">All Members</h2>

        {members.length === 0 ? (
          <p className="memberlist-empty">No members found.</p>
        ) : (
          <div className="memberlist-grid">
            {members.map((member) => (
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
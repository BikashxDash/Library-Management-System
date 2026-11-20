import { useState } from 'react';
import { payFine } from '../services/api';
import { useAuth } from '../context/AuthContext';

function FineCard({ fine, onUpdate }) {
  const { user } = useAuth();
  const [confirmPay, setConfirmPay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleMarkPaid = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await payFine(fine.id);
      onUpdate(fine.id);
    } catch (error) {
      setErrorMsg(error.response?.data?.error || 'Could not update fine');
      setConfirmPay(false);
    } finally {
      setLoading(false);
    }
  };

  const isPaid = fine.status === 'paid';
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <style>{`
        .fine-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .fine-card:hover {
          transform: translateY(-3px);
          border-color: #A9812F;
          box-shadow: 0 12px 24px -12px rgba(0,0,0,0.2);
        }
        .fine-card-member {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 6px 0;
        }
        .fine-card-email {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0 0 4px 0;
        }
        .fine-card-days {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0 0 10px 0;
        }
        .fine-card-book {
          font-size: 13px;
          color: #A9812F;
          font-weight: 600;
          margin: 0 0 10px 0;
        }
        .fine-card-amount {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 14px 0;
        }
        .fine-card-error {
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 6px;
          margin-bottom: 10px;
          background: rgba(220, 53, 69, 0.15);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }
        .fine-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--border);
          gap: 8px;
          flex-wrap: wrap;
        }
        .fine-card-status {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .fine-card-status.paid {
          background: rgba(46, 160, 67, 0.12);
          color: #2ea043;
        }
        .fine-card-status.unpaid {
          background: rgba(220, 53, 69, 0.12);
          color: #dc3545;
        }
        .fine-card-pay-btn {
          font-size: 12px;
          font-weight: 600;
          color: #A9812F;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .fine-card-pay-btn:hover {
          text-decoration: underline;
        }
        .fine-card-confirm-box {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
        }
        .fine-card-confirm-btn {
          background: #2ea043;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 3px 6px;
          font-size: 11px;
          cursor: pointer;
        }
        .fine-card-cancel-btn {
          background: transparent;
          color: var(--text-muted);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 2px 5px;
          font-size: 11px;
          cursor: pointer;
        }
        .fine-card-member-note {
          font-size: 11px;
          color: var(--text-muted);
          font-style: italic;
        }
      `}</style>

      <div className="fine-card">
        <h3 className="fine-card-member">{fine.member_name}</h3>
        {fine.member_email && <p className="fine-card-email">{fine.member_email}</p>}
        {fine.book_title && <p className="fine-card-book">📖 {fine.book_title}</p>}
        <p className="fine-card-days">{fine.days_late} day{fine.days_late !== 1 ? 's' : ''} late</p>
        <p className="fine-card-amount">₹{fine.amount}</p>

        {errorMsg && <div className="fine-card-error">{errorMsg}</div>}

        <div className="fine-card-meta">
          <span className={`fine-card-status ${isPaid ? 'paid' : 'unpaid'}`}>
            {isPaid ? 'Paid' : 'Unpaid'}
          </span>

          {!isPaid && (
            isAdmin ? (
              confirmPay ? (
                <div className="fine-card-confirm-box">
                  <span>Mark paid?</span>
                  <button
                    className="fine-card-confirm-btn"
                    onClick={handleMarkPaid}
                    disabled={loading}
                  >
                    {loading ? '...' : 'Yes'}
                  </button>
                  <button
                    className="fine-card-cancel-btn"
                    onClick={() => setConfirmPay(false)}
                    disabled={loading}
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  className="fine-card-pay-btn"
                  onClick={() => setConfirmPay(true)}
                >
                  Mark as Paid
                </button>
              )
            ) : (
              <span className="fine-card-member-note">Pay at desk</span>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default FineCard;

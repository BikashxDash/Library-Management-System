import { payFine } from '../services/api';

function FineCard({ fine, onUpdate }) {
  const handleMarkPaid = async () => {
    const confirmPay = window.confirm(`Mark ₹${fine.amount} fine for "${fine.member_name}" as paid?`);
    if (!confirmPay) return;

    const token = localStorage.getItem('token');

    try {
      await payFine(fine.id, token);
      onUpdate(fine.id);
    } catch (error) {
      alert(error.response?.data?.error || 'Could not update fine');
    }
  };

  const isPaid = fine.status === 'paid';

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
          margin: 0 0 14px 0;
        }
        .fine-card-amount {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 14px 0;
        }
        .fine-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--border);
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
      `}</style>

      <div className="fine-card">
        <h3 className="fine-card-member">{fine.member_name}</h3>
        <p className="fine-card-email">{fine.member_email}</p>
        <p className="fine-card-days">{fine.days_late} day{fine.days_late !== 1 ? 's' : ''} late</p>
        <p className="fine-card-amount">₹{fine.amount}</p>

        <div className="fine-card-meta">
          <span className={`fine-card-status ${isPaid ? 'paid' : 'unpaid'}`}>
            {isPaid ? 'Paid' : 'Unpaid'}
          </span>

          {!isPaid && (
            <button className="fine-card-pay-btn" onClick={handleMarkPaid}>
              Mark as Paid
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default FineCard;
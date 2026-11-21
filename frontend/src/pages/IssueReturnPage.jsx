import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBooks, getMembers, getTransactions, issueBook, returnBook } from '../services/api';

function IssueReturnPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('issue'); // 'issue' | 'return'

  // Data
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [issuedTransactions, setIssuedTransactions] = useState([]);

  // Issue Form state
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // default 14 days
    return d.toISOString().split('T')[0];
  });
  const [issueLoading, setIssueLoading] = useState(false);
  const [issueMsg, setIssueMsg] = useState({ type: '', text: '' });

  // Return state
  const [returnSearch, setReturnSearch] = useState('');
  const [returningId, setReturningId] = useState(null);
  const [returnMsg, setReturnMsg] = useState({ type: '', text: '' });

  // Load initial data
  const loadData = () => {
    getBooks().then((res) => setBooks(res.data)).catch(() => { });
    getMembers().then((res) => setMembers(res.data)).catch(() => { });
    getTransactions({ status: 'issued' })
      .then((res) => setIssuedTransactions(res.data.filter((t) => t.status === 'issued')))
      .catch(() => { });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    setIssueMsg({ type: '', text: '' });
    if (!selectedBookId || !selectedMemberId || !dueDate) {
      setIssueMsg({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setIssueLoading(true);
    try {
      const res = await issueBook({
        book_id: parseInt(selectedBookId, 10),
        member_id: parseInt(selectedMemberId, 10),
        due_date: dueDate,
      });
      setIssueMsg({
        type: 'success',
        text: res.data.message || 'Book issued successfully!',
      });
      setSelectedBookId('');
      setSelectedMemberId('');
      loadData();
    } catch (err) {
      setIssueMsg({
        type: 'error',
        text: err.response?.data?.error || 'Failed to issue book',
      });
    } finally {
      setIssueLoading(false);
    }
  };

  const handleReturnClick = async (transactionId) => {
    setReturningId(transactionId);
    setReturnMsg({ type: '', text: '' });
    try {
      const res = await returnBook(transactionId);
      const fine = res.data.fine;
      if (fine) {
        setReturnMsg({
          type: 'alert',
          text: `Book returned late (${fine.days_late} day(s) late). ₹${fine.amount} fine recorded.`,
        });
      } else {
        setReturnMsg({
          type: 'success',
          text: 'Book returned on time! Available copies restored.',
        });
      }
      loadData();
    } catch (err) {
      setReturnMsg({
        type: 'error',
        text: err.response?.data?.error || 'Could not process book return',
      });
    } finally {
      setReturningId(null);
    }
  };

  const availableBooks = books.filter((b) => b.available_copies > 0);
  const activeMembers = members.filter((m) => m.is_active);

  const filteredIssued = issuedTransactions.filter((t) => {
    if (!returnSearch) return true;
    const term = returnSearch.toLowerCase();
    return (
      t.book_title?.toLowerCase().includes(term) ||
      t.member_name?.toLowerCase().includes(term) ||
      t.member_email?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <style>{`
        .issuereturn-page {
          padding: 48px 24px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .issuereturn-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .issuereturn-back {
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
        .issuereturn-back:hover {
          border-color: #A9812F;
          transform: translateX(-2px);
        }
        .issuereturn-title {
          font-family: Georgia, serif;
          font-size: 28px;
          color: var(--text-primary);
          margin: 0;
          text-align: center;
        }
        .issuereturn-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
        }
        .issuereturn-tab-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 16px;
          font-weight: 600;
          padding: 8px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: color 0.15s ease, background 0.15s ease;
        }
        .issuereturn-tab-btn.active {
          background: #1C2233;
          color: #ffffff;
        }
        .issuereturn-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .issuereturn-form-group {
          margin-bottom: 20px;
        }
        .issuereturn-form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .issuereturn-form-group select,
        .issuereturn-form-group input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-page);
          color: var(--text-primary);
          font-size: 14px;
        }
        .issuereturn-form-group select:focus,
        .issuereturn-form-group input:focus {
          outline: none;
          border-color: #A9812F;
        }
        .issuereturn-submit-btn {
          width: 100%;
          padding: 14px;
          background: #1C2233;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .issuereturn-submit-btn:hover:not(:disabled) {
          background: #2a3348;
        }
        .issuereturn-banner {
          padding: 12px 18px;
          border-radius: 10px;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .issuereturn-banner.success {
          background: rgba(46, 160, 67, 0.12);
          color: #2ea043;
          border: 1px solid rgba(46, 160, 67, 0.3);
        }
        .issuereturn-banner.alert {
          background: rgba(220, 53, 69, 0.12);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }
        .issuereturn-banner.error {
          background: rgba(220, 53, 69, 0.12);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }
        .issuereturn-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }
        .issuereturn-table th,
        .issuereturn-table td {
          padding: 14px 16px;
          text-align: left;
          border-bottom: 1px solid var(--border);
          font-size: 14px;
        }
        .issuereturn-table th {
          color: var(--text-muted);
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .issuereturn-table td {
          color: var(--text-primary);
        }
        .issuereturn-return-btn {
          background: #A9812F;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }
        .issuereturn-return-btn:hover:not(:disabled) {
          opacity: 0.9;
        }
        .issuereturn-overdue-tag {
          color: #dc3545;
          font-weight: 600;
          font-size: 12px;
          margin-left: 6px;
        }
        .issuereturn-empty {
          text-align: center;
          color: var(--text-muted);
          padding: 40px 0;
        }
      `}</style>

      <div className="issuereturn-page">
        <div className="issuereturn-header">
          <button onClick={() => navigate(-1)} className="issuereturn-back">
            ← Back
          </button>
          <h2 className="issuereturn-title">Issue & Return Books</h2>
          <div style={{ width: '80px' }}></div>
        </div>

        <div className="issuereturn-tabs">
          <button
            className={`issuereturn-tab-btn ${activeTab === 'issue' ? 'active' : ''}`}
            onClick={() => setActiveTab('issue')}
          >
            📖 Issue a Book
          </button>
          <button
            className={`issuereturn-tab-btn ${activeTab === 'return' ? 'active' : ''}`}
            onClick={() => setActiveTab('return')}
          >
            🔄 Return a Book ({issuedTransactions.length})
          </button>
        </div>

        {activeTab === 'issue' && (
          <div className="issuereturn-card">
            {issueMsg.text && (
              <div className={`issuereturn-banner ${issueMsg.type}`}>
                {issueMsg.text}
              </div>
            )}

            <form onSubmit={handleIssueSubmit}>
              <div className="issuereturn-form-group">
                <label>Select Book</label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  required
                >
                  <option value="">-- Choose an available book --</option>
                  {availableBooks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} by {b.author} ({b.available_copies} available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="issuereturn-form-group">
                <label>Select Member</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  required
                >
                  <option value="">-- Choose active member --</option>
                  {activeMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="issuereturn-form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="issuereturn-submit-btn"
                disabled={issueLoading}
              >
                {issueLoading ? 'Issuing Book...' : 'Issue Book'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'return' && (
          <div className="issuereturn-card">
            {returnMsg.text && (
              <div className={`issuereturn-banner ${returnMsg.type}`}>
                {returnMsg.text}
              </div>
            )}

            <div className="issuereturn-form-group">
              <input
                type="text"
                placeholder="Search issued books by title or member name..."
                value={returnSearch}
                onChange={(e) => setReturnSearch(e.target.value)}
              />
            </div>

            {filteredIssued.length === 0 ? (
              <p className="issuereturn-empty">
                {returnSearch ? 'No matching issued books found.' : 'No books are currently issued.'}
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="issuereturn-table">
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Member</th>
                      <th>Issued Date</th>
                      <th>Due Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssued.map((t) => {
                      const isOverdue = new Date(t.due_date) < new Date();
                      return (
                        <tr key={t.id}>
                          <td>
                            <strong>{t.book_title}</strong>
                          </td>
                          <td>
                            {t.member_name}
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {t.member_email}
                            </div>
                          </td>
                          <td>
                            {new Date(t.issue_date).toLocaleDateString()}
                          </td>
                          <td>
                            {new Date(t.due_date).toLocaleDateString()}
                            {isOverdue && (
                              <span className="issuereturn-overdue-tag">⚠️ Overdue</span>
                            )}
                          </td>
                          <td>
                            <button
                              className="issuereturn-return-btn"
                              onClick={() => handleReturnClick(t.id)}
                              disabled={returningId === t.id}
                            >
                              {returningId === t.id ? 'Returning...' : 'Return'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default IssueReturnPage;


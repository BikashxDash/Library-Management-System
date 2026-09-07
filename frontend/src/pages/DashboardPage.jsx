import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/api';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');

    getDashboardStats(token)
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: '24px' }}>Loading dashboard...</p>;
  if (!stats) return <p style={{ padding: '24px' }}>Could not load dashboard.</p>;

  const cards = [
    { label: 'Total Books', value: stats.totalBooks, icon: '📚', accent: '#A9812F', to: '/books' },
  { label: 'Total Members', value: stats.totalMembers, icon: '👥', accent: '#A9812F', to: '/members' },
    { label: 'Books Issued', value: stats.issuedBooks, icon: '📖', accent: '#2ea043' },
    { label: 'Overdue Books', value: stats.overdueBooks, icon: '⏰', accent: '#dc3545', alert: stats.overdueBooks > 0 },
    { label: 'Unpaid Fines', value: `₹${stats.unpaidFines}`, icon: '💰', accent: '#dc3545', alert: stats.unpaidFines > 0 },
  ];

  const quickLinks = [
    { to: '/add-book', label: 'Add Book', icon: '➕' },
    { to: '/add-member', label: 'Add Member', icon: '👤' },
    { to: '/members', label: 'View Members', icon: '👥' },
    { to: '/books', label: 'Browse Catalog', icon: '📚' },
  ];

  return (
    <>
      <style>{`
        .dash-page {
          padding: 48px 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .dash-welcome {
          margin-bottom: 32px;
        }
        .dash-eyebrow {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #A9812F;
          margin: 0 0 8px 0;
        }
        .dash-title {
          font-family: Georgia, serif;
          font-size: 30px;
          color: var(--text-primary);
          margin: 0;
        }
        .dash-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }
        .dash-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 22px 18px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .dash-card-clickable {
          cursor: pointer;
        }
        .dash-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px -12px rgba(0,0,0,0.2);
          border-color: #A9812F;
        }
        .dash-card.alert {
          border-color: rgba(220, 53, 69, 0.4);
        }
        .dash-card-icon {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .dash-card-value {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 4px 0;
        }
        .dash-card-label {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0;
        }
        .dash-section-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 16px 0;
        }
        .dash-quicklinks {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .dash-quicklink {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          text-decoration: none;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 600;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }
        .dash-quicklink:hover {
          border-color: #A9812F;
          transform: translateY(-2px);
        }
        .dash-quicklink-icon {
          font-size: 18px;
        }

        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: repeat(3, 1fr); }
          .dash-quicklinks { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .dash-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="dash-page">
        <div className="dash-welcome">
          <p className="dash-eyebrow">Admin Dashboard</p>
          <h2 className="dash-title">Welcome back, {user?.name}</h2>
        </div>

        <div className="dash-grid">
          {cards.map((card) => {
            const CardWrapper = card.to ? Link : 'div';
            const wrapperProps = card.to ? { to: card.to } : {};

            return (
              <CardWrapper
                key={card.label}
                className={`dash-card ${card.alert ? 'alert' : ''} ${card.to ? 'dash-card-clickable' : ''}`}
                {...wrapperProps}
              >
                <div className="dash-card-icon">{card.icon}</div>
                <p className="dash-card-value" style={{ color: card.alert ? '#dc3545' : 'var(--text-primary)' }}>
                  {card.value}
                </p>
                <p className="dash-card-label">{card.label}</p>
              </CardWrapper>
            );
          })}
        </div>

        <h3 className="dash-section-title">Quick Actions</h3>
        <div className="dash-quicklinks">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to} className="dash-quicklink">
              <span className="dash-quicklink-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
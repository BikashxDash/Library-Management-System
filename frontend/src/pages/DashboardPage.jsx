// Dashboard page - library ka overall summary dikhata hai

import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();   // Token nikalne ke liye localStorage bhi use kar sakte hain

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

  if (loading) return <p>Loading dashboard...</p>;
  if (!stats) return <p>Could not load dashboard.</p>;

  // Ek chhota reusable style card ke liye
  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    minWidth: '150px',
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h3>{stats.totalBooks}</h3>
          <p>Total Books</p>
        </div>

        <div style={cardStyle}>
          <h3>{stats.totalMembers}</h3>
          <p>Total Members</p>
        </div>

        <div style={cardStyle}>
          <h3>{stats.issuedBooks}</h3>
          <p>Books Issued</p>
        </div>

        <div style={{ ...cardStyle, borderColor: stats.overdueBooks > 0 ? 'red' : '#ddd' }}>
          <h3>{stats.overdueBooks}</h3>
          <p>Overdue Books</p>
        </div>

        <div style={cardStyle}>
          <h3>₹{stats.unpaidFines}</h3>
          <p>Unpaid Fines</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
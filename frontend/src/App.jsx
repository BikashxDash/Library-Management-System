import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import BookList from './components/BookList';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import MembersPage from './pages/MembersPage';
import AddBookPage from './pages/AddBookpage';
import EditBookPage from './pages/EditBookPage';
import AddMemberPage from './pages/AddMemberPage';
import EditMemberPage from './pages/EditMemberPage';
import BookCategories from './components/BookCatagories';
import FineList from './components/FineList';
import IssueReturnPage from './pages/IssueReturnPage';
import TransactionsPage from './pages/TransactionsPage';
import PendingUsersPage from './pages/PendingUsersPage';
import ReservationsPage from './pages/ReservationsPage';

function Header({ theme, toggleTheme }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const isAdmin = user?.role === 'admin';

  return (
    <header className="app-header">
      {/* Top bar: title */}
      <div className="app-topbar">
        <Link to="/" className="app-title" onClick={closeMenu}>
          <span className="app-title-full">📚 Library Management System</span>
          <span className="app-title-short">📚 LMS</span>
        </Link>
        <p className="app-tagline">"A room without books is like a body without a soul."</p>
      </div>

      {/* Nav bar: links + theme toggle */}
      <nav className="app-nav">
        <button
          className={`app-hamburger ${menuOpen ? 'app-hamburger-open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`app-nav-links ${menuOpen ? 'app-nav-links-open' : ''}`}>
          {/* Admin Navigation */}
          {user && isAdmin && (
            <>
              <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
              <Link to="/books" onClick={closeMenu}>Books</Link>
              <Link to="/members" onClick={closeMenu}>Members</Link>
              <Link to="/issue-return" onClick={closeMenu}>Issue / Return</Link>
              <Link to="/transactions" onClick={closeMenu}>Transactions</Link>
              <Link to="/reservations" onClick={closeMenu}>Reservations</Link>
              <Link to="/fines" onClick={closeMenu}>Fines</Link>
              <Link to="/pending-users" onClick={closeMenu}>Approvals</Link>
              <button className="app-nav-logout" onClick={() => { logout(); closeMenu(); }}>
                Logout
              </button>
            </>
          )}

          {/* Member Navigation */}
          {user && !isAdmin && (
            <>
              <Link to="/books" onClick={closeMenu}>Browse Books</Link>
              <Link to="/transactions" onClick={closeMenu}>My Issued Books</Link>
              <Link to="/reservations" onClick={closeMenu}>My Reservations</Link>
              <Link to="/fines" onClick={closeMenu}>My Fines</Link>
              <button className="app-nav-logout" onClick={() => { logout(); closeMenu(); }}>
                Logout
              </button>
            </>
          )}

          {/* Guest Navigation */}
          {!user && (
            <>
              <Link to="/books" onClick={closeMenu}>Books</Link>
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <Link to="/register" onClick={closeMenu}>Register</Link>
            </>
          )}
        </div>

        <button
          className={`app-theme-toggle ${menuOpen ? 'app-theme-toggle-hide' : ''}`}
          onClick={toggleTheme}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </nav>
    </header>
  );
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <AuthProvider>
      <style>{`
        :root[data-theme="light"] {
          --bg-page: #F6F5F1;
          --text-primary: #1C2233;
          --text-muted: #5B6472;
          --card-bg: #ffffff;
          --border: #d8d4c8;
        }
        :root[data-theme="dark"] {
          --bg-page: #0E1320;
          --text-primary: #F1EFEA;
          --text-muted: #9AA3B2;
          --card-bg: #171d2c;
          --border: #2a3348;
        }

        * { box-sizing: border-box; }
        body {
          margin: 0;
          background: var(--bg-page);
          color: var(--text-primary);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .app-header {
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
        }

        .app-topbar {
          background: #0B0F1C;
          padding: 10px 28px;
          text-align: center;
        }
        .app-title {
          color: #ffffff;
          font-size: 30px;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: 0.4px;
        }

        .app-title-short { 
          display: none; 
        }

        .app-tagline {
          margin: 6px 0 0 0;
          font-size: 16px;
          font-style: italic;
          color: #9AA3B2;
          letter-spacing: 0.2px;
        }

        .app-nav {
          background: #12182B;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          position: relative;
          padding: 0 28px;
          min-height: 56px;
        }
        .app-nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .app-nav-links a {
          color: #c7cbd4;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.15s ease;
        }
        .app-nav-links a:hover { color: #A9812F; }
        .app-nav-user {
          color: #ffffff;
          font-size: 14px;
        }
        .app-nav-logout {
          background: transparent;
          border: 1.5px solid #3a4258;
          color: #ffffff;
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .app-nav-logout:hover { border-color: #A9812F; background: rgba(169,129,47,0.1); }

        .app-theme-toggle {
          background: transparent;
          border: 1.5px solid #3a4258;
          color: #ffffff;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .app-theme-toggle:hover { 
          border-color: #A9812F; background: rgba(169,129,47,0.1); 
        }

        .app-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          margin-left: auto;
        }
        .app-hamburger span {
          width: 22px;
          height: 2px;
          background: #ffffff;
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.2s ease;
        }
        .app-hamburger-open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .app-hamburger-open span:nth-child(2) {
          opacity: 0;
        }
        .app-hamburger-open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .app-content {
          min-height: calc(100vh - 96px);
        }

        @media (max-width: 640px) {
          .app-title { font-size: 14px; }
          .app-nav { padding: 12px 20px; justify-content: space-between; gap: 0;}
          .app-theme-toggle {
            order: 1;
          }
          .app-hamburger { display: flex;  order: 3;}
          .app-tagline { font-size: 10.5px; }
          .app-nav-links {
            display: none;
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
            width: 100%;
            margin-top: 16px;
            order: 2;
          }
          .app-nav-links-open { display: flex; }
          .app-nav-logout, .app-theme-toggle { width: 100%; text-align: left; }
          .app-title-full { display: none; }
          .app-title-short { display: inline; font-size: 20px; }
          .app-theme-toggle-hide {  display: none;  }
        }
      `}</style>

      <BrowserRouter>
        <Header theme={theme} toggleTheme={toggleTheme} />

        <div className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BookCategories />} />
            <Route path="/books/:category" element={<BookList />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin only routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/members"
              element={
                <ProtectedRoute adminOnly>
                  <MembersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-book"
              element={
                <ProtectedRoute adminOnly>
                  <AddBookPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-book/:id"
              element={
                <ProtectedRoute adminOnly>
                  <EditBookPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-member"
              element={
                <ProtectedRoute adminOnly>
                  <AddMemberPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-member/:id"
              element={
                <ProtectedRoute adminOnly>
                  <EditMemberPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/issue-return"
              element={
                <ProtectedRoute adminOnly>
                  <IssueReturnPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pending-users"
              element={
                <ProtectedRoute adminOnly>
                  <PendingUsersPage />
                </ProtectedRoute>
              }
            />

            {/* Shared routes (Admin sees all, Member sees own) */}
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-books"
              element={
                <ProtectedRoute>
                  <TransactionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <ProtectedRoute>
                  <ReservationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fines"
              element={
                <ProtectedRoute>
                  <FineList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

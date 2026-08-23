import { useState } from 'react';
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

function Navigation() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="app-nav">
      <Link to="/" className="app-logo" onClick={closeMenu}>📚 Library</Link>

      <button
        className="app-hamburger"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`app-nav-links ${menuOpen ? 'app-nav-links-open' : ''}`}>
        <Link to="/books" onClick={closeMenu}>Books</Link>

        {user ? (
          <>
            <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
            <Link to="/members" onClick={closeMenu}>Members</Link>
            <Link to="/add-member" onClick={closeMenu}>Add Member</Link>
            <Link to="/add-book" onClick={closeMenu}>Add Book</Link>
            <span className="app-nav-user">Hi, {user.name}</span>
            <button className="app-nav-logout" onClick={() => { logout(); closeMenu(); }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>Login</Link>
            <Link to="/register" onClick={closeMenu}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #F6F5F1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

        .app-nav {
          position: sticky;
          top: 0;
          z-index: 10;
          min-height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          background: #12182B;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
        }
        .app-logo {
          color: #ffffff;
          font-size: 17px;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: 0.3px;
        }
        .app-nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
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

        .app-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        .app-hamburger span {
          width: 22px;
          height: 2px;
          background: #ffffff;
          border-radius: 2px;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .app-content {
          min-height: calc(100vh - 64px);
        }

        @media (max-width: 640px) {
          .app-nav {
            flex-wrap: wrap;
            padding: 14px 20px;
          }
          .app-hamburger {
            display: flex;
          }
          .app-nav-links {
            display: none;
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
            width: 100%;
            margin-top: 16px;
          }
          .app-nav-links-open {
            display: flex;
          }
          .app-nav-logout {
            width: 100%;
            text-align: left;
          }
        }
      `}</style>

      <BrowserRouter>
        <Navigation />

        <div className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard"
                   element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
            } />
            <Route path="/members"
                   element={
                    <ProtectedRoute>
                      <MembersPage />
                    </ProtectedRoute>
            } />
            <Route path="/add-book"
                   element={
                    <ProtectedRoute>
                      <AddBookPage />
                    </ProtectedRoute>
            } />
            <Route path="/edit-book/:id"
                   element={
                    <ProtectedRoute>
                      <EditBookPage />
                    </ProtectedRoute>
            } />
            <Route path="/add-member"
                   element={
                    <ProtectedRoute>
                      <AddMemberPage />
                    </ProtectedRoute>
            } />
            <Route path="/edit-member/:id"
                   element={
                    <ProtectedRoute>
                      <EditMemberPage />
                    </ProtectedRoute>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
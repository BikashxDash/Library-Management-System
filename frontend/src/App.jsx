import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import BookList from './components/BookList';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import MembersPage from './pages/MembersPage';
import AddBookPage from './pages/AddBookpage';
import EditBookPage from './pages/EditBookPage';

function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '15px' }}>Books</Link>

      {user ? (
        // Agar user logged in hai, to naam aur Logout dikhao
        <>
          <Link to="/dashboard" style={{ marginRight: '15px' }}>Dashboard</Link>
          <Link to="/members" style={{ marginRight: '15px' }}>Members</Link>
          <Link to="/add-book" style={{ marginRight: '15px' }}>Add Book</Link>
          <span style={{ marginRight: '15px' }}>Hi, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        // Agar logged in nahi hai, to Login/Register dikhao
        <>
          <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
          <Link to="/register">Register</Link>

        </>
      )}
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ padding: '20px' }}>
          <h1>Library Management System</h1>

          <Navigation />

          <Routes>
            <Route path="/" element={<BookList />} />
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
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
// Ye component check karta hai user logged in hai ya nahi
// Agar nahi hai, to login page pe redirect kar deta hai
// Agar adminOnly=true hai aur user admin nahi hai to home page pe redirect karta hai

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  // Agar user logged in nahi hai, login page pe bhej do
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Agar route sirf admin ke liye hai aur user admin nahi hai
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Sab sahi hai, component dikhao
  return children;
}

export default ProtectedRoute;

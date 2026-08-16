// Ye component check karta hai user logged in hai ya nahi
// Agar nahi hai, to login page pe redirect kar deta hai

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // Agar user nahi hai (logged in nahi hai), login page pe bhej do
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User logged in hai, to jo bhi component pass kiya gaya hai wo dikhao
  return children;
}

export default ProtectedRoute;
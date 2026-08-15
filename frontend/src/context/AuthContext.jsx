// Ye Context poore app me "user logged in hai ya nahi" ye info share karta hai
// Bina isse har component me manually check karne ki zarurat nahi padti

import { createContext, useContext, useState } from 'react';

// Context banaya - ye ek "container" hai jisme data store hoga
const AuthContext = createContext();

// Provider - ye component poore app ko wrap karega aur data available karayega
export function AuthProvider({ children }) {
  // Shuruat me localStorage check karo - agar pehle se token hai, user already logged in hai
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login hone pe ye function call hoga
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Logout hone pe ye function call hoga
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook - isse dusre components easily ye data use kar sakenge
export function useAuth() {
  return useContext(AuthContext);
}
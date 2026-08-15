// Login page - user email/password daal ke login karega

import { useState } from 'react';
import api from '../services/api';

function LoginPage() {
  // Form ke fields ke liye state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Form submit hote hi ye function chalega
  const handleSubmit = async (e) => {
    e.preventDefault();   // Page ko refresh hone se rokta hai (default browser behavior)
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });

      // Backend se token milega, usko browser me save karo (localStorage)
      // Taaki refresh karne pe bhi login yaad rahe
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert('Login successful!');
      // Yahan hum aage member/admin ko redirect karenge (agla step)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>Login</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Password</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ padding: '8px 16px' }}>Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
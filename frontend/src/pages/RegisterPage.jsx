import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await api.post('/auth/register', { name, email, password });
      setSuccess(response.data.message || 'Registered! Waiting for admin approval.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <>
      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eef0f2;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding: 24px;
        }
        .auth-card {
          width: 100%;
          max-width: 380px;
          background: #f7f8fa;
          border-radius: 24px;
          padding: 36px 32px;
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.04);
          text-align: center;
        }
        .auth-icon {
          width: 44px; height: 44px;
          margin: 0 auto 16px auto;
          display: flex; align-items: center; justify-content: center;
        }
        .auth-title { font-size: 26px; font-weight: 700; color: #1d1d1f; margin: 0 0 6px 0; }
        .auth-subtitle { font-size: 14px; color: #86868b; margin: 0 0 28px 0; }
        .auth-field { position: relative; margin-bottom: 12px; }
        .auth-field input {
          width: 100%; box-sizing: border-box;
          padding: 15px 18px; font-size: 15px;
          border: none; border-radius: 14px;
          background: #ffffff;
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
          color: #1d1d1f;
          transition: box-shadow 0.15s ease;
        }
        .auth-field input::placeholder { color: #a1a1a6; }
        .auth-field input:focus { outline: none; box-shadow: inset 0 0 0 1.5px #1d1d1f; }
        .auth-toggle {
          position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
          background: none; border: none; font-size: 13px; color: #86868b; cursor: pointer;
        }
        .auth-error {
          background: #fdecec; color: #c0392b;
          font-size: 13px; padding: 10px 14px; border-radius: 12px; margin-bottom: 16px;
        }
        .auth-success {
          background: #e8f8ee; color: #1e7e34;
          font-size: 13px; padding: 10px 14px; border-radius: 12px; margin-bottom: 16px;
        }
        .auth-submit {
          width: 100%; padding: 15px; margin-top: 8px;
          background: #1d1d1f; color: #ffffff;
          border: none; border-radius: 14px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        .auth-submit:hover { background: #333336; }
        .auth-submit:active { transform: scale(0.98); }
        .auth-submit:focus-visible { outline: 2px solid #1d1d1f; outline-offset: 2px; }
        .auth-switch { font-size: 13px; color: #86868b; margin-top: 20px; }
        .auth-switch a { color: #0071e3; text-decoration: none; font-weight: 500; }
        .auth-switch a:hover { text-decoration: underline; }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M4 4.5C4 3.67 4.67 3 5.5 3H12V21H5.5C4.67 21 4 20.33 4 19.5V4.5Z" fill="#1d1d1f"/>
              <path d="M12 3H18.5C19.33 3 20 3.67 20 4.5V19.5C20 20.33 19.33 21 18.5 21H12V3Z" fill="#3a3a3c"/>
            </svg>
          </div>

          <h2 className="auth-title">Create Your Account</h2>
          <p className="auth-subtitle">It only takes a minute.</p>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-toggle"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="auth-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit">Create Account</button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
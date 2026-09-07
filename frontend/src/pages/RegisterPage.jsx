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
          min-height: calc(100vh - 96px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--bg-page);
          padding: 24px;
        }
        .auth-wrap {
          width: 100%;
          max-width: 380px;
        }
        .auth-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          text-decoration: none;
          background: var(--card-bg);
          border: 1px solid var(--border);
          padding: 8px 18px 8px 14px;
          border-radius: 999px;
          margin-bottom: 16px;
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
        }
        .auth-back:hover {
          border-color: #A9812F;
          color: #A9812F;
          transform: translateX(-2px);
        }
        .auth-back-arrow {
          font-size: 18px;
          line-height: 1;
        }
        .auth-card {
          width: 100%;
          background: var(--card-bg);
          border: 1px solid var(--border);
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
        .auth-title { font-size: 26px; font-weight: 700; color: var(--text-primary); margin: 0 0 6px 0; }
        .auth-subtitle { font-size: 14px; color: var(--text-muted); margin: 0 0 28px 0; }
        .auth-field { position: relative; margin-bottom: 12px; }
        .auth-field input {
          width: 100%; box-sizing: border-box;
          padding: 15px 18px; font-size: 15px;
          border: 1px solid var(--border); border-radius: 14px;
          background: var(--bg-page);
          color: var(--text-primary);
          transition: box-shadow 0.15s ease, border-color 0.15s ease;
        }
        .auth-field input::placeholder { color: var(--text-muted); }
        .auth-field input:focus { outline: none; border-color: #A9812F; box-shadow: 0 0 0 3px rgba(169,129,47,0.15); }
        .auth-toggle {
          position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
          background: none; border: none; font-size: 13px; color: var(--text-muted); cursor: pointer;
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
          background: #1C2233; color: #ffffff;
          border: none; border-radius: 14px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        .auth-submit:hover { background: #2a3348; }
        .auth-submit:active { transform: scale(0.98); }
        .auth-submit:focus-visible { outline: 2px solid #A9812F; outline-offset: 2px; }
        .auth-switch { font-size: 13px; color: var(--text-muted); margin-top: 20px; }
        .auth-switch a { color: #A9812F; text-decoration: none; font-weight: 500; }
        .auth-switch a:hover { text-decoration: underline; }
      `}</style>

      <div className="auth-page">
        <div className="auth-wrap">
          <button onClick={() => navigate(-1)} className="auth-back">
            <span className="auth-back-arrow">←</span> Back
          </button>

          <div className="auth-card">
            <div className="auth-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M4 4.5C4 3.67 4.67 3 5.5 3H12V21H5.5C4.67 21 4 20.33 4 19.5V4.5Z" fill="#1C2233"/>
                <path d="M12 3H18.5C19.33 3 20 3.67 20 4.5V19.5C20 20.33 19.33 21 18.5 21H12V3Z" fill="#A9812F"/>
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
      </div>
    </>
  );
}

export default RegisterPage;
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <style>{`
        .home-hero {
          min-height: calc(100vh - 64px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 24px;
        }
        .home-eyebrow {
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #A9812F;
          margin: 0 0 18px 0;
        }
        .home-quote {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: clamp(24px, 4vw, 40px);
          font-weight: 500;
          line-height: 1.35;
          color: #1C2233;
          max-width: 720px;
          margin: 0 0 14px 0;
        }
        .home-attribution {
          font-size: 14px;
          color: #5B6472;
          margin: 0 0 40px 0;
        }
        .home-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .home-btn {
          padding: 13px 28px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .home-btn-primary {
          background: #1C2233;
          color: #ffffff;
          border: none;
        }
        .home-btn-primary:hover { background: #2a3348; transform: translateY(-1px); }
        .home-btn-secondary {
          background: transparent;
          color: #1C2233;
          border: 1.5px solid #d8d4c8;
        }
        .home-btn-secondary:hover { border-color: #A9812F; color: #A9812F; }

        @media (max-width: 480px) {
          .home-actions {
            flex-direction: column;
            width: 100%;
            max-width: 280px;
          }
          .home-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      <div className="home-hero">
        <p className="home-eyebrow">Library Management System</p>
        <p className="home-quote">
          "A library is not a luxury but one of the necessities of life."
        </p>
        <p className="home-attribution">— Henry Ward Beecher</p>

        <div className="home-actions">
          <Link to="/books" className="home-btn home-btn-primary">Browse Books</Link>
          {!user && (
            <Link to="/login" className="home-btn home-btn-secondary">Login</Link>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await API.post('/auth/login', { email, password });
      login(response.data.token, {
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --navy: #0a1628;
          --navy-mid: #112240;
          --navy-light: #1d3461;
          --gold: #c9a84c;
          --gold-light: #e8c97e;
          --white: #f8f9fc;
          --muted: #8892a4;
          --border: rgba(201,168,76,0.18);
        }

        body { background: var(--navy); }

        .login-root {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          background: var(--navy);
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* animated background grid */
        .login-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: gridMove 20s linear infinite;
          pointer-events: none;
        }

        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(48px); }
        }

        /* left decorative panel */
        .login-left {
          flex: 1.15;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(44px, 5vw, 84px);
          position: relative;
          overflow: hidden;
        }

        .login-left::after {
          content: '';
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, var(--gold), transparent);
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.12;
        }

        .orb-1 {
          width: 500px; height: 500px;
          background: var(--gold);
          top: -100px; left: -150px;
          animation: orbFloat 8s ease-in-out infinite;
        }

        .orb-2 {
          width: 300px; height: 300px;
          background: #3a7bd5;
          bottom: 50px; right: 50px;
          animation: orbFloat 12s ease-in-out infinite reverse;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(201,168,76,0.08);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 8px 18px;
          margin-bottom: 48px;
          width: fit-content;
          animation: fadeInUp 0.6s ease forwards;
        }

        .badge-dot {
          width: 8px; height: 8px;
          background: var(--gold);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }

        .badge-text {
          font-size: 12px;
          font-weight: 500;
          color: var(--gold);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .login-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 700;
          color: var(--white);
          line-height: 1.15;
          margin-bottom: 24px;
          animation: fadeInUp 0.7s ease 0.1s both;
        }

        .login-headline span {
          color: var(--gold);
          font-style: italic;
        }

        .login-desc {
          font-size: 16px;
          color: var(--muted);
          line-height: 1.7;
          max-width: 420px;
          margin-bottom: 60px;
          font-weight: 300;
          animation: fadeInUp 0.7s ease 0.2s both;
        }

        .stats-row {
          display: flex;
          gap: 40px;
          animation: fadeInUp 0.7s ease 0.3s both;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: var(--white);
        }

        .stat-label {
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .stat-divider {
          width: 1px;
          background: var(--border);
          align-self: stretch;
        }

        /* right form panel */
        .login-right {
          width: min(560px, 44vw);
          min-width: 440px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 36px clamp(28px, 2.8vw, 56px);
          background: rgba(17, 34, 64, 0.6);
          backdrop-filter: blur(20px);
          position: relative;
          border-left: 1px solid var(--border);
        }

        .form-container {
          width: 100%;
          max-width: 420px;
          background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0));
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: clamp(24px, 2.2vw, 34px);
          box-shadow: 0 26px 56px rgba(3, 10, 24, 0.55);
          animation: fadeInUp 0.8s ease 0.2s both;
        }

        .form-logo {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          margin-bottom: 32px;
          box-shadow: 0 8px 24px rgba(201,168,76,0.3);
        }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 8px;
        }

        .form-subtitle {
          font-size: 14px;
          color: var(--muted);
          margin-bottom: 30px;
          font-weight: 300;
        }

        .field-group {
          margin-bottom: 16px;
          position: relative;
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: var(--muted);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 8px;
          transition: color 0.2s;
        }

        .field-label.active { color: var(--gold); }

        .field-input {
          width: 100%;
          padding: 15px 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          font-size: 15px;
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          transition: all 0.25s;
          outline: none;
        }

        .field-input:focus {
          border-color: var(--gold);
          background: rgba(201,168,76,0.05);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.1);
        }

        .field-input::placeholder { color: rgba(136,146,164,0.5); }

        .error-box {
          background: rgba(255,80,80,0.08);
          border: 1px solid rgba(255,80,80,0.2);
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #ff8080;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          color: var(--navy);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.5px;
          transition: all 0.25s;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
        }

        .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: white;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .submit-btn:hover::after { opacity: 0.1; }
        .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,168,76,0.4); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .form-footer {
          text-align: center;
          margin-top: 22px;
          font-size: 12px;
          color: var(--muted);
        }

        .secure-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .login-left { display: none; }
          .login-right {
            width: 100%;
            min-width: unset;
            border-left: none;
            padding: 24px;
          }
          .form-container {
            max-width: 100%;
            padding: 24px;
          }
        }
      `}</style>

      <div className="login-root">
        {/* Left Panel */}
        <div className="login-left">
          <div className="orb orb-1" />
          <div className="orb orb-2" />

          <div className="brand-badge">
            <div className="badge-dot" />
            <span className="badge-text">Enterprise Security Platform</span>
          </div>

          <h1 className="login-headline">
            Every action.<br />
            <span>Tracked.</span> Secured.<br />
            Accountable.
          </h1>

          <p className="login-desc">
            A production-grade audit logging system that records every user action
            with precision — built for teams that take security seriously.
          </p>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">∞</span>
              <span className="stat-label">Log Capacity</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">0ms</span>
              <span className="stat-label">Log Delay</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="login-right">
          <div className="form-container">
            <div className="form-logo">🛡️</div>

            <h2 className="form-title">Welcome back</h2>
            <p className="form-subtitle">Sign in to your audit dashboard</p>

            {error && (
              <div className="error-box">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className={`field-label ${focused === 'email' ? 'active' : ''}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="field-input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  required
                />
              </div>

              <div className="field-group">
                <label className={`field-label ${focused === 'password' ? 'active' : ''}`}>
                  Password
                </label>
                <input
                  type="password"
                  className="field-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? '⏳ Signing in...' : 'Sign In to Dashboard →'}
              </button>
            </form>

            <div className="form-footer">
              <div className="secure-badge">
                🔒 Secured with JWT Authentication
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
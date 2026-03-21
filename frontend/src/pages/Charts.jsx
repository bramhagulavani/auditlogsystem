import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar
} from 'recharts';

const COLORS = ['#34d399', '#60a5fa', '#a78bfa', '#fbbf24', '#f87171', '#fb923c'];

const Charts = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/audit-logs/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await API.post('/auth/logout'); } catch (e) {}
    logout();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --navy: #0a1628;
          --navy-card: #0f1e38;
          --gold: #c9a84c;
          --gold-light: #e8c97e;
          --white: #f8f9fc;
          --text: #cdd6f4;
          --muted: #8892a4;
          --border: rgba(201,168,76,0.12);
          --border-soft: rgba(255,255,255,0.06);
          --success: #34d399;
          --sidebar-w: 260px;
        }
        body { background: var(--navy); color: var(--text); font-family: 'DM Sans', sans-serif; }

        .charts-root { display: flex; min-height: 100vh; background: var(--navy); }
        .charts-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none; z-index: 0;
        }

        .sidebar {
          width: var(--sidebar-w); min-height: 100vh;
          background: var(--navy-card);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          position: fixed; left: 0; top: 0; bottom: 0; z-index: 100;
        }
        .sidebar-logo {
          padding: 28px 24px 24px;
          border-bottom: 1px solid var(--border-soft);
          display: flex; align-items: center; gap: 12px;
        }
        .logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(201,168,76,0.3);
        }
        .logo-text { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: var(--white); line-height: 1.2; }
        .logo-sub { font-size: 10px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }
        .sidebar-nav { padding: 20px 12px; flex: 1; }
        .nav-label { font-size: 10px; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; padding: 0 12px; margin-bottom: 8px; margin-top: 16px; }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 8px; cursor: pointer;
          transition: all 0.2s; font-size: 14px; color: var(--muted);
          margin-bottom: 2px; border: 1px solid transparent;
        }
        .nav-item:hover { background: rgba(255,255,255,0.04); color: var(--text); }
        .nav-item.active { background: rgba(201,168,76,0.08); border-color: var(--border); color: var(--gold); }
        .nav-icon { font-size: 16px; width: 20px; text-align: center; }
        .sidebar-user {
          padding: 16px; border-top: 1px solid var(--border-soft);
          display: flex; align-items: center; gap: 12px;
        }
        .user-avatar {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #1d3461, var(--gold));
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 600; color: white; flex-shrink: 0;
        }
        .user-name { font-size: 13px; font-weight: 600; color: var(--white); }
        .user-role { font-size: 11px; color: var(--gold); text-transform: uppercase; letter-spacing: 0.5px; }
        .logout-btn {
          background: none; border: none; cursor: pointer;
          color: var(--muted); font-size: 16px; padding: 4px;
          border-radius: 6px; transition: all 0.2s;
        }
        .logout-btn:hover { color: #f87171; background: rgba(248,113,113,0.1); }

        .main { margin-left: var(--sidebar-w); flex: 1; position: relative; z-index: 1; }
        .topbar {
          height: 64px; border-bottom: 1px solid var(--border-soft);
          display: flex; align-items: center; padding: 0 32px; gap: 16px;
          background: rgba(10,22,40,0.8); backdrop-filter: blur(12px);
          position: sticky; top: 0; z-index: 50;
        }
        .topbar-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; color: var(--white); flex: 1; }
        .topbar-title span { color: var(--gold); }
        .topbar-badge {
          font-size: 12px; color: var(--muted);
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-soft);
          padding: 6px 14px; border-radius: 100px;
        }

        .content { padding: 32px; }

       .charts-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
        max-width: 100%;
        }

        .chart-card {
          background: var(--navy-card);
          border: 1px solid var(--border-soft);
          border-radius: 14px;
          padding: 24px;
          animation: fadeInUp 0.5s ease both;
        }

        .chart-card.full { grid-column: 1 / -1; }
        .chart-card:nth-child(1) { animation-delay: 0.1s; }
        .chart-card:nth-child(2) { animation-delay: 0.2s; }
        .chart-card:nth-child(3) { animation-delay: 0.3s; }

        .chart-card::before {
          content: '';
          display: block;
          height: 2px;
          background: var(--card-accent, var(--gold));
          border-radius: 2px;
          margin-bottom: 20px;
          opacity: 0.6;
        }

        .chart-card:nth-child(1) { --card-accent: #34d399; }
        .chart-card:nth-child(2) { --card-accent: #60a5fa; }
        .chart-card:nth-child(3) { --card-accent: #a78bfa; }

        .chart-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px; font-weight: 600;
          color: var(--white); margin-bottom: 4px;
        }
        .chart-subtitle { font-size: 12px; color: var(--muted); margin-bottom: 24px; }

        .custom-tooltip {
          background: var(--navy-card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
        }

        .loading-state {
          display: flex; align-items: center; justify-content: center;
          height: 400px; flex-direction: column; gap: 16px;
        }
        .spinner {
          width: 36px; height: 36px;
          border: 2px solid var(--border-soft);
          border-top-color: var(--gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="charts-root">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">🛡️</div>
            <div>
              <div className="logo-text">AuditLog</div>
              <div className="logo-sub">Security Dashboard</div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-label">Main</div>
            <div className="nav-item" onClick={() => navigate('/dashboard')}>
              <span className="nav-icon">📊</span> Dashboard
            </div>
            <div className="nav-label">Reports</div>
            <div className="nav-item active">
              <span className="nav-icon">📈</span> Analytics
            </div>
            <div className="nav-label">System</div>
            <div className="nav-item">
              <span className="nav-icon">⚙️</span> Settings
            </div>
          </nav>
          <div className="sidebar-user">
            <div className="user-avatar">
              {(user?.username || 'U')[0].toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div className="user-name">{user?.username || 'User'}</div>
              <div className="user-role">{user?.role || 'admin'}</div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>⏻</button>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          <div className="topbar">
            <div className="topbar-title">Analytics <span>&</span> Charts</div>
            <div className="topbar-badge">📊 Visual Reports</div>
          </div>

          <div className="content">
            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>Loading charts...</span>
              </div>
            ) : (
              <div className="charts-grid">

                {/* Line Chart — Daily Activity */}
                <div className="chart-card full">
                  <div className="chart-title">Daily Activity</div>
                  <div className="chart-subtitle">Number of log entries per day over the past week</div>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={stats?.dailyStats || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="_id" tick={{ fill: '#8892a4', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#8892a4', fontSize: 12 }} />
                      <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                        <div className="custom-tooltip">
                          <div style={{ color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
                          <div style={{ color: '#34d399', fontWeight: 600 }}>{payload[0].value} logs</div>
                        </div>
                      ) : null} />
                      <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={2.5} dot={{ fill: '#34d399', r: 5 }} activeDot={{ r: 7 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart — Action Breakdown */}
                <div className="chart-card">
                  <div className="chart-title">Action Breakdown</div>
                  <div className="chart-subtitle">Distribution of action types</div>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={stats?.actionStats || []}
                        dataKey="count"
                        nameKey="_id"
                        cx="50%" cy="50%"
                        outerRadius={90}
                        innerRadius={50}
                        paddingAngle={3}
                      >
                        {(stats?.actionStats || []).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={({ active, payload }) => active && payload?.length ? (
                        <div className="custom-tooltip">
                          <div style={{ color: payload[0].payload.fill, fontWeight: 600 }}>{payload[0].name}</div>
                          <div>{payload[0].value} logs</div>
                        </div>
                      ) : null} />
                      <Legend formatter={(value) => <span style={{ color: 'var(--muted)', fontSize: 12 }}>{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart — Status Breakdown */}
                <div className="chart-card">
                  <div className="chart-title">Success vs Failure</div>
                  <div className="chart-subtitle">Log entries by status</div>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={stats?.statusStats || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="_id" tick={{ fill: '#8892a4', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#8892a4', fontSize: 12 }} />
                      <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                        <div className="custom-tooltip">
                          <div style={{ color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
                          <div style={{ color: '#a78bfa', fontWeight: 600 }}>{payload[0].value} logs</div>
                        </div>
                      ) : null} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {(stats?.statusStats || []).map((entry, i) => (
                          <Cell key={i} fill={entry._id === 'success' ? '#34d399' : '#f87171'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Charts;
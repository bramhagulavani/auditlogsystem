import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const ACTION_COLORS = {
  LOGIN: { bg: 'rgba(52,211,153,0.1)', color: '#34d399', border: 'rgba(52,211,153,0.2)' },
  LOGOUT: { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: 'rgba(148,163,184,0.2)' },
  CREATE: { bg: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: 'rgba(96,165,250,0.2)' },
  UPDATE: { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
  DELETE: { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
  EXPORT: { bg: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: 'rgba(167,139,250,0.2)' },
  IMPORT: { bg: 'rgba(251,146,60,0.1)', color: '#fb923c', border: 'rgba(251,146,60,0.2)' },
};

const getActionStyle = (action) =>
  ACTION_COLORS[action] || { bg: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: 'rgba(201,168,76,0.2)' };

const Dashboard = () => {
  const [selectedLog, setSelectedLog] = useState(null);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchLogs(); fetchStats(); }, [currentPage, filterAction, filterStatus, startDate, endDate]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: currentPage, limit: 10 });
      if (filterAction) params.append('action', filterAction);
      if (filterStatus) params.append('status', filterStatus);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const response = await API.get(`/audit-logs?${params}`);
      setLogs(response.data.logs);
      setTotalPages(response.data.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await API.get('/audit-logs/stats');
      setStats(response.data);
    } catch (err) { console.error(err); }
  };

  const handleLogout = async () => {
    try { await API.post('/auth/logout'); } catch (e) { /* ignore */ }
    logout();
    navigate('/login');
  };

  const handleExport = async () => {
    try {
      const response = await API.get('/audit-logs/export?format=csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (err) { alert('Export failed'); }
  };

  const filteredLogs = logs.filter(log =>
    search === '' ||
    log.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
    log.userId?.username?.toLowerCase().includes(search.toLowerCase()) ||
    log.action?.toLowerCase().includes(search.toLowerCase())
  );

  const totalLogs = stats?.totalLogs || 0;
  const loginCount = stats?.actionStats?.find(s => s._id === 'LOGIN')?.count || 0;
  const todayCount = stats?.dailyStats?.[stats.dailyStats.length - 1]?.count || 0;
  const successRate = stats?.statusStats?.find(s => s._id === 'success')?.count
    ? Math.round((stats.statusStats.find(s => s._id === 'success').count / totalLogs) * 100)
    : 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --navy: #0a1628;
          --navy-mid: #112240;
          --navy-light: #1d3461;
          --navy-card: #0f1e38;
          --gold: #c9a84c;
          --gold-light: #e8c97e;
          --white: #f8f9fc;
          --text: #cdd6f4;
          --muted: #8892a4;
          --border: rgba(201,168,76,0.12);
          --border-soft: rgba(255,255,255,0.06);
          --success: #34d399;
          --danger: #f87171;
          --sidebar-w: 260px;
        }

        body { background: var(--navy); color: var(--text); font-family: 'DM Sans', sans-serif; }

        .dash-root {
          display: flex;
          min-height: 100vh;
          background: var(--navy);
          position: relative;
        }

        /* animated bg */
        .dash-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        /* ---- SIDEBAR ---- */
        .sidebar {
          width: var(--sidebar-w);
          min-height: 100vh;
          background: var(--navy-card);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0; top: 0; bottom: 0;
          z-index: 100;
          transition: transform 0.3s ease;
        }

        .sidebar-logo {
          padding: 28px 24px 24px;
          border-bottom: 1px solid var(--border-soft);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(201,168,76,0.3);
        }

        .logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 700;
          color: var(--white);
          line-height: 1.2;
        }

        .logo-sub {
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .sidebar-nav {
          padding: 20px 12px;
          flex: 1;
        }

        .nav-label {
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 0 12px;
          margin-bottom: 8px;
          margin-top: 16px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          color: var(--muted);
          margin-bottom: 2px;
          border: 1px solid transparent;
        }

        .nav-item:hover { background: rgba(255,255,255,0.04); color: var(--text); }

        .nav-item.active {
          background: rgba(201,168,76,0.08);
          border-color: var(--border);
          color: var(--gold);
        }

        .nav-icon { font-size: 16px; width: 20px; text-align: center; }

        .sidebar-user {
          padding: 16px;
          border-top: 1px solid var(--border-soft);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, var(--navy-light), var(--gold));
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          font-weight: 600;
          color: white;
          flex-shrink: 0;
        }

        .user-info { flex: 1; min-width: 0; }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--white);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 11px;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--muted);
          font-size: 16px;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .logout-btn:hover { color: var(--danger); background: rgba(248,113,113,0.1); }

        /* ---- MAIN ---- */
        .main {
          margin-left: var(--sidebar-w);
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }

        /* topbar */
        .topbar {
          height: 64px;
          border-bottom: 1px solid var(--border-soft);
          display: flex;
          align-items: center;
          padding: 0 32px;
          gap: 16px;
          background: rgba(10,22,40,0.8);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .topbar-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--white);
          flex: 1;
        }

        .topbar-title span { color: var(--gold); }

        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-soft);
          border-radius: 8px;
          padding: 8px 14px;
          transition: all 0.2s;
        }

        .search-box:focus-within {
          border-color: var(--gold);
          background: rgba(201,168,76,0.05);
        }

        .search-box input {
          background: none;
          border: none;
          outline: none;
          font-size: 13px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          width: 200px;
        }

        .search-box input::placeholder { color: var(--muted); }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(201,168,76,0.08);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--gold);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .export-btn:hover { background: rgba(201,168,76,0.15); }

        /* content */
        .content { padding: 32px; }

        /* stats cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: var(--navy-card);
          border: 1px solid var(--border-soft);
          border-radius: 14px;
          padding: 22px 24px;
          position: relative;
          overflow: hidden;
          transition: all 0.25s;
          animation: fadeInUp 0.5s ease both;
        }

        .stat-card:hover {
          border-color: var(--border);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--card-accent, var(--gold));
          opacity: 0.6;
        }

        .stat-card:nth-child(1) { --card-accent: #c9a84c; animation-delay: 0.1s; }
        .stat-card:nth-child(2) { --card-accent: #60a5fa; animation-delay: 0.2s; }
        .stat-card:nth-child(3) { --card-accent: #34d399; animation-delay: 0.3s; }
        .stat-card:nth-child(4) { --card-accent: #a78bfa; animation-delay: 0.4s; }

        .stat-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .stat-icon {
          width: 40px; height: 40px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }

        .stat-trend {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 100px;
          background: rgba(52,211,153,0.1);
          color: var(--success);
        }

        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          color: var(--white);
          line-height: 1;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 12px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        /* action breakdown */
        .breakdown-section {
          background: var(--navy-card);
          border: 1px solid var(--border-soft);
          border-radius: 14px;
          padding: 24px;
          margin-bottom: 28px;
          animation: fadeInUp 0.5s ease 0.4s both;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 600;
          color: var(--white);
        }

        .section-badge {
          font-size: 11px;
          color: var(--muted);
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-soft);
          padding: 4px 10px;
          border-radius: 100px;
        }

        .breakdown-bars {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bar-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bar-label {
          width: 70px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
          text-align: right;
        }

        .bar-track {
          flex: 1;
          height: 8px;
          background: rgba(255,255,255,0.05);
          border-radius: 100px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 100px;
          transition: width 1s ease;
        }

        .bar-count {
          width: 30px;
          font-size: 12px;
          color: var(--muted);
          text-align: right;
        }

        /* filters */
        .filters-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          animation: fadeInUp 0.5s ease 0.5s both;
        }

        .filter-select {
          padding: 8px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-soft);
          border-radius: 8px;
          color: var(--text);
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-select:focus { border-color: var(--gold); }
        .filter-select option { background: var(--navy-mid); }

        .filter-clear {
          padding: 8px 14px;
          background: none;
          border: 1px solid var(--border-soft);
          border-radius: 8px;
          color: var(--muted);
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-clear:hover { border-color: var(--danger); color: var(--danger); }

        /* table */
        .table-section {
          background: var(--navy-card);
          border: 1px solid var(--border-soft);
          border-radius: 14px;
          overflow: hidden;
          animation: fadeInUp 0.5s ease 0.6s both;
        }

        .table-header {
          padding: 18px 24px;
          border-bottom: 1px solid var(--border-soft);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .table-count {
          font-size: 13px;
          color: var(--muted);
        }

        .table-count span { color: var(--gold); font-weight: 600; }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead tr {
          background: rgba(255,255,255,0.02);
        }

        th {
          padding: 12px 20px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: var(--muted);
          letter-spacing: 1px;
          text-transform: uppercase;
          border-bottom: 1px solid var(--border-soft);
          white-space: nowrap;
        }

        tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: background 0.15s;
        }

        tbody tr:hover { background: rgba(255,255,255,0.02); }
        tbody tr:last-child { border-bottom: none; }

        td {
          padding: 14px 20px;
          font-size: 13px;
          color: var(--text);
          vertical-align: middle;
        }

        .action-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          border: 1px solid;
        }

        .status-dot {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mini-avatar {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, var(--navy-light), var(--gold));
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
          font-weight: 600;
          color: white;
          flex-shrink: 0;
        }

        .user-email { font-size: 12px; color: var(--muted); }

        .ip-cell {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: var(--muted);
          background: rgba(255,255,255,0.03);
          padding: 3px 8px;
          border-radius: 4px;
          display: inline-block;
        }

        /* pagination */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          border-top: 1px solid var(--border-soft);
        }

        .page-btn {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-soft);
          border-radius: 8px;
          color: var(--text);
          font-size: 13px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .page-btn:hover { border-color: var(--gold); color: var(--gold); }
        .page-btn.active { background: rgba(201,168,76,0.1); border-color: var(--gold); color: var(--gold); }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
          flex-direction: column;
          gap: 16px;
        }

        .spinner {
          width: 36px; height: 36px;
          border: 2px solid var(--border-soft);
          border-top-color: var(--gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px;
          color: var(--muted);
          gap: 12px;
        }

        .empty-icon { font-size: 40px; opacity: 0.4; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: var(--navy-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 520px;
  max-width: 90vw;
  padding: 32px;
  position: relative;
  animation: slideUp 0.25s ease;
  box-shadow: 0 24px 80px rgba(0,0,0,0.5);
}

.modal-close {
  position: absolute;
  top: 16px; right: 16px;
  background: rgba(255,255,255,0.06);
  border: none;
  color: var(--muted);
  width: 32px; height: 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover { background: rgba(248,113,113,0.15); color: var(--danger); }

.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--white);
  margin-bottom: 6px;
}

.modal-subtitle {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 28px;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.modal-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-field.full {
  grid-column: 1 / -1;
}

.modal-field-label {
  font-size: 10px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.modal-field-value {
  font-size: 14px;
  color: var(--text);
  font-weight: 500;
}

.modal-footer {
  border-top: 1px solid var(--border-soft);
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.modal-btn {
  padding: 10px 24px;
  background: rgba(201,168,76,0.1);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--gold);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
}

.modal-btn:hover { background: rgba(201,168,76,0.2); }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
      `}</style>

      <div className="dash-root">
        {/* SIDEBAR */}
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
            <div className="nav-item active">
              <span className="nav-icon">📊</span> Dashboard
            </div>
            <div className="nav-item">
              <span className="nav-icon">📋</span> All Logs
            </div>
            <div className="nav-label">Reports</div>
            <div className="nav-item" onClick={handleExport}>
              <span className="nav-icon">⬇️</span> Export CSV
            </div>
            <div className="nav-item">
              <span className="nav-icon">📈</span> Analytics
            </div>
            <div className="nav-label">System</div>
            <div className="nav-item">
              <span className="nav-icon">⚙️</span> Settings
            </div>
          </nav>

          <div className="sidebar-user">
            <div className="user-avatar">
              {(user?.username || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.username || user?.email || 'User'}</div>
              <div className="user-role">{user?.role || 'admin'}</div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout">⏻</button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* Topbar */}
          <div className="topbar">
            <div className="topbar-title">
              Audit <span>Logs</span>
            </div>
            <div className="search-box">
              <span style={{ color: 'var(--muted)', fontSize: 14 }}>🔍</span>
              <input
                placeholder="Search user, action..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="export-btn" onClick={handleExport}>
              ⬇️ Export
            </button>
          </div>

          {/* Content */}
          <div className="content">

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="stat-icon">📋</div>
                  <span className="stat-trend">↑ All time</span>
                </div>
                <div className="stat-value">{totalLogs}</div>
                <div className="stat-label">Total Logs</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="stat-icon">🔐</div>
                  <span className="stat-trend" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>Logins</span>
                </div>
                <div className="stat-value">{loginCount}</div>
                <div className="stat-label">Login Events</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="stat-icon">📅</div>
                  <span className="stat-trend">Today</span>
                </div>
                <div className="stat-value">{todayCount}</div>
                <div className="stat-label">Today's Activity</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="stat-icon">✅</div>
                  <span className="stat-trend" style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa' }}>Rate</span>
                </div>
                <div className="stat-value">{successRate}%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>

            {/* Action Breakdown */}
            {stats?.actionStats?.length > 0 && (
              <div className="breakdown-section">
                <div className="section-header">
                  <div className="section-title">Action Breakdown</div>
                  <div className="section-badge">{stats.actionStats.length} action types</div>
                </div>
                <div className="breakdown-bars">
                  {stats.actionStats.map(item => {
                    const style = getActionStyle(item._id);
                    const pct = Math.round((item.count / totalLogs) * 100);
                    return (
                      <div className="bar-row" key={item._id}>
                        <div className="bar-label" style={{ color: style.color }}>{item._id}</div>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${pct}%`, background: style.color }} />
                        </div>
                        <div className="bar-count">{item.count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="filters-row">
              <input
                type="date"
                className="filter-select"
                value={startDate}
                onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }}
              />
              <input
                type="date"
                className="filter-select"
                value={endDate}
                onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }}
              />
              <select
                className="filter-select"
                value={filterAction}
                onChange={e => { setFilterAction(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Actions</option>
                <option value="LOGIN">LOGIN</option>
                <option value="LOGOUT">LOGOUT</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="EXPORT">EXPORT</option>
              </select>
              <select
                className="filter-select"
                value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Statuses</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
              </select>
              {(filterAction || filterStatus || search || startDate || endDate) && (
                <button className="filter-clear" onClick={() => { setFilterAction(''); setFilterStatus(''); setSearch(''); setStartDate(''); setEndDate(''); }}>
                  ✕ Clear filters
                </button>
              )}
              <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center' }}>
                {filteredLogs.length} result{filteredLogs.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Table */}
            <div className="table-section">
              <div className="table-header">
                <div className="section-title">Log Entries</div>
                <div className="table-count">Showing <span>{filteredLogs.length}</span> of <span>{totalLogs}</span> logs</div>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="spinner" />
                  <span style={{ color: 'var(--muted)', fontSize: 13 }}>Loading logs...</span>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <div>No logs found</div>
                  <div style={{ fontSize: 12 }}>Try changing your filters</div>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Resource</th>
                      <th>Status</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map(log => {
                      const actionStyle = getActionStyle(log.action);
                      return (
                        <tr key={log._id} onClick={() => setSelectedLog(log)} style={{ cursor: 'pointer' }}>
                          <td style={{ color: 'var(--muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td>
                            <div className="user-cell">
                              <div className="mini-avatar">
                                {(log.userId?.username || log.userId?.email || 'U')[0].toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 500 }}>{log.userId?.username || 'N/A'}</div>
                                <div className="user-email">{log.userId?.email || ''}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              className="action-badge"
                              style={{
                                background: actionStyle.bg,
                                color: actionStyle.color,
                                borderColor: actionStyle.border,
                              }}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td style={{ color: 'var(--muted)', fontSize: 12 }}>{log.resourceType}</td>
                          <td>
                            <div className="status-dot">
                              <div
                                className="dot"
                                style={{ background: log.status === 'success' ? 'var(--success)' : 'var(--danger)' }}
                              />
                              <span style={{ color: log.status === 'success' ? 'var(--success)' : 'var(--danger)' }}>
                                {log.status}
                              </span>
                            </div>
                          </td>
                          <td><span className="ip-cell">{log.ipAddress || 'N/A'}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>←</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`page-btn ${p === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
                  ))}
                  <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>→</button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedLog(null)}>✕</button>

            <div className="modal-title">Log Details</div>
            <div className="modal-subtitle">
              {new Date(selectedLog.createdAt).toLocaleString()}
            </div>

            <div className="modal-grid">
              <div className="modal-field">
                <div className="modal-field-label">Username</div>
                <div className="modal-field-value">{selectedLog.userId?.username || 'N/A'}</div>
              </div>
              <div className="modal-field">
                <div className="modal-field-label">Email</div>
                <div className="modal-field-value">{selectedLog.userId?.email || 'N/A'}</div>
              </div>
              <div className="modal-field">
                <div className="modal-field-label">Role</div>
                <div className="modal-field-value">{selectedLog.userId?.role || 'N/A'}</div>
              </div>
              <div className="modal-field">
                <div className="modal-field-label">Action</div>
                <div className="modal-field-value">
                  <span className="action-badge" style={{
                    background: getActionStyle(selectedLog.action).bg,
                    color: getActionStyle(selectedLog.action).color,
                    borderColor: getActionStyle(selectedLog.action).border,
                  }}>
                    {selectedLog.action}
                  </span>
                </div>
              </div>
              <div className="modal-field">
                <div className="modal-field-label">Resource Type</div>
                <div className="modal-field-value">{selectedLog.resourceType || 'N/A'}</div>
              </div>
              <div className="modal-field">
                <div className="modal-field-label">Status</div>
                <div className="modal-field-value">
                  <div className="status-dot">
                    <div className="dot" style={{ background: selectedLog.status === 'success' ? 'var(--success)' : 'var(--danger)' }} />
                    <span style={{ color: selectedLog.status === 'success' ? 'var(--success)' : 'var(--danger)' }}>
                      {selectedLog.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="modal-field">
                <div className="modal-field-label">IP Address</div>
                <div className="modal-field-value"><span className="ip-cell">{selectedLog.ipAddress || 'N/A'}</span></div>
              </div>
              <div className="modal-field">
                <div className="modal-field-label">Resource ID</div>
                <div className="modal-field-value" style={{ fontSize: 12, wordBreak: 'break-all' }}>{selectedLog.resourceId || 'N/A'}</div>
              </div>
              <div className="modal-field full">
                <div className="modal-field-label">Device / Browser</div>
                <div className="modal-field-value" style={{ fontSize: 12, color: 'var(--muted)' }}>{selectedLog.userAgent || 'N/A'}</div>
              </div>
              <div className="modal-field full">
                <div className="modal-field-label">Description</div>
                <div className="modal-field-value">{selectedLog.description || 'N/A'}</div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn" onClick={() => setSelectedLog(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { logout } = useAuth();
  const navigate = useNavigate();

  // This runs once when the component first loads
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await API.get('/audit-logs');
      setLogs(response.data.logs);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <p style={{ padding: '20px' }}>Loading logs...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Audit Logs Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: '8px 16px' }}>
          Logout
        </button>
      </div>

      <p>Total logs: {logs.length}</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Action</th>
            <th style={thStyle}>Resource</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={tdStyle}>
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td style={tdStyle}>
                {log.userId?.email || 'N/A'}
              </td>
              <td style={tdStyle}>{log.action}</td>
              <td style={tdStyle}>{log.resourceType}</td>
              <td style={tdStyle}>
                <span style={{
                  color: log.status === 'success' ? 'green' : 'red',
                  fontWeight: 'bold'
                }}>
                  {log.status}
                </span>
              </td>
              <td style={tdStyle}>{log.ipAddress || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {logs.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '40px', color: '#888' }}>
          No logs found
        </p>
      )}

    </div>
  );
};

// Styles as plain objects — same as writing CSS but in JavaScript
const thStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
};

const tdStyle = {
  padding: '10px 12px',
};

export default Dashboard;
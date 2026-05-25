import { useEffect, useState } from 'react';
import API from '../../app/axiosConfig';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadUsers = () => {
    setLoading(true);
    API.get('auth/users/')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log('Users error:', err.response?.data);
        setError('Failed to load users');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p style={{ textAlign: 'center', marginTop: 60 }}>Loading users...</p>;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>👥 Registered Users ({users.length})</h2>
        <button onClick={loadUsers}
          style={{ padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          🔄 Refresh
        </button>
      </div>

      {error && (
        <p style={{ color: 'red', background: '#fef2f2', padding: 12, borderRadius: 6, marginBottom: 16 }}>
          ❌ {error}
        </p>
      )}

      <input
        type="text"
        placeholder="🔍 Search by name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, marginBottom: 20, fontSize: 14 }}
      />

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
          <p style={{ fontSize: 50 }}>👥</p>
          <p>No users found.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14,minWidth: 600 }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '12px 14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>ID</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Username</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Email</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Phone</th>
              <th style={{ padding: '12px 14px', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>Verified</th>
              <th style={{ padding: '12px 14px', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>Role</th>
              <th style={{ padding: '12px 14px', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>Active</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 14px', color: '#6b7280' }}>#{user.id}</td>
                <td style={{ padding: '12px 14px', fontWeight: 500 }}>{user.username}</td>
                <td style={{ padding: '12px 14px', color: '#6b7280' }}>{user.email}</td>
                <td style={{ padding: '12px 14px' }}>{user.phone || '—'}</td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  {user.is_verified
                    ? <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✅</span>
                    : <span style={{ color: '#dc2626' }}>❌</span>}
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 10, fontSize: 12, fontWeight: 500,
                    background: user.is_staff ? '#ede9fe' : '#f3f4f6',
                    color: user.is_staff ? '#6d28d9' : '#374151',
                  }}>
                    {user.is_staff ? '⭐ Admin' : '👤 User'}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  {user.is_active
                    ? <span style={{ color: '#16a34a' }}>✅</span>
                    : <span style={{ color: '#dc2626' }}>❌</span>}
                </td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: '#6b7280' }}>
                  {new Date(user.date_joined).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <h2 style={{ marginBottom: 8 }}>⚙️ Admin Dashboard</h2>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>Welcome Admin! Manage your store from here.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
        <Link to="/admin/products" style={{ textDecoration: 'none' }}>
          <div style={{ padding: 24, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📦</div>
            <h3 style={{ color: '#1e40af', margin: 0 }}>Products</h3>
            <p style={{ color: '#6b7280', fontSize: 13, margin: '6px 0 0' }}>Add, edit, delete products</p>
          </div>
        </Link>

        <Link to="/admin/orders" style={{ textDecoration: 'none' }}>
          <div style={{ padding: 24, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
            <h3 style={{ color: '#166534', margin: 0 }}>Orders</h3>
            <p style={{ color: '#6b7280', fontSize: 13, margin: '6px 0 0' }}>View all customer orders</p>
          </div>
        </Link>

        <Link to="/admin/users" style={{ textDecoration: 'none' }}>
          <div style={{ padding: 24, background: '#fdf4ff', border: '1px solid #e9d5ff', borderRadius: 10, textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>👥</div>
            <h3 style={{ color: '#6b21a8', margin: 0 }}>Users</h3>
            <p style={{ color: '#6b7280', fontSize: 13, margin: '6px 0 0' }}>View registered users</p>
          </div>
        </Link>

        <a href="http://localhost:8000/admin" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          <div style={{ padding: 24, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🔧</div>
            <h3 style={{ color: '#9a3412', margin: 0 }}>Django Admin</h3>
            <p style={{ color: '#6b7280', fontSize: 13, margin: '6px 0 0' }}>Full admin panel</p>
          </div>
        </a>
      </div>
    </div>
  );
}

export default AdminDashboard;
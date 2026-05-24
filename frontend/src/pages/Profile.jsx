import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../app/axiosConfig';

function Profile() {
  const { token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ username: '', email: '', phone: '', address: '' });
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const loadOrders = () => {
    API.get('orders/my-orders/')
      .then(res => setOrders(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    if (!token && !localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    API.get('auth/profile/')
      .then(res => setProfile(res.data))
      .catch(() => {});
    loadOrders();
  }, []);

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      await API.put('auth/profile/', profile);
      setMessage('Profile updated successfully!');
      setError('');
    } catch {
      setError('Failed to update profile');
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirm = window.confirm(
      `Are you sure you want to cancel Order #${orderId}?\n\nThis action cannot be undone.`
    );
    if (!confirm) return;

    setCancellingId(orderId);
    try {
      const res = await API.put(`orders/cancel/${orderId}/`);
      alert(`✅ ${res.data.message}`);
      loadOrders();
    } catch (err) {
      alert(`❌ ${err.response?.data?.error || 'Failed to cancel order'}`);
    }
    setCancellingId(null);
  };

  const tabStyle = (tab) => ({
    padding: '10px 24px', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
    background: activeTab === tab ? '#4f46e5' : '#f3f4f6',
    color: activeTab === tab ? 'white' : '#374151',
    borderRadius: 6,
  });

  const statusColor = {
    pending:    { bg: '#fef9c3', color: '#854d0e' },
    processing: { bg: '#dbeafe', color: '#1e40af' },
    shipped:    { bg: '#e0f2fe', color: '#0369a1' },
    delivered:  { bg: '#dcfce7', color: '#166534' },
    cancelled:  { bg: '#fee2e2', color: '#991b1b' },
  };

  const canCancel = (status) => ['pending', 'processing'].includes(status);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>My Account</h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <button style={tabStyle('profile')} onClick={() => setActiveTab('profile')}>👤 Profile</button>
        <button style={tabStyle('orders')} onClick={() => setActiveTab('orders')}>
          📦 My Orders {orders.length > 0 && `(${orders.length})`}
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 24 }}>
          <h3 style={{ marginBottom: 20 }}>Edit Profile</h3>
          {message && (
            <p style={{ color: 'green', background: '#f0fdf4', padding: 10, borderRadius: 6, marginBottom: 16 }}>
              ✅ {message}
            </p>
          )}
          {error && (
            <p style={{ color: 'red', background: '#fef2f2', padding: 10, borderRadius: 6, marginBottom: 16 }}>
              ❌ {error}
            </p>
          )}
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: '#6b7280' }}>Username</label><br />
                <input value={profile.username}
                  onChange={e => setProfile({ ...profile, username: e.target.value })}
                  style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#6b7280' }}>Email</label><br />
                <input value={profile.email} disabled
                  style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 6, background: '#f9fafb' }} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#6b7280' }}>Phone</label><br />
                <input value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="Enter phone number"
                  style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 6 }} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: '#6b7280' }}>Address</label><br />
              <textarea value={profile.address}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
                placeholder="Enter your address" rows={3}
                style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 6 }} />
            </div>
            <button type="submit"
              style={{ padding: '10px 28px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>My Orders ({orders.length})</h3>
            <button onClick={loadOrders}
              style={{ padding: '7px 14px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
              🔄 Refresh
            </button>
          </div>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
              <p style={{ fontSize: 50 }}>📦</p>
              <p>No orders yet. Start shopping!</p>
              <button onClick={() => navigate('/')}
                style={{ padding: '10px 24px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                Shop Now
              </button>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 20, marginBottom: 16 }}>

                {/* Order Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <p style={{ fontWeight: 'bold', margin: 0, fontSize: 15 }}>Order #{order.id}</p>
                    <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>
                      🗓️ {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: statusColor[order.status]?.bg || '#f3f4f6',
                      color: statusColor[order.status]?.color || '#374151',
                    }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p style={{ fontWeight: 'bold', color: '#4f46e5', margin: '6px 0 0', fontSize: 16 }}>
                      ₹{order.total_price}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ background: '#f9fafb', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                  {order.items && order.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
                      <span>{item.product_name} × {item.quantity}</span>
                      <span style={{ fontWeight: 500 }}>₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Address */}
                <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px' }}>
                  📍 {order.address}
                </p>

                {/* Payment Status */}
                <p style={{ fontSize: 13, margin: '0 0 16px' }}>
                  💳 Payment:{' '}
                  <span style={{
                    fontWeight: 600,
                    color: order.payment_status === 'paid' ? '#166534' : '#854d0e'
                  }}>
                    {order.payment_status === 'paid' ? '✅ Paid' : '⏳ Pay on Delivery'}
                  </span>
                </p>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 10 }}>
                  {/* Track Button — not for cancelled */}
                  {order.status !== 'cancelled' && (
                    <button
                      onClick={() => navigate(`/track-order/${order.id}`)}
                      style={{
                        padding: '8px 18px', background: '#4f46e5', color: 'white',
                        border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13,
                      }}>
                      📍 Track Order
                    </button>
                  )}

                  {/* Cancel Button — only for pending and processing */}
                  {canCancel(order.status) && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancellingId === order.id}
                      style={{
                        padding: '8px 18px',
                        background: cancellingId === order.id ? '#9ca3af' : 'white',
                        color: cancellingId === order.id ? 'white' : '#ef4444',
                        border: '2px solid',
                        borderColor: cancellingId === order.id ? '#9ca3af' : '#ef4444',
                        borderRadius: 6, cursor: cancellingId === order.id ? 'not-allowed' : 'pointer',
                        fontSize: 13, fontWeight: 500,
                      }}>
                      {cancellingId === order.id ? '⏳ Cancelling...' : '❌ Cancel Order'}
                    </button>
                  )}

                  {/* Cancelled Badge */}
                  {order.status === 'cancelled' && (
                    <span style={{
                      padding: '8px 18px', background: '#fee2e2', color: '#991b1b',
                      borderRadius: 6, fontSize: 13, fontWeight: 500,
                    }}>
                      ❌ Order Cancelled
                    </span>
                  )}

                  {/* Delivered Badge */}
                  {order.status === 'delivered' && (
                    <span style={{
                      padding: '8px 18px', background: '#dcfce7', color: '#166534',
                      borderRadius: 6, fontSize: 13, fontWeight: 500,
                    }}>
                      ✅ Delivered
                    </span>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
import { useEffect, useState } from 'react';
import API from '../../app/axiosConfig';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColor = {
  pending:    { bg: '#fef9c3', color: '#854d0e' },
  processing: { bg: '#dbeafe', color: '#1e40af' },
  shipped:    { bg: '#e0f2fe', color: '#0369a1' },
  delivered:  { bg: '#dcfce7', color: '#166534' },
  cancelled:  { bg: '#fee2e2', color: '#991b1b' },
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [updating, setUpdating] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    API.get('auth/all-orders/')
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load orders'); setLoading(false); });
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    setMessage('');
    try {
      await API.put(`orders/update-status/${orderId}/`, { status: newStatus });
      setMessage(`✅ Order #${orderId} updated to "${newStatus}"`);
      loadOrders();
    } catch (err) {
      setMessage(`❌ Failed to update order #${orderId}`);
    }
    setUpdating(null);
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 60 }}>Loading orders...</p>;

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 24 }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>📋 All Orders ({orders.length})</h2>
        <button onClick={loadOrders}
          style={{ padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          🔄 Refresh
        </button>
      </div>

      {message && (
        <p style={{
          padding: 12, borderRadius: 6, marginBottom: 16,
          background: message.includes('✅') ? '#f0fdf4' : '#fef2f2',
          color: message.includes('✅') ? '#166534' : '#991b1b',
          border: `1px solid ${message.includes('✅') ? '#bbf7d0' : '#fecaca'}`,
        }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: 'red', background: '#fef2f2', padding: 12, borderRadius: 6, marginBottom: 16 }}>
          ❌ {error}
        </p>
      )}

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
          <p style={{ fontSize: 50 }}>📦</p>
          <p>No orders yet.</p>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 16, background: 'white' }}>

              {/* Order Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: 16, margin: 0, color: '#4f46e5' }}>Order #{order.id}</p>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 'bold', fontSize: 18, color: '#4f46e5', margin: 0 }}>₹{order.total_price}</p>
                  <span style={{
                    fontSize: 12, padding: '2px 10px', borderRadius: 10, fontWeight: 500,
                    background: order.payment_status === 'paid' ? '#dcfce7' : '#fef9c3',
                    color: order.payment_status === 'paid' ? '#166534' : '#854d0e',
                  }}>
                    {order.payment_status === 'paid' ? '✅ Paid' : '⏳ COD Pending'}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ background: '#f9fafb', borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 4px' }}>CUSTOMER</p>
                  <p style={{ fontWeight: 600, margin: 0 }}>{order.name}</p>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>📞 {order.phone}</p>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 4px' }}>DELIVERY ADDRESS</p>
                  <p style={{ fontSize: 13, margin: 0, lineHeight: 1.5 }}>{order.address}</p>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 8px' }}>ORDER ITEMS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {order.items && order.items.map(item => (
                    <span key={item.id} style={{ background: '#ede9fe', color: '#5b21b6', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>
                      {item.product_name} × {item.quantity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Update */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Update Status:</span>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {STATUS_OPTIONS.map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(order.id, status)}
                      disabled={order.status === status || updating === order.id}
                      style={{
                        padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                        border: `2px solid ${order.status === status ? statusColor[status].color : '#e5e7eb'}`,
                        background: order.status === status ? statusColor[status].bg : 'white',
                        color: order.status === status ? statusColor[status].color : '#6b7280',
                        cursor: order.status === status ? 'default' : 'pointer',
                        opacity: updating === order.id && order.status !== status ? 0.6 : 1,
                      }}
                    >
                      {updating === order.id && order.status !== status ? '...' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../app/axiosConfig';

const steps = [
  { key: 'pending',    label: 'Order Placed',   icon: '📋', desc: 'Your order has been placed successfully' },
  { key: 'processing', label: 'Processing',      icon: '⚙️', desc: 'Your order is being prepared' },
  { key: 'shipped',    label: 'Shipped',         icon: '🚚', desc: 'Your order is on the way' },
  { key: 'delivered',  label: 'Delivered',       icon: '✅', desc: 'Your order has been delivered' },
];

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('orders/my-orders/')
      .then(res => {
        const found = res.data.find(o => o.id === parseInt(orderId));
        if (found) {
          setOrder(found);
        } else {
          setError('Order not found');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load order');
        setLoading(false);
      });
  }, [orderId]);

  const getStepIndex = (status) => {
    if (status === 'cancelled') return -1;
    return steps.findIndex(s => s.key === status);
  };

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: 80 }}>
      <p style={{ fontSize: 16, color: '#6b7280' }}>Loading order details...</p>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', marginTop: 80 }}>
      <p style={{ fontSize: 40 }}>❌</p>
      <p style={{ color: 'red' }}>{error}</p>
      <button onClick={() => navigate('/profile')}
        style={{ padding: '10px 24px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
        My Orders
      </button>
    </div>
  );

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>

      {/* Header */}
      <button onClick={() => navigate('/profile')}
        style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', marginBottom: 20, fontSize: 15 }}>
        ← Back to My Orders
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h2 style={{ margin: 0 }}>Order #{order.id}</h2>
        <span style={{
          padding: '6px 16px', borderRadius: 20, fontWeight: 600, fontSize: 14,
          background: isCancelled ? '#fee2e2' : order.status === 'delivered' ? '#dcfce7' : '#dbeafe',
          color: isCancelled ? '#991b1b' : order.status === 'delivered' ? '#166534' : '#1e40af',
        }}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>
      <p style={{ color: '#6b7280', marginBottom: 32, fontSize: 14 }}>
        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      {/* Cancelled Message */}
      {isCancelled && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 20, marginBottom: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 36, margin: 0 }}>❌</p>
          <p style={{ fontWeight: 'bold', color: '#991b1b', margin: '8px 0 4px' }}>Order Cancelled</p>
          <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>This order has been cancelled.</p>
        </div>
      )}

      {/* Tracking Steps */}
      {!isCancelled && (
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: 28, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 28, fontSize: 16 }}>📍 Order Tracking</h3>

          <div style={{ position: 'relative' }}>
            {/* Progress Line */}
            <div style={{
              position: 'absolute', left: 22, top: 24, bottom: 24,
              width: 3, background: '#e5e7eb', zIndex: 0,
            }} />
            <div style={{
              position: 'absolute', left: 22, top: 24,
              width: 3, zIndex: 1, background: '#4f46e5',
              height: currentStep >= 0 ? `${(currentStep / (steps.length - 1)) * 85}%` : '0%',
              transition: 'height 0.5s ease',
            }} />

            {steps.map((step, index) => {
              const isDone = index <= currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 28, position: 'relative', zIndex: 2 }}>
                  {/* Circle */}
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, border: '3px solid',
                    borderColor: isDone ? '#4f46e5' : '#e5e7eb',
                    background: isDone ? (isCurrent ? '#4f46e5' : '#ede9fe') : 'white',
                    boxShadow: isCurrent ? '0 0 0 4px #c7d2fe' : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {isDone && !isCurrent ? '✓' : step.icon}
                  </div>

                  {/* Text */}
                  <div style={{ paddingTop: 8 }}>
                    <p style={{
                      margin: 0, fontWeight: isCurrent ? 700 : isDone ? 600 : 400,
                      color: isDone ? '#1f2937' : '#9ca3af', fontSize: 15,
                    }}>
                      {step.label}
                      {isCurrent && (
                        <span style={{ marginLeft: 8, fontSize: 11, background: '#4f46e5', color: 'white', padding: '2px 8px', borderRadius: 10 }}>
                          CURRENT
                        </span>
                      )}
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: isDone ? '#6b7280' : '#d1d5db' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: 16 }}>🛍️ Order Items</h3>
        {order.items && order.items.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>{item.product_name}</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Qty: {item.quantity} × ₹{item.price}</p>
            </div>
            <p style={{ fontWeight: 'bold', margin: 0 }}>
              ₹{(Number(item.price) * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontWeight: 'bold', fontSize: 16 }}>
          <span>Total Amount</span>
          <span style={{ color: '#4f46e5' }}>₹{order.total_price}</span>
        </div>
      </div>

      {/* Delivery & Payment Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <h3 style={{ marginBottom: 12, fontSize: 15 }}>📍 Delivery Address</h3>
          <p style={{ margin: 0, fontWeight: 600 }}>{order.name}</p>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{order.address}</p>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6b7280' }}>📞 {order.phone}</p>
        </div>

        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <h3 style={{ marginBottom: 12, fontSize: 15 }}>💳 Payment Info</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: '#6b7280' }}>Method</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Cash on Delivery</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#6b7280' }}>Status</span>
            <span style={{
              fontSize: 13, fontWeight: 600, padding: '2px 10px', borderRadius: 10,
              background: order.payment_status === 'paid' ? '#dcfce7' : '#fef9c3',
              color: order.payment_status === 'paid' ? '#166534' : '#854d0e',
            }}>
              {order.payment_status === 'paid' ? '✅ Paid' : '⏳ Pay on Delivery'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default OrderTracking;
import { useLocation, useNavigate } from 'react-router-dom';

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.order_id;

  return (
    <div style={{ textAlign: 'center', marginTop: 80, padding: 24 }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
      <h2 style={{ color: '#16a34a', fontSize: 28, marginBottom: 8 }}>
        Order Placed Successfully!
      </h2>
      <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 8 }}>
        Thank you for your order.
      </p>
      {orderId && (
        <p style={{ color: '#4f46e5', fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
          Order ID: #{orderId}
        </p>
      )}
      <p style={{ color: '#6b7280', marginBottom: 12 }}>
        Payment: <strong>Cash on Delivery</strong>
      </p>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>
        Your order is confirmed and will be delivered soon.
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button onClick={() => navigate('/')}
          style={{ padding: '12px 28px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15 }}>
          Continue Shopping
        </button>
        <button onClick={() => navigate('/profile')}
          style={{ padding: '12px 28px', background: 'white', color: '#4f46e5', border: '2px solid #4f46e5', borderRadius: 8, cursor: 'pointer', fontSize: 15 }}>
          View My Orders
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;
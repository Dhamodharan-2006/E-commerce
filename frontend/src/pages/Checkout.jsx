import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import API from '../app/axiosConfig';

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector(state => state.cart);

  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async e => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    console.log('Token:', token);

    if (!token) {
      navigate('/login');
      return;
    }

    if (!form.name || !form.phone || !form.address) {
      setError('Please fill all fields');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        cart_items: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        name: form.name,
        phone: form.phone,
        address: form.address,
        total_price: totalAmount,
      };

      console.log('Payload:', payload);

      const res = await API.post('orders/place/', payload);

      console.log('Success:', res.data);
      dispatch(clearCart());
      navigate('/order-success', { state: { order_id: res.data.order_id } });

    } catch (err) {
      console.log('Error status:', err.response?.status);
      console.log('Error data:', err.response?.data);

      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.response?.data?.error || 'Failed to place order. Please try again.');
      }
    }

    setLoading(false);
  };

  if (items.length === 0) return (
    <div style={{ textAlign: 'center', marginTop: 80 }}>
      <p style={{ fontSize: 50 }}>🛒</p>
      <h2>Your cart is empty</h2>
      <button onClick={() => navigate('/')}
        style={{ padding: '10px 24px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
        Go Shopping
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Checkout</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Left — Delivery Form */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 24 }}>
          <h3 style={{ marginBottom: 4 }}>📍 Delivery Details</h3>
          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>
            Payment: <strong>Cash on Delivery</strong>
          </p>

          {error && (
            <p style={{ color: 'red', background: '#fef2f2', padding: 10, borderRadius: 6, marginBottom: 16 }}>
              ❌ {error}
            </p>
          )}

          <form onSubmit={handlePlaceOrder}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: '#6b7280' }}>Full Name</label><br />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 6 }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: '#6b7280' }}>Phone Number</label><br />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 6 }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, color: '#6b7280' }}>Delivery Address</label><br />
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House no, Street, City, State, Pincode"
                rows={4}
                required
                style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 6 }}
              />
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>💵</span>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: '#166534' }}>Cash on Delivery</p>
                <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Pay when your order arrives</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: 14,
                background: loading ? '#9ca3af' : '#4f46e5',
                color: 'white', border: 'none', borderRadius: 8,
                fontSize: 16, fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}>
              {loading ? '⏳ Placing Order...' : '✅ Place Order'}
            </button>
          </form>
        </div>

        {/* Right — Order Summary */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 24 }}>
          <h3 style={{ marginBottom: 20 }}>🧾 Order Summary</h3>

          <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <img
                    src={
                      item.image_url ? item.image_url
                        : item.image ? `${item.image}`
                        : 'https://placehold.co/50x50?text=?'
                    }
                    alt={item.name}
                    onError={e => { e.target.src = 'https://placehold.co/50x50?text=?'; }}
                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
                  />
                  <div>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{item.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Qty: {item.quantity}</p>
                  </div>
                </div>
                <p style={{ fontWeight: 'bold', margin: 0 }}>
                  ₹{(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#6b7280' }}>Subtotal</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#6b7280' }}>Delivery</span>
              <span style={{ color: '#16a34a' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18, marginTop: 12, paddingTop: 12, borderTop: '1px solid #e5e7eb' }}>
              <span>Total</span>
              <span style={{ color: '#4f46e5' }}>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;
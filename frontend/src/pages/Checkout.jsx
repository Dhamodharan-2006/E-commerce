import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import API from '../app/axiosConfig';

/* Note: keep your existing import — just replace the JSX */
import { useNavigate as useNav } from 'react-router-dom';

function Checkout() {
  const dispatch  = useDispatch();
  const navigate  = useNav();
  const { items, totalAmount } = useSelector(s => s.cart);
  const { token: reduxToken }  = useSelector(s => s.auth);
  const token = reduxToken || localStorage.getItem('token');

  const [form,    setForm]    = useState({ name: '', phone: '', address: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async e => {
    e.preventDefault();
    setError('');
    if (!token) { navigate('/login'); return; }
    if (!form.name || !form.phone || !form.address) { setError('Please fill all fields'); return; }
    if (items.length === 0) { setError('Cart is empty'); return; }

    setLoading(true);
    try {
      const res = await API.post('orders/place/', {
        cart_items: items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })),
        name: form.name, phone: form.phone, address: form.address,
        total_price: totalAmount,
      });
      dispatch(clearCart());
      navigate('/order-success', { state: { order_id: res.data.order_id } });
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.response?.data?.error || 'Failed to place order');
      }
    }
    setLoading(false);
  };

  if (items.length === 0) return (
    <div style={{ textAlign: 'center', marginTop: 80, padding: 20 }}>
      <p style={{ fontSize: 50 }}>🛒</p>
      <h2>Cart is empty</h2>
      <button onClick={() => navigate('/')} style={{ marginTop: 16, padding: '10px 24px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Go Shopping</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h2 style={{ marginBottom: 20 }}>Checkout</h2>

      {/* Stack on mobile, side-by-side on desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>

        {/* Delivery Form */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 10, padding: 20 }}>
          <h3 style={{ marginBottom: 4 }}>📍 Delivery Details</h3>
          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 18 }}>Payment: <strong>Cash on Delivery</strong></p>

          {error && <p style={{ color: 'red', background: '#fef2f2', padding: 10, borderRadius: 6, marginBottom: 14, fontSize: 13 }}>❌ {error}</p>}

          <form onSubmit={handlePlaceOrder}>
            {[
              { name: 'name',    label: 'Full Name',       placeholder: 'Your full name',       type: 'text'     },
              { name: 'phone',   label: 'Phone Number',    placeholder: 'Your phone number',    type: 'tel'      },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>{f.label}</label>
                <input name={f.name} type={f.type} placeholder={f.placeholder} required value={form[f.name]} onChange={handleChange}
                  style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} />
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>Delivery Address</label>
              <textarea name="address" rows={3} required placeholder="House no, Street, City, State, Pincode" value={form.address} onChange={handleChange}
                style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, resize: 'none' }} />
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 12, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>💵</span>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: '#166534', fontSize: 14 }}>Cash on Delivery</p>
                <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Pay when your order arrives</p>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: 13, background: loading ? '#9ca3af' : '#4f46e5', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? '⏳ Placing Order...' : '✅ Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 10, padding: 20 }}>
          <h3 style={{ marginBottom: 16 }}>🧾 Order Summary</h3>

          <div style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 14 }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, minWidth: 0 }}>
                  <img src={item.image_url || (item.image ? `http://localhost:8000/media/${item.image}` : 'https://placehold.co/44x44?text=?')}
                    alt={item.name} onError={e => { e.target.src = 'https://placehold.co/44x44?text=?'; }}
                    style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: 13, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Qty: {item.quantity}</p>
                  </div>
                </div>
                <p style={{ fontWeight: 700, margin: 0, flexShrink: 0 }}>₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#6b7280', fontSize: 14 }}>Subtotal</span>
              <span style={{ fontSize: 14 }}>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: '#6b7280', fontSize: 14 }}>Delivery</span>
              <span style={{ color: '#16a34a', fontWeight: 600 }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18 }}>
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
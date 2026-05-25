import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, increaseQty, decreaseQty } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import { useDarkStyle } from '../app/useDarkStyle';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector(s => s.cart);
  const { token }              = useSelector(s => s.auth);
  const { page, card, text, subText, darkMode } = useDarkStyle();

  if (items.length === 0) return (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: 20 }}>
      <p style={{ fontSize: 60 }}>🛒</p>
      <h2 style={{ ...text, marginBottom: 8 }}>Your cart is empty</h2>
      <p style={{ ...subText, marginBottom: 20 }}>Add some products!</p>
      <button onClick={() => navigate('/')} style={{ padding: '10px 28px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15 }}>
        Go Shopping
      </button>
    </div>
  );

  return (
    <div style={{ ...page, padding: 16 }}>
      <div style={{ maxWidth: 750, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 20, ...text }}>Shopping Cart ({items.length})</h2>

        {items.map(item => (
          <div key={item.id} style={{ ...card, borderRadius: 10, padding: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <img
              src={
              product.image_url
                ? product.image_url
                : product.image
                ? `${product.image}`
                : 'https://placehold.co/400x400?text=No+Image'
            }
              alt={item.name}
              onError={e => { e.target.src = 'https://placehold.co/80x80?text=?'; }}
              style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
            />

            <div style={{ flex: 1, minWidth: 100 }}>
              <p style={{ fontWeight: 600, margin: '0 0 4px', ...text, fontSize: 14 }}>{item.name}</p>
              <p style={{ color: '#4f46e5', fontWeight: 700, margin: 0 }}>₹{item.price}</p>
            </div>

            {/* Qty controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => dispatch(decreaseQty(item.id))}
                style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`, background: darkMode ? '#334155' : 'white', color: darkMode ? 'white' : 'black', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ fontWeight: 700, minWidth: 22, textAlign: 'center', ...text }}>{item.quantity}</span>
              <button onClick={() => dispatch(increaseQty(item.id))}
                style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`, background: darkMode ? '#334155' : 'white', color: darkMode ? 'white' : 'black', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>

            <p style={{ fontWeight: 700, color: '#4f46e5', minWidth: 70, textAlign: 'right' }}>
              ₹{(Number(item.price) * item.quantity).toFixed(2)}
            </p>

            <button onClick={() => dispatch(removeFromCart(item.id))}
              style={{ background: '#fef2f2', border: 'none', color: '#dc2626', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 16 }}>
              🗑️
            </button>
          </div>
        ))}

        {/* Summary */}
        <div style={{ ...card, borderRadius: 10, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={subText}>Subtotal</span><span style={text}>₹{totalAmount.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={subText}>Delivery</span><span style={{ color: '#16a34a', fontWeight: 600 }}>FREE</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 20, marginBottom: 20 }}>
            <span style={text}>Total</span>
            <span style={{ color: '#4f46e5' }}>₹{totalAmount.toFixed(2)}</span>
          </div>
          <button
            onClick={() => (token || localStorage.getItem('token')) ? navigate('/checkout') : navigate('/login')}
            style={{ width: '100%', padding: 14, background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useTheme } from '../app/ThemeContext';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, isAdmin } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const { darkMode, toggleDarkMode } = useTheme();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setOpen(false);
  };

  const navBg   = isAdmin ? '#1e1b4b' : '#4f46e5';
  const linkCss = { color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 500 };

  /* ── shared link lists ── */
  const adminLinks = (
    <>
      <Link to="/admin"          style={linkCss} onClick={() => setOpen(false)}>📊 Dashboard</Link>
      <Link to="/admin/products" style={linkCss} onClick={() => setOpen(false)}>📦 Products</Link>
      <Link to="/admin/orders"   style={linkCss} onClick={() => setOpen(false)}>📋 Orders</Link>
      <Link to="/admin/users"    style={linkCss} onClick={() => setOpen(false)}>👥 Users</Link>
    </>
  );

  const userLinks = (
    <>
      <Link to="/"        style={linkCss} onClick={() => setOpen(false)}>Home</Link>
      <Link to="/cart"    style={{ ...linkCss, position: 'relative' }} onClick={() => setOpen(false)}>
        🛒 Cart
        {items.length > 0 && (
          <span style={{ marginLeft: 4, background: '#ef4444', color: 'white', borderRadius: '50%', padding: '0 5px', fontSize: 11, fontWeight: 700 }}>
            {items.length}
          </span>
        )}
      </Link>
      {token ? (
        <>
          <Link to="/profile"  style={linkCss} onClick={() => setOpen(false)}>👤 Profile</Link>
          <Link to="/checkout" style={linkCss} onClick={() => setOpen(false)}>Checkout</Link>
        </>
      ) : (
        <>
          <Link to="/login"  style={linkCss} onClick={() => setOpen(false)}>Login</Link>
          <Link to="/signup" style={linkCss} onClick={() => setOpen(false)}>Sign Up</Link>
        </>
      )}
    </>
  );

  return (
    <nav style={{ background: navBg, position: 'sticky', top: 0, zIndex: 999 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to={isAdmin ? '/admin' : '/'} style={{ color: 'white', fontWeight: 800, fontSize: 20, textDecoration: 'none' }}>
          🛒 ShopCart
        </Link>

        {/* Desktop Links */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {isAdmin ? adminLinks : userLinks}
          <button onClick={toggleDarkMode}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 20, padding: '5px 12px', color: 'white', cursor: 'pointer', fontSize: 13 }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          {token && (
            <button onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
              Logout
            </button>
          )}
        </div>

        {/* Mobile Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="show-mobile-flex">
          {!isAdmin && (
            <Link to="/cart" style={{ color: 'white', textDecoration: 'none', position: 'relative' }}>
              🛒
              {items.length > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {items.length}
                </span>
              )}
            </Link>
          )}
          <button onClick={toggleDarkMode}
            style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', color: 'white', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{ background: navBg, borderTop: '1px solid rgba(255,255,255,0.15)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {isAdmin ? adminLinks : userLinks}
          {token && (
            <button onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white', padding: '8px', borderRadius: 6, cursor: 'pointer', textAlign: 'left' }}>
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
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

  const navBg = isAdmin ? '#1e1b4b' : '#4f46e5';

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    padding: '6px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  };

  const adminLinks = [
    { to: '/admin',          label: '📊 Dashboard' },
    { to: '/admin/products', label: '📦 Products' },
    { to: '/admin/orders',   label: '📋 Orders' },
    { to: '/admin/users',    label: '👥 Users' },
  ];

  const userLinks = [
    { to: '/',    label: 'Home' },
  ];

  return (
    <>
      {/* ── Inline responsive styles ── */}
      <style>{`
        .nav-desktop { display: flex; }
        .nav-hamburger { display: none; }
        .nav-mobile-cart { display: none; }

        @media (max-width: 768px) {
          .nav-desktop    { display: none !important; }
          .nav-hamburger  { display: flex !important; }
          .nav-mobile-cart{ display: flex !important; }
        }
      `}</style>

      <nav style={{ background: navBg, position: 'sticky', top: 0, zIndex: 999, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to={isAdmin ? '/admin' : '/'} style={{ color: 'white', fontWeight: 800, fontSize: 20, textDecoration: 'none', flexShrink: 0 }}>
            🛒 ShopCart
          </Link>

          {/* ── Desktop links ── */}
          <div className="nav-desktop" style={{ alignItems: 'center', gap: 20 }}>
            {isAdmin
              ? adminLinks.map(l => (
                  <Link key={l.to} to={l.to} style={linkStyle}>{l.label}</Link>
                ))
              : (
                <>
                  <Link to="/"     style={linkStyle}>Home</Link>
                  <Link to="/cart" style={{ ...linkStyle, position: 'relative' }}>
                    🛒 Cart
                    {items.length > 0 && <CartBadge count={items.length} />}
                  </Link>
                  {token ? (
                    <>
                      <Link to="/profile"  style={linkStyle}>👤 Profile</Link>
                      <Link to="/checkout" style={linkStyle}>Checkout</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/login"  style={linkStyle}>Login</Link>
                      <Link to="/signup" style={linkStyle}>Sign Up</Link>
                    </>
                  )}
                </>
              )
            }

            <button onClick={toggleDarkMode} style={iconBtnStyle}>
              {darkMode ? '☀️' : '🌙'}
            </button>

            {token && (
              <button onClick={handleLogout} style={logoutBtnStyle}>
                Logout
              </button>
            )}
          </div>

          {/* ── Mobile right side ── */}
          <div className="nav-hamburger" style={{ alignItems: 'center', gap: 10 }}>
            {/* Cart icon — user only */}
            {!isAdmin && (
              <Link to="/cart" style={{ color: 'white', textDecoration: 'none', position: 'relative' }}>
                🛒
                {items.length > 0 && (
                  <span style={{ position: 'absolute', top: -6, right: -8, background: '#ef4444', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {items.length}
                  </span>
                )}
              </Link>
            )}

            <button onClick={toggleDarkMode} style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer', padding: 4 }}>
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Hamburger / Close */}
            <button
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: 24, cursor: 'pointer', lineHeight: 1, padding: 4 }}
            >
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* ── Mobile slide-down menu ── */}
        {open && (
          <div style={{ background: navBg, borderTop: '1px solid rgba(255,255,255,0.15)', padding: '8px 16px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {isAdmin
              ? adminLinks.map(l => (
                  <MobileLink key={l.to} to={l.to} label={l.label} onClose={() => setOpen(false)} />
                ))
              : (
                <>
                  <MobileLink to="/"        label="Home"     onClose={() => setOpen(false)} />
                  <MobileLink to="/cart"    label={`🛒 Cart${items.length > 0 ? ` (${items.length})` : ''}`} onClose={() => setOpen(false)} />
                  {token ? (
                    <>
                      <MobileLink to="/profile"  label="👤 Profile" onClose={() => setOpen(false)} />
                      <MobileLink to="/checkout" label="Checkout"   onClose={() => setOpen(false)} />
                    </>
                  ) : (
                    <>
                      <MobileLink to="/login"  label="Login"   onClose={() => setOpen(false)} />
                      <MobileLink to="/signup" label="Sign Up" onClose={() => setOpen(false)} />
                    </>
                  )}
                </>
              )
            }

            {token && (
              <button
                onClick={handleLogout}
                style={{ marginTop: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '10px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: 500 }}
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

/* ── Small helper components ── */

function CartBadge({ count }) {
  return (
    <span style={{ background: '#ef4444', color: 'white', borderRadius: '50%', padding: '0 5px', fontSize: 11, fontWeight: 700, minWidth: 18, textAlign: 'center' }}>
      {count}
    </span>
  );
}

function MobileLink({ to, label, onClose }) {
  return (
    <Link
      to={to}
      onClick={onClose}
      style={{ color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 500, padding: '10px 4px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'block' }}
    >
      {label}
    </Link>
  );
}

/* ── Shared button styles ── */
const iconBtnStyle = {
  background: 'rgba(255,255,255,0.15)',
  border: 'none',
  borderRadius: 20,
  padding: '5px 12px',
  color: 'white',
  cursor: 'pointer',
  fontSize: 13,
};

const logoutBtnStyle = {
  background: 'rgba(255,255,255,0.15)',
  border: '1px solid rgba(255,255,255,0.5)',
  color: 'white',
  padding: '5px 14px',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
};

export default Navbar;
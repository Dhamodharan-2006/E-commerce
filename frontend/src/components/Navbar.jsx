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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMenuOpen(false);
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: 15,
    padding: '6px 0',
  };

  const navBg = isAdmin ? '#1e1b4b' : '#4f46e5';

  return (
    <nav style={{ background: navBg, padding: '12px 24px', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>

        {/* Logo */}
        <Link to="/" style={{ color: 'white', fontWeight: 'bold', fontSize: 20, textDecoration: 'none' }}
          onClick={() => setMenuOpen(false)}>
          {isAdmin ? '⚙️ Admin Panel' : '🛒 ShopKart'}
        </Link>

        {/* Right side — Desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

          {/* Dark mode toggle — always visible */}
          <button onClick={toggleDarkMode}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 20,
              padding: '6px 14px', color: 'white', cursor: 'pointer', fontSize: 14,
            }}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          {/* Desktop Links */}
          <div className="desktop-nav" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {isAdmin ? (
              <>
                <Link to="/admin" style={linkStyle}>Dashboard</Link>
                <Link to="/admin/products" style={linkStyle}>📦 Products</Link>
                <Link to="/admin/orders" style={linkStyle}>📋 Orders</Link>
                <Link to="/admin/users" style={linkStyle}>👥 Users</Link>
                <button onClick={handleLogout}
                  style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white', padding: '6px 14px', borderRadius: 6, cursor: 'pointer' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" style={linkStyle}>Home</Link>
                <Link to="/cart" style={{ ...linkStyle, position: 'relative' }}>
                  🛒 Cart
                  {items.length > 0 && (
                    <span style={{
                      position: 'absolute', top: -8, right: -10,
                      background: '#ef4444', color: 'white', borderRadius: '50%',
                      width: 18, height: 18, fontSize: 11, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                    }}>
                      {items.length}
                    </span>
                  )}
                </Link>
                {token ? (
                  <>
                    <Link to="/profile" style={linkStyle}>👤 Profile</Link>
                    <button onClick={handleLogout}
                      style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white', padding: '6px 14px', borderRadius: 6, cursor: 'pointer' }}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" style={linkStyle}>Login</Link>
                    <Link to="/signup" style={{
                      background: 'white', color: '#4f46e5', padding: '6px 16px',
                      borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14,
                    }}>Sign Up</Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Hamburger — Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger"
            style={{
              display: 'none', background: 'none', border: 'none',
              color: 'white', fontSize: 24, cursor: 'pointer',
            }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: navBg, padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.2)',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {isAdmin ? (
            <>
              <Link to="/admin" style={linkStyle} onClick={() => setMenuOpen(false)}>🏠 Dashboard</Link>
              <Link to="/admin/products" style={linkStyle} onClick={() => setMenuOpen(false)}>📦 Products</Link>
              <Link to="/admin/orders" style={linkStyle} onClick={() => setMenuOpen(false)}>📋 Orders</Link>
              <Link to="/admin/users" style={linkStyle} onClick={() => setMenuOpen(false)}>👥 Users</Link>
              <button onClick={handleLogout}
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white', padding: '8px', borderRadius: 6, cursor: 'pointer', textAlign: 'left' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" style={linkStyle} onClick={() => setMenuOpen(false)}>🏠 Home</Link>
              <Link to="/cart" style={linkStyle} onClick={() => setMenuOpen(false)}>🛒 Cart ({items.length})</Link>
              {token ? (
                <>
                  <Link to="/profile" style={linkStyle} onClick={() => setMenuOpen(false)}>👤 Profile</Link>
                  <button onClick={handleLogout}
                    style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white', padding: '8px', borderRadius: 6, cursor: 'pointer', textAlign: 'left' }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={linkStyle} onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link to="/signup" style={linkStyle} onClick={() => setMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
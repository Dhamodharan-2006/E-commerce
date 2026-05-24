import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useDarkStyle } from '../app/useDarkStyle';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  const { darkMode, card, input, label, text, subText } = useDarkStyle();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      result.payload.isAdmin ? navigate('/admin') : navigate('/');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 16,
      background: darkMode ? '#0f172a' : '#f9fafb',
    }}>
      <div style={{ ...card, borderRadius: 12, padding: 32, width: '100%', maxWidth: 400 }}>
        <h2 style={{ marginBottom: 6, ...text }}>Welcome back 👋</h2>
        <p style={{ ...subText, marginBottom: 24, fontSize: 14 }}>Login to your account</p>

        {error && (
          <p style={{ color: '#dc2626', background: '#fef2f2', padding: 10, borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
            ❌ {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={label}>Email Address</label><br />
            <input name="email" type="email" onChange={handleChange} required
              placeholder="Enter your email"
              style={{ ...input, marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 6 }}>
            <label style={label}>Password</label><br />
            <input name="password" type="password" onChange={handleChange} required
              placeholder="Enter your password"
              style={{ ...input, marginTop: 4 }} />
          </div>
          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <Link to="/forgot-password" style={{ fontSize: 13, color: '#4f46e5', textDecoration: 'none' }}>
              Forgot Password?
            </Link>
          </div>
          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: 12, background: '#4f46e5', color: 'white',
              border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14, ...subText }}>
          No account?{' '}
          <Link to="/signup" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
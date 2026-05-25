import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error } = useSelector(s => s.auth);
  const [form, setForm]    = useState({ email: '', password: '' });
  const [show, setShow]    = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      result.payload.isAdmin ? navigate('/admin') : navigate('/');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: '#f9fafb' }}>
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: '32px 24px', width: '100%', maxWidth: 400 }}>
        <h2 style={{ marginBottom: 6, fontWeight: 800, fontSize: 24 }}>Welcome back 👋</h2>
        <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>Login to your account</p>

        {error && <p style={{ color: 'red', background: '#fef2f2', padding: 10, borderRadius: 6, marginBottom: 14, fontSize: 13 }}>❌ {error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 5 }}>Email</label>
            <input type="email" required placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none' }} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 5 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={show ? 'text' : 'password'} required placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ width: '100%',boxSizing: 'border-box',  padding: '10px 44px 10px 12px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none' }} />
              <button type="button" onClick={() => setShow(!show)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                {show ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <Link to="/forgot-password" style={{ fontSize: 13, color: '#4f46e5', textDecoration: 'none' }}>Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 13, background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          No account? <Link to="/signup" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
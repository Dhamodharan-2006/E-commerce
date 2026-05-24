import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useDarkStyle } from '../app/useDarkStyle';

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  const { darkMode, card, input, label, text, subText } = useDarkStyle();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [localError, setLocalError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLocalError('');
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      navigate('/verify-otp', { state: { email: form.email } });
    } else {
      setLocalError(result.payload?.error || 'Registration failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 16,
      background: darkMode ? '#0f172a' : '#f9fafb',
    }}>
      <div style={{ ...card, borderRadius: 12, padding: 32, width: '100%', maxWidth: 420 }}>
        <h2 style={{ marginBottom: 6, ...text }}>Create Account 🎉</h2>
        <p style={{ ...subText, marginBottom: 24, fontSize: 14 }}>Sign up to get started</p>

        {(localError || error) && (
          <p style={{ color: '#dc2626', background: '#fef2f2', padding: 10, borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
            ❌ {localError || error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={label}>Username</label><br />
            <input name="username" onChange={handleChange} required
              placeholder="Choose a username"
              style={{ ...input, marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={label}>Email Address</label><br />
            <input name="email" type="email" onChange={handleChange} required
              placeholder="Enter your email"
              style={{ ...input, marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={label}>Password</label><br />
            <input name="password" type="password" onChange={handleChange} required
              placeholder="Create a password"
              style={{ ...input, marginTop: 4 }} />
          </div>
          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: 12, background: '#4f46e5', color: 'white',
              border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14, ...subText }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
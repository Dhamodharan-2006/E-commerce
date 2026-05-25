import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error } = useSelector(s => s.auth);
  const [form, setForm]    = useState({ username: '', email: '', password: '' });
  const [show, setShow]    = useState(false);
  const [localError, setLocalError] = useState('');

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: '#f9fafb' }}>
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: '32px 24px', width: '100%', maxWidth: 420 }}>
        <h2 style={{ marginBottom: 6, fontWeight: 800, fontSize: 24 }}>Create Account 🎉</h2>
        <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>Sign up to get started</p>

        {(localError || error) && (
          <p style={{ color: 'red', background: '#fef2f2', padding: 10, borderRadius: 6, marginBottom: 14, fontSize: 13 }}>
            ❌ {localError || error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { name: 'username', label: 'Username',       type: 'text',     placeholder: 'Choose a username' },
            { name: 'email',    label: 'Email Address',  type: 'email',    placeholder: 'you@example.com' },
          ].map(f => (
            <div key={f.name} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 5 }}>{f.label}</label>
              <input name={f.name} type={f.type} placeholder={f.placeholder} required value={form[f.name]}
                onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none' }} />
            </div>
          ))}

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 5 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={show ? 'text' : 'password'} required placeholder="Min 6 characters" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ width: '100%',boxSizing: 'border-box',  padding: '10px 44px 10px 12px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none' }} />
              <button type="button" onClick={() => setShow(!show)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                {show ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 13, background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          Already have an account? <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
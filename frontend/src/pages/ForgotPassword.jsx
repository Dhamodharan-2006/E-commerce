import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post('http://localhost:8000/api/auth/forgot-password/', { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value) || value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`fotp-${index + 1}`).focus();
  };

  const handleVerifyOTP = async () => {
    setLoading(true); setError('');
    const otpValue = otp.join('');
    if (otpValue.length !== 6) { setError('Enter all 6 digits'); setLoading(false); return; }
    setStep(3);
    setLoading(false);
  };

  const handleResetPassword = async e => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post('http://localhost:8000/api/auth/reset-password/', {
        email, otp: otp.join(''), new_password: newPassword
      });
      setMessage(res.data.message);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24, border: '1px solid #e5e7eb', borderRadius: 12, textAlign: 'center' }}>

      {/* Step indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{
            width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: step >= s ? '#4f46e5' : '#e5e7eb',
            color: step >= s ? 'white' : '#9ca3af', fontSize: 13, fontWeight: 'bold'
          }}>{s}</div>
        ))}
      </div>

      {error && <p style={{ color: 'red', background: '#fef2f2', padding: 10, borderRadius: 6, marginBottom: 16 }}>❌ {error}</p>}
      {message && step !== 4 && <p style={{ color: 'green', background: '#f0fdf4', padding: 10, borderRadius: 6, marginBottom: 16 }}>✅ {message}</p>}

      {/* Step 1 - Enter Email */}
      {step === 1 && (
        <>
          <h2 style={{ marginBottom: 8 }}>Forgot Password</h2>
          <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 14 }}>Enter your email to receive an OTP</p>
          <form onSubmit={handleSendOTP}>
            <input type="email" placeholder="Enter your email" value={email}
              onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6, marginBottom: 16 }} />
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: 12, background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        </>
      )}

      {/* Step 2 - Enter OTP */}
      {step === 2 && (
        <>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📧</div>
          <h2 style={{ marginBottom: 8 }}>Enter OTP</h2>
          <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 14 }}>OTP sent to <strong>{email}</strong></p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
            {otp.map((digit, i) => (
              <input key={i} id={`fotp-${i}`} type="text" maxLength={1} value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => { if (e.key === 'Backspace' && !otp[i] && i > 0) document.getElementById(`fotp-${i - 1}`).focus(); }}
                style={{
                  width: 42, height: 52, textAlign: 'center', fontSize: 20, fontWeight: 'bold',
                  border: digit ? '2px solid #4f46e5' : '2px solid #d1d5db', borderRadius: 8
                }} />
            ))}
          </div>
          <button onClick={handleVerifyOTP} disabled={loading}
            style={{ width: '100%', padding: 12, background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </>
      )}

      {/* Step 3 - New Password */}
      {step === 3 && (
        <>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔒</div>
          <h2 style={{ marginBottom: 8 }}>New Password</h2>
          <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 14 }}>Enter your new password</p>
          <form onSubmit={handleResetPassword}>
            <input type="password" placeholder="New password" value={newPassword}
              onChange={e => setNewPassword(e.target.value)} required
              style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6, marginBottom: 12 }} />
            <input type="password" placeholder="Confirm new password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)} required
              style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6, marginBottom: 16 }} />
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: 12, background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </>
      )}

      {/* Step 4 - Success */}
      {step === 4 && (
        <>
          <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
          <h2 style={{ color: '#16a34a', marginBottom: 8 }}>Password Reset!</h2>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>Your password has been reset successfully.</p>
          <button onClick={() => navigate('/login')}
            style={{ padding: '12px 32px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Go to Login
          </button>
        </>
      )}

      {step === 1 && (
        <p style={{ marginTop: 16, fontSize: 13 }}>
          Remember password? <a href="/login" style={{ color: '#4f46e5' }}>Login</a>
        </p>
      )}
    </div>
  );
}

export default ForgotPassword;
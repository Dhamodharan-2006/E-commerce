import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('https://ecommerce-backend-hanm.onrender.com/api/auth/verify-otp/', {
        email,
        otp: otpValue
      });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    try {
      const res = await axios.post('https://ecommerce-backend-hanm.onrender.com/api/auth/resend-otp/', { email });
      setMessage(res.data.message);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    }
    setResendLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24, border: '1px solid #e5e7eb', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 50, marginBottom: 12 }}>📧</div>
      <h2 style={{ marginBottom: 8 }}>Verify Your Email</h2>
      <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>
        We sent a 6-digit OTP to<br />
        <strong style={{ color: '#4f46e5' }}>{email}</strong>
      </p>

      {message && (
        <p style={{ color: 'green', background: '#f0fdf4', padding: 10, borderRadius: 6, marginBottom: 16 }}>
          ✅ {message}
        </p>
      )}
      {error && (
        <p style={{ color: 'red', background: '#fef2f2', padding: 10, borderRadius: 6, marginBottom: 16 }}>
          ❌ {error}
        </p>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            style={{
              width: 45, height: 55, textAlign: 'center', fontSize: 22, fontWeight: 'bold',
              border: digit ? '2px solid #4f46e5' : '2px solid #d1d5db',
              borderRadius: 8, outline: 'none', background: digit ? '#eff6ff' : 'white'
            }}
          />
        ))}
      </div>

      <button onClick={handleVerify} disabled={loading}
        style={{ width: '100%', padding: 12, background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, fontSize: 15, cursor: 'pointer', marginBottom: 12 }}>
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>

      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 8 }}>Didn't get the OTP?</p>

      <button onClick={handleResend} disabled={resendLoading}
        style={{ background: 'transparent', border: '1px solid #4f46e5', color: '#4f46e5', padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>
        {resendLoading ? 'Sending...' : 'Resend OTP'}
      </button>

      <p style={{ marginTop: 16, fontSize: 12, color: '#9ca3af' }}>OTP expires in 10 minutes</p>
    </div>
  );
}

export default VerifyOTP;
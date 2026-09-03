import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiArrowLeft, FiUser, FiKey, FiLock, FiCheck } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = username, 2 = otp, 3 = new password, 4 = success
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(''); // shown on screen since there's no real SMS/email service
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // STEP 1: Enter username -> get OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password/send-otp', { username });
      setGeneratedOtp(res.data.otp); // backend returns the OTP directly since this is a simulated demo
      setMessage('');
      setStep(2);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Could not send OTP. Check the username.'));
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Enter OTP -> verify
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password/verify-otp', { username, otp });
      setMessage('');
      setStep(3);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Invalid OTP'));
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Enter new password -> reset
  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('❌ Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('❌ Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/forgot-password/reset', { username, newPassword });
      setStep(4);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Reset failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center relative"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(20,55,30,0.82), rgba(40,90,45,0.65)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md mx-auto px-6 py-10">
        <div className="text-center mb-6">
          <GiWheat className="text-3xl text-yellow-300 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
        </div>

        <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1 text-pista-100 text-sm mb-4 hover:text-white"
          >
            <FiArrowLeft /> Back to Login
          </button>

          {/* STEP 1: Username */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-3">
              <p className="text-pista-100 text-sm mb-3">
                Enter your username to receive a One-Time Password (OTP).
              </p>

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/70 placeholder-gray-600 text-gray-800 outline-none focus:ring-2 focus:ring-pista-500"
              />

              {message && (
                <p className="text-red-100 bg-red-900/40 text-sm px-3 py-2 rounded-lg">{message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pista-600 to-pista-500 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiUser /> {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="bg-yellow-900/30 border border-yellow-400/40 rounded-lg px-3 py-2 mb-2">
                <p className="text-yellow-100 text-xs mb-1">
                  Demo mode: no real SMS/email is sent. Your OTP is shown below.
                </p>
                <p className="text-white font-bold text-lg tracking-widest text-center">
                  {generatedOtp}
                </p>
              </div>

              <p className="text-pista-100 text-sm mb-2">Enter the 6-digit OTP to continue.</p>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl bg-white/70 placeholder-gray-600 text-gray-800 outline-none focus:ring-2 focus:ring-pista-500 text-center tracking-widest"
              />

              {message && (
                <p className="text-red-100 bg-red-900/40 text-sm px-3 py-2 rounded-lg">{message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pista-600 to-pista-500 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiKey /> {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-pista-100 text-sm hover:text-white"
              >
                ← Change username
              </button>
            </form>
          )}

          {/* STEP 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleReset} className="space-y-3">
              <p className="text-pista-100 text-sm mb-3">
                OTP verified! Now set your new password.
              </p>

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/70 placeholder-gray-600 text-gray-800 outline-none focus:ring-2 focus:ring-pista-500"
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/70 placeholder-gray-600 text-gray-800 outline-none focus:ring-2 focus:ring-pista-500"
              />

              {message && (
                <p className="text-red-100 bg-red-900/40 text-sm px-3 py-2 rounded-lg">{message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pista-600 to-pista-500 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiLock /> {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div className="text-center py-4">
              <FiCheck className="text-4xl text-green-400 mx-auto mb-3" />
              <p className="text-white font-semibold mb-4">Password reset successfully!</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pista-600 to-pista-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
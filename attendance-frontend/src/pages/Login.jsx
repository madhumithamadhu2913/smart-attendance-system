import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiArrowLeft, FiBell, FiUsers, FiBookOpen, FiUser } from 'react-icons/fi';
import { GiWheat, GiPlantWatering, GiNotebook } from 'react-icons/gi';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const portals = [
  {
    key: 'management',
    title: 'Management',
    desc: 'Principal / HOD',
    icon: <FiUsers />,
    roles: ['Principal', 'HOD'],
  },
  {
    key: 'staff',
    title: 'Staff',
    desc: 'Class Advisor / Authorized Staff',
    icon: <FiBookOpen />,
    roles: ['Staff', 'Advisor'],
  },
  {
    key: 'student',
    title: 'Student',
    desc: 'Student Portal',
    icon: <FiUser />,
    roles: ['Student'],
  },
];

const roleRoutes = {
  Principal: '/principal',
  HOD: '/hod',
  Staff: '/staff',
  Advisor: '/staff',
  Student: '/student',
};

function Login() {
  const [step, setStep] = useState('select');
  const [portal, setPortal] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(new Date());

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openPortal = (p) => {
    setPortal(p);
    setSelectedRole(p.roles[0]);
    setStep('form');
    setError('');
    setUsername('');
    setPassword('');
  };

  const backToSelect = () => {
    setStep('select');
    setPortal(null);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter your username and password');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password });

      if (portal.roles.length > 1 && !portal.roles.includes(res.data.user.role)) {
        setError(`This account is not authorized for the ${portal.title} portal.`);
        setLoading(false);
        return;
      }
      if (portal.key === 'student' && res.data.user.role !== 'Student') {
        setError('Please use the Student portal login for this account.');
        setLoading(false);
        return;
      }

      login(res.data.user, res.data.token);
      navigate(roleRoutes[res.data.user.role] || '/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
      <div className="w-full max-w-5xl mx-auto px-6 py-10 animate-fadeIn">

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GiWheat className="text-3xl text-yellow-300" />
            <span className="text-xs text-pista-100 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Attendance System Online
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Smart Attendance</h1>
          <p className="text-pista-100 mb-1">Agricultural College Portal</p>
          <p className="text-sm text-pista-200 italic">"Smart Attendance for a Smarter Agricultural Campus"</p>
          <p className="text-xs text-pista-200 mt-2">
            {now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} | {now.toLocaleTimeString()}
          </p>
        </div>

        {step === 'select' && (
          <div className="grid md:grid-cols-3 gap-6">
            {portals.map((p) => (
              <button
                key={p.key}
                onClick={() => openPortal(p)}
                className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-8 text-center text-white shadow-xl hover:bg-white/25 hover:-translate-y-1 transition-all"
              >
                <div className="text-4xl text-yellow-300 mb-4 flex justify-center">{p.icon}</div>
                <h2 className="text-xl font-bold mb-1">{p.title}</h2>
                <p className="text-pista-100 text-sm">{p.desc}</p>
              </button>
            ))}
          </div>
        )}

        {step === 'select' && (
          <div className="flex justify-center mt-8">
            <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-4 text-center">
              <QRCodeSVG value="http://192.168.1.9:5173" size={120} />
              <p className="text-pista-100 text-xs mt-2">Scan to open on mobile</p>
            </div>
          </div>
        )}

        {step === 'form' && portal && (
          <div className="max-w-md mx-auto bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
            <button
              onClick={backToSelect}
              className="flex items-center gap-1 text-pista-100 text-sm mb-4 hover:text-white"
            >
              <FiArrowLeft /> Back
            </button>

            <h2 className="text-2xl font-bold text-white text-center mb-1">{portal.title} Portal</h2>
            <p className="text-pista-100 text-center text-sm mb-5">{portal.desc}</p>

            {portal.roles.length > 1 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {portal.roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`py-2 rounded-xl font-medium transition-all ${
                      selectedRole === role
                        ? 'bg-pista-600 text-white shadow-lg scale-105'
                        : 'bg-white/30 text-white hover:bg-white/40'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="text"
                placeholder={portal.key === 'student' ? 'Register Number / Student ID' : 'Username'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/70 placeholder-gray-600 text-gray-800 outline-none focus:ring-2 focus:ring-pista-500"
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/70 placeholder-gray-600 text-gray-800 outline-none focus:ring-2 focus:ring-pista-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-1 text-pista-100">
                  <input type="checkbox" className="accent-pista-600" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-pista-100 hover:text-white">
                  Forgot Password?
                </Link>
              </div>

              {error && (
                <p className="text-red-100 bg-red-900/40 text-sm px-3 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pista-600 to-pista-500 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="text-center text-xs text-pista-100 flex items-center justify-center gap-1">
                <FiLock size={12} /> Secure Login
              </p>
            </form>
          </div>
        )}

        {step === 'select' && (
          <div className="flex justify-center gap-8 mt-10 text-pista-100 text-sm">
            <Feature icon={<GiPlantWatering />} text="Smart Attendance" />
            <Feature icon={<GiNotebook />} text="Timetable Integration" />
            <Feature icon={<FiBell />} text="Parent Notifications" />
          </div>
        )}
      </div>
    </div>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg text-pista-200">{icon}</span>
      {text}
    </div>
  );
}

export default Login;
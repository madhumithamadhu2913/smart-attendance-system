import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FiUsers, FiTrendingUp, FiSun, FiUserX } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PrincipalDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/dashboard/summary')
      .then((res) => setSummary(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  // Sample chart data (based on your real summary where possible)
  const monthlyTrend = [
    { month: 'May', attendance: summary ? Number(summary.average_attendance) : 0 },
  ];

  const yearWise = [
    { year: '2023', attendance: 90 },
    { year: '2024', attendance: 92 },
    { year: '2025', attendance: 94 },
    { year: '2026', attendance: summary ? Number(summary.average_attendance) : 0 },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Principal Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-700">{user?.username}</span>
            <div className="w-9 h-9 rounded-full bg-pista-600 text-white flex items-center justify-center font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {summary && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                icon={<FiUsers />}
                label="TOTAL STUDENTS"
                value={summary.total_students}
                bg="bg-blue-100"
                iconBg="bg-blue-500"
              />
              <StatCard
                icon={<FiTrendingUp />}
                label="AVG ATTENDANCE"
                value={`${summary.average_attendance}%`}
                bg="bg-green-100"
                iconBg="bg-green-500"
              />
              <StatCard
                icon={<FiSun />}
                label="PRESENT TODAY"
                value={summary.present_today}
                bg="bg-yellow-100"
                iconBg="bg-yellow-500"
              />
              <StatCard
                icon={<FiUserX />}
                label="ABSENT TODAY"
                value={summary.absent_today}
                bg="bg-red-100"
                iconBg="bg-red-500"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-5 shadow">
                <h3 className="font-bold text-gray-800 mb-4">Monthly Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="attendance" stroke="#448a3a" strokeWidth={2} name="Attendance %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow">
                <h3 className="font-bold text-gray-800 mb-4">Year-wise</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={yearWise}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendance" fill="#7cbf6f" name="Year-wise %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Below 80% info */}
            <div className="bg-white rounded-2xl p-5 shadow">
              <p className="text-gray-600">
                Students below 80% attendance: <span className="font-bold text-red-600">{summary.below_80}</span>
              </p>
            </div>
          </>
        )}

        {!summary && <p className="text-gray-500">Loading dashboard...</p>}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg, iconBg }) {
  return (
    <div className={`${bg} rounded-2xl p-5 flex items-center gap-4`}>
      <div className={`${iconBg} text-white p-3 rounded-xl text-xl`}>{icon}</div>
      <div>
        <p className="text-gray-600 text-xs font-semibold">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default PrincipalDashboard;
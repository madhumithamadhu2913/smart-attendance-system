import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FiUsers, FiTrendingUp, FiSun, FiUserX } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function HODDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get('/dashboard/summary')
      .then((res) => setSummary(res.data.data))
      .catch((err) => console.error(err));

    api.get('/students')
      .then((res) => setStudents(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  // Group students by department for the chart
  const deptCounts = students.reduce((acc, s) => {
    acc[s.department_name] = (acc[s.department_name] || 0) + 1;
    return acc;
  }, {});
  const deptChartData = Object.entries(deptCounts).map(([name, count]) => ({ name, count }));

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">HOD Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-700">{user?.username}</span>
            <div className="w-9 h-9 rounded-full bg-pista-600 text-white flex items-center justify-center font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {summary && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard icon={<FiUsers />} label="TOTAL STUDENTS" value={summary.total_students} bg="bg-blue-100" iconBg="bg-blue-500" />
              <StatCard icon={<FiTrendingUp />} label="AVG ATTENDANCE" value={`${summary.average_attendance}%`} bg="bg-green-100" iconBg="bg-green-500" />
              <StatCard icon={<FiSun />} label="PRESENT TODAY" value={summary.present_today} bg="bg-yellow-100" iconBg="bg-yellow-500" />
              <StatCard icon={<FiUserX />} label="ABSENT TODAY" value={summary.absent_today} bg="bg-red-100" iconBg="bg-red-500" />
            </div>

            <div className="bg-white rounded-2xl p-5 shadow mb-6">
              <h3 className="font-bold text-gray-800 mb-4">Students by Department</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={deptChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#5aa84c" name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>

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

export default HODDashboard;
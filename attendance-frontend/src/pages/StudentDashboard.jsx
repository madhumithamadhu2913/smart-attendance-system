import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

function StudentDashboard() {
  const { user } = useAuth();
  const [percentages, setPercentages] = useState([]);

  useEffect(() => {
    const studentId = user?.reference_id;
    if (studentId) {
      api.get(`/attendance/percentage/${studentId}`)
        .then((res) => setPercentages(res.data.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Attendance</h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-700">{user?.username}</span>
            <div className="w-9 h-9 rounded-full bg-pista-600 text-white flex items-center justify-center font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {percentages.length === 0 && (
          <div className="bg-white rounded-2xl p-6 shadow text-gray-500">
            No attendance records yet.
          </div>
        )}

        <div className="grid gap-4">
          {percentages.map((p) => (
            <div key={p.subject_id} className="bg-white rounded-2xl p-5 shadow">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-800">{p.subject_name}</span>
                <span className={`flex items-center gap-1 font-bold ${p.status === 'Eligible' ? 'text-green-600' : 'text-red-600'}`}>
                  {p.status === 'Eligible' ? <FiCheckCircle /> : <FiAlertTriangle />}
                  {p.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${p.percentage >= 80 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(p.percentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {p.attended_classes} / {p.total_classes} classes attended
              </p>
              {p.status === 'Shortage' && (
                <p className="text-red-600 text-sm mt-2">⚠ Below the required 80% attendance.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
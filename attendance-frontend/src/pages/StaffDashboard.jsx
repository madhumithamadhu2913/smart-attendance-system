import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FiClock, FiMapPin, FiBookOpen } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function StaffDashboard() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    api.get(`/timetable/faculty/${user?.reference_id}`)
      .then((res) => setTimetable(res.data.data))
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Staff Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-700">{user?.username}</span>
            <div className="w-9 h-9 rounded-full bg-pista-600 text-white flex items-center justify-center font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow mb-6">
          <h3 className="font-bold text-gray-800 mb-4">My Weekly Timetable</h3>
          {timetable.length === 0 && <p className="text-gray-500">No classes assigned yet.</p>}
          <div className="grid gap-3">
            {timetable.map((t) => (
              <div key={t.timetable_id} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center hover:bg-pista-50">
                <div>
                  <p className="font-semibold text-gray-800">{t.subject_name} ({t.subject_code})</p>
                  <p className="text-sm text-gray-500">{t.day_of_week} - Period {t.period_number} | Batch {t.batch_year} {t.section}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><FiClock /> {t.start_time?.slice(0,5)}</span>
                  <span className="flex items-center gap-1"><FiMapPin /> {t.room_number}</span>
                  <Link
                    to="/attendance"
                    state={{ timetable_id: t.timetable_id, subject_name: t.subject_name, batch_id: t.batch_id }}
                    className="bg-pista-600 text-white px-4 py-2 rounded-lg hover:bg-pista-700 flex items-center gap-1"
                  >
                    <FiBookOpen /> Mark Attendance
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
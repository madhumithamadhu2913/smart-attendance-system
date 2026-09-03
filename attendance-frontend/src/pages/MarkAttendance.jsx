import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FiCheck, FiX, FiSave } from 'react-icons/fi';

function MarkAttendance() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { timetable_id, subject_name, batch_id } = location.state || {};

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!timetable_id) return;
    api.get('/students')
      .then((res) => {
        const filtered = batch_id ? res.data.data.filter((s) => s.batch_id === batch_id) : res.data.data;
        setStudents(filtered);
        const initial = {};
        filtered.forEach((s) => (initial[s.student_id] = 'Present'));
        setAttendance(initial);
      })
      .catch((err) => console.error(err));
  }, [timetable_id, batch_id]);

  const toggleStatus = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present',
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setMessage('');
    try {
      const records = Object.entries(attendance).map(([student_id, status]) => ({
        student_id: Number(student_id),
        status,
      }));

      await api.post('/attendance', {
        timetable_id,
        attendance_date: date,
        marked_by: user?.reference_id,
        records,
      });

      setMessage('✅ Attendance marked successfully!');
      setTimeout(() => navigate('/staff'), 1500);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Failed to mark attendance'));
    } finally {
      setSaving(false);
    }
  };

  if (!timetable_id) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 p-8">
          <p className="text-gray-600">Please select a class from your dashboard to mark attendance.</p>
        </div>
      </div>
    );
  }

  const presentCount = Object.values(attendance).filter((s) => s === 'Present').length;
  const absentCount = Object.values(attendance).filter((s) => s === 'Absent').length;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Mark Attendance</h1>
        <p className="text-gray-500 mb-6">{subject_name} — {date}</p>

        <div className="flex gap-4 mb-6">
          <div className="bg-green-100 rounded-xl px-4 py-2 text-green-700 font-semibold">
            Present: {presentCount}
          </div>
          <div className="bg-red-100 rounded-xl px-4 py-2 text-red-700 font-semibold">
            Absent: {absentCount}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow divide-y">
          {students.map((s) => (
            <div key={s.student_id} className="flex justify-between items-center p-4">
              <div>
                <p className="font-semibold text-gray-800">{s.student_name}</p>
                <p className="text-sm text-gray-500">{s.roll_number}</p>
              </div>
              <button
                onClick={() => toggleStatus(s.student_id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                  attendance[s.student_id] === 'Present'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {attendance[s.student_id] === 'Present' ? <FiCheck /> : <FiX />}
                {attendance[s.student_id]}
              </button>
            </div>
          ))}
        </div>

        {message && <p className="mt-4 font-semibold">{message}</p>}

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="mt-6 flex items-center gap-2 bg-pista-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pista-700 disabled:opacity-50"
        >
          <FiSave /> {saving ? 'Saving...' : 'Submit Attendance'}
        </button>
      </div>
    </div>
  );
}

export default MarkAttendance;
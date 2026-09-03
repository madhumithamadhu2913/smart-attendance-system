import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { FiArrowLeft, FiUser, FiPhone, FiMail, FiBookOpen, FiEdit2, FiSave, FiX, FiUserX } from 'react-icons/fi';

function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [percentages, setPercentages] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canEdit = user?.role === 'Principal' || user?.role === 'HOD';

  const loadStudent = () => {
    api.get(`/students/${id}`)
      .then((res) => {
        setStudent(res.data.data);
        setForm(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadStudent();
    api.get(`/attendance/percentage/${id}`)
      .then((res) => setPercentages(res.data.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await api.put(`/students/${id}`, {
        student_name: form.student_name,
        year: form.year,
        section: form.section,
        parent_phone: form.parent_phone,
        parent_email: form.parent_email,
      });
      setMessage('✅ Updated successfully!');
      setEditing(false);
      loadStudent();
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Failed to update'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      await api.put(`/students/${id}/deactivate`);
      setMessage('✅ Student marked as inactive. Their history is preserved.');
      setShowConfirm(false);
      setTimeout(() => navigate('/students'), 1500);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Failed to deactivate'));
    }
  };

  if (!student) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 p-8">
          <p className="text-gray-500">Loading student details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-600 mb-4 hover:text-pista-700"
        >
          <FiArrowLeft /> Back to Students
        </button>

        <div className="bg-white rounded-2xl p-6 shadow mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-pista-600 text-white flex items-center justify-center text-2xl font-bold">
                {student.student_name?.[0]?.toUpperCase()}
              </div>
              <div>
                {editing ? (
                  <input
                    type="text"
                    name="student_name"
                    value={form.student_name}
                    onChange={handleChange}
                    className="text-2xl font-bold text-gray-800 border rounded-lg px-2 py-1"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-800">{student.student_name}</h1>
                )}
                <p className="text-gray-500">{student.roll_number}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {canEdit && !editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-pista-600 text-white px-4 py-2 rounded-lg hover:bg-pista-700"
                >
                  <FiEdit2 /> Edit
                </button>
              )}

              {canEdit && !editing && (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
                >
                  <FiUserX /> Remove
                </button>
              )}

              {editing && (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <FiSave /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setForm(student); }}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    <FiX /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {message && <p className="mb-3 font-semibold">{message}</p>}

          {showConfirm && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-800 font-semibold mb-2">
                Are you sure you want to remove {student.student_name}?
              </p>
              <p className="text-red-600 text-sm mb-3">
                They will no longer appear in active student lists, but their attendance history will be kept safely.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeactivate}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Yes, Remove
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-500 flex items-center gap-1"><FiUser /> Year & Section</p>
              {editing ? (
                <div className="flex gap-2 mt-1">
                  <input type="number" name="year" value={form.year} onChange={handleChange} className="w-16 border rounded px-2 py-1" />
                  <input type="text" name="section" value={form.section} onChange={handleChange} className="w-16 border rounded px-2 py-1" />
                </div>
              ) : (
                <p className="font-medium text-gray-800">{student.year} - {student.section}</p>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500 flex items-center gap-1"><FiPhone /> Parent Phone</p>
              {editing ? (
                <input type="text" name="parent_phone" value={form.parent_phone || ''} onChange={handleChange} className="border rounded px-2 py-1 mt-1 w-full" />
              ) : (
                <p className="font-medium text-gray-800">{student.parent_phone || 'N/A'}</p>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500 flex items-center gap-1"><FiMail /> Parent Email</p>
              {editing ? (
                <input type="email" name="parent_email" value={form.parent_email || ''} onChange={handleChange} className="border rounded px-2 py-1 mt-1 w-full" />
              ) : (
                <p className="font-medium text-gray-800">{student.parent_email || 'N/A'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiBookOpen /> Attendance by Subject
          </h3>
          {percentages.length === 0 && <p className="text-gray-500 text-sm">No attendance records yet.</p>}
          <div className="space-y-3">
            {percentages.map((p) => (
              <div key={p.subject_id}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-700">{p.subject_name}</span>
                  <span className={`font-bold ${p.status === 'Eligible' ? 'text-green-600' : 'text-red-600'}`}>
                    {p.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${p.percentage >= 80 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(p.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetail;
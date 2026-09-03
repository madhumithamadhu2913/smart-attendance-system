import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FiUserPlus } from 'react-icons/fi';

function AddStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    department_id: '',
    batch_id: '',
    roll_number: '',
    student_name: '',
    year: '',
    section: '',
    parent_phone: '',
    parent_email: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await api.post('/students', form);
      setMessage('✅ Student added successfully!');
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Failed to add student'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Student</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow max-w-2xl space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Department ID</label>
              <input type="number" name="department_id" value={form.department_id} onChange={handleChange} required
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Batch ID</label>
              <input type="number" name="batch_id" value={form.batch_id} onChange={handleChange} required
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Roll Number</label>
            <input type="text" name="roll_number" value={form.roll_number} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Student Name</label>
            <input type="text" name="student_name" value={form.student_name} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Year</label>
              <input type="number" name="year" value={form.year} onChange={handleChange} required
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Section</label>
              <input type="text" name="section" value={form.section} onChange={handleChange} required
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Parent Phone</label>
            <input type="text" name="parent_phone" value={form.parent_phone} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Parent Email</label>
            <input type="email" name="parent_email" value={form.parent_email} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>

          {message && <p className="font-semibold">{message}</p>}

          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-pista-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pista-700 disabled:opacity-50">
            <FiUserPlus /> {loading ? 'Adding...' : 'Add Student'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;

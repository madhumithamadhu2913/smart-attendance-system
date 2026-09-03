import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FiUserPlus } from 'react-icons/fi';

function AddFaculty() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    department_id: '',
    faculty_name: '',
    designation: '',
    email: '',
    phone: '',
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
      await api.post('/faculty', form);
      setMessage('✅ Faculty added successfully!');
      setTimeout(() => navigate('/faculty'), 1500);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Failed to add faculty'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Faculty</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow max-w-2xl space-y-4">
          <div>
            <label className="text-sm text-gray-600">Department ID</label>
            <input type="number" name="department_id" value={form.department_id} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Faculty Name</label>
            <input type="text" name="faculty_name" value={form.faculty_name} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Designation</label>
            <input type="text" name="designation" value={form.designation} onChange={handleChange}
              placeholder="e.g. Assistant Professor"
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>

          {message && <p className="font-semibold">{message}</p>}

          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-pista-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pista-700 disabled:opacity-50">
            <FiUserPlus /> {loading ? 'Adding...' : 'Add Faculty'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddFaculty;
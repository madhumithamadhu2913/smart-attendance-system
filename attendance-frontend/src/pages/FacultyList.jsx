import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { FiSearch, FiUserPlus } from 'react-icons/fi';

function FacultyList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState('');

  const canAdd = user?.role === 'Principal' || user?.role === 'HOD';

  useEffect(() => {
    api.get('/faculty')
      .then((res) => setFaculty(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const filtered = faculty.filter((f) =>
    f.faculty_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Faculty</h1>
          <div className="flex gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
            </div>
            {canAdd && (
              <button
                onClick={() => navigate('/add-faculty')}
                className="flex items-center gap-2 bg-pista-600 text-white px-4 py-2 rounded-lg hover:bg-pista-700"
              >
                <FiUserPlus /> Add Faculty
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.faculty_id} className="border-t hover:bg-pista-50">
                  <td className="px-4 py-3 font-semibold text-pista-700">{f.faculty_name}</td>
                  <td className="px-4 py-3 text-gray-600">{f.designation}</td>
                  <td className="px-4 py-3 text-gray-600">{f.department_name}</td>
                  <td className="px-4 py-3 text-gray-600">{f.email}</td>
                  <td className="px-4 py-3 text-gray-600">{f.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="p-6 text-gray-500 text-center">No faculty found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacultyList;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FiSearch } from 'react-icons/fi';

function StudentsList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/students')
      .then((res) => setStudents(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const filtered = students.filter((s) =>
    s.student_name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Students</h1>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-72"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3">Roll Number</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Batch</th>
                <th className="px-4 py-3">Section</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.student_id}
                  onClick={() => navigate(`/students/${s.student_id}`)}
                  className="border-t hover:bg-pista-50 cursor-pointer"
                >
                  <td className="px-4 py-3 text-gray-700">{s.roll_number}</td>
                  <td className="px-4 py-3 font-semibold text-pista-700">{s.student_name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.department_name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.batch_year}</td>
                  <td className="px-4 py-3 text-gray-600">{s.batch_section}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="p-6 text-gray-500 text-center">No students found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentsList;
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FiCheck, FiX } from 'react-icons/fi';

function LeaveApproval() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  const loadRequests = () => {
    api.get('/leave')
      .then((res) => setRequests(res.data.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (leaveId, status) => {
    setMessage('');
    try {
      await api.put(`/leave/${leaveId}`, {
        status,
        approved_by: user?.reference_id,
      });
      setMessage(`✅ Leave ${status.toLowerCase()}`);
      loadRequests();
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Failed to update'));
    }
  };

  const statusColor = (status) => {
    if (status === 'Approved') return 'bg-green-100 text-green-700';
    if (status === 'Rejected') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const pending = requests.filter((r) => r.status === 'Pending');
  const reviewed = requests.filter((r) => r.status !== 'Pending');

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Leave Approvals</h1>

        {message && <p className="mb-4 font-semibold">{message}</p>}

        <div className="bg-white rounded-2xl p-6 shadow mb-6">
          <h3 className="font-bold text-gray-800 mb-4">Pending Requests ({pending.length})</h3>
          {pending.length === 0 && <p className="text-gray-500 text-sm">No pending requests.</p>}
          <div className="space-y-3">
            {pending.map((r) => (
              <div key={r.leave_id} className="border rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{r.student_name} ({r.roll_number})</p>
                  <p className="text-sm text-gray-500">{r.leave_type} — {r.from_date} to {r.to_date}</p>
                  <p className="text-sm text-gray-600 mt-1">{r.reason}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(r.leave_id, 'Approved')}
                    className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
                  >
                    <FiCheck /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(r.leave_id, 'Rejected')}
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                  >
                    <FiX /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="font-bold text-gray-800 mb-4">Reviewed Requests</h3>
          {reviewed.length === 0 && <p className="text-gray-500 text-sm">No reviewed requests yet.</p>}
          <div className="space-y-3">
            {reviewed.map((r) => (
              <div key={r.leave_id} className="border rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{r.student_name} ({r.roll_number})</p>
                  <p className="text-sm text-gray-500">{r.leave_type} — {r.from_date} to {r.to_date}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor(r.status)}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveApproval;
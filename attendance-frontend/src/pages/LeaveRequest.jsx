import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FiSend } from 'react-icons/fi';

function LeaveRequest() {
  const { user } = useAuth();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [leaveType, setLeaveType] = useState('Personal');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = () => {
    if (user?.reference_id) {
      api.get(`/leave/student/${user.reference_id}`)
        .then((res) => setHistory(res.data.data))
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await api.post('/leave', {
        student_id: user?.reference_id,
        from_date: fromDate,
        to_date: toDate,
        leave_type: leaveType,
        reason,
      });
      setMessage('✅ Leave request submitted!');
      setFromDate('');
      setToDate('');
      setReason('');
      loadHistory();
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Failed to submit'));
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === 'Approved') return 'bg-green-100 text-green-700';
    if (status === 'Rejected') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Leave Request</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow space-y-4">
            <h3 className="font-bold text-gray-800">Apply for Leave</h3>

            <div>
              <label className="text-sm text-gray-600">From Date</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>

            <div>
              <label className="text-sm text-gray-600">To Date</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>

            <div>
              <label className="text-sm text-gray-600">Leave Type</label>
              <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1">
                <option>Personal</option>
                <option>Medical</option>
                <option>Family</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Reason</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} required rows={3}
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>

            {message && <p className="text-sm font-semibold">{message}</p>}

            <button type="submit" disabled={loading}
              className="flex items-center gap-2 bg-pista-600 text-white px-5 py-2 rounded-lg hover:bg-pista-700 disabled:opacity-50">
              <FiSend /> {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>

          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="font-bold text-gray-800 mb-4">Leave History</h3>
            {history.length === 0 && <p className="text-gray-500 text-sm">No leave requests yet.</p>}
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.leave_id} className="border rounded-xl p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-800">{h.leave_type}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor(h.status)}`}>
                      {h.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{h.from_date} to {h.to_date}</p>
                  <p className="text-sm text-gray-600 mt-1">{h.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveRequest;
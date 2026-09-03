import { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FiBell, FiAlertCircle } from 'react-icons/fi';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/notifications')
      .then((res) => setNotifications(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FiBell /> Parent Notifications
        </h1>

        {notifications.length === 0 && (
          <div className="bg-white rounded-2xl p-6 shadow text-gray-500">
            No notifications yet.
          </div>
        )}

        <div className="grid gap-3">
          {notifications.map((n) => (
            <div key={n.notification_id} className="bg-white rounded-2xl p-5 shadow flex items-start gap-4">
              <div className="bg-red-100 text-red-600 p-3 rounded-xl">
                <FiAlertCircle />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-gray-800">
                    {n.student_name} ({n.roll_number})
                  </p>
                  <span className="text-xs text-gray-400">
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
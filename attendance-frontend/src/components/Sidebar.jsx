import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiCalendar, FiFileText, FiBell, FiLogOut, FiBookOpen, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const menuByRole = {
  Principal: [
    { to: '/principal', label: 'Dashboard', icon: <FiHome /> },
    { to: '/students', label: 'Students', icon: <FiUsers /> },
    { to: '/add-student', label: 'Add Student', icon: <FiUsers /> },
    { to: '/faculty', label: 'Faculty', icon: <FiUsers /> },
    { to: '/timetable', label: 'Timetable', icon: <FiCalendar /> },
    { to: '/leave-approval', label: 'Leave Approvals', icon: <FiFileText /> },
    { to: '/notifications', label: 'Notifications', icon: <FiBell /> },
    { to: '/change-password', label: 'Change Password', icon: <FiLock /> },
  ],
  HOD: [
    { to: '/hod', label: 'Dashboard', icon: <FiHome /> },
    { to: '/students', label: 'Students', icon: <FiUsers /> },
    { to: '/add-student', label: 'Add Student', icon: <FiUsers /> },
    { to: '/faculty', label: 'Faculty', icon: <FiUsers /> },
    { to: '/timetable', label: 'Timetable', icon: <FiCalendar /> },
    { to: '/leave-approval', label: 'Leave Approvals', icon: <FiFileText /> },
    { to: '/notifications', label: 'Notifications', icon: <FiBell /> },
    { to: '/change-password', label: 'Change Password', icon: <FiLock /> },
  ],
  Staff: [
    { to: '/staff', label: 'Dashboard', icon: <FiHome /> },
    { to: '/students', label: 'Students', icon: <FiUsers /> },
    { to: '/faculty', label: 'Faculty', icon: <FiUsers /> },
    { to: '/timetable', label: 'Timetable', icon: <FiCalendar /> },
    { to: '/attendance', label: 'Mark Attendance', icon: <FiCalendar /> },
    { to: '/change-password', label: 'Change Password', icon: <FiLock /> },
  ],
  Student: [
    { to: '/student', label: 'Dashboard', icon: <FiHome /> },
    { to: '/leave', label: 'Leave Request', icon: <FiFileText /> },
    { to: '/change-password', label: 'Change Password', icon: <FiLock /> },
  ],
};

function Sidebar() {
  const { user, logout } = useAuth();
  const items = menuByRole[user?.role] || [];

  return (
    <div className="w-64 bg-[#0f172a] text-white min-h-screen flex flex-col p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <FiBookOpen className="text-2xl text-pista-400" />
        <h2 className="text-xl font-bold">Attendance Tracker</h2>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive ? 'bg-pista-600' : 'hover:bg-white/10'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600/30 text-red-300"
      >
        <FiLogOut /> Logout
      </button>
    </div>
  );
}

export default Sidebar;
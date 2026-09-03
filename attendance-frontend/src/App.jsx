import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import PrincipalDashboard from './pages/PrincipalDashboard';
import HODDashboard from './pages/HODDashboard';
import StaffDashboard from './pages/StaffDashboard';
import MarkAttendance from './pages/MarkAttendance';
import StudentDashboard from './pages/StudentDashboard';
import LeaveRequest from './pages/LeaveRequest';
import LeaveApproval from './pages/LeaveApproval';
import AddStudent from './pages/AddStudent';
import StudentsList from './pages/StudentsList';
import StudentDetail from './pages/StudentDetail';
import FacultyList from './pages/FacultyList';
import AddFaculty from './pages/AddFaculty';
import Notifications from './pages/Notifications';
import TimetableView from './pages/TimetableView';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/principal"
            element={
              <ProtectedRoute allowedRoles={['Principal']}>
                <PrincipalDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hod"
            element={
              <ProtectedRoute allowedRoles={['HOD']}>
                <HODDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['Staff', 'Advisor']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute allowedRoles={['Staff', 'Advisor']}>
                <MarkAttendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leave"
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <LeaveRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leave-approval"
            element={
              <ProtectedRoute allowedRoles={['HOD', 'Principal']}>
                <LeaveApproval />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-student"
            element={
              <ProtectedRoute allowedRoles={['Principal', 'HOD', 'Advisor']}>
                <AddStudent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={['Principal', 'HOD', 'Advisor', 'Staff']}>
                <StudentsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students/:id"
            element={
              <ProtectedRoute allowedRoles={['Principal', 'HOD', 'Advisor', 'Staff']}>
                <StudentDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRoles={['Principal', 'HOD', 'Advisor', 'Staff']}>
                <FacultyList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-faculty"
            element={
              <ProtectedRoute allowedRoles={['Principal', 'HOD']}>
                <AddFaculty />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={['Principal', 'HOD']}>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/timetable"
            element={
              <ProtectedRoute allowedRoles={['Principal', 'HOD', 'Staff', 'Advisor']}>
                <TimetableView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute allowedRoles={['Principal', 'HOD', 'Staff', 'Advisor', 'Student']}>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
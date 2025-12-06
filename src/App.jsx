import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/landing/Landing';
import Login from './pages/login/Login';
import Onboarding from './pages/onboarding/Onboarding';
import Dashboard from './pages/dashboard/Dashboard';
import RecoveryTracking from './pages/recovery-tracking/RecoveryTracking';
import JournalEntry from './pages/journal/JournalEntry';
import StepWork from './pages/step-work/StepWork';
import AppHeader from './components/AppHeader';
import './styles/index.css';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Landing />}
      />
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recovery-tracking"
        element={
          <ProtectedRoute>
            <RecoveryTracking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <JournalEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/step-work"
        element={
          <ProtectedRoute>
            <StepWork />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppHeader />
        <AppRoutes />
        <ToastContainer position="top-center" newestOnTop />
      </Router>
    </AuthProvider>
  );
}

export default App;


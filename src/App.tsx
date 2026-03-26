import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import Data from './pages/Data';
import Scanner from './pages/Scanner';
import OmegaDatabase from './pages/OmegaDatabase';
import Community from './pages/Community';
import Protocol from './pages/Protocol';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import DistributorUpgrade from './pages/DistributorUpgrade';
import Pipeline from './pages/crm/Pipeline';
import FollowUps from './pages/crm/FollowUps';
import Clients from './pages/crm/Clients';
import TestTracking from './pages/crm/TestTracking';
import Performance from './pages/crm/Performance';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage />;
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
}

function DistributorRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isDistributor } = useAuth();

  if (loading) return <LoadingSpinner fullPage />;
  if (!user) return <Navigate to="/login" />;
  if (!isDistributor) return <Navigate to="/distributor-upgrade" />;

  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage />;
  if (user) return <Navigate to="/" />;

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/data" element={<Data />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/omega" element={<OmegaDatabase />} />
        <Route path="/community" element={<Community />} />
        <Route path="/protocol" element={<Protocol />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/distributor-upgrade" element={<DistributorUpgrade />} />
        <Route path="/crm/pipeline" element={<DistributorRoute><Pipeline /></DistributorRoute>} />
        <Route path="/crm/followups" element={<DistributorRoute><FollowUps /></DistributorRoute>} />
        <Route path="/crm/clients" element={<DistributorRoute><Clients /></DistributorRoute>} />
        <Route path="/crm/tests" element={<DistributorRoute><TestTracking /></DistributorRoute>} />
        <Route path="/crm/performance" element={<DistributorRoute><Performance /></DistributorRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/Layout';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { AuthGuard } from './components/auth/AuthGuard';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { Dashboard } from './pages/Dashboard';
import { Scanner } from './pages/Scanner';
import { Community } from './pages/Community';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';

function Protected({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/onboarding"
        element={<Protected><OnboardingFlow /></Protected>}
      />
      <Route
        element={<Protected><Layout /></Protected>}
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/community" element={<Community />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <AppRoutes />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

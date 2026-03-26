import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, isDemoMode } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#D4FF00] rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Demo mode: skip auth checks
  if (isDemoMode) {
    return <>{children}</>;
  }

  // Not authenticated: redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but onboarding not complete: redirect to onboarding
  if (profile && !profile.onboarding_completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

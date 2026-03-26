import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export function LoginPage() {
  const { signIn, user, isDemoMode } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already authenticated: redirect to home
  if (user && !isDemoMode) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  }

  function handleDemoMode() {
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-gray-200/50 p-8 shadow-sm">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#D4FF00] rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
              {t.common.lifeBalance}
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4FF00] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4FF00] focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D4FF00] text-black font-bold rounded-xl hover:bg-[#c5f000] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Mode Button */}
          {isDemoMode && (
            <button
              onClick={handleDemoMode}
              className="w-full mt-3 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-900 active:scale-[0.98] transition-all"
            >
              Continue as Demo
            </button>
          )}

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-[#1a1a1a] font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../services/supabase';

type View = 'login' | 'forgot';

export function LoginPage() {
  const { signIn, user, isDemoMode } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

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

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResetSent(false);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setResetSent(true);
    }
    setLoading(false);
  }

  function handleDemoMode() {
    navigate('/');
  }

  function switchToForgot() {
    setError('');
    setResetSent(false);
    setView('forgot');
  }

  function switchToLogin() {
    setError('');
    setResetSent(false);
    setView('login');
  }

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-gray-200/50 p-8 shadow-sm">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-violet-500 rounded-2xl flex items-center justify-center">
              <img src="/logo-m7-white.png" alt="M7 Life Balance" className="w-8 h-8 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-violet-950 tracking-tight">
              {t.common.lifeBalance}
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {view === 'login' ? (
            <>
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-violet-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={switchToForgot}
                      className="text-xs font-semibold text-violet-500 hover:text-violet-700 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-violet-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-violet-500 text-white font-bold rounded-xl hover:bg-violet-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {/* Demo Mode Button */}
              {isDemoMode && (
                <button
                  onClick={handleDemoMode}
                  className="w-full mt-3 py-3 bg-violet-100 text-violet-700 font-bold rounded-xl hover:bg-violet-200 active:scale-[0.98] transition-all"
                >
                  Continue as Demo
                </button>
              )}

              {/* Sign Up Link */}
              <p className="mt-6 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-violet-700 font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </>
          ) : (
            <>
              {/* Forgot Password */}
              <button
                onClick={switchToLogin}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-700 transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>

              <h2 className="text-xl font-bold text-violet-950 mb-2">Forgot your password?</h2>
              <p className="text-sm text-gray-500 mb-6">
                We'll send you a secure link to reset it. Check your inbox in a couple of minutes.
              </p>

              {resetSent ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-bold text-emerald-900 mb-1">Email sent!</p>
                  <p className="text-xs text-emerald-700">
                    Check <span className="font-semibold">{email}</span> for the reset link. It may take a couple of minutes.
                  </p>
                  <button
                    onClick={switchToLogin}
                    className="mt-4 text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Back to login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-violet-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-violet-500 text-white font-bold rounded-xl hover:bg-violet-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Sending...' : 'Send reset link'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

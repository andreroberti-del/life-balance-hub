import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Users2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { applyReferralCode } from '../../hooks/useReferrals';
import { supabase } from '../../services/supabase';

export function SignUpPage() {
  const { signUp, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) setReferralCode(ref.toUpperCase());
  }, [searchParams]);

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!displayName.trim()) {
      setError('Display name is required.');
      return;
    }

    setLoading(true);

    const { error: signUpError } = await signUp(email, password, displayName.trim());

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (referralCode.trim()) {
      const { data: { user: newUser } } = await supabase.auth.getUser();
      if (newUser?.id) {
        try {
          await applyReferralCode(newUser.id, referralCode.trim().toUpperCase());
        } catch (e) {
          console.warn('Referral code application failed (non-blocking):', e);
        }
      }
    }

    navigate('/onboarding');
  }

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-gray-200/50 p-8 shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-violet-500 rounded-2xl flex items-center justify-center">
              <img src="/logo-m7-white.png" alt="M7 Life Balance" className="w-8 h-8 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-violet-950 tracking-tight">
              {t.common.lifeBalance}
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-violet-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
              />
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-violet-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repeat your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-violet-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="referralCode" className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Users2 className="w-4 h-4 text-violet-500" /> Código de Indicação <span className="text-xs text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                id="referralCode"
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="M7-XXXXXX"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-violet-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all tracking-wider font-bold uppercase"
              />
              <p className="text-xs text-gray-400 mt-1.5">Entrou por um amigo? Cole o código M7 dele aqui.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-violet-500 text-white font-bold rounded-xl hover:bg-violet-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-violet-700 font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Users2, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { applyReferralCode } from '../../hooks/useReferrals';
import { supabase } from '../../services/supabase';
import { FlickeringGrid } from '../../../components/ui/flickering-grid';

const LOGO_MASK_URL = '/logo-m7-white.png';

const maskStyle: React.CSSProperties = {
  WebkitMaskImage: `url('${LOGO_MASK_URL}')`,
  WebkitMaskSize: 'contain',
  WebkitMaskPosition: 'center',
  WebkitMaskRepeat: 'no-repeat',
  maskImage: `url('${LOGO_MASK_URL}')`,
  maskSize: 'contain',
  maskPosition: 'center',
  maskRepeat: 'no-repeat',
};

export function SignUpPage() {
  const { signUp, user } = useAuth();
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

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('As senhas não coincidem.'); return; }
    if (password.length < 6) { setError('Senha precisa ter no mínimo 6 caracteres.'); return; }
    if (!displayName.trim()) { setError('Nome é obrigatório.'); return; }

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
    <div className="relative min-h-screen overflow-hidden bg-white flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 30%, rgba(196, 181, 253, 0.55) 0%, rgba(221, 214, 254, 0.35) 35%, rgba(245, 243, 255, 0.6) 70%, #ffffff 100%)',
        }}
      />

      <FlickeringGrid
        className="absolute inset-0 z-0 [mask-image:radial-gradient(700px_circle_at_center,white,transparent)]"
        color="#A78BFA"
        maxOpacity={0.08}
        flickerChance={0.08}
        squareSize={3}
        gridGap={6}
      />

      <div className="relative z-20 w-full max-w-md">
        <div className="relative rounded-3xl border border-violet-100 bg-white/80 backdrop-blur-xl p-8 pt-10 shadow-2xl shadow-violet-200/40 overflow-hidden">
          {/* Logo flickering grid DENTRO do card */}
          <div className="relative w-[120px] h-[120px] mx-auto mb-4" style={maskStyle}>
            <FlickeringGrid
              color="#6D28D9"
              maxOpacity={0.9}
              flickerChance={0.25}
              squareSize={3}
              gridGap={4}
            />
          </div>

          <div className="text-center mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-violet-600">
              MIND7 LIFE BALANCE
            </p>
            <p className="text-xs text-gray-500 mt-1">Comece sua jornada</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Nome
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-violet-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-violet-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 6 caracteres"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-violet-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repita a senha"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-violet-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="referralCode" className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-2">
                <Users2 className="w-3.5 h-3.5 text-violet-500" />
                Código de indicação
                <span className="text-[10px] text-gray-400 font-normal normal-case">opcional</span>
              </label>
              <input
                id="referralCode"
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="M7-XXXXXX"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-violet-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all tracking-wider font-bold uppercase"
              />
              <p className="text-[11px] text-gray-400 mt-1.5">Entrou por indicação? Cole o código M7 do amigo aqui.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:from-violet-600 hover:to-fuchsia-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Já tem conta?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-violet-700 font-semibold hover:text-violet-800 hover:underline"
            >
              Entrar
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-[10px] tracking-[0.3em] uppercase text-violet-500/60">
          Mind7 · Instituto de saúde integral
        </p>
      </div>
    </div>
  );
}

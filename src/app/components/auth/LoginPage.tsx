import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../services/supabase';
import { FlickeringGrid } from '../../../components/ui/flickering-grid';

type View = 'login' | 'forgot';

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
    if (resetError) setError(resetError.message);
    else setResetSent(true);
    setLoading(false);
  }

  function handleDemoMode() { navigate('/'); }
  function switchToForgot() { setError(''); setResetSent(false); setView('forgot'); }
  function switchToLogin() { setError(''); setResetSent(false); setView('login'); }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center px-4">
      {/* Layer 1: Radial gradient roxo escuro */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(109, 40, 217, 0.45) 0%, rgba(76, 29, 149, 0.25) 40%, rgba(0, 0, 0, 0.95) 80%, #000 100%)',
        }}
      />

      {/* Layer 2: Flickering grid de fundo (sutil, ambiente) */}
      <FlickeringGrid
        className="absolute inset-0 z-0 [mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]"
        color="#7C3AED"
        maxOpacity={0.18}
        flickerChance={0.12}
        squareSize={4}
        gridGap={5}
      />

      {/* Layer 3: Flickering grid masked com logo Mind7 (efeito principal) */}
      <div
        className="absolute left-1/2 top-[18%] -translate-x-1/2 w-[460px] h-[460px] z-10 pointer-events-none"
        style={maskStyle}
      >
        <FlickeringGrid
          color="#A78BFA"
          maxOpacity={0.85}
          flickerChance={0.22}
          squareSize={3}
          gridGap={5}
        />
      </div>

      {/* Layer 4: Card do form */}
      <div className="relative z-20 w-full max-w-md mt-[280px]">
        <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 shadow-2xl shadow-violet-950/40">
          {/* Brand line */}
          <div className="text-center mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-violet-300/80">
              MIND7 LIFE BALANCE
            </p>
            <p className="text-xs text-violet-200/60 mt-1">
              {view === 'login' ? 'Bem-vindo de volta' : 'Redefina sua senha'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {view === 'login' ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-violet-200/70 mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-white/15 bg-white/5 text-white placeholder-violet-200/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-violet-200/70">
                      Senha
                    </label>
                    <button
                      type="button"
                      onClick={switchToForgot}
                      className="text-[11px] font-semibold text-violet-300 hover:text-violet-200 transition-colors"
                    >
                      Esqueceu?
                    </button>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-white/15 bg-white/5 text-white placeholder-violet-200/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:from-violet-400 hover:to-fuchsia-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              {isDemoMode && (
                <button
                  onClick={handleDemoMode}
                  className="w-full mt-3 py-3 bg-white/5 border border-white/10 text-violet-200 font-bold rounded-xl hover:bg-white/10 transition-all"
                >
                  Continuar como Demo
                </button>
              )}

              <p className="mt-6 text-center text-sm text-violet-200/60">
                Ainda não tem conta?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-violet-300 font-semibold hover:text-violet-200 hover:underline"
                >
                  Criar agora
                </button>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={switchToLogin}
                className="flex items-center gap-2 text-xs text-violet-200/70 hover:text-violet-200 transition-colors mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar
              </button>

              <h2 className="text-xl font-bold text-white mb-2">Esqueceu sua senha?</h2>
              <p className="text-sm text-violet-200/60 mb-6">
                Mandamos um link seguro pra resetar. Confere a caixa de entrada em alguns minutos.
              </p>

              {resetSent ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-bold text-emerald-300 mb-1">Email enviado</p>
                  <p className="text-xs text-emerald-200/80">
                    Confere <span className="font-semibold">{email}</span> — pode demorar alguns minutos.
                  </p>
                  <button
                    onClick={switchToLogin}
                    className="mt-4 text-xs font-bold text-emerald-300 hover:underline"
                  >
                    Voltar pro login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label htmlFor="reset-email" className="block text-[11px] font-bold uppercase tracking-wider text-violet-200/70 mb-1.5">
                      Email
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-white/15 bg-white/5 text-white placeholder-violet-200/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:from-violet-400 hover:to-fuchsia-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Enviando...' : 'Mandar link'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Brand footer */}
        <p className="mt-6 text-center text-[10px] tracking-[0.3em] uppercase text-violet-300/40">
          Mind7 · Instituto de saúde integral
        </p>
      </div>
    </div>
  );
}

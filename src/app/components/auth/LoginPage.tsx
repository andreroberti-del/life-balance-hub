import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
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
    <div className="relative min-h-screen overflow-hidden bg-white flex items-center justify-center px-4">
      {/* Layer 1: Gradient branco → lilás claro */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 35%, rgba(196, 181, 253, 0.55) 0%, rgba(221, 214, 254, 0.35) 35%, rgba(245, 243, 255, 0.6) 70%, #ffffff 100%)',
        }}
      />

      {/* Layer 2: Flickering grid ambiente (sutil em violet sobre fundo claro) */}
      <FlickeringGrid
        className="absolute inset-0 z-0 [mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
        color="#7C3AED"
        maxOpacity={0.12}
        flickerChance={0.1}
        squareSize={3}
        gridGap={5}
      />

      {/* Layer 3: Logo com flickering grid (menor e violet vibrante) */}
      <div
        className="absolute left-1/2 top-[10%] -translate-x-1/2 w-[200px] h-[200px] z-10 pointer-events-none md:w-[240px] md:h-[240px]"
        style={maskStyle}
      >
        <FlickeringGrid
          color="#6D28D9"
          maxOpacity={0.85}
          flickerChance={0.22}
          squareSize={3}
          gridGap={4}
        />
      </div>

      {/* Layer 4: Card form (light) */}
      <div className="relative z-20 w-full max-w-md mt-[180px] md:mt-[200px]">
        <div className="rounded-3xl border border-violet-100 bg-white/80 backdrop-blur-xl p-8 shadow-2xl shadow-violet-200/40">
          <div className="text-center mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-violet-600">
              MIND7 LIFE BALANCE
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {view === 'login' ? 'Bem-vindo de volta' : 'Redefina sua senha'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {view === 'login' ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      Senha
                    </label>
                    <button
                      type="button"
                      onClick={switchToForgot}
                      className="text-[11px] font-semibold text-violet-600 hover:text-violet-700 transition-colors"
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-violet-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:from-violet-600 hover:to-fuchsia-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              {isDemoMode && (
                <button
                  onClick={handleDemoMode}
                  className="w-full mt-3 py-3 bg-violet-50 border border-violet-100 text-violet-700 font-bold rounded-xl hover:bg-violet-100 transition-all"
                >
                  Continuar como Demo
                </button>
              )}

              <p className="mt-6 text-center text-sm text-gray-500">
                Ainda não tem conta?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-violet-700 font-semibold hover:text-violet-800 hover:underline"
                >
                  Criar agora
                </button>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={switchToLogin}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-violet-700 transition-colors mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar
              </button>

              <h2 className="text-xl font-bold text-violet-950 mb-2">Esqueceu sua senha?</h2>
              <p className="text-sm text-gray-500 mb-6">
                Mandamos um link seguro pra resetar. Confere a caixa de entrada em alguns minutos.
              </p>

              {resetSent ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-bold text-emerald-900 mb-1">Email enviado</p>
                  <p className="text-xs text-emerald-700">
                    Confere <span className="font-semibold">{email}</span> — pode demorar alguns minutos.
                  </p>
                  <button
                    onClick={switchToLogin}
                    className="mt-4 text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Voltar pro login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label htmlFor="reset-email" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Email
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-violet-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:from-violet-600 hover:to-fuchsia-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Enviando...' : 'Mandar link'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        <p className="mt-6 text-center text-[10px] tracking-[0.3em] uppercase text-violet-500/60">
          Mind7 · Instituto de saúde integral
        </p>
      </div>
    </div>
  );
}

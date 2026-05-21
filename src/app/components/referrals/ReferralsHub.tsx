import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users2, Copy, Share2, Gift, CheckCircle, Clock, Zap, Trophy, Crown, Award } from 'lucide-react';
import { useReferrals } from '../../hooks/useReferrals';

const entry = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

export function ReferralsHub() {
  const { myCode, referrals, rewards, stats, loading, shareLink } = useReferrals();
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  const copyToClipboard = async (value: string, kind: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1800);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const progressToReward = Math.min(100, Math.round((stats.active / 3) * 100));

  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-violet-500 rounded-3xl p-8 md:p-10 mb-8 shadow-xl shadow-violet-500/20"
        >
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-20 w-56 h-56 bg-violet-300/30 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users2 className="w-5 h-5 text-white/80" />
                <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Família M7</p>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
                Indique. Cresça. Ganhe.
              </h1>
              <p className="text-white/85 text-base max-w-xl">
                A cada 3 indicados ativos no Premium, você ganha Premium grátis permanente.
                Distribuidores aprovados ganham comissão também.
              </p>
            </div>

            {myCode && (
              <div className="bg-white/15 backdrop-blur rounded-2xl px-6 py-5 border border-white/20 min-w-[280px]">
                <div className="text-xs text-white/80 font-bold uppercase tracking-wider mb-2">Seu código</div>
                <div className="text-3xl font-bold text-white mb-3 tracking-wider">{myCode.code}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(myCode.code, 'code')}
                    className="flex-1 bg-white/20 hover:bg-white/30 rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-white text-xs font-bold transition-colors"
                  >
                    {copied === 'code' ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    {copied === 'code' ? 'Copiado!' : 'Copiar código'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(shareLink, 'link')}
                    className="flex-1 bg-white text-violet-700 rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-bold hover:scale-105 transition-transform"
                  >
                    {copied === 'link' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                    {copied === 'link' ? 'Copiado!' : 'Copiar link'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* STATS TRIO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total indicados', value: stats.total, icon: Users2, accent: 'violet' },
            { label: 'Ativos no Premium', value: stats.active, icon: CheckCircle, accent: 'violet-solid' },
            { label: 'Aguardando ativação', value: stats.pending, icon: Clock, accent: 'violet' },
          ].map((s, i) => (
            <motion.div
              key={i} {...entry(0)}
              whileHover={{ y: -4 }}
              className={`rounded-3xl p-7 shadow-lg transition-shadow hover:shadow-xl ${
                s.accent === 'violet-solid' ? 'bg-violet-500 shadow-violet-500/20' : 'bg-white border border-violet-100'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                s.accent === 'violet-solid' ? 'bg-white/20' : 'bg-violet-100'
              }`}>
                <s.icon className={`w-6 h-6 ${s.accent === 'violet-solid' ? 'text-white' : 'text-violet-500'}`} />
              </div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                s.accent === 'violet-solid' ? 'text-white/70' : 'text-gray-400'
              }`}>{s.label}</p>
              <h2 className={`text-5xl font-bold tracking-tight ${
                s.accent === 'violet-solid' ? 'text-white' : 'text-violet-950'
              }`}>{s.value}</h2>
            </motion.div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-6">

          {/* LEFT 8-col: Lista de indicados */}
          <div className="col-span-12 lg:col-span-8 space-y-6">

            {/* Progress to next reward */}
            <motion.div
              {...entry(0)}
              className="bg-white rounded-3xl p-7 border border-violet-100 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-400/30">
                  <Gift className="w-7 h-7 text-violet-950" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-violet-950">Próxima recompensa</h3>
                  <p className="text-sm text-gray-500">
                    {stats.untilNextReward === 0
                      ? 'Você já tem 3 ativos! Premium grátis permanente desbloqueado.'
                      : `Faltam ${stats.untilNextReward} ativos para Premium grátis permanente`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-violet-950">{stats.active}<span className="text-xl text-gray-400">/3</span></p>
                </div>
              </div>
              <div className="h-3 bg-violet-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${progressToReward}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full bg-gradient-to-r from-violet-500 to-yellow-400 rounded-full"
                />
              </div>
            </motion.div>

            {/* Lista de indicados */}
            <motion.div
              {...entry(0)}
              className="bg-white rounded-3xl p-7 border border-violet-100 shadow-lg"
            >
              <h3 className="text-xl font-bold text-violet-950 mb-5">Pessoas que você indicou</h3>

              {loading ? (
                <p className="text-sm text-gray-500 text-center py-8">Carregando...</p>
              ) : referrals.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users2 className="w-8 h-8 text-violet-500" />
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Você ainda não indicou ninguém.</p>
                  <p className="text-xs text-gray-400">Compartilhe seu código pra começar a construir sua tribo M7.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {referrals.map((r) => {
                    const name = r.referred?.display_name || r.referred?.email || 'Usuário';
                    const initials = name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
                    return (
                      <div
                        key={r.id}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-violet-50 border border-violet-100"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-violet-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-violet-950 truncate">{name}</p>
                          <p className="text-xs text-gray-500">Indicado em {new Date(r.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          r.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                          r.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {r.status === 'active' ? 'Ativo' : r.status === 'pending' ? 'Pendente' : r.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT 4-col: Tier system + Rewards */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            {/* How it works */}
            <motion.div
              {...entry(0)}
              className="relative overflow-hidden bg-violet-500 rounded-3xl p-7 shadow-lg shadow-violet-500/20"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <Crown className="w-8 h-8 text-yellow-300 mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Como funciona</h3>
                <p className="text-sm text-white/85 mb-4">
                  Programa Família M7. Indicações pessoais geram recompensas em camadas:
                </p>
                <ul className="space-y-3 text-sm text-white/90">
                  <li className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0 font-bold text-xs">1</span>
                    <span><strong>Membro:</strong> 3 ativos = Premium grátis permanente</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0 font-bold text-xs">2</span>
                    <span><strong>Distribuidor aprovado:</strong> comissão por indicação Zinzino</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0 font-bold text-xs">3</span>
                    <span><strong>+50 XP</strong> por signup, <strong>+200 XP</strong> quando vira Premium</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Rewards list */}
            <motion.div
              {...entry(0)}
              className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg"
            >
              <h3 className="text-lg font-bold text-violet-950 mb-4">Recompensas conquistadas</h3>
              {rewards.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">
                  Indique 3 pessoas que virem Premium para sua primeira recompensa.
                </p>
              ) : (
                <div className="space-y-2">
                  {rewards.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                      <Award className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-emerald-900">
                          {r.reward_type === 'free_premium_permanent' ? 'Premium Grátis Permanente' : r.reward_type}
                        </p>
                        <p className="text-xs text-emerald-700">
                          Conquistado em {new Date(r.granted_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* XP bonus card */}
            <motion.div
              {...entry(0)}
              className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                <h4 className="font-bold text-yellow-900">XP por indicação</h4>
              </div>
              <p className="text-sm text-yellow-800">
                Cada signup novo na sua rede te dá <strong>+50 XP</strong>.
                Quando vira Premium, <strong>+200 XP</strong>. Acumule e suba de nível.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

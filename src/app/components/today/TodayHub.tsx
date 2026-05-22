import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Brain, Sparkles, Sun, Sunrise, Moon,
  Footprints, Droplet, Bed, Wind, Target, BookOpen,
  HeartHandshake, Flame, NotebookPen, Utensils, Activity as ActivityIcon,
  CheckCircle, Circle, Quote, ListChecks,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDailyQuests, DailyQuest } from '../../hooks/useDailyQuests';
import { useEmotionalCheckin } from '../../hooks/useMindSpirit';
import { ThemeToggle } from '../../../components/ui/theme-toggle';
import { Mind7Icon } from '../../../components/ui/mind7-icon';
import { WeeklyChart } from './WeeklyChart';
import { MacroRing } from './MacroRing';

const partOfDay = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
};

const greeting = (name: string) => {
  const p = partOfDay();
  if (p === 'morning') return `Bom dia, ${name}`;
  if (p === 'afternoon') return `Boa tarde, ${name}`;
  return `Boa noite, ${name}`;
};

const QUOTES = [
  { text: 'Cuide do seu corpo. É o único lugar que você tem para viver.', author: 'Jim Rohn' },
  { text: 'A mente é como um paraquedas, só funciona quando está aberta.', author: 'Frank Zappa' },
  { text: 'O que vem de dentro é mais forte do que o que vem de fora.', author: 'Lao Tsé' },
  { text: 'Seu maior projeto é você mesmo.', author: 'Mind7' },
];

const WEEK_DATA = [
  { day: 'Dom', corpo: 68, mente: 72, alma: 55 },
  { day: 'Seg', corpo: 72, mente: 76, alma: 60 },
  { day: 'Ter', corpo: 70, mente: 80, alma: 65 },
  { day: 'Qua', corpo: 78, mente: 78, alma: 70 },
  { day: 'Qui', corpo: 79, mente: 83, alma: 67 },
  { day: 'Sex', corpo: 0, mente: 0, alma: 0 },
  { day: 'Sáb', corpo: 0, mente: 0, alma: 0 },
];

export function TodayHub() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { quests, completedCount, totalCount } = useDailyQuests();
  const { today: todayEmotional } = useEmotionalCheckin();

  const displayName = profile?.display_name?.split(' ')[0] || 'amigo';
  const part = partOfDay();

  // Scores
  const { corpoScore, menteScore, almaScore, indice } = useMemo(() => {
    const byCat = { body: 0, mind: 0, spirit: 0 };
    const totalByCat = { body: 0, mind: 0, spirit: 0 };
    quests.forEach((q: DailyQuest) => {
      const k = q.category === 'body' ? 'body' : q.category === 'mind' ? 'mind' : q.category === 'spirit' ? 'spirit' : null;
      if (k) {
        totalByCat[k]++;
        if (q.is_completed) byCat[k]++;
      }
    });
    const compute = (d: number, t: number) =>
      t === 0 ? 60 + (todayEmotional ? 15 : 0) : Math.round(60 + (d / t) * 35 + (todayEmotional ? 5 : 0));
    const corpoScore = Math.min(100, compute(byCat.body, totalByCat.body));
    const menteScore = Math.min(100, compute(byCat.mind, totalByCat.mind) + (todayEmotional ? 8 : 0));
    const almaScore = Math.min(100, compute(byCat.spirit, totalByCat.spirit));
    const indice = Math.round((corpoScore + menteScore + almaScore) / 3);
    return { corpoScore, menteScore, almaScore, indice };
  }, [quests, todayEmotional]);

  const todayQuote = useMemo(() => QUOTES[new Date().getDate() % QUOTES.length], []);

  const pillarColors = {
    corpo: { dot: 'bg-cyan-400', text: 'text-cyan-500 dark:text-cyan-300', stroke: '#22D3EE', glow: '0_0_12px_rgba(34,211,238,0.4)' },
    mente: { dot: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-300', stroke: '#668DFF', glow: '0_0_12px_rgba(102,141,255,0.4)' },
    alma: { dot: 'bg-fuchsia-400', text: 'text-fuchsia-500 dark:text-fuchsia-300', stroke: '#C084FC', glow: '0_0_12px_rgba(192,132,252,0.4)' },
  };

  const practicesProgressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50/60 via-white to-violet-50/40 dark:from-[#0B0B1F] dark:via-[#0F0C29] dark:to-[#1A1145] transition-colors duration-500">
      {/* Header bar */}
      <div className="sticky top-0 z-30 px-6 md:px-10 py-4 flex items-center justify-between backdrop-blur-xl bg-white/60 dark:bg-black/30 border-b border-violet-100 dark:border-violet-900/30">
        <span className="text-xs font-medium text-gray-500 dark:text-violet-200/60 capitalize">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
        </span>
        <div className="flex items-center gap-4">
          <Mind7Icon size={32} squareColor="#5468FF" />
          <span className="hidden md:block text-sm font-bold text-violet-950 dark:text-white tracking-tight">MIND7</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-violet-300/40">Instituto</span>
        </div>
        <ThemeToggle />
      </div>

      <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* COLUNA PRINCIPAL */}
        <div className="space-y-6">

          {/* BANNER HERO */}
          <motion.section
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-950 to-violet-900 dark:from-black dark:via-violet-950 dark:to-indigo-950 p-8 md:p-10 min-h-[420px] shadow-2xl shadow-violet-500/20 dark:shadow-violet-500/30"
          >
            {/* Foto/gradient hero */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-700/30 via-transparent to-fuchsia-600/20" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,rgba(167,139,250,0.25),transparent)]" />
              <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-l from-violet-500/10 to-transparent" />
              {/* Sparkle dots */}
              <div className="absolute inset-0 opacity-30">
                {[...Array(40)].map((_, i) => (
                  <span
                    key={i}
                    className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
                    style={{
                      left: `${(i * 37) % 100}%`,
                      top: `${(i * 53) % 100}%`,
                      animationDelay: `${(i * 0.15) % 3}s`,
                      animationDuration: `${2 + (i % 3)}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Top row: data tag + logo pill */}
            <div className="relative z-10 flex items-center justify-between mb-32">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
                {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
              </span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20">
                <Mind7Icon size={16} squareColor="#A78BFA" />
                <span className="text-[10px] font-bold tracking-widest text-white">MIND7</span>
              </div>
            </div>

            {/* Bottom row: avatar + saudação | índice */}
            <div className="relative z-10 flex items-end justify-between gap-6">
              <div className="flex items-end gap-4">
                {/* Avatar ring */}
                <div className="relative">
                  <svg width="92" height="92" viewBox="0 0 92 92" className="-rotate-90">
                    <circle cx="46" cy="46" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                    <circle
                      cx="46" cy="46" r="42"
                      fill="none"
                      stroke="url(#avatar-grad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={2 * Math.PI * 42 * (1 - indice / 100)}
                      style={{ filter: 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.6))', transition: 'stroke-dashoffset 800ms ease-out' }}
                    />
                    <defs>
                      <linearGradient id="avatar-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#22D3EE" />
                        <stop offset="50%" stopColor="#668DFF" />
                        <stop offset="100%" stopColor="#C084FC" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white text-2xl font-bold">
                    {displayName[0]?.toUpperCase()}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-1.5">Bem-vindo de volta</p>
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
                    {greeting(displayName)}
                  </h1>
                  <p className="text-sm text-white/70">
                    <span className="font-bold text-white">{completedCount} de {totalCount}</span> práticas concluídas hoje
                  </p>
                </div>
              </div>

              {/* Índice Geral */}
              <div className="text-right">
                <p className="text-6xl md:text-7xl font-bold text-white tracking-tight" style={{ textShadow: '0 0 24px rgba(167, 139, 250, 0.5)' }}>
                  {indice}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mt-1">Índice Geral</p>
              </div>
            </div>
          </motion.section>

          {/* 4 STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Calorias do Dia */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="md:col-span-2 lg:col-span-1 rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-950 to-violet-900 dark:from-black dark:via-violet-950 dark:to-black p-5 border border-violet-800/30 shadow-xl shadow-violet-500/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Hoje</p>
                  <h3 className="text-base font-bold text-white">Calorias do Dia</h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center" style={{ boxShadow: '0 0 16px rgba(244, 63, 94, 0.3)' }}>
                  <Flame className="w-4 h-4 text-rose-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-2xl bg-white/5 border border-white/5 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Queimadas</p>
                  <p className="text-2xl font-bold text-white mt-1">680</p>
                  <p className="text-[10px] text-white/40">kcal</p>
                  <div className="h-0.5 bg-rose-400 rounded-full mt-2" style={{ width: '60%', boxShadow: '0 0 6px rgba(244, 63, 94, 0.6)' }} />
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/5 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Ingeridas</p>
                  <p className="text-2xl font-bold text-white mt-1">1.920</p>
                  <p className="text-[10px] text-white/40">kcal</p>
                  <div className="h-0.5 bg-blue-400 rounded-full mt-2" style={{ width: '85%', boxShadow: '0 0 6px rgba(96, 165, 250, 0.6)' }} />
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-3">
                <span className="text-[11px] flex items-center gap-1.5 text-white/70">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Saldo calórico
                </span>
                <span className="text-xs font-bold text-amber-300">+1.240 kcal</span>
              </div>
              <div className="flex items-center justify-between">
                <MacroRing label="Proteína" pct={38} grams={88} color="#F43F5E" size={56} />
                <MacroRing label="Carboidrato" pct={47} grams={215} color="#668DFF" size={56} />
                <MacroRing label="Gordura" pct={15} grams={36} color="#C084FC" size={56} />
              </div>
            </motion.div>

            {/* Passos */}
            <StatCard
              label="Passos Hoje"
              value="7.432"
              valueClassName="text-cyan-400 dark:text-cyan-300"
              sub="Meta: 10.000"
              icon={<ActivityIcon className="w-4 h-4 text-cyan-400" />}
              iconBg="bg-cyan-500/20"
              iconGlow="rgba(34, 211, 238, 0.4)"
              barPct={74}
              barColor="#22D3EE"
              delay={0.15}
            />

            {/* Sono */}
            <StatCard
              label="Sono"
              value="7h 20m"
              valueClassName="text-violet-500 dark:text-violet-300"
              sub="Qualidade: 92%"
              icon={<Bed className="w-4 h-4 text-violet-400" />}
              iconBg="bg-violet-500/20"
              iconGlow="rgba(102, 141, 255, 0.4)"
              barPct={92}
              barColor="#668DFF"
              delay={0.2}
            />

            {/* Práticas */}
            <StatCard
              label="Práticas"
              value={`${completedCount}/${totalCount}`}
              valueClassName="text-fuchsia-500 dark:text-fuchsia-300"
              sub={`${practicesProgressPct}% do dia`}
              icon={<CheckCircle className="w-4 h-4 text-fuchsia-400" />}
              iconBg="bg-fuchsia-500/20"
              iconGlow="rgba(192, 132, 252, 0.4)"
              barPct={practicesProgressPct}
              barColor="#C084FC"
              delay={0.25}
            />
          </div>

          {/* LINE CHART EVOLUÇÃO SEMANAL */}
          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-3xl bg-white dark:bg-violet-950/40 backdrop-blur-xl p-6 border border-violet-100 dark:border-violet-900/40 shadow-sm dark:shadow-[0_8px_32px_rgba(124,58,237,0.15)]"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-violet-950 dark:text-white">Evolução Semanal</h2>
                <p className="text-xs text-gray-500 dark:text-violet-200/50 mt-0.5">Índice por pilar — últimos 7 dias</p>
              </div>
              <div className="flex items-center gap-3">
                {(['corpo', 'mente', 'alma'] as const).map((k) => (
                  <div key={k} className="flex items-center gap-1.5 text-[11px] font-bold">
                    <span className={`w-2 h-2 rounded-full ${pillarColors[k].dot}`} style={{ boxShadow: `0 0 6px ${pillarColors[k].stroke}` }} />
                    <span className={pillarColors[k].text}>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>
            <WeeklyChart data={WEEK_DATA} />
            <p className="text-[10px] text-right text-gray-400 dark:text-violet-200/40 mt-2">Hoje: Qui</p>
          </motion.section>

          {/* Quote */}
          <motion.section
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-center py-6 px-6 rounded-3xl bg-gradient-to-br from-violet-100/40 via-white to-amber-50/40 dark:from-violet-950/40 dark:via-black dark:to-fuchsia-950/30 border border-violet-100 dark:border-violet-900/30"
          >
            <Quote className="w-4 h-4 text-violet-400 dark:text-violet-300 mx-auto mb-2" />
            <p className="text-sm md:text-base text-violet-900 dark:text-white/90 font-medium italic max-w-2xl mx-auto leading-relaxed">
              "{todayQuote.text}"
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 dark:text-violet-300/60 mt-2">— {todayQuote.author}</p>
          </motion.section>
        </div>

        {/* SIDEBAR DIREITA */}
        <aside className="space-y-4">

          {/* 3 PILARES (Corpo / Mente / Alma) */}
          <PillarSideCard
            title="Corpo"
            subtitle="Vitalidade Física"
            score={corpoScore}
            icon={<Heart className="w-3.5 h-3.5 text-cyan-400" />}
            accentColor="#22D3EE"
            metrics={[
              { icon: Footprints, label: 'Movimento', value: '7.432 passos', pct: 74 },
              { icon: Droplet, label: 'Alim. & Hidrat.', value: '1,8 L · 2 ref.', pct: 60 },
              { icon: Bed, label: 'Sono', value: '7h 20m', pct: 80 },
            ]}
            onClick={() => navigate('/body')}
            delay={0.05}
          />
          <PillarSideCard
            title="Mente"
            subtitle="Clareza Mental"
            score={menteScore}
            icon={<Brain className="w-3.5 h-3.5 text-violet-400" />}
            accentColor="#668DFF"
            metrics={[
              { icon: Wind, label: 'Meditação', value: '15 min', pct: 50 },
              { icon: Target, label: 'Foco', value: '3 sessões', pct: 60 },
              { icon: NotebookPen, label: 'Diário', value: '1 entrada', pct: 40 },
            ]}
            onClick={() => navigate('/mind')}
            delay={0.1}
          />
          <PillarSideCard
            title="Alma"
            subtitle="Paz Interior"
            score={almaScore}
            icon={<Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />}
            accentColor="#C084FC"
            metrics={[
              { icon: HeartHandshake, label: 'Gratidão', value: '3 itens', pct: 75 },
              { icon: Flame, label: 'Respiração', value: '10 min', pct: 50 },
              { icon: BookOpen, label: 'Reflexão', value: '0 entradas', pct: 0 },
            ]}
            onClick={() => navigate('/spirit')}
            delay={0.15}
          />

          {/* 7 PRÁTICAS */}
          {quests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-3xl bg-white dark:bg-violet-950/40 backdrop-blur-xl p-5 border border-violet-100 dark:border-violet-900/40 shadow-sm dark:shadow-[0_8px_32px_rgba(124,58,237,0.15)]"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-violet-950 dark:text-white">7 Práticas de Hoje</h3>
                  <p className="text-[11px] text-gray-500 dark:text-violet-200/50">{completedCount} de {totalCount} concluídas</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400 dark:text-violet-300" />
                  <span className="text-xl font-bold text-violet-600 dark:text-violet-300" style={{ textShadow: '0 0 12px rgba(167,139,250,0.4)' }}>
                    {practicesProgressPct}%
                  </span>
                </div>
              </div>
              <div className="h-1 bg-violet-100 dark:bg-violet-900/30 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 rounded-full transition-all duration-700"
                  style={{ width: `${practicesProgressPct}%`, boxShadow: '0 0 8px rgba(167, 139, 250, 0.6)' }}
                />
              </div>
              <ul className="space-y-1">
                {quests.map((q) => {
                  const pillarKey = (q.category === 'body' ? 'corpo' : q.category === 'mind' ? 'mente' : 'alma') as 'corpo' | 'mente' | 'alma';
                  return (
                    <li
                      key={q.quest_code}
                      className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-violet-50/50 dark:hover:bg-violet-900/20 transition-colors"
                    >
                      {q.is_completed ? (
                        <CheckCircle className="w-4 h-4 text-violet-400 dark:text-violet-300 flex-shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(167,139,250,0.5))' }} />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300 dark:text-violet-200/30 flex-shrink-0" />
                      )}
                      <span className={`flex-1 text-xs ${q.is_completed ? 'text-gray-400 dark:text-violet-200/40 line-through' : 'text-violet-950 dark:text-white font-medium'}`}>
                        {q.title_pt}
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full ${pillarColors[pillarKey].dot}`} style={{ boxShadow: `0 0 6px ${pillarColors[pillarKey].stroke}` }} />
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}

          {/* CTA hubs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-3xl bg-white dark:bg-violet-950/40 backdrop-blur-xl p-4 border border-violet-100 dark:border-violet-900/40"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-violet-200/50 mb-3 px-1">Vai mais fundo</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: '/body', icon: ActivityIcon, label: 'Body', color: 'from-emerald-500 to-teal-500' },
                { to: '/mind', icon: Brain, label: 'Mind', color: 'from-violet-500 to-indigo-500' },
                { to: '/spirit', icon: Heart, label: 'Spirit', color: 'from-rose-500 to-fuchsia-500' },
                { to: '/grow', icon: Sparkles, label: 'Grow', color: 'from-amber-500 to-orange-500' },
              ].map((h) => {
                const Icon = h.icon;
                return (
                  <button
                    key={h.to}
                    onClick={() => navigate(h.to)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-violet-50/50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-all"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${h.color} flex items-center justify-center`} style={{ boxShadow: '0 0 12px rgba(124, 58, 237, 0.3)' }}>
                      <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-bold text-violet-950 dark:text-white">{h.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function StatCard({
  label, value, valueClassName, sub, icon, iconBg, iconGlow, barPct, barColor, delay = 0,
}: {
  label: string; value: string; valueClassName: string; sub: string;
  icon: React.ReactNode; iconBg: string; iconGlow: string;
  barPct: number; barColor: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="rounded-3xl bg-white dark:bg-violet-950/40 backdrop-blur-xl p-5 border border-violet-100 dark:border-violet-900/40 shadow-sm dark:shadow-[0_8px_32px_rgba(124,58,237,0.12)]"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-violet-200/50">{label}</p>
        </div>
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`} style={{ boxShadow: `0 0 16px ${iconGlow}` }}>
          {icon}
        </div>
      </div>
      <p className={`text-3xl md:text-4xl font-bold tracking-tight ${valueClassName}`} style={{ textShadow: `0 0 12px ${barColor}40` }}>
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-violet-200/50 mt-1">{sub}</p>
      <div className="h-0.5 bg-violet-100 dark:bg-violet-900/30 rounded-full overflow-hidden mt-4">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, barPct)}%`, background: barColor, boxShadow: `0 0 6px ${barColor}` }}
        />
      </div>
    </motion.div>
  );
}

function PillarSideCard({
  title, subtitle, score, icon, accentColor, metrics, onClick, delay = 0,
}: {
  title: string; subtitle: string; score: number; icon: React.ReactNode; accentColor: string;
  metrics: Array<{ icon: React.ComponentType<{ className?: string }>; label: string; value: string; pct: number }>;
  onClick?: () => void; delay?: number;
}) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(100, score) / 100);

  return (
    <motion.button
      initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
      whileHover={{ x: -2 }}
      onClick={onClick}
      className="w-full text-left rounded-3xl bg-white dark:bg-violet-950/40 backdrop-blur-xl p-4 border border-violet-100 dark:border-violet-900/40 shadow-sm dark:shadow-[0_8px_32px_rgba(124,58,237,0.12)] hover:border-violet-200 dark:hover:border-violet-700/50 transition-all"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="relative" style={{ width: 44, height: 44 }}>
          <svg viewBox="0 0 44 44" className="-rotate-90 absolute inset-0">
            <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(102,141,255,0.12)" strokeWidth={3} />
            <circle
              cx="22" cy="22" r={r}
              fill="none"
              stroke={accentColor}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 600ms ease-out', filter: `drop-shadow(0 0 4px ${accentColor})` }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-violet-950 dark:text-white">{score}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {icon}
            <h3 className="text-sm font-bold text-violet-950 dark:text-white">{title}</h3>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-violet-200/50">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-2">
        {metrics.map((m) => {
          const MIcon = m.icon;
          return (
            <div key={m.label}>
              <div className="flex items-center justify-between text-[11px] mb-0.5">
                <span className="flex items-center gap-1 text-gray-600 dark:text-violet-200/60">
                  <MIcon className="w-2.5 h-2.5" />
                  {m.label}
                </span>
                <span className="font-bold text-violet-950 dark:text-white">{m.value}</span>
              </div>
              <div className="h-0.5 bg-violet-100 dark:bg-violet-900/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, m.pct))}%`, background: accentColor, boxShadow: `0 0 4px ${accentColor}` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.button>
  );
}

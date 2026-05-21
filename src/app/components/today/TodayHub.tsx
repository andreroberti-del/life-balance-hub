import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sun, Sunrise, Sunset, Moon, Sparkles, ChevronRight,
  Brain, Wind, Heart, BookOpen, Pill, Droplet, Activity,
  CheckCircle, Circle, Flame, Zap, Target,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLevels } from '../../hooks/useLevels';
import { useDailyQuests, DailyQuest } from '../../hooks/useDailyQuests';
import { useEmotionalCheckin } from '../../hooks/useMindSpirit';
import { ZenoCore } from '../zeno/ZenoCore';

const iconMap: Record<string, typeof Brain> = {
  Brain, Wind, Heart, BookOpen, Pill, Droplet, Activity, Target,
};

const partOfDay = () => {
  const h = new Date().getHours();
  if (h < 6) return 'late';
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  if (h < 22) return 'evening';
  return 'night';
};

const greeting = (name: string) => {
  const p = partOfDay();
  if (p === 'morning') return `Bom dia, ${name}`;
  if (p === 'afternoon') return `Boa tarde, ${name}`;
  if (p === 'evening' || p === 'night') return `Boa noite, ${name}`;
  return `Oi, ${name}`;
};

export function TodayHub() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { current: currentLevel, userLevel, progressPct } = useLevels();
  const { quests, completedCount, totalCount, progressPct: questProgress } = useDailyQuests();
  const { today: todayEmotional } = useEmotionalCheckin();

  const displayName = profile?.display_name?.split(' ')[0] || 'amigo';
  const part = partOfDay();
  const isEvening = part === 'evening' || part === 'night' || part === 'late';

  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8 md:py-12">

        {/* HERO HOJE */}
        <motion.section
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-700 rounded-3xl p-8 md:p-12 mb-8 shadow-2xl shadow-violet-500/30"
        >
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-20 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex items-center gap-6">
              <ZenoCore state={isEvening ? 'idle' : 'thinking'} size="2xl" className="hidden md:flex flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {part === 'morning' && <Sunrise className="w-5 h-5 text-amber-300" />}
                  {part === 'afternoon' && <Sun className="w-5 h-5 text-amber-300" />}
                  {(part === 'evening' || part === 'night') && <Moon className="w-5 h-5 text-amber-300" />}
                  <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-3">
                  {greeting(displayName)}.
                </h1>
                <p className="text-white/85 text-lg max-w-xl">
                  {isEvening
                    ? 'Hora de fechar o dia. Esvazie a mente, registre o que importa, prepare-se pro descanso.'
                    : 'Vamos construir um dia inteiro. ZENO está aqui pra te guiar.'}
                </p>
              </div>
            </div>

            {/* Stats compactos */}
            <div className="flex flex-col gap-3 min-w-[220px]">
              <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 border border-white/20 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Nível</p>
                  <p className="text-lg font-bold text-white">{currentLevel?.name_pt ?? 'Iniciante'}</p>
                </div>
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 border border-white/20">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">XP</p>
                  <p className="text-sm font-bold text-white">{(userLevel?.total_xp ?? 0).toLocaleString()}</p>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-300 rounded-full" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* RITUAL DO DIA — 3 momentos */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-violet-950">Seu ritual de hoje</h2>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-500">
              {completedCount}/{totalCount} concluído
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* MANHÃ */}
            <motion.button
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              whileHover={{ y: -3 }}
              onClick={() => navigate('/mind')}
              className={`text-left p-6 rounded-3xl border-2 transition-all ${
                todayEmotional
                  ? 'bg-emerald-50 border-emerald-200'
                  : part === 'morning'
                  ? 'bg-amber-100 border-amber-300 shadow-lg shadow-amber-200/50'
                  : 'bg-white border-violet-100 hover:border-violet-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Sunrise className={`w-8 h-8 ${part === 'morning' && !todayEmotional ? 'text-amber-600' : 'text-violet-500'}`} />
                {todayEmotional && <CheckCircle className="w-6 h-6 text-emerald-500" />}
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Manhã</p>
              <h3 className="text-lg font-bold text-violet-950 mb-2">Check-in emocional</h3>
              <p className="text-xs text-gray-600">
                {todayEmotional ? 'Você se registrou hoje.' : 'Como você acorda? Define o tom do dia.'}
              </p>
            </motion.button>

            {/* DURANTE */}
            <motion.button
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              whileHover={{ y: -3 }}
              onClick={() => navigate('/body')}
              className={`text-left p-6 rounded-3xl border-2 transition-all ${
                part === 'afternoon'
                  ? 'bg-violet-100 border-violet-300 shadow-lg shadow-violet-200/50'
                  : 'bg-white border-violet-100 hover:border-violet-300'
              }`}
            >
              <Sun className={`w-8 h-8 mb-3 ${part === 'afternoon' ? 'text-violet-600' : 'text-violet-500'}`} />
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Durante</p>
              <h3 className="text-lg font-bold text-violet-950 mb-2">Movimento e hábitos</h3>
              <p className="text-xs text-gray-600">Treino, ômega, hidratação, alimentação anti-inflamatória.</p>
            </motion.button>

            {/* NOITE */}
            <motion.button
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              whileHover={{ y: -3 }}
              onClick={() => navigate('/brain-dump')}
              className={`text-left p-6 rounded-3xl border-2 transition-all ${
                isEvening
                  ? 'bg-indigo-100 border-indigo-300 shadow-lg shadow-indigo-200/50'
                  : 'bg-white border-violet-100 hover:border-violet-300'
              }`}
            >
              <Moon className={`w-8 h-8 mb-3 ${isEvening ? 'text-indigo-600' : 'text-violet-500'}`} />
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Noite</p>
              <h3 className="text-lg font-bold text-violet-950 mb-2">Esvaziar a mente</h3>
              <p className="text-xs text-gray-600">Brain dump + gratidão. Dorme leve, sem peso.</p>
            </motion.button>
          </div>
        </section>

        {/* QUESTS RÁPIDAS */}
        {totalCount > 0 && (
          <section className="mb-8">
            <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-md shadow-yellow-400/30">
                  <Target className="w-5 h-5 text-violet-950" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-violet-950">Quests rápidas</h3>
                  <p className="text-xs text-gray-500">3 mini-objetivos. +30 XP bonus se completar todos.</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-violet-950">{completedCount}<span className="text-base text-gray-400">/{totalCount}</span></p>
                </div>
              </div>
              <div className="h-2 bg-violet-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-violet-500 to-yellow-400 rounded-full transition-all" style={{ width: `${questProgress}%` }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {quests.map((q: DailyQuest) => {
                  const Icon = iconMap[q.icon_name] ?? Target;
                  return (
                    <div
                      key={q.quest_code}
                      className={`p-3 rounded-xl border flex items-center gap-2 ${
                        q.is_completed ? 'bg-emerald-50 border-emerald-200' : 'bg-violet-50 border-violet-100'
                      }`}
                    >
                      {q.is_completed ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <Circle className="w-4 h-4 text-violet-400 flex-shrink-0" />}
                      <Icon className="w-4 h-4 text-violet-500 flex-shrink-0" />
                      <p className={`text-xs font-bold truncate ${q.is_completed ? 'text-emerald-900 line-through' : 'text-violet-950'}`}>
                        {q.title_pt}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTAs HUB SECTIONS */}
        <section>
          <h2 className="text-2xl font-bold text-violet-950 mb-4">Vai mais fundo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { to: '/body', icon: Activity, label: 'Body', sub: 'Treino + Ômega + Scanner', color: 'bg-emerald-500' },
              { to: '/mind', icon: Brain, label: 'Mind', sub: 'Respiração + Emocional', color: 'bg-violet-500' },
              { to: '/spirit', icon: Heart, label: 'Spirit', sub: 'Devocional + Gratidão', color: 'bg-rose-500' },
              { to: '/grow', icon: Sparkles, label: 'Grow', sub: 'Educação + Comunidade', color: 'bg-amber-500' },
            ].map((h, i) => {
              const Icon = h.icon;
              return (
                <motion.button
                  key={h.to}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05 }}
                  whileHover={{ y: -3 }}
                  onClick={() => navigate(h.to)}
                  className="text-left p-5 rounded-3xl bg-white border border-violet-100 hover:shadow-lg transition-all"
                >
                  <div className={`w-11 h-11 rounded-2xl ${h.color} flex items-center justify-center mb-3 shadow-md`}>
                    <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <p className="font-bold text-violet-950 mb-0.5">{h.label}</p>
                  <p className="text-xs text-gray-500">{h.sub}</p>
                </motion.button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

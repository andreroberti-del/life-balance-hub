import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Brain, Sparkles, Sun, Sunrise, Moon,
  Footprints, Droplet, Bed, Wind, Target, BookOpen,
  HeartHandshake, Flame, NotebookPen,
  Activity, ChevronRight, CheckCircle, Circle, Quote,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLevels } from '../../hooks/useLevels';
import { useDailyQuests, DailyQuest } from '../../hooks/useDailyQuests';
import { useEmotionalCheckin } from '../../hooks/useMindSpirit';
import { MultiRingDonut } from '../../../components/ui/multi-ring-donut';
import { PillarCard } from './PillarCard';

type PillarKey = 'corpo' | 'mente' | 'alma';

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
  { text: 'Saúde não é tudo, mas sem ela tudo é nada.', author: 'Schopenhauer' },
  { text: 'Seu maior projeto é você mesmo.', author: 'Mind7' },
];

export function TodayHub() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { userLevel } = useLevels();
  const { quests, completedCount, totalCount } = useDailyQuests();
  const { today: todayEmotional } = useEmotionalCheckin();

  const displayName = profile?.display_name?.split(' ')[0] || 'amigo';
  const part = partOfDay();

  const [activePillar, setActivePillar] = useState<PillarKey>('corpo');

  // Pillar scores — calculados de forma simples a partir das quests
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

    // Score base: 60 + bonus por hábitos completos. Inicia em 60 pra todos verem algo.
    const computeScore = (done: number, total: number) => {
      if (total === 0) return 60 + (todayEmotional ? 15 : 0);
      return Math.round(60 + (done / total) * 35 + (todayEmotional ? 5 : 0));
    };

    const corpoScore = computeScore(byCat.body, totalByCat.body);
    const menteScore = computeScore(byCat.mind, totalByCat.mind) + (todayEmotional ? 10 : 0);
    const almaScore = computeScore(byCat.spirit, totalByCat.spirit);
    const indice = Math.round((corpoScore + menteScore + almaScore) / 3);

    return { corpoScore: Math.min(100, corpoScore), menteScore: Math.min(100, menteScore), almaScore: Math.min(100, almaScore), indice };
  }, [quests, todayEmotional]);

  const todayQuote = useMemo(() => {
    const d = new Date().getDate();
    return QUOTES[d % QUOTES.length];
  }, []);

  // Lista de práticas hoje (vem do daily quests)
  const practices = quests.map((q: DailyQuest) => ({
    code: q.quest_code,
    title: q.title_pt,
    minutes: extractMinutes(q.title_pt) ?? extractMinutes(q.description_pt) ?? 10,
    pillar: (q.category === 'body' ? 'corpo' : q.category === 'mind' ? 'mente' : 'alma') as PillarKey,
    done: q.is_completed,
  }));

  const pillarPalette = {
    corpo: { dot: 'bg-rose-500', text: 'text-rose-600', label: 'Corpo' },
    mente: { dot: 'bg-violet-500', text: 'text-violet-600', label: 'Mente' },
    alma: { dot: 'bg-amber-500', text: 'text-amber-600', label: 'Alma' },
  };

  return (
    <div className="min-h-screen bg-violet-50/40">
      <div className="max-w-[1120px] mx-auto px-6 md:px-10 py-8 md:py-10">

        {/* HEADER STRIP — saudação + donut */}
        <motion.section
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              {part === 'morning' && <Sunrise className="w-3.5 h-3.5 text-amber-500" />}
              {part === 'afternoon' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
              {part === 'evening' && <Moon className="w-3.5 h-3.5 text-indigo-500" />}
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-violet-950 tracking-tight mb-2">
              {greeting(displayName)}
            </h1>
            <p className="text-gray-600 text-base max-w-md">
              Você completou <span className="font-bold text-violet-700">{completedCount} de {totalCount}</span> práticas hoje.
              {' '}Continue, cada passo importa.
            </p>
          </div>

          {/* Donut + legenda */}
          <div className="flex items-center gap-4">
            <MultiRingDonut
              size={140}
              rings={[
                { value: corpoScore, color: '#F43F5E', label: 'Corpo' },
                { value: menteScore, color: '#668DFF', label: 'Mente' },
                { value: almaScore, color: '#F59E0B', label: 'Alma' },
              ]}
              centerValue={indice}
              centerLabel="Índice"
            />
            <div className="space-y-2">
              {[
                { dot: '#F43F5E', label: 'Corpo', val: corpoScore },
                { dot: '#668DFF', label: 'Mente', val: menteScore },
                { dot: '#F59E0B', label: 'Alma', val: almaScore },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.dot }} />
                  <span className="text-gray-600 w-12">{r.label}</span>
                  <span className="h-px w-12 bg-gray-200 relative">
                    <span className="absolute inset-y-0 left-0 rounded-full" style={{ backgroundColor: r.dot, width: `${r.val}%` }} />
                  </span>
                  <span className="font-bold text-violet-950 w-6 text-right">{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 3 PILARES */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-violet-950">Os Três Pilares</h2>
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white border border-violet-100">
              {(['corpo', 'mente', 'alma'] as PillarKey[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePillar(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    activePillar === p ? `${pillarPalette[p].dot} text-white shadow-md` : 'text-gray-500 hover:text-violet-700'
                  }`}
                >
                  {pillarPalette[p].label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PillarCard
              title="Corpo"
              subtitle="Vitalidade Física"
              score={corpoScore}
              icon={Heart}
              accentColor="rose"
              onClick={() => navigate('/body')}
              delay={0.05}
              metrics={[
                { icon: Footprints, label: 'Passos', value: '7.432', pct: 74 },
                { icon: Droplet, label: 'Hidratação', value: '1,8 L', pct: 60 },
                { icon: Bed, label: 'Sono', value: '7h 20m', pct: 80 },
              ]}
            />
            <PillarCard
              title="Mente"
              subtitle="Clareza Mental"
              score={menteScore}
              icon={Brain}
              accentColor="violet"
              onClick={() => navigate('/mind')}
              delay={0.1}
              metrics={[
                { icon: Wind, label: 'Meditação', value: '15 min', pct: 50 },
                { icon: Target, label: 'Foco', value: '3 sessões', pct: 60 },
                { icon: NotebookPen, label: 'Diário', value: '1 entrada', pct: 40 },
              ]}
            />
            <PillarCard
              title="Alma"
              subtitle="Paz Interior"
              score={almaScore}
              icon={Sparkles}
              accentColor="amber"
              onClick={() => navigate('/spirit')}
              delay={0.15}
              metrics={[
                { icon: HeartHandshake, label: 'Gratidão', value: '3 itens', pct: 75 },
                { icon: Flame, label: 'Respiração', value: '10 min', pct: 50 },
                { icon: BookOpen, label: 'Reflexão', value: '0 entradas', pct: 0 },
              ]}
            />
          </div>
        </section>

        {/* PRÁTICAS DE HOJE */}
        {practices.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10 bg-white rounded-3xl p-6 md:p-7 border border-violet-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-violet-950">7 Práticas de Hoje</h2>
                <p className="text-xs text-gray-500 mt-0.5">{completedCount} de {totalCount} concluídas</p>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-2xl font-bold text-violet-700">
                  {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-violet-100 rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              />
            </div>

            {/* Lista */}
            <ul className="space-y-1">
              {practices.map((p) => (
                <li
                  key={p.code}
                  className={`flex items-center gap-3 py-3 px-3 rounded-xl transition-colors ${
                    p.done ? 'bg-violet-50/50' : 'hover:bg-violet-50/30'
                  }`}
                >
                  {p.done ? (
                    <CheckCircle className="w-5 h-5 text-violet-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  )}
                  <span className={`flex-1 text-sm ${p.done ? 'text-gray-400 line-through' : 'text-violet-950 font-medium'}`}>
                    {p.title}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{p.minutes} min</span>
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${pillarPalette[p.pillar].dot}`} />
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${pillarPalette[p.pillar].text}`}>
                      {pillarPalette[p.pillar].label}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* Vai mais fundo: 4 hubs */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-violet-950 mb-4">Vai mais fundo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { to: '/body', icon: Activity, label: 'Body', sub: 'Treino · Ômega', color: 'bg-emerald-500' },
              { to: '/mind', icon: Brain, label: 'Mind', sub: 'Respiração · Foco', color: 'bg-violet-500' },
              { to: '/spirit', icon: Heart, label: 'Spirit', sub: 'Devocional · Gratidão', color: 'bg-rose-500' },
              { to: '/grow', icon: Sparkles, label: 'Grow', sub: 'Educação · Comunidade', color: 'bg-amber-500' },
            ].map((h, i) => {
              const Icon = h.icon;
              return (
                <motion.button
                  key={h.to}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.04 }}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate(h.to)}
                  className="text-left p-4 rounded-2xl bg-white border border-violet-100 hover:shadow-md transition-all flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-xl ${h.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-violet-950 text-sm">{h.label}</p>
                    <p className="text-[11px] text-gray-500 truncate">{h.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Quote */}
        <motion.section
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="text-center py-8 px-6 rounded-3xl bg-gradient-to-br from-violet-100/40 via-white to-amber-50/40 border border-violet-100"
        >
          <Quote className="w-5 h-5 text-violet-400 mx-auto mb-3" />
          <p className="text-base md:text-lg text-violet-900 font-medium italic max-w-2xl mx-auto leading-relaxed">
            "{todayQuote.text}"
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 mt-3">— {todayQuote.author}</p>
        </motion.section>

        {/* spacer */}
        <div className="h-6" />
      </div>
    </div>
  );
}

function extractMinutes(text: string | undefined): number | null {
  if (!text) return null;
  const m = text.match(/(\d+)\s*min/i);
  return m ? parseInt(m[1], 10) : null;
}

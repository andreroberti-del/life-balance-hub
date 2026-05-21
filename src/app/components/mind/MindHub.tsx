import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Heart, Wind, Smile, Frown, Meh, Zap, CheckCircle, X, Sparkles, Play } from 'lucide-react';
import { useEmotionalCheckin, useBreathingTechniques, logBreathingSession, BreathingTechnique } from '../../hooks/useMindSpirit';
import { useAuth } from '../../contexts/AuthContext';

const moodIcons = [Frown, Frown, Meh, Smile, Smile];
const moodLabels = ['Muito mal', 'Mal', 'Neutro', 'Bem', 'Muito bem'];
const moodColors = ['text-red-500', 'text-orange-500', 'text-amber-500', 'text-emerald-500', 'text-emerald-600'];

const emotionOptions = [
  'Calmo', 'Ansioso', 'Energizado', 'Cansado', 'Grato', 'Frustrado',
  'Focado', 'Disperso', 'Inspirado', 'Sobrecarregado', 'Esperançoso', 'Triste'
];

export function MindHub() {
  const { user } = useAuth();
  const { today, history, loading, submit } = useEmotionalCheckin();
  const { techniques } = useBreathingTechniques();

  const [mood, setMood] = useState<number>(today?.mood ?? 0);
  const [stress, setStress] = useState<number>(today?.stress ?? 0);
  const [anxiety, setAnxiety] = useState<number>(today?.anxiety ?? 0);
  const [energy, setEnergy] = useState<number>(today?.energy ?? 0);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(today?.emotions ?? []);
  const [notes, setNotes] = useState<string>(today?.notes ?? '');
  const [submitted, setSubmitted] = useState(!!today);
  const [activeBreathing, setActiveBreathing] = useState<BreathingTechnique | null>(null);

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
    );
  };

  const handleSubmit = async () => {
    if (mood < 1) return;
    await submit({ mood, stress: stress || null, anxiety: anxiety || null, energy: energy || null, emotions: selectedEmotions, notes });
    setSubmitted(true);
  };

  const handleEdit = () => setSubmitted(false);

  const recentMoods = history.slice(0, 7).reverse();
  const avgMood7d = recentMoods.length > 0
    ? (recentMoods.reduce((s, c) => s + c.mood, 0) / recentMoods.length).toFixed(1)
    : '—';

  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-violet-500 rounded-3xl p-8 md:p-10 mb-8 shadow-xl shadow-violet-500/20"
        >
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-white/80" />
                <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Saúde Mental</p>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">Mind</h1>
              <p className="text-white/85 text-base max-w-xl">
                Check-in emocional diário, respiração guiada, mindfulness.
                A mente forte sustenta o corpo forte.
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-6 py-5 border border-white/20 min-w-[220px]">
              <p className="text-xs text-white/80 font-bold uppercase tracking-wider mb-2">Humor médio (7d)</p>
              <p className="text-4xl font-bold text-white">{avgMood7d}<span className="text-base text-white/60">/5</span></p>
              <p className="text-xs text-white/70 mt-2">{history.length} check-ins totais</p>
            </div>
          </div>
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-12 gap-6">
          {/* CHECK-IN */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-7 border border-violet-100 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-violet-950">Check-in emocional</h2>
                  <p className="text-sm text-gray-500">Como você está hoje?</p>
                </div>
                {submitted && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Hoje registrado
                  </span>
                )}
              </div>

              {loading ? (
                <p className="text-sm text-gray-500 text-center py-8">Carregando...</p>
              ) : (
                <>
                  {/* MOOD 1-5 */}
                  <div className="mb-6">
                    <p className="text-sm font-bold text-violet-950 mb-3">Humor geral</p>
                    <div className="grid grid-cols-5 gap-2">
                      {moodIcons.map((Icon, i) => {
                        const value = i + 1;
                        const isSelected = mood === value;
                        return (
                          <button
                            key={i}
                            onClick={() => !submitted && setMood(value)}
                            disabled={submitted}
                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                              isSelected ? 'bg-violet-500 border-violet-500 shadow-md' : 'bg-violet-50 border-violet-100 hover:border-violet-300'
                            } ${submitted ? 'opacity-70 cursor-default' : ''}`}
                          >
                            <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : moodColors[i]}`} strokeWidth={2} />
                            <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-violet-950'}`}>{moodLabels[i]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SLIDERS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Estresse', value: stress, setter: setStress, color: 'amber' },
                      { label: 'Ansiedade', value: anxiety, setter: setAnxiety, color: 'red' },
                      { label: 'Energia', value: energy, setter: setEnergy, color: 'emerald' },
                    ].map((m) => (
                      <div key={m.label} className="p-4 bg-violet-50 rounded-2xl border border-violet-100">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold text-violet-950">{m.label}</p>
                          <p className="text-sm font-bold text-violet-700">{m.value || '–'}/5</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              onClick={() => !submitted && m.setter(n)}
                              disabled={submitted}
                              className={`flex-1 h-2 rounded-full transition-all ${
                                n <= m.value ? 'bg-violet-500' : 'bg-violet-200 hover:bg-violet-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* EMOTIONS */}
                  <div className="mb-6">
                    <p className="text-sm font-bold text-violet-950 mb-3">O que você está sentindo?</p>
                    <div className="flex flex-wrap gap-2">
                      {emotionOptions.map((e) => {
                        const isSelected = selectedEmotions.includes(e);
                        return (
                          <button
                            key={e}
                            onClick={() => !submitted && toggleEmotion(e)}
                            disabled={submitted}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                              isSelected
                                ? 'bg-violet-500 text-white shadow-md'
                                : 'bg-violet-50 text-violet-700 border border-violet-200 hover:border-violet-300'
                            }`}
                          >
                            {e}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* NOTES */}
                  <div className="mb-6">
                    <p className="text-sm font-bold text-violet-950 mb-2">Notas (opcional)</p>
                    <textarea
                      value={notes}
                      onChange={(e) => !submitted && setNotes(e.target.value)}
                      disabled={submitted}
                      placeholder="O que está te ocupando? Tudo o que vier..."
                      rows={3}
                      className="w-full p-4 rounded-2xl border-2 border-violet-100 focus:border-violet-500 focus:outline-none text-violet-950 placeholder:text-gray-400 disabled:bg-violet-50/30"
                    />
                  </div>

                  {submitted ? (
                    <button
                      onClick={handleEdit}
                      className="w-full py-3 bg-violet-100 text-violet-700 font-bold rounded-2xl hover:bg-violet-200 transition-all"
                    >
                      Editar registro de hoje
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={mood < 1}
                      className="w-full py-4 bg-violet-500 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 hover:bg-violet-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Salvar check-in (+15 XP)
                    </button>
                  )}
                </>
              )}
            </div>

            {/* HISTORY */}
            <div className="bg-white rounded-3xl p-7 border border-violet-100 shadow-lg">
              <h2 className="text-xl font-bold text-violet-950 mb-5">Últimos 7 dias</h2>
              {recentMoods.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">Comece a registrar pra ver seu histórico.</p>
              ) : (
                <div className="flex items-end gap-2 h-32">
                  {recentMoods.map((c) => {
                    const heightPct = (c.mood / 5) * 100;
                    const Icon = moodIcons[c.mood - 1];
                    return (
                      <div key={c.id} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-violet-100 rounded-t-xl flex items-end" style={{ height: '100%' }}>
                          <div
                            className="w-full rounded-t-xl bg-gradient-to-t from-violet-500 to-violet-400"
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <Icon className={`w-4 h-4 ${moodColors[c.mood - 1]}`} />
                        <p className="text-[10px] text-gray-500 font-semibold">{new Date(c.check_date).toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* BREATHING */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-7 border border-violet-100 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Wind className="w-6 h-6 text-violet-500" />
                <h2 className="text-xl font-bold text-violet-950">Respiração guiada</h2>
              </div>
              <p className="text-sm text-gray-500 mb-5">Técnicas curtas, comprovadas, que mudam seu estado em minutos.</p>

              <div className="space-y-3">
                {techniques.map((t) => (
                  <motion.button
                    key={t.id}
                    whileHover={{ x: 2 }}
                    onClick={() => setActiveBreathing(t)}
                    className="w-full text-left p-4 bg-violet-50 rounded-2xl border border-violet-100 hover:border-violet-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Play className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-violet-950 truncate">{t.name_pt}</p>
                        <p className="text-xs text-gray-500">{t.recommended_cycles} ciclos · {Math.round((t.recommended_cycles * (t.inhale_seconds + t.hold_seconds + t.exhale_seconds + t.hold_after_exhale_seconds)) / 60)} min</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-2">{t.description_pt}</p>
                    {t.best_for_pt && (
                      <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wider">Ideal para: {t.best_for_pt}</p>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden bg-violet-500 rounded-3xl p-6 shadow-lg shadow-violet-500/20">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <Sparkles className="w-7 h-7 text-yellow-300 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Mente forte, corpo forte</h3>
                <p className="text-sm text-white/85">
                  A inflamação não vive só na bioquímica. Estresse crônico eleva cortisol,
                  que eleva inflamação, que reduz ômega 3 nas membranas. Cuidar da mente é
                  parte do método OAM.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BREATHING MODAL */}
        <AnimatePresence>
          {activeBreathing && (
            <BreathingPlayer
              technique={activeBreathing}
              userId={user?.id}
              onClose={() => setActiveBreathing(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BreathingPlayer({
  technique, userId, onClose,
}: { technique: BreathingTechnique; userId: string | undefined; onClose: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale' | 'hold-out' | 'done'>('idle');
  const [cycle, setCycle] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const start = () => {
    setCycle(1);
    setPhase('inhale');
    setSecondsLeft(technique.inhale_seconds);
  };

  // Cycle logic
  useState(() => {
    if (phase === 'idle' || phase === 'done') return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Transition to next phase
        setPhase((p) => {
          if (p === 'inhale') {
            if (technique.hold_seconds > 0) { setSecondsLeft(technique.hold_seconds); return 'hold'; }
            setSecondsLeft(technique.exhale_seconds); return 'exhale';
          }
          if (p === 'hold') { setSecondsLeft(technique.exhale_seconds); return 'exhale'; }
          if (p === 'exhale') {
            if (technique.hold_after_exhale_seconds > 0) { setSecondsLeft(technique.hold_after_exhale_seconds); return 'hold-out'; }
            const next = cycle + 1;
            if (next > technique.recommended_cycles) { setSecondsLeft(0); return 'done'; }
            setCycle(next); setSecondsLeft(technique.inhale_seconds); return 'inhale';
          }
          if (p === 'hold-out') {
            const next = cycle + 1;
            if (next > technique.recommended_cycles) { setSecondsLeft(0); return 'done'; }
            setCycle(next); setSecondsLeft(technique.inhale_seconds); return 'inhale';
          }
          return p;
        });
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  });

  const finish = async () => {
    if (userId && cycle > 1) {
      const duration = cycle * (technique.inhale_seconds + technique.hold_seconds + technique.exhale_seconds + technique.hold_after_exhale_seconds);
      await logBreathingSession(userId, technique.slug, cycle, duration);
    }
    onClose();
  };

  const phaseLabel = {
    idle: 'Pronto?',
    inhale: 'Inspire',
    hold: 'Segure',
    exhale: 'Expire',
    'hold-out': 'Vazio',
    done: 'Completo',
  }[phase];

  const phaseColor = {
    idle: 'bg-violet-500',
    inhale: 'bg-emerald-500',
    hold: 'bg-amber-500',
    exhale: 'bg-violet-500',
    'hold-out': 'bg-slate-600',
    done: 'bg-emerald-500',
  }[phase];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-violet-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }} animate={{ scale: 1 }}
        className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-violet-950">{technique.name_pt}</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center hover:bg-violet-100">
            <X className="w-4 h-4 text-violet-700" />
          </button>
        </div>

        <div className="flex flex-col items-center py-8">
          <motion.div
            key={phase}
            initial={{ scale: phase === 'inhale' ? 0.7 : phase === 'exhale' ? 1.2 : 1 }}
            animate={{ scale: phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.7 : 1 }}
            transition={{ duration: phase === 'inhale' ? technique.inhale_seconds : phase === 'exhale' ? technique.exhale_seconds : 0.4, ease: 'easeInOut' }}
            className={`w-48 h-48 rounded-full ${phaseColor} shadow-2xl flex items-center justify-center mb-6 transition-colors duration-500`}
          >
            <div className="text-center">
              <p className="text-5xl font-bold text-white">{secondsLeft || '·'}</p>
            </div>
          </motion.div>

          <p className="text-2xl font-bold text-violet-950 mb-1">{phaseLabel}</p>
          {phase !== 'idle' && phase !== 'done' && (
            <p className="text-sm text-gray-500">Ciclo {cycle} / {technique.recommended_cycles}</p>
          )}
        </div>

        {phase === 'idle' && (
          <button
            onClick={start}
            className="w-full py-4 bg-violet-500 text-white font-bold rounded-2xl hover:bg-violet-600 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" /> Começar ({technique.recommended_cycles} ciclos)
          </button>
        )}
        {phase === 'done' && (
          <div className="text-center">
            <p className="text-emerald-700 font-bold mb-4 flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> +10 XP ganhos
            </p>
            <button
              onClick={finish}
              className="w-full py-4 bg-violet-500 text-white font-bold rounded-2xl hover:bg-violet-600 transition-all"
            >
              Fechar
            </button>
          </div>
        )}
        {phase !== 'idle' && phase !== 'done' && (
          <button
            onClick={finish}
            className="w-full py-3 bg-violet-100 text-violet-700 font-bold rounded-2xl hover:bg-violet-200 transition-all"
          >
            Parar
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

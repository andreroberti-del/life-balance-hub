import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, Circle, Clock, Flame, Dumbbell, Zap,
  Share2, Sparkles, Trophy, X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkoutSession, toggleExercise, shareWorkoutToCommunity } from '../../hooks/useWorkoutPlan';
import { supabase } from '../../services/supabase';
import { ZenoMascot } from '../zeno/ZenoMascot';
import { toastSuccess, toastInfo, toastXP } from '../ui/feedback';

export function WorkoutSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { session, exerciseLogs, loading, refetch } = useWorkoutSession(sessionId ?? null);
  const [dayInfo, setDayInfo] = useState<{
    name_pt: string;
    focus_pt: string;
    duration_minutes: number;
    estimated_calories: number;
  } | null>(null);
  const [planExercises, setPlanExercises] = useState<Array<{
    name_pt: string;
    sets: number;
    reps: string;
    rest_seconds: number;
    suggested_weight_pt: string;
    how_to_pt: string;
    muscle_groups: string[];
  }>>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [showShareInput, setShowShareInput] = useState(false);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data: plan } = await supabase
        .from('workout_plans')
        .select('plan_json')
        .eq('id', session.plan_id)
        .maybeSingle();

      const day = plan?.plan_json?.days?.find(
        (d: { day_of_week: string }) => d.day_of_week === session.day_of_week
      );
      if (day) {
        setDayInfo({
          name_pt: day.name_pt,
          focus_pt: day.focus_pt,
          duration_minutes: day.duration_minutes,
          estimated_calories: day.estimated_calories,
        });
        setPlanExercises(day.exercises ?? []);
      }
    })();
  }, [session]);

  const handleToggle = async (idx: number) => {
    if (!user?.id || !sessionId) return;
    const result = await toggleExercise(user.id, sessionId, idx);
    await refetch();
    if (result?.session_completed && result.xp_awarded > 0) {
      setShowCelebration(true);
      toastXP({
        xp: result.xp_awarded,
        reason: `Treino ${session?.day_of_week} concluído`,
      });
    }
  };

  const handleShare = async () => {
    if (!user?.id || !sessionId || sharing) return;
    setSharing(true);
    const result = await shareWorkoutToCommunity(user.id, sessionId, shareMessage || undefined);
    setSharing(false);
    if (result?.post_id) {
      toastSuccess('Compartilhado!', 'Seu treino apareceu no feed da comunidade.');
      setShowShareInput(false);
      setShowCelebration(false);
      await refetch();
    } else {
      toastInfo('Já compartilhado', 'Esse treino já está no feed.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center text-gray-500">
        Carregando treino...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Sessão não encontrada</p>
          <button
            onClick={() => navigate('/workout')}
            className="px-6 py-3 bg-violet-500 text-white rounded-2xl font-bold"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const dayLabel = {
    monday: 'Segunda', tuesday: 'Terça', wednesday: 'Quarta',
    thursday: 'Quinta', friday: 'Sexta', saturday: 'Sábado', sunday: 'Domingo',
  }[session.day_of_week] ?? session.day_of_week;

  const progressPct = session.total_exercises > 0
    ? Math.round((session.completed_exercises / session.total_exercises) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-8 md:py-10">

        <button
          onClick={() => navigate('/workout')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Planner
        </button>

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-violet-500 rounded-3xl p-8 md:p-10 mb-8 shadow-xl shadow-violet-500/20"
        >
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-5">
              <ZenoMascot pose="workout" size="lg" className="hidden md:block flex-shrink-0" />
              <div>
                <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-2">{dayLabel}</p>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                  {dayInfo?.name_pt ?? 'Treino'}
                </h1>
                {dayInfo?.focus_pt && (
                  <p className="text-white/85 text-base max-w-xl">{dayInfo.focus_pt}</p>
                )}
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-6 py-5 border border-white/20 min-w-[220px]">
              <p className="text-xs text-white/80 font-bold uppercase tracking-wider mb-2">Progresso</p>
              <p className="text-4xl font-bold text-white mb-2">
                {session.completed_exercises}<span className="text-base text-white/60">/{session.total_exercises}</span>
              </p>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full rounded-full ${
                    progressPct === 100 ? 'bg-yellow-300' : 'bg-white'
                  }`}
                />
              </div>
            </div>
          </div>

          {dayInfo && (
            <div className="relative mt-6 flex items-center gap-4 flex-wrap">
              <div className="bg-white/15 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-2 text-white text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>{dayInfo.duration_minutes} min</span>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-2 text-white text-xs">
                <Flame className="w-3.5 h-3.5" />
                <span>{dayInfo.estimated_calories} kcal</span>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-2 text-white text-xs">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>{session.total_exercises} exercícios</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* EXERCISE LIST */}
        <div className="space-y-3 mb-8">
          {exerciseLogs.map((log, i) => {
            const planned = planExercises[i];
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`rounded-3xl border-2 p-5 transition-all ${
                  log.is_completed
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-white border-violet-100 hover:border-violet-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggle(i)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                      log.is_completed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-violet-100 text-violet-500 hover:bg-violet-500 hover:text-white'
                    }`}
                  >
                    {log.is_completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className={`text-lg font-bold ${log.is_completed ? 'text-emerald-900 line-through' : 'text-violet-950'}`}>
                          {log.exercise_name}
                        </p>
                        {planned?.muscle_groups && planned.muscle_groups.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {planned.muscle_groups.map((m) => (
                              <span key={m} className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                {m}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-bold text-violet-950">{log.planned_sets || planned?.sets}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">séries</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="bg-violet-50 rounded-xl p-2 border border-violet-100">
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Reps</p>
                        <p className="text-sm font-bold text-violet-950">{log.planned_reps || planned?.reps}</p>
                      </div>
                      {planned?.rest_seconds && (
                        <div className="bg-violet-50 rounded-xl p-2 border border-violet-100">
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Descanso</p>
                          <p className="text-sm font-bold text-violet-950">{planned.rest_seconds}s</p>
                        </div>
                      )}
                      {planned?.suggested_weight_pt && (
                        <div className="bg-violet-50 rounded-xl p-2 border border-violet-100 col-span-2">
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Carga</p>
                          <p className="text-sm font-bold text-violet-950 truncate">{planned.suggested_weight_pt}</p>
                        </div>
                      )}
                    </div>

                    {planned?.how_to_pt && (
                      <p className="text-xs text-gray-600 leading-relaxed">{planned.how_to_pt}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* SHARE BAR (always visible) */}
        {session.status === 'completed' && !session.shared_to_community && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-5 border border-violet-100 shadow-lg mb-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="font-bold text-violet-950 text-sm">Compartilhe na comunidade</p>
                <p className="text-xs text-gray-500">Inspire alguém. Sua jornada importa.</p>
              </div>
            </div>
            <button
              onClick={() => setShowShareInput(true)}
              className="px-4 py-2 bg-violet-500 text-white text-sm font-bold rounded-xl hover:bg-violet-600 transition-colors"
            >
              Compartilhar
            </button>
          </motion.div>
        )}
      </div>

      {/* COMPLETION MODAL */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-violet-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center"
            >
              <button
                onClick={() => setShowCelebration(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center hover:bg-violet-100"
              >
                <X className="w-4 h-4 text-violet-700" />
              </button>
              <ZenoMascot pose="celebrate" size="xl" className="mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-violet-950 mb-2">Treino concluído!</h2>
              <p className="text-gray-600 mb-6">
                Você completou todos os exercícios. ZENO está orgulhoso.
              </p>
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 mb-6 flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <p className="text-yellow-900 font-bold">XP ganho no toast acima</p>
              </div>

              {!showShareInput ? (
                <>
                  <button
                    onClick={() => setShowShareInput(true)}
                    className="w-full py-4 bg-violet-500 text-white font-bold rounded-2xl hover:bg-violet-600 transition-all shadow-lg shadow-violet-500/20 mb-2 flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Compartilhar com a comunidade
                  </button>
                  <button
                    onClick={() => setShowCelebration(false)}
                    className="w-full py-3 bg-violet-50 text-violet-700 font-bold rounded-2xl hover:bg-violet-100 transition-all"
                  >
                    Fechar
                  </button>
                </>
              ) : (
                <>
                  <textarea
                    value={shareMessage}
                    onChange={(e) => setShareMessage(e.target.value)}
                    rows={3}
                    placeholder="Conta como foi (opcional)..."
                    className="w-full p-3 rounded-xl border-2 border-violet-100 focus:border-violet-500 focus:outline-none text-violet-950 text-sm mb-3 resize-none"
                  />
                  <button
                    onClick={handleShare}
                    disabled={sharing}
                    className="w-full py-4 bg-violet-500 text-white font-bold rounded-2xl hover:bg-violet-600 transition-all disabled:opacity-50 mb-2"
                  >
                    {sharing ? 'Publicando...' : 'Publicar'}
                  </button>
                  <button
                    onClick={() => setShowShareInput(false)}
                    className="w-full py-3 bg-violet-50 text-violet-700 font-bold rounded-2xl hover:bg-violet-100"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

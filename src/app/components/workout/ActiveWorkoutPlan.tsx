import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Dumbbell, Clock, Flame, ChevronRight, RefreshCw, CheckCircle, Circle, Sparkles, Calendar,
} from 'lucide-react';
import { useActiveWorkoutPlan, startSession } from '../../hooks/useWorkoutPlan';
import { useAuth } from '../../contexts/AuthContext';
import { toastInfo, toastError } from '../ui/feedback';

interface ActiveWorkoutPlanProps {
  onRegenerate?: () => void;
}

const dayLabels: Record<string, string> = {
  monday: 'Segunda', tuesday: 'Terça', wednesday: 'Quarta',
  thursday: 'Quinta', friday: 'Sexta', saturday: 'Sábado', sunday: 'Domingo',
};

const todayCode = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
};

export function ActiveWorkoutPlan({ onRegenerate }: ActiveWorkoutPlanProps) {
  const { user } = useAuth();
  const { plan, todaySessions, loading, refetch } = useActiveWorkoutPlan();
  const navigate = useNavigate();
  const today = todayCode();

  const handleStartDay = async (dayOfWeek: string) => {
    if (!user?.id || !plan) return;
    const result = await startSession(user.id, plan.id, dayOfWeek);
    if (result?.session_id) {
      navigate(`/workout/session/${result.session_id}`);
    } else {
      toastError('Erro', result?.status || 'Não foi possível iniciar a sessão.');
    }
    await refetch();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-7 border border-violet-100 shadow-lg animate-pulse">
        <div className="h-6 w-40 bg-violet-100 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 bg-violet-50 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-violet-100 shadow-lg text-center">
        <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Dumbbell className="w-8 h-8 text-violet-500" />
        </div>
        <h3 className="text-xl font-bold text-violet-950 mb-2">Você ainda não tem plano ativo</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
          Selecione um objetivo acima e ZENO gera um plano personalizado pra você em segundos.
        </p>
      </div>
    );
  }

  const planJson = plan.plan_json;

  return (
    <div className="bg-white rounded-3xl p-7 border border-violet-100 shadow-lg">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-500">
              Plano ativo · {plan.generated_by === 'gemini' ? 'Gemini' : plan.generated_by}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-violet-950">{planJson?.name_pt ?? 'Plano de Treino'}</h3>
          {planJson?.weekly_summary_pt && (
            <p className="text-sm text-gray-500 max-w-2xl mt-1">{planJson.weekly_summary_pt}</p>
          )}
        </div>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-4 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold rounded-xl transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regerar plano
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {planJson?.days?.map((day, i) => {
          const session = todaySessions.get(`${plan.id}_${day.day_of_week}`);
          const isToday = day.day_of_week === today;
          const isCompleted = session?.status === 'completed';
          const isInProgress = session?.status === 'in_progress' && (session?.completed_exercises ?? 0) > 0;
          const progress = session && session.total_exercises > 0
            ? Math.round((session.completed_exercises / session.total_exercises) * 100)
            : 0;

          return (
            <motion.button
              key={day.day_of_week}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              onClick={() => handleStartDay(day.day_of_week)}
              className={`text-left p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${
                isToday
                  ? 'bg-violet-500 border-violet-500 shadow-lg shadow-violet-500/20 text-white'
                  : isCompleted
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-violet-50 border-violet-100 hover:border-violet-300 hover:shadow-md'
              }`}
            >
              {isToday && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 bg-yellow-400 text-violet-950 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Hoje
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isToday ? 'bg-white/20' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-violet-500 text-white'
                }`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Dumbbell className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold uppercase tracking-wider ${
                    isToday ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {dayLabels[day.day_of_week] ?? day.day_of_week}
                  </p>
                  <p className={`font-bold truncate ${isToday ? 'text-white' : 'text-violet-950'}`}>
                    {day.name_pt}
                  </p>
                </div>
              </div>

              {day.focus_pt && (
                <p className={`text-xs leading-relaxed mb-3 line-clamp-2 ${
                  isToday ? 'text-white/85' : 'text-gray-600'
                }`}>
                  {day.focus_pt}
                </p>
              )}

              <div className="flex items-center gap-3 text-xs mb-3">
                <div className={`flex items-center gap-1 ${isToday ? 'text-white/70' : 'text-gray-500'}`}>
                  <Dumbbell className="w-3 h-3" /> {day.exercises?.length ?? 0}
                </div>
                <div className={`flex items-center gap-1 ${isToday ? 'text-white/70' : 'text-gray-500'}`}>
                  <Clock className="w-3 h-3" /> {day.duration_minutes}min
                </div>
                <div className={`flex items-center gap-1 ${isToday ? 'text-white/70' : 'text-gray-500'}`}>
                  <Flame className="w-3 h-3" /> {day.estimated_calories}
                </div>
              </div>

              {(session || isToday) && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className={isToday ? 'text-white/80' : 'text-gray-500'}>Progresso</span>
                    <span className={isToday ? 'text-white' : isCompleted ? 'text-emerald-700' : 'text-violet-700'}>
                      {session?.completed_exercises ?? 0}/{session?.total_exercises ?? day.exercises?.length ?? 0}
                    </span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${isToday ? 'bg-white/20' : 'bg-violet-100'}`}>
                    <div
                      className={`h-full rounded-full transition-all ${
                        isToday ? 'bg-yellow-300' : isCompleted ? 'bg-emerald-500' : 'bg-violet-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {isInProgress && (
                    <p className={`text-[10px] ${isToday ? 'text-white/80' : 'text-violet-600'} font-semibold`}>
                      Continuar treino ↗
                    </p>
                  )}
                  {isCompleted && !isToday && (
                    <p className="text-[10px] text-emerald-700 font-semibold">Concluído hoje</p>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {planJson?.zeno_tip_pt && (
        <div className="mt-6 p-4 bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl shadow-lg shadow-violet-500/20 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">Dica do ZENO</p>
            <p className="text-sm text-white leading-relaxed">{planJson.zeno_tip_pt}</p>
          </div>
        </div>
      )}
    </div>
  );
}

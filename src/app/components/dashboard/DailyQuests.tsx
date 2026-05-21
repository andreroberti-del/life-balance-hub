import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Wind, Heart, BookOpen, GraduationCap, Pill, Droplet, Activity,
  CheckCircle, ChevronRight, Sparkles, Zap, Target
} from 'lucide-react';
import { useDailyQuests, DailyQuest } from '../../hooks/useDailyQuests';
import { toastSuccess } from '../ui/feedback';

const iconMap: Record<string, typeof Brain> = {
  Brain, Wind, Heart, BookOpen, GraduationCap, Pill, Droplet, Activity, Target,
};

const categoryRoute: Record<string, string> = {
  emotional_checkin: '/mind',
  breathing_session: '/mind',
  gratitude_entry: '/spirit',
  devotional_read: '/spirit',
  lesson_complete: '/education',
  omega_taken: '/daily-tracker',
  water_goal: '/daily-tracker',
  movement: '/workout',
};

const categoryAccent: Record<string, string> = {
  body: 'bg-emerald-100 text-emerald-700',
  mind: 'bg-violet-100 text-violet-700',
  spirit: 'bg-amber-100 text-amber-700',
  learn: 'bg-blue-100 text-blue-700',
  social: 'bg-rose-100 text-rose-700',
};

export function DailyQuests() {
  const { quests, loading, completedCount, totalCount, progressPct, completeQuest } = useDailyQuests();
  const navigate = useNavigate();

  const handleClick = (quest: DailyQuest) => {
    const route = categoryRoute[quest.quest_code];
    if (route) navigate(route);
  };

  const handleQuickComplete = async (e: React.MouseEvent, quest: DailyQuest) => {
    e.stopPropagation();
    const result = await completeQuest(quest.quest_code);
    if (result?.daily_complete && result?.bonus_xp > 0) {
      toastSuccess('Dia completo!', `+${result.bonus_xp} XP bonus por todas as quests`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center shadow-md shadow-yellow-400/30">
              <Target className="w-5 h-5 text-violet-950" strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-bold text-violet-950">Quests de Hoje</h3>
          </div>
          <p className="text-xs text-gray-500">3 micro-objetivos. Complete todos pra bonus.</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-violet-950">{completedCount}<span className="text-base text-gray-400">/{totalCount}</span></p>
          {completedCount === totalCount && totalCount > 0 ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-end">
              <Sparkles className="w-3 h-3" /> Completo!
            </span>
          ) : (
            <p className="text-xs text-gray-500">{progressPct}%</p>
          )}
        </div>
      </div>

      <div className="h-2 bg-violet-100 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full ${
            progressPct === 100
              ? 'bg-gradient-to-r from-emerald-500 to-yellow-400'
              : 'bg-gradient-to-r from-violet-500 to-yellow-400'
          }`}
        />
      </div>

      {loading ? (
        <p className="text-xs text-gray-500 text-center py-4">Carregando quests...</p>
      ) : quests.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-4">Sem quests configuradas.</p>
      ) : (
        <div className="space-y-2">
          {quests.map((q, i) => {
            const Icon = iconMap[q.icon_name] ?? Target;
            const accent = categoryAccent[q.category];
            return (
              <motion.button
                key={q.quest_code}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.1 }}
                whileHover={!q.is_completed ? { x: 3 } : {}}
                onClick={() => handleClick(q)}
                className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all ${
                  q.is_completed
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'bg-violet-50 border border-violet-100 hover:border-violet-300 hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  q.is_completed ? 'bg-emerald-500' : 'bg-violet-500'
                }`}>
                  {q.is_completed ? (
                    <CheckCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
                  ) : (
                    <Icon className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-bold truncate ${q.is_completed ? 'text-emerald-900 line-through' : 'text-violet-950'}`}>
                      {q.title_pt}
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex-shrink-0 ${accent}`}>
                      {q.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 truncate">{q.description_pt}</span>
                    <span className="text-xs font-bold text-yellow-600 flex items-center gap-0.5 flex-shrink-0">
                      <Zap className="w-3 h-3" />+{q.xp_reward}
                    </span>
                  </div>
                </div>
                {!q.is_completed && (
                  <button
                    onClick={(e) => handleQuickComplete(e, q)}
                    className="text-xs font-bold text-violet-600 hover:text-violet-800 px-2 py-1 rounded-lg hover:bg-violet-100 transition-colors flex-shrink-0"
                    title="Marcar como completa"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

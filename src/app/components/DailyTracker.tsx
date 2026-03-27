import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Droplet,
  Pill,
  Camera,
  Footprints,
  Moon,
  Check,
  Plus,
  Minus,
  Bell,
  TrendingUp,
  Award,
  Flame
} from 'lucide-react';

interface DailyTask {
  id: string;
  icon: React.ReactNode;
  name_en: string;
  name_pt: string;
  name_es: string;
  type: 'counter' | 'boolean' | 'range';
  currentValue: number;
  targetValue: number;
  unit_en: string;
  unit_pt: string;
  unit_es: string;
  color: string;
  xpReward: number;
  reminder?: string;
}

interface DailyTrackerProps {
  currentStreak?: number;
  onStreakUpdate?: (newStreak: number) => void;
}

export function DailyTracker({ currentStreak = 23, onStreakUpdate }: DailyTrackerProps) {
  const { t, language } = useLanguage();

  const [tasks, setTasks] = useState<DailyTask[]>([
    {
      id: 'water',
      icon: <Droplet className="w-5 h-5" />,
      name_en: 'Water Intake',
      name_pt: 'Ingest\u00E3o de \u00C1gua',
      name_es: 'Ingesta de Agua',
      type: 'counter',
      currentValue: 6,
      targetValue: 8,
      unit_en: 'glasses',
      unit_pt: 'copos',
      unit_es: 'vasos',
      color: '#3B82F6',
      xpReward: 10,
      reminder: '09:00, 12:00, 15:00, 18:00',
    },
    {
      id: 'omega3',
      icon: <Pill className="w-5 h-5" />,
      name_en: 'Omega-3 Supplement',
      name_pt: 'Suplemento Omega-3',
      name_es: 'Suplemento Omega-3',
      type: 'boolean',
      currentValue: 1,
      targetValue: 1,
      unit_en: 'taken',
      unit_pt: 'tomado',
      unit_es: 'tomado',
      color: '#D4FF00',
      xpReward: 20,
      reminder: '08:00',
    },
    {
      id: 'meals',
      icon: <Camera className="w-5 h-5" />,
      name_en: 'Meal Scans',
      name_pt: 'Scans de Refei\u00E7\u00F5es',
      name_es: 'Escaneos de Comidas',
      type: 'counter',
      currentValue: 2,
      targetValue: 3,
      unit_en: 'meals',
      unit_pt: 'refei\u00E7\u00F5es',
      unit_es: 'comidas',
      color: '#F59E0B',
      xpReward: 15,
      reminder: '12:00, 19:00',
    },
    {
      id: 'movement',
      icon: <Footprints className="w-5 h-5" />,
      name_en: 'Movement',
      name_pt: 'Movimento',
      name_es: 'Movimiento',
      type: 'range',
      currentValue: 7500,
      targetValue: 10000,
      unit_en: 'steps',
      unit_pt: 'passos',
      unit_es: 'pasos',
      color: '#10B981',
      xpReward: 25,
    },
    {
      id: 'sleep',
      icon: <Moon className="w-5 h-5" />,
      name_en: 'Sleep Quality',
      name_pt: 'Qualidade do Sono',
      name_es: 'Calidad del Sue\u00F1o',
      type: 'range',
      currentValue: 7.5,
      targetValue: 8,
      unit_en: 'hours',
      unit_pt: 'horas',
      unit_es: 'horas',
      color: '#8B5CF6',
      xpReward: 30,
    },
  ]);

  const [showReminders, setShowReminders] = useState(false);

  const getTaskName = (task: DailyTask) => {
    return task[`name_${language}` as keyof DailyTask] as string;
  };

  const getTaskUnit = (task: DailyTask) => {
    return task[`unit_${language}` as keyof DailyTask] as string;
  };

  const updateTaskValue = (taskId: string, delta: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newValue = Math.max(0, Math.min(task.targetValue * 1.5, task.currentValue + delta));
        return { ...task, currentValue: newValue };
      }
      return task;
    }));
  };

  const toggleBooleanTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId && task.type === 'boolean') {
        return { ...task, currentValue: task.currentValue === 0 ? 1 : 0 };
      }
      return task;
    }));
  };

  const completedTasks = tasks.filter(t => t.currentValue >= t.targetValue).length;
  const totalTasks = tasks.length;
  const completionPercentage = (completedTasks / totalTasks) * 100;
  const isPerfectDay = completedTasks === totalTasks;

  const totalXP = tasks.reduce((sum, task) => {
    return sum + (task.currentValue >= task.targetValue ? task.xpReward : 0);
  }, 0);

  const potentialXP = tasks.reduce((sum, task) => sum + task.xpReward, 0);

  return (
    <div className="space-y-6">
      {/* Header Card with Overall Progress */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#242424] rounded-3xl p-6 border border-white/10 relative overflow-hidden">
        {/* Background Glow Effect */}
        {isPerfectDay && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4FF00]/20 rounded-full blur-3xl animate-pulse" />
        )}

        <div className="relative z-10">
          {/* Top Section: Streak + Date */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {language === 'pt' ? 'Rastreador Di\u00E1rio' : language === 'es' ? 'Rastreador Diario' : 'Daily Tracker'}
              </h2>
              <p className="text-sm text-gray-400">
                {new Date().toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Streak Display */}
            <div className="flex items-center gap-3 bg-[#2A2A2A] rounded-2xl px-4 py-3">
              <div className="text-2xl animate-pulse">{'\u{1F525}'}</div>
              <div>
                <div className="text-2xl font-bold text-[#D4FF00]">{currentStreak}</div>
                <div className="text-xs text-gray-400">
                  {language === 'pt' ? 'dias' : language === 'es' ? 'd\u00EDas' : 'days'}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Ring + Stats */}
          <div className="flex items-center gap-6 mb-6">
            {/* Circular Progress */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#D4FF00"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - completionPercentage / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-[#D4FF00]">{Math.round(completionPercentage)}%</div>
                <div className="text-xs text-gray-400">{language === 'pt' ? 'completo' : language === 'es' ? 'completo' : 'complete'}</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-[#2A2A2A] rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">
                  {language === 'pt' ? 'Tarefas' : language === 'es' ? 'Tareas' : 'Tasks'}
                </div>
                <div className="text-2xl font-bold text-white">
                  {completedTasks}/{totalTasks}
                </div>
              </div>
              <div className="bg-[#2A2A2A] rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">XP {language === 'pt' ? 'Ganho' : language === 'es' ? 'Ganado' : 'Earned'}</div>
                <div className="text-2xl font-bold text-[#D4FF00]">
                  {totalXP}<span className="text-sm text-gray-400">/{potentialXP}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Perfect Day Banner */}
          {isPerfectDay && (
            <div className="bg-gradient-to-r from-[#D4FF00]/20 to-transparent rounded-xl p-4 border-l-4 border-[#D4FF00]">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-[#D4FF00]" />
                <div>
                  <div className="text-sm font-bold text-[#D4FF00]">
                    {language === 'pt' ? '\u{1F389} Dia Perfeito!' : language === 'es' ? '\u{1F389} \u00A1D\u00EDa Perfecto!' : '\u{1F389} Perfect Day!'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {language === 'pt'
                      ? `+${potentialXP} XP + B\u00F4nus de Sequ\u00EAncia`
                      : language === 'es'
                      ? `+${potentialXP} XP + Bono de Racha`
                      : `+${potentialXP} XP + Streak Bonus`}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="bg-[#242424] rounded-3xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">
            {language === 'pt' ? 'H\u00E1bitos Di\u00E1rios' : language === 'es' ? 'H\u00E1bitos Diarios' : 'Daily Habits'}
          </h3>
          <button
            onClick={() => setShowReminders(!showReminders)}
            className="flex items-center gap-2 px-3 py-2 bg-[#2A2A2A] hover:bg-[#333333] rounded-xl transition-colors text-sm text-gray-300"
          >
            <Bell className="w-4 h-4" />
            {language === 'pt' ? 'Lembretes' : language === 'es' ? 'Recordatorios' : 'Reminders'}
          </button>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => {
            const isComplete = task.currentValue >= task.targetValue;
            const progress = Math.min((task.currentValue / task.targetValue) * 100, 100);

            return (
              <div
                key={task.id}
                className={`bg-[#2A2A2A] rounded-2xl p-5 border-2 transition-all ${
                  isComplete ? 'border-[#D4FF00] bg-[#D4FF00]/5' : 'border-transparent hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${task.color}20`, color: task.color }}
                    >
                      {task.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{getTaskName(task)}</h4>
                      {task.reminder && showReminders && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Bell className="w-3 h-3" />
                          {task.reminder}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* XP Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isComplete ? 'bg-[#D4FF00] text-[#1A1A1A]' : 'bg-[#333333] text-gray-500'
                  }`}>
                    +{task.xpReward} XP
                  </div>
                </div>

                {/* Task Controls */}
                {task.type === 'boolean' ? (
                  <button
                    onClick={() => toggleBooleanTask(task.id)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      isComplete
                        ? 'bg-[#D4FF00] text-[#1A1A1A] hover:bg-[#E5FF33]'
                        : 'bg-[#333333] text-gray-300 hover:bg-[#3A3A3A]'
                    }`}
                  >
                    {isComplete ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" />
                        {language === 'pt' ? 'Completo' : language === 'es' ? 'Completo' : 'Complete'}
                      </span>
                    ) : (
                      language === 'pt' ? 'Marcar como Feito' : language === 'es' ? 'Marcar como Hecho' : 'Mark as Done'
                    )}
                  </button>
                ) : task.type === 'counter' ? (
                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%`, backgroundColor: task.color }}
                      />
                    </div>

                    {/* Counter Controls */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => updateTaskValue(task.id, -1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#333333] hover:bg-[#3A3A3A] text-white transition-colors"
                        disabled={task.currentValue === 0}
                      >
                        <Minus className="w-5 h-5" />
                      </button>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {task.currentValue}
                          <span className="text-sm text-gray-500">/{task.targetValue}</span>
                        </div>
                        <div className="text-xs text-gray-500">{getTaskUnit(task)}</div>
                      </div>

                      <button
                        onClick={() => updateTaskValue(task.id, 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#D4FF00] hover:bg-[#E5FF33] text-[#1A1A1A] transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Range type
                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%`, backgroundColor: task.color }}
                      />
                    </div>

                    {/* Value Display */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {task.currentValue.toLocaleString()} {getTaskUnit(task)}
                      </span>
                      <span className="text-white font-semibold">
                        {language === 'pt' ? 'Meta: ' : language === 'es' ? 'Meta: ' : 'Goal: '}
                        {task.targetValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="bg-[#242424] rounded-3xl p-6 border border-white/5">
        <h3 className="text-lg font-bold text-white mb-4">
          {language === 'pt' ? 'Vis\u00E3o Semanal' : language === 'es' ? 'Vista Semanal' : 'Weekly Overview'}
        </h3>

        <div className="grid grid-cols-7 gap-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'S\u00E1b'].map((day, index) => {
            // Mock data for visualization
            const dayProgress = [100, 85, 100, 90, 100, 100, completionPercentage];
            const isToday = index === 6;
            const isPerfect = dayProgress[index] === 100;

            return (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 mb-2">{day}</div>
                <div
                  className={`aspect-square rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
                    isToday
                      ? 'bg-[#D4FF00] text-[#1A1A1A] ring-4 ring-[#D4FF00]/30'
                      : isPerfect && index < 6
                      ? 'bg-[#4ADE80] text-white'
                      : index < 6
                      ? 'bg-[#2A2A2A] text-gray-500'
                      : 'bg-[#2A2A2A] text-gray-400'
                  }`}
                >
                  {isPerfect ? '\u2713' : Math.round(dayProgress[index])}
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#D4FF00]">5</div>
            <div className="text-xs text-gray-400">
              {language === 'pt' ? 'Dias Perfeitos' : language === 'es' ? 'D\u00EDas Perfectos' : 'Perfect Days'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">92%</div>
            <div className="text-xs text-gray-400">
              {language === 'pt' ? 'M\u00E9dia' : language === 'es' ? 'Promedio' : 'Average'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#4ADE80]">450</div>
            <div className="text-xs text-gray-400">XP {language === 'pt' ? 'Esta Semana' : language === 'es' ? 'Esta Semana' : 'This Week'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

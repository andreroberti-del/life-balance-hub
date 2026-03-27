import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ScoreRing } from './ScoreRing';
import { Check, Lock, Award, TrendingUp } from 'lucide-react';

interface ProtocolPhase {
  phase: number;
  name_en: string;
  name_pt: string;
  name_es: string;
  days: [number, number]; // [start, end]
  color: string;
  description_en: string;
  description_pt: string;
  description_es: string;
}

const PROTOCOL_PHASES: ProtocolPhase[] = [
  {
    phase: 1,
    name_en: 'Foundation',
    name_pt: 'Funda\u00E7\u00E3o',
    name_es: 'Fundaci\u00F3n',
    days: [1, 30],
    color: '#60A5FA',
    description_en: 'Establishing baseline & building habits',
    description_pt: 'Estabelecendo linha de base e construindo h\u00E1bitos',
    description_es: 'Estableciendo l\u00EDnea base y construyendo h\u00E1bitos',
  },
  {
    phase: 2,
    name_en: 'Optimization',
    name_pt: 'Otimiza\u00E7\u00E3o',
    name_es: 'Optimizaci\u00F3n',
    days: [31, 60],
    color: '#FBBF24',
    description_en: 'Adjusting protocol & seeing changes',
    description_pt: 'Ajustando protocolo e vendo mudan\u00E7as',
    description_es: 'Ajustando protocolo y viendo cambios',
  },
  {
    phase: 3,
    name_en: 'Acceleration',
    name_pt: 'Acelera\u00E7\u00E3o',
    name_es: 'Aceleraci\u00F3n',
    days: [61, 90],
    color: '#4ADE80',
    description_en: 'Deepening impact & momentum',
    description_pt: 'Aprofundando impacto e momento',
    description_es: 'Profundizando impacto y impulso',
  },
  {
    phase: 4,
    name_en: 'Transformation',
    name_pt: 'Transforma\u00E7\u00E3o',
    name_es: 'Transformaci\u00F3n',
    days: [91, 120],
    color: '#D4FF00',
    description_en: 'Visible results & new you',
    description_pt: 'Resultados vis\u00EDveis e novo voc\u00EA',
    description_es: 'Resultados visibles y nuevo t\u00FA',
  },
];

interface DailyTask {
  id: string;
  name_en: string;
  name_pt: string;
  name_es: string;
  icon: string;
  completed: boolean;
}

interface Protocol120Props {
  currentDay: number;
  startDate: Date;
  dailyTasks?: DailyTask[];
  onTaskToggle?: (taskId: string) => void;
}

export function Protocol120({ currentDay, startDate, dailyTasks = [], onTaskToggle }: Protocol120Props) {
  const { language, t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const getCurrentPhase = () => {
    return PROTOCOL_PHASES.find(
      (phase) => currentDay >= phase.days[0] && currentDay <= phase.days[1]
    ) || PROTOCOL_PHASES[0];
  };

  const currentPhase = getCurrentPhase();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 120);

  const completedTasks = dailyTasks.filter(t => t.completed).length;
  const totalTasks = dailyTasks.length;
  const isPerfectDay = completedTasks === totalTasks && totalTasks > 0;

  // Default daily tasks if none provided
  const defaultTasks: DailyTask[] = [
    {
      id: 'omega3',
      name_en: 'Take Omega-3 supplement',
      name_pt: 'Tomar suplemento Omega-3',
      name_es: 'Tomar suplemento Omega-3',
      icon: '\u{1F48A}',
      completed: false,
    },
    {
      id: 'scan',
      name_en: 'Scan at least 2 meals',
      name_pt: 'Escanear pelo menos 2 refei\u00E7\u00F5es',
      name_es: 'Escanear al menos 2 comidas',
      icon: '\u{1F4F8}',
      completed: false,
    },
    {
      id: 'water',
      name_en: 'Log water intake',
      name_pt: 'Registrar ingest\u00E3o de \u00E1gua',
      name_es: 'Registrar ingesta de agua',
      icon: '\u{1F4A7}',
      completed: false,
    },
    {
      id: 'movement',
      name_en: '10-minute movement',
      name_pt: '10 minutos de movimento',
      name_es: '10 minutos de movimiento',
      icon: '\u{1F3C3}',
      completed: false,
    },
    {
      id: 'lesson',
      name_en: 'Read today\'s lesson',
      name_pt: 'Ler li\u00E7\u00E3o de hoje',
      name_es: 'Leer lecci\u00F3n de hoy',
      icon: '\u{1F4D6}',
      completed: false,
    },
  ];

  const tasks = dailyTasks.length > 0 ? dailyTasks : defaultTasks;

  // Safe access to translation keys with fallbacks
  const tProtocol = (t as any)?.protocol || {};

  return (
    <div className="space-y-6">
      {/* Hero Progress Ring */}
      <div className="bg-gradient-to-br from-[#242424] to-[#1A1A1A] rounded-3xl p-8 border border-white/5">
        <div className="flex flex-col items-center">
          {/* Phase Badge */}
          <div
            className="px-4 py-2 rounded-full text-sm font-bold mb-6"
            style={{
              backgroundColor: `${currentPhase.color}20`,
              color: currentPhase.color,
              border: `2px solid ${currentPhase.color}`,
            }}
          >
            {tProtocol.phase || 'Phase'} {currentPhase.phase}: {currentPhase[`name_${language}` as keyof ProtocolPhase]}
          </div>

          {/* Score Ring */}
          <ScoreRing
            score={currentDay}
            maxScore={120}
            size="large"
            label={tProtocol.daysCompleted || 'Days Completed'}
            color="neon"
            animated={true}
          />

          {/* Dates */}
          <div className="flex items-center gap-8 mt-6 text-sm">
            <div className="text-center">
              <div className="text-gray-400">{tProtocol.started || 'Started'}</div>
              <div className="text-white font-medium">{startDate.toLocaleDateString()}</div>
            </div>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4FF00] to-transparent" />
            <div className="text-center">
              <div className="text-gray-400">{tProtocol.projected || 'Projected'}</div>
              <div className="text-[#D4FF00] font-medium">{endDate.toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="bg-[#242424] rounded-3xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">{tProtocol.yourJourney || 'Your Journey'}</h3>
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-white/10" />
          <div
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-[#60A5FA] via-[#FBBF24] to-[#4ADE80] transition-all duration-500"
            style={{ width: `${(currentDay / 120) * 100}%` }}
          />

          {/* Phase Nodes */}
          <div className="relative grid grid-cols-4 gap-4">
            {PROTOCOL_PHASES.map((phase, index) => {
              const isCompleted = currentDay > phase.days[1];
              const isCurrent = currentDay >= phase.days[0] && currentDay <= phase.days[1];
              const isLocked = currentDay < phase.days[0];

              return (
                <div key={phase.phase} className="flex flex-col items-center">
                  {/* Node */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-[#4ADE80] to-[#22C55E] shadow-[0_0_20px_rgba(74,222,128,0.4)]'
                        : isCurrent
                        ? 'bg-gradient-to-br from-[#D4FF00] to-[#A0E000] shadow-[0_0_20px_rgba(212,255,0,0.4)] animate-pulse'
                        : 'bg-[#2A2A2A]'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : isLocked ? (
                      <Lock className="w-6 h-6 text-gray-600" />
                    ) : (
                      <div className="text-xl">{index + 1}</div>
                    )}
                  </div>

                  {/* Label */}
                  <div className="mt-3 text-center">
                    <div
                      className={`text-sm font-bold ${
                        isCurrent ? 'text-[#D4FF00]' : isCompleted ? 'text-[#4ADE80]' : 'text-gray-500'
                      }`}
                    >
                      {phase[`name_${language}` as keyof ProtocolPhase]}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {tProtocol.days || 'Days'} {phase.days[0]}-{phase.days[1]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Checklist */}
      <div className="bg-[#242424] rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{tProtocol.todaysTasks || "Today's Tasks"}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {completedTasks} / {totalTasks}
            </span>
            {isPerfectDay && (
              <div className="px-3 py-1 bg-[#D4FF00]/20 border border-[#D4FF00] rounded-full text-xs text-[#D4FF00] font-bold flex items-center gap-1">
                <Award className="w-3 h-3" />
                {tProtocol.perfectDay || 'Perfect Day'}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-[#D4FF00] to-[#A0E000] transition-all duration-300"
            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
          />
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onTaskToggle?.(task.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                task.completed
                  ? 'bg-[#D4FF00]/10 border-2 border-[#D4FF00]'
                  : 'bg-[#2A2A2A] border-2 border-transparent hover:border-white/10'
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                  task.completed
                    ? 'bg-[#D4FF00] text-[#1A1A1A]'
                    : 'border-2 border-gray-600'
                }`}
              >
                {task.completed && <Check className="w-4 h-4" />}
              </div>

              {/* Icon */}
              <div className="text-2xl">{task.icon}</div>

              {/* Task Name */}
              <div className={`flex-1 text-left ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                {task[`name_${language}` as keyof DailyTask]}
              </div>
            </button>
          ))}
        </div>

        {/* Completion Message */}
        {isPerfectDay && (
          <div className="mt-6 p-4 bg-gradient-to-r from-[#D4FF00]/20 to-transparent rounded-xl border-l-4 border-[#D4FF00]">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{'\u{1F389}'}</div>
              <div>
                <div className="text-sm font-bold text-[#D4FF00]">{tProtocol.perfectDayComplete || 'Perfect Day Complete!'}</div>
                <div className="text-xs text-gray-400">{tProtocol.keepItUp || 'Keep it up!'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Week Summary (placeholder) */}
      <div className="bg-[#242424] rounded-3xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">{tProtocol.weekSummary || 'Week Summary'}</h3>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => {
            const dayNumber = currentDay - (6 - i);
            const isToday = i === 6;
            const isPast = dayNumber < currentDay;

            return (
              <div
                key={i}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs ${
                  isToday
                    ? 'bg-[#D4FF00] text-[#1A1A1A] font-bold'
                    : isPast && dayNumber > 0
                    ? 'bg-[#4ADE80]/20 text-[#4ADE80]'
                    : 'bg-[#2A2A2A] text-gray-600'
                }`}
              >
                <div className="font-bold">{dayNumber > 0 ? dayNumber : '-'}</div>
                {isPast && dayNumber > 0 && <Check className="w-3 h-3 mt-1" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestones */}
      <ProtocolMilestones currentDay={currentDay} />
    </div>
  );
}

function ProtocolMilestones({ currentDay }: { currentDay: number }) {
  const { t } = useLanguage();

  // Safe access to translation keys with fallbacks
  const tProtocol = (t as any)?.protocol || {};

  const milestones = [
    { day: 7, label: tProtocol.firstWeek || 'First Week', icon: '\u{1F3AF}' },
    { day: 14, label: tProtocol.bloodImprovement || 'Blood Improvement', icon: '\u{1FA78}' },
    { day: 30, label: tProtocol.phase1Complete || 'Phase 1 Complete', icon: '\u{1F949}' },
    { day: 60, label: tProtocol.halfway || 'Halfway', icon: '\u{1F948}' },
    { day: 90, label: tProtocol.inflammationShift || 'Inflammation Shift', icon: '\u{1F6E1}\uFE0F' },
    { day: 120, label: tProtocol.transformationComplete || 'Transformation Complete', icon: '\u{1F3C6}' },
  ];

  return (
    <div className="bg-[#242424] rounded-3xl p-6">
      <h3 className="text-lg font-bold text-white mb-6">{tProtocol.milestones || 'Milestones'}</h3>
      <div className="space-y-4">
        {milestones.map((milestone) => {
          const isCompleted = currentDay >= milestone.day;
          const isCurrent = currentDay === milestone.day;
          const isLocked = currentDay < milestone.day;

          return (
            <div
              key={milestone.day}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                isCompleted
                  ? 'bg-[#4ADE80]/10 border-2 border-[#4ADE80]'
                  : isCurrent
                  ? 'bg-[#D4FF00]/10 border-2 border-[#D4FF00] animate-pulse'
                  : 'bg-[#2A2A2A] border-2 border-transparent'
              }`}
            >
              {/* Icon/Status */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  isCompleted
                    ? 'bg-[#4ADE80]'
                    : isCurrent
                    ? 'bg-[#D4FF00]'
                    : 'bg-[#2A2A2A]'
                }`}
              >
                {isCompleted ? '\u2713' : isLocked ? '\u{1F512}' : milestone.icon}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className={`font-bold ${isCompleted ? 'text-[#4ADE80]' : isCurrent ? 'text-[#D4FF00]' : 'text-gray-400'}`}>
                  {tProtocol.day || 'Day'} {milestone.day}
                </div>
                <div className="text-sm text-gray-400">{milestone.label}</div>
              </div>

              {/* Badge indicator */}
              {isCompleted && (
                <Award className="w-6 h-6 text-[#4ADE80]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

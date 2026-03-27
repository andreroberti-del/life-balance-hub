import { useLanguage } from '../contexts/LanguageContext';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function StreakDisplay({ currentStreak, longestStreak, isActive, size = 'medium' }: StreakDisplayProps) {
  const { t } = useLanguage();

  const sizeConfig = {
    small: {
      flameSize: 'text-base',
      numberSize: 'text-sm',
      labelSize: 'text-xs',
      padding: 'p-2',
    },
    medium: {
      flameSize: 'text-2xl',
      numberSize: 'text-xl',
      labelSize: 'text-sm',
      padding: 'p-3',
    },
    large: {
      flameSize: 'text-4xl',
      numberSize: 'text-3xl',
      labelSize: 'text-base',
      padding: 'p-4',
    },
  };

  const config = sizeConfig[size];

  // Safe access to translation keys with fallbacks
  const tGamification = (t as any)?.gamification || {};

  // Determine flame color and animation based on streak milestone
  const getFlameStyle = () => {
    if (!isActive || currentStreak === 0) {
      return 'grayscale opacity-50';
    }
    if (currentStreak >= 120) return 'animate-pulse drop-shadow-[0_0_10px_#D4FF00]';
    if (currentStreak >= 90) return 'animate-pulse drop-shadow-[0_0_8px_#4ADE80]';
    if (currentStreak >= 60) return 'drop-shadow-[0_0_6px_#FBBF24]';
    if (currentStreak >= 30) return 'drop-shadow-[0_0_4px_#60A5FA]';
    if (currentStreak >= 7) return 'drop-shadow-[0_0_3px_#D4FF00]';
    return '';
  };

  return (
    <div className={`flex items-center gap-3 bg-[#242424] rounded-2xl ${config.padding}`}>
      {/* Flame Icon */}
      <div className={`${config.flameSize} ${getFlameStyle()} transition-all duration-300`}>
        {'\u{1F525}'}
      </div>

      {/* Streak Info */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className={`${config.numberSize} font-bold ${isActive ? 'text-[#D4FF00]' : 'text-gray-400'}`}>
            {currentStreak}
          </span>
          <span className={`${config.labelSize} text-gray-400`}>
            {currentStreak === 1 ? (tGamification.day || 'day') : (tGamification.days || 'days')}
          </span>
        </div>
        {longestStreak > currentStreak && (
          <span className="text-xs text-gray-500">
            {tGamification.longest || 'Longest'}: {longestStreak}
          </span>
        )}
      </div>
    </div>
  );
}

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
  graceAvailable: boolean;
  onMaintainStreak?: () => void;
}

export function StreakCard({ currentStreak, longestStreak, isActive, graceAvailable, onMaintainStreak }: StreakCardProps) {
  const { t } = useLanguage();

  // Safe access to translation keys with fallbacks
  const tGamification = (t as any)?.gamification || {};

  const getMilestoneMessage = () => {
    if (currentStreak === 0) return tGamification.startStreak || 'Start your streak!';
    if (currentStreak < 7) return tGamification.keepGoing || 'Keep going!';
    if (currentStreak === 7) return tGamification.weekWarrior || 'Week Warrior!';
    if (currentStreak < 30) return tGamification.buildingMomentum || 'Building momentum!';
    if (currentStreak === 30) return tGamification.monthChampion || 'Month Champion!';
    if (currentStreak < 60) return tGamification.unstoppable || 'Unstoppable!';
    if (currentStreak === 60) return tGamification.halfwayHero || 'Halfway Hero!';
    if (currentStreak < 90) return tGamification.legendary || 'Legendary!';
    if (currentStreak === 90) return tGamification.elite || 'Elite!';
    if (currentStreak < 120) return tGamification.almostThere || 'Almost there!';
    return tGamification.master || 'Master!';
  };

  const getNextMilestone = () => {
    if (currentStreak < 7) return 7;
    if (currentStreak < 14) return 14;
    if (currentStreak < 30) return 30;
    if (currentStreak < 60) return 60;
    if (currentStreak < 90) return 90;
    if (currentStreak < 120) return 120;
    return null;
  };

  const nextMilestone = getNextMilestone();
  const progressToNext = nextMilestone ? ((currentStreak / nextMilestone) * 100) : 100;

  return (
    <div className="bg-gradient-to-br from-[#242424] to-[#1A1A1A] rounded-3xl p-6 border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">{tGamification.yourStreak || 'Your Streak'}</h3>
        {graceAvailable && (
          <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-400">
            {tGamification.graceAvailable || 'Grace Available'}
          </div>
        )}
      </div>

      {/* Streak Display */}
      <div className="flex items-center justify-between mb-6">
        <StreakDisplay
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          isActive={isActive}
          size="large"
        />
      </div>

      {/* Motivation Message */}
      <div className="mb-4">
        <p className="text-sm text-gray-300 mb-2">{getMilestoneMessage()}</p>
        {nextMilestone && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{tGamification.nextMilestone || 'Next Milestone'}</span>
              <span className="font-medium text-[#D4FF00]">{nextMilestone} {tGamification.days || 'days'}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4FF00] to-[#A0E000] transition-all duration-500 rounded-full"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action */}
      {!isActive && onMaintainStreak && (
        <button
          onClick={onMaintainStreak}
          className="w-full py-3 bg-[#D4FF00] text-[#1A1A1A] font-bold rounded-full hover:bg-[#E5FF33] transition-colors"
        >
          {tGamification.completeToday || 'Complete Today'}
        </button>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
        <div>
          <div className="text-2xl font-bold text-[#D4FF00]">{currentStreak}</div>
          <div className="text-xs text-gray-400">{tGamification.current || 'Current'}</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-300">{longestStreak}</div>
          <div className="text-xs text-gray-400">{tGamification.longest || 'Longest'}</div>
        </div>
      </div>
    </div>
  );
}

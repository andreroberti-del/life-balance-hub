import { Moon } from 'lucide-react';
import { useGarmin } from '../../hooks/useGarmin';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatDuration } from '../../services/garmin';

export function GarminSleepCard() {
  const { isConnected, sleepSummary } = useGarmin();
  const { t } = useLanguage();

  if (!isConnected || !sleepSummary) return null;

  const total = sleepSummary.total_sleep_seconds || 0;
  const deep = sleepSummary.deep_sleep_seconds || 0;
  const light = sleepSummary.light_sleep_seconds || 0;
  const rem = sleepSummary.rem_sleep_seconds || 0;
  const awake = sleepSummary.awake_seconds || 0;

  const segments = [
    { label: t.garmin.deepSleep, value: deep, color: 'bg-indigo-600' },
    { label: t.garmin.lightSleep, value: light, color: 'bg-indigo-300' },
    { label: t.garmin.remSleep, value: rem, color: 'bg-cyan-400' },
    { label: t.garmin.awake, value: awake, color: 'bg-orange-300' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-[#1a1a1a]">{t.garmin.sleep}</h3>
        </div>
        {sleepSummary.sleep_score && (
          <span className="text-sm font-bold text-indigo-600">
            {t.garmin.sleepScore}: {sleepSummary.sleep_score}
          </span>
        )}
      </div>

      <p className="text-2xl font-bold text-[#1a1a1a] mb-4">{formatDuration(total)}</p>

      {/* Sleep stages bar */}
      <div className="flex rounded-full overflow-hidden h-3 mb-4">
        {segments.map(({ label, value, color }) =>
          value > 0 ? (
            <div
              key={label}
              className={`${color} transition-all`}
              style={{ width: `${(value / total) * 100}%` }}
              title={`${label}: ${formatDuration(value)}`}
            />
          ) : null
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {segments.map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-xs font-medium text-[#1a1a1a] ml-auto">{formatDuration(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

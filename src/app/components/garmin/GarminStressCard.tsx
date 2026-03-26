import { Brain } from 'lucide-react';
import { useGarmin } from '../../hooks/useGarmin';
import { useLanguage } from '../../contexts/LanguageContext';

export function GarminStressCard() {
  const { isConnected, stressSummary } = useGarmin();
  const { t } = useLanguage();

  if (!isConnected || !stressSummary) return null;

  const total =
    (stressSummary.low_stress_duration_seconds || 0) +
    (stressSummary.medium_stress_duration_seconds || 0) +
    (stressSummary.high_stress_duration_seconds || 0) +
    (stressSummary.rest_duration_seconds || 0);

  const segments = [
    { label: t.garmin.low, value: stressSummary.rest_duration_seconds || 0, color: 'bg-green-400' },
    { label: t.garmin.low, value: stressSummary.low_stress_duration_seconds || 0, color: 'bg-blue-400' },
    { label: t.garmin.medium, value: stressSummary.medium_stress_duration_seconds || 0, color: 'bg-yellow-400' },
    { label: t.garmin.high, value: stressSummary.high_stress_duration_seconds || 0, color: 'bg-red-400' },
  ];

  function getStressLabel(avg: number): string {
    if (avg <= 25) return t.garmin.low;
    if (avg <= 50) return t.garmin.medium;
    return t.garmin.high;
  }

  const avg = stressSummary.avg_stress || 0;

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <h3 className="font-bold text-[#1a1a1a]">{t.garmin.stressLevel}</h3>
        </div>
        <span className="text-sm font-bold text-purple-600">{avg}/100</span>
      </div>

      <p className="text-2xl font-bold text-[#1a1a1a] mb-1">{getStressLabel(avg)}</p>
      <p className="text-xs text-gray-400 mb-4">
        {t.garmin.stress} {t.garmin.medium.toLowerCase()}: {avg}
      </p>

      {/* Stress breakdown bar */}
      {total > 0 && (
        <div className="flex rounded-full overflow-hidden h-3">
          {segments.map(({ label, value, color }, i) =>
            value > 0 ? (
              <div
                key={`${label}-${i}`}
                className={`${color} transition-all`}
                style={{ width: `${(value / total) * 100}%` }}
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

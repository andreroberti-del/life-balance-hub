import { Heart, Footprints, Flame, Brain, Watch } from 'lucide-react';
import { useGarmin } from '../../hooks/useGarmin';
import { useLanguage } from '../../contexts/LanguageContext';

export function GarminDashboardWidget() {
  const { isConnected, isLoading, dailySummary, stressSummary } = useGarmin();
  const { t } = useLanguage();

  if (isLoading || !isConnected) return null;

  if (!dailySummary) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Watch className="w-5 h-5 text-[#007749]" />
          <h3 className="font-bold text-[#1a1a1a]">{t.garmin.garminData}</h3>
        </div>
        <p className="text-sm text-gray-400 text-center py-4">{t.garmin.noData}</p>
      </div>
    );
  }

  const stats = [
    {
      icon: Footprints,
      label: t.garmin.steps,
      value: dailySummary.steps?.toLocaleString() || '—',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Heart,
      label: t.garmin.heartRate,
      value: dailySummary.resting_heart_rate ? `${dailySummary.resting_heart_rate} ${t.garmin.bpm}` : '—',
      sub: t.garmin.resting,
      color: 'bg-red-50 text-red-500',
    },
    {
      icon: Flame,
      label: t.garmin.calories,
      value: dailySummary.active_calories?.toLocaleString() || '—',
      sub: t.garmin.active,
      color: 'bg-orange-50 text-orange-500',
    },
    {
      icon: Brain,
      label: t.garmin.stress,
      value: stressSummary?.avg_stress ?? dailySummary.avg_stress_level ?? '—',
      sub: '/100',
      color: 'bg-purple-50 text-purple-500',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Watch className="w-5 h-5 text-[#007749]" />
        <h3 className="font-bold text-[#1a1a1a]">{t.garmin.garminData}</h3>
        <span className="ml-auto text-[10px] font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">LIVE</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-sm font-bold text-[#1a1a1a]">
                {value}
                {sub && <span className="text-xs font-normal text-gray-400 ml-0.5">{sub}</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

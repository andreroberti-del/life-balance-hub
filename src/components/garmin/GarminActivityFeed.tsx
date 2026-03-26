import { Activity } from 'lucide-react';
import { useGarmin } from '../../hooks/useGarmin';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatDuration, formatDistance, getActivityIcon } from '../../lib/garmin';

export function GarminActivityFeed() {
  const { isConnected, activities } = useGarmin();
  const { t } = useLanguage();

  if (!isConnected || activities.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-[#007749]" />
        <h3 className="font-bold text-[#1a1a1a]">{t.garmin.activities}</h3>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
          >
            <span className="text-xl">{getActivityIcon(activity.activity_type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                {activity.activity_name || activity.activity_type}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(activity.started_at).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              {activity.duration_seconds && (
                <p className="text-sm font-bold text-[#1a1a1a]">
                  {formatDuration(activity.duration_seconds)}
                </p>
              )}
              {activity.distance_meters && activity.distance_meters > 0 && (
                <p className="text-xs text-gray-500">
                  {formatDistance(activity.distance_meters)}
                </p>
              )}
            </div>
            {activity.avg_heart_rate && (
              <div className="text-right ml-2">
                <p className="text-xs font-medium text-red-500">
                  {activity.avg_heart_rate} {t.garmin.bpm}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

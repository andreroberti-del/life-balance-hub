import { DailyTracker } from '../components/DailyTracker';

export function DailyTrackerPage() {
  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">
        <DailyTracker currentStreak={23} />
      </div>
    </div>
  );
}

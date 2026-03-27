import { DailyTracker } from '../components/DailyTracker';

export function DailyTrackerPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6">
      <div className="max-w-4xl mx-auto">
        <DailyTracker currentStreak={23} />
      </div>
    </div>
  );
}

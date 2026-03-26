interface StepGoalsProps {
  data: { health_goals: string[] };
  onChange: (field: string, value: unknown) => void;
}

const GOALS = [
  { id: 'reduce_inflammation', label: 'Reduce Inflammation' },
  { id: 'lose_weight', label: 'Lose Weight' },
  { id: 'better_sleep', label: 'Better Sleep' },
  { id: 'build_muscle', label: 'Build Muscle' },
  { id: 'improve_omega', label: 'Improve Omega Ratio' },
  { id: 'reduce_stress', label: 'Reduce Stress' },
  { id: 'more_energy', label: 'More Energy' },
  { id: 'better_nutrition', label: 'Better Nutrition' },
];

export function StepGoals({ data, onChange }: StepGoalsProps) {
  function toggleGoal(goalId: string) {
    const current = data.health_goals;
    const updated = current.includes(goalId)
      ? current.filter((g) => g !== goalId)
      : [...current, goalId];
    onChange('health_goals', updated);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#1a1a1a] mb-1">Your wellness goals</h2>
        <p className="text-sm text-gray-500 mb-4">Select all that apply to your journey.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GOALS.map((goal) => {
          const isSelected = data.health_goals.includes(goal.id);
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => toggleGoal(goal.id)}
              className={`px-4 py-3 rounded-xl text-sm font-medium text-center transition-all active:scale-[0.97] ${
                isSelected
                  ? 'bg-[#D4FF00] text-black border border-[#D4FF00]'
                  : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-150'
              }`}
            >
              {goal.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

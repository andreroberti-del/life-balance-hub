interface StepHealthProps {
  data: { weight_kg: number | ''; waist_cm: number | ''; activity_level: string };
  onChange: (field: string, value: unknown) => void;
}

export function StepHealth({ data, onChange }: StepHealthProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#1a1a1a] mb-1">Health metrics</h2>
        <p className="text-sm text-gray-500 mb-4">We use this to track your progress accurately.</p>
      </div>

      <div>
        <label htmlFor="weight_kg" className="block text-sm font-medium text-gray-700 mb-1.5">
          Weight (kg)
        </label>
        <input
          id="weight_kg"
          type="number"
          value={data.weight_kg}
          onChange={(e) => onChange('weight_kg', e.target.value ? Number(e.target.value) : '')}
          placeholder="e.g. 85"
          min={20}
          max={300}
          step={0.1}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4FF00] focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label htmlFor="waist_cm" className="block text-sm font-medium text-gray-700 mb-1.5">
          Waist circumference (cm)
        </label>
        <input
          id="waist_cm"
          type="number"
          value={data.waist_cm}
          onChange={(e) => onChange('waist_cm', e.target.value ? Number(e.target.value) : '')}
          placeholder="e.g. 90"
          min={40}
          max={200}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4FF00] focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label htmlFor="activity_level" className="block text-sm font-medium text-gray-700 mb-1.5">
          Activity Level
        </label>
        <select
          id="activity_level"
          value={data.activity_level}
          onChange={(e) => onChange('activity_level', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#D4FF00] focus:border-transparent transition-all"
        >
          <option value="">Select activity level</option>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very_active">Very Active</option>
        </select>
      </div>
    </div>
  );
}

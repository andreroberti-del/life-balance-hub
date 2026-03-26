interface StepProfileProps {
  data: { display_name: string; age: number | ''; gender: string; height_cm: number | '' };
  onChange: (field: string, value: unknown) => void;
}

export function StepProfile({ data, onChange }: StepProfileProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#1a1a1a] mb-1">Tell us about yourself</h2>
        <p className="text-sm text-gray-500 mb-4">This helps personalize your wellness journey.</p>
      </div>

      <div>
        <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1.5">
          Display Name
        </label>
        <input
          id="display_name"
          type="text"
          value={data.display_name}
          onChange={(e) => onChange('display_name', e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4FF00] focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1.5">
          Age
        </label>
        <input
          id="age"
          type="number"
          value={data.age}
          onChange={(e) => onChange('age', e.target.value ? Number(e.target.value) : '')}
          placeholder="e.g. 35"
          min={1}
          max={120}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4FF00] focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1.5">
          Gender
        </label>
        <select
          id="gender"
          value={data.gender}
          onChange={(e) => onChange('gender', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#D4FF00] focus:border-transparent transition-all"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="height_cm" className="block text-sm font-medium text-gray-700 mb-1.5">
          Height (cm)
        </label>
        <input
          id="height_cm"
          type="number"
          value={data.height_cm}
          onChange={(e) => onChange('height_cm', e.target.value ? Number(e.target.value) : '')}
          placeholder="e.g. 178"
          min={50}
          max={250}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4FF00] focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
}

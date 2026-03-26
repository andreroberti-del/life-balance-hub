interface StepSupplementProps {
  data: {
    supplement_brand: string;
    supplement_product: string;
    supplement_dosage: string;
    daily_servings: number;
    skip_supplement: boolean;
  };
  onChange: (field: string, value: unknown) => void;
}

export function StepSupplement({ data, onChange }: StepSupplementProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#1a1a1a] mb-1">Omega supplement</h2>
        <p className="text-sm text-gray-500 mb-4">Tell us about your current omega supplement.</p>
      </div>

      {/* Skip checkbox */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={data.skip_supplement}
          onChange={(e) => onChange('skip_supplement', e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-[#D4FF00] focus:ring-[#D4FF00] accent-[#D4FF00]"
        />
        <span className="text-sm text-gray-600 font-medium">
          I don't take any omega supplement
        </span>
      </label>

      {!data.skip_supplement && (
        <>
          <div>
            <label htmlFor="supplement_brand" className="block text-sm font-medium text-gray-700 mb-1.5">
              Brand
            </label>
            <input
              id="supplement_brand"
              type="text"
              value={data.supplement_brand}
              onChange={(e) => onChange('supplement_brand', e.target.value)}
              placeholder="e.g. Zinzino"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4FF00] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="supplement_product" className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Name
            </label>
            <input
              id="supplement_product"
              type="text"
              value={data.supplement_product}
              onChange={(e) => onChange('supplement_product', e.target.value)}
              placeholder="e.g. BalanceOil+"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4FF00] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="supplement_dosage" className="block text-sm font-medium text-gray-700 mb-1.5">
              Dosage
            </label>
            <input
              id="supplement_dosage"
              type="text"
              value={data.supplement_dosage}
              onChange={(e) => onChange('supplement_dosage', e.target.value)}
              placeholder="e.g. 15ml"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4FF00] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="daily_servings" className="block text-sm font-medium text-gray-700 mb-1.5">
              Daily Servings
            </label>
            <input
              id="daily_servings"
              type="number"
              value={data.daily_servings}
              onChange={(e) => onChange('daily_servings', e.target.value ? Number(e.target.value) : 1)}
              min={1}
              max={10}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4FF00] focus:border-transparent transition-all"
            />
          </div>
        </>
      )}
    </div>
  );
}

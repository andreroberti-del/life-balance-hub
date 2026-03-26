import { AlertCircle, CheckCircle, XCircle, Camera } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const scanHistory = [
  { id: 1, name: "Extra Virgin Olive Oil", brand: "Gallo", score: 92, verdict: "GOOD", date: "2 hours ago", flags: [], goodIngredients: ["Extra virgin olive oil", "Natural antioxidants"] },
  { id: 2, name: "Ruffles Original Chips", brand: "Lay's", score: 18, verdict: "BAD", date: "5 hours ago", flags: ["Soybean oil", "High sodium", "Refined carbs"], badIngredients: ["Soybean oil", "Sunflower oil", "Corn oil"] },
  { id: 3, name: "Wild Caught Salmon", brand: "Fresh Market", score: 95, verdict: "GOOD", date: "Yesterday", flags: [], goodIngredients: ["Omega-3 rich", "Wild caught", "No additives"] },
  { id: 4, name: "Granola Bar", brand: "Nature Valley", score: 32, verdict: "BAD", date: "Yesterday", flags: ["High fructose corn syrup", "Processed sugars", "Canola oil"], badIngredients: ["HFCS", "Canola oil", "Sugar"] },
];

const ingredientGuide = [
  { name: "Soybean Oil", type: "BAD", impact: "High Omega-6, inflammatory" },
  { name: "High Fructose Corn Syrup", type: "BAD", impact: "Metabolic disruption" },
  { name: "Canola Oil", type: "BAD", impact: "Processed, high Omega-6" },
  { name: "Palm Oil", type: "BAD", impact: "Saturated fat, inflammatory" },
  { name: "Extra Virgin Olive Oil", type: "GOOD", impact: "Anti-inflammatory, healthy fats" },
  { name: "Turmeric", type: "GOOD", impact: "Powerful anti-inflammatory" },
  { name: "Wild Salmon", type: "GOOD", impact: "High Omega-3, reduces inflammation" },
  { name: "Avocado", type: "GOOD", impact: "Healthy fats, anti-inflammatory" },
];

export function Scanner() {
  const [selectedScan, setSelectedScan] = useState<number | null>(null);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen p-6 md:p-8 bg-[#FAFAFA]">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">{t.scanner.title}</h1>
            <p className="text-sm text-gray-500">{t.scanner.subtitle}</p>
          </div>
          <button className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all shadow-lg">
            <Camera className="w-5 h-5" />{t.scanner.scanProduct}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-200/50"><p className="text-sm text-gray-500 mb-2">{t.scanner.totalScans}</p><p className="text-4xl font-bold text-black">47</p></div>
          <div className="bg-white rounded-2xl p-5 border border-gray-200/50"><p className="text-sm text-gray-500 mb-2">{t.scanner.goodChoices}</p><div className="flex items-baseline gap-2"><p className="text-4xl font-bold text-black">31</p><span className="text-sm text-[#D4FF00] font-bold">66%</span></div></div>
          <div className="bg-white rounded-2xl p-5 border border-gray-200/50"><p className="text-sm text-gray-500 mb-2">{t.scanner.avoided}</p><p className="text-4xl font-bold text-black">16</p></div>
          <div className="bg-[#D4FF00] rounded-2xl p-5"><p className="text-sm text-black/70 mb-2 font-semibold">{t.scanner.successRate}</p><p className="text-4xl font-bold text-black">66%</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-black">{t.scanner.scanHistory}</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold">{t.scanner.all}</button>
                  <button className="px-4 py-2 text-gray-500 text-xs font-semibold hover:bg-gray-100 rounded-xl">{t.scanner.good}</button>
                  <button className="px-4 py-2 text-gray-500 text-xs font-semibold hover:bg-gray-100 rounded-xl">{t.scanner.bad}</button>
                </div>
              </div>
              <div className="space-y-3">
                {scanHistory.map((scan) => (
                  <div key={scan.id} onClick={() => setSelectedScan(selectedScan === scan.id ? null : scan.id)} className="p-5 rounded-2xl border-2 border-gray-100 hover:border-black/20 transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${scan.verdict === 'GOOD' ? 'bg-[#D4FF00] text-black' : 'bg-black text-white'}`}>{scan.score}</div>
                        <div className="flex-1">
                          <div className={`inline-block px-3 py-1 rounded-lg text-xs font-bold mb-2 ${scan.verdict === 'GOOD' ? 'bg-[#D4FF00]/20 text-black' : 'bg-black/10 text-black'}`}>{scan.verdict}</div>
                          <h4 className="font-bold text-black text-lg mb-1">{scan.name}</h4>
                          <div className="flex items-center gap-3"><p className="text-sm text-gray-500">{scan.brand}</p><span className="text-xs text-gray-400">• {scan.date}</span></div>
                        </div>
                      </div>
                      {scan.verdict === 'GOOD' ? <CheckCircle className="w-6 h-6 text-[#D4FF00]" /> : <XCircle className="w-6 h-6 text-black" />}
                    </div>
                    {selectedScan === scan.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {scan.flags.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-bold text-black mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{t.scanner.inflammatoryFlags}</p>
                            <div className="flex flex-wrap gap-2">{scan.flags.map((flag, i) => (<span key={i} className="px-3 py-1.5 bg-black/5 text-black rounded-xl text-xs font-semibold">{flag}</span>))}</div>
                          </div>
                        )}
                        {scan.badIngredients && <div className="mb-4"><p className="text-xs font-bold text-black mb-2">{t.scanner.badIngredients}:</p>{scan.badIngredients.map((ing, i) => (<p key={i} className="text-sm text-gray-700 flex items-center gap-2"><XCircle className="w-4 h-4 text-black" />{ing}</p>))}</div>}
                        {scan.goodIngredients && <div><p className="text-xs font-bold text-black mb-2">{t.scanner.goodIngredients}:</p>{scan.goodIngredients.map((ing, i) => (<p key={i} className="text-sm text-gray-700 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#D4FF00]" />{ing}</p>))}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
              <h3 className="text-xl font-bold text-black mb-6">{t.scanner.ingredientGuide}</h3>
              <div className="mb-6">
                <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2"><XCircle className="w-4 h-4" />{t.scanner.avoidThese}</h4>
                <div className="space-y-3">{ingredientGuide.filter(i => i.type === 'BAD').map((ing, idx) => (<div key={idx} className="p-4 bg-black/5 rounded-xl"><p className="text-sm font-bold text-black mb-1">{ing.name}</p><p className="text-xs text-gray-600">{ing.impact}</p></div>))}</div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4" />{t.scanner.chooseThese}</h4>
                <div className="space-y-3">{ingredientGuide.filter(i => i.type === 'GOOD').map((ing, idx) => (<div key={idx} className="p-4 bg-[#D4FF00]/10 rounded-xl border border-[#D4FF00]/20"><p className="text-sm font-bold text-black mb-1">{ing.name}</p><p className="text-xs text-gray-700">{ing.impact}</p></div>))}</div>
              </div>
            </div>
            <div className="bg-[#D4FF00] rounded-3xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center"><span className="text-xl">🤖</span></div>
                <h4 className="text-lg font-bold text-black">{t.scanner.zenoInsight}</h4>
              </div>
              <p className="text-sm text-black/80 leading-relaxed">{t.scanner.zenoInsightText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

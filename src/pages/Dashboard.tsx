import { TrendingDown, Droplet, Flame, Moon, Target, Award, Sparkles, ChevronRight, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { GarminDashboardWidget } from "../components/garmin/GarminDashboardWidget";
import { GarminSleepCard } from "../components/garmin/GarminSleepCard";
import { GarminActivityFeed } from "../components/garmin/GarminActivityFeed";

const omegaRatioData = [
  { day: "D1", ratio: 15 },
  { day: "D10", ratio: 12 },
  { day: "D20", ratio: 8.5 },
  { day: "D30", ratio: 6.2 },
  { day: "D40", ratio: 4.8 },
  { day: "D47", ratio: 4.2 },
];

const recentScans = [
  { name: "Extra Virgin Olive Oil", score: 92, verdict: "GOOD", time: "2h ago" },
  { name: "Canola Oil", score: 18, verdict: "BAD", time: "5h ago" },
  { name: "Wild Salmon", score: 95, verdict: "GOOD", time: "Yesterday" },
  { name: "Corn Syrup Cereal", score: 12, verdict: "BAD", time: "Yesterday" },
];

const zenoMessages = [
  { message: "Great job! Your Omega-6:3 ratio improved by 8% this week 🎉", type: "success" },
];

export function Dashboard() {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const displayName = profile?.display_name || profile?.email?.split('@')[0] || '';

  const dailyGoals = [
    { label: t.dashboard.omegaSupplement, current: 1, target: 1, progress: 100, icon: Target },
    { label: t.dashboard.waterIntake, current: 1.8, target: 2.5, progress: 72, unit: "L", icon: Droplet },
    { label: t.dashboard.sleepQuality, current: 3.8, target: 5, progress: 76, icon: Moon },
    { label: t.dashboard.antiInflammatoryMeals, current: 2, target: 3, progress: 67, icon: Flame },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-[#1a1a1a]">{t.dashboard.title}</h1>
            <div className="w-2 h-2 rounded-full bg-[#D4FF00]"></div>
          </div>
          <p className="text-sm text-gray-400">{t.common.welcomeBack}, {displayName}!</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6">

          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 space-y-4 lg:space-y-6">

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Wellness Score */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]"></div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Wellness</p>
                  </div>
                  <div className="px-2 py-1 bg-[#D4FF00]/10 rounded-md">
                    <span className="text-[10px] font-bold text-[#1a1a1a]">+8%</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <h2 className="text-4xl font-bold text-[#1a1a1a]">19,365</h2>
                  <span className="text-lg text-gray-300">.29</span>
                </div>
                <p className="text-xs text-gray-400">KCAL Today</p>
              </div>

              {/* Omega Ratio */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.dashboard.omegaRatio}</p>
                  </div>
                  <TrendingDown className="w-4 h-4 text-[#D4FF00]" />
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <h2 className="text-4xl font-bold text-[#1a1a1a]">4.2</h2>
                  <span className="text-lg text-gray-400">:1</span>
                </div>
                <p className="text-xs text-gray-400">Target: 3:1</p>
              </div>

              {/* Weight - Dark card */}
              <div className="bg-[#1a1a1a] rounded-2xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]"></div>
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{t.profile.weight}</p>
                  </div>
                  <div className="px-2 py-1 bg-[#D4FF00]/20 rounded-md">
                    <span className="text-[10px] font-bold text-[#D4FF00]">-2.7kg</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <h2 className="text-4xl font-bold text-white">88.5</h2>
                  <span className="text-lg text-white/40">kg</span>
                </div>
                <p className="text-xs text-white/40">Start: 91.2 kg</p>
              </div>
            </div>

            {/* Garmin Data Row (only shows when connected) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GarminDashboardWidget />
              <GarminSleepCard />
            </div>

            {/* Analytics Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]"></div>
                    <h3 className="text-sm font-bold text-[#1a1a1a]">Analytics</h3>
                  </div>
                  <p className="text-xs text-gray-400">Omega-6:3 Ratio Evolution</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-[#1a1a1a] text-white rounded-lg text-xs font-semibold">Tracker</button>
                  <button className="px-3 py-1.5 text-gray-400 hover:text-[#1a1a1a] rounded-lg text-xs font-semibold transition-colors">Medical</button>
                  <button className="px-3 py-1.5 text-gray-400 hover:text-[#1a1a1a] rounded-lg text-xs font-semibold transition-colors">Fitness</button>
                </div>
              </div>

              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={omegaRatioData} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '12px', fontSize: '12px', padding: '8px 12px' }}
                      labelStyle={{ color: '#fff' }}
                      itemStyle={{ color: '#D4FF00' }}
                    />
                    <Bar dataKey="ratio" fill="#1a1a1a" radius={[8, 8, 0, 0]} activeBar={{ fill: '#D4FF00' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Progress</p>
                  <p className="text-sm font-semibold text-[#1a1a1a]">72%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Improvement</p>
                  <p className="text-sm font-semibold text-[#1a1a1a]">-72% ratio</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Days remaining</p>
                  <p className="text-sm font-semibold text-[#1a1a1a]">73 days</p>
                </div>
              </div>
            </div>

            {/* Take a Breath */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-6">TAKE A<br/>BREATH NOW</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1">
                      <div className="w-20 h-20 rounded-full bg-[#D4FF00] flex items-center justify-center relative">
                        <span className="text-2xl font-bold text-[#1a1a1a]">10.57</span>
                        <div className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-[#D4FF00]/30 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-[#D4FF00]"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-xs text-gray-400 mb-2">Breath Level is Normal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>S</span><span>M</span><span>T</span>
                    <span className="w-6 h-6 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-semibold">W</span>
                    <span>T</span><span>F</span><span>S</span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <svg width="200" height="200" viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#f5f5f5" strokeWidth="12"/>
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#D4FF00" strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 80 * 0.73} ${2 * Math.PI * 80}`}
                        transform="rotate(-90 100 100)"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <p className="text-xs text-gray-400">Oxygen</p>
                      <p className="text-4xl font-bold text-[#1a1a1a]">97.5<span className="text-lg">%</span></p>
                      <p className="text-2xl font-bold text-[#1a1a1a] mt-2">89<span className="text-sm">bpm</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-4 space-y-4 lg:space-y-6">

            {/* Progress Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]"></div>
                <h3 className="text-sm font-bold text-[#1a1a1a]">Progress</h3>
              </div>
              <div className="mb-4 rounded-xl overflow-hidden bg-gray-100 h-32 flex items-center justify-center">
                <div className="text-center">
                  <Award className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Running</p>
                  <p className="text-2xl font-bold text-[#1a1a1a]">139</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Running</span>
                  <span className="font-semibold text-[#1a1a1a]">Biking</span>
                  <span className="text-gray-400">Short</span>
                </div>
              </div>
            </div>

            {/* Daily Goals / Checkbox */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                <h3 className="text-sm font-bold text-[#1a1a1a]">{t.dashboard.dailyGoals}</h3>
              </div>
              <div className="space-y-3">
                {dailyGoals.map((goal, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 flex-1">
                      <goal.icon className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs text-[#1a1a1a] font-medium">{goal.label}</p>
                        {goal.unit && (
                          <p className="text-[10px] text-gray-400">{goal.current}/{goal.target}{goal.unit}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {goal.progress === 100 ? (
                        <div className="w-6 h-6 rounded-full bg-[#D4FF00] flex items-center justify-center">
                          <ChevronRight className="w-4 h-4 text-[#1a1a1a]" />
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-[#1a1a1a]">{goal.progress}%</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Garmin Activities */}
            <GarminActivityFeed />

            {/* Workout */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]"></div>
                  <h3 className="text-sm font-bold text-[#1a1a1a]">Workout</h3>
                </div>
                <div className="px-2 py-1 bg-[#D4FF00] rounded-md">
                  <span className="text-[10px] font-bold text-[#1a1a1a]">+4%</span>
                </div>
              </div>
              <div className="mb-4 rounded-xl overflow-hidden bg-gray-100 h-24 flex items-center justify-center">
                <Activity className="w-8 h-8 text-gray-300" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#1a1a1a]">139</span>
                <span className="text-sm text-gray-400">/KCAL BURNED</span>
              </div>
            </div>

            {/* ZENO AI Insight */}
            <div className="bg-[#D4FF00] rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-[#D4FF00]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1a1a1a] mb-1">ZENO AI</h3>
                  <p className="text-xs text-[#1a1a1a]/70 leading-relaxed">
                    {zenoMessages[0].message}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Scans */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                <h3 className="text-sm font-bold text-[#1a1a1a]">{t.dashboard.recentScans}</h3>
              </div>
              <div className="space-y-3">
                {recentScans.slice(0, 3).map((scan, index) => (
                  <div key={index} className="flex items-center gap-3 py-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                      scan.verdict === 'GOOD'
                        ? 'bg-[#D4FF00]/20 text-[#1a1a1a]'
                        : 'bg-[#1a1a1a]/5 text-[#1a1a1a]'
                    }`}>
                      {scan.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#1a1a1a] truncate">{scan.name}</p>
                      <p className="text-[10px] text-gray-400">{scan.time}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-md ${
                      scan.verdict === 'GOOD'
                        ? 'bg-[#D4FF00]/20'
                        : 'bg-[#1a1a1a]/5'
                    }`}>
                      <span className="text-[10px] font-bold text-[#1a1a1a]">
                        {scan.verdict === 'GOOD' ? t.scanner.good : t.scanner.bad}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-xs font-semibold text-gray-400 hover:text-[#1a1a1a] transition-colors">
                {t.common.viewAll} →
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

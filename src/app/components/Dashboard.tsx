import { TrendingDown, Droplet, Flame, Moon, Target, Sparkles, ChevronRight, Activity, ClipboardCheck, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { GarminDashboardWidget } from "./garmin/GarminDashboardWidget";
import { GarminSleepCard } from "./garmin/GarminSleepCard";
import { GarminActivityFeed } from "./garmin/GarminActivityFeed";

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

const cardEntry = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Dashboard() {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const displayName = profile?.display_name || profile?.email?.split('@')[0] || '';

  const dailyGoals = [
    { label: t.dashboard.omegaSupplement, current: 1, target: 1, progress: 100, icon: Target },
    { label: t.dashboard.waterIntake, current: 1.8, target: 2.5, progress: 72, unit: "L", icon: Droplet },
    { label: t.dashboard.sleepQuality, current: 3.8, target: 5, progress: 76, icon: Moon },
    { label: t.dashboard.antiInflammatoryMeals, current: 2, target: 3, progress: 67, icon: Flame },
  ];

  const streak = 23;
  const xpToday = 20;
  const xpTarget = 100;

  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">

        {/* HERO BANNER, full-width Duolingo style */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden bg-violet-500 rounded-3xl p-8 md:p-10 mb-8 shadow-xl shadow-violet-500/20"
        >
          {/* Glow accent */}
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -right-10 -bottom-20 w-56 h-56 bg-violet-300/30 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="text-white/80 text-sm font-medium mb-2">{t.common.welcomeBack},</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
                {displayName || 'André'}
              </h1>
              <p className="text-white/80 text-base max-w-md">
                Você está no <span className="font-bold text-white">Dia 47</span> do Protocol 120. Continue assim, sua razão Ômega já caiu de 15:1 pra 4.2:1.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Streak */}
              <div className="bg-white/15 backdrop-blur rounded-2xl px-6 py-5 border border-white/20">
                <div className="flex items-center gap-3">
                  <Flame className="w-8 h-8 text-yellow-300" strokeWidth={2.5} />
                  <div>
                    <div className="text-3xl font-bold text-white leading-none">{streak}</div>
                    <div className="text-xs text-white/70 mt-1">dia streak</div>
                  </div>
                </div>
              </div>

              {/* XP */}
              <div className="bg-white/15 backdrop-blur rounded-2xl px-6 py-5 border border-white/20 min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span className="text-xs text-white/80 font-medium">XP hoje</span>
                </div>
                <div className="text-2xl font-bold text-white mb-2">{xpToday}<span className="text-sm text-white/60">/{xpTarget}</span></div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(xpToday / xpTarget) * 100}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-yellow-300 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* STAT TRIO, 3 big cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Wellness Score', value: '19,365', unit: '.29', sub: 'KCAL Today', trend: '+8%', icon: Activity, accent: 'success' },
            { label: t.dashboard.omegaRatio, value: '4.2', unit: ':1', sub: 'Target: 3:1', trend: '−72%', icon: TrendingDown, accent: 'violet' },
            { label: t.profile.weight, value: '88.5', unit: 'kg', sub: 'Start: 91.2 kg', trend: '−2.7kg', icon: Target, accent: 'violet-solid' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="show"
              variants={cardEntry}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`rounded-3xl p-7 shadow-lg cursor-default transition-shadow hover:shadow-xl ${
                stat.accent === 'violet-solid'
                  ? 'bg-violet-500 shadow-violet-500/20'
                  : 'bg-white border border-violet-100'
              }`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  stat.accent === 'violet-solid' ? 'bg-white/20' : 'bg-violet-100'
                }`}>
                  <stat.icon className={`w-6 h-6 ${stat.accent === 'violet-solid' ? 'text-white' : 'text-violet-500'}`} />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  stat.accent === 'violet-solid' ? 'bg-white/20 text-white' : 'bg-violet-50 text-violet-700'
                }`}>
                  {stat.trend}
                </div>
              </div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                stat.accent === 'violet-solid' ? 'text-white/70' : 'text-gray-400'
              }`}>
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2 mb-1">
                <h2 className={`text-5xl font-bold tracking-tight ${
                  stat.accent === 'violet-solid' ? 'text-white' : 'text-violet-950'
                }`}>
                  {stat.value}
                </h2>
                <span className={`text-xl ${
                  stat.accent === 'violet-solid' ? 'text-white/60' : 'text-gray-400'
                }`}>
                  {stat.unit}
                </span>
              </div>
              <p className={`text-sm ${
                stat.accent === 'violet-solid' ? 'text-white/70' : 'text-gray-500'
              }`}>
                {stat.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* MAIN GRID 12-col */}
        <div className="grid grid-cols-12 gap-6">

          {/* LEFT MAIN */}
          <div className="col-span-12 lg:col-span-8 space-y-6">

            {/* Analytics Chart, hero */}
            <motion.div
              initial="hidden" animate="show" custom={3} variants={cardEntry}
              className="bg-white rounded-3xl p-8 border border-violet-100 shadow-lg"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-violet-950 mb-1">Analytics</h3>
                  <p className="text-sm text-gray-500">Evolução da Razão Ômega-6:3</p>
                </div>
                <div className="flex items-center gap-1 bg-violet-50 rounded-2xl p-1">
                  <button className="px-4 py-2 bg-violet-500 text-white rounded-xl text-sm font-semibold shadow-sm">Tracker</button>
                  <button className="px-4 py-2 text-gray-500 hover:text-violet-950 rounded-xl text-sm font-semibold transition-colors">Medical</button>
                  <button className="px-4 py-2 text-gray-500 hover:text-violet-950 rounded-xl text-sm font-semibold transition-colors">Fitness</button>
                </div>
              </div>

              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={omegaRatioData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE9FE" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(102, 141, 255, 0.08)' }}
                      contentStyle={{ background: '#161B50', border: 'none', borderRadius: '16px', fontSize: '13px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(22, 27, 80, 0.25)' }}
                      labelStyle={{ color: '#fff', fontWeight: 600 }}
                      itemStyle={{ color: '#668DFF' }}
                    />
                    <Bar dataKey="ratio" fill="#668DFF" radius={[12, 12, 0, 0]} activeBar={{ fill: '#3646F4' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-violet-100">
                <div>
                  <p className="text-xs text-gray-400 mb-1 uppercase font-semibold tracking-wider">Progress</p>
                  <p className="text-2xl font-bold text-violet-950">72%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 uppercase font-semibold tracking-wider">Improvement</p>
                  <p className="text-2xl font-bold text-violet-950">−72%<span className="text-sm text-gray-500 ml-1">ratio</span></p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 uppercase font-semibold tracking-wider">Days remaining</p>
                  <p className="text-2xl font-bold text-violet-950">73<span className="text-sm text-gray-500 ml-1">days</span></p>
                </div>
              </div>
            </motion.div>

            {/* Garmin row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GarminDashboardWidget />
              <GarminSleepCard />
            </div>

            {/* Breath now, big and visual */}
            <motion.div
              initial="hidden" animate="show" custom={5} variants={cardEntry}
              className="bg-white rounded-3xl p-8 border border-violet-100 shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-violet-500 mb-2">Breathwork</p>
                  <h3 className="text-3xl font-bold text-violet-950 mb-5 leading-tight">Take a<br/>Breath Now</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-24 h-24 rounded-full bg-violet-500 flex items-center justify-center relative shadow-lg shadow-violet-500/30">
                      <span className="text-2xl font-bold text-white">10.57</span>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -right-2 -top-2 w-7 h-7 rounded-full bg-violet-300 flex items-center justify-center"
                      >
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Breath Level</p>
                      <p className="text-lg font-bold text-violet-950">Normal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 3 ? 'bg-violet-500 text-white shadow-md' : 'bg-violet-50 text-gray-400'
                        }`}
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <svg width="220" height="220" viewBox="0 0 220 220">
                      <circle cx="110" cy="110" r="90" fill="none" stroke="#EDE9FE" strokeWidth="14"/>
                      <motion.circle
                        cx="110" cy="110" r="90" fill="none" stroke="#668DFF" strokeWidth="14"
                        strokeDasharray={`${2 * Math.PI * 90}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 90 * 0.27 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        strokeLinecap="round"
                        transform="rotate(-90 110 110)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <p className="text-xs text-gray-500 font-medium">Oxygen</p>
                      <p className="text-4xl font-bold text-violet-950">97.5<span className="text-lg text-gray-400">%</span></p>
                      <p className="text-xl font-bold text-violet-500 mt-1">89<span className="text-xs text-gray-500 ml-1">bpm</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            {/* Daily Check-in CTA, hero card lateral */}
            <motion.button
              initial="hidden" animate="show" custom={2} variants={cardEntry}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/checkin')}
              className="w-full bg-violet-500 rounded-3xl p-6 flex items-center gap-4 shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-shadow text-left"
            >
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0">
                <ClipboardCheck className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-0.5">Daily Check-in</h3>
                <p className="text-sm text-white/85">Log de hoje pra ganhar +20 XP</p>
              </div>
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>

            {/* Daily Goals */}
            <motion.div
              initial="hidden" animate="show" custom={4} variants={cardEntry}
              className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-violet-950">{t.dashboard.dailyGoals}</h3>
                <span className="text-xs font-bold text-violet-500 bg-violet-50 px-3 py-1 rounded-full">3 / 4</span>
              </div>
              <div className="space-y-4">
                {dailyGoals.map((goal, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      goal.progress === 100 ? 'bg-violet-500 shadow-md shadow-violet-500/30' : 'bg-violet-50'
                    }`}>
                      <goal.icon className={`w-5 h-5 ${goal.progress === 100 ? 'text-white' : 'text-violet-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-violet-950 truncate">{goal.label}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-violet-50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                            className={`h-full rounded-full ${goal.progress === 100 ? 'bg-emerald-500' : 'bg-violet-500'}`}
                          />
                        </div>
                        <span className="text-xs font-bold text-violet-950 min-w-[36px] text-right">{goal.progress}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Garmin Activities */}
            <GarminActivityFeed />

            {/* ZENO AI Insight */}
            <motion.div
              initial="hidden" animate="show" custom={6} variants={cardEntry}
              className="relative overflow-hidden bg-violet-500 rounded-3xl p-6 shadow-lg shadow-violet-500/20"
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-white">ZENO AI</h3>
                    <span className="text-[10px] font-bold text-white/70 bg-white/20 px-2 py-0.5 rounded-full">SMART INSIGHT</span>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Boa, André! Sua razão Omega-6:3 melhorou 8% essa semana. Continue com a suplementação diária.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Recent Scans */}
            <motion.div
              initial="hidden" animate="show" custom={7} variants={cardEntry}
              className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-violet-950">{t.dashboard.recentScans}</h3>
                <button className="text-xs font-bold text-violet-500 hover:text-violet-700 transition-colors">
                  {t.common.viewAll} →
                </button>
              </div>
              <div className="space-y-3">
                {recentScans.slice(0, 3).map((scan, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-violet-50 transition-colors cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      scan.verdict === 'GOOD'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {scan.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-violet-950 truncate">{scan.name}</p>
                      <p className="text-xs text-gray-500">{scan.time}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      scan.verdict === 'GOOD'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {scan.verdict === 'GOOD' ? t.scanner.good : t.scanner.bad}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

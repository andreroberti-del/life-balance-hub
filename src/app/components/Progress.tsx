import { TrendingUp, Target, Award, Calendar, CheckCircle, Lock, Sparkles, Trophy, Star, Flame, Smartphone, Gem, Crown } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

const omegaEvolution = [
  { day: 1, ratio: 15 }, { day: 10, ratio: 12.5 }, { day: 20, ratio: 9.8 },
  { day: 30, ratio: 7.2 }, { day: 40, ratio: 5.1 }, { day: 47, ratio: 4.2 },
];

const weightEvolution = [
  { day: 1, weight: 91.2 }, { day: 10, weight: 90.8 }, { day: 20, weight: 90.2 },
  { day: 30, weight: 89.5 }, { day: 40, weight: 89.0 }, { day: 47, weight: 88.5 },
];

const cardEntry = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Progress() {
  const { t } = useLanguage();

  const milestones = [
    { day: 1, title: t.progress.protocolStart, completed: true, date: "Mar 22, 2026" },
    { day: 21, title: t.progress.habitFormation, completed: true, date: "Apr 12, 2026", description: t.progress.streakMilestone },
    { day: 30, title: t.progress.firstAssessment, completed: true, date: "Apr 21, 2026", description: t.progress.ratioImproved },
    { day: 47, title: t.progress.currentProgress, completed: true, date: t.common.today, current: true },
    { day: 60, title: t.progress.midPointCheck, completed: false, date: "May 21, 2026" },
    { day: 90, title: t.progress.advancedWellness, completed: false, date: "Jun 20, 2026" },
    { day: 120, title: t.progress.protocolComplete, completed: false, date: "Jul 20, 2026" },
  ];

  const activeGoals = [
    { id: 1, title: t.progress.reachOmegaRatio, current: 4.2, target: 3, progress: 72, deadline: "Jul 20, 2026" },
    { id: 2, title: t.progress.lose6kg, current: 88.5, target: 82, progress: 40, deadline: "Jul 20, 2026" },
    { id: 3, title: t.progress.sleepQuality, current: 3.8, target: 4.5, progress: 84, deadline: "Jun 20, 2026" },
  ];

  const achievements = [
    { id: 1, title: t.progress.firstWeek, description: t.progress.complete7days, Icon: Target, completed: true, date: "Mar 29, 2026", points: 100 },
    { id: 2, title: t.progress.omegaPioneer, description: t.progress.ratioBelow10, Icon: Sparkles, completed: true, date: "Apr 5, 2026", points: 250 },
    { id: 3, title: t.progress.threeWeeksStrong, description: t.progress.streak21days, Icon: Flame, completed: true, date: "Apr 12, 2026", points: 500 },
    { id: 4, title: t.progress.omegaMaster, description: t.progress.ratioBelow5, Icon: Star, completed: true, date: "May 3, 2026", points: 750 },
    { id: 5, title: t.progress.scannerPro, description: t.progress.foodScans50, Icon: Smartphone, completed: false, progress: 94, points: 300 },
    { id: 6, title: t.progress.omegaElite, description: t.progress.ratioBelow3, Icon: Gem, completed: false, progress: 72, points: 1000 },
    { id: 7, title: t.progress.day60Warrior, description: t.progress.streak60days, Icon: Trophy, completed: false, progress: 78, points: 1000 },
    { id: 8, title: t.progress.protocolComplete, description: t.progress.finish120days, Icon: Crown, completed: false, progress: 39, points: 2500 },
  ];

  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-violet-500 rounded-3xl p-8 md:p-10 mb-8 shadow-xl shadow-violet-500/20"
        >
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="text-white/80 text-sm font-medium mb-2 uppercase tracking-wider">{t.progress.title}</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
                Day 47 / 120
              </h1>
              <p className="text-white/85 text-base max-w-md">{t.progress.subtitle}. Você está em ritmo recordista.</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-6 py-5 border border-white/20 min-w-[220px]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/80 font-bold uppercase tracking-wider">Protocol</span>
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <div className="text-4xl font-bold text-white mb-3">39%</div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: '39%' }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="h-full bg-yellow-300 rounded-full"
                />
              </div>
              <p className="text-xs text-white/70 mt-2">73 dias restantes</p>
            </div>
          </div>
        </motion.div>

        {/* STAT TRIO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: t.progress.omegaImprovement, value: '72%', sub: `${t.progress.from} 15:1 ${t.progress.to} 4.2:1`, icon: TrendingUp, accent: 'violet-solid' },
            { label: t.progress.weightLost, value: '2.7', unit: 'kg', sub: `${t.progress.goal}: 6.0 kg`, icon: Target, accent: 'violet' },
            { label: t.progress.currentStreak, value: '21', unit: t.common.days, sub: t.progress.personalBest, icon: Award, accent: 'violet-solid' },
          ].map((stat, i) => (
            <motion.div
              key={i} custom={i} initial="hidden" animate="show" variants={cardEntry}
              whileHover={{ y: -4 }}
              className={`rounded-3xl p-7 shadow-lg transition-shadow hover:shadow-xl ${
                stat.accent === 'violet-solid' ? 'bg-violet-500 shadow-violet-500/20' : 'bg-white border border-violet-100'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                stat.accent === 'violet-solid' ? 'bg-white/20' : 'bg-violet-100'
              }`}>
                <stat.icon className={`w-6 h-6 ${stat.accent === 'violet-solid' ? 'text-white' : 'text-violet-500'}`} />
              </div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${stat.accent === 'violet-solid' ? 'text-white/70' : 'text-gray-400'}`}>{stat.label}</p>
              <div className="flex items-baseline gap-2 mb-1">
                <h2 className={`text-5xl font-bold tracking-tight ${stat.accent === 'violet-solid' ? 'text-white' : 'text-violet-950'}`}>{stat.value}</h2>
                {stat.unit && <span className={`text-xl ${stat.accent === 'violet-solid' ? 'text-white/60' : 'text-gray-400'}`}>{stat.unit}</span>}
              </div>
              <p className={`text-sm ${stat.accent === 'violet-solid' ? 'text-white/70' : 'text-gray-500'}`}>{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT 8-col */}
          <div className="col-span-12 lg:col-span-8 space-y-6">

            {/* Timeline */}
            <motion.div
              custom={3} initial="hidden" animate="show" variants={cardEntry}
              className="bg-white rounded-3xl p-8 border border-violet-100 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-violet-950 mb-6">Protocol Timeline</h3>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-violet-100 rounded-full"></div>
                <motion.div
                  initial={{ height: 0 }} animate={{ height: '57%' }}
                  transition={{ duration: 1.5, delay: 0.4 }}
                  className="absolute left-6 top-0 w-1 bg-violet-500 rounded-full"
                />
                <div className="space-y-6">
                  {milestones.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="relative pl-20"
                    >
                      <div className={`absolute left-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                        m.completed ? m.current
                          ? 'bg-yellow-400 text-violet-950 shadow-lg shadow-yellow-400/40 ring-4 ring-yellow-200'
                          : 'bg-violet-500 text-white shadow-md shadow-violet-500/20'
                        : 'bg-violet-100 text-violet-400'
                      }`}>
                        {m.completed ? <CheckCircle className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                      </div>
                      <div className={`p-5 rounded-2xl ${
                        m.current ? 'bg-violet-500 shadow-lg shadow-violet-500/20'
                        : m.completed ? 'bg-violet-50 border border-violet-100'
                        : 'bg-white border border-violet-100'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-bold ${m.current ? 'text-white' : 'text-violet-950'}`}>{m.title}</h4>
                          <span className={`text-xs font-bold ${m.current ? 'text-white/80' : 'text-gray-500'}`}>Day {m.day}</span>
                        </div>
                        <p className={`text-xs ${m.current ? 'text-white/70' : 'text-gray-500'}`}>{m.date}</p>
                        {m.description && <p className={`text-sm mt-2 ${m.current ? 'text-white/85' : 'text-gray-600'}`}>{m.description}</p>}
                        {m.current && (
                          <div className="mt-3 pt-3 border-t border-white/20">
                            <p className="text-sm font-bold text-yellow-300">{t.progress.youAreHere}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div custom={4} initial="hidden" animate="show" variants={cardEntry} className="bg-white rounded-3xl p-7 border border-violet-100 shadow-lg">
                <h3 className="text-lg font-bold text-violet-950 mb-4">{t.progress.omegaRatioEvolution}</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={omegaEvolution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE9FE" vertical={false} />
                    <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: '#161B50', border: 'none', borderRadius: '12px', fontSize: '12px', boxShadow: '0 8px 24px rgba(22,27,80,0.25)' }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#668DFF' }} />
                    <Area type="monotone" dataKey="ratio" stroke="#668DFF" fill="url(#omegaGrad)" strokeWidth={3} />
                    <defs><linearGradient id="omegaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#668DFF" stopOpacity={0.3}/><stop offset="100%" stopColor="#668DFF" stopOpacity={0}/></linearGradient></defs>
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
              <motion.div custom={5} initial="hidden" animate="show" variants={cardEntry} className="bg-white rounded-3xl p-7 border border-violet-100 shadow-lg">
                <h3 className="text-lg font-bold text-violet-950 mb-4">{t.progress.weightEvolution}</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={weightEvolution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE9FE" vertical={false} />
                    <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[80, 95]} />
                    <Tooltip contentStyle={{ background: '#161B50', border: 'none', borderRadius: '12px', fontSize: '12px' }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#668DFF' }} />
                    <Line type="monotone" dataKey="weight" stroke="#668DFF" strokeWidth={3} dot={{ fill: '#668DFF', r: 6, strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Active Goals */}
            <motion.div custom={6} initial="hidden" animate="show" variants={cardEntry} className="bg-white rounded-3xl p-8 border border-violet-100 shadow-lg">
              <h3 className="text-2xl font-bold text-violet-950 mb-6">{t.progress.activeGoals}</h3>
              <div className="space-y-4">
                {activeGoals.map((goal, i) => (
                  <motion.div
                    key={goal.id}
                    whileHover={{ x: 2 }}
                    className="p-6 rounded-2xl bg-violet-50 border border-violet-100 hover:border-violet-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-violet-950 text-lg">{goal.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                        <Calendar className="w-4 h-4 text-violet-500" /><span>{goal.deadline}</span>
                      </div>
                    </div>
                    <div className="flex items-end gap-3 mb-4">
                      <span className="text-4xl font-bold text-violet-950">{goal.current}</span>
                      <span className="text-gray-500 mb-1 font-semibold">/ {goal.target}</span>
                      <span className="ml-auto text-2xl font-bold text-violet-500">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-violet-100 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className="h-3 rounded-full bg-violet-500"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT 4-col */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            {/* Total Points */}
            <motion.div custom={2} initial="hidden" animate="show" variants={cardEntry} className="relative overflow-hidden bg-violet-500 rounded-3xl p-7 shadow-lg shadow-violet-500/20">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-yellow-300" />
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">{t.progress.totalPoints}</h3>
                </div>
                <p className="text-7xl font-bold text-white mb-2 tracking-tight">1,600</p>
                <p className="text-sm text-white/80">{t.progress.keepGoing}</p>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div custom={3} initial="hidden" animate="show" variants={cardEntry} className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg">
              <h3 className="text-lg font-bold text-violet-950 mb-5">{t.progress.achievements}</h3>
              <div className="space-y-3">
                {achievements.map((a, i) => (
                  <motion.div
                    key={a.id}
                    whileHover={{ x: 2 }}
                    className={`p-4 rounded-2xl transition-all ${
                      a.completed ? 'bg-violet-50 border-2 border-violet-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${a.completed ? 'bg-violet-500 shadow-md shadow-violet-500/20' : 'bg-gray-200'}`}>
                        <a.Icon className={`w-6 h-6 ${a.completed ? 'text-white' : 'text-gray-400'}`} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-violet-950 text-sm mb-1">{a.title}</h4>
                        <p className="text-xs text-gray-600 mb-2 truncate">{a.description}</p>
                        {a.completed ? (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-semibold">{a.date}</span>
                            <span className="text-xs font-bold text-violet-500">+{a.points} {t.progress.pts}</span>
                          </div>
                        ) : (
                          <div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }} animate={{ width: `${a.progress}%` }}
                                transition={{ duration: 1, delay: 0.4 + i * 0.05 }}
                                className="bg-violet-500 h-1.5 rounded-full"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 font-semibold">{a.progress}%</span>
                              <span className="text-xs font-bold text-gray-400">+{a.points} {t.progress.pts}</span>
                            </div>
                          </div>
                        )}
                      </div>
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

import { TrendingUp, Target, Award, Calendar, CheckCircle, Lock } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "../contexts/LanguageContext";

const omegaEvolution = [
  { day: 1, ratio: 15 }, { day: 10, ratio: 12.5 }, { day: 20, ratio: 9.8 },
  { day: 30, ratio: 7.2 }, { day: 40, ratio: 5.1 }, { day: 47, ratio: 4.2 },
];

const weightEvolution = [
  { day: 1, weight: 91.2 }, { day: 10, weight: 90.8 }, { day: 20, weight: 90.2 },
  { day: 30, weight: 89.5 }, { day: 40, weight: 89.0 }, { day: 47, weight: 88.5 },
];

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
    { id: 1, title: t.progress.firstWeek, description: t.progress.complete7days, icon: "🎯", completed: true, date: "Mar 29, 2026", points: 100 },
    { id: 2, title: t.progress.omegaPioneer, description: t.progress.ratioBelow10, icon: "🌟", completed: true, date: "Apr 5, 2026", points: 250 },
    { id: 3, title: t.progress.threeWeeksStrong, description: t.progress.streak21days, icon: "🔥", completed: true, date: "Apr 12, 2026", points: 500 },
    { id: 4, title: t.progress.omegaMaster, description: t.progress.ratioBelow5, icon: "⭐", completed: true, date: "May 3, 2026", points: 750 },
    { id: 5, title: t.progress.scannerPro, description: t.progress.foodScans50, icon: "📱", completed: false, progress: 94, points: 300 },
    { id: 6, title: t.progress.omegaElite, description: t.progress.ratioBelow3, icon: "💎", completed: false, progress: 72, points: 1000 },
    { id: 7, title: t.progress.day60Warrior, description: t.progress.streak60days, icon: "🏆", completed: false, progress: 78, points: 1000 },
    { id: 8, title: t.progress.protocolComplete, description: t.progress.finish120days, icon: "👑", completed: false, progress: 39, points: 2500 },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8 bg-[#FAFAFA]">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8"><h1 className="text-4xl md:text-5xl font-bold text-black mb-2">{t.progress.title}</h1><p className="text-sm text-gray-500">{t.progress.subtitle}</p></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-[#D4FF00] rounded-3xl p-6 shadow-lg"><div className="flex items-center gap-3 mb-3"><div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center"><TrendingUp className="w-6 h-6 text-white" /></div><div><p className="text-sm font-bold text-black/70 uppercase">{t.progress.omegaImprovement}</p><p className="text-4xl font-bold text-black">72%</p></div></div><p className="text-xs text-black/60">{t.progress.from} 15:1 {t.progress.to} 4.2:1</p></div>
          <div className="bg-black rounded-3xl p-6 text-white shadow-lg"><div className="flex items-center gap-3 mb-3"><div className="w-12 h-12 bg-[#D4FF00] rounded-2xl flex items-center justify-center"><Target className="w-6 h-6 text-black" /></div><div><p className="text-sm font-bold text-white/70 uppercase">{t.progress.weightLost}</p><p className="text-4xl font-bold">2.7 kg</p></div></div><p className="text-xs text-white/60">{t.progress.goal}: 6.0 kg {t.progress.remaining}</p></div>
          <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm"><div className="flex items-center gap-3 mb-3"><div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center"><Award className="w-6 h-6 text-white" /></div><div><p className="text-sm font-bold text-gray-500 uppercase">{t.progress.currentStreak}</p><p className="text-4xl font-bold text-black">21 {t.common.days}</p></div></div><p className="text-xs text-gray-500">{t.progress.personalBest}</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
              <h3 className="text-xl font-bold text-black mb-6">Protocol Timeline</h3>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-100 rounded-full"></div>
                <div className="absolute left-6 top-0 w-1 bg-black rounded-full" style={{ height: '57%' }}></div>
                <div className="space-y-6">
                  {milestones.map((m, i) => (
                    <div key={i} className="relative pl-16">
                      <div className={`absolute left-0 w-12 h-12 rounded-2xl flex items-center justify-center ${m.completed ? m.current ? 'bg-[#D4FF00] text-black shadow-lg shadow-[#D4FF00]/20' : 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {m.completed ? <CheckCircle className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                      </div>
                      <div className={`p-4 rounded-2xl ${m.current ? 'bg-[#D4FF00]/10 border-2 border-[#D4FF00]' : m.completed ? 'bg-gray-50 border border-gray-200' : 'bg-white border border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-1"><h4 className="font-bold text-black">{m.title}</h4><span className="text-xs font-bold text-gray-500">Day {m.day}</span></div>
                        <p className="text-xs text-gray-500">{m.date}</p>
                        {m.description && <p className="text-sm text-gray-600 mt-2">{m.description}</p>}
                        {m.current && <div className="mt-3 pt-3 border-t border-[#D4FF00]/30"><p className="text-sm font-bold text-black">You are here! 🎯</p></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
                <h3 className="text-lg font-bold text-black mb-5">Omega Ratio Evolution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={omegaEvolution}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} /><XAxis dataKey="day" stroke="#9CA3AF" tick={{ fill: '#9ca3af', fontSize: 12 }} /><YAxis stroke="#9CA3AF" tick={{ fill: '#9ca3af', fontSize: 12 }} /><Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px' }} /><Area type="monotone" dataKey="ratio" stroke="#1a1a1a" fill="url(#omegaGrad2)" strokeWidth={3} /><defs><linearGradient id="omegaGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a1a1a" stopOpacity={0.2}/><stop offset="100%" stopColor="#1a1a1a" stopOpacity={0}/></linearGradient></defs></AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
                <h3 className="text-lg font-bold text-black mb-5">Weight Evolution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={weightEvolution}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} /><XAxis dataKey="day" stroke="#9CA3AF" tick={{ fill: '#9ca3af', fontSize: 12 }} /><YAxis stroke="#9CA3AF" tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[80, 95]} /><Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px' }} /><Line type="monotone" dataKey="weight" stroke="#1a1a1a" strokeWidth={3} dot={{ fill: '#1a1a1a', r: 5 }} /></LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
              <h3 className="text-xl font-bold text-black mb-6">Active Goals</h3>
              <div className="space-y-5">
                {activeGoals.map((goal) => (
                  <div key={goal.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center justify-between mb-3"><h4 className="font-bold text-black">{goal.title}</h4><div className="flex items-center gap-2 text-xs text-gray-500 font-semibold"><Calendar className="w-4 h-4" /><span>{goal.deadline}</span></div></div>
                    <div className="flex items-end gap-3 mb-3"><span className="text-4xl font-bold text-black">{goal.current}</span><span className="text-gray-500 mb-1 font-semibold">/ {goal.target}</span></div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-gray-600 font-semibold">Progress</span><span className="font-bold text-black">{goal.progress}%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"><div className="h-3 rounded-full bg-black" style={{ width: `${goal.progress}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
              <h3 className="text-xl font-bold text-black mb-5">Achievements</h3>
              <div className="space-y-3">
                {achievements.map((a) => (
                  <div key={a.id} className={`p-4 rounded-2xl border-2 transition-all ${a.completed ? 'bg-[#D4FF00]/10 border-[#D4FF00]' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`text-3xl ${a.completed ? '' : 'grayscale opacity-40'}`}>{a.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-black text-sm mb-1">{a.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">{a.description}</p>
                        {a.completed ? (
                          <div className="flex items-center justify-between"><span className="text-xs text-gray-500 font-semibold">{a.date}</span><span className="text-xs font-bold text-black">+{a.points} pts</span></div>
                        ) : (
                          <div><div className="w-full bg-gray-200 rounded-full h-1.5 mb-1 overflow-hidden"><div className="bg-black h-1.5 rounded-full" style={{ width: `${a.progress}%` }} /></div><div className="flex items-center justify-between"><span className="text-xs text-gray-500 font-semibold">{a.progress}%</span><span className="text-xs font-bold text-gray-400">+{a.points} pts</span></div></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#D4FF00] rounded-3xl p-6 shadow-lg"><h3 className="text-lg font-bold text-black mb-5">Total Points</h3><div className="text-center"><p className="text-6xl font-bold text-black mb-2">1,600</p><p className="text-sm text-black/60">Keep going to unlock more!</p></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

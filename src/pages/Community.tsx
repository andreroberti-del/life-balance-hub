import { Users, TrendingUp, Award, Flame, Heart, Target, Crown, Star, Medal } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const communityStats = [
  { label: "totalMembers", value: "2,847", icon: Users },
  { label: "totalWeightLost", value: "12,340 kg", icon: TrendingUp },
  { label: "avgOmegaRatio", value: "4.2:1", icon: Target },
  { label: "betterSleep", value: "73%", icon: Heart },
];

const weeklyLeaderboard = [
  { rank: 1, name: "Sarah Johnson", streak: 45, badges: 8, omegaRatio: 3.2, level: "leader", avatar: "👩‍💼" },
  { rank: 2, name: "Mike Chen", streak: 38, badges: 7, omegaRatio: 3.5, level: "ambassador", avatar: "👨‍💻" },
  { rank: 3, name: "Daniel Melo", streak: 21, badges: 5, omegaRatio: 4.2, level: "leader", avatar: "👤", isCurrentUser: true },
  { rank: 4, name: "Emily Rodriguez", streak: 28, badges: 6, omegaRatio: 4.1, level: "member", avatar: "👩‍🎨" },
  { rank: 5, name: "James Wilson", streak: 19, badges: 4, omegaRatio: 4.8, level: "member", avatar: "👨‍💼" },
];

const protocolGroups = [
  { name: "March 2026 Cohort", members: 347, startDate: "Mar 1, 2026", avgProgress: 39, active: true },
  { name: "February 2026 Cohort", members: 412, startDate: "Feb 1, 2026", avgProgress: 72, active: false },
  { name: "January 2026 Cohort", members: 389, startDate: "Jan 1, 2026", avgProgress: 95, active: false },
];

const participationLevels = [
  { level: "leader", requirements: "leaderReq", members: 47, icon: Crown },
  { level: "ambassador", requirements: "ambassadorReq", members: 128, icon: Star },
  { level: "member", requirements: "memberReq", members: 847, icon: Medal },
  { level: "committed", requirements: "committedReq", members: 1215, icon: Flame },
];

export function Community() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen p-6 md:p-8 bg-[#FAFAFA]">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">{t.community.title}</h1>
          <p className="text-sm text-gray-500">{t.community.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {communityStats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-200/50">
              <div className="flex items-center gap-2 mb-3"><stat.icon className="w-5 h-5 text-gray-400" /><p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{t.community[stat.label as keyof typeof t.community]}</p></div>
              <p className="text-4xl font-bold text-black">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#D4FF00] rounded-3xl p-8 shadow-lg">
            <p className="text-sm font-bold text-black/70 mb-2 uppercase tracking-wide">{t.community.improvedRatio}</p>
            <div className="flex items-baseline gap-2 mb-2"><span className="text-5xl font-bold text-black">12:1</span><span className="text-3xl text-black/50">→</span><span className="text-5xl font-bold text-black">4.2:1</span></div>
            <p className="text-xs text-black/60">{t.community.communityAverage}</p>
          </div>
          <div className="bg-black rounded-3xl p-8 text-white shadow-lg">
            <p className="text-sm font-bold text-white/70 mb-2 uppercase tracking-wide">{t.community.lessJointPain}</p>
            <div className="flex items-baseline gap-2 mb-2"><span className="text-6xl font-bold">89%</span><span className="text-sm text-white/70">{t.community.ofMembers}</span></div>
            <p className="text-xs text-white/60">{t.community.significantImprovement}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
              <h3 className="text-xl font-bold text-black mb-6">{t.community.weeklyLeaderboard}</h3>
              <div className="space-y-3">
                {weeklyLeaderboard.map((user) => (
                  <div key={user.rank} className={`p-5 rounded-2xl border-2 transition-all ${user.isCurrentUser ? 'bg-[#D4FF00]/10 border-[#D4FF00]' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${user.rank === 1 ? 'bg-[#D4FF00] text-black' : user.rank === 2 ? 'bg-gray-300 text-white' : user.rank === 3 ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>{user.rank}</div>
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-3xl">{user.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-black">{user.name}</h4>
                          {user.isCurrentUser && <span className="px-2 py-0.5 bg-black text-white rounded-full text-xs font-bold">{t.community.you}</span>}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" /><span className="font-semibold">{user.streak} {t.common.days}</span></div>
                          <div className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /><span className="font-semibold">{user.badges} {t.community.badges}</span></div>
                          <div className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /><span className="font-semibold">{user.omegaRatio}:1</span></div>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-xs font-bold ${user.level === 'leader' ? 'bg-[#D4FF00] text-black' : user.level === 'ambassador' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>{t.community[user.level as keyof typeof t.community]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
              <h3 className="text-xl font-bold text-black mb-6">{t.community.protocolGroups}</h3>
              <div className="space-y-4">
                {protocolGroups.map((group, i) => (
                  <div key={i} className={`p-5 rounded-2xl border-2 ${group.active ? 'bg-black/5 border-black/20' : 'border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div><h4 className="font-bold text-black mb-1">{group.name}</h4><p className="text-xs text-gray-500">{t.community.started} {group.startDate}</p></div>
                      {group.active && <span className="px-3 py-1.5 bg-[#D4FF00] text-black rounded-xl text-xs font-bold">{t.community.active}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-semibold">{group.members} {t.common.members}</span>
                      <div className="flex items-center gap-3"><span className="text-sm font-bold text-black">{group.avgProgress}%</span><div className="w-32 bg-gray-100 rounded-full h-2.5 overflow-hidden"><div className="bg-black h-2.5 rounded-full" style={{ width: `${group.avgProgress}%` }}></div></div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
              <h3 className="text-xl font-bold text-black mb-6">{t.community.participationLevels}</h3>
              <div className="space-y-4">
                {participationLevels.map((level, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-gray-100 hover:border-black/20 transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center flex-shrink-0"><level.icon className="w-5 h-5 text-white" /></div>
                      <div className="flex-1"><h4 className="font-bold text-black mb-1">{t.community[level.level as keyof typeof t.community]}</h4><p className="text-xs text-gray-500 leading-relaxed">{t.community[level.requirements as keyof typeof t.community]}</p></div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100"><span className="text-xs text-gray-600 font-semibold">{t.common.members}</span><span className="text-sm font-bold text-black">{level.members.toLocaleString()}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#D4FF00] rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-black mb-5">{t.community.yourCommunityImpact}</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-sm text-black/70 font-semibold">{t.community.currentLevel}</span><span className="text-lg font-bold text-black">{t.community.leader}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-black/70 font-semibold">{t.community.rankInCohort}</span><span className="text-lg font-bold text-black">#3 of 347</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-black/70 font-semibold">{t.community.peopleInspired}</span><span className="text-lg font-bold text-black">12</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

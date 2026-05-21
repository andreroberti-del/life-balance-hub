import { Users, TrendingUp, Award, Flame, Heart, Target, Crown, Star, Medal } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

const communityStats = [
  { label: "totalMembers", value: "2,847", icon: Users },
  { label: "totalWeightLost", value: "12,340 kg", icon: TrendingUp },
  { label: "avgOmegaRatio", value: "4.2:1", icon: Target },
  { label: "betterSleep", value: "73%", icon: Heart },
];

const weeklyLeaderboard = [
  { rank: 1, name: "Sarah Johnson", streak: 45, badges: 8, omegaRatio: 3.2, level: "leader", initials: "SJ" },
  { rank: 2, name: "Mike Chen", streak: 38, badges: 7, omegaRatio: 3.5, level: "ambassador", initials: "MC" },
  { rank: 3, name: "Daniel Melo", streak: 21, badges: 5, omegaRatio: 4.2, level: "leader", initials: "DM", isCurrentUser: true },
  { rank: 4, name: "Emily Rodriguez", streak: 28, badges: 6, omegaRatio: 4.1, level: "member", initials: "ER" },
  { rank: 5, name: "James Wilson", streak: 19, badges: 4, omegaRatio: 4.8, level: "member", initials: "JW" },
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

const cardEntry = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Community() {
  const { t } = useLanguage();
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
          <div className="relative">
            <p className="text-white/80 text-sm font-medium mb-2 uppercase tracking-wider">{t.community.title}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
              Sua tribo wellness
            </h1>
            <p className="text-white/85 text-base max-w-xl mb-6">{t.community.subtitle}</p>

            {/* Inline stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {communityStats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20"
                >
                  <stat.icon className="w-5 h-5 text-white/80 mb-2" />
                  <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                  <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider mt-1">{t.community[stat.label as keyof typeof t.community]}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* IMPACT HIGHLIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            custom={0} initial="hidden" animate="show" variants={cardEntry}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden bg-violet-500 rounded-3xl p-8 shadow-lg shadow-violet-500/20"
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              <p className="text-xs font-bold text-white/80 mb-3 uppercase tracking-wider">{t.community.improvedRatio}</p>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-6xl font-bold text-white">12:1</span>
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-4xl text-white/60">→</motion.span>
                <span className="text-6xl font-bold text-yellow-300">4.2:1</span>
              </div>
              <p className="text-sm text-white/80">{t.community.communityAverage}</p>
            </div>
          </motion.div>

          <motion.div
            custom={1} initial="hidden" animate="show" variants={cardEntry}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden bg-white rounded-3xl p-8 border border-violet-100 shadow-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-bold text-violet-500 uppercase tracking-wider">{t.community.lessJointPain}</p>
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-6xl font-bold text-violet-950">89<span className="text-3xl text-gray-400">%</span></span>
              <span className="text-sm text-gray-500">{t.community.ofMembers}</span>
            </div>
            <p className="text-sm text-gray-500">{t.community.significantImprovement}</p>
          </motion.div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-6">

          {/* LEFT 8-col */}
          <div className="col-span-12 lg:col-span-8 space-y-6">

            {/* Leaderboard */}
            <motion.div
              custom={2} initial="hidden" animate="show" variants={cardEntry}
              className="bg-white rounded-3xl p-8 border border-violet-100 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-violet-950">{t.community.weeklyLeaderboard}</h3>
                <div className="flex items-center gap-1 bg-violet-50 rounded-xl p-1">
                  <button className="px-4 py-2 bg-violet-500 text-white rounded-lg text-xs font-bold">{t.community.thisWeek}</button>
                  <button className="px-4 py-2 text-gray-500 rounded-lg text-xs font-bold">{t.community.allTime}</button>
                </div>
              </div>
              <div className="space-y-3">
                {weeklyLeaderboard.map((user, i) => (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    whileHover={{ x: 4 }}
                    className={`p-5 rounded-2xl border-2 transition-all ${
                      user.isCurrentUser
                        ? 'bg-violet-500 border-violet-500 shadow-lg shadow-violet-500/20'
                        : 'bg-violet-50 border-violet-100 hover:border-violet-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank medal */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 ${
                        user.rank === 1 ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-400/40' :
                        user.rank === 2 ? 'bg-gray-300 text-gray-700 shadow-md' :
                        user.rank === 3 ? 'bg-orange-300 text-orange-900 shadow-md' :
                        user.isCurrentUser ? 'bg-white/20 text-white' : 'bg-white text-violet-700'
                      }`}>
                        {user.rank}
                      </div>
                      {/* Avatar */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-base font-bold flex-shrink-0 ${
                        user.isCurrentUser ? 'bg-white/20 backdrop-blur ring-2 ring-white/40 text-white' : 'bg-white shadow-sm text-violet-700'
                      }`}>{user.initials}</div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-bold truncate ${user.isCurrentUser ? 'text-white' : 'text-violet-950'}`}>{user.name}</h4>
                          {user.isCurrentUser && <span className="px-2 py-0.5 bg-yellow-300 text-violet-950 rounded-full text-[10px] font-bold uppercase">{t.community.you}</span>}
                        </div>
                        <div className={`flex flex-wrap items-center gap-3 text-xs ${user.isCurrentUser ? 'text-white/85' : 'text-gray-600'}`}>
                          <div className="flex items-center gap-1"><Flame className={`w-3.5 h-3.5 ${user.isCurrentUser ? 'text-yellow-300' : 'text-orange-500'}`} /><span className="font-semibold">{user.streak} {t.common.days}</span></div>
                          <div className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /><span className="font-semibold">{user.badges} {t.community.badges}</span></div>
                          <div className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /><span className="font-semibold">{user.omegaRatio}:1</span></div>
                        </div>
                      </div>
                      {/* Level badge */}
                      <div className={`px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0 ${
                        user.isCurrentUser ? 'bg-white text-violet-700' :
                        user.level === 'leader' ? 'bg-violet-500 text-white' :
                        user.level === 'ambassador' ? 'bg-violet-200 text-violet-800' : 'bg-white text-gray-700'
                      }`}>{t.community[user.level as keyof typeof t.community]}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Protocol Groups */}
            <motion.div
              custom={3} initial="hidden" animate="show" variants={cardEntry}
              className="bg-white rounded-3xl p-8 border border-violet-100 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-violet-950 mb-6">{t.community.protocolGroups}</h3>
              <div className="space-y-4">
                {protocolGroups.map((group, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -2 }}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      group.active ? 'bg-violet-500 border-violet-500 shadow-md shadow-violet-500/20' : 'bg-violet-50 border-violet-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className={`font-bold mb-1 ${group.active ? 'text-white' : 'text-violet-950'}`}>{group.name}</h4>
                        <p className={`text-xs ${group.active ? 'text-white/80' : 'text-gray-500'}`}>{t.community.started} {group.startDate}</p>
                      </div>
                      {group.active && <span className="px-3 py-1.5 bg-yellow-300 text-violet-950 rounded-full text-xs font-bold uppercase">{t.community.active}</span>}
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Users className={`w-4 h-4 ${group.active ? 'text-white/80' : 'text-violet-500'}`} />
                        <span className={`text-sm font-semibold ${group.active ? 'text-white' : 'text-violet-950'}`}>{group.members} {t.common.members}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-1 max-w-[300px]">
                        <div className={`flex-1 h-2.5 rounded-full overflow-hidden ${group.active ? 'bg-white/20' : 'bg-violet-100'}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${group.avgProgress}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className={`h-full rounded-full ${group.active ? 'bg-yellow-300' : 'bg-violet-500'}`}
                          />
                        </div>
                        <span className={`text-sm font-bold min-w-[40px] text-right ${group.active ? 'text-white' : 'text-violet-950'}`}>{group.avgProgress}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT 4-col */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            {/* Your Impact */}
            <motion.div
              custom={2} initial="hidden" animate="show" variants={cardEntry}
              className="relative overflow-hidden bg-violet-500 rounded-3xl p-7 shadow-lg shadow-violet-500/20"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <Crown className="w-5 h-5 text-yellow-300" />
                  <h3 className="text-lg font-bold text-white">{t.community.yourCommunityImpact}</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="text-sm text-white/80 font-medium">{t.community.currentLevel}</span>
                    <span className="text-base font-bold text-yellow-300">{t.community.leader}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="text-sm text-white/80 font-medium">{t.community.rankInCohort}</span>
                    <span className="text-base font-bold text-white">#3 / 347</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/80 font-medium">{t.community.peopleInspired}</span>
                    <span className="text-2xl font-bold text-white">12</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Participation Levels */}
            <motion.div
              custom={3} initial="hidden" animate="show" variants={cardEntry}
              className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg"
            >
              <h3 className="text-lg font-bold text-violet-950 mb-5">{t.community.participationLevels}</h3>
              <div className="space-y-3">
                {participationLevels.map((level, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 2 }}
                    className="p-4 rounded-2xl bg-violet-50 border border-violet-100 hover:border-violet-300 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-500/20">
                        <level.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-violet-950 mb-1">{t.community[level.level as keyof typeof t.community]}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{t.community[level.requirements as keyof typeof t.community]}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-violet-100">
                      <span className="text-xs text-gray-500 font-semibold uppercase">{t.common.members}</span>
                      <span className="text-base font-bold text-violet-500">{level.members.toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Community Tip */}
            <motion.div
              custom={4} initial="hidden" animate="show" variants={cardEntry}
              className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 mb-1">{t.community.communityTip}</h4>
                  <p className="text-sm text-emerald-700 leading-relaxed">{t.community.communityTipText}</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

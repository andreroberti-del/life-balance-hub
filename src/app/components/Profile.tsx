import { User, Mail, Calendar, Bell, Lock, Palette, Globe, Target, Droplet, Moon, TrendingUp, Users, Crown, Edit, Trophy, Zap, Pill, Award } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { GarminConnectCard } from "./garmin/GarminConnectCard";
import { EditProfileModal } from "./EditProfileModal";

const cardEntry = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Profile() {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const profileData = {
    name: profile?.display_name || t.user.name,
    email: profile?.email || "",
    age: profile?.age || null,
    joinDate: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "March 2026",
    badge: t.user.title,
    avatarUrl: profile?.avatar_url,
  };
  const healthMetrics = [
    { label: t.dashboard.omegaRatio, value: "4.2:1", icon: TrendingUp, color: "violet" },
    { label: t.profile.weight, value: "88.5 kg", icon: Target, color: "violet" },
    { label: t.profile.waist, value: "96 cm", icon: Target, color: "violet" },
    { label: t.profile.sleep, value: "3.8/5", icon: Moon, color: "violet" },
    { label: t.profile.water, value: "1.8L", icon: Droplet, color: "violet" },
    { label: t.profile.protocol, value: t.common.day + " 47", icon: Calendar, color: "violet" },
  ];
  const peerBenchmark = {
    group: "Men, 35-40 years, 85-90 kg, Florida", totalPeers: 247,
    metrics: [
      { label: t.dashboard.omegaRatio, yourValue: 4.2, peerAvg: 6.8, better: true },
      { label: t.profile.weightLoss, yourValue: 2.7, peerAvg: 1.9, better: true, unit: "kg" },
      { label: t.profile.sleepQuality, yourValue: 3.8, peerAvg: 3.2, better: true },
      { label: t.profile.streak, yourValue: 21, peerAvg: 14, better: true, unit: t.common.days },
    ]
  };
  const settingsSections = [
    { title: t.profile.zenoNotifications, items: [
      { icon: Bell, label: t.profile.dailyGoals, description: t.profile.dailyGoalsDesc, enabled: true },
      { icon: Bell, label: t.profile.progressUpdates, description: t.profile.progressUpdatesDesc, enabled: true },
      { icon: Bell, label: t.nav.community, description: t.profile.communityUpdatesDesc, enabled: false },
    ]},
    { title: t.profile.preferences, items: [
      { icon: Palette, label: t.profile.theme, description: t.profile.appAppearance, value: t.profile.light },
      { icon: Globe, label: t.profile.language, description: "English (US)", value: "EN-US" },
    ]},
    { title: t.profile.security, items: [
      { icon: Lock, label: t.profile.password, description: t.profile.changePassword, action: t.profile.change },
      { icon: User, label: t.profile.privacy, description: t.profile.privacySettings, action: t.profile.manage },
    ]},
  ];

  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">

        {/* HERO PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden bg-violet-500 rounded-3xl p-8 md:p-10 mb-8 shadow-xl shadow-violet-500/20"
        >
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-20 w-56 h-56 bg-violet-300/30 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-3xl bg-white/20 backdrop-blur border-4 border-white/40 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg">
              {profileData.avatarUrl ? (
                <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : <User className="w-16 h-16 text-white/80" strokeWidth={1.5} />}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">{profileData.badge}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">{profileData.name}</h1>
              <div className="flex flex-col sm:flex-row gap-4 text-white/85 text-sm">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /><span>{profileData.email}</span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{t.profile.memberSince} {profileData.joinDate}</span></div>
              </div>
            </div>

            {/* Edit button */}
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => setEditOpen(true)}
              className="bg-white text-violet-700 px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <Edit className="w-5 h-5" />Edit Profile
            </motion.button>
          </div>
        </motion.div>

        {/* IMPACT STATS (3-col) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total XP', value: '1,600', sub: 'Lifetime points', icon: Zap, accent: 'yellow' },
            { label: 'Achievements', value: '4/8', sub: '50% unlocked', icon: Trophy, accent: 'violet' },
            { label: 'Community Rank', value: '#3', sub: 'Top 5% global', icon: Award, accent: 'violet-solid' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i} initial="hidden" animate="show" variants={cardEntry}
              whileHover={{ y: -4 }}
              className={`rounded-3xl p-7 shadow-lg transition-shadow hover:shadow-xl ${
                stat.accent === 'violet-solid'
                  ? 'bg-violet-500 shadow-violet-500/20'
                  : 'bg-white border border-violet-100'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                stat.accent === 'violet-solid' ? 'bg-white/20' :
                stat.accent === 'yellow' ? 'bg-yellow-100' : 'bg-violet-100'
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.accent === 'violet-solid' ? 'text-white' :
                  stat.accent === 'yellow' ? 'text-yellow-600' : 'text-violet-500'
                }`} />
              </div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                stat.accent === 'violet-solid' ? 'text-white/70' : 'text-gray-400'
              }`}>{stat.label}</p>
              <h2 className={`text-5xl font-bold tracking-tight mb-1 ${
                stat.accent === 'violet-solid' ? 'text-white' : 'text-violet-950'
              }`}>{stat.value}</h2>
              <p className={`text-sm ${
                stat.accent === 'violet-solid' ? 'text-white/70' : 'text-gray-500'
              }`}>{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* MAIN GRID 12-col */}
        <div className="grid grid-cols-12 gap-6">

          {/* LEFT MAIN 8-col */}
          <div className="col-span-12 lg:col-span-8 space-y-6">

            {/* Health Data */}
            <motion.div
              custom={3} initial="hidden" animate="show" variants={cardEntry}
              className="bg-white rounded-3xl p-8 border border-violet-100 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-violet-950 mb-6">{t.profile.healthData}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {healthMetrics.map((m, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="bg-violet-50 rounded-2xl p-5 border border-violet-100 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center mb-3 shadow-md shadow-violet-500/20">
                      <m.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">{m.label}</p>
                    <p className="text-2xl font-bold text-violet-950">{m.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Metabolic Age */}
            <motion.div
              custom={4} initial="hidden" animate="show" variants={cardEntry}
              className="bg-white rounded-3xl p-8 border border-violet-100 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-violet-950 mb-6">{t.profile.metabolicAge}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="85" stroke="#EDE9FE" strokeWidth="14" fill="none" />
                      <motion.circle
                        cx="100" cy="100" r="85" stroke="#668DFF" strokeWidth="14" fill="none"
                        strokeDasharray={`${2 * Math.PI * 85}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 85 * 0.45 }}
                        transition={{ duration: 1.4, ease: 'easeOut' }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-6xl font-bold text-violet-950">42</p>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">years</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-5 bg-violet-50 rounded-2xl border border-violet-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Real Age</p>
                        <p className="text-xs text-gray-500 mt-1">{t.profile.chronologicalAge}</p>
                      </div>
                      <span className="text-4xl font-bold text-violet-950">{profileData.age || 41}</span>
                    </div>
                  </div>
                  <div className="p-5 bg-violet-100 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-violet-700 uppercase font-bold tracking-wider">{t.profile.metabolicAgeLabel}</p>
                        <p className="text-xs text-violet-700/70 mt-1">{t.profile.basedOnMetrics}</p>
                      </div>
                      <span className="text-4xl font-bold text-violet-700">42</span>
                    </div>
                  </div>
                  <div className="p-5 bg-violet-500 rounded-2xl shadow-lg shadow-violet-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white uppercase font-bold tracking-wider">{t.profile.targetAge}</p>
                        <p className="text-xs text-white/80 mt-1">{t.profile.wellnessGoal}</p>
                      </div>
                      <span className="text-4xl font-bold text-white">34</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-900">{t.profile.greatProgress}</p>
                  <p className="text-xs text-emerald-700 mt-1">{t.profile.improvedMetabolicAge}</p>
                </div>
              </div>
            </motion.div>

            {/* Peer Benchmark */}
            <motion.div
              custom={5} initial="hidden" animate="show" variants={cardEntry}
              className="bg-white rounded-3xl p-8 border border-violet-100 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-violet-950 mb-1">{t.profile.peerBenchmark}</h3>
                  <p className="text-xs text-gray-500">{peerBenchmark.group}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Users className="w-5 h-5 text-violet-500" />
                    <span className="text-3xl font-bold text-violet-950">{peerBenchmark.totalPeers}</span>
                  </div>
                  <p className="text-xs text-gray-500">{t.profile.similarPeople}</p>
                </div>
              </div>
              <div className="space-y-3">
                {peerBenchmark.metrics.map((m, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-violet-50 border border-violet-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-violet-950">{m.label}</span>
                      {m.better && <span className="px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-bold">↑ {t.profile.betterThanAvg}</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-violet-500 mb-2 font-bold uppercase tracking-wider">{t.profile.you}</p>
                        <p className="text-3xl font-bold text-violet-950">{m.yourValue}{m.unit && <span className="text-base text-gray-500 ml-1">{m.unit}</span>}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-wider">{t.profile.peerAverage}</p>
                        <p className="text-3xl font-bold text-gray-300">{m.peerAvg}{m.unit && <span className="text-base text-gray-300 ml-1">{m.unit}</span>}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDEBAR 4-col */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <GarminConnectCard />

            {/* Premium Omega-3 card */}
            <motion.div
              custom={2} initial="hidden" animate="show" variants={cardEntry}
              className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg"
            >
              <h3 className="text-lg font-bold text-violet-950 mb-5">{t.profile.omegaSupplement}</h3>
              <div className="relative overflow-hidden bg-violet-500 rounded-2xl p-6 mb-5 shadow-md shadow-violet-500/20 text-center">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="w-14 h-14 mx-auto mb-3 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center"><Pill className="w-7 h-7 text-white" strokeWidth={2} /></div>
                  <p className="text-2xl font-bold text-white">{t.profile.premiumOmega3}</p>
                  <p className="text-xs text-white/80 mt-1 font-semibold">Daily inflammation audit baseline</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: t.profile.communityUsing, value: '847 ' + t.profile.users },
                  { label: t.profile.successRate, value: '73%' },
                  { label: t.profile.avgImprovement, value: '68%' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-violet-50 rounded-xl">
                    <span className="text-xs text-gray-600 font-semibold">{row.label}</span>
                    <span className="text-sm font-bold text-violet-950">{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {settingsSections.map((section, si) => (
              <motion.div
                key={si} custom={3 + si} initial="hidden" animate="show" variants={cardEntry}
                className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg"
              >
                <h3 className="text-lg font-bold text-violet-950 mb-4">{section.title}</h3>
                <div className="space-y-2">
                  {section.items.map((item, ii) => (
                    <div key={ii} className="flex items-center justify-between p-3 hover:bg-violet-50 rounded-2xl transition-all">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-violet-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-violet-950 text-sm truncate">{item.label}</p>
                          <p className="text-xs text-gray-500 truncate">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {'enabled' in item && item.enabled !== undefined && (
                          <button className={`relative w-12 h-6 rounded-full transition-colors ${item.enabled ? 'bg-violet-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-transform ${item.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                          </button>
                        )}
                        {'value' in item && item.value && <span className="text-sm text-violet-700 font-bold">{item.value}</span>}
                        {'action' in item && item.action && (
                          <button className="text-violet-500 text-sm font-bold hover:text-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-all">{item.action}</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {editOpen && <EditProfileModal onClose={() => setEditOpen(false)} />}
    </div>
  );
}

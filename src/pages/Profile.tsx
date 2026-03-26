import { User, Mail, Calendar, Bell, Lock, Palette, Globe, Target, Droplet, Moon, TrendingUp, Users, Crown, Edit } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { GarminConnectCard } from "../components/garmin/GarminConnectCard";

export function Profile() {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const profileData = { name: profile?.display_name || t.user.name, email: profile?.email || "daniel.melo@email.com", age: 38, joinDate: "March 2026", badge: t.user.title };
  const healthMetrics = [
    { label: t.dashboard.omegaRatio, value: "4.2:1", icon: TrendingUp },
    { label: t.profile.weight, value: "88.5 kg", icon: Target },
    { label: t.profile.waist, value: "96 cm", icon: Target },
    { label: t.profile.sleep, value: "3.8/5", icon: Moon },
    { label: t.profile.water, value: "1.8L", icon: Droplet },
    { label: t.profile.protocol, value: t.common.day + " 47", icon: Calendar },
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
    <div className="min-h-screen p-6 md:p-8 bg-[#FAFAFA]">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8"><h1 className="text-4xl md:text-5xl font-bold text-black mb-2">{t.profile.title}</h1><p className="text-sm text-gray-500">{t.profile.subtitle}</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-7xl flex-shrink-0">👤</div>
                <div className="flex-1">
                  <div className="bg-black rounded-2xl p-6 text-white mb-4">
                    <h2 className="text-3xl font-bold mb-2">{profileData.name}</h2>
                    <div className="flex items-center gap-2 mb-3"><Crown className="w-4 h-4 text-[#D4FF00]" /><span className="text-sm font-bold text-[#D4FF00]">{profileData.badge}</span></div>
                    <div className="flex items-center gap-2 text-sm text-gray-400"><Mail className="w-4 h-4" /><span>{profileData.email}</span></div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-3"><Calendar className="w-4 h-4" /><span>Member since {profileData.joinDate}</span></div>
                  </div>
                  <button className="w-full bg-[#D4FF00] text-black px-6 py-3.5 rounded-2xl font-bold hover:bg-[#B8E000] transition-all flex items-center justify-center gap-2"><Edit className="w-5 h-5" />Edit Profile</button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
              <h3 className="text-xl font-bold text-black mb-6">Health Data</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {healthMetrics.map((m, i) => (<div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100"><div className="flex items-center gap-2 mb-3"><m.icon className="w-4 h-4 text-gray-400" /><span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{m.label}</span></div><p className="text-3xl font-bold text-black">{m.value}</p></div>))}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
              <h3 className="text-xl font-bold text-black mb-6">Metabolic Age</h3>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-40 h-40 flex-shrink-0">
                  <svg className="w-40 h-40 transform -rotate-90"><circle cx="80" cy="80" r="70" stroke="#f3f4f6" strokeWidth="12" fill="none" /><circle cx="80" cy="80" r="70" stroke="#1a1a1a" strokeWidth="12" fill="none" strokeDasharray={`${2 * Math.PI * 70}`} strokeDashoffset={`${2 * Math.PI * 70 * 0.45}`} strokeLinecap="round" /></svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center"><p className="text-5xl font-bold text-black">42</p><p className="text-xs text-gray-500 font-semibold">years</p></div>
                </div>
                <div className="flex-1 w-full space-y-4">
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100"><div className="flex items-center justify-between"><span className="text-sm font-bold text-gray-600">Real Age</span><span className="text-3xl font-bold text-black">{profileData.age}</span></div></div>
                  <div className="p-5 bg-black rounded-2xl text-white"><div className="flex items-center justify-between"><span className="text-sm font-bold text-gray-400">Metabolic Age</span><span className="text-3xl font-bold">42</span></div></div>
                  <div className="p-5 bg-[#D4FF00] rounded-2xl"><div className="flex items-center justify-between"><span className="text-sm font-bold text-black/70">Target Age</span><span className="text-3xl font-bold text-black">34</span></div></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
              <div className="flex items-center justify-between mb-6"><div><h3 className="text-xl font-bold text-black mb-1">Peer Benchmark</h3><p className="text-xs text-gray-500">{peerBenchmark.group}</p></div><div className="text-right"><div className="flex items-center gap-2"><Users className="w-5 h-5 text-gray-400" /><span className="text-3xl font-bold text-black">{peerBenchmark.totalPeers}</span></div><p className="text-xs text-gray-500">similar people</p></div></div>
              <div className="space-y-4">
                {peerBenchmark.metrics.map((m, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center justify-between mb-3"><span className="text-sm font-bold text-gray-700">{m.label}</span>{m.better && <span className="px-3 py-1.5 bg-[#D4FF00] text-black rounded-xl text-xs font-bold">Better than avg</span>}</div>
                    <div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-gray-500 mb-2 font-semibold">You</p><p className="text-3xl font-bold text-black">{m.yourValue}{m.unit && ` ${m.unit}`}</p></div><div><p className="text-xs text-gray-500 mb-2 font-semibold">Peer Average</p><p className="text-3xl font-bold text-gray-400">{m.peerAvg}{m.unit && ` ${m.unit}`}</p></div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <GarminConnectCard />
            <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
              <h3 className="text-xl font-bold text-black mb-5">Omega Supplement</h3>
              <div className="bg-[#D4FF00] rounded-2xl p-6 mb-5 shadow-md text-center"><div className="text-5xl mb-3">💊</div><p className="text-2xl font-bold text-black">BalanceOil+</p><p className="text-xs text-black/60 mt-1 font-semibold">Premium Omega-3 Complex</p></div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"><span className="text-sm text-gray-600 font-semibold">Community using</span><span className="text-sm font-bold text-black">847 users</span></div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"><span className="text-sm text-gray-600 font-semibold">Success rate</span><span className="text-sm font-bold text-black">73%</span></div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"><span className="text-sm text-gray-600 font-semibold">Avg improvement</span><span className="text-sm font-bold text-black">68%</span></div>
              </div>
            </div>
            {settingsSections.map((section, si) => (
              <div key={si} className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
                <h3 className="text-xl font-bold text-black mb-5">{section.title}</h3>
                <div className="space-y-3">
                  {section.items.map((item, ii) => (
                    <div key={ii} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all">
                      <div className="flex items-center gap-3"><div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center"><item.icon className="w-5 h-5 text-white" /></div><div><p className="font-bold text-black text-sm">{item.label}</p><p className="text-xs text-gray-500">{item.description}</p></div></div>
                      <div>
                        {'enabled' in item && item.enabled !== undefined && <button className={`relative w-12 h-6 rounded-full transition-colors ${item.enabled ? 'bg-[#D4FF00]' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-transform ${item.enabled ? 'translate-x-7' : 'translate-x-1'}`} /></button>}
                        {'value' in item && item.value && <span className="text-sm text-gray-600 font-bold">{item.value}</span>}
                        {'action' in item && item.action && <button className="text-black text-sm font-bold hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all">{item.action}</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="bg-black rounded-3xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-5">Your Impact</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-sm text-gray-400 font-semibold">Total Points</span><span className="text-3xl font-bold">1,600</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-gray-400 font-semibold">Achievements</span><span className="text-3xl font-bold">4/8</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-gray-400 font-semibold">Community Rank</span><span className="text-3xl font-bold">#3</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, FlaskConical, Scan, ClipboardCheck, Activity, ChevronRight, Pill, Droplet, Moon, Flame } from 'lucide-react';

const TILES = [
  {
    to: '/workout',
    icon: Dumbbell,
    title: 'Workout Planner',
    desc: 'Plano de treino gerado pelo ZENO baseado no seu objetivo. Acompanhe cada exercício.',
    color: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    to: '/omega',
    icon: FlaskConical,
    title: 'Omega Audit',
    desc: 'Audite seu ômega 3 atual contra 15 marcas e o benchmark OAM.',
    color: 'bg-violet-500',
    gradient: 'from-violet-500 to-violet-600',
  },
  {
    to: '/scanner',
    icon: Scan,
    title: 'Food Scanner',
    desc: 'Fotografe rótulos. ZENO analisa ingredientes pró vs anti-inflamatórios.',
    color: 'bg-rose-500',
    gradient: 'from-rose-500 to-rose-600',
  },
  {
    to: '/daily-tracker',
    icon: ClipboardCheck,
    title: 'Daily Tracker',
    desc: 'Peso, água, sono, suplementação. Rastreio dos hábitos diários.',
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
  },
];

export function BodyHub() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8 md:py-10">

        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-3xl p-8 md:p-10 mb-8 shadow-xl shadow-emerald-500/30"
        >
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-white/80" />
              <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Saúde física</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">Body</h1>
            <p className="text-white/85 text-base max-w-xl">
              Movimento, alimentação anti-inflamatória, suplementação certa. Corpo forte sustenta tudo mais.
            </p>
            <div className="flex items-center gap-3 mt-5 flex-wrap">
              {[
                { icon: Dumbbell, label: 'Treino' },
                { icon: Pill, label: 'Suplemento' },
                { icon: Droplet, label: 'Hidratação' },
                { icon: Moon, label: 'Sono' },
                { icon: Flame, label: 'Inflamação' },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className="bg-white/15 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-2 text-white text-xs">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{c.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TILES.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.button
                key={t.to}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.05 }}
                whileHover={{ y: -3 }}
                onClick={() => navigate(t.to)}
                className="text-left p-6 rounded-3xl bg-white border border-violet-100 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-violet-950">{t.title}</h3>
                      <ChevronRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

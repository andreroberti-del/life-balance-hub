import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Users2, Shield, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';

const TILES = [
  {
    to: '/education',
    icon: GraduationCap,
    title: 'M7 Academy',
    desc: 'Trilhas educacionais. Aprenda OAM, inflamação silenciosa, 7 saúdes Mind7.',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    to: '/community',
    icon: Users,
    title: 'Comunidade',
    desc: 'Tribo de pessoas em jornada parecida. Inspire-se, compare-se com peers, conecte.',
    gradient: 'from-violet-500 to-violet-600',
  },
  {
    to: '/referrals',
    icon: Users2,
    title: 'Família M7',
    desc: 'Indique amigos com seu código M7-XXXXXX. 3 ativos = Premium grátis permanente.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    to: '/distributor',
    icon: Shield,
    title: 'Distribuidor Aprovado',
    desc: 'Aprovação manual após completar OAM. Comissão por indicação oficial.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    to: '/progress',
    icon: TrendingUp,
    title: 'Progresso Protocol 120',
    desc: 'Sua jornada de 120 dias com biomarcadores, evolução, conquistas.',
    gradient: 'from-teal-500 to-cyan-600',
  },
];

export function GrowHub() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8 md:py-10">

        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 rounded-3xl p-8 md:p-10 mb-8 shadow-xl shadow-amber-500/30"
        >
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-white/80" />
              <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Crescimento</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">Grow</h1>
            <p className="text-white/85 text-base max-w-xl">
              Aprenda, conecte, evolua, multiplique. Crescer no método e crescer com pessoas.
            </p>
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

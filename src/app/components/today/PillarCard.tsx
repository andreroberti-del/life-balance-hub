import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface Metric {
  icon: LucideIcon;
  label: string;
  value: string;
  pct: number; // 0-100 pra barra de progresso
}

interface PillarCardProps {
  title: string;
  subtitle: string;
  score: number; // 0-100
  icon: LucideIcon;
  accentColor: string; // Tailwind base, ex: 'rose', 'violet', 'amber'
  metrics: Metric[];
  onClick?: () => void;
  delay?: number;
}

const PALETTE: Record<string, {
  bgGradient: string;
  border: string;
  ringStroke: string;
  iconBg: string;
  iconText: string;
  ringBg: string;
  barFill: string;
  textHeader: string;
}> = {
  rose: {
    bgGradient: 'from-rose-50 to-white',
    border: 'border-rose-200/60',
    ringStroke: '#F43F5E',
    iconBg: 'bg-rose-100',
    iconText: 'text-rose-600',
    ringBg: 'rgba(244, 63, 94, 0.12)',
    barFill: 'bg-rose-400',
    textHeader: 'text-rose-700',
  },
  violet: {
    bgGradient: 'from-violet-50 to-white',
    border: 'border-violet-200/60',
    ringStroke: '#668DFF',
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-600',
    ringBg: 'rgba(102, 141, 255, 0.12)',
    barFill: 'bg-violet-400',
    textHeader: 'text-violet-700',
  },
  amber: {
    bgGradient: 'from-amber-50 to-white',
    border: 'border-amber-200/60',
    ringStroke: '#F59E0B',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
    ringBg: 'rgba(245, 158, 11, 0.12)',
    barFill: 'bg-amber-400',
    textHeader: 'text-amber-700',
  },
};

export function PillarCard({
  title,
  subtitle,
  score,
  icon: Icon,
  accentColor,
  metrics,
  onClick,
  delay = 0,
}: PillarCardProps) {
  const colors = PALETTE[accentColor] ?? PALETTE.violet;
  const ringSize = 56;
  const ringR = ringSize / 2 - 4;
  const circumference = 2 * Math.PI * ringR;
  const dashOffset = circumference * (1 - Math.min(100, Math.max(0, score)) / 100);

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className={`text-left w-full p-5 rounded-3xl bg-gradient-to-br ${colors.bgGradient} border ${colors.border} hover:shadow-lg transition-all`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${colors.iconText}`} strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="font-bold text-violet-950 text-base leading-tight">{title}</h3>
            <p className="text-[11px] text-gray-500">{subtitle}</p>
          </div>
        </div>

        {/* Mini ring com score */}
        <div className="relative" style={{ width: ringSize, height: ringSize }}>
          <svg viewBox={`0 0 ${ringSize} ${ringSize}`} className="-rotate-90 absolute inset-0">
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={ringR}
              fill="none"
              stroke={colors.ringBg}
              strokeWidth={4}
            />
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={ringR}
              fill="none"
              stroke={colors.ringStroke}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 600ms ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-bold ${colors.textHeader}`}>{Math.round(score)}</span>
          </div>
        </div>
      </div>

      {/* Métricas com barras */}
      <div className="space-y-2.5">
        {metrics.map((m) => {
          const MIcon = m.icon;
          return (
            <div key={m.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <MIcon className="w-3 h-3" />
                  {m.label}
                </span>
                <span className="font-bold text-violet-950">{m.value}</span>
              </div>
              <div className="h-1 bg-white/70 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors.barFill} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(100, Math.max(0, m.pct))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.button>
  );
}

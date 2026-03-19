import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  icon: LucideIcon;
  iconBg?: string;
}

export default function MetricCard({
  title,
  value,
  unit,
  trend,
  icon: Icon,
  iconBg = 'bg-lime-bg text-lime',
}: MetricCardProps) {
  const isGoodTrend = title === 'Sono' || title === 'Ratio Omega'
    ? (trend ?? 0) > 0
    : (trend ?? 0) < 0;

  return (
    <div className="bg-card rounded-3xl p-6 border border-border hover:border-[rgba(255,255,255,0.12)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 ${iconBg} rounded-2xl flex items-center justify-center`}>
          <Icon className="w-5 h-5" strokeWidth={1.8} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${
            isGoodTrend ? 'bg-green-bg text-green' : 'bg-red-bg text-red'
          }`}>
            {isGoodTrend ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <p className="text-[32px] font-black text-text tracking-tight leading-none">
        {value}
        {unit && <span className="text-lg font-medium text-text3 ml-1">{unit}</span>}
      </p>
      <p className="text-xs text-text4 mt-2 uppercase tracking-[1.5px] font-semibold">{title}</p>
    </div>
  );
}

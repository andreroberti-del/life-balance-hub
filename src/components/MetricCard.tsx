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
  iconBg = 'bg-lime/15 text-lime-darker',
}: MetricCardProps) {
  const isGoodTrend = title === 'Sono' || title === 'Ratio Omega'
    ? (trend ?? 0) > 0
    : (trend ?? 0) < 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isGoodTrend ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
          }`}>
            {isGoodTrend ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <p className="text-3xl font-black text-text tracking-tight">
        {value}
        {unit && <span className="text-base font-medium text-text3 ml-1">{unit}</span>}
      </p>
      <p className="text-xs text-text3 mt-1 uppercase tracking-wider font-medium">{title}</p>
    </div>
  );
}

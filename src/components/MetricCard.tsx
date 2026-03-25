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
  title, value, unit, trend, icon: Icon, iconBg = 'bg-accent-bg text-accent',
}: MetricCardProps) {
  const isGoodTrend = title === 'Sono' || title === 'Ratio Omega'
    ? (trend ?? 0) > 0
    : (trend ?? 0) < 0;

  return (
    <div className="bg-card rounded-2xl p-5 border border-border hover:border-dark4 transition-all duration-200 hover:shadow-card-hover">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className="w-4 h-4" strokeWidth={1.8} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md ${
            isGoodTrend ? 'bg-green-bg text-green' : 'bg-red-bg text-red'
          }`}>
            {isGoodTrend ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-text tracking-tight">
        {value}
        {unit && <span className="text-sm font-normal text-text3 ml-1">{unit}</span>}
      </p>
      <p className="text-[10px] text-text4 mt-1.5 uppercase tracking-wider font-medium">{title}</p>
    </div>
  );
}

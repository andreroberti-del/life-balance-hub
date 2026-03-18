import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  icon: LucideIcon;
  sparklineData?: number[];
}

function MiniSparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 30;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke="#d4e157"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MetricCard({
  title,
  value,
  unit,
  trend,
  icon: Icon,
  sparklineData,
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === undefined || trend === 0) return <Minus className="w-3 h-3" />;
    return trend > 0 ? (
      <TrendingUp className="w-3 h-3" />
    ) : (
      <TrendingDown className="w-3 h-3" />
    );
  };

  const getTrendColor = () => {
    if (trend === undefined || trend === 0) return 'text-slate-400';
    return trend > 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="bg-dark3 rounded-2xl p-5 border border-dark4/30 hover:border-lime/20 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-lime/10 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-lime" />
          </div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            {title}
          </span>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold text-white">{value}</span>
          {unit && <span className="text-sm text-slate-400 ml-1">{unit}</span>}
        </div>
        {sparklineData && sparklineData.length > 1 && (
          <MiniSparkline data={sparklineData} />
        )}
      </div>
    </div>
  );
}

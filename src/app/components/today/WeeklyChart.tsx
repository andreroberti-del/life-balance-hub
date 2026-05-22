import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DayPoint {
  day: string; // 'Dom', 'Seg', ...
  corpo: number;
  mente: number;
  alma: number;
}

interface WeeklyChartProps {
  data: DayPoint[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <filter id="glow-corpo" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid strokeDasharray="3 6" stroke="currentColor" className="text-violet-200 dark:text-violet-900/40" />
          <XAxis
            dataKey="day"
            stroke="currentColor"
            tick={{ fontSize: 11, fontWeight: 600 }}
            className="text-gray-400 dark:text-violet-200/40"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[40, 100]}
            ticks={[40, 55, 70, 85, 100]}
            stroke="currentColor"
            tick={{ fontSize: 11, fontWeight: 600 }}
            className="text-gray-400 dark:text-violet-200/40"
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid rgba(139, 92, 246, 0.3)',
              fontSize: 12,
              backgroundColor: 'rgba(15, 12, 41, 0.95)',
              color: '#fff',
              boxShadow: '0 8px 32px rgba(124, 58, 237, 0.25)',
            }}
            labelStyle={{ color: '#C4B5FD', fontWeight: 700 }}
          />
          <Line
            type="monotone"
            dataKey="corpo"
            stroke="#22D3EE"
            strokeWidth={2.5}
            dot={{ r: 0 }}
            activeDot={{ r: 5, fill: '#22D3EE' }}
            filter="url(#glow-corpo)"
            name="Corpo"
          />
          <Line
            type="monotone"
            dataKey="mente"
            stroke="#668DFF"
            strokeWidth={2.5}
            dot={{ r: 0 }}
            activeDot={{ r: 5, fill: '#668DFF' }}
            filter="url(#glow-corpo)"
            name="Mente"
          />
          <Line
            type="monotone"
            dataKey="alma"
            stroke="#C084FC"
            strokeWidth={2.5}
            dot={{ r: 0 }}
            activeDot={{ r: 5, fill: '#C084FC' }}
            filter="url(#glow-corpo)"
            name="Alma"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

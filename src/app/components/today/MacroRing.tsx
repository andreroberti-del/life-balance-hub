interface MacroRingProps {
  label: string;
  pct: number; // 0-100
  grams: number;
  color: string; // stroke color
  size?: number;
}

export function MacroRing({ label, pct, grams, color, size = 60 }: MacroRingProps) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(100, pct) / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90 absolute inset-0">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(102, 141, 255, 0.12)"
            strokeWidth={3}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 600ms ease-out', filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-violet-950 dark:text-white">{pct}%</span>
        </div>
      </div>
      <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-500 dark:text-violet-200/50">{label}</p>
      <p className="text-xs font-bold text-violet-950 dark:text-white">{grams}g</p>
    </div>
  );
}

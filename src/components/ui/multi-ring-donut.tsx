/**
 * MultiRingDonut — Donut chart com 3 anéis concêntricos.
 * Usado no dashboard inicial pra mostrar Índice geral (centro) + 3 dimensões (anéis).
 */

interface Ring {
  value: number; // 0-100
  color: string;
  label: string;
}

interface MultiRingDonutProps {
  rings: Ring[]; // exatamente 3 rings (corpo, mente, alma)
  centerValue: number; // o índice geral (média)
  centerLabel?: string;
  size?: number;
  thickness?: number;
}

export function MultiRingDonut({
  rings,
  centerValue,
  centerLabel = 'Índice',
  size = 140,
  thickness = 8,
}: MultiRingDonutProps) {
  const center = size / 2;
  const radii = [
    center - thickness * 0.5,
    center - thickness * 2,
    center - thickness * 3.5,
  ];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="-rotate-90">
      {/* Background tracks */}
      {radii.map((r, i) => (
        <circle
          key={`bg-${i}`}
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="rgba(102, 141, 255, 0.08)"
          strokeWidth={thickness}
        />
      ))}

      {/* Active rings */}
      {rings.map((ring, i) => {
        const r = radii[i];
        const circumference = 2 * Math.PI * r;
        const dashOffset = circumference * (1 - Math.min(100, Math.max(0, ring.value)) / 100);
        return (
          <circle
            key={`r-${i}`}
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke={ring.color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        );
      })}

      {/* Center label (text is rotated back) */}
      <g transform={`rotate(90 ${center} ${center})`}>
        <text
          x={center}
          y={center - 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.22}
          fontWeight={800}
          fill="#161B50"
          style={{ letterSpacing: '-1px' }}
        >
          {Math.round(centerValue)}
        </text>
        <text
          x={center}
          y={center + size * 0.15}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.07}
          fontWeight={700}
          fill="#9CA3AF"
          style={{ letterSpacing: '2px', textTransform: 'uppercase' }}
        >
          {centerLabel}
        </text>
      </g>
    </svg>
  );
}

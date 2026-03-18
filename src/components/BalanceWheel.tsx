import { motion } from "framer-motion";
import type { LifeArea } from "@/hooks/useLifeBalance";

interface BalanceWheelProps {
  areas: LifeArea[];
}

const BalanceWheel = ({ areas }: BalanceWheelProps) => {
  const size = 320;
  const center = size / 2;
  const maxRadius = center - 30;
  const rings = [2, 4, 6, 8, 10];

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / areas.length - Math.PI / 2;
    const r = (value / 10) * maxRadius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = areas
    .map((area, i) => {
      const p = getPoint(i, area.value);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {rings.map((ring) => (
          <circle
            key={ring}
            cx={center}
            cy={center}
            r={(ring / 10) * maxRadius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={1}
            opacity={0.5}
          />
        ))}

        {/* Axis lines */}
        {areas.map((_, i) => {
          const p = getPoint(i, 10);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="hsl(var(--border))"
              strokeWidth={1}
              opacity={0.4}
            />
          );
        })}

        {/* Filled area */}
        <motion.polygon
          points={polygonPoints}
          fill="hsl(var(--primary) / 0.2)"
          stroke="hsl(var(--primary))"
          strokeWidth={2.5}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Data points & labels */}
        {areas.map((area, i) => {
          const p = getPoint(i, area.value);
          const labelP = getPoint(i, 11.5);
          return (
            <g key={area.id}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={5}
                fill={area.color}
                stroke="hsl(var(--background))"
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 + 0.3 }}
              />
              <text
                x={labelP.x}
                y={labelP.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-[11px] font-body font-medium"
              >
                {area.icon}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BalanceWheel;

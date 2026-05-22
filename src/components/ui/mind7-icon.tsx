/**
 * Mind7Icon — SVG inline do logo Mind7 (versão app icon: quadrado violet + grid de dots + M7 stylized)
 * Inspirado no asset enviado em 2026-05-22 pelo Roberti.
 */

interface Mind7IconProps {
  size?: number;
  className?: string;
  squareColor?: string;
  dotColor?: string;
  glowing?: boolean;
}

export function Mind7Icon({
  size = 120,
  className = '',
  squareColor = '#5468FF',
  dotColor = '#FFFFFF',
  glowing = true,
}: Mind7IconProps) {
  const padding = 14;
  const inner = 100 - padding * 2;
  const cols = 5;
  const step = inner / (cols - 1);

  const dots: Array<{ cx: number; cy: number }> = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
      dots.push({ cx: padding + j * step, cy: padding + i * step });
    }
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={glowing ? { filter: 'drop-shadow(0 8px 28px rgba(84, 104, 255, 0.45))' } : undefined}
    >
      {/* Rounded violet square background */}
      <rect x="0" y="0" width="100" height="100" rx="22" fill={squareColor} />

      {/* Grid de dots brancos */}
      <g fill={dotColor}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={1.6} opacity={0.85} />
        ))}
      </g>

      {/* Shape "M7" central: 4 nós conectados (estilo molécula) */}
      <g fill={dotColor}>
        {/* Top-left node */}
        <circle cx={35} cy={36} r={4.5} />
        {/* Top-right node */}
        <circle cx={65} cy={36} r={4.5} />
        {/* Bottom-left node */}
        <circle cx={35} cy={64} r={4.5} />
        {/* Bottom-right node */}
        <circle cx={65} cy={64} r={4.5} />
        {/* Center peak (M) */}
        <circle cx={50} cy={45} r={5.5} />
      </g>

      {/* Connectors (organic curves forming the M7) */}
      <g fill="none" stroke={dotColor} strokeWidth={5} strokeLinecap="round">
        {/* M base: left-up to peak */}
        <path d="M 35 36 Q 42 38, 50 45" />
        {/* M base: right-up to peak */}
        <path d="M 65 36 Q 58 38, 50 45" />
        {/* Vertical legs */}
        <path d="M 35 36 L 35 64" strokeWidth={4.5} />
        <path d="M 65 36 L 65 64" strokeWidth={4.5} />
      </g>
    </svg>
  );
}

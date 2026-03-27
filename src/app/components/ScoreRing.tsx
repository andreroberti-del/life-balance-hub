import { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  showPercentage?: boolean;
  color?: 'auto' | 'neon' | 'success' | 'warning' | 'danger';
  animated?: boolean;
  thickness?: number;
}

export function ScoreRing({
  score,
  maxScore = 100,
  size = 'medium',
  label,
  showPercentage = true,
  color = 'auto',
  animated = true,
  thickness = 8,
}: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(animated ? 0 : score);

  // Size configurations
  const sizeConfig = {
    small: {
      diameter: 48,
      fontSize: '14px',
      labelSize: '10px',
      strokeWidth: 6,
    },
    medium: {
      diameter: 120,
      fontSize: '32px',
      labelSize: '14px',
      strokeWidth: 8,
    },
    large: {
      diameter: 160,
      fontSize: '40px',
      labelSize: '16px',
      strokeWidth: 10,
    },
  };

  const config = sizeConfig[size];
  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (score / maxScore) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  // Animate score on mount
  useEffect(() => {
    if (!animated) return;

    const duration = 800; // ms
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animated]);

  // Auto color based on score
  const getColor = () => {
    if (color !== 'auto') {
      const colorMap = {
        neon: '#D4FF00',
        success: '#4ADE80',
        warning: '#FBBF24',
        danger: '#F87171',
      };
      return colorMap[color];
    }

    // Auto color based on percentage
    if (percentage >= 75) return '#4ADE80'; // Green
    if (percentage >= 50) return '#D4FF00'; // Neon (Good)
    if (percentage >= 25) return '#FBBF24'; // Yellow (Moderate)
    return '#F87171'; // Red (Poor)
  };

  const strokeColor = getColor();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: config.diameter, height: config.diameter }}>
        {/* SVG Ring */}
        <svg
          width={config.diameter}
          height={config.diameter}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={config.strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: animated ? 'stroke-dashoffset 0.8s ease-out, stroke 0.3s ease' : 'none',
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="font-bold"
            style={{
              fontSize: config.fontSize,
              color: strokeColor,
              lineHeight: 1,
            }}
          >
            {Math.round(animatedScore)}
          </div>
          {showPercentage && size !== 'small' && (
            <div
              className="text-gray-400 mt-1"
              style={{ fontSize: config.labelSize }}
            >
              / {maxScore}
            </div>
          )}
        </div>
      </div>

      {/* Label */}
      {label && (
        <div
          className="text-gray-300 text-center font-medium"
          style={{ fontSize: config.labelSize }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

// Sub-score mini rings component
interface SubScoreRingsProps {
  scores: Array<{
    value: number;
    label: string;
    color: 'neon' | 'success' | 'warning' | 'danger' | 'info';
  }>;
  onScoreClick?: (index: number) => void;
}

export function SubScoreRings({ scores, onScoreClick }: SubScoreRingsProps) {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {scores.map((score, index) => (
        <button
          key={index}
          onClick={() => onScoreClick?.(index)}
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ScoreRing
            score={score.value}
            size="small"
            color={score.color as 'neon' | 'success' | 'warning' | 'danger'}
            animated={true}
            showPercentage={false}
          />
          <span className="text-xs text-gray-400">{score.label}</span>
        </button>
      ))}
    </div>
  );
}

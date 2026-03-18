import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
}

const ScoreRing = ({ score }: ScoreRingProps) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getLabel = () => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bom";
    if (score >= 40) return "Regular";
    return "Precisa atenção";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={130} height={130} viewBox="0 0 130 130">
          <circle
            cx={65}
            cy={65}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={8}
          />
          <motion.circle
            cx={65}
            cy={65}
            r={radius}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            transform="rotate(-90 65 65)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-display font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}%
          </motion.span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{getLabel()}</span>
    </div>
  );
};

export default ScoreRing;

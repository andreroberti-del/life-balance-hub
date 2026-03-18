import { motion } from "framer-motion";
import type { LifeArea } from "@/hooks/useLifeBalance";

interface AreaSliderProps {
  area: LifeArea;
  onUpdate: (id: string, value: number) => void;
  index: number;
}

const AreaSlider = ({ area, onUpdate, index }: AreaSliderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-lg bg-card p-4 border border-border"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-2 font-medium text-sm text-foreground">
          <span className="text-lg">{area.icon}</span>
          {area.label}
        </span>
        <span
          className="text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center"
          style={{ backgroundColor: area.color + "22", color: area.color }}
        >
          {area.value}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={area.value}
        onChange={(e) => onUpdate(area.id, parseInt(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${area.color} 0%, ${area.color} ${area.value * 10}%, hsl(var(--border)) ${area.value * 10}%, hsl(var(--border)) 100%)`,
        }}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>0</span>
        <span>10</span>
      </div>
    </motion.div>
  );
};

export default AreaSlider;

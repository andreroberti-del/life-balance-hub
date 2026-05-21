import { motion } from 'framer-motion';

export type ZenoPose = 'default' | 'celebrate' | 'meditation' | 'thinking' | 'sleep' | 'workout';

interface ZenoMascotProps {
  pose?: ZenoPose;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-36 h-36',
  xl: 'w-48 h-48',
};

export function ZenoMascot({ pose = 'default', size = 'md', animate = true, className = '' }: ZenoMascotProps) {
  const src = `/zeno/zeno-${pose}.png`;

  if (!animate) {
    return <img src={src} alt={`ZENO ${pose}`} className={`${sizeMap[size]} ${className} object-contain select-none`} draggable={false} />;
  }

  return (
    <motion.img
      src={src}
      alt={`ZENO ${pose}`}
      className={`${sizeMap[size]} ${className} object-contain select-none`}
      draggable={false}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={pose === 'default' || pose === 'celebrate' ? { rotate: [0, -4, 4, 0], transition: { duration: 0.6 } } : {}}
    />
  );
}

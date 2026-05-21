import { motion } from 'framer-motion';
import { useMemo } from 'react';

export type ZenoCoreState = 'idle' | 'speaking' | 'listening' | 'processing' | 'celebrating' | 'thinking';

interface ZenoCoreProps {
  state?: ZenoCoreState;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showGlow?: boolean;
  className?: string;
  /**
   * Amplitude de voz (0-1). Quando setado, sobrepõe a animação baseada em state
   * e escala a esfera dinamicamente em real-time.
   */
  amplitude?: number;
}

const sizeMap = {
  xs: 'w-8 h-8',
  sm: 'w-14 h-14',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
  '2xl': 'w-64 h-64',
};

const glowSizeMap = {
  xs: 'blur-md',
  sm: 'blur-lg',
  md: 'blur-xl',
  lg: 'blur-2xl',
  xl: 'blur-3xl',
  '2xl': 'blur-3xl',
};

export function ZenoCore({ state = 'idle', size = 'md', showGlow = true, className = '', amplitude }: ZenoCoreProps) {
  // Voice-reactive mode: amplitude sobrepõe outras animações
  const liveScale = amplitude !== undefined ? 1 + amplitude * 0.4 : undefined;
  const liveGlowOpacity = amplitude !== undefined ? 0.3 + amplitude * 0.6 : undefined;

  const animation = useMemo(() => {
    switch (state) {
      case 'speaking':
        return {
          scale: [1, 1.06, 0.98, 1.04, 1],
          rotate: [0, 2, -2, 1, 0],
          transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' as const },
        };
      case 'listening':
        return {
          scale: [1, 1.08, 1],
          transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const },
        };
      case 'processing':
        return {
          rotate: [0, 360],
          transition: { duration: 8, repeat: Infinity, ease: 'linear' as const },
        };
      case 'celebrating':
        return {
          scale: [1, 1.2, 0.95, 1.15, 1],
          rotate: [0, 10, -10, 5, 0],
          transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' as const },
        };
      case 'thinking':
        return {
          scale: [1, 1.03, 1],
          rotate: [0, 5, 0, -5, 0],
          transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
        };
      case 'idle':
      default:
        return {
          rotate: [0, 360],
          transition: { duration: 60, repeat: Infinity, ease: 'linear' as const },
        };
    }
  }, [state]);

  const glowAnimation = useMemo(() => {
    switch (state) {
      case 'speaking':
        return { opacity: [0.4, 0.8, 0.5, 0.7, 0.4], transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' as const } };
      case 'listening':
      case 'thinking':
        return { opacity: [0.3, 0.6, 0.3], transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const } };
      case 'processing':
        return { opacity: [0.4, 0.7, 0.4], transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const } };
      case 'celebrating':
        return { opacity: [0.5, 1, 0.6, 0.9, 0.5], transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' as const } };
      case 'idle':
      default:
        return { opacity: 0.35 };
    }
  }, [state]);

  const isLive = amplitude !== undefined;
  const finalAnim = isLive ? { scale: liveScale, transition: { duration: 0.08, ease: 'easeOut' as const } } : animation;
  const finalGlow = isLive ? { opacity: liveGlowOpacity, transition: { duration: 0.08, ease: 'easeOut' as const } } : glowAnimation;

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}>
      {showGlow && (
        <motion.div
          className={`absolute inset-0 rounded-full ${glowSizeMap[size]} bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400`}
          animate={finalGlow}
        />
      )}
      <motion.img
        src="/zeno-core/zeno-core-mix.png"
        alt="ZENO"
        className="relative w-full h-full object-contain select-none drop-shadow-2xl"
        draggable={false}
        animate={finalAnim}
        initial={{ scale: 0.9, opacity: 0 }}
      />
    </div>
  );
}

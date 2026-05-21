// Compat shim: ZenoMascot foi descontinuado, redireciona pra ZenoCore (esfera).
// Mantém a API antiga (pose, size) pra não quebrar componentes que ainda importam.
import { ZenoCore, ZenoCoreState } from './ZenoCore';

type LegacyPose = 'default' | 'celebrate' | 'meditation' | 'thinking' | 'sleep' | 'workout';
type LegacySize = 'sm' | 'md' | 'lg' | 'xl';

const POSE_TO_STATE: Record<LegacyPose, ZenoCoreState> = {
  default: 'idle',
  celebrate: 'celebrating',
  meditation: 'listening',
  thinking: 'thinking',
  sleep: 'idle',
  workout: 'processing',
};

// Upscale: esfera precisa de presença maior nos heroes
const SIZE_MAP: Record<LegacySize, 'sm' | 'md' | 'lg' | 'xl' | '2xl'> = {
  sm: 'md',
  md: 'lg',
  lg: 'xl',
  xl: '2xl',
};

interface Props {
  pose?: LegacyPose;
  size?: LegacySize;
  animate?: boolean;
  className?: string;
}

export function ZenoMascot({ pose = 'default', size = 'md', className = '' }: Props) {
  return <ZenoCore state={POSE_TO_STATE[pose]} size={SIZE_MAP[size]} className={className} />;
}

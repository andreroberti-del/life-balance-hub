// Compat shim: ZenoMascot foi descontinuado, redireciona pra ZenoCore (esfera).
// Mantém a API antiga (pose, size) pra não quebrar componentes que ainda importam.
import { ZenoCore, ZenoCoreState } from './ZenoCore';

type LegacyPose = 'default' | 'celebrate' | 'meditation' | 'thinking' | 'sleep' | 'workout';

const POSE_TO_STATE: Record<LegacyPose, ZenoCoreState> = {
  default: 'idle',
  celebrate: 'celebrating',
  meditation: 'listening',
  thinking: 'thinking',
  sleep: 'idle',
  workout: 'processing',
};

interface Props {
  pose?: LegacyPose;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

export function ZenoMascot({ pose = 'default', size = 'md', className = '' }: Props) {
  return <ZenoCore state={POSE_TO_STATE[pose]} size={size} className={className} />;
}

import { toast } from 'sonner';

export interface XPToastInput {
  xp: number;
  reason: string;
  leveledUp?: boolean;
  newLevelName?: string;
}

export function toastXP({ xp, reason, leveledUp, newLevelName }: XPToastInput) {
  if (leveledUp && newLevelName) {
    toast.success(`Você subiu de nível!`, {
      description: `Agora você é ${newLevelName}. +${xp} XP ganhos.`,
      duration: 5000,
      className: 'm7-toast-levelup',
    });
    return;
  }
  toast(`+${xp} XP`, {
    description: reason,
    duration: 3000,
  });
}

export function toastSuccess(title: string, description?: string) {
  toast.success(title, { description });
}

export function toastError(title: string, description?: string) {
  toast.error(title, { description });
}

export function toastInfo(title: string, description?: string) {
  toast(title, { description });
}

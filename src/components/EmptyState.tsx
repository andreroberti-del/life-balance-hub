import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-dark3 rounded-2xl flex items-center justify-center mb-4 border border-border">
        <Icon className="w-7 h-7 text-text4" />
      </div>
      <h3 className="text-lg font-bold text-text mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text3 text-center max-w-sm">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-6 py-2.5 bg-lime text-dark font-semibold text-sm rounded-xl hover:bg-lime2 transition-all shadow-[0_2px_8px_rgba(212,225,87,0.25)]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

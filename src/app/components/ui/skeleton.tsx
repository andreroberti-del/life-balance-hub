import { ReactNode } from 'react';

export function Skeleton({ className = '', children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={`animate-pulse bg-violet-100 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10 space-y-6">
        {/* Hero skeleton */}
        <Skeleton className="h-48 rounded-3xl" />

        {/* Stats trio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
          </div>
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-3xl p-7 border border-violet-100 shadow-lg space-y-4">
      <Skeleton className="h-6 w-1/3 rounded-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-violet-500" />
      </div>
      <h3 className="text-lg font-bold text-violet-950 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-violet-500 text-white font-bold rounded-2xl hover:bg-violet-600 transition-all shadow-md shadow-violet-500/20"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

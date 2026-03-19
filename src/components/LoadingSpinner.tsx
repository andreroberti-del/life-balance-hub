import { Leaf } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({
  message = 'Carregando...',
  fullPage = false,
}: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-border rounded-full animate-spin border-t-lime" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-lime" />
        </div>
      </div>
      {message && <p className="text-sm text-text3">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-20">{content}</div>;
}

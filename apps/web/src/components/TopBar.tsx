import { Menu, Search, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { profile } = useAuth();

  return (
    <header className="h-16 bg-dark border-b border-dark4/30 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-dark3 text-slate-400"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center gap-2 bg-dark3/50 rounded-xl px-4 py-2 w-80">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-dark3 text-slate-400 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-lime rounded-full" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-lime/20 flex items-center justify-center text-lime font-semibold text-sm">
            {profile?.name
              ? profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">
              {profile?.name || 'Usuario'}
            </p>
            <p className="text-xs text-slate-400">
              {profile?.email || ''}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

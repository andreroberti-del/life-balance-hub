import { Menu, Search, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { profile } = useAuth();

  const initials = profile?.name
    ? profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 lg:px-8 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-50 text-text2"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center bg-bg rounded-xl px-4 py-2.5 w-72">
          <Search className="w-4 h-4 text-text3 mr-3" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-sm text-text outline-none w-full placeholder:text-text-light"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-xl hover:bg-gray-50 text-text3 relative transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-lime rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-gray-100">
          <div className="w-9 h-9 bg-lime rounded-full flex items-center justify-center text-dark text-sm font-bold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-text leading-tight">{profile?.name || 'Usuario'}</p>
            <p className="text-[11px] text-text3">Protocolo 120</p>
          </div>
        </div>
      </div>
    </header>
  );
}

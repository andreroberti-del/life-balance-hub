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

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <header className="flex items-center justify-between px-6 lg:px-8 py-5 flex-shrink-0">
      {/* Left: Mobile menu + Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl bg-dark2 border border-border text-text3 hover:bg-dark3"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl font-bold text-text">
            {greeting()}, {profile?.name?.split(' ')[0] || 'Usuário'}
          </h1>
          <p className="text-sm text-text4 mt-0.5">
            Dia <span className="text-lime font-semibold">54</span> do Protocolo 120
          </p>
        </div>
      </div>

      {/* Right: Search + Notifications + Profile */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center bg-dark2 rounded-2xl px-4 py-2.5 w-64 border border-border">
          <Search className="w-4 h-4 text-text4 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-sm text-text outline-none w-full placeholder:text-text4"
          />
        </div>

        {/* Notifications */}
        <button className="w-10 h-10 rounded-2xl bg-dark2 border border-border flex items-center justify-center text-text3 hover:bg-dark3 transition-colors relative">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-lime rounded-full shadow-[0_0_6px_rgba(212,225,87,0.5)]" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 ml-1 bg-dark2 rounded-2xl px-3 py-2 border border-border">
          <div className="w-8 h-8 bg-lime rounded-xl flex items-center justify-center text-dark text-xs font-bold shadow-[0_2px_8px_rgba(212,225,87,0.2)]">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-text leading-tight">{profile?.name || 'Usuário'}</p>
            <p className="text-[10px] text-text4">Protocolo 120</p>
          </div>
        </div>
      </div>
    </header>
  );
}

import { Menu, Search, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { profile } = useAuth();

  const initials = profile?.display_name
    ? profile.display_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <header className="h-[64px] border-b border-border bg-card flex items-center justify-between px-6 lg:px-10 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-text3 hover:bg-bg2 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-[15px] font-semibold text-text tracking-[-0.02em]">
          {greeting()}, {profile?.display_name?.split(' ')[0] || 'Usuário'}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center bg-bg2 rounded-xl px-4 py-2 gap-2.5 w-[220px]">
          <Search className="w-4 h-4 text-text4" strokeWidth={1.6} />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-[13px] text-text3 placeholder:text-text-muted outline-none w-full"
          />
        </div>
        <button className="relative p-2.5 rounded-xl text-text4 hover:bg-bg2 hover:text-text3 transition-colors">
          <Bell className="w-[18px] h-[18px]" strokeWidth={1.6} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center text-[13px] font-semibold ml-1">
          {initials}
        </div>
      </div>
    </header>
  );
}

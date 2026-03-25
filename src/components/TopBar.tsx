import { Menu, Search, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { profile } = useAuth();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

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
    <header className="flex items-center justify-between px-6 lg:px-8 h-16 border-b border-border bg-card flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg text-text3 hover:bg-bg">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-text">
            {greeting()}, {profile?.name?.split(' ')[0] || 'Usuário'}
          </h1>
        </div>
      </div>

      {/* Center: Period */}
      <div className="hidden md:flex items-center bg-bg rounded-lg p-0.5">
        {(['daily', 'weekly', 'monthly'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              period === p
                ? 'bg-accent text-white'
                : 'text-text3 hover:text-text'
            }`}
          >
            {p === 'daily' ? 'Diário' : p === 'weekly' ? 'Semanal' : 'Mensal'}
          </button>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <div className="hidden lg:flex items-center bg-bg rounded-lg px-3 py-2 w-52">
          <Search className="w-4 h-4 text-text4 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-sm text-text outline-none w-full placeholder:text-text4"
          />
        </div>

        <button className="w-9 h-9 rounded-lg bg-bg flex items-center justify-center text-text3 hover:text-text transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red rounded-full" />
        </button>

        <div className="flex items-center gap-2 ml-1">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-xs font-semibold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text leading-tight">{profile?.name || 'Usuário'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

import { Menu, Search, Bell, Sun, Moon } from 'lucide-react';
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
    <header className="flex items-center justify-between px-6 lg:px-8 py-4 flex-shrink-0">
      {/* Left: Mobile menu + Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl bg-card border border-border text-text3 hover:bg-dark3"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl font-bold text-text">
            {greeting()}, {profile?.name?.split(' ')[0] || 'Usuário'}!
          </h1>
          <p className="text-sm text-text4 mt-0.5">
            Informações projetadas para insights precisos
          </p>
        </div>
      </div>

      {/* Center: Period Toggle */}
      <div className="hidden md:flex items-center bg-card rounded-2xl p-1 border border-border shadow-card">
        {(['daily', 'weekly', 'monthly'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              period === p
                ? 'bg-accent text-white shadow-[0_2px_8px_hsla(252,60%,62%,0.3)]'
                : 'text-text3 hover:text-text'
            }`}
          >
            {p === 'daily' ? 'Diário' : p === 'weekly' ? 'Semanal' : 'Mensal'}
          </button>
        ))}
      </div>

      {/* Right: Search + Notifications + Profile */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center bg-card rounded-2xl px-4 py-2.5 w-56 border border-border shadow-card">
          <Search className="w-4 h-4 text-text4 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-sm text-text outline-none w-full placeholder:text-text4"
          />
        </div>

        <button className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center text-text3 hover:bg-dark3 transition-colors relative shadow-card">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full shadow-[0_0_6px_hsla(252,60%,62%,0.5)]" />
        </button>

        <div className="flex items-center gap-3 ml-1 bg-card rounded-2xl px-3 py-2 border border-border shadow-card">
          <div className="w-8 h-8 bg-accent rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-[0_2px_8px_hsla(252,60%,62%,0.3)]">
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

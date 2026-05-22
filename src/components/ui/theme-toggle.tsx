import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../app/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Mudar pro tema claro' : 'Mudar pro tema escuro'}
      className="relative w-14 h-7 rounded-full border border-violet-200 dark:border-violet-800/50 bg-white dark:bg-violet-950/60 shadow-sm dark:shadow-[0_0_12px_rgba(124,58,237,0.4)] transition-all"
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-gradient-to-br ${
          isDark
            ? 'from-violet-400 to-fuchsia-500 translate-x-7 shadow-[0_0_10px_rgba(167,139,250,0.6)]'
            : 'from-amber-300 to-orange-400 translate-x-0 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
        } transition-all duration-300 flex items-center justify-center`}
      >
        {isDark ? <Moon className="w-3 h-3 text-white" /> : <Sun className="w-3 h-3 text-white" />}
      </span>
    </button>
  );
}

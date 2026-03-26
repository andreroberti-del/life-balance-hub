import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../translations';

const languages = [
  { code: 'en' as Language, flag: '🇺🇸' },
  { code: 'pt' as Language, flag: '🇧🇷' },
  { code: 'es' as Language, flag: '🇪🇸' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`text-lg rounded-lg p-1 transition-all ${
            language === lang.code
              ? 'scale-125'
              : 'opacity-30 hover:opacity-70 hover:scale-110'
          }`}
          title={lang.code.toUpperCase()}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}

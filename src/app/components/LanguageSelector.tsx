import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../translations';

const languages = [
  { code: 'en' as Language, flag: '🇺🇸', label: 'English' },
  { code: 'pt' as Language, flag: '🇧🇷', label: 'Português' },
  { code: 'es' as Language, flag: '🇪🇸', label: 'Español' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const current = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl hover:bg-gray-50 transition-all"
      >
        {current.flag}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-full ml-3 bottom-0 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 w-44">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-all ${
                  language === lang.code ? 'bg-[#D4FF00]/10' : ''
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className={`text-sm font-medium ${language === lang.code ? 'text-[#1a1a1a] font-bold' : 'text-gray-600'}`}>
                  {lang.label}
                </span>
                {language === lang.code && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-[#D4FF00]" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

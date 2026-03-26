import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../translations';
import { useState } from 'react';

const languages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'pt' as Language, name: 'Português', flag: '🇧🇷' },
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10">
        <Globe className="w-4 h-4" />
        <span className="text-2xl">{currentLanguage?.flag}</span>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200/50 py-2 z-20">
            {languages.map((lang) => (
              <button key={lang.code} onClick={() => { setLanguage(lang.code); setIsOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all ${language === lang.code ? 'bg-[#D4FF00]/10' : ''}`}>
                <span className="text-2xl">{lang.flag}</span>
                <span className={`text-sm font-semibold ${language === lang.code ? 'text-black' : 'text-gray-700'}`}>{lang.name}</span>
                {language === lang.code && <div className="ml-auto w-2 h-2 rounded-full bg-[#D4FF00]"></div>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

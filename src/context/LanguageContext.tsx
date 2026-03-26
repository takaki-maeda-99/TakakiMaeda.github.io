import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Language } from '@/src/types/content';

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  t: (ja: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja');

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'ja' ? 'en' : 'ja'));
  }, []);

  const t = useCallback(
    (ja: string, en: string) => (language === 'ja' ? ja : en),
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

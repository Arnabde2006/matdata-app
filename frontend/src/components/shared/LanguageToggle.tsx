import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
      aria-label="Toggle Language"
    >
      <Globe className="w-5 h-5" />
      <span className="font-medium">
        {i18n.language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
      </span>
    </button>
  );
};

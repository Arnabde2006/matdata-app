import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './LanguageToggle';
import { Vote, MessageSquare, BookOpen, Users, MapPin } from 'lucide-react';

export const Navbar = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary text-white p-1.5 rounded-md">
            <Vote className="h-6 w-6" />
          </div>
          <span className="font-heading font-bold text-xl hidden md:inline-block text-accent">
            {t('app_title')}
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/timeline" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
            {t('nav_timeline')}
          </Link>
          <Link to="/learn" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
            <BookOpen className="w-4 h-4"/> {t('nav_flashcards')}
          </Link>
          <Link to="/candidates" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
            <Users className="w-4 h-4"/> {t('nav_candidates')}
          </Link>
          <Link to="/booth" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
            <MapPin className="w-4 h-4"/> {t('nav_booth')}
          </Link>
          <Link to="/chatbot" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
            <MessageSquare className="w-4 h-4"/> {t('nav_chatbot')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div id="google_translate_element" className="mr-2 hidden lg:block"></div>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};

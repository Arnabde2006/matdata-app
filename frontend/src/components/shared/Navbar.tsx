import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Dialog from '@radix-ui/react-dialog';
import { LanguageToggle } from './LanguageToggle';
import { Vote, MessageSquare, BookOpen, Users, MapPin, ShieldCheck, BarChart2, Menu, X, Calendar } from 'lucide-react';

export const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/eligibility', label: t('nav_eligibility'), icon: <ShieldCheck className="w-4 h-4" /> },
    { to: '/timeline', label: t('nav_timeline'), icon: <Calendar className="w-4 h-4" /> },
    { to: '/learn', label: t('nav_flashcards'), icon: <BookOpen className="w-4 h-4" /> },
    { to: '/candidates', label: t('nav_candidates'), icon: <Users className="w-4 h-4" /> },
    { to: '/booth', label: t('nav_booth'), icon: <MapPin className="w-4 h-4" /> },
    { to: '/chatbot', label: t('nav_chatbot'), icon: <MessageSquare className="w-4 h-4" /> },
    { to: '/elections', label: t('nav_reports'), icon: <BarChart2 className="w-4 h-4" /> }
  ];

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
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              {link.to !== '/timeline' && link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div id="google_translate_element" className="mr-2 hidden lg:block"></div>
          <LanguageToggle />

          {/* Mobile Navigation Drawer Trigger */}
          <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
              <button
                className="flex md:hidden items-center justify-center w-11 h-11 rounded-lg border border-border hover:bg-muted/80 text-foreground transition-colors shrink-0"
                aria-label="Open menu"
                aria-expanded={isOpen}
              >
                <Menu className="h-6 w-6" />
              </button>
            </Dialog.Trigger>
            
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 h-full w-3/4 max-w-xs border-l bg-card p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-heading font-bold text-lg text-accent">Menu / मेनू</span>
                    <Dialog.Close asChild>
                      <button
                        className="flex items-center justify-center w-11 h-11 rounded-lg border border-border hover:bg-muted/80 text-foreground transition-colors"
                        aria-label="Close menu"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </Dialog.Close>
                  </div>
                  
                  <nav className="flex flex-col gap-1">
                    {links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 py-3 px-4 text-base font-semibold hover:text-primary transition-colors border-b border-border/20 rounded-md w-full"
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
};


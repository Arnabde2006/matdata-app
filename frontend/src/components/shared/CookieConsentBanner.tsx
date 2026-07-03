import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import { getConsent, setConsent, initAnalyticsIfConsented } from '../../lib/consent';

export const CookieConsentBanner = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(getConsent() === null);

  if (!isVisible) return null;

  const handleAccept = () => {
    setConsent('accepted');
    setIsVisible(false);
    initAnalyticsIfConsented();
  };

  const handleReject = () => {
    setConsent('rejected');
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md bg-card border border-border p-6 rounded-xl shadow-xl z-[100]">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 text-primary p-2.5 rounded-lg shrink-0">
          <Cookie className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-heading font-bold text-base text-foreground mb-1">
            Cookie Consent / कुकी सहमति
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {t('cookie_consent_text')}{' '}
            <Link to="/cookie-policy" className="text-primary hover:underline font-medium">
              {t('cookie_link_text')}
            </Link>{' '}
            &{' '}
            <Link to="/privacy-policy" className="text-primary hover:underline font-medium">
              {t('privacy_link_text')}
            </Link>.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              {t('accept')}
            </button>
            <button
              onClick={handleReject}
              className="flex-1 py-2 px-4 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-colors text-sm"
            >
              {t('reject')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

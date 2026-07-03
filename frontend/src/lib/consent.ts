export type ConsentStatus = 'accepted' | 'rejected' | null;

const CONSENT_KEY = 'matdata_cookie_consent';

export function getConsent(): ConsentStatus {
  const stored = localStorage.getItem(CONSENT_KEY);
  if (stored === 'accepted' || stored === 'rejected') {
    return stored;
  }
  return null;
}

export function setConsent(value: 'accepted' | 'rejected'): void {
  localStorage.setItem(CONSENT_KEY, value);
}

export function initAnalyticsIfConsented(): void {
  if (getConsent() === 'accepted') {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      if (!window.gtag) {
        window.gtag = function (...args: any[]) {
          window.dataLayer!.push(args);
        };
      }
      
      console.log('[Consent] Dynamic Google Analytics (GA4) initialization triggered.');
      window.gtag('js', new Date());
      window.gtag('config', 'G-MATDATA2026');
    }
  }
}

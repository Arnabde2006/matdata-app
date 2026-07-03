import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Info, Mail } from 'lucide-react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const PrivacyPolicyPage = () => {
  const { t } = useTranslation();
  useDocumentMeta(t('meta_privacy_title'), t('meta_privacy_desc'));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm flex gap-2">
        <Info className="w-5 h-5 shrink-0" />
        <p className="font-medium">
          This policy was drafted to reflect this application's current functionality and has not been reviewed by a lawyer. Replace this notice once legal review is complete.
        </p>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-heading font-bold text-accent mb-4 flex items-center justify-center gap-2">
          <ShieldCheck className="w-10 h-10 text-primary" />
          Privacy Policy
        </h1>
        <p className="text-muted-foreground">Effective Date: July 4, 2026</p>
      </div>

      <div className="bg-card border border-border p-8 rounded-2xl shadow-sm space-y-6 text-foreground leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-accent">1. Introduction</h2>
          <p>
            Welcome to <strong>MatdataApp (मतदाता ऐप)</strong>. We are committed to protecting your privacy and providing transparent information about our data practices. MatdataApp is a non-commercial, educational platform designed to raise voter awareness in India.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-accent">2. Information We Process</h2>
          <p>
            Currently, MatdataApp does not require user registration or logins. We do not maintain or persist user accounts or profiles. The details of data processed by specific features are outlined below:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>AI Chatbot Assistant</strong>: Chat messages you submit are sent to Google's Gemini API via our backend server in order to generate conversational answers. No personal identifiers are forwarded to the AI provider.
            </li>
            <li>
              <strong>Polling Booth Finder</strong>: The EPIC (Voter ID) number entered during search is processed in-memory solely to retrieve mock polling booth coordinates. The EPIC number is never stored, logged, or transmitted outside the server.
            </li>
            <li>
              <strong>Flashcards Progress</strong>: Spaced repetition grades (&quot;Still learning&quot; / &quot;Know it&quot;) and review dates are stored locally on your device via <code>localStorage</code> (key: <code>matdata_flashcard_progress</code>). This data stays entirely local and is never uploaded.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-accent">3. Third-Party Integrations &amp; Analytics</h2>
          <p>
            We integrate specific external services to enhance the application's functionality:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Google Analytics 4 (GA4)</strong>: Used to track aggregate pageviews and user interactions to improve the app. This is completely gated behind your consent and will not set cookies or transmit data until you accept the Cookie Consent Banner.
            </li>
            <li>
              <strong>Google Translate Widget</strong>: A third-party script embedded directly in our navigation bar to allow instant multilingual accessibility.
            </li>
            <li>
              <strong>Firebase</strong>: The Firebase SDK is present in the frontend architecture (configured with placeholder credentials) but is <strong>not currently active</strong> or collecting data.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-accent">4. Cookie Configuration</h2>
          <p>
            Please review our full <a href="/cookie-policy" className="text-primary hover:underline font-semibold">Cookie Policy</a> for detailed descriptions of cookies and localStorage keys configured by this platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-accent">5. Contact Information</h2>
          <div className="p-4 bg-muted/30 rounded-lg flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm">
              For any questions or concerns regarding your privacy or data practices, please contact the platform administrator at: <span className="font-semibold text-primary">admin@matdata-app.run.app</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

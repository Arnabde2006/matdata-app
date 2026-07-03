import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cookie, Info } from 'lucide-react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const CookiePolicyPage = () => {
  const { t } = useTranslation();
  useDocumentMeta(t('meta_cookie_title'), t('meta_cookie_desc'));

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
          <Cookie className="w-10 h-10 text-primary" />
          Cookie Policy
        </h1>
        <p className="text-muted-foreground">Effective Date: July 4, 2026</p>
      </div>

      <div className="bg-card border border-border p-8 rounded-2xl shadow-sm space-y-6 text-foreground leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-accent">1. What are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device when you visit a website. Local Storage is another web technology that allows sites to store key-value data directly in your browser. This site uses both standard cookies and Local Storage to provide necessary features and optional analytics tracking.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-accent">2. Specific Storage in Use</h2>
          <p>
            The table below outlines every cookie and Local Storage item configured by this platform:
          </p>

          <div className="border border-border rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-xs font-bold text-muted-foreground">
                  <th className="p-4">Key / Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Description &amp; Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                <tr>
                  <td className="p-4 font-mono font-semibold">matdata_cookie_consent</td>
                  <td className="p-4">Local Storage</td>
                  <td className="p-4">Persistent</td>
                  <td className="p-4">Stores your cookie consent selection (&apos;accepted&apos; or &apos;rejected&apos;) to manage the consent banner display.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-semibold">matdata_flashcard_progress</td>
                  <td className="p-4">Local Storage</td>
                  <td className="p-4">Persistent</td>
                  <td className="p-4">Saves flashcard study intervals and grading scores to implement Leitner spaced repetition.</td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="p-4 font-mono font-semibold">_ga</td>
                  <td className="p-4">Analytics Cookie</td>
                  <td className="p-4">2 Years</td>
                  <td className="p-4">Google Analytics tracking identifier. Gated by consent — only loaded if accepted.</td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="p-4 font-mono font-semibold">_ga_G-MATDATA2026</td>
                  <td className="p-4">Analytics Cookie</td>
                  <td className="p-4">2 Years</td>
                  <td className="p-4">Google Analytics session state helper. Gated by consent — only loaded if accepted.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-accent">3. Managing Consent</h2>
          <p>
            You can clear or change your consent status at any time by clearing your browser cookies and site data, or by clearing the <code>matdata_cookie_consent</code> key from your browser&apos;s developer tools console. Doing so will re-trigger the Cookie Consent Banner on your next page refresh.
          </p>
        </section>
      </div>
    </div>
  );
};

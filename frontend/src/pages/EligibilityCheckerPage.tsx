import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ArrowRight, HelpCircle, Check, X, ExternalLink } from 'lucide-react';
import { SpeakButton } from '../components/shared/SpeakButton';

export const EligibilityCheckerPage = () => {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const questions = [
    { id: 1, textKey: 'eligibility_q1', targetAnswer: true, reasonKey: 'reason_age', type: 'not_yet' },
    { id: 2, textKey: 'eligibility_q2', targetAnswer: true, reasonKey: 'reason_citizen', type: 'ineligible' },
    { id: 3, textKey: 'eligibility_q3', targetAnswer: true, reasonKey: 'reason_resident', type: 'ineligible' },
    { id: 4, textKey: 'eligibility_q4', targetAnswer: false, reasonKey: 'reason_disqualified', type: 'ineligible' }
  ];

  const handleAnswer = (answer: boolean) => {
    setAnswers((prev) => ({ ...prev, [currentStep]: answer }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
  };

  const getResult = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const ans = answers[i];
      if (ans !== q.targetAnswer) {
        return {
          status: q.type === 'not_yet' ? 'not_yet_eligible' : 'not_eligible',
          reasonKey: q.reasonKey
        };
      }
    }
    return {
      status: 'eligible',
      reasonKey: null
    };
  };

  const result = getResult();

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-accent mb-4 flex items-center justify-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
          {t('eligibility_title')}
        </h2>
        <p className="text-muted-foreground">{t('eligibility_subtitle')}</p>
      </div>

      <div className="bg-card border border-border p-8 rounded-xl shadow-sm min-h-[300px] flex flex-col justify-between">
        {currentStep < questions.length ? (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-muted text-muted-foreground rounded-full">
                  Question {currentStep + 1} of {questions.length}
                </span>
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-8">
                {t(questions[currentStep].textKey)}
              </h3>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 py-3 px-6 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> {t('yes')}
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 py-3 px-6 bg-secondary text-white font-medium rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" /> {t('no')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {result.status === 'eligible' ? (
              <div className="space-y-6">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                      <Check className="w-5 h-5" /> {t('eligible_status')}
                    </h3>
                    <p className="text-sm">{t('eligible_msg')}</p>
                  </div>
                  <SpeakButton text={t('eligible_msg')} lang={i18n.language === 'hi' ? 'hi' : 'en'} />
                </div>

                <div className="p-6 border border-border rounded-lg bg-muted/20">
                  <h4 className="font-heading font-bold text-accent mb-3 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-primary" />
                    {t('next_steps')}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('register_form6')}
                  </p>
                  <a
                    href="https://voters.eci.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                  >
                    {t('visit_nvsp')} <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <X className="w-5 h-5" />
                    {result.status === 'not_yet_eligible' ? t('not_yet_eligible_status') : t('not_eligible_status')}
                  </h3>
                  <p className="text-sm">
                    {t(result.reasonKey!)}
                  </p>
                  <p className="text-xs opacity-75 mt-3">
                    Please note that this is general guidance based on your self-reported answers and not a legal determination.
                  </p>
                </div>
                <SpeakButton text={t(result.reasonKey!)} lang={i18n.language === 'hi' ? 'hi' : 'en'} />
              </div>
            )}

            <button
              onClick={handleRestart}
              className="w-full mt-4 py-2 px-4 border border-border hover:border-primary hover:text-primary rounded-lg text-sm font-medium transition-colors"
            >
              {t('restart')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

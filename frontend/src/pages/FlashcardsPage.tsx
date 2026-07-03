import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Flashcard } from '../components/Flashcards/Flashcard';
import { BookOpen, RefreshCw } from 'lucide-react';
import { getDueCards, recordAnswer } from '../lib/spacedRepetition';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const FlashcardsPage = () => {
  const { t } = useTranslation();
  useDocumentMeta(t('meta_learn_title'), t('meta_learn_desc'));
  const [allCards, setAllCards] = useState<any[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, any>>({});
  const [dueCards, setDueCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('matdata_flashcard_progress');
    const pMap = stored ? JSON.parse(stored) : {};
    setProgressMap(pMap);

    fetch('/api/flashcards')
      .then((res) => res.json())
      .then((data) => {
        setAllCards(data);
        const due = getDueCards(data, pMap);
        setDueCards(due);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error loading flashcards:', err);
        setIsLoading(false);
      });
  }, []);

  const handleNext = (knewIt: boolean) => {
    if (dueCards.length === 0) return;
    const currentCard = dueCards[currentIndex];

    const updatedMap = recordAnswer(currentCard.id, knewIt);
    setProgressMap(updatedMap);

    const updatedDue = getDueCards(allCards, updatedMap);
    setDueCards(updatedDue);

    if (updatedDue.length === 0) {
      setCurrentIndex(0);
    } else {
      if (knewIt) {
        setCurrentIndex((prev) => (prev >= updatedDue.length ? 0 : prev));
      } else {
        setCurrentIndex((prev) => (prev + 1 >= updatedDue.length ? 0 : prev + 1));
      }
    }
  };

  const handleReset = () => {
    localStorage.removeItem('matdata_flashcard_progress');
    setProgressMap({});
    const due = getDueCards(allCards, {});
    setDueCards(due);
    setCurrentIndex(0);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center text-muted-foreground">
        Loading flashcards...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-heading font-bold text-accent mb-4 flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8" />
          {t('nav_flashcards')}
        </h2>
        <p className="text-muted-foreground">Master election concepts with our bilingual flashcards.</p>
        <div className="flex flex-col items-center justify-center gap-2 mt-4">
          <p className="text-sm text-primary font-medium">
            {dueCards.length} cards due today
          </p>
          {dueCards.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Card {currentIndex + 1} of {dueCards.length}
            </p>
          )}
        </div>
      </div>

      {dueCards.length > 0 ? (
        <Flashcard 
          key={dueCards[currentIndex].id} 
          card={dueCards[currentIndex]} 
          onNext={handleNext} 
        />
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm p-8 text-center max-w-md mx-auto">
          <h3 className="font-heading font-bold text-xl text-foreground mb-2">All caught up!</h3>
          <p className="text-muted-foreground mb-6">You have reviewed all due flashcards. Check back tomorrow!</p>
          <button 
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border hover:border-primary hover:text-primary rounded-lg transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" /> Reset Study Progress
          </button>
        </div>
      )}
    </div>
  );
};

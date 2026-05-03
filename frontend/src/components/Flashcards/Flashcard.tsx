import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { RefreshCcw, CheckCircle2 } from 'lucide-react';

interface FlashcardData {
  id: number;
  term_en: string;
  term_hi: string;
  definition_en: string;
  definition_hi: string;
  category: string;
}

interface Props {
  card: FlashcardData;
  onNext: (knewIt: boolean) => void;
}

export const Flashcard = ({ card, onNext }: Props) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { i18n, t } = useTranslation();

  const handleFlip = () => setIsFlipped(!isFlipped);

  const term = i18n.language === 'en' ? card.term_en : card.term_hi;
  const definition = i18n.language === 'en' ? card.definition_en : card.definition_hi;
  const otherTerm = i18n.language === 'en' ? card.term_hi : card.term_en;
  const otherDefinition = i18n.language === 'en' ? card.definition_hi : card.definition_en;

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      <motion.div
        className="w-full h-80 relative preserve-3d cursor-pointer"
        onClick={handleFlip}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-card rounded-xl shadow-lg border border-border p-6 flex flex-col items-center justify-center text-center">
          <span className="text-sm text-muted-foreground uppercase tracking-wider mb-4">{card.category}</span>
          <h3 className="text-3xl font-heading font-bold text-accent mb-2">{term}</h3>
          <p className="text-lg text-muted-foreground">{otherTerm}</p>
          <div className="mt-auto text-sm text-muted-foreground flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" /> Tap to flip
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary text-primary-foreground rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center overflow-y-auto">
          <p className="text-xl mb-4 font-medium">{definition}</p>
          <p className="text-md opacity-90">{otherDefinition}</p>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex justify-between mt-8 gap-4">
        <button
          onClick={() => { setIsFlipped(false); onNext(false); }}
          className="flex-1 bg-secondary text-white py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors"
        >
          {t('btn_still_learning')}
        </button>
        <button
          onClick={() => { setIsFlipped(false); onNext(true); }}
          className="flex-1 bg-accent text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors"
        >
          <CheckCircle2 className="w-5 h-5" /> {t('btn_know_it')}
        </button>
      </div>
    </div>
  );
};

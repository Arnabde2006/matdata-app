import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flashcard } from '../components/Flashcards/Flashcard';
import { BookOpen } from 'lucide-react';

const SAMPLE_FLASHCARDS = [
  {
    id: 1,
    term_en: 'Lok Sabha',
    term_hi: 'लोकसभा',
    definition_en: 'The lower house of India\'s bicameral Parliament, with members directly elected by citizens.',
    definition_hi: 'भारत की द्विसदनीय संसद का निचला सदन, जिसके सदस्य सीधे नागरिकों द्वारा चुने जाते हैं।',
    category: 'Election Basics'
  },
  {
    id: 2,
    term_en: 'Universal Adult Franchise',
    term_hi: 'सार्वभौमिक वयस्क मताधिकार',
    definition_en: 'The right of all adult citizens (18 years and above) to vote in elections regardless of caste, religion, or gender.',
    definition_hi: 'जाति, धर्म या लिंग की परवाह किए बिना चुनाव में वोट देने का सभी वयस्क नागरिकों (18 वर्ष और उससे अधिक) का अधिकार।',
    category: 'Election Basics'
  },
  {
    id: 3,
    term_en: 'NOTA',
    term_hi: 'नोटा',
    definition_en: 'None of the Above. A ballot option allowing voters to disapprove of all candidates.',
    definition_hi: 'उपरोक्त में से कोई नहीं। एक मतपत्र विकल्प जो मतदाताओं को सभी उम्मीदवारों को अस्वीकार करने की अनुमति देता है।',
    category: 'Election Basics'
  }
];

export const FlashcardsPage = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = (knewIt: boolean) => {
    console.log(knewIt ? 'User knew it' : 'User is still learning');
    if (currentIndex < SAMPLE_FLASHCARDS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop for demo
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-heading font-bold text-accent mb-4 flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8" />
          {t('nav_flashcards')}
        </h2>
        <p className="text-muted-foreground">Master election concepts with our bilingual flashcards.</p>
        <p className="text-sm mt-2 text-primary font-medium">Card {currentIndex + 1} of {SAMPLE_FLASHCARDS.length}</p>
      </div>

      <Flashcard 
        key={SAMPLE_FLASHCARDS[currentIndex].id} 
        card={SAMPLE_FLASHCARDS[currentIndex]} 
        onNext={handleNext} 
      />
    </div>
  );
};

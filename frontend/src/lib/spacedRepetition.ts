export interface Flashcard {
  id: number;
  term_en: string;
  term_hi: string;
  definition_en: string;
  definition_hi: string;
  category: string;
}

export interface FlashcardProgress {
  masteryLevel: number;
  nextReviewDate: string;
}

export type ProgressMap = Record<string, FlashcardProgress>;

const INTERVALS = [1, 3, 7, 14, 30, 90];

export function nextInterval(masteryLevel: number, wasCorrect: boolean): number {
  if (!wasCorrect) return 0;
  const level = Math.max(0, Math.min(masteryLevel, INTERVALS.length - 1));
  return INTERVALS[level];
}

export function getDueCards(cards: Flashcard[], progressMap: ProgressMap): Flashcard[] {
  const todayStr = new Date().toISOString().split('T')[0];

  return cards.filter((card) => {
    const progress = progressMap[card.id];
    if (!progress) return true;
    const nextReviewDateStr = progress.nextReviewDate.split('T')[0];
    return nextReviewDateStr <= todayStr;
  });
}

export function recordAnswer(cardId: number, wasCorrect: boolean): ProgressMap {
  const stored = localStorage.getItem('matdata_flashcard_progress');
  const progressMap: ProgressMap = stored ? JSON.parse(stored) : {};

  const current = progressMap[cardId] || { masteryLevel: 0, nextReviewDate: '' };
  
  let newLevel = current.masteryLevel;
  if (wasCorrect) {
    newLevel = Math.min(newLevel + 1, 5);
  } else {
    newLevel = 0;
  }

  const daysToAdd = nextInterval(newLevel, wasCorrect);
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  const nextReviewDate = nextDate.toISOString();

  progressMap[cardId] = {
    masteryLevel: newLevel,
    nextReviewDate,
  };

  localStorage.setItem('matdata_flashcard_progress', JSON.stringify(progressMap));
  return progressMap;
}

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Flashcard } from './Flashcard';
import React from 'react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, animate, ...props }: any) => (
      <div onClick={onClick} data-testid="motion-div" data-flipped={animate?.rotateY === 180} {...props}>
        {children}
      </div>
    ),
  },
}));

const mockCard = {
  id: 1,
  term_en: 'Test Term',
  term_hi: 'टेस्ट',
  definition_en: 'Test Def',
  definition_hi: 'टेस्ट डेफ',
  category: 'Test Category'
};

describe('Flashcard Component', () => {
  it('displays term', () => {
    render(<Flashcard card={mockCard} onNext={vi.fn()} />);
    expect(screen.getByText('Test Term')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  it('flips on click', () => {
    render(<Flashcard card={mockCard} onNext={vi.fn()} />);
    const cardDiv = screen.getByTestId('motion-div');
    expect(cardDiv.getAttribute('data-flipped')).toBe('false');
    fireEvent.click(cardDiv);
    expect(cardDiv.getAttribute('data-flipped')).toBe('true');
  });
});

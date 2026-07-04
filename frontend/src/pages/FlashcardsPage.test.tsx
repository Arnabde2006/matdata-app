import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FlashcardsPage } from './FlashcardsPage';
import React from 'react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div onClick={onClick} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
}));

const mockCards = [
  { id: 1, term_en: 'Lok Sabha', term_hi: 'लोक सभा', definition_en: 'House of the People', definition_hi: 'लोगों का सदन', category: 'Parliament' },
  { id: 2, term_en: 'Card 2', term_hi: 'कार्ड २', definition_en: 'Def 2', definition_hi: 'डेफ २', category: 'Parliament' },
  { id: 3, term_en: 'Card 3', term_hi: 'कार्ड ३', definition_en: 'Def 3', definition_hi: 'डेफ ३', category: 'Parliament' }
];

beforeEach(() => {
  globalThis.fetch = vi.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockCards),
    })
  ) as unknown as typeof globalThis.fetch;
  localStorage.clear();
});

describe('FlashcardsPage Component', () => {
  it('renders cards', async () => {
    render(<FlashcardsPage />);
    expect(await screen.findByText('Card 1 of 3')).toBeInTheDocument();
    expect(screen.getByText('Lok Sabha')).toBeInTheDocument();
  });

  it('flip works and next works', async () => {
    render(<FlashcardsPage />);
    const knowItBtn = await screen.findByText('btn_know_it');
    fireEvent.click(knowItBtn);
    expect(await screen.findByText('Card 1 of 2')).toBeInTheDocument();
  });

  it('progress tracking loops at end', async () => {
    render(<FlashcardsPage />);
    const stillLearningBtn = await screen.findByText('btn_still_learning');
    fireEvent.click(stillLearningBtn);
    expect(await screen.findByText('Card 2 of 3')).toBeInTheDocument();
    const btn2 = screen.getByText('btn_still_learning');
    fireEvent.click(btn2);
    expect(await screen.findByText('Card 3 of 3')).toBeInTheDocument();
    const btn3 = screen.getByText('btn_still_learning');
    fireEvent.click(btn3);
    expect(await screen.findByText('Card 1 of 3')).toBeInTheDocument();
  });
});
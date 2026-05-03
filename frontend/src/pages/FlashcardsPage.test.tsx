import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FlashcardsPage } from './FlashcardsPage';
import React from 'react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, ...props }: any) => (
      <div onClick={onClick} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
}));

describe('FlashcardsPage Component', () => {
  it('renders cards', () => {
    render(<FlashcardsPage />);
    expect(screen.getByText('Card 1 of 3')).toBeInTheDocument();
    expect(screen.getByText('Lok Sabha')).toBeInTheDocument();
  });

  it('flip works and next works', async () => {
    render(<FlashcardsPage />);
    const knowItBtn = screen.getByText('btn_know_it');
    fireEvent.click(knowItBtn);
    expect(await screen.findByText('Card 2 of 3')).toBeInTheDocument();
  });

  it('progress tracking loops at end', async () => {
    render(<FlashcardsPage />);
    const knowItBtn = screen.getByText('btn_know_it');
    fireEvent.click(knowItBtn);
    expect(await screen.findByText('Card 2 of 3')).toBeInTheDocument();
    const btn2 = screen.getByText('btn_know_it');
    fireEvent.click(btn2);
    expect(await screen.findByText('Card 3 of 3')).toBeInTheDocument();
    const btn3 = screen.getByText('btn_know_it');
    fireEvent.click(btn3);
    expect(await screen.findByText('Card 1 of 3')).toBeInTheDocument();
  });
});

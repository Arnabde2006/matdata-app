import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from './Navbar';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() }
  }),
}));

describe('Navbar Component', () => {
  it('renders links', () => {
    render(<BrowserRouter><Navbar /></BrowserRouter>);
    expect(screen.getByText('nav_timeline')).toHaveAttribute('href', '/timeline');
    expect(screen.getByText('nav_flashcards')).toHaveAttribute('href', '/learn');
  });

  it('renders language toggle and translate widget', () => {
    const { container } = render(<BrowserRouter><Navbar /></BrowserRouter>);
    expect(screen.getByRole('button', { name: /toggle language/i })).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('#google_translate_element')).toBeInTheDocument();
  });
});

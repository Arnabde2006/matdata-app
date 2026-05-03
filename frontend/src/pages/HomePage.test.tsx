import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HomePage } from './HomePage';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('HomePage Component', () => {
  it('renders correctly', () => {
    render(<BrowserRouter><HomePage /></BrowserRouter>);
    expect(screen.getByText(/Your Voice. Your Vote./i)).toBeInTheDocument();
  });

  it('has the correct title including Built by Arnab De', () => {
    render(<BrowserRouter><HomePage /></BrowserRouter>);
    expect(screen.getByText('Built by Arnab De')).toBeInTheDocument();
  });

  it('has CTA buttons', () => {
    render(<BrowserRouter><HomePage /></BrowserRouter>);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Learn Basics')).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageToggle } from './LanguageToggle';
import React from 'react';

const changeLanguageMock = vi.fn();
let currentLanguage = 'en';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      get language() { return currentLanguage; },
      changeLanguage: changeLanguageMock,
    },
  }),
}));

describe('LanguageToggle Component', () => {
  beforeEach(() => {
    currentLanguage = 'en';
    changeLanguageMock.mockClear();
    Storage.prototype.setItem = vi.fn();
  });

  it('switches language', () => {
    render(<LanguageToggle />);
    const button = screen.getByRole('button', { name: /toggle language/i });
    fireEvent.click(button);
    expect(changeLanguageMock).toHaveBeenCalledWith('hi');
  });

  it('stores preference', () => {
    render(<LanguageToggle />);
    const button = screen.getByRole('button', { name: /toggle language/i });
    fireEvent.click(button);
    expect(localStorage.setItem).toHaveBeenCalledWith('i18nextLng', 'hi');
  });
});

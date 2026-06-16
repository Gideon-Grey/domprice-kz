'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { value: 'ru', label: 'Русский', short: 'RU' },
    { value: 'en', label: 'English', short: 'EN' },
  ];

  const currentLang = languages.find(l => l.value === language) || languages[0];

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="language-switcher-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch language"
      >
        <span>{currentLang.short}</span>
        <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="language-switcher-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.value}
              className={`language-option ${language === lang.value ? 'active' : ''}`}
              onClick={() => {
                setLanguage(lang.value as 'ru' | 'en');
                setIsOpen(false);
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
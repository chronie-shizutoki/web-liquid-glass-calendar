import { useState, useEffect } from 'react';

// Import translations from language files
import { translations, availableLanguages } from './languages/index.js';
export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Get language settings from local storage, or use browser language
    const savedLanguage = localStorage.getItem('calendar-language');
    if (savedLanguage && translations[savedLanguage]) {
      return savedLanguage;
    }
    
    // Detect browser language
    const browserLanguage = navigator.language || navigator.userLanguage;
    if (browserLanguage.startsWith('zh')) {
      return browserLanguage.includes('TW') || browserLanguage.includes('HK') ? 'zh-TW' : 'zh-CN';
    } else if (browserLanguage.startsWith('ja')) {
      return 'ja';
    } else {
      return 'en';
    }
  });

  // Save language settings to local storage
  useEffect(() => {
    localStorage.setItem('calendar-language', currentLanguage);
  }, [currentLanguage]);

  // Get translation text
  const t = (key, fallback = key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback;
      }
    }
    
    return typeof value === 'string' ? value : fallback;
  };

  // Get translation object for the current language
  const getTranslations = () => {
    return translations[currentLanguage] || translations['zh-CN'];
  };

  // Switch language
  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode);
    }
  };

  // Format date
  const formatDate = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString(currentLanguage, { ...defaultOptions, ...options });
  };

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString(currentLanguage, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    getTranslations,
    formatDate,
    formatTime,
    availableLanguages
  };
};


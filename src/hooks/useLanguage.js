import { useState, useEffect } from 'react';

// 从语言文件中导入翻译
import { translations, availableLanguages } from './languages/index.js';
export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // 从本地存储获取语言设置，或使用浏览器语言
    const savedLanguage = localStorage.getItem('calendar-language');
    if (savedLanguage && translations[savedLanguage]) {
      return savedLanguage;
    }
    
    // 检测浏览器语言
    const browserLanguage = navigator.language || navigator.userLanguage;
    if (browserLanguage.startsWith('zh')) {
      return browserLanguage.includes('TW') || browserLanguage.includes('HK') ? 'zh-TW' : 'zh-CN';
    } else if (browserLanguage.startsWith('ja')) {
      return 'ja';
    } else {
      return 'en';
    }
  });

  // 保存语言设置到本地存储
  useEffect(() => {
    localStorage.setItem('calendar-language', currentLanguage);
  }, [currentLanguage]);

  // 获取翻译文本
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

  // 获取当前语言的翻译对象
  const getTranslations = () => {
    return translations[currentLanguage] || translations['zh-CN'];
  };

  // 切换语言
  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode);
    }
  };

  // 格式化日期
  const formatDate = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString(currentLanguage, { ...defaultOptions, ...options });
  };

  // 格式化时间
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


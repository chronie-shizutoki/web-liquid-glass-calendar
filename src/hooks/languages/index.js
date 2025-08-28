// Import all language packs
import zhCN from './zh-CN.js';
import zhTW from './zh-TW.js';
import en from './en.js';
import ja from './ja.js';

// Export combined language pack
export const translations = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en': en,
  'ja': ja
};

// Export language list
export const availableLanguages = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' }
];
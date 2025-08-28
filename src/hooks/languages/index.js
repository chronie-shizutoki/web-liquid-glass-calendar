// 导入所有语言包
import zhCN from './zh-CN.js';
import zhTW from './zh-TW.js';
import en from './en.js';
import ja from './ja.js';

// 导出组合的语言包
export const translations = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en': en,
  'ja': ja
};

// 导出语言列表
export const availableLanguages = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' }
];
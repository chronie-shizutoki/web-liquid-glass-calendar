import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Globe, Check } from 'lucide-react';

const LanguageSelector = ({ currentLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);

  const languages = [
    { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
    { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  const handleLanguageSelect = (languageCode) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  const handleToggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
    setIsOpen(!isOpen);
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggleMenu}
        className="glass-button p-3 rounded-full flex items-center gap-2"
      >
        <Globe className="h-5 w-5 text-white" />
        <span className="text-white text-sm hidden sm:inline">{currentLang.flag}</span>
      </button>

      {isOpen && createPortal(
        <>
          {/* Background mask */}
          <div
            className="fixed inset-0 z-[999999]"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Language selection menu */}
          <div 
            className="fixed glass-card rounded-xl p-2 min-w-48 z-[999999]"
            style={{
              top: `${menuPosition.top}px`,
              right: `${menuPosition.right}px`
            }}
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all
                  ${currentLanguage === language.code
                    ? 'bg-blue-500/30 text-white'
                    : 'text-white/80 hover:bg-white/10'
                  }
                `}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="flex-1">{language.name}</span>
                {currentLanguage === language.code && (
                  <Check className="h-4 w-4 text-blue-400" />
                )}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default LanguageSelector;


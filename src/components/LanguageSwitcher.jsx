import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

/**
 * 语言切换器组件
 * 使用内联样式，与网站整体设计风格保持一致
 * 
 * @param {Object} props
 * @param {'toggle' | 'dropdown' | 'buttons'} props.variant - 显示模式
 */
export function LanguageSwitcher({ 
  variant = 'toggle', 
}) {
  const { currentLanguage, languages, changeLanguage, toggleLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 语言图标组件
  const LanguageIcon = () => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );

  // Toggle 模式 - 简单切换按钮（与主题切换按钮风格一致）
  if (variant === 'toggle') {
    return (
      <motion.button
        onClick={toggleLanguage}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--color-border)',
          background: 'transparent',
          color: 'var(--color-text-main)',
          fontSize: '0.9em',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: 'var(--font-sans)',
        }}
        aria-label={t('language.switchTo')}
      >
        <LanguageIcon />
        <span>{currentLanguage === 'zh' ? 'EN' : '中'}</span>
      </motion.button>
    );
  }

  // Buttons 模式 - 按钮组
  if (variant === 'buttons') {
    return (
      <div style={{ 
        display: 'inline-flex', 
        borderRadius: 'var(--radius-md)', 
        border: '1px solid var(--color-border)', 
        overflow: 'hidden' 
      }}>
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '8px 16px',
              fontSize: '0.85em',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-sans)',
              background: currentLanguage === lang.code 
                ? 'var(--color-text-main)' 
                : 'transparent',
              color: currentLanguage === lang.code 
                ? 'var(--color-bg)' 
                : 'var(--color-text-muted)',
            }}
          >
            {lang.nativeName}
          </motion.button>
        ))}
      </div>
    );
  }

  // Dropdown 模式 - 下拉选择器
  return (
    <div 
      ref={dropdownRef} 
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          background: 'transparent',
          color: 'var(--color-text-main)',
          fontSize: '0.9em',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: 'var(--font-sans)',
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <LanguageIcon />
        <span>
          {languages.find(l => l.code === currentLanguage)?.nativeName || currentLanguage}
        </span>
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              padding: '8px 0',
              minWidth: '120px',
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              border: '1px solid var(--color-border)',
              zIndex: 50,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            role="listbox"
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                whileHover={{ x: 2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 16px',
                  fontSize: '0.9em',
                  textAlign: 'left',
                  border: 'none',
                  background: currentLanguage === lang.code 
                    ? 'var(--color-bg-subtle)' 
                    : 'transparent',
                  color: currentLanguage === lang.code 
                    ? 'var(--color-text-main)' 
                    : 'var(--color-text-muted)',
                  fontWeight: currentLanguage === lang.code ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'var(--font-sans)',
                }}
                role="option"
                aria-selected={currentLanguage === lang.code}
              >
                <span>{lang.nativeName}</span>
                {currentLanguage === lang.code && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSwitcher;
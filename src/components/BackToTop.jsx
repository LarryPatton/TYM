import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollLock } from '../contexts/ScrollLockContext';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { lockScroll } = useScrollLock();

  // 监听滚动
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // 平滑滚动到顶部
  const scrollToTop = () => {
    // 触发全局滚动锁定，防止其他组件的 onViewportEnter 干扰
    lockScroll(1500);
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            zIndex: 9999, // 提高层级，确保不被其他元素遮挡
          }}
        >
          <button
            onClick={scrollToTop}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'var(--color-primary)',
              color: 'var(--color-text-inverse)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-lg)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
            title="Back to Top"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
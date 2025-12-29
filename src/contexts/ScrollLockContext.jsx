import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ScrollLockContext = createContext({
  isScrollLocked: false,
  targetSection: null,
  lockScroll: () => {},
  unlockScroll: () => {},
});

export const useScrollLock = () => useContext(ScrollLockContext);

export const ScrollLockProvider = ({ children }) => {
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [targetSection, setTargetSection] = useState(null);
  const timeoutRef = useRef(null);

  const lockScroll = useCallback((duration = 1000, sectionId = null) => {
    // 清除之前的 timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsScrollLocked(true);
    setTargetSection(sectionId);
    
    // 自动解锁
    timeoutRef.current = setTimeout(() => {
      setIsScrollLocked(false);
      setTargetSection(null);
    }, duration);
  }, []);

  const unlockScroll = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsScrollLocked(false);
    setTargetSection(null);
  }, []);

  return (
    <ScrollLockContext.Provider value={{ isScrollLocked, targetSection, lockScroll, unlockScroll }}>
      {children}
    </ScrollLockContext.Provider>
  );
};

export default ScrollLockContext;

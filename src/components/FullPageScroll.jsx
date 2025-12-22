import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { motion } from 'framer-motion';

// Context for sharing scroll state
const ScrollContext = createContext({ currentIndex: 0, totalSections: 0 });

export const useScrollContext = () => useContext(ScrollContext);

/**
 * FullPageScroll Container
 * 全屏滚动容器，支持柔和的 scroll-snap 吸附效果
 */
export const FullPageScroll = ({ children, onSectionChange, navHeight = 80 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const totalSections = React.Children.count(children);
  const sectionHeight = `calc(100vh - ${navHeight}px)`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const height = container.clientHeight;
      const newIndex = Math.round(scrollTop / height);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalSections) {
        setCurrentIndex(newIndex);
        onSectionChange?.(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex, totalSections, onSectionChange]);

  // Function to scroll to a specific section
  const scrollToSection = (index) => {
    const container = containerRef.current;
    if (!container) return;
    
    const height = container.clientHeight;
    container.scrollTo({
      top: index * height,
      behavior: 'smooth'
    });
  };

  return (
    <ScrollContext.Provider value={{ currentIndex, totalSections, scrollToSection, sectionHeight }}>
      <div
        ref={containerRef}
        style={{
          height: sectionHeight,
          overflowY: 'auto',
          overflowX: 'hidden',
          // 使用 proximity 实现柔和吸附，滚动更自然
          scrollSnapType: 'y proximity',
          // Hide scrollbar
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
        className="fullpage-scroll-container"
      >
        <style>{`
          .fullpage-scroll-container::-webkit-scrollbar {
            display: none;
          }
          .fullpage-scroll-container {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
          }
        `}</style>
        {children}
      </div>
    </ScrollContext.Provider>
  );
};

/**
 * FullPageSection
 * 全屏 Section 组件，每个占据整个视口（减去导航栏高度）
 */
export const FullPageSection = ({ 
  children, 
  bgColor = 'var(--color-bg)',
  textColor = 'var(--color-text-main)',
  className = '',
  style = {},
  id,
  navHeight = 80
}) => {
  const { sectionHeight } = useScrollContext();
  
  return (
    <section
      id={id}
      style={{
        height: sectionHeight || `calc(100vh - ${navHeight}px)`,
        minHeight: sectionHeight || `calc(100vh - ${navHeight}px)`,
        width: '100%',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always', // 确保每个 section 都会吸附
        backgroundColor: bgColor,
        color: textColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...style
      }}
      className={className}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}
      >
        {children}
      </motion.div>
    </section>
  );
};

/**
 * DotNavigation
 * 右侧圆点导航组件
 */
export const DotNavigation = ({ sections = [], darkMode = false }) => {
  const { currentIndex, scrollToSection } = useScrollContext();

  // 根据当前 section 的背景色决定导航点颜色
  const isDark = darkMode || (sections[currentIndex]?.dark);
  const dotColor = isDark ? 'var(--color-dark-text)' : 'var(--color-text-main)';
  const dotInactiveColor = isDark ? 'var(--color-dark-text-muted)' : 'var(--color-text-light)';

  return (
    <div style={{
      position: 'fixed',
      right: '30px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      zIndex: 1000
    }}>
      {sections.map((section, index) => (
        <motion.button
          key={index}
          onClick={() => scrollToSection(index)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: currentIndex === index ? '12px' : '10px',
            height: currentIndex === index ? '12px' : '10px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: currentIndex === index ? dotColor : dotInactiveColor,
            cursor: 'pointer',
            padding: 0,
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          title={section.name}
        >
          {/* Tooltip on hover */}
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            style={{
              position: 'absolute',
              right: '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              whiteSpace: 'nowrap',
              fontSize: '12px',
              fontWeight: '500',
              color: dotColor,
              pointerEvents: 'none',
              background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)',
              padding: '4px 10px',
              borderRadius: '4px'
            }}
          >
            {section.name}
          </motion.span>
        </motion.button>
      ))}
    </div>
  );
};

export default FullPageScroll;

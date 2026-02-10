import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProcessAnchor = ({ screens, labels, phaseId, allScreens }) => {
  const [activeStep, setActiveStep] = useState(0); // 默认选中第一个
  const [isMobile, setIsMobile] = useState(false);
  
  // 用于范围计算的屏幕列表（如果提供 allScreens 则使用它，否则回退到 screens）
  const rangeScreens = allScreens || screens;
  
  // 移动端检测
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    // 滚动监听 - 确定当前活跃的分类
    const handleScroll = () => {
      const viewHeight = window.innerHeight;
      const center = viewHeight / 2;
      
      // 遍历所有屏幕，找到当前在视口中心的屏幕
      let currentScreenId = null;
      for (const id of rangeScreens) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= center && rect.bottom >= center) {
            currentScreenId = id;
            break;
          }
        }
      }
      
      // 如果找到当前屏幕，确定它属于哪个分类
      if (currentScreenId) {
        // 查找当前屏幕属于哪个分类（胶囊对应的 screens）
        const screenIndex = screens.indexOf(currentScreenId);
        if (screenIndex !== -1) {
          // 当前屏幕直接在 screens 列表中
          setActiveStep(screenIndex);
        } else {
          // 当前屏幕不在 screens 列表中，需要找到它属于哪个分类
          // 策略：找到 rangeScreens 中当前屏幕之前最近的一个在 screens 中的屏幕
          const currentRangeIndex = rangeScreens.indexOf(currentScreenId);
          for (let i = currentRangeIndex; i >= 0; i--) {
            const idx = screens.indexOf(rangeScreens[i]);
            if (idx !== -1) {
              setActiveStep(idx);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [screens, rangeScreens]);

  // 移动端：简化为仅显示当前步骤指示器（圆点形式）
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          left: '50%',
          top: '16px',
          transform: 'translateX(-50%)',
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(10, 10, 10, 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '8px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* 步骤圆点 */}
        {labels.map((_, index) => (
          <motion.div
            key={index}
            animate={{
              scale: index === activeStep ? 1 : 0.6,
              opacity: index === activeStep ? 1 : 0.3,
            }}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#fff',
              cursor: 'pointer',
            }}
            onClick={() => {
              const el = document.getElementById(screens[index]);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        ))}
        {/* 当前步骤标签 */}
        <span style={{
          color: '#fff',
          fontSize: '11px',
          fontWeight: 500,
          marginLeft: '4px',
          opacity: 0.9,
        }}>
          {labels[activeStep]}
        </span>
      </motion.div>
    );
  }

  // 桌面端：完整的步骤导航 - 始终显示
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        left: '50%',
        top: '24px',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(10, 10, 10, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '6px 6px',
        borderRadius: '100px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      {labels.map((label, index) => {
        const isActive = index === activeStep;
        return (
          <div 
            key={index}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              height: '32px',
              padding: '0 16px',
              borderRadius: '20px',
              background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            onClick={() => {
               const el = document.getElementById(screens[index]);
               if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              {/* Number */}
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 600,
                color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                fontVariantNumeric: 'tabular-nums',
                transition: 'color 0.3s ease'
              }}>
                0{index + 1}
              </span>
              
              {/* Label */}
              <span style={{
                color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                fontSize: '13px',
                fontWeight: isActive ? 500 : 400,
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
                transition: 'color 0.3s ease'
              }}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default ProcessAnchor;
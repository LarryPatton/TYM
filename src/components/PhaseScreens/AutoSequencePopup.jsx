import React, { useState, useEffect, useRef, useMemo } from 'react';

// 调试开关
const DEBUG = false;

/**
 * AutoSequencePopup - 自动顺序弹出组件
 * 使用纯 CSS 动画，避免 framer-motion 导致的重渲染问题
 */
const AutoSequencePopup = ({ 
  images = [], 
  images2 = [],
  interval = 300,
  duration = 0.6,
  bgColor = '#000',
  dualMode = false
}) => {
  // 使用数组存储可见索引，避免 Set 的引用问题
  const [visibleCount, setVisibleCount] = useState(0);
  const [visibleCount2, setVisibleCount2] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef(null);
  const animationTimersRef = useRef([]);
  const hasTriggeredRef = useRef(false);

  const imageKey = useMemo(() => images.map(img => img.src).join('|'), [images]);
  const imageKey2 = useMemo(() => images2.map(img => img.src).join('|'), [images2]);

  // 重置状态
  useEffect(() => {
    if (DEBUG) console.log('🔄 重置状态');
    
    animationTimersRef.current.forEach(timer => clearTimeout(timer));
    animationTimersRef.current = [];
    hasTriggeredRef.current = false;
    setVisibleCount(0);
    setVisibleCount2(0);
    setIsMounted(false);
    
    const mountTimer = setTimeout(() => setIsMounted(true), 100);
    
    return () => {
      clearTimeout(mountTimer);
      animationTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [imageKey, imageKey2]);

  const useDualMode = dualMode && images2.length > 0;

  // IntersectionObserver - 一次性触发所有定时器
  useEffect(() => {
    if (!isMounted) return;
    
    const currentContainer = containerRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          if (DEBUG) console.log('🚀 开始顺序显示');
          
          // 一次性设置所有定时器，每个定时器只更新计数
          images.forEach((_, index) => {
            const timer = setTimeout(() => {
              setVisibleCount(index + 1);
            }, index * interval);
            animationTimersRef.current.push(timer);
          });
          
          if (useDualMode) {
            images2.forEach((_, index) => {
              const timer = setTimeout(() => {
                setVisibleCount2(index + 1);
              }, index * interval);
              animationTimersRef.current.push(timer);
            });
          }
        }
      },
      { threshold: 0.15, rootMargin: '-50px 0px' }
    );

    if (currentContainer) observer.observe(currentContainer);
    return () => { if (currentContainer) observer.unobserve(currentContainer); };
  }, [images.length, images2.length, interval, isMounted, useDualMode]);

  const FIXED_SCROLL_HEIGHT = 200;

  // CSS 动画样式
  const getImageStyle = (index, isVisible, isMobile) => ({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: index + 1,
    padding: isMobile ? '4px' : 0,
    opacity: isVisible ? 1 : 0,
    transition: `opacity ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1)`
  });

  const imgStyle = (isMobile) => ({
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    filter: isMobile 
      ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' 
      : 'drop-shadow(0 20px 60px rgba(0,0,0,0.3))',
    borderRadius: isMobile ? '6px' : 0
  });

  // 双区域模式
  if (useDualMode) {
    return (
      <div 
        ref={containerRef} 
        style={{
          height: `${FIXED_SCROLL_HEIGHT}vh`,
          position: 'relative',
          background: bgColor
        }}
      >
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'hidden',
          padding: '8px 8px 64px 8px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '48%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {images.map((image, index) => (
              <div 
                key={image.src} 
                style={getImageStyle(index, index < visibleCount, true)}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                  alt={image.label || `Image ${index + 1}`}
                  style={imgStyle(true)}
                />
              </div>
            ))}
          </div>
          
          <div style={{ width: '60%', height: '1px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
          
          <div style={{
            position: 'relative',
            width: '100%',
            height: '48%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {images2.map((image, index) => (
              <div 
                key={image.src} 
                style={getImageStyle(index, index < visibleCount2, true)}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                  alt={image.label || `Image ${index + 1}`}
                  style={imgStyle(true)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 单区域模式
  return (
    <div 
      ref={containerRef} 
      style={{
        height: `${FIXED_SCROLL_HEIGHT}vh`,
        position: 'relative',
        background: bgColor
      }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'relative',
          width: '90vw',
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {images.map((image, index) => (
            <div 
              key={image.src} 
              style={getImageStyle(index, index < visibleCount, false)}
            >
              <img
                src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                alt={image.label || `Image ${index + 1}`}
                style={imgStyle(false)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoSequencePopup;
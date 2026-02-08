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
  dualMode = false,
  caption = '',
  categoryLabel = '' // 新增: 分类标签
}) => {
  // 使用数组存储可见索引，避免 Set 的引用问题
  const [visibleCount, setVisibleCount] = useState(0);
  const [visibleCount2, setVisibleCount2] = useState(0);
  const [textVisible, setTextVisible] = useState(false); // 控制整体容器显示
  const [revealedCharCount, setRevealedCharCount] = useState(0); // 新增: 逐字显示计数器
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef(null);
  const animationTimersRef = useRef([]);
  const hasTriggeredRef = useRef(false);

  const imageKey = useMemo(() => images.map(img => img.src).join('|'), [images]);
  const imageKey2 = useMemo(() => images2.map(img => img.src).join('|'), [images2]);

  // 解析 Caption，识别高亮文本
  const parsedContent = useMemo(() => {
    if (!caption) return [];
    
    // 匹配中文引号、直角引号、英文引号中的内容
    // 1. 「...」
    // 2. “...” 或 "..."
    // 3. ‘...’
    const parts = [];
    let currentIndex = 0;
    
    // 正则匹配：匹配「...」或 "..." 或 “...”
    const regex = /([「"“])([^」"”]+)([」"”])/g;
    let match;
    
    while ((match = regex.exec(caption)) !== null) {
      // 添加普通文本
      if (match.index > currentIndex) {
        const text = caption.slice(currentIndex, match.index);
        [...text].forEach(char => parts.push({ char, highlight: false }));
      }
      
      // 添加高亮文本（保留引号）
      const fullMatch = match[0];
      [...fullMatch].forEach(char => parts.push({ char, highlight: true }));
      
      currentIndex = match.index + match[0].length;
    }
    
    // 添加剩余文本
    if (currentIndex < caption.length) {
      const text = caption.slice(currentIndex);
      [...text].forEach(char => parts.push({ char, highlight: false }));
    }
    
    return parts;
  }, [caption]);

  // 重置状态
  useEffect(() => {
    if (DEBUG) console.log('🔄 重置状态');
    
    animationTimersRef.current.forEach(timer => clearTimeout(timer));
    animationTimersRef.current = [];
    hasTriggeredRef.current = false;
    setVisibleCount(0);
    setVisibleCount2(0);
    setTextVisible(false); // 重置文字显示
    setRevealedCharCount(0); // 重置字数
    setIsMounted(false);
    
    const mountTimer = setTimeout(() => setIsMounted(true), 100);
    
    return () => {
      clearTimeout(mountTimer);
      animationTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [imageKey, imageKey2, caption]);

  const useDualMode = dualMode && images2.length > 0;

  // IntersectionObserver - 一次性触发所有定时器（图片 + 文字）
  useEffect(() => {
    if (!isMounted) return;
    
    const currentContainer = containerRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          if (DEBUG) console.log('🚀 开始顺序显示');
          
          // 立即触发文字区域显示
          setTextVisible(true);

          // 图片定时器
          images.forEach((_, index) => {
            const timer = setTimeout(() => {
              setVisibleCount(index + 1);
            }, index * interval);
            animationTimersRef.current.push(timer);
          });
          
          // 双区域模式图片定时器
          if (useDualMode) {
            images2.forEach((_, index) => {
              const timer = setTimeout(() => {
                setVisibleCount2(index + 1);
              }, index * interval);
              animationTimersRef.current.push(timer);
            });
          }

          // 文字逐字出现定时器 (JS 驱动，确保严格顺序)
          const totalChars = parsedContent.length;
          if (totalChars > 0) {
            const charInterval = 30; // 30ms 间隔，显著加快
            
            parsedContent.forEach((_, index) => {
              const timer = setTimeout(() => {
                setRevealedCharCount(prev => Math.max(prev, index + 1));
              }, index * charInterval);
              animationTimersRef.current.push(timer);
            });
          }
        }
      },
      { threshold: 0.15, rootMargin: '-50px 0px' }
    );

    if (currentContainer) observer.observe(currentContainer);
    return () => { if (currentContainer) observer.unobserve(currentContainer); };
  }, [images.length, images2.length, interval, isMounted, useDualMode, parsedContent.length]);

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

  // 双区域模式（移动端）
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

  // 是否有文字需要显示
  const hasCaption = !!caption;

  // 逐字出现的动画效果 - 显著调慢
  const staggerDelay = 0.08; // 从 0.02s 调整为 0.08s，放慢4倍

  // 单区域模式（桌面端）
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
        alignItems: 'center', // 垂直居中
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* 左侧文字区（仅有 caption 时显示） */}
        {hasCaption && (
          <div style={{
            width: '22%', // 调整宽度为22% (接近用户要求的20%，留出一点余量)
            height: 'auto',
            minHeight: '40vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center', // 内容垂直居中
            padding: '0 24px 0 48px', // 减少右内边距，保持左侧宽敞
            boxSizing: 'border-box',
            flexShrink: 0,
            overflow: 'visible',
            borderLeft: '1px solid rgba(255, 255, 255, 0.15)', // 装饰线
            marginLeft: '4%', // 左侧留白
            opacity: textVisible ? 1 : 0, // 容器整体显隐
            transition: 'opacity 0.2s ease-out', // 容错
            zIndex: 10
          }}>
            {/* 分类标签 */}
            {categoryLabel && (
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '1.2rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 500,
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}>
                {categoryLabel}
              </div>
            )}
            
            {/* 主标题/内容 */}
            <p style={{
              margin: 0,
              color: '#fff', // 默认白色
              fontSize: 'clamp(1.2rem, 2.4vh, 2rem)', // 略微调小一点以适应更窄宽度
              lineHeight: 1.35, // 略微增加行高提升阅读舒适度
              letterSpacing: '-0.01em',
              textAlign: 'left', // 左对齐
              width: '100%',
              fontWeight: 400 // 保持轻盈
            }}>
              {parsedContent.map((item, i) => {
                const isRevealed = i < revealedCharCount;
                return (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      color: item.highlight ? '#FF5722' : 'inherit', // 高亮颜色：深橙色
                      fontWeight: item.highlight ? 600 : 400, // 高亮时加粗
                      opacity: isRevealed ? 1 : 0,
                      // 优化动画：起始位置更低，模糊度更高，营造"慢慢浮出来"的感觉
                      transform: isRevealed ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
                      filter: isRevealed ? 'blur(0)' : 'blur(6px)',
                      // 这里的 transition 只负责单字的"进入动画"，不再负责延迟 sequence
                      transition: `
                        opacity 0.6s ease-out, 
                        transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), 
                        filter 0.6s ease-out,
                        color 0.3s ease
                      `,
                      whiteSpace: 'pre-wrap' // 保留空格
                    }}
                  >
                    {item.char}
                  </span>
                );
              })}
            </p>
          </div>
        )}

        {/* 右侧（或居中）图片区 */}
        <div style={{
          position: 'relative',
          width: hasCaption ? '74%' : '90vw', // 调整宽度填充剩余空间
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
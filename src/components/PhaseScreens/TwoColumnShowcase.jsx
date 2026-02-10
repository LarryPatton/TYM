import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * TwoColumnShowcase - 两列图片展示组件
 * 
 * 布局：
 * - 顶部：居中文案（逐字显示 + 高亮）
 * - 下方：左右两张大图平铺
 */
export const TwoColumnShowcase = memo(({
  screenNumber,
  screenLabel,
  content,
  contentKey,
  images = [], // 期望 2 张图片 [左图, 右图]
  bgColor = '#000',
  gap = '40px',
  imageScale = 0.9, // 图片缩放比例
  topPadding = '120px', // 文案区顶部间距
  imagePadding = '60px 80px' // 图片区域内边距
}) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  
  // 文案显示状态
  const [textVisible, setTextVisible] = useState(false);
  const [revealedCharCount, setRevealedCharCount] = useState(0);
  const textTimersRef = useRef([]);
  const hasTextTriggeredRef = useRef(false);
  
  // 移动端检测
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 获取文案内容
  const caption = contentKey ? t(contentKey) : (content || '');
  
  // 解析文案，识别高亮文本
  const parsedContent = useMemo(() => {
    if (!caption) return [];
    
    const highlightKeywords = ['KV', 'CMF', 'SKU', 'VI', 'UI', 'UX'];
    const parts = [];
    let currentIndex = 0;
    
    const keywordsPattern = highlightKeywords.map(kw => `\\b${kw}\\b`).join('|');
    const regex = new RegExp(`([「""])([^」""]+)([」""])|(${keywordsPattern})`, 'g');
    let match;
    
    while ((match = regex.exec(caption)) !== null) {
      if (match.index > currentIndex) {
        const text = caption.slice(currentIndex, match.index);
        [...text].forEach(char => parts.push({ char, highlight: false }));
      }
      const fullMatch = match[0];
      [...fullMatch].forEach(char => parts.push({ char, highlight: true }));
      currentIndex = match.index + match[0].length;
    }
    
    if (currentIndex < caption.length) {
      const text = caption.slice(currentIndex);
      [...text].forEach(char => parts.push({ char, highlight: false }));
    }
    
    return parts;
  }, [caption]);
  
  const hasCaption = !!caption && parsedContent.length > 0;
  
  // 文案逐字显示
  useEffect(() => {
    if (!hasCaption || hasTextTriggeredRef.current) return;
    
    hasTextTriggeredRef.current = true;
    setTextVisible(true);
    
    const charInterval = 30;
    parsedContent.forEach((_, index) => {
      const timer = setTimeout(() => {
        setRevealedCharCount(prev => Math.max(prev, index + 1));
      }, index * charInterval);
      textTimersRef.current.push(timer);
    });
    
    return () => {
      textTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [hasCaption, parsedContent.length]);
  
  // 左右图片
  const leftImage = images[0];
  const rightImage = images[1];
  
  if (!leftImage && !rightImage) return null;
  
  return (
    <section
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: bgColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: isMobile ? '80px' : topPadding,
        paddingBottom: isMobile ? '60px' : '80px',
        boxSizing: 'border-box'
      }}
    >
      {/* 顶部文案区 */}
      {hasCaption && (
        <div style={{
          width: '100%',
          maxWidth: 'var(--caption-max-width, 1100px)',
          padding: isMobile ? '0 20px 40px' : 'var(--caption-padding, 0 32px 60px)',
          boxSizing: 'border-box',
          textAlign: 'center',
          opacity: textVisible ? 1 : 0,
          transition: 'opacity 0.3s ease-out'
        }}>
          <p style={{
            margin: 0,
            color: 'var(--caption-color, #fff)',
            fontSize: isMobile ? '0.95rem' : 'var(--caption-font-size)',
            lineHeight: 'var(--caption-line-height, 1.7)',
            letterSpacing: 'var(--caption-letter-spacing, 0.04em)',
            fontWeight: 'var(--caption-font-weight, 300)'
          }}>
            {parsedContent.map((item, i) => {
              const isRevealed = i < revealedCharCount;
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline',
                    color: item.highlight ? 'var(--caption-color-highlight, #FF5722)' : 'inherit',
                    fontWeight: item.highlight ? 'var(--caption-font-weight-highlight, 600)' : 'var(--caption-font-weight, 300)',
                    opacity: isRevealed ? 1 : 0,
                    transition: 'var(--caption-fade-transition, opacity 0.4s ease-out, color 0.3s ease)',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {item.char}
                </span>
              );
            })}
          </p>
        </div>
      )}
      
      {/* 两列图片区 */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: isMobile ? '24px' : gap,
        width: '100%',
        maxWidth: '1600px',
        padding: isMobile ? '0 16px' : imagePadding,
        boxSizing: 'border-box',
        flex: 1
      }}>
        {/* 左图 */}
        {leftImage && (
          <div style={{
            flex: isMobile ? 'none' : 1,
            width: isMobile ? '100%' : 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img
              src={`${import.meta.env.BASE_URL}${leftImage.src.replace(/^\//, '')}`}
              alt={leftImage.label || 'Left Image'}
              style={{
                maxWidth: '100%',
                maxHeight: isMobile ? '40vh' : `calc(80vh * ${imageScale})`,
                objectFit: 'contain',
                borderRadius: 'var(--radius-image, 12px)',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))'
              }}
            />
          </div>
        )}
        
        {/* 右图 */}
        {rightImage && (
          <div style={{
            flex: isMobile ? 'none' : 1,
            width: isMobile ? '100%' : 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img
              src={`${import.meta.env.BASE_URL}${rightImage.src.replace(/^\//, '')}`}
              alt={rightImage.label || 'Right Image'}
              style={{
                maxWidth: '100%',
                maxHeight: isMobile ? '40vh' : `calc(80vh * ${imageScale})`,
                objectFit: 'contain',
                borderRadius: 'var(--radius-image, 12px)',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))'
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
});

TwoColumnShowcase.displayName = 'TwoColumnShowcase';

export default TwoColumnShowcase;

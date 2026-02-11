import React, { useRef, useMemo, memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * ScrollTextBar - 文字过渡条组件
 * 
 * 特性：
 * - 紧凑区域，作为上下屏幕之间的过渡分隔
 * - 当进入视口时，文字淡入浮现
 * - 两行文字居中显示
 * - 上下有细线边框（白色）划分区域
 * - 「」内文字高亮显示
 */
export const ScrollTextBar = memo(({
  contentKey,
  content,
  bgColor = '#000',
  textColor = 'var(--caption-color, #fff)',
  highlightColor = 'var(--caption-color-highlight, #FF5722)',
  borderColor = 'rgba(255, 255, 255, 0.2)',
  fontSize = 'var(--caption-font-size, clamp(1.1rem, 2.2vw, 1.5rem))',
  padding = '40px 24px',
  typingSpeed = 25  // 打字速度（毫秒/字）
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [revealedCharCount, setRevealedCharCount] = useState(0);
  const textTimersRef = useRef([]);
  const hasTriggeredRef = useRef(false);
  const { t } = useTranslation();
  
  // 获取文案内容
  const caption = contentKey ? t(contentKey) : (content || '');
  
  // 解析文案为逐字数组，识别高亮文本（「」内的内容 + 特定类型名词）
  const parsedChars = useMemo(() => {
    if (!caption) return [];
    
    const highlightKeywords = ['KV', 'CMF', 'SKU', 'VI', 'UI', 'UX'];
    const chars = [];
    let currentIndex = 0;
    
    const keywordsPattern = highlightKeywords.map(kw => `\\b${kw}\\b`).join('|');
    const regex = new RegExp(`([「""])([^」""]+)([」""])|(${keywordsPattern})`, 'g');
    let match;
    
    while ((match = regex.exec(caption)) !== null) {
      // 添加普通文本（逐字）
      if (match.index > currentIndex) {
        const text = caption.slice(currentIndex, match.index);
        [...text].forEach(char => chars.push({ char, highlight: false }));
      }
      // 添加高亮文本（逐字）
      const fullMatch = match[0];
      [...fullMatch].forEach(char => chars.push({ char, highlight: true }));
      
      currentIndex = match.index + match[0].length;
    }
    
    // 添加剩余文本
    if (currentIndex < caption.length) {
      const text = caption.slice(currentIndex);
      [...text].forEach(char => chars.push({ char, highlight: false }));
    }
    
    return chars;
  }, [caption]);
  
  // 使用 IntersectionObserver 检测可见性，触发打字效果
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          setIsVisible(true);
          
          // 逐字显示
          parsedChars.forEach((_, index) => {
            const timer = setTimeout(() => {
              setRevealedCharCount(prev => Math.max(prev, index + 1));
            }, index * typingSpeed);
            textTimersRef.current.push(timer);
          });
          
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    
    observer.observe(container);
    return () => {
      observer.disconnect();
      textTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [parsedChars, typingSpeed]);
  
  if (!caption) return null;
  
  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        zIndex: 2,
        background: bgColor,
        padding,
        borderTop: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center'
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize,
            fontWeight: 'var(--caption-font-weight, 300)',
            letterSpacing: 'var(--caption-letter-spacing, 0.04em)',
            color: textColor,
            lineHeight: 'var(--caption-line-height, 1.7)'
          }}
        >
          {parsedChars.map((item, i) => {
            const isRevealed = i < revealedCharCount;
            return (
              <span
                key={i}
                style={{
                  display: 'inline',
                  color: item.highlight ? highlightColor : 'inherit',
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
    </section>
  );
});

ScrollTextBar.displayName = 'ScrollTextBar';

export default ScrollTextBar;

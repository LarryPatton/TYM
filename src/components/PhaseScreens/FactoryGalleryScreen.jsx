import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SECTION_PADDING, MAX_WIDTH_WIDE } from './Common';
import { useLenisScrollProgress } from '../../hooks/useLenisScroll';

/**
 * ============================================
 * 屏幕: 工厂画廊展示 (FactoryGalleryScreen)
 * ============================================
 * 设计概念:
 * - 展示工厂实拍的竖向图片（约 9:16 比例）
 * - 采用错落瀑布流布局，形成真实工业感
 * - Lenis 驱动视差滚动，无入场动画（防闪烁）
 * ============================================
 */

// 生成伪随机数的辅助函数
const seededRandom = (seed) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// 线性插值
function interpolate(value, inputRange, outputRange) {
  if (value <= inputRange[0]) return outputRange[0];
  if (value >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1];
  for (let i = 0; i < inputRange.length - 1; i++) {
    if (value >= inputRange[i] && value <= inputRange[i + 1]) {
      const t = (value - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
      return outputRange[i] + (outputRange[i + 1] - outputRange[i]) * t;
    }
  }
  return outputRange[outputRange.length - 1];
}

export const FactoryGalleryScreen = ({
  screenNumber,
  screenLabel,
  content,
  contentKey,
  emphasis,
  images = [],
  columns = 4,
  bgAlt = false
}) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const captionRef = useRef(null);

  // 文案显示状态（打字机动画）
  const [textVisible, setTextVisible] = useState(false);
  const [revealedCharCount, setRevealedCharCount] = useState(0);
  const textTimersRef = useRef([]);
  const hasTextTriggeredRef = useRef(false);

  // 获取文案内容（优先使用 contentKey，其次使用 content）
  const caption = contentKey ? t(contentKey) : (content || '');

  // 解析文案，识别高亮文本（「」内的内容 + 特定类型名词）
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

  // 文案逐字显示的 IntersectionObserver
  useEffect(() => {
    if (!caption || parsedContent.length === 0) return;
    const captionEl = captionRef.current;
    if (!captionEl) {
      const retryTimer = setTimeout(() => {
        const el = captionRef.current;
        if (el && !hasTextTriggeredRef.current) {
          hasTextTriggeredRef.current = true;
          setTextVisible(true);
          const charInterval = 30;
          parsedContent.forEach((_, index) => {
            const timer = setTimeout(() => {
              setRevealedCharCount(prev => Math.max(prev, index + 1));
            }, index * charInterval);
            textTimersRef.current.push(timer);
          });
        }
      }, 500);
      return () => clearTimeout(retryTimer);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTextTriggeredRef.current) {
          hasTextTriggeredRef.current = true;
          setTextVisible(true);
          const charInterval = 30;
          parsedContent.forEach((_, index) => {
            const timer = setTimeout(() => {
              setRevealedCharCount(prev => Math.max(prev, index + 1));
            }, index * charInterval);
            textTimersRef.current.push(timer);
          });
        }
      },
      { threshold: 0 }
    );
    observer.observe(captionEl);
    return () => {
      observer.unobserve(captionEl);
      textTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [caption, parsedContent.length]);

  // caption 模式判定
  const hasCaption = !!caption && parsedContent.length > 0;

  const renderCaption = () => {
    if (!hasCaption) return null;
    const commaIndex = caption.indexOf('，');
    const lines = commaIndex > -1
      ? [caption.slice(0, commaIndex + 1), caption.slice(commaIndex + 1)]
      : [caption];
    let charOffset = 0;
    return (
      <div ref={captionRef} style={{
        width: '100%',
        maxWidth: 'var(--caption-max-width, 1100px)',
        padding: 'var(--caption-padding, 0 32px 40px)',
        boxSizing: 'border-box',
        textAlign: 'center',
        margin: '0 auto var(--space-3xl) auto',
        opacity: textVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
        position: 'relative',
        zIndex: 10
      }}>
        {lines.map((line, lineIdx) => {
          const lineStart = charOffset;
          charOffset += line.length;
          const lineContent = parsedContent.slice(lineStart, charOffset);
          return (
            <p key={lineIdx} style={{
              margin: lineIdx === 0 ? '0 0 8px 0' : 0,
              color: 'var(--caption-color, #fff)',
              fontSize: 'var(--caption-font-size)',
              lineHeight: 'var(--caption-line-height, 1.7)',
              letterSpacing: 'var(--caption-letter-spacing, 0.04em)',
              fontWeight: 'var(--caption-font-weight, 300)'
            }}>
              {lineContent.map((item, i) => {
                const globalIndex = lineStart + i;
                const isRevealed = globalIndex < revealedCharCount;
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
          );
        })}
      </div>
    );
  };
  
  // Lenis 驱动的滚动进度
  const { progress } = useLenisScrollProgress(containerRef, ["start end", "end start"]);

  // 多层视差效果（Lenis 驱动）
  const parallax1 = interpolate(progress, [0, 1], [60, -60]);
  const parallax2 = interpolate(progress, [0, 1], [40, -80]);
  const parallax3 = interpolate(progress, [0, 1], [80, -40]);

  // 分配图片到列（瀑布流）
  const distributeToColumns = (items, numCols) => {
    const cols = Array.from({ length: numCols }, () => []);
    items.forEach((item, index) => {
      cols[index % numCols].push({ ...item, globalIndex: index });
    });
    return cols;
  };

  const columnData = distributeToColumns(images, columns);

  // 根据列索引获取视差值
  const getParallax = (colIndex) => {
    const parallaxes = [parallax1, parallax2, parallax3, parallax1];
    return parallaxes[colIndex % parallaxes.length];
  };

  return (
    <section 
      ref={containerRef}
      style={{ 
        minHeight: '150vh',
        position: 'relative',
        background: bgAlt ? '#0d0d0d' : 'var(--phase-bg-color, #0a0a0a)',
        color: '#fff',
        padding: SECTION_PADDING,
        overflow: 'hidden'
      }}
    >
      {/* 顶部文案区域 */}
      <div style={{
        maxWidth: MAX_WIDTH_WIDE,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 10
      }}>
        {/* caption 模式：打字机动画 + 高亮 + --caption-* token */}
        {renderCaption()}
      </div>

      {/* 瀑布流画廊 */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-lg)',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 var(--space-xl)',
        alignItems: 'flex-start'
      }}>
        {columnData.map((column, colIndex) => {
          // 每列有不同的起始偏移
          const offsetY = (colIndex % 2 === 0) ? 0 : 60;
          const parallaxY = getParallax(colIndex);

          return (
            <div
              key={`col-${colIndex}`}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-lg)',
                transform: `translateY(${parallaxY}px)`,
                willChange: 'transform',
                marginTop: offsetY
              }}
            >
              {column.map((image) => {
                // 随机旋转角度
                const rotation = (seededRandom(image.globalIndex * 13) - 0.5) * 6;

                return (
                  <div
                    key={`img-${image.globalIndex}`}
                    style={{
                      position: 'relative',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                      transform: `rotate(${rotation}deg)`,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}
                  >
                    <img 
                      src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                      alt={image.label || `Factory image ${image.globalIndex + 1}`}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        transition: 'transform 0.3s ease'
                      }} 
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 强调信息 */}
      {emphasis && (
        <div
          style={{
            textAlign: 'center',
            marginTop: 'var(--space-3xl)',
            padding: 'var(--space-2xl)',
            zIndex: 30,
            position: 'relative'
          }}
        >
          <div style={{
            display: 'inline-block',
            padding: 'var(--space-xl) var(--space-3xl)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
              fontWeight: '400',
              color: '#fff',
              letterSpacing: '1px'
            }}>
              {emphasis}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default FactoryGalleryScreen;
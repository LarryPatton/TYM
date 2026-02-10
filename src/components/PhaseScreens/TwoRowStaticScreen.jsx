import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// 调试开关
const DEBUG = false;

/**
 * TwoRowStaticScreen - 上下两行静态展示组件（优化版）
 * 
 * 优化策略：
 * 1. 移除 framer-motion 的 useInView，使用 IntersectionObserver
 * 2. 使用 CSS transition 替代 motion 动画
 * 3. 使用 React.memo 优化子组件
 */
export const TwoRowStaticScreen = memo(({
  screenNumber,
  screenLabel,
  title,
  content,
  contentKey,
  layout,
  images = [],
  bgColor = '#000',
  sticky = false,
  stickyHeight = 150,
  showItemCount = true,
  sequentialPopup = false
}) => {
  const containerRef = useRef(null);
  const captionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [visibleRows, setVisibleRows] = useState([]);
  
  // 文案显示状态
  const [textVisible, setTextVisible] = useState(false);
  const [revealedCharCount, setRevealedCharCount] = useState(0);
  const textTimersRef = useRef([]);
  const hasTextTriggeredRef = useRef(false);
  
  const { t } = useTranslation();
  
  // 获取文案内容（优先使用 contentKey，其次使用 content）
  const caption = contentKey ? t(contentKey) : (content || '');
  
  // 解析文案，识别高亮文本（「」内的内容 + 特定类型名词）
  const parsedContent = useMemo(() => {
    if (!caption) return [];
    
    // 需要高亮的类型名词列表
    const highlightKeywords = ['KV', 'CMF', 'SKU', 'VI', 'UI', 'UX'];
    
    const parts = [];
    let currentIndex = 0;
    
    // 合并正则：匹配「...」或 "..." 或 "..." 或 特定关键词
    const keywordsPattern = highlightKeywords.map(kw => `\\b${kw}\\b`).join('|');
    const regex = new RegExp(`([「""])([^」""]+)([」""])|(${keywordsPattern})`, 'g');
    let match;
    
    while ((match = regex.exec(caption)) !== null) {
      // 添加普通文本
      if (match.index > currentIndex) {
        const text = caption.slice(currentIndex, match.index);
        [...text].forEach(char => parts.push({ char, highlight: false }));
      }
      
      // 添加高亮文本
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
  
  // 是否有文案需要显示
  const hasCaption = !!caption && parsedContent.length > 0;
  
  // 移动端检测
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // IntersectionObserver 替代 useInView
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '-20%' }
    );
    
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 按顺序弹出逻辑
  useEffect(() => {
    if (!sequentialPopup || !isInView || !layout?.rows) return;
    
    layout.rows.forEach((_, rowIndex) => {
      setTimeout(() => {
        setVisibleRows(prev => [...prev, rowIndex]);
      }, rowIndex * 600);
    });
  }, [isInView, sequentialPopup, layout?.rows?.length]);
  
  // 文案逐字显示（进入视口时触发）
  useEffect(() => {
    if (!hasCaption || !isInView || hasTextTriggeredRef.current) return;
    
    hasTextTriggeredRef.current = true;
    setTextVisible(true);
    
    // 逐字显示
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
  }, [hasCaption, isInView, parsedContent.length]);

  if (!layout || !layout.rows || images.length === 0) return null;

  // 移动端：简化为垂直网格布局
  if (isMobile) {
    const mobileAspectRatio = layout.rows[0]?.aspectRatio || 0.71;
    
    return (
      <section
        ref={containerRef}
        style={{
          background: bgColor,
          padding: '60px 16px 80px',
          color: '#fff'
        }}
      >
        {title && (
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 300,
            color: '#fff',
            marginBottom: '24px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            textAlign: 'center',
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(-15px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease'
          }}>
            {title}
          </h2>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          {images.map((img, index) => (
            <MobileImageItem
              key={`mobile-img-${index}`}
              img={img}
              index={index}
              aspectRatio={mobileAspectRatio}
            />
          ))}
        </div>

        {showItemCount && (
          <div style={{
            marginTop: '24px',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '2px',
            textAlign: 'center',
            opacity: isInView ? 1 : 0,
            transition: 'opacity 0.5s ease 0.3s'
          }}>
            {images.length} ITEMS
          </div>
        )}
      </section>
    );
  }

  // ============ 桌面端渲染 ============
  const baseHeight = 200;

  const renderContent = () => (
    <>
      {/* 顶部文案区 - 使用全局 CAPTION TOKENS */}
      {hasCaption ? (
        <div ref={captionRef} style={{
          width: '100%',
          maxWidth: 'var(--caption-max-width, 1100px)',
          padding: 'var(--caption-padding, 0 32px 40px)',
          boxSizing: 'border-box',
          textAlign: 'center',
          marginBottom: 'clamp(24px, 3vh, 40px)',
          opacity: textVisible ? 1 : 0,
          transition: 'opacity 0.3s ease-out'
        }}>
          <p style={{
            margin: 0,
            color: 'var(--caption-color, #fff)',
            fontSize: 'var(--caption-font-size)',
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
      ) : title && (
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 300,
          color: '#fff',
          marginBottom: '32px',
          letterSpacing: '6px',
          textTransform: 'uppercase',
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s'
        }}>
          {title}
        </h2>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        maxWidth: '1600px',
        width: '100%',
        alignItems: 'center'
      }}>
        {layout.rows.map((rowConfig, rowIndex) => {
          const startIndex = layout.rows.slice(0, rowIndex).reduce((sum, r) => sum + r.count, 0);
          const endIndex = startIndex + rowConfig.count;
          const rowImages = images.slice(startIndex, endIndex);
          const isRowVisible = sequentialPopup ? visibleRows.includes(rowIndex) : isInView;
          
          const aspectRatio = rowConfig.aspectRatio || 1;
          const height = baseHeight * rowConfig.scale;
          const width = height * aspectRatio;

          return (
            <DesktopRow
              key={`row-${rowIndex}`}
              rowImages={rowImages}
              startIndex={startIndex}
              isRowVisible={isRowVisible}
              width={width}
              height={height}
              rowConfig={rowConfig}
              sequentialPopup={sequentialPopup}
            />
          );
        })}
      </div>

      {showItemCount && (
        <div style={{
          marginTop: '32px',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '2px',
          opacity: isInView ? 1 : 0,
          transition: 'opacity 0.6s ease 1.2s'
        }}>
          {images.length} ITEMS
        </div>
      )}
    </>
  );

  // Sticky 模式
  if (sticky) {
    return (
      <div 
        ref={containerRef}
        style={{
          height: `${stickyHeight}vh`,
          position: 'relative',
          background: bgColor,
        }}
      >
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '100px',
          paddingLeft: '40px',
          paddingRight: '40px',
          paddingBottom: '40px',
          overflow: 'hidden'
        }}>
          {renderContent()}
        </div>
      </div>
    );
  }

  // 非 sticky 模式
  return (
    <div 
      ref={containerRef}
      style={{
        minHeight: '100vh',
        position: 'relative',
        background: bgColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '100px',
        paddingLeft: '40px',
        paddingRight: '40px',
        paddingBottom: '40px'
      }}
    >
      {renderContent()}
    </div>
  );
});

TwoRowStaticScreen.displayName = 'TwoRowStaticScreen';

/**
 * 移动端图片项
 */
const MobileImageItem = memo(({ img, index, aspectRatio }) => {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '-10%' }
    );
    
    if (itemRef.current) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, []);
  
  return (
    <div
      ref={itemRef}
      style={{
        aspectRatio: `${aspectRatio}`,
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 'var(--radius-image, 8px)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        transition: `opacity 0.4s ease ${index * 0.05}s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s`
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
        alt={img.label || `Image ${index + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          borderRadius: 'var(--radius-image, 8px)'
        }}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    </div>
  );
});

MobileImageItem.displayName = 'MobileImageItem';

/**
 * 桌面端行组件
 */
const DesktopRow = memo(({ rowImages, startIndex, isRowVisible, width, height, rowConfig, sequentialPopup }) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: isRowVisible ? 1 : 0,
        transform: isRowVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
        transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {rowImages.map((img, imgIndex) => {
        const globalIndex = startIndex + imgIndex;
        const useContain = rowConfig.contain !== false;

        return (
          <DesktopImageItem
            key={`img-${globalIndex}`}
            img={img}
            globalIndex={globalIndex}
            imgIndex={imgIndex}
            isRowVisible={isRowVisible}
            width={width}
            height={height}
            useContain={useContain}
            sequentialPopup={sequentialPopup}
          />
        );
      })}
    </div>
  );
});

DesktopRow.displayName = 'DesktopRow';

/**
 * 桌面端图片项
 */
const DesktopImageItem = memo(({ img, globalIndex, imgIndex, isRowVisible, width, height, useContain, sequentialPopup }) => {
  const [isHovered, setIsHovered] = useState(false);
  const delay = sequentialPopup ? imgIndex * 0.06 : 0.2 + imgIndex * 0.06;
  
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'visible',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        opacity: isRowVisible ? 1 : 0,
        transform: isRowVisible 
          ? (isHovered ? 'scale(1.05)' : 'scale(1) translateY(0)') 
          : 'scale(0.8) translateY(20px)',
        transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.3s ease`,
        zIndex: isHovered ? 10 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
        alt={img.label || `Image ${globalIndex + 1}`}
        style={{
          width: useContain ? 'auto' : '100%',
          height: '100%',
          maxWidth: '100%',
          objectFit: useContain ? 'contain' : 'cover',
          display: 'block',
          borderRadius: 'var(--radius-image, 12px)',
          filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.5))'
        }}
        onError={(e) => {
          console.error('TwoRowStatic image load error:', img.src);
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
});

DesktopImageItem.displayName = 'DesktopImageItem';

export default TwoRowStaticScreen;
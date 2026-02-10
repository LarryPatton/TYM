import React, { useRef, useState, useEffect, useMemo, memo } from 'react';
import { useLenis } from '../../contexts/LenisContext';
import { useTranslation } from 'react-i18next';

// 调试开关
const DEBUG = false;

/**
 * NaturalParallaxGrid - 自然滚动视差网格组件（优化版）
 * 
 * 优化策略：
 * 1. 移除 framer-motion 的 useScroll/useTransform
 * 2. 使用原生 scroll 事件 + requestAnimationFrame
 * 3. 使用 CSS transform 替代 motion 动画
 * 4. 使用 React.memo 优化子组件
 * 5. 使用 IntersectionObserver 替代 whileInView
 */
export const NaturalParallaxGrid = memo(({
  screenNumber,
  screenLabel,
  title,
  content,
  contentKey,
  groups = [],
  images = [],
  columns = 3,
  gap = '24px',
  rowGap: customRowGap,
  paddingTop = 60,
  bgColor = '#000',
  parallaxIntensity = 0.3,
  compactMode = false
}) => {
  const containerRef = useRef(null);
  const captionRef = useRef(null);
  const rafRef = useRef(null);
  const scrollProgressRef = useRef(0);
  
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
  // 视差位移状态
  const [parallaxOffset, setParallaxOffset] = useState({ fast: 0, slow: 0 });
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 文案逐字显示（组件挂载时触发）
  useEffect(() => {
    if (!hasCaption || hasTextTriggeredRef.current) return;
    
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
  }, [hasCaption, parsedContent.length]);

  // 判断是否使用分组模式
  const isGrouped = groups.length > 0;
  const groupsData = useMemo(() => 
    isGrouped ? groups : [{ label: null, images }],
    [isGrouped, groups, images]
  );

  // 视差位移量
  const maxOffset = isMobile ? 0 : 200 * parallaxIntensity;
  
  // 获取 Lenis 实例
  const { lenis, isReady: lenisReady } = useLenis();

  // 滚动监听 - 使用 Lenis 事件
  useEffect(() => {
    if (!containerRef.current || isMobile || !lenisReady || !lenis) return;
    
    const container = containerRef.current;
    
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // 计算滚动进度：容器进入视口到完全离开
      const containerTop = rect.top;
      const totalDistance = viewportHeight + rect.height;
      const scrolled = viewportHeight - containerTop;
      const progress = Math.max(0, Math.min(1, scrolled / totalDistance));
      
      // 只有进度变化超过阈值时才更新
      if (Math.abs(progress - scrollProgressRef.current) > 0.005) {
        scrollProgressRef.current = progress;
        
        // 计算视差位移
        const fast = maxOffset * 1.2 * (1 - 2 * progress);
        const slow = maxOffset * 0.4 * (1 - 2 * progress);
        
        setParallaxOffset({ fast, slow });
        
        if (DEBUG) {
          console.log('[NaturalParallaxGrid] Progress:', progress.toFixed(3));
        }
      }
    };
    
    // 使用 Lenis 的 scroll 事件
    lenis.on('scroll', handleScroll);
    handleScroll();
    
    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [isMobile, maxOffset, lenisReady, lenis]);

  // 收集所有图片用于移动端展示
  const allImages = useMemo(() => 
    groupsData.flatMap(g => g.images || []),
    [groupsData]
  );

  // 移动端：简化为 2 列网格布局
  if (isMobile) {
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
          <div style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.6)',
            textAlign: 'center',
            marginBottom: '24px',
            letterSpacing: '2px'
          }}>
            {title}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          maxWidth: '100%'
        }}>
          {allImages.map((img, index) => (
            <MobileGridItem 
              key={`mobile-grid-${index}`}
              img={img}
              index={index}
              compactMode={compactMode}
            />
          ))}
        </div>
      </section>
    );
  }

  // ============ 桌面端渲染 ============
  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        background: bgColor,
        padding: '80px 0',
        minHeight: '100vh'
      }}
    >
      {(screenNumber || screenLabel || title) && (
        <div style={{
          position: 'sticky',
          top: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          zIndex: 10,
          textAlign: 'center'
        }}>
          {screenNumber && screenLabel ? `${screenNumber} / ${screenLabel}` : (screenNumber || screenLabel || '')}
          {title && <div style={{ marginTop: '8px', fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}>{title}</div>}
        </div>
      )}

      {/* 顶部文案区 - 使用全局 CAPTION TOKENS */}
      {hasCaption && (
        <div ref={captionRef} style={{
          width: '100%',
          maxWidth: 'var(--caption-max-width, 1100px)',
          margin: '0 auto clamp(24px, 3vh, 40px)',
          padding: 'var(--caption-padding, 0 32px 40px)',
          boxSizing: 'border-box',
          textAlign: 'center',
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
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
        {groupsData.map((group, groupIndex) => (
          <StickyGroup
            key={`group-${groupIndex}`}
            group={group}
            groupIndex={groupIndex}
            totalGroups={groupsData.length}
            columns={columns}
            gap={gap}
            rowGap={customRowGap}
            paddingTop={paddingTop}
            parallaxOffset={parallaxOffset}
            compactMode={compactMode}
          />
        ))}
      </div>
    </div>
  );
});

NaturalParallaxGrid.displayName = 'NaturalParallaxGrid';

/**
 * 移动端网格项
 */
const MobileGridItem = memo(({ img, index, compactMode }) => {
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
      { threshold: 0.1, rootMargin: '-5%' }
    );
    
    if (itemRef.current) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, []);
  
  return (
    <div
      ref={itemRef}
      style={{
        aspectRatio: compactMode ? '4 / 3' : '3 / 4',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 'var(--radius-image, 8px)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.4s ease ${Math.min(index * 0.03, 0.3)}s, transform 0.4s ease ${Math.min(index * 0.03, 0.3)}s`
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
        alt={img.label || `Image ${index + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          borderRadius: 'var(--radius-image, 8px)'
        }}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    </div>
  );
});

MobileGridItem.displayName = 'MobileGridItem';

/**
 * StickyGroup - 带 sticky 效果的分组容器
 */
const StickyGroup = memo(({ group, groupIndex, totalGroups, columns, gap, rowGap, paddingTop, parallaxOffset, compactMode, aspectRatio }) => {
  const stickyScrollHeight = totalGroups > 1 ? 280 : 100;
  const groupSpacing = totalGroups > 1 ? '50vh' : '0';
  
  return (
    <div
      style={{
        height: totalGroups > 1 ? `${stickyScrollHeight}vh` : 'auto',
        minHeight: totalGroups > 1 ? undefined : '100vh',
        position: 'relative',
        marginBottom: groupIndex < totalGroups - 1 ? groupSpacing : '0'
      }}
    >
      <div
        style={{
          position: totalGroups > 1 ? 'sticky' : 'relative',
          top: totalGroups > 1 ? 0 : undefined,
          height: totalGroups > 1 ? '100vh' : 'auto',
          minHeight: totalGroups > 1 ? undefined : '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          padding: totalGroups > 1 ? 0 : '60px 0'
        }}
      >
        <ParallaxGridGroup
          images={group.images}
          columns={columns}
          gap={gap}
          rowGap={rowGap}
          paddingTop={paddingTop}
          parallaxOffset={parallaxOffset}
          compactMode={compactMode}
          aspectRatio={aspectRatio}
        />
      </div>
    </div>
  );
});

StickyGroup.displayName = 'StickyGroup';

/**
 * ParallaxGridGroup - 单个分组的视差网格
 */
const ParallaxGridGroup = memo(({ images, columns, gap, rowGap: customRowGap, paddingTop, parallaxOffset, compactMode, aspectRatio }) => {
  // 将图片分配到各列
  const columnsData = useMemo(() => {
    const cols = Array.from({ length: columns }, () => []);
    images.forEach((img, index) => {
      const colIndex = index % columns;
      cols[colIndex].push({ ...img, originalIndex: index });
    });
    return cols;
  }, [images, columns]);

  const colGap = compactMode ? '24px' : gap;
  const rowGapValue = customRowGap || (compactMode ? '4px' : gap);
  const gridWidth = compactMode ? '95%' : '100%';
  const offsetMultiplier = compactMode ? 0.3 : 0.5;
  const imgAspectRatio = aspectRatio || (compactMode ? '4 / 3' : '3 / 4');

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        columnGap: colGap,
        rowGap: rowGapValue,
        width: gridWidth,
        margin: '0 auto'
      }}
    >
      {columnsData.map((colImages, colIndex) => {
        const isEvenCol = colIndex % 2 === 0;
        const yOffset = isEvenCol ? parallaxOffset.fast : parallaxOffset.slow;

        return (
          <div
            key={`col-${colIndex}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: rowGapValue,
              transform: `translateY(${yOffset}px)`,
              transition: 'transform 0.1s ease-out',
              paddingTop: isEvenCol ? '0' : `${paddingTop * offsetMultiplier}px`
            }}
          >
            {colImages.map((img, i) => (
              <GridItem key={`item-${i}`} image={img} aspectRatio={imgAspectRatio} compactMode={compactMode} />
            ))}
          </div>
        );
      })}
    </div>
  );
});

ParallaxGridGroup.displayName = 'ParallaxGridGroup';

/**
 * GridItem - 单张图片项
 */
const GridItem = memo(({ image, aspectRatio = '3 / 4', compactMode = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );
    
    if (itemRef.current) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, []);

  if (!image) return null;

  return (
    <div
      ref={itemRef}
      style={{
        aspectRatio: aspectRatio,
        background: 'transparent',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 'var(--radius-image, 12px)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? (isHovered ? 'scale(1.03)' : 'scale(1)') : 'scale(0.9)',
        transition: 'opacity 0.5s ease, transform 0.3s ease'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
        alt={image.label || 'Grid Image'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          borderRadius: 'var(--radius-image, 12px)',
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
        }}
      />
      {image.label && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 12px',
            borderRadius: '12px',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
        >
          {image.label}
        </div>
      )}
    </div>
  );
});

GridItem.displayName = 'GridItem';

export default NaturalParallaxGrid;
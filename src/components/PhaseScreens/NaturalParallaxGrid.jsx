import React, { useRef, useState, useEffect, useMemo, memo } from 'react';
import { useLenis } from '../../contexts/LenisContext';

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
  const rafRef = useRef(null);
  const scrollProgressRef = useRef(0);
  
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
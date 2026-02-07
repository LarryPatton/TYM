import React, { useState, useEffect, useRef, memo, useMemo } from 'react';

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
  layout,
  images = [],
  bgColor = '#000',
  sticky = false,
  stickyHeight = 150,
  showItemCount = true,
  sequentialPopup = false
}) => {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [visibleRows, setVisibleRows] = useState([]);
  
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
      {title && (
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
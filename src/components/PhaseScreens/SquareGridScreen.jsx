import React, { useRef, useState, useEffect, memo, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// 调试开关
const DEBUG = false;

/**
 * SquareGridScreen - 方形图片网格滚动渐现（优化版）
 * 
 * 优化策略：
 * 1. 使用 React.memo 优化子组件
 * 2. 使用 useMemo 缓存计算结果
 * 3. 移动端完全禁用 framer-motion 动画
 * 4. 使用 IntersectionObserver 替代移动端的 whileInView
 * 
 * 注：文案显示统一使用 ScrollTextBar 组件，不在本组件内显示
 */
export const SquareGridScreen = memo(({
  screenNumber,
  screenLabel,
  images = [],
  columns: columnCount = 4,
  accessoryImages = [], 
  accessoryBackImages = [],
  bgColor = '#000',
  noBorder = false,
  imageScale = 1,
  gap = null,
  rowGap = null,
  columnGap = null,
  topPadding = null,  // 网格顶部间距配置（如 '100px', '10vh'）
  parallaxOffset = 0  // 视差起始偏移量调整（负值=减少顶部空白，正值=增加）
}) => {
  const containerRef = useRef(null);
  
  // 移动端检测
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 移动端优化
  const effectiveColumnCount = isMobile ? 2 : columnCount;
  const effectiveHasAccessories = isMobile ? false : accessoryImages.length > 0;
  
  // 滚动进度监听 - 只在桌面端使用
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const hasAccessories = effectiveHasAccessories;
  const hasFlip = isMobile ? false : accessoryBackImages.length > 0;
  
  // 预计算列数据
  const { columns, rowCount } = useMemo(() => {
    const tempColumns = Array.from({ length: effectiveColumnCount }, () => []);
    images.forEach((img, index) => {
      const colIndex = index % effectiveColumnCount;
      tempColumns[colIndex].push({ ...img, originalIndex: index });
    });
    const maxRowCount = Math.max(...tempColumns.map(col => col.length), 1);
    return { columns: tempColumns, rowCount: maxRowCount };
  }, [images, effectiveColumnCount]);
  
  // 视差参数计算（加入 parallaxOffset 调整）
  const { fastStart, fastEnd, slowStart, slowEnd } = useMemo(() => {
    const is6Row = rowCount >= 6;
    const is3Row = rowCount === 3;
    
    // 基础值
    const baseFastStart = is6Row ? 100 : (is3Row ? 300 : (rowCount >= 4 ? 200 : 120));
    const baseSlowStart = is6Row ? 50 : (is3Row ? 200 : (rowCount >= 4 ? 80 : 40));
    
    // 应用偏移量调整（负值减少顶部空白，正值增加）
    return {
      fastStart: baseFastStart + parallaxOffset,
      fastEnd: is6Row ? -1100 : (is3Row ? -300 : (rowCount >= 4 ? -200 : -120)),
      slowStart: baseSlowStart + parallaxOffset * 0.6,  // 慢速列按 60% 比例调整
      slowEnd: is6Row ? -900 : (is3Row ? -200 : (rowCount >= 4 ? -80 : -40))
    };
  }, [rowCount, parallaxOffset]);

  // Grid 动画
  const gridRange = hasAccessories ? [0, 0.35] : [0, 1];
  const yFast = useTransform(scrollYProgress, gridRange, [fastStart, fastEnd]);
  const ySlow = useTransform(scrollYProgress, gridRange, [slowStart, slowEnd]);
  const gridScale = useTransform(scrollYProgress, [0.3, 0.5], [1, 0.9]); 
  const gridOpacity = useTransform(scrollYProgress, [0.3, 0.5], [1, 0.2]); 
  const gridBlur = useTransform(scrollYProgress, [0.3, 0.5], ['blur(0px)', 'blur(10px)']); 
  
  // 配件动画
  const dropRange = [0.35, 0.55];
  const rawDropY = useTransform(scrollYProgress, dropRange, ['-150vh', '0vh']);
  const dropY = useSpring(rawDropY, { stiffness: 120, damping: 15 });
  const rawRotate = useTransform(scrollYProgress, dropRange, [-5, 0]);
  const smoothRotate = useSpring(rawRotate, { stiffness: 100, damping: 10 });

  // 翻转动画
  const flipRange = [0.65, 0.85];
  const flipRotateY = useTransform(scrollYProgress, flipRange, [0, 180]);
  const smoothFlipRotateY = useSpring(flipRotateY, { stiffness: 80, damping: 15 });

  if (images.length === 0) return null;

  // 间距计算
  const defaultGap = isMobile ? '10px' : (effectiveColumnCount >= 6 ? '12px' : '24px');
  const gapSize = gap || defaultGap;
  const finalRowGap = rowGap || gapSize;
  const finalColumnGap = columnGap || gapSize;
  const paddingTop = isMobile ? '0' : (effectiveColumnCount >= 6 ? '30px' : '60px');
  const desktopHeight = hasAccessories ? (hasFlip ? '500vh' : '400vh') : '300vh';

  // ============ 移动端：简化为垂直网格布局 ============
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
        {(screenNumber || screenLabel) && (
          <div style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            {screenNumber && screenLabel ? `${screenNumber} / ${screenLabel}` : (screenNumber || screenLabel)}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          maxWidth: '100%'
        }}>
          {images.map((img, index) => (
            <MobileGridItem
              key={`mobile-grid-${index}`}
              image={img}
              index={index}
            />
          ))}
        </div>
      </section>
    );
  }

  // ============ 桌面端：滚动视差网格 ============
  return (
    <div 
      ref={containerRef}
      style={{
        height: desktopHeight, 
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
        justifyContent: 'center',
        overflow: 'hidden',
        perspective: '1500px'
      }}>
        
        {(screenNumber || screenLabel) && (
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            zIndex: 10
          }}>
            {screenNumber && screenLabel ? `${screenNumber} / ${screenLabel}` : (screenNumber || screenLabel)}
          </div>
        )}

        {/* Background Grid */}
        <motion.div style={{
          position: 'absolute',
          top: topPadding || 0,  // 应用顶部间距配置
          left: 0,
          right: 0,
          bottom: 0,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: `repeat(${effectiveColumnCount}, 1fr)`,
          rowGap: finalRowGap,
          columnGap: finalColumnGap,
          maxWidth: effectiveColumnCount >= 6 ? '1600px' : '1400px',
          width: '100%',
          padding: effectiveColumnCount >= 6 ? '0 24px' : '0 48px',
          alignItems: 'center',
          scale: hasAccessories ? gridScale : 1,
          opacity: hasAccessories ? gridOpacity : 1,
          filter: hasAccessories ? gridBlur : 'none',
          zIndex: 1
        }}>
          {columns.map((colImages, colIndex) => {
            const isEvenCol = colIndex % 2 === 0;
            const yMotion = isEvenCol ? yFast : ySlow;
            
            return (
              <motion.div 
                key={`col-${colIndex}`}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: finalRowGap, 
                  y: yMotion,
                  paddingTop: isEvenCol ? '0' : paddingTop
                }}
              >
                {colImages.map((img, i) => (
                  <DesktopGridItem 
                    key={`col${colIndex}-${i}`} 
                    image={img} 
                    isCenter={!isEvenCol}
                    scale={imageScale}
                  />
                ))}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Foreground Accessories */}
        {hasAccessories && (
          <motion.div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            y: dropY,
            pointerEvents: 'none'
          }}>
             <div style={{
               display: 'flex',
               gap: '30px', 
               alignItems: 'flex-start',
               maxWidth: '1400px',
               width: '100%',
               justifyContent: 'center',
               padding: '0 48px',
               perspective: '1500px'
             }}>
               {accessoryImages.map((img, i) => {
                 const rotateFactor = (i % 2 === 0 ? 1 : -1) * (1 + i * 0.2); 
                 const backImage = accessoryBackImages[i];

                 return (
                   <FlipCard
                     key={i}
                     frontImage={img}
                     backImage={backImage}
                     index={i}
                     smoothRotate={smoothRotate}
                     rotateFactor={rotateFactor}
                     flipRotateY={hasFlip ? smoothFlipRotateY : null}
                   />
                 );
               })}
             </div>
          </motion.div>
        )}

      </div>
    </div>
  );
});

SquareGridScreen.displayName = 'SquareGridScreen';

/**
 * 移动端网格项 - 使用 IntersectionObserver
 */
const MobileGridItem = memo(({ image, index }) => {
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
        aspectRatio: '1 / 1',
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
        src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
        alt={image.label || `Image ${index + 1}`}
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

MobileGridItem.displayName = 'MobileGridItem';

/**
 * 桌面端网格项
 */
const DesktopGridItem = memo(({ image, isCenter, scale = 1 }) => {
  if (!image) return null;
  
  return (
    <div
      style={{
        aspectRatio: '1 / 1',
        background: 'transparent',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
        alt={image.label}
        style={{
          width: `${scale * 100}%`,
          height: `${scale * 100}%`,
          objectFit: 'contain', 
          display: 'block',
          background: 'transparent',
          borderRadius: 'var(--radius-image, 12px)',
          filter: isCenter 
            ? 'drop-shadow(0 20px 25px rgba(0,0,0,0.5))' 
            : 'drop-shadow(0 12px 18px rgba(0,0,0,0.3))',
        }}
      />
    </div>
  );
});

DesktopGridItem.displayName = 'DesktopGridItem';

/**
 * FlipCard - 3D 翻转卡片组件
 */
const FlipCard = memo(({ frontImage, backImage, index, smoothRotate, rotateFactor, flipRotateY }) => {
  const hasBack = !!backImage;
  
  return (
    <motion.div
      style={{
        width: '16%',
        aspectRatio: '1/3',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        rotate: useTransform(smoothRotate, r => r * rotateFactor),
        transformOrigin: 'top center',
        transformStyle: 'preserve-3d'
      }}
    >
      <div style={{
        width: '1px',
        height: '150vh',
        background: 'rgba(255,255,255,0.15)',
        position: 'absolute',
        bottom: '95%',
        left: '50%'
      }} />

      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          rotateY: flipRotateY || 0
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}>
          <img
            src={`${import.meta.env.BASE_URL}${frontImage.src.replace(/^\//, '')}`}
            alt={frontImage.label}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.6))'
            }}
          />
        </div>

        {hasBack && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}>
            <img
              src={`${import.meta.env.BASE_URL}${backImage.src.replace(/^\//, '')}`}
              alt={backImage.label}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.6))'
              }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
});

FlipCard.displayName = 'FlipCard';

export default SquareGridScreen;
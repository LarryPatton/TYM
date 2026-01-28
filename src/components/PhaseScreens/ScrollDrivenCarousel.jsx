import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

/**
 * ScrollDrivenCarousel - 滚动驱动轮播组件 (优化版：Focus Lens 风格)
 * 
 * 特性：
 * - 模仿 Screen 04 的 "Focus Lens" 交互
 * - 垂直滚动驱动水平位移 (Centered Carousel)
 * - 始终让当前图片居中
 * - 邻近图片模糊/缩放/淡化
 * - 适配 Wide (16:9) 宽图展示
 * 
 * @param {Array} images - 图片数组 [{src, label}]
 * @param {string} bgColor - 背景颜色
 */
export const ScrollDrivenCarousel = ({ 
  images = [], 
  bgColor = '#000',
  title = '',
  content = '',
  screenNumber = '',
  screenLabel = ''
}) => {
  const containerRef = useRef(null);
  
  // 滚动监听配置
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const [activeIndex, setActiveIndex] = useState(0);
  const itemCount = images.length;

  // 滚动进度 → 激活索引映射
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // 将 0~0.85 的滚动进度映射到 0~(itemCount-1) 的索引
      // 保留 15% 用于最后一张停留
      const adjustedProgress = Math.min(latest / 0.85, 1);
      const index = Math.round(adjustedProgress * (itemCount - 1));
      setActiveIndex(Math.min(index, itemCount - 1));
    });
    return () => unsubscribe();
  }, [scrollYProgress, itemCount]);

  if (images.length === 0) return null;

  // 计算滚动高度：每张图 100vh + 额外 50vh 缓冲
  const scrollHeight = itemCount * 100 + 50;
  
  // Item 尺寸配置 (Wide Screen)
  // 设定高度为 60vh, 比例 16:9 -> 宽度约为 106vh
  const ITEM_HEIGHT_VH = 60; 
  const ASPECT_RATIO = 16 / 9;
  const ITEM_WIDTH_VH = ITEM_HEIGHT_VH * ASPECT_RATIO;
  const GAP_PX = 10; // 从 40 减小到 10，让图片更紧凑

  return (
    <section 
      ref={containerRef}
      style={{
        height: `${scrollHeight}vh`, 
        position: 'relative',
        background: bgColor
      }}
    >
      {/* Sticky 容器 - 锁定在视口 */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* 标题浮层 (可选) */}
        {(title || content) && (
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '60px',
            zIndex: 20,
            maxWidth: '400px',
            pointerEvents: 'none', // 允许穿透点击
            textShadow: '0 2px 10px rgba(0,0,0,0.5)' // 增加文字阴影以防背景干扰
          }}>
            {screenNumber && (
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.6)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '1rem'
              }}>
                {screenNumber} / {screenLabel}
              </div>
            )}
            {title && (
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.5rem',
                fontWeight: '400',
                marginBottom: '1rem',
                lineHeight: 1.1,
                color: '#fff'
              }}>
                {title}
              </h2>
            )}
            {content && (
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1rem',
                lineHeight: 1.6
              }}>
                {content}
              </p>
            )}
          </div>
        )}

        {/* 卡片容器 - 垂直居中 */}
        <div style={{ 
          flex: 1,
          width: '100%',
          display: 'flex', 
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <motion.div 
            animate={{
              // 计算居中偏移: 屏幕中心(50vw) - (当前卡片左边距 + 卡片一半宽)
              x: `calc(50vw - ${(activeIndex * ITEM_WIDTH_VH + ITEM_WIDTH_VH / 2)}vh - ${activeIndex * GAP_PX}px)`
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.8 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: `${GAP_PX}px`,
              paddingLeft: '0', 
              height: '100%'
            }}
          >
            {images.map((image, i) => {
              const isActive = activeIndex === i;
              const distance = Math.abs(activeIndex - i);
              
              // 视觉层级参数 (Wide版稍微保守一点缩放，因为图很大)
              const blurValue = isActive ? 0 : Math.min(8, 2 + distance * 3);
              const opacityValue = isActive ? 1 : Math.max(0.2, 0.5 - distance * 0.15);
              const scaleValue = isActive ? 1.05 : Math.max(0.85, 0.9 - distance * 0.05);

              return (
                <motion.div
                  key={i}
                  animate={{
                    scale: scaleValue,
                    opacity: opacityValue,
                    zIndex: isActive ? 10 : 5 - distance,
                    filter: `blur(${blurValue}px)`
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{
                    height: `${ITEM_HEIGHT_VH}vh`, // 60vh
                    aspectRatio: `${ASPECT_RATIO}`, // 16:9
                    flexShrink: 0,
                    position: 'relative',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                    alt={image.label || `Slide ${i + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      background: 'transparent',
                      // 激活时添加柔和阴影，增加立体感
                      filter: isActive ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' : 'none'
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
        
        {/* 底部指示器区域 */}
        <div style={{
          height: '120px', // 底部预留空间
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '15px',
          flexShrink: 0
        }}>
          {/* 数字指示器 */}
          <div style={{
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-mono, monospace)',
            letterSpacing: '2px'
          }}>
            {String(activeIndex + 1).padStart(2, '0')} / {String(itemCount).padStart(2, '0')}
          </div>
          
          {/* 进度条指示器 */}
          <div style={{ 
            display: 'flex', 
            gap: '8px',
            alignItems: 'center'
          }}>
            {images.map((_, i) => (
              <motion.div 
                key={i}
                animate={{ 
                  width: activeIndex === i ? '40px' : '6px',
                  background: activeIndex === i ? '#fff' : 'rgba(255,255,255,0.2)'
                }}
                transition={{ duration: 0.3 }}
                style={{ 
                  height: '6px', 
                  borderRadius: '3px' 
                }}
              />
            ))}
          </div>
          
          {/* 滚动提示 */}
          <motion.div
            animate={{ opacity: activeIndex === 0 ? 0.5 : 0 }}
            style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginTop: '10px'
            }}
          >
            Scroll
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default ScrollDrivenCarousel;
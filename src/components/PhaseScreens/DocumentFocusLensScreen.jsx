import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

/**
 * DocumentFocusLensScreen - 文档 Focus Lens 展示组件
 * 
 * 特性：
 * - 4张 A4 竖向文档依次聚焦
 * - 滚动驱动切换
 * - 当前激活的文档放大居中
 * - 非激活文档模糊淡化
 * - 透明底 PNG 支持
 * 
 * @param {Array} images - 图片数组 [{src, label}]
 * @param {string} bgColor - 背景颜色
 */
export const DocumentFocusLensScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  images = [],
  bgColor = '#000'
}) => {
  const ref = useRef(null);
  
  // 滚动监听配置
  const { scrollYProgress } = useScroll({
    target: ref,
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

  // 计算滚动高度：每张图 100vh + 额外 50vh
  const scrollHeight = itemCount * 100 + 50;
  
  // Item 基础尺寸配置 (用于 Carousel 计算)
  const ITEM_HEIGHT_VH = 65; // 基准高度 65vh
  const ASPECT_RATIO = 2164 / 3063;
  const ITEM_WIDTH_VH = ITEM_HEIGHT_VH * ASPECT_RATIO;
  const GAP_PX = 60; // 间距

  return (
    <div 
      ref={ref} 
      style={{ 
        height: `${scrollHeight}vh`, 
        position: 'relative', 
        background: bgColor 
      }}
    >
      <div style={{ 
        position: 'sticky', 
        top: '0', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* 屏幕标识 - 顶部区域 */}
        <div style={{
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          zIndex: 20
        }}>
          <span style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            {screenNumber} / {screenLabel}
          </span>
        </div>

        {/* 文档卡片容器 - 中间区域 (Centered Carousel) */}
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
              x: `calc(50vw - ${(activeIndex * ITEM_WIDTH_VH + ITEM_WIDTH_VH / 2)}vh - ${activeIndex * GAP_PX}px)`
            }}
            transition={{ type: 'spring', stiffness: 150, damping: 25, mass: 0.8 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: `${GAP_PX}px`,
              paddingLeft: '0', // 居中是通过 x 偏移实现的
              height: '100%'
            }}
          >
            {images.map((image, i) => {
              const isActive = activeIndex === i;
              const distance = Math.abs(activeIndex - i);
              
              // 视觉层级参数优化
              const blurValue = isActive ? 0 : Math.min(8, 2 + distance * 3);
              const opacityValue = isActive ? 1 : Math.max(0.15, 0.4 - distance * 0.15);
              const scaleValue = isActive ? 1.15 : Math.max(0.8, 0.9 - distance * 0.05);

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
                    height: `${ITEM_HEIGHT_VH}vh`, // 使用固定基准高度，缩放通过 scale 实现
                    aspectRatio: `${ASPECT_RATIO}`,
                    flexShrink: 0, // 防止压缩
                    position: 'relative',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // originX: 0.5, // 默认中心缩放
                  }}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                    alt={image.label || `Document ${i + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      background: 'transparent',
                      boxShadow: isActive ? '0 20px 50px rgba(0,0,0,0.5)' : 'none' // 激活时增加阴影
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* 底部导航区域 */}
        <div style={{
          height: '100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px',
          flexShrink: 0
        }}>
          {/* 当前索引显示 */}
          <div style={{
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'var(--font-mono, monospace)',
            letterSpacing: '2px'
          }}>
            {String(activeIndex + 1).padStart(2, '0')} / {String(itemCount).padStart(2, '0')}
          </div>
          
          {/* 底部指示器 */}
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            alignItems: 'center'
          }}>
            {images.map((_, i) => (
              <motion.div 
                key={i}
                animate={{ 
                  width: activeIndex === i ? '32px' : '8px',
                  background: activeIndex === i ? '#fff' : 'rgba(255,255,255,0.3)'
                }}
                transition={{ duration: 0.3 }}
                style={{ 
                  height: '8px', 
                  borderRadius: '4px' 
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentFocusLensScreen;
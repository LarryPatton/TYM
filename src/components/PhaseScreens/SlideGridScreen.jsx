import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * SlideGridScreen - 三列网格幻灯片展示（3×3 + 错落视差）
 * 
 * 特点：
 * 1. 3×3 网格布局，共 9 张
 * 2. 16:9 横向幻灯片
 * 3. 奇偶列错落视差（中间列慢，两侧列快）
 * 4. 滚动驱动动画
 * 
 * @param {Array} images - 图片数组 [{src, label}]
 * @param {string} bgColor - 背景颜色
 */
export const SlideGridScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  images = [],
  bgColor = '#000'
}) => {
  const containerRef = useRef(null);
  
  // 滚动进度监听
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 两侧列 (0, 2) - 快速移动
  const yFast = useTransform(scrollYProgress, [0, 1], [80, -80]);
  // 中间列 (1) - 慢速移动
  const ySlow = useTransform(scrollYProgress, [0, 1], [20, -20]);

  if (images.length === 0) return null;

  // 确保最多显示 9 张
  const displayImages = images.slice(0, 9);
  
  // 分配到 3 列（每列 3 张）
  const columns = [[], [], []];
  displayImages.forEach((img, index) => {
    const colIndex = index % 3;
    columns[colIndex].push({ ...img, originalIndex: index });
  });

  return (
    <div 
      ref={containerRef}
      style={{
        height: '280vh',  // 滚动驱动用
        position: 'relative',
        background: bgColor
      }}
    >
      {/* Sticky 容器 */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        {/* 屏幕标识 */}
        {screenNumber && (
          <motion.div style={{
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
            {screenNumber} / {screenLabel}
          </motion.div>
        )}

        {/* 三列网格容器 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          maxWidth: '1400px',
          width: '100%',
          padding: '0 48px',
          alignItems: 'center'
        }}>
          
          {columns.map((colImages, colIndex) => {
            // 两侧列 (0, 2) 快速，中间列 (1) 慢速
            const isCenter = colIndex === 1;
            const yMotion = isCenter ? ySlow : yFast;
            
            return (
              <motion.div
                key={`col-${colIndex}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  y: yMotion,
                  // 中间列添加顶部偏移，形成错落
                  paddingTop: isCenter ? '60px' : '0'
                }}
              >
                {colImages.map((img) => (
                  <SlideItem
                    key={`slide-${img.originalIndex}`}
                    image={img}
                    index={img.originalIndex}
                  />
                ))}
              </motion.div>
            );
          })}
          
        </div>
      </div>
    </div>
  );
};

/**
 * 单张幻灯片卡片
 */
const SlideItem = ({ image, index }) => {
  if (!image) return null;
  
  return (
    <motion.div
      style={{
        aspectRatio: '16 / 9',  // 16:9 比例
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.02)'
      }}
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.3 }
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
        alt={image.label || `Slide ${index + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
        }}
        onError={(e) => {
          console.error('SlideGrid image load error:', image.src);
          e.target.style.display = 'none';
        }}
      />
    </motion.div>
  );
};

export default SlideGridScreen;

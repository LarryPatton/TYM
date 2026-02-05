import React from 'react';
import { motion } from 'framer-motion';

/**
 * 斜切图片展示组件 - 每张图片独立完整显示
 * 
 * @param {Array} images - 图片数组，每项包含 { id, image?, title?, hueStart? }
 * @param {boolean} isDark - 是否暗色模式
 * @param {number} slantOffset - 倾斜偏移量（百分比），默认 8
 * @param {boolean} animated - 是否启用动画，默认 true
 * @param {string} height - 容器高度，默认 '100%'
 * @param {number} animationDelay - 动画开始延迟（秒），默认 0
 * @param {number} hueStart - 占位色的 HSL hue 起始值，默认 200
 */
const SlicedImageDisplay = ({ 
  images = [], 
  isDark = false,
  slantOffset = 8,
  animated = true,
  height = '100%',
  animationDelay = 0,
  hueStart = 200,
}) => {
  const sliceCount = images.length;
  
  // 如果没有图片，显示占位
  if (sliceCount === 0) {
    return (
      <div style={{
        width: '100%',
        height,
        background: isDark ? '#1a1a1a' : '#f0f0f0',
        borderRadius: '8px',
      }} />
    );
  }
  
  // 计算每个切片的宽度（考虑斜切重叠）
  // 为了让所有切片都在 0-100% 范围内，需要调整计算方式
  const effectiveWidth = 100 - slantOffset; // 有效宽度（减去斜切偏移）
  const sliceWidth = effectiveWidth / sliceCount;
  
  // 计算每个切片的位置和裁切路径
  const getSliceStyle = (index) => {
    // 每个切片的基础位置
    const baseLeft = index * sliceWidth;
    
    // 左边界（底部在 baseLeft，顶部向右偏移 slantOffset）
    const leftBottom = baseLeft;
    const leftTop = baseLeft + slantOffset;
    
    // 右边界
    const rightBottom = baseLeft + sliceWidth;
    const rightTop = baseLeft + sliceWidth + slantOffset;
    
    // 实际容器的位置和宽度
    let startX, endX;
    
    if (index === 0) {
      // 第一个切片：从 0 开始
      startX = 0;
      endX = rightTop;
    } else if (index === sliceCount - 1) {
      // 最后一个切片：到 100 结束
      startX = leftBottom;
      endX = 100;
    } else {
      // 中间切片
      startX = leftBottom;
      endX = rightTop;
    }
    
    const width = endX - startX;
    
    // 计算相对于切片容器的 clip-path
    let clipPath;
    if (index === 0) {
      // 第一个切片：左边是直线
      const relRightTop = ((rightTop - startX) / width) * 100;
      const relRightBottom = ((rightBottom - startX) / width) * 100;
      clipPath = `polygon(0% 0%, ${relRightTop}% 0%, ${relRightBottom}% 100%, 0% 100%)`;
    } else if (index === sliceCount - 1) {
      // 最后一个切片：右边是直线
      const relLeftTop = ((leftTop - startX) / width) * 100;
      const relLeftBottom = ((leftBottom - startX) / width) * 100;
      clipPath = `polygon(${relLeftTop}% 0%, 100% 0%, 100% 100%, ${relLeftBottom}% 100%)`;
    } else {
      // 中间切片：两边都是斜线
      const relLeftTop = ((leftTop - startX) / width) * 100;
      const relLeftBottom = ((leftBottom - startX) / width) * 100;
      const relRightTop = ((rightTop - startX) / width) * 100;
      const relRightBottom = ((rightBottom - startX) / width) * 100;
      clipPath = `polygon(${relLeftTop}% 0%, ${relRightTop}% 0%, ${relRightBottom}% 100%, ${relLeftBottom}% 100%)`;
    }
    
    return {
      left: `${startX}%`,
      width: `${width}%`,
      clipPath,
      // 用于分隔线
      lineTopX: rightTop,
      lineBottomX: rightBottom,
    };
  };
  
  // 动画变体
  const sliceAnimation = {
    hidden: { 
      opacity: 0,
      x: 50,
    },
    visible: (index) => ({ 
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.8,
        delay: animationDelay + index * 0.15,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };
  
  // 预计算所有切片样式（用于分隔线）
  const sliceStyles = images.map((_, index) => getSliceStyle(index));
  
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    }}>
      {images.map((item, index) => {
        const sliceStyle = sliceStyles[index];
        const hue = hueStart + index * 12;
        const hasImage = item.image && typeof item.image === 'string';
        
        const content = hasImage ? (
          <img
            src={item.image.startsWith('http') 
              ? item.image 
              : `${import.meta.env.BASE_URL}${item.image.replace(/^\//, '')}`
            }
            alt={item.title || `Image ${index + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: isDark
              ? `linear-gradient(135deg, 
                  hsl(${hue}, 35%, 22%) 0%, 
                  hsl(${hue + 10}, 30%, 15%) 100%)`
              : `linear-gradient(135deg, 
                  hsl(${hue}, 20%, 82%) 0%, 
                  hsl(${hue + 10}, 25%, 72%) 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              color: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
              fontFamily: 'var(--font-mono, monospace)',
            }}>
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        );
        
        return animated ? (
          <motion.div
            key={item.id || index}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={sliceAnimation}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: sliceStyle.left,
              width: sliceStyle.width,
              clipPath: sliceStyle.clipPath,
              zIndex: index + 1,
              overflow: 'hidden',
            }}
          >
            {content}
          </motion.div>
        ) : (
          <div
            key={item.id || index}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: sliceStyle.left,
              width: sliceStyle.width,
              clipPath: sliceStyle.clipPath,
              zIndex: index + 1,
              overflow: 'hidden',
            }}
          >
            {content}
          </div>
        );
      })}
      
      {/* 斜线分隔线 - 深浅模式适配 */}
      {sliceStyles.slice(0, -1).map((style, index) => (
        <svg
          key={`line-${index}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: sliceCount + 10,
          }}
        >
          {/* 主分隔线 - 深色模式用亮色，浅色模式用白色 */}
          <line
            x1={`${style.lineTopX}%`}
            y1="0%"
            x2={`${style.lineBottomX}%`}
            y2="100%"
            stroke={isDark ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.95)"}
            strokeWidth="2"
          />
          {/* 阴影线（增强立体感） - 深色模式用深色阴影，浅色模式用浅色阴影 */}
          <line
            x1={`${style.lineTopX + 0.2}%`}
            y1="0%"
            x2={`${style.lineBottomX + 0.2}%`}
            y2="100%"
            stroke={isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.1)"}
            strokeWidth="1"
          />
        </svg>
      ))}
    </div>
  );
};

export default SlicedImageDisplay;
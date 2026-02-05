
import React from 'react';
import { motion } from 'framer-motion';

/**
 * 斜切图片展示组件
 * 
 * @param {Array} images - 图片数组，每项包含 { id, image?, title?, hueStart? }
 * @param {boolean} isDark - 是否暗色模式
 * @param {number} slantOffset - 倾斜偏移量（百分比），默认 15
 * @param {number} leftShift - 整体左移量（百分比），默认 -8
 * @param {boolean} animated - 是否启用动画，默认 true
 * @param {string} height - 容器高度，默认 '100%'
 * @param {number} animationDelay - 动画开始延迟（秒），默认 0
 * @param {number} hueStart - 占位色的 HSL hue 起始值，默认 200
 */
const SlicedImageDisplay = ({ 
  images = [], 
  isDark = false,
  slantOffset = 15,
  leftShift = -8,
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
  
  // 计算每个切片的 clip-path（斜线从右上向左下）
  const getClipPath = (index) => {
    const totalSlices = sliceCount;
    const sliceWidth = 100 / totalSlices;
    
    // 计算左右边界位置 - 顶部向右偏移，底部不偏移，整体向左移动
    const leftTop = index * sliceWidth + slantOffset + leftShift;
    const leftBottom = index * sliceWidth + leftShift;
    const rightTop = (index + 1) * sliceWidth + slantOffset + leftShift;
    const rightBottom = (index + 1) * sliceWidth + leftShift;
    
    // 第一个和最后一个切片需要特殊处理边界
    if (index === 0) {
      return `polygon(0% 0%, ${rightTop}% 0%, ${rightBottom}% 100%, 0% 100%)`;
    }
    if (index === totalSlices - 1) {
      return `polygon(${leftTop}% 0%, 100% 0%, 100% 100%, ${leftBottom}% 100%)`;
    }
    return `polygon(${leftTop}% 0%, ${rightTop}% 0%, ${rightBottom}% 100%, ${leftBottom}% 100%)`;
  };
  
  // 动画变体：滑入 + 斜切
  const imageSlideIn = {
    hidden: { 
      x: '100%',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    visible: (index) => ({ 
      x: '0%',
      clipPath: [
        'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        getClipPath(index),
      ],
      transition: { 
        x: {
          duration: 1.2,
          delay: animationDelay + index * 0.25,
          ease: [0.16, 1, 0.3, 1]
        },
        clipPath: {
          times: [0, 0.7, 1],
          duration: 1.2 + 0.25 * (sliceCount - 1) + 0.6,
          delay: animationDelay + index * 0.25,
          ease: [0.16, 1, 0.3, 1]
        }
      }
    })
  };
  
  // 静态版本（无动画）
  const staticStyle = (index) => ({
    clipPath: getClipPath(index),
  });
  
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    }}>
      {images.map((item, index) => (
        animated ? (
          <motion.div
            key={item.id || index}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={imageSlideIn}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: index + 1,
            }}
          >
            <ImageContent item={item} index={index} isDark={isDark} totalCount={sliceCount} hueStart={hueStart} />
          </motion.div>
        ) : (
          <div
            key={item.id || index}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: index + 1,
              ...staticStyle(index),
            }}
          >
            <ImageContent item={item} index={index} isDark={isDark} totalCount={sliceCount} hueStart={hueStart} />
          </div>
        )
      ))}
      
      {/* 斜线分隔线 */}
      {images.slice(0, -1).map((_, index) => {
        const sliceWidth = 100 / sliceCount;
        const lineTopX = (index + 1) * sliceWidth + slantOffset + leftShift;
        const lineBottomX = (index + 1) * sliceWidth + leftShift;
        
        return (
          <svg
            key={`line-${index}`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: sliceCount + 1,
            }}
          >
            <line
              x1={`${lineTopX}%`}
              y1="0%"
              x2={`${lineBottomX}%`}
              y2="100%"
              stroke={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}
              strokeWidth="1"
            />
          </svg>
        );
      })}
    </div>
  );
};

// 图片内容子组件
const ImageContent = ({ item, index, isDark, totalCount, hueStart = 200 }) => {
  const hasImage = item.image && typeof item.image === 'string';
  // 使用传入的 hueStart，每张图片 hue 偏移 12
  const hue = hueStart + index * 12;
  
  // 容器样式 - 确保占满整个空间
  const containerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  };
  
  return (
    <>
      {hasImage ? (
        <img
          src={item.image.startsWith('http') 
            ? item.image 
            : `${import.meta.env.BASE_URL}${item.image.replace(/^\//, '')}`
          }
          alt={item.title || `Image ${index + 1}`}
          style={{
            ...containerStyle,
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      ) : (
        <div style={{
          ...containerStyle,
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
      )}
    </>
  );
};

export default SlicedImageDisplay;

import React from 'react';
import { motion } from 'framer-motion';

/**
 * ThreeRowMarquee - 三行交错跑马灯组件
 * 
 * 特性：
 * - 3-4-3 分布 (10张图: 第1行3张, 第2行4张, 第3行3张)
 * - 方向交错: 第1/3行向左 ←, 第2行向右 →
 * - 速度交错: 第1行 60s(慢), 第2行 45s(中), 第3行 30s(快)
 * - 透明底 PNG 支持
 * 
 * @param {Array} images - 图片数组 [{src, label}]
 * @param {string} bgColor - 背景颜色
 */
export const ThreeRowMarquee = ({ 
  images = [], 
  bgColor = '#000',
  isDense = false, // 新增 prop 控制密度
  showGradient = true // 新增 prop 控制渐变遮罩
}) => {
  // 动态计算每行图片数量，确保适应任意数量的图片 (如 10张, 14张等)
  const total = images.length;
  const part1 = Math.floor(total / 3);
  const part2 = Math.floor(total * 2 / 3);

  const row1Images = images.slice(0, part1);
  const row2Images = images.slice(part1, part2);
  const row3Images = images.slice(part2, total);
  
  // 根据 isDense 调整参数
  // Dense 模式下：高度减小，间隙减小
  const defaultHeight1 = 220, defaultHeight2 = 200, defaultHeight3 = 220;
  const denseHeight1 = 160, denseHeight2 = 140, denseHeight3 = 160;
  
  const defaultGap = 40;
  const denseGap = 20;

  const h1 = isDense ? denseHeight1 : defaultHeight1;
  const h2 = isDense ? denseHeight2 : defaultHeight2;
  const h3 = isDense ? denseHeight3 : defaultHeight3;
  const g = isDense ? denseGap : defaultGap;

  // 配置 - 优化后的参数
  const rowConfigs = [
    { images: row1Images, direction: 'left', duration: 50, gap: g, height: h1 },   // 慢
    { images: row2Images, direction: 'right', duration: 38, gap: Math.round(g * 0.8), height: h2 },  // 中
    { images: row3Images, direction: 'left', duration: 28, gap: g, height: h3 }    // 快
  ];

  return (
    <div style={{
      width: '100%',
      // minHeight: '80vh', // 移除高度限制，由外层容器控制
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: isDense ? '1.5vh' : '20px', // Dense 模式下缩小行间距
      padding: isDense ? '0' : '40px 0',
      overflow: 'hidden',
      paddingBottom: isDense ? '5vh' : undefined
    }}>
      {rowConfigs.map((config, rowIndex) => (
        <MarqueeRow
          key={rowIndex}
          images={config.images}
          direction={config.direction}
          duration={config.duration}
          gap={config.gap}
          height={config.height}
          bgColor={bgColor}
          showGradient={showGradient} // Pass it down
        />
      ))}
    </div>
  );
};

/**
 * MarqueeRow - 单行跑马灯
 */
const MarqueeRow = ({ 
  images, 
  direction = 'left', 
  duration = 40,
  gap = 40,
  height = 200,
  bgColor = '#0a0a0a',
  showGradient = true
}) => {
  // 复制图片以实现无缝循环 (4份确保足够宽)
  const duplicatedImages = [...images, ...images, ...images, ...images];
  
  // 计算单组图片的总宽度（用于动画）
  const itemWidth = height * 1.8; // 根据高度估算宽度（大部分图是横向的）
  const totalWidth = images.length * (itemWidth + gap);
  
  // 动画方向
  const isLeftDirection = direction === 'left';
  
  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* 左侧渐隐遮罩 */}
      {showGradient && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '120px',
          background: `linear-gradient(to right, ${bgColor}, transparent)`,
          zIndex: 10,
          pointerEvents: 'none'
        }} />
      )}
      
      {/* 右侧渐隐遮罩 */}
      {showGradient && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '120px',
          background: `linear-gradient(to left, ${bgColor}, transparent)`,
          zIndex: 10,
          pointerEvents: 'none'
        }} />
      )}
      
      {/* 跑马灯轨道 */}
      <motion.div
        animate={{
          x: isLeftDirection 
            ? [0, -totalWidth] 
            : [-totalWidth, 0]
        }}
        transition={{
          x: {
            duration: duration,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop'
          }
        }}
        style={{
          display: 'flex',
          gap: `${gap}px`,
          width: 'max-content',
          alignItems: 'center'
        }}
      >
        {duplicatedImages.map((image, index) => (
          <MarqueeItem
            key={`${image.src}-${index}`}
            image={image}
            height={height}
          />
        ))}
      </motion.div>
    </div>
  );
};

/**
 * MarqueeItem - 跑马灯单项
 */
const MarqueeItem = ({ image, height = 200 }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        flexShrink: 0,
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
        alt={image.label || 'Marquee item'}
        style={{
          height: '100%',
          width: 'auto',
          objectFit: 'contain',
          background: 'transparent',
          borderRadius: '8px',
          transition: 'filter 0.3s ease'
        }}
        loading="lazy"
      />
    </motion.div>
  );
};

export default ThreeRowMarquee;
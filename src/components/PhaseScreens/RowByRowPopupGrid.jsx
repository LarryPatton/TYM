import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * RowByRowPopupGrid - 5列4行逐行弹出网格
 * 
 * 动画逻辑：
 * 1. 第1行：滚动进度 0-25% 时弹出
 * 2. 第2行：滚动进度 25-50% 时弹出
 * 3. 第3行：滚动进度 50-75% 时弹出
 * 4. 第4行：滚动进度 75-100% 时弹出
 * 
 * 弹出效果：scale + opacity + translateY
 */
export const RowByRowPopupGrid = ({
  screenNumber,
  screenLabel,
  images = [],
  columns = 5,
  bgColor = '#000',
  enableFadeIn = false // 新增：是否启用淡入效果（用于第二屏）
}) => {
  const containerRef = useRef(null);
  
  // 滚动进度监听
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  if (images.length === 0) return null;

  // 计算行数
  const rows = Math.ceil(images.length / columns);
  
  // 将图片按行分组
  const imageRows = [];
  for (let i = 0; i < rows; i++) {
    imageRows.push(images.slice(i * columns, (i + 1) * columns));
  }

  // 根据实际行数动态调整滚动高度和动画时间线
  const scrollHeightMultiplier = rows === 2 ? 2.5 : 4; // 2行用2.5倍高度，4行用4倍高度
  const containerHeight = `${scrollHeightMultiplier * 100}vh`;

  // 淡入效果：整个容器在进入视口时淡入
  const containerOpacity = enableFadeIn 
    ? useTransform(scrollYProgress, [0, 0.1], [0, 1])
    : 1;

  return (
    <motion.div 
      ref={containerRef}
      style={{
        height: containerHeight,
        position: 'relative',
        background: bgColor,
        opacity: containerOpacity
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
        overflow: 'visible',
        padding: '0 48px'
      }}>
        
        {/* 屏幕标识 */}
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
          {screenNumber && screenLabel ? `${screenNumber} / ${screenLabel}` : (screenNumber || screenLabel)}
        </motion.div>

        {/* 动态行数网格容器 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`, // 根据实际行数动态设置
          gap: '24px',
          maxWidth: '1400px',
          width: '100%'
        }}>
          
          {imageRows.map((rowImages, rowIndex) => {
            // 根据实际行数动态分配滚动区间
            // 2行: 每行50%进度 (0-0.5, 0.5-1.0)
            // 4行: 每行25%进度 (0-0.25, 0.25-0.5, 0.5-0.75, 0.75-1.0)
            const progressPerRow = 1 / rows;
            const startProgress = rowIndex * progressPerRow;
            const endProgress = (rowIndex + 1) * progressPerRow;
            
            return rowImages.map((image, colIndex) => (
              <RowItem 
                key={`row${rowIndex}-col${colIndex}`}
                image={image}
                rowIndex={rowIndex}
                colIndex={colIndex}
                scrollYProgress={scrollYProgress}
                startProgress={startProgress}
                endProgress={endProgress}
              />
            ));
          })}

        </div>

      </div>
    </motion.div>
  );
};

/**
 * RowItem - 单个网格项
 */
const RowItem = ({ 
  image, 
  rowIndex, 
  colIndex, 
  scrollYProgress, 
  startProgress, 
  endProgress 
}) => {
  // 每个单元格在本行的弹出区间内依次弹出
  // 列延迟：每列延迟 0.05 的滚动进度
  const itemStartProgress = startProgress + (colIndex * 0.04);
  const itemEndProgress = Math.min(itemStartProgress + 0.1, endProgress);
  
  // 缩放：从 0.5 到 1
  const scale = useTransform(
    scrollYProgress, 
    [itemStartProgress, itemEndProgress], 
    [0.5, 1]
  );
  
  // 透明度：从 0 到 1
  const opacity = useTransform(
    scrollYProgress, 
    [itemStartProgress, itemEndProgress], 
    [0, 1]
  );
  
  // Y轴位移：从下方100px弹出
  const y = useTransform(
    scrollYProgress, 
    [itemStartProgress, itemEndProgress], 
    [100, 0]
  );

  return (
    <motion.div
      style={{
        aspectRatio: '1 / 1',
        background: 'transparent',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        scale,
        opacity,
        y
      }}
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
        alt={image.label}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          background: 'transparent',
          filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.4))'
        }}
      />
      {/* Label */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        background: 'rgba(0,0,0,0.6)',
        padding: '2px 8px',
        borderRadius: '10px',
        opacity: 0,
        pointerEvents: 'none'
      }}>
        {image.label}
      </div>
    </motion.div>
  );
};

export default RowByRowPopupGrid;

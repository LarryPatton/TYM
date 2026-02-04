import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * ProductPairScrollScreen - 滚动卷轴配对展示组件
 * 
 * 特点：
 * 1. 两行布局：10对图片分为上下两行（每行5对）
 * 2. 配对叠加：主体图（大）在前，变体图（小）在后，错位叠加
 * 3. 横向卷轴：纵向滚动驱动横向位移
 * 4. 聚焦高亮：中心对放大高亮，边缘虚化
 * 5. 智能缩放：主体图 120%，变体图 100%
 * 6. 透明背景，无边框
 * 
 * @param {Array} pairs - 配对数组 [{main: {src, label}, variant: {src, label}}]
 * @param {string} bgColor - 背景颜色
 */
export const ProductPairScrollScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  pairs = [],
  bgColor = '#000',
  showLabel = true // 是否显示图片下方标签，默认显示
}) => {
  const containerRef = useRef(null);
  
  // 滚动进度监听
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  if (pairs.length === 0) return null;

  // 将10对图片分为两行
  const row1Pairs = pairs.slice(0, 5);  // 前5对
  const row2Pairs = pairs.slice(5, 10); // 后5对

  return (
    <div 
      ref={containerRef}
      style={{
        height: '300vh', // 足够的滚动空间
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
            {screenNumber && screenLabel ? `${screenNumber} / ${screenLabel}` : (screenNumber || screenLabel)}
          </motion.div>
        )}

        {/* 标题 */}
        {title && (
          <motion.h2 style={{
            position: 'absolute',
            top: '100px',
            fontSize: '2rem',
            fontWeight: 300,
            color: '#fff',
            letterSpacing: '4px',
            textTransform: 'uppercase'
          }}>
            {title}
          </motion.h2>
        )}

        {/* 配对展示区域 */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '60px'
        }}>
          {/* 第一行 */}
          <PairRow 
            pairs={row1Pairs} 
            scrollYProgress={scrollYProgress}
            rowIndex={0}
            showLabel={showLabel}
          />
          
          {/* 第二行 */}
          <PairRow 
            pairs={row2Pairs} 
            scrollYProgress={scrollYProgress}
            rowIndex={1}
            showLabel={showLabel}
          />
        </div>

        {/* 滚动提示 */}
        <motion.div 
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '2px',
            opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0])
          }}
        >
          SCROLL TO EXPLORE →
        </motion.div>
      </div>
    </div>
  );
};

/**
 * PairRow - 单行配对展示
 */
const PairRow = ({ pairs, scrollYProgress, rowIndex, showLabel = true }) => {
  // 横向位移：滚动驱动从右向左移动
  // 第一行和第二行反向移动，增加视差感
  const direction = rowIndex === 0 ? 1 : -1;
  const xOffset = useTransform(
    scrollYProgress,
    [0, 1],
    [direction * 30, direction * -30] // 从右30%到左-30%
  );

  return (
    <motion.div
      style={{
        display: 'flex',
        gap: '100px',
        alignItems: 'center',
        justifyContent: 'center',
        x: xOffset
      }}
    >
      {pairs.map((pair, index) => (
        <PairCard
          key={`pair-${rowIndex}-${index}`}
          pair={pair}
          index={index}
          scrollYProgress={scrollYProgress}
          showLabel={showLabel}
        />
      ))}
    </motion.div>
  );
};

/**
 * PairCard - 单对卡片（主体图+变体图叠加）
 */
const PairCard = ({ pair, index, scrollYProgress, showLabel = true }) => {
  const { main, variant } = pair;

  // 检测文件名是否包含 -1
  const mainScale = main.src.includes('-1') ? 1 : 1.2;
  const variantScale = variant.src.includes('-1') ? 1 : 1.2;

  return (
    <motion.div
      style={{
        position: 'relative',
        width: '240px',
        height: '320px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      {/* 变体图（背景层，错位） */}
      <motion.div
        style={{
          position: 'absolute',
          top: '0',
          right: '-70px',
          opacity: 1,
          zIndex: 1
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={`${import.meta.env.BASE_URL}${variant.src.replace(/^\//, '')}`}
          alt={variant.label || 'Variant'}
          style={{
            maxWidth: `${200 * variantScale}px`,
            maxHeight: `${280 * variantScale}px`,
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))'
          }}
          onError={(e) => {
            console.error('ProductPair image load error:', variant.src);
            e.target.style.display = 'none';
          }}
        />
      </motion.div>

      {/* 主体图（前景层） */}
      <motion.div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          zIndex: 2
        }}
        whileHover={{ scale: 1.05, zIndex: 10 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={`${import.meta.env.BASE_URL}${main.src.replace(/^\//, '')}`}
          alt={main.label || 'Main'}
          style={{
            maxWidth: `${200 * mainScale}px`,
            maxHeight: `${280 * mainScale}px`,
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.6))'
          }}
          onError={(e) => {
            console.error('ProductPair image load error:', main.src);
            e.target.style.display = 'none';
          }}
        />
      </motion.div>

      {/* 标签 - 仅在 showLabel 为 true 时显示 */}
      {showLabel && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
            zIndex: 3
          }}
        >
          {main.label}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductPairScrollScreen;

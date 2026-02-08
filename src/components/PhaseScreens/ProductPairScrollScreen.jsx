import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLenisScrollProgress } from '../../hooks/useLenisScroll';

// ========== 工具函数：线性插值（替代 framer-motion useTransform） ==========
function interpolate(value, inputRange, outputRange) {
  if (inputRange.length !== outputRange.length || inputRange.length < 2) {
    return outputRange[0];
  }
  if (value <= inputRange[0]) return outputRange[0];
  if (value >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1];
  for (let i = 0; i < inputRange.length - 1; i++) {
    if (value >= inputRange[i] && value <= inputRange[i + 1]) {
      const t = (value - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
      const out0 = outputRange[i];
      const out1 = outputRange[i + 1];
      if (typeof out0 === 'number' && typeof out1 === 'number') {
        return out0 + (out1 - out0) * t;
      }
      return t < 0.5 ? out0 : out1;
    }
  }
  return outputRange[outputRange.length - 1];
}

/**
 * ProductPairScrollScreen - 滚动卷轴配对展示组件（Lenis 驱动版）
 * 
 * 特点：
 * 1. 两行布局：10对图片分为上下两行（每行5对）
 * 2. 配对叠加：主体图（大）在前，变体图（小）在后，错位叠加
 * 3. Lenis 平滑滚动驱动横向位移
 * 4. 智能缩放：主体图 120%，变体图 100%
 * 5. 透明背景，无边框
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
  showLabel = true
}) => {
  const containerRef = useRef(null);
  const { t } = useTranslation();
  
  // Lenis 驱动的滚动进度（0~1 数值）
  const { progress } = useLenisScrollProgress(containerRef, ["start start", "end end"]);

  if (pairs.length === 0) return null;

  // 将10对图片分为两行
  const row1Pairs = pairs.slice(0, 5);  // 前5对
  const row2Pairs = pairs.slice(5, 10); // 后5对

  // 滚动提示透明度
  const scrollHintOpacity = interpolate(progress, [0, 0.1], [1, 0]);

  return (
    <div 
      ref={containerRef}
      style={{
        height: '300vh',
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
            progress={progress}
            rowIndex={0}
            showLabel={showLabel}
          />
          
          {/* 第二行 */}
          <PairRow 
            pairs={row2Pairs} 
            progress={progress}
            rowIndex={1}
            showLabel={showLabel}
          />
        </div>

        {/* 滚动提示 */}
        <div 
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            opacity: scrollHintOpacity,
            transition: 'opacity 0.05s',
            willChange: 'opacity'
          }}
        >
          {t('common.scrollToExplore')} →
        </div>
      </div>
    </div>
  );
};

/**
 * PairRow - 单行配对展示（Lenis 驱动）
 */
const PairRow = ({ pairs, progress, rowIndex, showLabel = true }) => {
  // 横向位移：滚动驱动从右向左移动
  // 第一行和第二行反向移动，增加视差感
  const direction = rowIndex === 0 ? 1 : -1;
  const xOffset = interpolate(progress, [0, 1], [direction * 30, direction * -30]);

  return (
    <div
      style={{
        display: 'flex',
        gap: '100px',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateX(${xOffset}%)`,
        willChange: 'transform'
      }}
    >
      {pairs.map((pair, index) => (
        <PairCard
          key={`pair-${rowIndex}-${index}`}
          pair={pair}
          index={index}
          showLabel={showLabel}
        />
      ))}
    </div>
  );
};

/**
 * PairCard - 单对卡片（主体图+变体图叠加，无入场动画）
 */
const PairCard = ({ pair, index, showLabel = true }) => {
  const { main, variant } = pair;

  // 检测文件名是否包含 -1
  const mainScale = main.src.includes('-1') ? 1 : 1.2;
  const variantScale = variant.src.includes('-1') ? 1 : 1.2;

  return (
    <div
      style={{
        position: 'relative',
        width: '240px',
        height: '320px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* 变体图（背景层，错位） */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          right: '-70px',
          opacity: 1,
          zIndex: 1
        }}
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
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* 主体图（前景层） */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          zIndex: 2
        }}
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
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* 标签 */}
      {showLabel && (
        <div
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
        </div>
      )}
    </div>
  );
};

export default ProductPairScrollScreen;
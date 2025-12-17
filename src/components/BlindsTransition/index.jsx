import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Junni 风格百叶窗过渡组件
 * 浅色条带收缩，揭示底层的深色背景和内容
 */
const BlindsTransition = ({ 
  fromColor = '#f5f5f5', 
  toColor = '#0a0a0a',
  blindsCount = 6,
  height = '100vh',
  children,
}) => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 生成每个百叶窗条带
  const blinds = Array.from({ length: blindsCount }, (_, i) => i);

  return (
    <div 
      ref={containerRef}
      style={{
        height,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 底层：深色背景 + 内容 (WORKS) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: toColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
      }}>
        {children}
      </div>

      {/* 顶层：浅色百叶窗条带 - 初始覆盖全屏，滚动时收缩 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none', // 允许点击穿透到底层（如果需要）
      }}>
        {blinds.map((index) => (
          <BlindSlat
            key={index}
            index={index}
            totalBlinds={blindsCount}
            scrollYProgress={scrollYProgress}
            color={fromColor}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * 单个百叶窗条带
 * 初始完全展开，随滚动收缩
 */
const BlindSlat = ({ 
  index, 
  totalBlinds, 
  scrollYProgress, 
  color,
}) => {
  // 条带高度百分比
  const slatHeight = 100 / totalBlinds;
  
  // 计算条带位置 - 从顶部开始排布
  const topPosition = index * slatHeight;
  
  // 动画时机
  const animStart = 0.1; // 稍微晚一点开始，让用户先看到一点过渡
  const animEnd = 0.6;   // 在滚动到 60% 时完成过渡
  const totalAnimRange = animEnd - animStart;
  
  // 错落感：每个条带稍微错开一点时间
  // 我们可以让它们随机一点，或者有序。这里保持有序。
  // 从上到下依次收缩，或者从下到上？
  // 让我们尝试从上到下依次收缩 (index 0 先动)
  const slatAnimDuration = totalAnimRange / totalBlinds * 1.5; // 1.5倍重叠
  const slatAnimGap = totalAnimRange / totalBlinds;
  
  const startProgress = animStart + (index * slatAnimGap);
  const endProgress = Math.min(startProgress + slatAnimDuration, 1);
  
  // 条带的 scaleY 动画 - 从 1 收缩到 0
  const scaleY = useTransform(
    scrollYProgress,
    [startProgress, endProgress],
    [1, 0]
  );

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${topPosition}%`,
        height: `${slatHeight + 0.5}%`, // +0.5% 防止缝隙
        background: color,
        transformOrigin: 'top center', // 向上收缩
        scaleY,
      }}
    />
  );
};

export default BlindsTransition;
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * StickySection - 通用 Sticky 停顿包装组件
 * 
 * 特性：
 * - 包裹任意内容，添加 sticky 停顿效果
 * - 滚动到该屏时内容固定，继续滚动才离开
 * - 可配置停顿时长（通过 scrollHeight 控制）
 * 
 * @param {React.ReactNode} children - 子内容
 * @param {number} scrollMultiplier - 滚动高度倍数 (1 = 100vh, 1.5 = 150vh)
 * @param {string} bgColor - 背景颜色
 */
export const StickySection = ({
  children,
  scrollMultiplier = 1.5, // 默认 1.5 倍，即停顿 0.5 个屏幕高度
  bgColor = 'transparent'
}) => {
  const containerRef = useRef(null);
  
  // 滚动进度监听
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // 内容淡入淡出效果（可选）
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0.5, 1, 1, 0.5]
  );

  return (
    <div 
      ref={containerRef}
      style={{
        height: `${100 * scrollMultiplier}vh`,
        position: 'relative',
        background: bgColor
      }}
    >
      {/* Sticky 容器 - 锁定在视口 */}
      <motion.div 
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          opacity: contentOpacity
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default StickySection;

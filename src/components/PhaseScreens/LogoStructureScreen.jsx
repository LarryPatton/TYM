import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MAX_WIDTH_WIDE } from './Common';

// ============================================
// 屏幕: Logo 结构展示 (LogoStructureScreen)
// 使用 Zoom Reveal 效果展示 Logo 结构图
// ============================================
export const LogoStructureScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  imageSrc
}) => {
  const ref = useRef(null);
  
  // ============================================
  // 【滚动监听配置】
  // ============================================
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]    // 滚动范围: 元素顶部对齐视口顶部 → 元素底部对齐视口底部
  });

  // ============================================
  // 【动画时间线设计】(总滚动高度 250vh)
  // ============================================
  // 0.0 - 0.5: 图片 Zoom Reveal (缩放+模糊清晰)
  // 0.5 - 0.8: 文字淡入上浮
  // ============================================

  // ============================================
  // 【动效参数 - Zoom Reveal 图片揭示效果】
  // ============================================
  
  /**
   * 图片缩放动画
   * - 滚动进度 0% → 50%: 从 0.5 倍放大到 1 倍
   * - 效果: 图片逐渐放大，创造"zoom in"揭示感
   * 
   * 可调参数:
   * - [0, 0.5]: 缩放动画的滚动区间
   * - [0.5, 1]: 缩放范围 (0.5=50%大小, 1=原始大小)
   */
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);
  
  /**
   * 卡片透明度
   * - 滚动进度 0% → 30%: 从完全透明到完全可见
   * - 效果: 卡片淡入，配合缩放
   * 
   * 可调参数:
   * - [0, 0.3]: 淡入的滚动区间
   * - [0, 1]: 透明度范围
   */
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  
  /**
   * 图片模糊值 (像素)
   * - 滚动进度 0% → 40%: 从 20px 模糊到 0px 清晰
   * - 效果: 模糊到清晰的聚焦效果
   * 
   * 可调参数:
   * - [0, 0.4]: 模糊清晰化的滚动区间
   * - [20, 0]: 模糊像素值范围 (20px模糊 → 0px清晰)
   */
  const blurValue = useTransform(scrollYProgress, [0, 0.4], [20, 0]);
  
  // ============================================
  // 【动效参数 - 文字入场动画】
  // ============================================
  
  /**
   * 文字透明度
   * - 滚动进度 50% → 80%: 淡入
   * - 效果: 图片揭示完成后，文字出现
   * 
   * 可调参数:
   * - [0.5, 0.8]: 淡入的滚动区间
   * - [0, 1]: 透明度范围
   */
  const opacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
  
  /**
   * 文字 Y 轴位移
   * - 滚动进度 50% → 80%: 从下方 50px 上浮到原位
   * - 效果: 上浮入场动画
   * 
   * 可调参数:
   * - [0.5, 0.8]: 动画触发区间
   * - [50, 0]: Y轴位移范围 (50px向下 → 0原位)
   */
  const y = useTransform(scrollYProgress, [0.5, 0.8], [50, 0]);

  // 强制使用 image 3.png 如果没有传入
  const finalImageSrc = imageSrc || `${import.meta.env.BASE_URL}images/phase-01/logo-structure.png`;

  return (
    <div ref={ref} style={{ height: '250vh', position: 'relative', background: '#0a0a0a' }}>
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        height: '100vh', 
        overflow: 'hidden', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        
        {/* 背景图片层 */}
        <motion.div 
          style={{ 
            width: '100%', 
            height: '100%', 
            scale,
            opacity: cardOpacity, // 应用透明度
            filter: useTransform(blurValue, v => `blur(${Math.max(0, v)}px)`), // 应用模糊，确保不为负
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
          }}
        >
          <div style={{ 
            width: '80%', 
            height: '80%', 
            background: 'var(--color-bg-alt)', 
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 0 100px rgba(0,0,0,0.8)', // 增强阴影，使其更深邃
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={finalImageSrc} 
              alt="Logo Structure" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '40px' }}
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        </motion.div>
        
        {/* 前景文字层 */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            bottom: '10%',
            left: '0',
            right: '0',
            textAlign: 'center',
            opacity,
            y,
            zIndex: 10,
            pointerEvents: 'none' // 防止遮挡图片交互
          }}
        >
          <div style={{
            padding: '30px',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            display: 'inline-block',
            maxWidth: '600px'
          }}>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '12px'
            }}>
              {screenNumber} / {screenLabel}
            </div>
            <h2 style={{ 
              fontSize: '2rem', 
              margin: '0 0 12px 0', 
              color: '#fff',
              fontFamily: 'var(--font-serif)'
            }}>
              {title}
            </h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
              {content}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
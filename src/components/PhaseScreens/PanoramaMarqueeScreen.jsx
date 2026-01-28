import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { SECTION_PADDING, MAX_WIDTH_WIDE, itemVariants } from './Common';
import { ThreeRowMarquee } from './ThreeRowMarquee';

/**
 * ============================================
 * 屏幕: 跑马灯展示 (PanoramaMarqueeScreen) (优化版：紧凑密集一屏)
 * ============================================
 * 优化目标：
 * 1. 跑马灯更密 (Denser Layout)
 * 2. 只有跑马灯，且在一屏内展示完 (Fits 3 rows tightly in 100vh)
 * 
 * 修改：
 * - 移除 Scene Images 和 Carousel Images (它们可能被移到其他屏或移除)
 * - 强制高度 100vh
 * - 传递 dense 参数给 ThreeRowMarquee 以缩小间距
 * ============================================
 */
export const PanoramaMarqueeScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  marqueeImages = [], 
  bgAlt = false
}) => {
  const containerRef = useRef(null);
  const bgColor = '#000'; // 统一纯黑背景
  
  return (
    <section 
      ref={containerRef}
      style={{ 
        height: '100vh', // 强制一屏
        width: '100%',
        position: 'relative',
        background: bgColor,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', // 垂直居中
        overflow: 'hidden',
        padding: '0'
      }}
    >
        {/* 顶部文案 - 紧凑排版 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3vh', // 使用 vh 单位适应屏幕
          padding: '0 20px',
          zIndex: 10,
          flexShrink: 0
        }}>
          <div style={{
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '1vh'
          }}>
            {screenNumber} / {screenLabel}
          </div>
          
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', // 稍微调小字体
            fontWeight: '400',
            marginBottom: '1vh',
            lineHeight: 1.1
          }}>
            {title}
          </h2>
          
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.9rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {content}
          </p>
        </div>

        {/* 跑马灯区域 - 核心展示 */}
        {marqueeImages.length > 0 && (
          <div style={{
            width: '100%',
            flex: 1, // 占据剩余空间
            display: 'flex',
            alignItems: 'center',
            minHeight: 0 // 防止 flex 子项溢出
          }}>
            {/* 传递 isDense=true，需要在 ThreeRowMarquee 内部实现紧凑逻辑 */}
            <ThreeRowMarquee 
              images={marqueeImages} 
              bgColor="transparent" 
              isDense={true} 
            />
          </div>
        )}
      </section>
    );
  };

  export default PanoramaMarqueeScreen;
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 动画映射
  // 0.0 - 0.5: 图片从 0.5 倍放大到 1 倍 (或更大)
  // 0.5 - 0.8: 文字淡入
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]); // 卡片淡入
  // 使用数值进行 blur 变换，确保不会有负值
  const blurValue = useTransform(scrollYProgress, [0, 0.4], [20, 0]);
  
  const opacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
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
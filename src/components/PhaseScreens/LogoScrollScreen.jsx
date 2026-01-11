import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MAX_WIDTH_WIDE } from './Common';

// ============================================
// 屏幕: Logo 横向滚动展示 (LogoScrollScreen)
// 专门用于 Phase 01 的 Logo 展示
// ============================================
export const LogoScrollScreen = ({
  screenNumber,
  screenLabel,
  title,
  content
}) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // 调整滚动距离：为了让第二张图能完整进入视口并居中
  // 初始状态：第一张图居中 (paddingLeft 20vw)
  // 结束状态：第二张图居中 (需要向左移动 60vw + gap)
  // 估算位移 -55%
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-155%"]);

  // Logo 图片列表 (更新为 image 2 和 image 18)
  const logoImages = [
    '03/image 2.png',
    '03/image 18.png'
  ];

  return (
    <section ref={targetRef} style={{
      height: '400vh', // 再次增加高度，让滚动更从容
      position: 'relative'
    }}>
      {/* 顶部渐变过渡层 - 从上一个section的bg-alt过渡到当前bg */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '120px',
        background: 'linear-gradient(to bottom, #111111 0%, #0a0a0a 100%)',
        zIndex: 5,
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#0a0a0a'
      }}>
        {/* 标题区域 */}
        <div style={{
          padding: '0 var(--space-2xl)',
          marginBottom: 'var(--space-xl)',
          maxWidth: MAX_WIDTH_WIDE,
          margin: '0 auto',
          width: '100%',
          zIndex: 10
        }}>
           <div style={{
            fontSize: 'var(--text-xs)',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: 'var(--space-lg)'
          }}>
            {screenNumber} / {screenLabel}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-h2)',
            fontWeight: '400',
            lineHeight: 'var(--line-height-snug)',
            color: '#fff'
          }}>
            {title}
          </h2>
        </div>

        {/* 横向滚动区域 */}
        <motion.div style={{ x, display: 'flex', gap: 'var(--space-4xl)', paddingLeft: '20vw' }}>
          {logoImages.map((imgSrc, index) => (
            <div key={index} style={{
              minWidth: '60vw', 
              height: '60vh',
              background: 'var(--color-bg-alt)', 
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-lg)'
            }}>
               {/* Add a white container for logos if they are black transparent PNGs */}
               <div style={{
                 width: '100%',
                 height: '100%',
                 padding: '60px',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 background: 'var(--color-card-bg, rgba(255,255,255,0.05))'
               }}>
                 <img 
                    src={`${import.meta.env.BASE_URL}images/Phase 01 — Brand Identity 0–1/${imgSrc}`}
                    alt={`Logo Variation ${index + 1}`}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain',
                      filter: 'var(--image-filter, none)'
                    }}
                    onError={(e) => e.target.style.display = 'none'}
                 />
               </div>
               <div style={{
                 position: 'absolute',
                 bottom: '30px',
                 left: '30px',
                 fontSize: 'var(--text-sm)',
                 color: 'var(--color-text-muted)'
               }}>
                 Variation {String(index + 1).padStart(2, '0')}
               </div>
            </div>
          ))}
        </motion.div>
        
        {/* 左右渐变遮罩 - 增强视觉引导 */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '80px',
          background: 'linear-gradient(to right, #0a0a0a 0%, transparent 100%)',
          zIndex: 8,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '120px',
          background: 'linear-gradient(to left, #0a0a0a 0%, transparent 100%)',
          zIndex: 8,
          pointerEvents: 'none'
        }} />
      </div>
      
      {/* 底部渐变过渡层 - 从当前bg过渡到下一个section的bg-alt */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '120px',
        background: 'linear-gradient(to top, #111111 0%, #0a0a0a 100%)',
        zIndex: 5,
        pointerEvents: 'none'
      }} />
    </section>
  );
};
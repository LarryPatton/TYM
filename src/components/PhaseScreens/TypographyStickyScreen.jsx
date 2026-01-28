import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { SECTION_PADDING, MAX_WIDTH_WIDE, itemVariants } from './Common';

// ============================================
// 屏幕: 字体版式 Sticky 展示 (TypographyStickyScreen)
// 布局: 左侧固定文案 (28%)，右侧滚动展示图片 (72%)
// 效果: 滚动时左侧文案保持固定，右侧字体样本图依次进入视口
// ============================================
export const TypographyStickyScreen = ({
  screenNumber,
  screenLabel,
  title,
  content
}) => {
  const containerRef = useRef(null);
  
  // ============================================
  // 【图片资源配置】
  // ============================================
  
  /**
   * 字体样本图片列表
   * - 每张图片占据一个视口高度的滚动区域
   * - type: 'wide' 表示 16:9 宽幅展示
   * 
   * 可调参数:
   * - src: 图片路径
   * - label: 底部标签文字
   */
  const images = [
    { 
      src: `${import.meta.env.BASE_URL}images/phase-01/type-specimen-01.png`,
      type: 'wide', // 16:9
      label: 'Type Specimen A'
    },
    { 
      src: `${import.meta.env.BASE_URL}images/phase-01/type-specimen-02.png`,
      type: 'wide', // 16:9
      label: 'Type Specimen B'
    }
  ];

  return (
    <section 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        background: '#0a0a0a', 
        color: '#fff',
        minHeight: `${images.length * 100}vh` // 根据图片数量动态计算高度
      }}
    >
      <div style={{ 
        display: 'flex', 
        maxWidth: MAX_WIDTH_WIDE, 
        margin: '0 auto',
        padding: '0 50px',
        position: 'relative'
      }}>
        
        {/* 左侧 Sticky 区域 (28%) */}
        <div style={{ 
          width: '28%', 
          height: '100vh', 
          position: 'sticky', 
          top: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          paddingRight: '40px'
        }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
          >
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
              fontSize: '3rem',
              fontWeight: '400',
              marginBottom: 'var(--space-lg)',
              lineHeight: 1.2,
              color: '#fff'
            }}>
              {title}
            </h2>
            {content && (
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '1.1rem',
                lineHeight: 1.6
              }}>
                {content}
              </p>
            )}
          </motion.div>
        </div>

        {/* 右侧滚动区域 (72%) */}
        <div style={{ width: '72%', paddingBottom: '10vh' }}>
          {images.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '40px 0'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ margin: "-20%" }}
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  background: '#1a1a1a',
                  position: 'relative'
                }}
              >
                <img 
                  src={item.src} 
                  alt={item.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => e.target.style.display = 'none'}
                />
                {/* 标签 */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '20px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}>
                  {item.label}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

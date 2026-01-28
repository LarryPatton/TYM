import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { SECTION_PADDING, MAX_WIDTH_WIDE, itemVariants } from './Common';

/**
 * ============================================
 * 屏幕: A4 文档卡片展示 (DocumentGalleryScreen)
 * ============================================
 * 设计稿要求:
 * - 认知角色: 展示设计规范文档
 * - 滚动长度: 中等
 * - 交互强度: 低-中
 * - 布局: 4张 A4 竖向文档卡片横向排列
 * - 交互: 卡片倾斜堆叠效果，悬停放大预览
 * ============================================
 */
export const DocumentGalleryScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  emphasis,
  images = [], // A4 文档图片 (2164×3063)
  bgAlt = false
}) => {
  const containerRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // 滚动进度追踪
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 卡片整体显现
  const cardsOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const cardsY = useTransform(scrollYProgress, [0.1, 0.25], [80, 0]);

  // 强调文字
  const emphasisOpacity = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);
  const emphasisY = useTransform(scrollYProgress, [0.6, 0.75], [30, 0]);

  // 每张卡片的微倾斜角度和偏移
  const getCardStyle = (index, total) => {
    const baseRotation = (index - (total - 1) / 2) * 3; // -4.5, -1.5, 1.5, 4.5 度
    const baseTranslateY = Math.abs(index - (total - 1) / 2) * 10; // 中间低，两侧高
    
    return {
      rotation: baseRotation,
      translateY: baseTranslateY
    };
  };

  return (
    <section 
      ref={containerRef}
      style={{ 
        minHeight: '160vh',
        position: 'relative',
        background: bgAlt ? '#111' : 'var(--phase-bg-color, #0a0a0a)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: SECTION_PADDING
      }}
    >
      <div style={{
        maxWidth: MAX_WIDTH_WIDE,
        margin: '0 auto',
        width: '100%'
      }}>
        {/* 顶部文案区域 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
          style={{
            marginBottom: 'var(--space-4xl)',
            textAlign: 'center'
          }}
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
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '400',
            marginBottom: 'var(--space-xl)',
            lineHeight: 1.2,
            maxWidth: '900px',
            margin: '0 auto var(--space-xl)'
          }}>
            {title}
          </h2>
          
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 'var(--text-body-lg)',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {content}
          </p>
        </motion.div>

        {/* A4 文档卡片区域 */}
        <motion.div
          style={{
            opacity: cardsOpacity,
            y: cardsY,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: 'var(--space-xl)',
            marginBottom: 'var(--space-4xl)',
            perspective: '1500px',
            minHeight: '500px'
          }}
        >
          {images.map((image, index) => {
            const { rotation, translateY } = getCardStyle(index, images.length);
            const isHovered = hoveredIndex === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60, rotateY: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.7, delay: index * 0.12 }}
                viewport={{ once: true }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                animate={{
                  rotateZ: isHovered ? 0 : rotation,
                  translateY: isHovered ? -30 : translateY,
                  scale: isHovered ? 1.08 : 1,
                  zIndex: isHovered ? 20 : index
                }}
                style={{
                  position: 'relative',
                  width: 'calc(25% - 30px)',
                  maxWidth: '240px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: '#fff',
                  boxShadow: isHovered 
                    ? '0 30px 60px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.2)' 
                    : '0 20px 50px rgba(0,0,0,0.35)',
                  cursor: 'pointer',
                  transformStyle: 'preserve-3d',
                  transition: 'box-shadow 0.3s ease'
                }}
              >
                {/* A4 比例容器 */}
                <div style={{
                  aspectRatio: '2164 / 3063', // A4 竖向比例
                  position: 'relative'
                }}>
                  <img 
                    src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                    alt={image.label}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  
                  {/* 文档编号角标 */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '1px'
                  }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                
                {/* 底部标签 */}
                <div style={{
                  padding: '12px 16px',
                  background: '#1a1a1a',
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textAlign: 'center'
                  }}>
                    {image.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 强调信息 */}
        {emphasis && (
          <motion.div
            style={{
              opacity: emphasisOpacity,
              y: emphasisY,
              textAlign: 'center',
              padding: 'var(--space-3xl) 0'
            }}
          >
            <div style={{
              display: 'inline-block',
              padding: 'var(--space-lg) var(--space-2xl)',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                fontWeight: '400',
                color: '#fff',
                letterSpacing: '1px'
              }}>
                {emphasis}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DocumentGalleryScreen;

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SECTION_PADDING, MAX_WIDTH_WIDE, itemVariants } from './Common';

/**
 * ============================================
 * 屏幕: 优先级网格展示 (PriorityGridScreen)
 * ============================================
 * 设计稿要求:
 * - 认知角色: 重建理解
 * - 滚动长度: 中等
 * - 交互强度: 中
 * - 初始画面: 文案内容进入
 * - 滚动中变化: 产品变体网格逐步显现
 * - 滚动结束: 停留在"设计是一种选择机制"的判断上
 * ============================================
 */
export const PriorityGridScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  emphasis,
  images = [],
  bgAlt = false
}) => {
  const containerRef = useRef(null);
  
  // 滚动进度追踪
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 网格逐步显现动画
  const gridOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const gridScale = useTransform(scrollYProgress, [0.15, 0.3], [0.95, 1]);

  // 强调文字在最后显现
  const emphasisOpacity = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);
  const emphasisY = useTransform(scrollYProgress, [0.6, 0.75], [30, 0]);

  // 将图片分成多行展示 (每行5张)
  const chunkedImages = [];
  const chunkSize = 5;
  for (let i = 0; i < images.length; i += chunkSize) {
    chunkedImages.push(images.slice(i, i + chunkSize));
  }

  return (
    <section 
      ref={containerRef}
      style={{ 
        minHeight: '180vh', // 中等滚动长度
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

        {/* 产品网格 - 多行展示 */}
        <motion.div
          style={{
            opacity: gridOpacity,
            scale: gridScale,
            marginBottom: 'var(--space-4xl)'
          }}
        >
          {chunkedImages.map((row, rowIndex) => (
            <div 
              key={rowIndex}
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--space-md)',
                marginBottom: 'var(--space-md)',
                // 交错效果：奇数行偏移
                paddingLeft: rowIndex % 2 === 1 ? '40px' : 0,
                paddingRight: rowIndex % 2 === 1 ? 0 : '40px'
              }}
            >
              {row.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: (rowIndex * chunkSize + index) * 0.05 
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: '#1a1a1a',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    width: '160px',
                    height: '160px',
                    flexShrink: 0
                  }}
                >
                  <img 
                    src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                    alt={image.label}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.3s ease'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Hover 标签 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '12px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textAlign: 'center'
                    }}
                  >
                    {image.label}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>

        {/* 强调信息 - 最后显现 */}
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

export default PriorityGridScreen;

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SECTION_PADDING, MAX_WIDTH_WIDE, itemVariants } from './Common';

/**
 * ============================================
 * 屏幕: 包装画廊展示 (PackagingGalleryScreen)
 * ============================================
 * 设计稿要求:
 * - 认知角色: 延展认知
 * - 滚动长度: 中等略短
 * - 交互强度: 中
 * - 初始画面: 文案 + 包装系统宏观图
 * - 滚动中变化: 包装系统完整展示
 * - 滚动结束: 停留在"包装是品牌表达的延续"
 * ============================================
 */
export const PackagingGalleryScreen = ({
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

  // 瀑布流整体显现
  const galleryOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);

  // 强调文字
  const emphasisOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const emphasisY = useTransform(scrollYProgress, [0.55, 0.7], [30, 0]);

  // 将图片分成3列（瀑布流布局）
  const columns = [[], [], []];
  images.forEach((image, index) => {
    columns[index % 3].push({ ...image, originalIndex: index });
  });

  return (
    <section 
      ref={containerRef}
      style={{ 
        minHeight: '150vh', // 中等略短
        position: 'relative',
        background: '#000', // 统一纯黑背景
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

        {/* 瀑布流画廊 - 3列布局 */}
        <motion.div
          style={{
            opacity: galleryOpacity,
            display: 'flex',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-4xl)'
          }}
        >
          {columns.map((column, colIndex) => (
            <div 
              key={colIndex}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-lg)',
                // 交错起始位置
                marginTop: colIndex === 1 ? 'var(--space-2xl)' : 0
              }}
            >
              {column.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: image.originalIndex * 0.08 
                  }}
                  viewport={{ once: true, margin: "-10%" }}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    background: '#1a1a1a',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                    cursor: 'pointer'
                  }}
                >
                  <img 
                    src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                    alt={image.label}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      transition: 'transform 0.4s ease'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* 底部标签 */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '16px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                  className="image-label"
                  >
                    {image.label}
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
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

      {/* Hover 效果样式 */}
      <style>{`
        section:hover .image-label {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
};

export default PackagingGalleryScreen;

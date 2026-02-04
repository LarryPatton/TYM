import React, { useRef, useState, useEffect } from 'react';
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
 * 
 * 移动端优化:
 * - 单列布局
 * - 缩短滚动行程
 * - 简化动画延迟
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
  
  // 移动端检测
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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

  // 根据设备决定列数：移动端1列，桌面端3列
  const columnCount = isMobile ? 1 : 3;
  const columns = Array.from({ length: columnCount }, () => []);
  images.forEach((image, index) => {
    columns[index % columnCount].push({ ...image, originalIndex: index });
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
            {screenNumber && screenLabel ? `${screenNumber} / ${screenLabel}` : (screenNumber || screenLabel)}
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

        {/* 瀑布流画廊 - 响应式布局（桌面3列，移动端1列） */}
        <motion.div
          style={{
            opacity: galleryOpacity,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row', // 移动端改为纵向
            gap: isMobile ? 'var(--space-md)' : 'var(--space-lg)',
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
                gap: isMobile ? 'var(--space-md)' : 'var(--space-lg)',
                // 交错起始位置（移动端禁用）
                marginTop: (!isMobile && colIndex === 1) ? 'var(--space-2xl)' : 0
              }}
            >
              {column.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: isMobile ? 30 : 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: isMobile ? 0.4 : 0.6, 
                    // 移动端减少延迟
                    delay: isMobile ? index * 0.05 : image.originalIndex * 0.08 
                  }}
                  viewport={{ once: true, margin: isMobile ? "-5%" : "-10%" }}
                  whileHover={isMobile ? {} : { scale: 1.02 }}
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

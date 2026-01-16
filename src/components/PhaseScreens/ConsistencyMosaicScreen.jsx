import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SECTION_PADDING, MAX_WIDTH_WIDE, itemVariants } from './Common';

/**
 * ============================================
 * 屏幕: 一致性马赛克展示 (ConsistencyMosaicScreen)
 * ============================================
 * 设计稿要求:
 * - 认知角色: 收束认知
 * - 滚动长度: 略短于中等
 * - 交互强度: 低
 * - 初始画面: 产品矩阵完整入镜
 * - 滚动中变化: 从全景到特写的过渡
 * - 滚动结束: 一句总结式表达，强调"一致性即力量"
 * ============================================
 */
export const ConsistencyMosaicScreen = ({
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

  // 马赛克整体动画
  const mosaicOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const mosaicScale = useTransform(scrollYProgress, [0.1, 0.4], [0.9, 1]);

  // 强调文字
  const emphasisOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const emphasisScale = useTransform(scrollYProgress, [0.55, 0.7], [0.95, 1]);

  // 马赛克布局配置 - 3x3 网格，中心大图
  const getGridStyle = (index, total) => {
    // 如果是9张图片，中间那张放大
    if (total === 9 && index === 4) {
      return {
        gridColumn: 'span 1',
        gridRow: 'span 1',
        transform: 'scale(1.05)',
        zIndex: 2
      };
    }
    return {};
  };

  return (
    <section 
      ref={containerRef}
      style={{ 
        minHeight: '140vh', // 略短于中等
        position: 'relative',
        background: bgAlt ? '#111' : '#0a0a0a',
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
            marginBottom: 'var(--space-3xl)',
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

        {/* 马赛克画廊 - 3x3 网格 */}
        <motion.div
          style={{
            opacity: mosaicOpacity,
            scale: mosaicScale,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-4xl)',
            maxWidth: '1000px',
            margin: '0 auto var(--space-4xl)'
          }}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.06,
                ease: [0.16, 1, 0.3, 1]
              }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, zIndex: 10 }}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: '#1a1a1a',
                boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                aspectRatio: '1/1',
                cursor: 'pointer',
                ...getGridStyle(index, images.length)
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
                  transition: 'transform 0.4s ease'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              {/* 悬停标签 */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  letterSpacing: '0.5px'
                }}
              >
                {image.label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* 强调信息 - 收束式总结 */}
        {emphasis && (
          <motion.div
            style={{
              opacity: emphasisOpacity,
              scale: emphasisScale,
              textAlign: 'center',
              padding: 'var(--space-2xl) 0'
            }}
          >
            <div style={{
              display: 'inline-block',
              padding: 'var(--space-xl) var(--space-3xl)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: '400',
                color: '#fff',
                letterSpacing: '2px'
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

export default ConsistencyMosaicScreen;

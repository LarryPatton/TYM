import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SECTION_PADDING, MAX_WIDTH_WIDE, itemVariants } from './Common';

/**
 * ============================================
 * 屏幕: 边界展示 (BoundariesScreen)
 * ============================================
 * 设计稿要求:
 * - 认知角色: 提出张力
 * - 滚动长度: 略长于正常
 * - 交互强度: 低
 * - 初始画面: 一句明确但克制的判断进入视野
 * - 滚动中变化: 限制条件与现实因素逐步显现
 * - 滚动结束: 停留在"先限定问题，才有解法"的判断上
 * ============================================
 */
const BoundariesScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  emphasis,
  images = []
}) => {
  const containerRef = useRef(null);
  const [imageErrors, setImageErrors] = useState({});
  const [imageLoaded, setImageLoaded] = useState({});
  
  // 滚动进度追踪
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 三张图片的交错显现动画
  const image1Opacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const image1Y = useTransform(scrollYProgress, [0.1, 0.25], [60, 0]);
  
  const image2Opacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);
  const image2Y = useTransform(scrollYProgress, [0.2, 0.35], [60, 0]);
  
  const image3Opacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
  const image3Y = useTransform(scrollYProgress, [0.3, 0.45], [60, 0]);

  // 强调文字在最后显现
  const emphasisOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const emphasisScale = useTransform(scrollYProgress, [0.5, 0.65], [0.95, 1]);

  const imageAnimations = [
    { opacity: image1Opacity, y: image1Y },
    { opacity: image2Opacity, y: image2Y },
    { opacity: image3Opacity, y: image3Y }
  ];

  // 图片加载成功处理
  const handleImageLoad = (index) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  // 图片加载失败处理
  const handleImageError = (index, imageSrc) => {
    console.error(`[BoundariesScreen] 图片加载失败: ${imageSrc}`);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <section 
      ref={containerRef}
      style={{ 
        minHeight: '150vh',
        position: 'relative',
        background: '#0a0a0a',
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
            marginBottom: 'var(--space-4xl)'
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
            maxWidth: '800px'
          }}>
            {title}
          </h2>
          
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 'var(--text-body-lg)',
            lineHeight: 1.6,
            maxWidth: '600px'
          }}>
            {content}
          </p>
        </motion.div>

        {/* 三张边界图片 - 交错布局 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-xl)',
          marginBottom: 'var(--space-4xl)'
        }}>
          {images.map((image, index) => {
            const imageSrc = `${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`;
            
            return (
              <motion.div
                key={index}
                style={{
                  opacity: imageAnimations[index]?.opacity || 1,
                  y: imageAnimations[index]?.y || 0,
                  marginTop: index === 1 ? 'var(--space-3xl)' : 0
                }}
              >
                <div style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                  background: '#1a1a1a',
                  aspectRatio: '3/4'
                }}>
                  {/* 加载占位符 */}
                  {!imageLoaded[index] && !imageErrors[index] && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#1a1a1a',
                      color: 'rgba(255,255,255,0.3)',
                      fontSize: '0.875rem'
                    }}>
                      Loading...
                    </div>
                  )}
                  
                  {/* 错误占位符 */}
                  {imageErrors[index] && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#1a1a1a',
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '0.75rem',
                      padding: '20px',
                      textAlign: 'center'
                    }}>
                      <div style={{ marginBottom: '8px', fontSize: '1.5rem' }}>⚠️</div>
                      <div>图片加载失败</div>
                      <div style={{ 
                        marginTop: '8px', 
                        fontSize: '0.65rem', 
                        opacity: 0.6,
                        wordBreak: 'break-all'
                      }}>
                        {imageSrc}
                      </div>
                    </div>
                  )}
                  
                  <img 
                    src={imageSrc}
                    alt={image.label}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: imageErrors[index] ? 'none' : 'block',
                      opacity: imageLoaded[index] ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    }}
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index, imageSrc)}
                  />
                  {/* 底部标签 */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '20px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    letterSpacing: '0.5px'
                  }}>
                    {image.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 强调信息 - 最后显现 */}
        {emphasis && (
          <motion.div
            style={{
              opacity: emphasisOpacity,
              scale: emphasisScale,
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

export { BoundariesScreen };
export default BoundariesScreen;
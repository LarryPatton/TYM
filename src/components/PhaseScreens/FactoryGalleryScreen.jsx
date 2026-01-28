import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SECTION_PADDING, MAX_WIDTH_WIDE, itemVariants } from './Common';

/**
 * ============================================
 * 屏幕: 工厂画廊展示 (FactoryGalleryScreen)
 * ============================================
 * 设计概念:
 * - 展示工厂实拍的竖向图片（约 9:16 比例）
 * - 采用错落瀑布流布局，形成真实工业感
 * - 图片随机倾斜和视差滚动，增加动态感
 * ============================================
 */

// 生成伪随机数的辅助函数
const seededRandom = (seed) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

export const FactoryGalleryScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  emphasis,
  images = [],
  columns = 4, // 列数
  bgAlt = false
}) => {
  const containerRef = useRef(null);
  
  // 滚动进度追踪
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 多层视差效果
  const parallax1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const parallax2 = useTransform(scrollYProgress, [0, 1], [40, -80]);
  const parallax3 = useTransform(scrollYProgress, [0, 1], [80, -40]);

  // 分配图片到列（瀑布流）
  const distributeToColumns = (items, numCols) => {
    const cols = Array.from({ length: numCols }, () => []);
    items.forEach((item, index) => {
      cols[index % numCols].push({ ...item, globalIndex: index });
    });
    return cols;
  };

  const columnData = distributeToColumns(images, columns);

  // 根据列索引获取视差值
  const getParallax = (colIndex) => {
    const parallaxes = [parallax1, parallax2, parallax3, parallax1];
    return parallaxes[colIndex % parallaxes.length];
  };

  return (
    <section 
      ref={containerRef}
      style={{ 
        minHeight: '150vh',
        position: 'relative',
        background: bgAlt ? '#0d0d0d' : 'var(--phase-bg-color, #0a0a0a)',
        color: '#fff',
        padding: SECTION_PADDING,
        overflow: 'hidden'
      }}
    >
      {/* 顶部文案区域 */}
      <div style={{
        maxWidth: MAX_WIDTH_WIDE,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 10
      }}>
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
          
          {content && (
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 'var(--text-body-lg)',
              lineHeight: 1.6,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {content}
            </p>
          )}
        </motion.div>
      </div>

      {/* 瀑布流画廊 */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-lg)',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 var(--space-xl)',
        alignItems: 'flex-start'
      }}>
        {columnData.map((column, colIndex) => {
          // 每列有不同的起始偏移
          const offsetY = (colIndex % 2 === 0) ? 0 : 60;
          const parallaxY = getParallax(colIndex);

          return (
            <motion.div
              key={`col-${colIndex}`}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-lg)',
                y: parallaxY,
                marginTop: offsetY
              }}
            >
              {column.map((image, imgIndex) => {
                // 随机旋转角度
                const rotation = (seededRandom(image.globalIndex * 13) - 0.5) * 6; // -3deg to +3deg
                const delay = image.globalIndex * 0.05;

                return (
                  <motion.div
                    key={`img-${image.globalIndex}`}
                    initial={{ opacity: 0, y: 50, rotate: rotation * 2 }}
                    whileInView={{ opacity: 1, y: 0, rotate: rotation }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      duration: 0.6, 
                      delay,
                      ease: "easeOut" 
                    }}
                    whileHover={{ 
                      scale: 1.03,
                      rotate: 0,
                      zIndex: 20,
                      transition: { duration: 0.2 }
                    }}
                    style={{
                      position: 'relative',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                      transform: `rotate(${rotation}deg)`
                    }}
                  >
                    <img 
                      src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                      alt={image.label || `Factory image ${image.globalIndex + 1}`}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        transition: 'transform 0.3s ease'
                      }} 
                    />
                    
                    {/* 渐变遮罩 + 标签 */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: 'var(--space-lg) var(--space-md)',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      <span style={{
                        fontSize: 'var(--text-sm)',
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: '500'
                      }}>
                        {image.label || `#${image.globalIndex + 1}`}
                      </span>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          );
        })}
      </div>

      {/* 强调信息 */}
      {emphasis && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            textAlign: 'center',
            marginTop: 'var(--space-3xl)',
            padding: 'var(--space-2xl)',
            zIndex: 30,
            position: 'relative'
          }}
        >
          <div style={{
            display: 'inline-block',
            padding: 'var(--space-xl) var(--space-3xl)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
              fontWeight: '400',
              color: '#fff',
              letterSpacing: '1px'
            }}>
              {emphasis}
            </span>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default FactoryGalleryScreen;

import React from 'react';
import { motion } from 'framer-motion';
import { 
  SECTION_PADDING, 
  MAX_WIDTH_WIDE, 
  sectionVariants, 
  itemVariants 
} from './Common';

// ============================================
// 屏幕: 交错瀑布流画廊 (FlyInGalleryScreen)
// 布局: 3+4 两行错落布局，增加视觉层次感
// 动画: 第一行从左侧飞入，第二行从右侧飞入
// 用途: 展示一组产品图片，强调节奏感和层次感
// ============================================
export const FlyInGalleryScreen = ({ 
  id,                                   // 屏幕唯一标识
  phaseId,                              // 所属阶段 ID
  screenNumber,                         // 屏幕编号 (如 "05")
  screenLabel,                          // 屏幕标签 (如 "Gallery")
  title,                                // 标题
  content,                              // 描述内容
  images = [],                          // 图片数组 [{ src, label }]
  imageHeight = '50vh',                 // 统一图片高度
  gap = 'var(--space-lg)',              // 图片间距
  bgAlt = false                         // 是否使用交替背景色
}) => {
  
  // 将图片分为两行: 第一行3张，第二行4张
  const firstRowCount = Math.min(3, images.length);
  const firstRow = images.slice(0, firstRowCount);
  const secondRow = images.slice(firstRowCount);

  // 容器动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  // 第一行: 从左侧飞入
  const flyInFromLeftVariants = {
    hidden: { 
      opacity: 0, 
      x: -120,  // 从左侧 120px 处开始
      y: 30,
      scale: 0.9,
      rotate: -3
    },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 0.9
      }
    }
  };

  // 第二行: 从右侧飞入
  const flyInFromRightVariants = {
    hidden: { 
      opacity: 0, 
      x: 120,  // 从右侧 120px 处开始
      y: 30,
      scale: 0.9,
      rotate: 3
    },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 0.9
      }
    }
  };

  // 计算单行图片的高度（第二行稍小，增加层次）
  const firstRowHeight = imageHeight;
  const secondRowHeight = `calc(${imageHeight} * 0.85)`;

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SECTION_PADDING,
      background: bgAlt ? 'transparent' : 'var(--phase-bg-color, #0a0a0a)',
      color: '#fff',
      overflow: 'hidden'
    }}>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        style={{ 
          maxWidth: '100%',
          width: '100%',
          padding: '0 var(--space-xl)'
        }}
      >
        {/* 头部文本 - 可选 */}
        {(title || screenNumber) && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: 'var(--space-3xl)', 
            maxWidth: '800px', 
            margin: '0 auto var(--space-3xl) auto' 
          }}>
            <motion.div variants={itemVariants}>
              {screenNumber && (
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  marginBottom: 'var(--space-lg)'
                }}>
                  {screenNumber} / {screenLabel}
                </div>
              )}
              {title && (
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--text-h2)',
                  fontWeight: '400',
                  marginBottom: 'var(--space-lg)',
                  lineHeight: 'var(--line-height-snug)',
                  color: '#fff'
                }}>
                  {title}
                </h2>
              )}
              {content && (
                <p style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 'var(--text-body-lg)',
                  lineHeight: 'var(--line-height-relaxed)'
                }}>
                  {content}
                </p>
              )}
            </motion.div>
          </div>
        )}

        {/* 交错瀑布流布局容器 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-xl)',
          width: '100%'
        }}>
          {/* 第一行: 3张图片，从左侧飞入 */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',  // 底部对齐
              gap: gap,
              width: '100%',
              paddingLeft: '5%'  // 轻微左偏移，增加错落感
            }}
          >
            {firstRow.map((img, index) => (
              <motion.div
                key={`row1-${index}`}
                variants={flyInFromLeftVariants}
                custom={index}
                whileHover={{ 
                  y: -12,
                  scale: 1.03,
                  rotate: 0,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                  transition: { duration: 0.3, ease: 'easeOut' }
                }}
                style={{
                  height: firstRowHeight,
                  flexShrink: 0,
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: 'transparent',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  cursor: 'pointer'
                }}
              >
                <img 
                  src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                  alt={img.label || `Gallery image ${index + 1}`}
                  style={{ 
                    height: '100%', 
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  onError={(e) => {
                    console.error('FlyInGallery image load error:', img.src);
                    e.target.style.display = 'none';
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* 第二行: 4张图片，从右侧飞入，稍小一些 */}
          {secondRow.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',  // 顶部对齐
                gap: gap,
                width: '100%',
                paddingRight: '5%'  // 轻微右偏移，与第一行形成错落
              }}
            >
              {secondRow.map((img, index) => (
                <motion.div
                  key={`row2-${index}`}
                  variants={flyInFromRightVariants}
                  custom={index}
                  whileHover={{ 
                    y: -12,
                    scale: 1.03,
                    rotate: 0,
                    boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                    transition: { duration: 0.3, ease: 'easeOut' }
                  }}
                  style={{
                    height: secondRowHeight,
                    flexShrink: 0,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'transparent',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
                    cursor: 'pointer'
                  }}
                >
                  <img 
                    src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                    alt={img.label || `Gallery image ${firstRowCount + index + 1}`}
                    style={{ 
                      height: '100%', 
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                    onError={(e) => {
                      console.error('FlyInGallery image load error:', img.src);
                      e.target.style.display = 'none';
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* 图片标签 - 可选显示，两行分开 */}
        {images.some(img => img.label) && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-md)',
            marginTop: 'var(--space-2xl)'
          }}>
            {/* 第一行标签 */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--space-3xl)',
                paddingLeft: '5%'
              }}
            >
              {firstRow.map((img, index) => (
                img.label && (
                  <motion.span
                    key={`label1-${index}`}
                    variants={flyInFromLeftVariants}
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'rgba(255,255,255,0.6)',
                      textAlign: 'center',
                      minWidth: '80px'
                    }}
                  >
                    {img.label}
                  </motion.span>
                )
              ))}
            </motion.div>
            {/* 第二行标签 */}
            {secondRow.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 'var(--space-2xl)',
                  paddingRight: '5%'
                }}
              >
                {secondRow.map((img, index) => (
                  img.label && (
                    <motion.span
                      key={`label2-${index}`}
                      variants={flyInFromRightVariants}
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'rgba(255,255,255,0.5)',
                        textAlign: 'center',
                        minWidth: '70px'
                      }}
                    >
                      {img.label}
                    </motion.span>
                  )
                ))}
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default FlyInGalleryScreen;
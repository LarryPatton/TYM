import React from 'react';
import { motion } from 'framer-motion';
import { 
  SECTION_PADDING, 
  MAX_WIDTH_WIDE, 
  sectionVariants, 
  itemVariants, 
  ImagePlaceholder 
} from './Common';

// ============================================
// 屏幕: 图文内容 (ContentScreen)
// 左右布局的图文展示，最通用的屏幕类型
// ============================================
export const ContentScreen = ({ 
  id,
  phaseId,
  screenNumber, 
  screenLabel, 
  title, 
  content, 
  note,
  imageHint,
  imageAspect = '4/3',
  reverse = false,
  bgAlt = false,
  customImage // 新增 prop
}) => {
  // Phase 01: Color Section Custom Render - 1大3小不规则布局
  const renderColorImages = () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '2fr 1fr', 
      gridTemplateRows: 'auto auto',
      gap: 'var(--space-md)',
      height: '100%'
    }}>
      {/* 主色彩 - 占据左侧两行 */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
        style={{ 
          gridRow: '1 / 3',
          aspectRatio: '3/4',
          overflow: 'hidden', 
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative'
        }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/phase-01/typography-01.png`}
          alt="Primary Color"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => e.target.style.display = 'none'}
        />
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          fontSize: 'var(--text-xs)',
          color: 'rgba(255,255,255,0.8)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          background: 'rgba(0,0,0,0.3)',
          padding: '4px 8px',
          borderRadius: 'var(--radius-sm)'
        }}>
          Primary
        </div>
      </motion.div>
      
      {/* 辅助色 - 右上 */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        whileHover={{ scale: 1.03 }}
        style={{ 
          aspectRatio: '1/1',
          overflow: 'hidden', 
          borderRadius: 'var(--radius-sm)',
          position: 'relative'
        }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/phase-01/typography-02.png`}
          alt="Secondary Color 1"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => e.target.style.display = 'none'}
        />
      </motion.div>
      
      {/* 辅助色 - 右下区域 (包含两个小色块) */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          style={{ 
            flex: 1,
            aspectRatio: '1/1',
            overflow: 'hidden', 
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}images/phase-01/logo-explore-01.png`}
            alt="Secondary Color 2"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => e.target.style.display = 'none'}
          />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          style={{ 
            flex: 1,
            aspectRatio: '1/1',
            overflow: 'hidden', 
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}images/phase-01/logo-explore-02.png`}
            alt="Secondary Color 3"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => e.target.style.display = 'none'}
          />
        </motion.div>
      </div>
    </div>
  );

  // Phase 01: Typography Section Custom Render - 交错卡片布局
  const renderTypographyImages = () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 'var(--space-xl)',
      position: 'relative'
    }}>
      {[11, 12].map((num, index) => (
        <motion.div 
          key={num}
          initial={{ opacity: 0, x: index === 0 ? -30 : 30, y: 20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
          viewport={{ once: true }}
          whileHover={{ 
            scale: 1.02, 
            boxShadow: 'var(--shadow-lg)',
            transition: { duration: 0.3 }
          }}
          style={{ 
            overflow: 'hidden', 
            borderRadius: 'var(--radius-lg)', 
            boxShadow: 'var(--shadow-md)',
            background: '#fff',
            // 交错偏移效果
            marginLeft: index === 0 ? '0' : 'var(--space-xl)',
            marginRight: index === 0 ? 'var(--space-xl)' : '0',
            position: 'relative'
          }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}images/phase-01/type-specimen-0${index + 1}.png`}
            alt={`Typography ${num}`}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            onError={(e) => e.target.style.display = 'none'}
          />
          {/* 标签 */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: index === 0 ? '16px' : 'auto',
            right: index === 1 ? '16px' : 'auto',
            fontSize: 'var(--text-xs)',
            color: 'rgba(0,0,0,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            background: 'rgba(255,255,255,0.9)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            backdropFilter: 'blur(4px)'
          }}>
            {index === 0 ? 'Headlines' : 'Body Text'}
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Phase 02: CMF Final Custom Render - 材质特写拼贴
  const renderCMFFinalImages = () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: 'var(--space-md)',
      height: '100%'
    }}>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        style={{ 
          gridColumn: '1 / 3',
          aspectRatio: '16/9',
          overflow: 'hidden', 
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <ImagePlaceholder hint="CMF 整体效果" aspectRatio="100%" style={{ height: '100%' }} />
      </motion.div>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        style={{ 
          aspectRatio: '1/1',
          overflow: 'hidden', 
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <ImagePlaceholder hint="材质纹理 A" aspectRatio="100%" style={{ height: '100%' }} />
      </motion.div>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        style={{ 
          aspectRatio: '1/1',
          overflow: 'hidden', 
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <ImagePlaceholder hint="材质纹理 B" aspectRatio="100%" style={{ height: '100%' }} />
      </motion.div>
    </div>
  );

  // 默认图片渲染
  const renderDefaultImage = () => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        background: 'var(--color-bg-alt)'
      }}
    >
      {customImage ? (
        <img 
          src={customImage} 
          alt={title} 
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '40px' }} 
          onError={(e) => e.target.style.display = 'none'}
        />
      ) : (
        <ImagePlaceholder hint={imageHint} aspectRatio={imageAspect} style={{ height: '100%' }} />
      )}
    </motion.div>
  );

  // 根据 ID 选择渲染内容
  const renderImageContent = () => {
    if (phaseId === 'phase-01' && id === 'color') return renderColorImages();
    if (phaseId === 'phase-01' && id === 'typography') return renderTypographyImages();
    if (phaseId === 'phase-02' && id === 'cmf-final') return renderCMFFinalImages();
    return renderDefaultImage();
  };

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SECTION_PADDING,
      // 强制深色模式 - 使用 phase 统一背景色
      background: bgAlt ? '#111111' : 'var(--phase-bg-color, #0a0a0a)',
      color: '#fff' // 强制文字白色
    }}>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{ 
          maxWidth: MAX_WIDTH_WIDE, 
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-4xl)',
          alignItems: 'center',
          direction: reverse ? 'rtl' : 'ltr' // 控制左右布局反转
        }}
        className="content-screen-grid"
      >
        {/* 文本区域 */}
        <div style={{ direction: 'ltr' }}> {/* 恢复文本方向 */}
          <motion.div variants={itemVariants}>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'rgba(255,255,255,0.5)', // 调整辅助文字颜色
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
              marginBottom: 'var(--space-xl)',
              lineHeight: 'var(--line-height-snug)',
              color: '#fff' // 确保标题白色
            }}>
              {title}
            </h2>
            <div style={{
              color: 'rgba(255,255,255,0.7)', // 调整正文颜色
              fontSize: 'var(--text-body-lg)',
              lineHeight: 'var(--line-height-relaxed)',
              marginBottom: 'var(--space-xl)'
            }}>
              {content}
            </div>
            {note && (
              <div style={{
                padding: 'var(--space-lg)',
                background: 'rgba(255,255,255,0.05)', // 调整 Note 背景
                borderLeft: '2px solid var(--color-accent)',
                fontSize: 'var(--text-sm)',
                color: 'rgba(255,255,255,0.6)',
                fontStyle: 'italic'
              }}>
                {note}
              </div>
            )}
          </motion.div>
        </div>
        
        {/* 图片区域 */}
        <motion.div 
          variants={itemVariants}
          style={{ height: '100%', minHeight: '400px' }}
        >
          {renderImageContent()}
        </motion.div>
      </motion.div>
    </section>
  );
};
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
// 屏幕: 对比展示 (ComparisonScreen)
// 左右对比布局，用于展示 A/B 对比或 Before/After
// ============================================
export const ComparisonScreen = ({ 
  id,
  phaseId,
  screenNumber, 
  screenLabel, 
  title, 
  content, 
  note,
  leftHint,
  rightHint,
  leftLabel,
  rightLabel,
  bgAlt = false
}) => {
  // Phase 02: Consistency Custom Render - 产品与品牌元素对比
  const renderConsistencyImages = () => (
    <>
      {/* 左侧：产品 A 实物 */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        style={{ 
          position: 'relative',
          aspectRatio: '4/5',
          overflow: 'hidden',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <ImagePlaceholder hint="产品 A 实物图" aspectRatio="100%" style={{ height: '100%' }} />
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          padding: 'var(--space-md)',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(4px)',
          fontSize: 'var(--text-sm)',
          fontWeight: '500',
          textAlign: 'center'
        }}>
          {leftLabel}
        </div>
      </motion.div>

      {/* 右侧：品牌元素拆解 */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        style={{ 
          position: 'relative',
          aspectRatio: '4/5',
          overflow: 'hidden',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--space-lg)'
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-border)' }}>
          <span style={{ color: 'var(--color-text-light)' }}>Logo 规范</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-border)' }}>
          <span style={{ color: 'var(--color-text-light)' }}>色彩规范</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'var(--color-text-light)' }}>字体规范</span>
        </div>
        
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          padding: 'var(--space-md)',
          background: 'rgba(240,240,240,0.9)',
          backdropFilter: 'blur(4px)',
          fontSize: 'var(--text-sm)',
          fontWeight: '500',
          textAlign: 'center'
        }}>
          {rightLabel}
        </div>
      </motion.div>
    </>
  );

  // 默认对比渲染
  const renderDefaultComparison = () => (
    <>
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        style={{ 
          position: 'relative',
          aspectRatio: '4/5',
          overflow: 'hidden',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <ImagePlaceholder hint={leftHint} aspectRatio="100%" style={{ height: '100%' }} />
        {leftLabel && (
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            padding: 'var(--space-md)',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(4px)',
            fontSize: 'var(--text-sm)',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            {leftLabel}
          </div>
        )}
      </motion.div>

      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        style={{ 
          position: 'relative',
          aspectRatio: '4/5',
          overflow: 'hidden',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <ImagePlaceholder hint={rightHint} aspectRatio="100%" style={{ height: '100%' }} />
        {rightLabel && (
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            padding: 'var(--space-md)',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(4px)',
            fontSize: 'var(--text-sm)',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            {rightLabel}
          </div>
        )}
      </motion.div>
    </>
  );

  const renderComparisonContent = () => {
    if (phaseId === 'phase-02' && id === 'consistency') return renderConsistencyImages();
    return renderDefaultComparison();
  };

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SECTION_PADDING,
      // 强制深色模式
      background: bgAlt ? '#111111' : '#0a0a0a',
      color: '#fff'
    }}>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{ maxWidth: MAX_WIDTH_WIDE, width: '100%' }}
      >
        {/* 头部文本 */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)', maxWidth: '800px', margin: '0 auto var(--space-3xl) auto' }}>
          <motion.div variants={itemVariants}>
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
              fontSize: 'var(--text-h2)',
              fontWeight: '400',
              marginBottom: 'var(--space-lg)',
              lineHeight: 'var(--line-height-snug)',
              color: '#fff'
            }}>
              {title}
            </h2>
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

        {/* 对比区域 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-2xl)',
          alignItems: 'center'
        }} className="comparison-screen-grid">
          {renderComparisonContent()}
        </div>

        {/* 底部备注 */}
        {note && (
          <motion.div 
            variants={itemVariants}
            style={{
              marginTop: 'var(--space-2xl)',
              textAlign: 'center',
              fontSize: 'var(--text-sm)',
              color: 'rgba(255,255,255,0.6)',
              fontStyle: 'italic'
            }}
          >
            {note}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};
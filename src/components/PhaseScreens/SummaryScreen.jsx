import React from 'react';
import { motion } from 'framer-motion';
import { 
  SECTION_PADDING, 
  MAX_WIDTH_MEDIUM, 
  sectionVariants, 
  itemVariants, 
  ImagePlaceholder 
} from './Common';

// ============================================
// 屏幕: 阶段总结 (SummaryScreen)
// Phase 结束页，提供导航到下一 Phase
// ============================================
export const SummaryScreen = ({ 
  id,
  phaseId,
  title, 
  content, 
  imageHint,
  nextPhase, // { id, titleZh }
  backLabel = 'Back to Index',
  nextLabel = 'Next Phase',
  onNavigate
}) => {
  // Phase 01: Summary Custom Render - 品牌系统全景图
  const renderPhase01Summary = () => (
    <div style={{
      width: '100%',
      height: '60vh',
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-xl)',
      marginBottom: 'var(--space-2xl)'
    }}>
      <img 
        src={`${import.meta.env.BASE_URL}images/phase-01/summary.png`}
        alt="Phase 01 Summary"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => e.target.style.display = 'none'}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 'var(--space-2xl)'
      }}>
        <div style={{ color: '#fff', textAlign: 'center', maxWidth: '600px' }}>
          <h3 style={{ fontSize: 'var(--text-h3)', marginBottom: 'var(--space-md)' }}>System Established</h3>
          <p style={{ opacity: 0.8 }}>视觉系统已建立，为后续产品与传播提供坚实基础。</p>
        </div>
      </div>
    </div>
  );

  const renderSummaryImage = () => {
    if (phaseId === 'phase-01') return renderPhase01Summary();
    return (
      <div style={{
        width: '100%',
        height: '50vh',
        background: 'var(--color-bg-alt)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-2xl)',
        overflow: 'hidden'
      }}>
        <ImagePlaceholder hint={imageHint} aspectRatio="100%" style={{ height: '100%' }} />
      </div>
    );
  };

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SECTION_PADDING,
      // 强制深色模式
      background: '#0a0a0a',
      color: '#fff'
    }}>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{ maxWidth: MAX_WIDTH_MEDIUM, width: '100%', textAlign: 'center' }}
      >
        <motion.div variants={itemVariants}>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: 'var(--space-lg)'
          }}>
            Phase Summary
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-h2)',
            fontWeight: '400',
            marginBottom: 'var(--space-xl)',
            lineHeight: 'var(--line-height-snug)',
            color: '#fff'
          }}>
            {title}
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 'var(--text-body-lg)',
            lineHeight: 'var(--line-height-relaxed)',
            marginBottom: 'var(--space-3xl)',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            {content}
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          {renderSummaryImage()}
        </motion.div>
      </motion.div>
    </section>
  );
};
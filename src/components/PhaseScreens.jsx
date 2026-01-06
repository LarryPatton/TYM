import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// ============================================
// 通用样式常量
// ============================================
const SECTION_PADDING = 'var(--space-4xl) var(--space-2xl)';
const MAX_WIDTH_NARROW = '800px';
const MAX_WIDTH_MEDIUM = '1000px';
const MAX_WIDTH_WIDE = '1200px';

// ============================================
// 图片占位符组件
// ============================================
export const ImagePlaceholder = ({ hint, aspectRatio = '16/9', style = {} }) => (
  <div style={{
    width: '100%',
    aspectRatio: aspectRatio,
    background: 'var(--color-bg-alt)',
    border: '2px dashed var(--color-border)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text-light)',
    fontSize: 'var(--text-sm)',
    padding: 'var(--space-xl)',
    textAlign: 'center',
    ...style
  }}>
    [ {hint || '图片区域'} ]
  </div>
);

// ============================================
// 屏幕 01: 阶段引导页 (IntroScreen)
// 用于每个 Phase 的第一屏
// ============================================
export const IntroScreen = ({ 
  phaseNumber, 
  titleEn, 
  titleZh, 
  content, 
  imageHint = '极简视觉：品牌标志展示',
  showScrollHint = true 
}) => (
  <section style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: SECTION_PADDING,
    position: 'relative'
  }}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      style={{ maxWidth: MAX_WIDTH_NARROW }}
    >
      {/* Phase 标签 */}
      <div style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-light)',
        textTransform: 'uppercase',
        letterSpacing: '3px',
        marginBottom: 'var(--space-xl)',
        fontWeight: '600'
      }}>
        Phase {phaseNumber}
      </div>
      
      {/* 英文标题 */}
      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'var(--text-display)',
        fontWeight: '400',
        lineHeight: 'var(--line-height-tight)',
        marginBottom: 'var(--space-lg)',
        letterSpacing: '-0.02em'
      }}>
        {titleEn}
      </h1>
      
      {/* 中文标题 */}
      <div style={{
        fontSize: 'var(--text-h3)',
        color: 'var(--color-text-muted)',
        marginBottom: 'var(--space-3xl)'
      }}>
        {titleZh}
      </div>
      
      {/* 配图区域 */}
      <div style={{ maxWidth: '600px', margin: '0 auto var(--space-3xl) auto' }}>
        <ImagePlaceholder hint={imageHint} aspectRatio="4/3" />
      </div>
      
      {/* 引导文字 */}
      <p style={{
        fontSize: 'var(--text-body-lg)',
        color: 'var(--color-text-muted)',
        lineHeight: 'var(--line-height-relaxed)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {content}
      </p>
    </motion.div>
    
    {/* 滚动提示 */}
    {showScrollHint && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{
          position: 'absolute',
          bottom: 'var(--space-3xl)',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        <div style={{ 
          fontSize: 'var(--text-xs)', 
          color: 'var(--color-text-light)', 
          letterSpacing: '2px' 
        }}>
          SCROLL TO EXPLORE
        </div>
      </motion.div>
    )}
  </section>
);

// ============================================
// 屏幕: 原则展示 (PrinciplesScreen)
// 用于展示设计原则、核心要点（如 Phase 01 的三原则）
// ============================================
export const PrinciplesScreen = ({ 
  screenNumber, 
  screenLabel, 
  title, 
  principles = [] // [{ key, title, desc }]
}) => (
  <section style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SECTION_PADDING,
    background: 'var(--color-bg-alt)'
  }}>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
      style={{ maxWidth: MAX_WIDTH_MEDIUM, width: '100%' }}
    >
      {/* 屏幕编号 */}
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-light)',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        marginBottom: 'var(--space-lg)'
      }}>
        {screenNumber} / {screenLabel}
      </div>
      
      {/* 标题 */}
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'var(--text-h1)',
        fontWeight: '400',
        marginBottom: 'var(--space-3xl)',
        lineHeight: 'var(--line-height-snug)'
      }}>
        {title}
      </h2>
      
      {/* 原则卡片网格 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(principles.length, 3)}, 1fr)`,
        gap: 'var(--space-2xl)'
      }} className="principles-grid">
        {principles.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            style={{
              padding: 'var(--space-xl)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg)'
            }}
          >
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-h2)',
              marginBottom: 'var(--space-md)',
              fontWeight: '500'
            }}>
              {item.title}
            </div>
            <p style={{
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-body)',
              lineHeight: 'var(--line-height-relaxed)',
              margin: 0
            }}>
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);

// ============================================
// 屏幕: 图文内容 (ContentScreen)
// 左右布局的图文展示，最通用的屏幕类型
// ============================================
export const ContentScreen = ({ 
  screenNumber, 
  screenLabel, 
  title, 
  content, 
  note,
  imageHint,
  imageAspect = '4/3',
  reverse = false,
  bgAlt = false
}) => (
  <section style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SECTION_PADDING,
    background: bgAlt ? 'var(--color-bg-alt)' : 'transparent'
  }}>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
      style={{
        maxWidth: MAX_WIDTH_WIDE,
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-4xl)',
        alignItems: 'center'
      }}
      className="content-grid"
    >
      {/* 文字区域 */}
      <div style={{ order: reverse ? 2 : 1 }}>
        <div style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-light)',
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
          lineHeight: 'var(--line-height-snug)'
        }}>
          {title}
        </h2>
        
        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: 'var(--text-body-lg)',
          lineHeight: 'var(--line-height-relaxed)',
          marginBottom: note ? 'var(--space-lg)' : 0
        }}>
          {content}
        </p>
        
        {/* 注释/重点 */}
        {note && (
          <div style={{
            padding: 'var(--space-md)',
            background: bgAlt ? 'var(--color-bg)' : 'var(--color-bg-alt)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-light)',
            borderLeft: '3px solid var(--color-border)'
          }}>
            {note}
          </div>
        )}
      </div>
      
      {/* 图片区域 */}
      <div style={{ order: reverse ? 1 : 2 }}>
        <ImagePlaceholder hint={imageHint} aspectRatio={imageAspect} />
      </div>
    </motion.div>
  </section>
);

// ============================================
// 屏幕: 对比展示 (ComparisonScreen)
// 用于 A/B 产品对照、前后对比等
// ============================================
export const ComparisonScreen = ({ 
  screenNumber, 
  screenLabel, 
  title, 
  content,
  note,
  leftHint = '对比项 A',
  rightHint = '对比项 B',
  leftLabel,
  rightLabel,
  bgAlt = false
}) => (
  <section style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SECTION_PADDING,
    background: bgAlt ? 'var(--color-bg-alt)' : 'transparent'
  }}>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
      style={{ maxWidth: MAX_WIDTH_WIDE, width: '100%' }}
    >
      {/* 屏幕编号 */}
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-light)',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        marginBottom: 'var(--space-lg)'
      }}>
        {screenNumber} / {screenLabel}
      </div>
      
      {/* 标题 */}
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'var(--text-h1)',
        fontWeight: '400',
        marginBottom: 'var(--space-xl)',
        lineHeight: 'var(--line-height-snug)',
        maxWidth: '700px'
      }}>
        {title}
      </h2>
      
      {/* 描述文字 */}
      <p style={{
        color: 'var(--color-text-muted)',
        fontSize: 'var(--text-body-lg)',
        lineHeight: 'var(--line-height-relaxed)',
        marginBottom: 'var(--space-3xl)',
        maxWidth: '700px'
      }}>
        {content}
      </p>
      
      {/* 对比区域 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-xl)'
      }} className="comparison-grid">
        <div>
          {leftLabel && (
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-light)',
              marginBottom: 'var(--space-md)',
              fontWeight: '500'
            }}>
              {leftLabel}
            </div>
          )}
          <ImagePlaceholder hint={leftHint} aspectRatio="4/3" />
        </div>
        <div>
          {rightLabel && (
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-light)',
              marginBottom: 'var(--space-md)',
              fontWeight: '500'
            }}>
              {rightLabel}
            </div>
          )}
          <ImagePlaceholder hint={rightHint} aspectRatio="4/3" />
        </div>
      </div>
      
      {/* 注释 */}
      {note && (
        <div style={{
          marginTop: 'var(--space-xl)',
          padding: 'var(--space-md)',
          background: bgAlt ? 'var(--color-bg)' : 'var(--color-bg-alt)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-light)',
          textAlign: 'center'
        }}>
          {note}
        </div>
      )}
    </motion.div>
  </section>
);

// ============================================
// 屏幕: 多图展示 (GalleryScreen)
// 用于展示多个相关图片/场景
// ============================================
export const GalleryScreen = ({ 
  screenNumber, 
  screenLabel, 
  title, 
  content,
  images = [], // [{ hint, label }]
  columns = 2,
  bgAlt = false
}) => (
  <section style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SECTION_PADDING,
    background: bgAlt ? 'var(--color-bg-alt)' : 'transparent'
  }}>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
      style={{ maxWidth: MAX_WIDTH_WIDE, width: '100%' }}
    >
      {/* 屏幕编号 */}
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-light)',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        marginBottom: 'var(--space-lg)'
      }}>
        {screenNumber} / {screenLabel}
      </div>
      
      {/* 标题 */}
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'var(--text-h2)',
        fontWeight: '400',
        marginBottom: 'var(--space-xl)',
        lineHeight: 'var(--line-height-snug)'
      }}>
        {title}
      </h2>
      
      {/* 描述 */}
      <p style={{
        color: 'var(--color-text-muted)',
        fontSize: 'var(--text-body-lg)',
        lineHeight: 'var(--line-height-relaxed)',
        marginBottom: 'var(--space-3xl)',
        maxWidth: '700px'
      }}>
        {content}
      </p>
      
      {/* 图片网格 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 'var(--space-lg)'
      }} className="gallery-grid">
        {images.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {img.label && (
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-light)',
                marginBottom: 'var(--space-sm)'
              }}>
                {img.label}
              </div>
            )}
            <ImagePlaceholder hint={img.hint} aspectRatio={img.aspect || '4/3'} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);

// ============================================
// 屏幕: 阶段小结 (SummaryScreen)
// 用于每个 Phase 的最后一屏
// ============================================
export const SummaryScreen = ({ 
  title, 
  content, 
  imageHint = '系统元素总览',
  nextPhase, // { id, titleZh }
  backLabel,
  nextLabel,
  onNavigate
}) => (
  <section style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SECTION_PADDING,
    background: 'var(--color-bg-alt)'
  }}>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
      style={{ maxWidth: MAX_WIDTH_NARROW, textAlign: 'center' }}
    >
      {/* 标签 */}
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-light)',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        marginBottom: 'var(--space-xl)'
      }}>
        Summary
      </div>
      
      {/* 标题 */}
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'var(--text-h1)',
        fontWeight: '400',
        marginBottom: 'var(--space-xl)',
        lineHeight: 'var(--line-height-snug)'
      }}>
        {title}
      </h2>
      
      {/* 内容 */}
      <p style={{
        color: 'var(--color-text-muted)',
        fontSize: 'var(--text-body-lg)',
        lineHeight: 'var(--line-height-relaxed)',
        marginBottom: 'var(--space-3xl)'
      }}>
        {content}
      </p>
      
      {/* 配图 */}
      <div style={{ marginBottom: 'var(--space-3xl)' }}>
        <ImagePlaceholder hint={imageHint} aspectRatio="21/9" />
      </div>
      
      {/* 导航按钮 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--space-lg)',
        flexWrap: 'wrap'
      }}>
        <Link to="/work/the-case">
          <button style={{
            padding: '14px 32px',
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            fontWeight: '500',
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-body)'
          }}>
            ← {backLabel}
          </button>
        </Link>
        
        {nextPhase && (
          <button
            onClick={() => onNavigate(`/work/the-case/${nextPhase.id}`)}
            style={{
              padding: '14px 32px',
              background: 'var(--color-text-main)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontWeight: '500',
              color: 'var(--color-bg)',
              fontSize: 'var(--text-body)'
            }}
          >
            {nextLabel}: {nextPhase.titleZh} →
          </button>
        )}
      </div>
    </motion.div>
  </section>
);

// ============================================
// 进度指示器组件
// ============================================
export const ProgressIndicator = ({ currentScreen, totalScreens }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5 }}
    style={{
      position: 'fixed',
      right: 'var(--space-xl)',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-sm)'
    }}
    className="progress-indicator"
  >
    <div style={{
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-light)',
      letterSpacing: '1px',
      writingMode: 'vertical-rl',
      textOrientation: 'mixed',
      marginBottom: 'var(--space-sm)'
    }}>
      {String(currentScreen).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}
    </div>
    
    <div style={{
      width: '2px',
      height: '60px',
      background: 'var(--color-border)',
      borderRadius: '1px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          background: 'var(--color-text-main)',
          borderRadius: '1px'
        }}
        animate={{ height: `${(currentScreen / totalScreens) * 100}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  </motion.div>
);

// ============================================
// 响应式 CSS (需要在使用组件的页面中引入)
// ============================================
export const responsiveStyles = `
  @media (max-width: 768px) {
    .content-grid {
      grid-template-columns: 1fr !important;
      gap: var(--space-2xl) !important;
    }
    .content-grid > div {
      order: unset !important;
    }
    .comparison-grid {
      grid-template-columns: 1fr !important;
    }
    .principles-grid {
      grid-template-columns: 1fr !important;
    }
    .gallery-grid {
      grid-template-columns: 1fr !important;
    }
    .progress-indicator {
      display: none !important;
    }
  }
`;

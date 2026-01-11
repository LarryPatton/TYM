import React from 'react';
import { motion } from 'framer-motion';

// ============================================
// 通用样式常量 - 统一的视觉节奏系统
// ============================================
export const SECTION_PADDING = 'var(--space-4xl) var(--space-2xl)';
export const SECTION_PADDING_MOBILE = 'var(--space-2xl) var(--space-lg)';
export const MAX_WIDTH_NARROW = '800px';
export const MAX_WIDTH_MEDIUM = '1000px';
export const MAX_WIDTH_WIDE = '1400px';

// 统一的标题间距
export const TITLE_MARGIN_BOTTOM = 'var(--space-xl)';
export const CONTENT_MARGIN_BOTTOM = 'var(--space-3xl)';
export const SCREEN_LABEL_MARGIN_BOTTOM = 'var(--space-lg)';

// 统一的屏幕标签样式
export const screenLabelStyle = {
  fontSize: 'var(--text-xs)',
  color: 'var(--color-text-light)',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  marginBottom: SCREEN_LABEL_MARGIN_BOTTOM
};

// 统一的标题样式
export const titleStyle = {
  fontFamily: 'var(--font-serif)',
  fontWeight: '400',
  lineHeight: 'var(--line-height-snug)',
  marginBottom: TITLE_MARGIN_BOTTOM
};

// 统一的内容描述样式
export const contentStyle = {
  color: 'var(--color-text-muted)',
  fontSize: 'var(--text-body-lg)',
  lineHeight: 'var(--line-height-relaxed)'
};

// ============================================
// 统一的 Section 容器动画配置
// ============================================
export const sectionVariants = {
  hidden: { 
    opacity: 0, 
    y: 60 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
      staggerChildren: 0.15
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// ============================================
// Section 分隔线组件 - 用于Section间的视觉过渡
// ============================================
export const SectionDivider = ({ 
  fromBg = 'var(--color-bg)', 
  toBg = 'var(--color-bg-alt)',
  showLine = true,
  height = '80px'
}) => (
  <div style={{
    height: height,
    background: `linear-gradient(to bottom, ${fromBg} 0%, ${toBg} 100%)`,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    {showLine && (
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        style={{
          width: '60px',
          height: '1px',
          background: 'var(--color-border)',
          transformOrigin: 'center'
        }}
      />
    )}
  </div>
);

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
// 响应式样式注入组件 (如果需要)
// ============================================
export const responsiveStyles = `
  @media (max-width: 768px) {
    .principles-grid {
      grid-template-columns: 1fr !important;
    }
    .content-screen-grid {
      grid-template-columns: 1fr !important;
      gap: var(--space-xl) !important;
    }
    .comparison-screen-grid {
      grid-template-columns: 1fr !important;
    }
    .gallery-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;

// ============================================
// 进度指示器组件
// ============================================
export const ProgressIndicator = ({ currentScreen, totalScreens }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
    style={{
      position: 'fixed',
      right: 'var(--space-lg)',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      pointerEvents: 'none' // 防止遮挡点击
    }}
  >
    {Array.from({ length: totalScreens }).map((_, index) => (
      <motion.div
        key={index}
        animate={{
          height: currentScreen === index + 1 ? '24px' : '6px',
          background: currentScreen === index + 1 ? 'var(--color-text-main)' : 'var(--color-border)',
          opacity: currentScreen === index + 1 ? 1 : 0.5
        }}
        style={{
          width: '2px',
          borderRadius: '1px',
          transition: 'all 0.3s ease'
        }}
      />
    ))}
  </motion.div>
);

// ============================================
// 通用屏幕组件 - 统一的屏幕结构
// ============================================

// 屏幕容器
export const ScreenContainer = React.forwardRef(({ children, style, ...props }, ref) => (
  <section
    ref={ref}
    style={{
      minHeight: '100vh',
      position: 'relative',
      background: 'var(--color-bg)',
      overflow: 'hidden',
      ...style
    }}
    {...props}
  >
    {children}
  </section>
));

// 屏幕编号
export const ScreenNumber = ({ children, style }) => (
  <div style={{
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-light)',
    marginBottom: 'var(--space-xs)',
    ...style
  }}>
    {children}
  </div>
);

// 屏幕标签
export const ScreenLabel = ({ children, style }) => (
  <div style={{
    ...screenLabelStyle,
    ...style
  }}>
    {children}
  </div>
);

// 屏幕标题
export const ScreenTitle = ({ children, style }) => (
  <h2 style={{
    ...titleStyle,
    fontSize: 'var(--text-display-sm)',
    ...style
  }}>
    {children}
  </h2>
);
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

// ============================================
// 通用样式常量 - 统一的视觉节奏系统
// ============================================
const SECTION_PADDING = 'var(--space-4xl) var(--space-2xl)';
const SECTION_PADDING_MOBILE = 'var(--space-2xl) var(--space-lg)';
const MAX_WIDTH_NARROW = '800px';
const MAX_WIDTH_MEDIUM = '1000px';
const MAX_WIDTH_WIDE = '1400px';

// 统一的标题间距
const TITLE_MARGIN_BOTTOM = 'var(--space-xl)';
const CONTENT_MARGIN_BOTTOM = 'var(--space-3xl)';
const SCREEN_LABEL_MARGIN_BOTTOM = 'var(--space-lg)';

// 统一的屏幕标签样式
const screenLabelStyle = {
  fontSize: 'var(--text-xs)',
  color: 'var(--color-text-light)',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  marginBottom: SCREEN_LABEL_MARGIN_BOTTOM
};

// 统一的标题样式
const titleStyle = {
  fontFamily: 'var(--font-serif)',
  fontWeight: '400',
  lineHeight: 'var(--line-height-snug)',
  marginBottom: TITLE_MARGIN_BOTTOM
};

// 统一的内容描述样式
const contentStyle = {
  color: 'var(--color-text-muted)',
  fontSize: 'var(--text-body-lg)',
  lineHeight: 'var(--line-height-relaxed)'
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
// 品牌架构图动态展示组件 (BrandIdentityScreen)
// 用于Phase 01第二屏 - 展示品牌核心架构
// 按照设计图精确复刻布局
// ============================================
export const BrandIdentityScreen = () => {
  // 品牌主色（橙色调）
  const brandColor = '#E07B4C';
  const brandColorLight = 'rgba(224, 123, 76, 0.15)';

  // 圆形节点组件
  const CircleNode = ({ children, size = 140, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "backOut" }}
      whileHover={{ scale: 1.05, boxShadow: `0 8px 30px ${brandColorLight}` }}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `2px solid ${brandColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '16px',
        cursor: 'default',
        boxSizing: 'border-box',
        flexShrink: 0
      }}
    >
      {children}
    </motion.div>
  );

  // 动画线条组件
  const AnimatedLine = ({ width, height, delay = 0, style = {} }) => (
    <motion.div
      initial={{ scaleX: width > height ? 0 : 1, scaleY: height > width ? 0 : 1, opacity: 0 }}
      whileInView={{ scaleX: 1, scaleY: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      style={{
        width,
        height,
        background: brandColor,
        transformOrigin: 'center',
        flexShrink: 0,
        ...style
      }}
    />
  );

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SECTION_PADDING,
        background: 'var(--color-bg)',
        position: 'relative'
      }}
    >
      {/* 顶部标题 */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{
          textAlign: 'center',
          marginBottom: 'var(--space-3xl)'
        }}
      >
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: '400',
          color: 'var(--color-text-main)',
          letterSpacing: '-0.02em'
        }}>
          Once again, who are we?
        </h2>
      </motion.div>

      {/* 品牌架构图 */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        maxWidth: '1000px',
        width: '100%'
      }}>
        
        {/* 第一层：标签行（核心价值 - ZMR - 品牌调性） */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end',
          width: '80%',
          marginBottom: '12px'
        }}>
          {/* 核心价值标签 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ 
              fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', 
              color: 'var(--color-text-main)',
              fontWeight: '400',
              width: '180px',
              textAlign: 'center'
            }}
          >
            核心价值
          </motion.div>
          
          {/* ZMR */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '700',
              letterSpacing: '0.15em',
              color: 'var(--color-text-main)'
            }}
          >
            ZMR
          </motion.div>
          
          {/* 品牌调性标签 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ 
              fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', 
              color: 'var(--color-text-main)',
              fontWeight: '400',
              width: '180px',
              textAlign: 'center'
            }}
          >
            品牌调性
          </motion.div>
        </div>

        {/* 第二层：顶部水平连接线 + 三条垂直线起点 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '80%',
          position: 'relative'
        }}>
          {/* 水平线背景 */}
          <AnimatedLine 
            width="100%" 
            height="2px" 
            delay={0.3} 
            style={{ position: 'absolute', top: 0, left: 0 }} 
          />
          
          {/* 左侧垂直线 + 核心价值圆 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '180px' }}>
            <AnimatedLine width="2px" height="40px" delay={0.4} />
            <CircleNode size={160} delay={0.5}>
              <div style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)', lineHeight: 1.9 }}>
                <div><span style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>自由</span> <span style={{ color: 'var(--color-text-muted)' }}>freedom</span></div>
                <div><span style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>热爱</span> <span style={{ color: 'var(--color-text-muted)' }}>passion</span></div>
                <div><span style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>真诚</span> <span style={{ color: 'var(--color-text-muted)' }}>truthful</span></div>
              </div>
            </CircleNode>
          </div>

          {/* 中间垂直线 + 品牌人格标签 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AnimatedLine width="2px" height="140px" delay={0.5} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{
                fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                color: 'var(--color-text-main)',
                fontWeight: '400',
                marginTop: '12px',
                marginBottom: '12px'
              }}
            >
              品牌人格
            </motion.div>
            <AnimatedLine width="2px" height="30px" delay={0.65} />
          </div>

          {/* 右侧垂直线 + 品牌调性圆 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '180px' }}>
            <AnimatedLine width="2px" height="40px" delay={0.4} />
            <CircleNode size={160} delay={0.6}>
              <div style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)', lineHeight: 1.9 }}>
                <div><span style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>友好</span> <span style={{ color: 'var(--color-text-muted)' }}>friendly</span></div>
                <div><span style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>好玩</span> <span style={{ color: 'var(--color-text-muted)' }}>fun/playful</span></div>
                <div><span style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>大胆</span> <span style={{ color: 'var(--color-text-muted)' }}>bold</span></div>
              </div>
            </CircleNode>
          </div>
        </div>

        {/* 第三层：品牌人格下方的水平线 + 三个人格节点 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '65%',
          position: 'relative'
        }}>
          {/* 水平线 */}
          <AnimatedLine 
            width="100%" 
            height="2px" 
            delay={0.7} 
            style={{ position: 'absolute', top: 0, left: 0 }} 
          />
          
          {/* 情人 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AnimatedLine width="2px" height="40px" delay={0.8} />
            <CircleNode size={100} delay={0.9}>
              <div style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', fontWeight: '500' }}>情人</div>
            </CircleNode>
          </div>

          {/* 探险家 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AnimatedLine width="2px" height="40px" delay={0.85} />
            <CircleNode size={100} delay={0.95}>
              <div style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', fontWeight: '500' }}>探险家</div>
            </CircleNode>
          </div>

          {/* 创造者 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AnimatedLine width="2px" height="40px" delay={0.9} />
            <CircleNode size={100} delay={1.0}>
              <div style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', fontWeight: '500' }}>创造者</div>
            </CircleNode>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// 统一的 Section 容器动画配置
// ============================================
const sectionVariants = {
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

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

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
// 用于每个 Phase 的第一屏 - 方案 C: 配图背景化
// ============================================
export const IntroScreen = ({ 
  phaseNumber, 
  titleEn, 
  titleZh, 
  content, 
  imageHint = '极简视觉：品牌标志展示',
  bgImage = null,
  showScrollHint = true 
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Parallax effect: Background moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} style={{
      height: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff' // Force white text for contrast against dark overlay
    }}>
      {/* 1. Full Screen Background Image with Parallax */}
      <motion.div style={{
        position: 'absolute',
        inset: 0,
        y,
        zIndex: 0
      }}>
        <div style={{
          width: '100%',
          height: '120%', // Taller than container to allow parallax movement without gaps
          background: bgImage 
            ? `url(${import.meta.env.BASE_URL}${bgImage.replace(/^\//, '')}) center center / cover no-repeat` 
            : 'var(--color-bg-alt)',
          position: 'absolute',
          top: 0,
          left: 0
        }} />
        {!bgImage && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 'var(--text-sm)'
          }}>
            [ {imageHint} ]
          </div>
        )}
      </motion.div>

      {/* 2. Dark Overlay & Top Gradient - REMOVED completely as per user request */}
      
      {/* 3. Gradient Overlay - REMOVED completely */}

      {/* 4. Main Content - Moved to Top & Compacted */}
      <motion.div 
        style={{ 
          zIndex: 2, 
          textAlign: 'center', 
          maxWidth: '1000px',
          padding: '0 var(--space-xl)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start', // Align to top
          paddingTop: '12vh', // Reduced top padding to move text higher
          y: textY,
          opacity
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Phase Label */}
          <div style={{
            fontSize: 'var(--text-sm)',
            textTransform: 'uppercase',
            letterSpacing: '8px',
            marginBottom: 'var(--space-md)', // Reduced margin
            opacity: 0.9,
            fontWeight: '600',
            color: 'var(--color-accent, #fff)'
          }}>
            Phase {phaseNumber}
          </div>

          {/* English Title */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(3.5rem, 12vw, 7rem)',
            fontWeight: '400',
            lineHeight: 1.05,
            marginBottom: 'var(--space-sm)', // Reduced margin
            letterSpacing: '-0.04em',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)'
          }}>
            {titleEn}
          </h1>

          {/* Chinese Title */}
          <div style={{
            fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
            opacity: 0.95,
            marginBottom: 'var(--space-xl)', // Reduced margin
            fontWeight: '300',
            letterSpacing: '0.1em'
          }}>
            {titleZh}
          </div>

          {/* Description */}
          <p style={{
            fontSize: 'clamp(1.1rem, 1.8vw, 1.3rem)',
            lineHeight: 1.6,
            maxWidth: '700px',
            margin: '0 auto',
            opacity: 0.9,
            textShadow: '0 2px 15px rgba(0,0,0,0.5)',
            fontWeight: '300'
          }}>
            {content}
          </p>
        </motion.div>
      </motion.div>

      {/* 5. Scroll Hint */}
      {showScrollHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{
            position: 'absolute',
            bottom: 'var(--space-3xl)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            color: '#fff',
            opacity: 0.8
          }}
        >
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ 
              fontSize: 'var(--text-xs)', 
              letterSpacing: '4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <span style={{ fontWeight: 500 }}>SCROLL</span>
            <div style={{ 
              width: '1px', 
              height: '40px', 
              background: 'linear-gradient(to bottom, #fff, transparent)' 
            }} />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }} // 增加延迟，形成阶梯效果
            viewport={{ once: true }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }} // 添加悬停上浮效果
            style={{
              padding: 'var(--space-xl)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            {/* 原则图标区域 - 使用不同的图片和样式区分 */}
            <div style={{
                aspectRatio: '16/10',
                marginBottom: 'var(--space-lg)',
                background: index === 0 
                  ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' 
                  : index === 1 
                    ? 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)'
                    : 'linear-gradient(135deg, #dee2e6 0%, #ced4da 100%)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                 <img 
                    src={`${import.meta.env.BASE_URL}images/Phase 01 — Brand Identity 0–1/02/image ${index === 0 ? '1' : '6'}.png`}
                    alt={item.title}
                    style={{ 
                      width: '70%', 
                      height: '70%', 
                      objectFit: 'contain',
                      filter: index === 1 ? 'hue-rotate(30deg)' : index === 2 ? 'hue-rotate(60deg)' : 'none',
                      transform: index === 1 ? 'scale(0.9)' : index === 2 ? 'scale(0.85) rotate(3deg)' : 'scale(1)'
                    }}
                    onError={(e) => e.target.style.display = 'none'} 
                 />
                 {/* 序号标识 */}
                 <div style={{
                   position: 'absolute',
                   top: '16px',
                   right: '16px',
                   fontSize: 'var(--text-xs)',
                   color: 'var(--color-text-light)',
                   fontWeight: '600',
                   letterSpacing: '1px'
                 }}>
                   0{index + 1}
                 </div>
            </div>

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
// 屏幕: Logo 横向滚动展示 (LogoScrollScreen)
// 专门用于 Phase 01 的 Logo 展示
// ============================================
export const LogoScrollScreen = ({
  screenNumber,
  screenLabel,
  title,
  content
}) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  // Logo 图片列表 (硬编码路径，因为这是特定组件)
  const logoImages = [
    '03/image 2.png',
    '03/image 3.png',
    '03/image 4.png',
    '03/image 5.png',
    '03/image 13.png',
    '03/image 14.png'
  ];

  return (
    <section ref={targetRef} style={{
      height: '300vh', // 增加高度以提供足够的滚动空间
      position: 'relative'
    }}>
      {/* 顶部渐变过渡层 - 从上一个section的bg-alt过渡到当前bg */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '120px',
        background: 'linear-gradient(to bottom, var(--color-bg-alt) 0%, var(--color-bg) 100%)',
        zIndex: 5,
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--color-bg)'
      }}>
        {/* 标题区域 */}
        <div style={{
          padding: '0 var(--space-2xl)',
          marginBottom: 'var(--space-xl)',
          maxWidth: MAX_WIDTH_WIDE,
          margin: '0 auto',
          width: '100%',
          zIndex: 10
        }}>
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
            lineHeight: 'var(--line-height-snug)'
          }}>
            {title}
          </h2>
        </div>

        {/* 横向滚动区域 */}
        <motion.div style={{ x, display: 'flex', gap: 'var(--space-2xl)', paddingLeft: 'var(--space-2xl)' }}>
          {logoImages.map((imgSrc, index) => (
            <div key={index} style={{
              minWidth: '75vw', // Increased from 60vw
              height: '70vh',   // Increased from 60vh
              background: 'var(--color-bg-alt)', // Ensure this provides contrast in dark mode
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
               {/* Add a white container for logos if they are black transparent PNGs */}
               <div style={{
                 width: '100%',
                 height: '100%',
                 padding: '60px',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 background: 'var(--color-card-bg, rgba(255,255,255,0.05))' // Use a variable or subtle background
               }}>
                 <img 
                    src={`${import.meta.env.BASE_URL}images/Phase 01 — Brand Identity 0–1/${imgSrc}`}
                    alt={`Logo Variation ${index + 1}`}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain',
                      filter: 'var(--image-filter, none)' // Allow dark mode to invert if needed, or keep as is
                    }}
                    onError={(e) => e.target.style.display = 'none'}
                 />
               </div>
               <div style={{
                 position: 'absolute',
                 bottom: '30px',
                 left: '30px',
                 fontSize: 'var(--text-sm)',
                 color: 'var(--color-text-muted)'
               }}>
                 Variation {String(index + 1).padStart(2, '0')}
               </div>
            </div>
          ))}
        </motion.div>
        
        {/* 左右渐变遮罩 - 增强视觉引导 */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '80px',
          background: 'linear-gradient(to right, var(--color-bg) 0%, transparent 100%)',
          zIndex: 8,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '120px',
          background: 'linear-gradient(to left, var(--color-bg) 0%, transparent 100%)',
          zIndex: 8,
          pointerEvents: 'none'
        }} />
      </div>
      
      {/* 底部渐变过渡层 - 从当前bg过渡到下一个section的bg-alt */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '120px',
        background: 'linear-gradient(to top, var(--color-bg-alt) 0%, var(--color-bg) 100%)',
        zIndex: 5,
        pointerEvents: 'none'
      }} />
    </section>
  );
};

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
  bgAlt = false
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
          src={`${import.meta.env.BASE_URL}images/Phase 01 — Brand Identity 0–1/04/image 7.png`}
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
          src={`${import.meta.env.BASE_URL}images/Phase 01 — Brand Identity 0–1/04/image 8.png`}
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
            src={`${import.meta.env.BASE_URL}images/Phase 01 — Brand Identity 0–1/04/image 9.png`}
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
            src={`${import.meta.env.BASE_URL}images/Phase 01 — Brand Identity 0–1/04/image 10.png`}
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
            src={`${import.meta.env.BASE_URL}images/Phase 01 — Brand Identity 0–1/05/image ${num}.png`}
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
            background: 'rgba(255,255,255,0.8)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)'
          }}>
            {index === 0 ? 'Heading' : 'Body Text'}
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
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
          gridTemplateColumns: reverse ? '1.5fr 1fr' : '1fr 1.5fr', // Changed ratio: Image gets 1.5x space
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
          {phaseId === 'phase-01' && id === 'color' ? renderColorImages() :
           phaseId === 'phase-01' && id === 'typography' ? renderTypographyImages() :
           <ImagePlaceholder hint={imageHint} aspectRatio={imageAspect} />
          }
        </div>
      </motion.div>
    </section>
  );
};

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
  id,
  phaseId,
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
            {/* Phase 01 Validation Custom Logic */}
            {phaseId === 'phase-01' && id === 'validation' ? (
               <div style={{ aspectRatio: '4/3', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
                 <img 
                    src={`${import.meta.env.BASE_URL}images/Phase 01 — Brand Identity 0–1/06/image ${154 + index}.png`}
                    alt={img.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => e.target.style.display = 'none'}
                 />
               </div>
            ) : (
               <ImagePlaceholder hint={img.hint} aspectRatio={img.aspect || '4/3'} />
            )}
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
  id,
  phaseId,
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
      
      {/* 配图 - 重新设计的品牌系统总览 */}
      <div style={{ marginBottom: 'var(--space-3xl)' }}>
        {phaseId === 'phase-01' && id === 'summary' ? (
           <div style={{ 
             display: 'grid',
             gridTemplateColumns: 'repeat(4, 1fr)',
             gridTemplateRows: 'repeat(2, auto)',
             gap: 'var(--space-lg)',
             maxWidth: '700px',
             margin: '0 auto'
           }}>
             {/* 主元素 - 占据左侧2列2行 */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.5 }}
               whileHover={{ scale: 1.02, boxShadow: 'var(--shadow-lg)' }}
               style={{ 
                 gridColumn: '1 / 3',
                 gridRow: '1 / 3',
                 aspectRatio: '1/1',
                 background: 'linear-gradient(135deg, var(--color-bg) 0%, #f8f9fa 100%)', 
                 borderRadius: 'var(--radius-lg)',
                 overflow: 'hidden',
                 boxShadow: 'var(--shadow-md)',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 position: 'relative'
               }}
             >
               <img 
                  src={`${import.meta.env.BASE_URL}images/Phase 01 — Brand Identity 0–1/07/Group 664.png`}
                  alt="Brand Logo"
                  style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                  onError={(e) => e.target.style.display = 'none'}
               />
               <div style={{
                 position: 'absolute',
                 bottom: '16px',
                 left: '16px',
                 fontSize: 'var(--text-xs)',
                 color: 'var(--color-text-light)',
                 textTransform: 'uppercase',
                 letterSpacing: '1px'
               }}>
                 Logo
               </div>
             </motion.div>
             
             {/* 右侧4个小元素 */}
             {['Group 665', 'Group 666', 'Group 667', 'Group 668'].map((name, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                 whileHover={{ y: -5, boxShadow: 'var(--shadow-md)' }}
                 style={{ 
                   aspectRatio: '1/1',
                   background: 'var(--color-bg)', 
                   borderRadius: 'var(--radius-md)',
                   overflow: 'hidden',
                   boxShadow: 'var(--shadow-sm)',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center'
                 }}
               >
                 <img 
                    src={`${import.meta.env.BASE_URL}images/Phase 01 — Brand Identity 0–1/07/${name}.png`}
                    alt="Brand Element"
                    style={{ width: '75%', height: '75%', objectFit: 'contain' }}
                    onError={(e) => e.target.style.display = 'none'}
                 />
               </motion.div>
             ))}
             
             {/* 底部长条元素 - 横跨后两列 */}
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5, delay: 0.4 }}
               whileHover={{ scale: 1.02 }}
               style={{ 
                 gridColumn: '3 / 5',
                 aspectRatio: '2/1',
                 background: 'linear-gradient(90deg, var(--color-bg) 0%, #f0f0f0 100%)', 
                 borderRadius: 'var(--radius-md)',
                 overflow: 'hidden',
                 boxShadow: 'var(--shadow-sm)',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: 'var(--space-md)',
                 padding: 'var(--space-md)'
               }}
             >
               <img 
                  src={`${import.meta.env.BASE_URL}images/Phase 01 — Brand Identity 0–1/07/Group 669.png`}
                  alt="Color Palette"
                  style={{ height: '60%', objectFit: 'contain' }}
                  onError={(e) => e.target.style.display = 'none'}
               />
               <img 
                  src={`${import.meta.env.BASE_URL}images/Phase 01 — Brand Identity 0–1/07/image 157.png`}
                  alt="Typography"
                  style={{ height: '60%', objectFit: 'contain' }}
                  onError={(e) => e.target.style.display = 'none'}
               />
             </motion.div>
           </div>
        ) : (
           <ImagePlaceholder hint={imageHint} aspectRatio="21/9" />
        )}
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
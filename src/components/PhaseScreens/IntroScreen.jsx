import React, { useRef, useContext } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { useScreenTransition } from './TransitionContext';
import FlashlightMask from './FlashlightMask';

// ============================================
// 屏幕 01: 阶阶段引导页 (IntroScreen)
// 优化版：幕布揭示效果 (Curtain Reveal) + 手电筒探索效果
// 初始只能看到黑色背景和文字，鼠标可探索底层图片
// 随着滚动，黑色幕布向上拉起，揭示底部的背景图
// ============================================
export const IntroScreen = ({ 
  phaseNumber, 
  titleEn, 
  titleZh, 
  content, 
  imageHint = '极简视觉：品牌标志展示',
  bgImage = null,
  showScrollHint = true,
  enableFlashlight = true, // 是否启用手电筒效果
  spotlightSize = 280, // 光圈直径
  featherSize = 120 // 羽化边缘宽度
}) => {
  const ref = useRef(null);
  
  // ============================================
  // 【滚动监听配置】
  // ============================================
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });
  
  // ============================================
  // 【动效参数】
  // ============================================
  
  // 1. 幕布 (前景黑层) 揭示动画
  // clipPath 从底部开始向上裁切: inset(0 0 0 0) -> inset(0 0 100% 0)
  // 0% - 60% 滚动区间完成揭示，60%-80% 停顿展示背景图
  const curtainClip = useTransform(scrollYProgress, [0, 0.6], ['inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)']);
  
  // 2. 文字跟随动画
  // 文字稍微向上移动一点，产生视差，并在快结束时淡出
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // 3. 背景图视差 (可选)
  // 背景图稍微放大一点，增加深邃感
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);

  // 4. 整体淡出过渡（解决第一屏到第二屏的突变问题）
  // 优化：提前开始淡出，70%-90% 完成淡出，预留 10% 缓冲与第二屏衔接
  const sectionOpacity = useTransform(scrollYProgress, [0.7, 0.9], [1, 0]);

  // 构建完整的背景图 URL
  const fullBgImageUrl = bgImage 
    ? `${import.meta.env.BASE_URL}${bgImage.replace(/^\//, '')}`
    : null;

  // 文字内容组件（复用）
  const TextContent = () => (
    <motion.div 
      style={{ 
        textAlign: 'center', 
        maxWidth: '1000px',
        padding: '0 var(--space-xl)',
        width: '100%',
        y: textY,
        opacity: textOpacity
      }}
    >
      {/* Phase Label */}
      <div style={{
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        letterSpacing: '4px',
        marginBottom: '24px',
        color: '#fff',
        opacity: 0.5,
        fontWeight: '500',
        fontFamily: 'var(--font-sans)'
      }}>
        Phase {phaseNumber}
      </div>

      {/* English Title */}
      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(3.5rem, 8vw, 6rem)',
        fontWeight: '400',
        lineHeight: 1.1,
        marginBottom: '16px',
        letterSpacing: '-0.02em',
        color: '#fff'
      }}>
        {titleEn}
      </h1>

      {/* Chinese Title */}
      <div style={{
        fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
        color: '#fff',
        opacity: 0.9,
        marginBottom: '48px',
        fontWeight: '300',
        letterSpacing: '0.2em',
        fontFamily: 'var(--font-sans)'
      }}>
        {titleZh}
      </div>

      <div style={{
        width: '1px',
        height: '40px',
        background: 'rgba(255,255,255,0.3)',
        margin: '0 auto 40px auto'
      }} />

      <p style={{
        fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
        lineHeight: 1.8,
        maxWidth: '640px',
        margin: '0 auto',
        color: '#fff',
        opacity: 0.8,
        fontWeight: '300',
        fontFamily: 'var(--font-sans)'
      }}>
        {content}
      </p>
    </motion.div>
  );

  // 滚动提示组件（复用）
  const ScrollHint = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#fff',
        opacity: textOpacity
      }}
    >
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ 
          fontSize: '0.75rem', 
          letterSpacing: '3px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          textTransform: 'uppercase'
        }}
      >
        <span>Scroll to Reveal</span>
        <div style={{ 
          width: '1px', 
          height: '24px', 
          background: 'linear-gradient(to bottom, #fff, transparent)' 
        }} />
      </motion.div>
    </motion.div>
  );

  return (
    <section ref={ref} style={{
      height: '250vh', // 足够的滚动行程
      width: '100%',
      position: 'relative',
      background: '#000'
    }}>
      {/* Sticky 容器 - 使用 motion.div 实现淡出过渡 */}
      <motion.div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: sectionOpacity // 滚动末段淡出，平滑过渡到第二屏
      }}>
        
        {/* Layer 1: 底层背景图 (被揭示对象) */}
        <motion.div 
          style={{
            position: 'absolute',
            inset: 0,
            scale: bgScale,
            zIndex: 0
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: bgImage 
              ? `url(${fullBgImageUrl}) center center / contain no-repeat` 
              : 'var(--color-bg-alt)',
            backgroundColor: '#000', // 图片周围填充纯黑背景
            filter: 'brightness(0.9)' // 稍微压暗一点点，保证质感
          }} />
          
          {/* 底部渐变，保证背景图底部衔接自然 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30vh',
            background: 'linear-gradient(to bottom, transparent, #000)',
            zIndex: 1
          }} />
        </motion.div>

        {/* Layer 2: 顶层幕布 (纯黑背景 + 文字) - 根据配置决定是否使用手电筒效果 */}
        {enableFlashlight && fullBgImageUrl ? (
          // 使用手电筒效果的幕布层
          <motion.div 
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              clipPath: curtainClip // 关键：通过裁切实现从下往上揭示
            }}
          >
            <FlashlightMask
              revealImage={fullBgImageUrl}
              spotlightSize={spotlightSize}
              featherSize={featherSize}
              scrollProgress={scrollYProgress}
              backgroundColor="#000"
            >
              {/* 文字内容容器 */}
              <TextContent />

              {/* 滚动提示 */}
              {showScrollHint && <ScrollHint />}
            </FlashlightMask>
          </motion.div>
        ) : (
          // 不使用手电筒效果的原始幕布层
          <motion.div 
            style={{
              position: 'absolute',
              inset: 0,
              background: '#000',
              zIndex: 10,
              clipPath: curtainClip,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* 文字内容容器 */}
            <TextContent />

            {/* 滚动提示 */}
            {showScrollHint && <ScrollHint />}
          </motion.div>
        )}

      </motion.div>
    </section>
  );
};
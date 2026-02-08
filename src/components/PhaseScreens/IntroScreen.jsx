import React, { useRef, useState, useEffect, useMemo, memo } from 'react';
import { useLenis } from '../../contexts/LenisContext';
import FlashlightMask from './FlashlightMask';
import ScrollIndicator from '../ScrollIndicator';

// 调试开关
const DEBUG = false;

// ============================================
// 屏幕 01: 阶阶段引导页 (IntroScreen)
// 优化版：使用纯 CSS 动画替代 framer-motion useScroll/useTransform
// 
// 优化策略：
// 1. 使用 IntersectionObserver + scroll 事件替代 useScroll
// 2. 使用 CSS transition 替代 framer-motion 动画
// 3. 使用 requestAnimationFrame 节流滚动事件
// 4. 使用 React.memo 优化子组件
// ============================================
export const IntroScreen = memo(({
  phaseNumber, 
  titleEn, 
  titleZh, 
  content, 
  imageHint = '极简视觉：品牌标志展示',
  bgImage = null,
  showScrollHint = true,
  enableFlashlight = true,
  spotlightSize = 280,
  featherSize = 120
}) => {
  const ref = useRef(null);
  const rafRef = useRef(null);
  const scrollProgressRef = useRef(0);
  
  // 移动端检测
  const [isMobile, setIsMobile] = useState(false);
  // 滚动进度状态（只在关键节点更新）
  const [scrollState, setScrollState] = useState({
    curtainProgress: 0,    // 0-1，幕布揭示进度
    textOpacity: 1,        // 文字透明度
    textY: 0,              // 文字 Y 偏移
    bgScale: 1.05,         // 背景缩放
    sectionOpacity: 1      // 整体透明度
  });
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 移动端自动禁用手电筒效果
  const shouldEnableFlashlight = enableFlashlight && !isMobile;
  
  // 获取 Lenis 实例
  const { lenis, isReady: lenisReady } = useLenis();
  
  // 滚动监听 - 使用 Lenis 事件
  useEffect(() => {
    if (!ref.current || !lenisReady || !lenis) return;
    
    const container = ref.current;
    
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const containerTop = rect.top;
      const containerHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // 计算滚动进度（0-1）
      const scrolled = -containerTop;
      const totalScrollable = containerHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      
      // 只有进度变化超过阈值时才更新状态
      if (Math.abs(progress - scrollProgressRef.current) > 0.01) {
        scrollProgressRef.current = progress;
        
        // 计算各个动画值
        const curtainProgress = Math.min(1, progress / 0.6);
        const textOpacity = Math.max(0, 1 - progress / 0.5);
        const textY = -100 * Math.min(1, progress / 0.6);
        const bgScale = 1.05 - 0.05 * progress;
        const sectionOpacity = progress < 0.7 ? 1 : Math.max(0, 1 - (progress - 0.7) / 0.2);
        
        setScrollState({
          curtainProgress,
          textOpacity,
          textY,
          bgScale,
          sectionOpacity
        });
        
        if (DEBUG) {
          console.log('[IntroScreen] Progress:', progress.toFixed(2));
        }
      }
    };
    
    // 使用 Lenis 的 scroll 事件
    lenis.on('scroll', handleScroll);
    handleScroll(); // 初始调用
    
    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenisReady, lenis]);

  // 构建完整的背景图 URL
  const fullBgImageUrl = useMemo(() => {
    if (!bgImage) return null;
    return `${import.meta.env.BASE_URL}${bgImage.replace(/^\//, '')}`.replace(/ /g, '%20');
  }, [bgImage]);
  
  // 计算 clipPath
  const curtainClipPath = `inset(0% 0% ${scrollState.curtainProgress * 100}% 0%)`;

  return (
    <section ref={ref} style={{
      height: isMobile ? '150vh' : '250vh',
      width: '100%',
      position: 'relative',
      background: '#000'
    }}>
      {/* Sticky 容器 */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: scrollState.sectionOpacity,
        transition: 'opacity 0.1s ease-out'
      }}>
        
        {/* Layer 1: 底层背景图 */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            transform: `scale(${scrollState.bgScale})`,
            transition: 'transform 0.1s ease-out',
            zIndex: 0
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: bgImage 
              ? `url(${fullBgImageUrl}) center center / cover no-repeat` 
              : 'var(--color-bg-alt)',
            backgroundColor: '#000',
            filter: 'brightness(0.9)'
          }} />
          
          {/* 底部渐变 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30vh',
            background: 'linear-gradient(to bottom, transparent, #000)',
            zIndex: 1
          }} />
        </div>

        {/* Layer 2: 顶层幕布 */}
        {shouldEnableFlashlight && fullBgImageUrl ? (
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              clipPath: curtainClipPath
            }}
          >
            <FlashlightMask
              revealImage={fullBgImageUrl}
              spotlightSize={spotlightSize}
              featherSize={featherSize}
              scrollProgress={scrollState.curtainProgress}
              backgroundColor="#000"
            >
              <TextContent 
                phaseNumber={phaseNumber}
                titleEn={titleEn}
                titleZh={titleZh}
                content={content}
                textY={scrollState.textY}
                textOpacity={scrollState.textOpacity}
              />
              {showScrollHint && <ScrollHint />}
            </FlashlightMask>
          </div>
        ) : (
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: '#000',
              zIndex: 10,
              clipPath: curtainClipPath,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <TextContent 
              phaseNumber={phaseNumber}
              titleEn={titleEn}
              titleZh={titleZh}
              content={content}
              textY={scrollState.textY}
              textOpacity={scrollState.textOpacity}
            />
            {showScrollHint && <ScrollHint />}
          </div>
        )}

      </div>
    </section>
  );
});

IntroScreen.displayName = 'IntroScreen';

/**
 * 文字内容组件
 */
const TextContent = memo(({ phaseNumber, titleEn, titleZh, content, textY, textOpacity }) => (
  <div 
    style={{ 
      textAlign: 'center', 
      maxWidth: '1000px',
      padding: '0 var(--space-xl)',
      width: '100%',
      transform: `translateY(${textY}px)`,
      opacity: textOpacity,
      transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
    }}
  >
    {/* Phase Label - 带截断线样式 */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '40px',
    }}>
      <div style={{
        width: '60px',
        height: '1px',
        background: 'rgba(255,255,255,0.3)',
      }} />
      <span style={{
        fontSize: '0.9rem',
        letterSpacing: '0.3em',
        color: '#fff',
        opacity: 0.6,
        fontWeight: '500',
        fontFamily: 'var(--font-sans)',
      }}>
        阶段 {phaseNumber}
      </span>
      <div style={{
        width: '60px',
        height: '1px',
        background: 'rgba(255,255,255,0.3)',
      }} />
    </div>

    {/* Chinese Title - 作为主标题 */}
    <h1 style={{
      fontFamily: 'var(--font-serif)',
      fontSize: 'clamp(2.8rem, 7vw, 5rem)',
      fontWeight: '400',
      lineHeight: 1.2,
      marginBottom: '48px',
      letterSpacing: '0.1em',
      color: '#fff'
    }}>
      {titleZh}
    </h1>

    <div style={{
      width: '1px',
      height: '48px',
      background: 'rgba(255,255,255,0.3)',
      margin: '0 auto 48px auto'
    }} />

    <p style={{
      fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
      lineHeight: 1.9,
      maxWidth: '680px',
      margin: '0 auto',
      color: '#fff',
      opacity: 0.75,
      fontWeight: '300',
      fontFamily: 'var(--font-sans)',
      letterSpacing: '0.02em'
    }}>
      {content}
    </p>
  </div>
));

TextContent.displayName = 'TextContent';

/**
 * 滚动提示组件
 */
const ScrollHint = memo(() => (
  <ScrollIndicator
    variant="reveal"
    position="bottom-center"
    color="#fff"
    layout="vertical"
    style={{
      bottom: '40px',
    }}
  />
));

ScrollHint.displayName = 'ScrollHint';

export default IntroScreen;
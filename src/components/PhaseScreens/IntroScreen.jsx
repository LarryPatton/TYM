import React, { useRef, useState, useEffect, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from '../../contexts/LenisContext';
import FlashlightMask from './FlashlightMask';
import ScrollIndicator from '../ScrollIndicator';

// 调试开关
const DEBUG = false;

// ============================================
// 屏幕 01: 阶阶段引导页 (IntroScreen)
// 优化版：使用纯 CSS 动画替代 framer-motion useScroll/useTransform
// 
// 三段式序列动画：
// 1. typing    - 打字机动画进行中，手电筒隐藏，滚动锁定
// 2. flashlight - 手电筒淡入展示，滚动锁定，1.2s 后进入下一阶段
// 3. scrollable - 滚动解锁，ScrollHint 淡入，用户自由交互
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
  featherSize = 120,
  flashlightInitialPosition = null // 初始光圈位置 { x: 0-1, y: 0-1 }
}) => {
  const ref = useRef(null);
  const rafRef = useRef(null);
  const scrollProgressRef = useRef(0);
  
  // 移动端检测
  const [isMobile, setIsMobile] = useState(false);
  
  // ====== 三段式序列动画状态机 ======
  // 'typing'     → 打字机动画中，手电筒隐藏，滚动锁定
  // 'flashlight' → 手电筒淡入展示中，滚动锁定
  // 'scrollable' → 滚动解锁，完全可交互
  const [introPhase, setIntroPhase] = useState('typing');
  const flashlightTimerRef = useRef(null);
  
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
  
  // ====== 阶段转换：typing → flashlight ======
  const handleTypingComplete = useCallback(() => {
    if (shouldEnableFlashlight) {
      // 桌面端有手电筒：进入 flashlight 阶段
      setIntroPhase('flashlight');
    } else {
      // 移动端无手电筒：延迟 1.2s 后直接进入 scrollable
      flashlightTimerRef.current = setTimeout(() => {
        setIntroPhase('scrollable');
      }, 1200);
    }
  }, [shouldEnableFlashlight]);
  
  // ====== 阶段转换：flashlight → scrollable（1.2s 延迟）======
  useEffect(() => {
    if (introPhase === 'flashlight') {
      flashlightTimerRef.current = setTimeout(() => {
        setIntroPhase('scrollable');
      }, 1200);
    }
    return () => {
      if (flashlightTimerRef.current) {
        clearTimeout(flashlightTimerRef.current);
      }
    };
  }, [introPhase]);
  
  // ====== Lenis 滚动锁定/解锁 ======
  useEffect(() => {
    if (!lenis || !lenisReady) return;
    
    if (introPhase === 'scrollable') {
      lenis.start();
      if (DEBUG) console.log('[IntroScreen] Lenis unlocked (scrollable)');
    } else {
      lenis.stop();
      if (DEBUG) console.log('[IntroScreen] Lenis locked (', introPhase, ')');
    }
    
    // 组件卸载时确保解锁滚动
    return () => {
      lenis.start();
    };
  }, [introPhase, lenis, lenisReady]);
  
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
  
  // 手电筒层是否可见（typing 阶段隐藏）
  const flashlightVisible = introPhase !== 'typing';
  
  // ScrollHint 是否可见（仅 scrollable 阶段显示）
  const scrollHintVisible = introPhase === 'scrollable';

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
              initialPosition={flashlightInitialPosition}
              visible={flashlightVisible}
            >
              <TextContent 
                phaseNumber={phaseNumber}
                titleEn={titleEn}
                titleZh={titleZh}
                content={content}
                textY={scrollState.textY}
                textOpacity={scrollState.textOpacity}
                onComplete={handleTypingComplete}
              />
              {showScrollHint && <ScrollHint visible={scrollHintVisible} />}
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
              onComplete={handleTypingComplete}
            />
            {showScrollHint && <ScrollHint visible={scrollHintVisible} />}
          </div>
        )}

      </div>
    </section>
  );
});

IntroScreen.displayName = 'IntroScreen';

/**
 * 文字内容组件 - 带打字动画效果（参考 AboutTypewriter 实现）
 * 使用 substring 逐字显示 + framer-motion 闪烁光标
 * 排版层次：主题(阶段标签) → 标题 → 副标题 → 内容
 * @param {Function} onComplete - 所有打字动画完成后的回调
 */
const TextContent = memo(({ phaseNumber, titleEn, titleZh, content, textY, textOpacity, onComplete }) => {
  // 各行打字索引
  const [themeIndex, setThemeIndex] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [contentIndex, setContentIndex] = useState(0);
  
  // 当前打字阶段：'idle' → 'theme' → 'title' → 'subtitle' → 'content' → 'done'
  const [phase, setPhase] = useState('idle');
  
  // 解析标题：如果包含冒号，分为标题和副标题
  const parseTitle = (title) => {
    if (!title) return { mainTitle: '', subtitle: '' };
    const colonMatch = title.match(/[:：]/);
    if (colonMatch) {
      const colonIndex = title.indexOf(colonMatch[0]);
      return {
        mainTitle: title.substring(0, colonIndex).trim(),
        subtitle: title.substring(colonIndex + 1).trim()
      };
    }
    return { mainTitle: title, subtitle: '' };
  };
  
  const { mainTitle, subtitle } = parseTitle(titleZh);
  const theme = `阶段 ${phaseNumber}`;
  const contentText = content || '';
  
  // 打字速度配置（毫秒）
  const TYPING_SPEED = {
    theme: 60,         // 阶段标签
    title: 80,         // 主标题稍慢，更有仪式感
    subtitle: 50,      // 副标题
    content: 25,       // 内容快速打出
    pauseBetween: 300,  // 段落间停顿
  };
  
  // 初始延迟后开始打字
  useEffect(() => {
    const timer = setTimeout(() => setPhase('theme'), 500);
    return () => clearTimeout(timer);
  }, []);
  
  // 阶段标签打字
  useEffect(() => {
    if (phase !== 'theme') return;
    if (themeIndex < theme.length) {
      const timer = setTimeout(() => setThemeIndex(themeIndex + 1), TYPING_SPEED.theme);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase('title'), TYPING_SPEED.pauseBetween);
      return () => clearTimeout(timer);
    }
  }, [themeIndex, theme, phase]);
  
  // 主标题打字
  useEffect(() => {
    if (phase !== 'title') return;
    if (titleIndex < mainTitle.length) {
      const timer = setTimeout(() => setTitleIndex(titleIndex + 1), TYPING_SPEED.title);
      return () => clearTimeout(timer);
    } else {
      // 有副标题则继续，否则跳到 content 或 done
      const nextPhase = subtitle ? 'subtitle' : (contentText ? 'content' : 'done');
      const timer = setTimeout(() => {
        setPhase(nextPhase);
        if (nextPhase === 'done') onComplete?.();
      }, TYPING_SPEED.pauseBetween);
      return () => clearTimeout(timer);
    }
  }, [titleIndex, mainTitle, subtitle, contentText, phase, onComplete]);
  
  // 副标题打字
  useEffect(() => {
    if (phase !== 'subtitle') return;
    if (subtitleIndex < subtitle.length) {
      const timer = setTimeout(() => setSubtitleIndex(subtitleIndex + 1), TYPING_SPEED.subtitle);
      return () => clearTimeout(timer);
    } else {
      const nextPhase = contentText ? 'content' : 'done';
      const timer = setTimeout(() => {
        setPhase(nextPhase);
        if (nextPhase === 'done') onComplete?.();
      }, TYPING_SPEED.pauseBetween);
      return () => clearTimeout(timer);
    }
  }, [subtitleIndex, subtitle, contentText, phase, onComplete]);
  
  // 内容打字
  useEffect(() => {
    if (phase !== 'content') return;
    if (contentIndex < contentText.length) {
      const timer = setTimeout(() => setContentIndex(contentIndex + 1), TYPING_SPEED.content);
      return () => clearTimeout(timer);
    } else {
      setPhase('done');
      onComplete?.();
    }
  }, [contentIndex, contentText, phase, onComplete]);
  
  // framer-motion 光标闪烁动画
  const cursorVariants = {
    blink: {
      opacity: [1, 0, 1],
      transition: { duration: 0.8, repeat: Infinity, ease: 'linear' },
    },
  };
  
  // 光标组件 - 与 AboutTypewriter 一致的实现
  const Cursor = ({ show, size = 'normal' }) => {
    if (!show) return null;
    const height = size === 'large' 
      ? 'clamp(2.5rem, 7vw, 4.5rem)' 
      : size === 'medium' 
        ? 'clamp(1rem, 3vw, 1.8rem)' 
        : 'clamp(0.8rem, 1.5vw, 1rem)';
    const width = size === 'large' ? '3px' : '2px';
    return (
      <motion.span
        variants={cursorVariants}
        animate="blink"
        style={{
          display: 'inline-block',
          width,
          height,
          backgroundColor: '#fff',
          marginLeft: '3px',
          verticalAlign: 'middle',
        }}
      />
    );
  };
  
  return (
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
      {/* 主题 - Phase Label 带截断线 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '40px',
        minHeight: '1.5em',
      }}>
        <div style={{
          width: '48px',
          height: '1px',
          background: '#666',
        }} />
        <span style={{
          fontSize: '1.1rem',
          letterSpacing: '0.25em',
          color: '#999',
          fontWeight: '400',
          fontFamily: 'var(--font-sans)',
          textTransform: 'uppercase',
        }}>
          {theme.substring(0, themeIndex)}
          <Cursor show={phase === 'theme'} size="small" />
        </span>
        <div style={{
          width: '48px',
          height: '1px',
          background: '#666',
        }} />
      </div>

      {/* 标题 - 主标题 */}
      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(3rem, 8vw, 5.5rem)',
        fontWeight: '400',
        lineHeight: 1.1,
        marginBottom: subtitle ? '16px' : '48px',
        letterSpacing: '0.08em',
        color: '#fff',
        minHeight: '1.2em',
        visibility: phase === 'idle' || phase === 'theme' ? 'hidden' : 'visible',
      }}>
        {mainTitle.substring(0, titleIndex)}
        <Cursor show={phase === 'title'} size="large" />
      </h1>

      {/* 副标题 */}
      {subtitle && (
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(0.95rem, 2.5vw, 1.6rem)',
          fontWeight: '300',
          lineHeight: 1.3,
          marginBottom: '48px',
          letterSpacing: '0.03em',
          color: '#fff',
          opacity: 0.85,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          minHeight: '1.5em',
          visibility: ['idle', 'theme', 'title'].includes(phase) ? 'hidden' : 'visible',
        }}>
          {subtitle.substring(0, subtitleIndex)}
          <Cursor show={phase === 'subtitle'} size="medium" />
        </h2>
      )}

      {/* 内容描述 */}
      {contentText && (
        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
          lineHeight: 1.9,
          maxWidth: '680px',
          margin: '0 auto',
          color: '#fff',
          opacity: 0.75,
          fontWeight: '300',
          fontFamily: 'var(--font-sans)',
          letterSpacing: '0.02em',
          minHeight: '1.9em',
          visibility: ['idle', 'theme', 'title', 'subtitle'].includes(phase) ? 'hidden' : 'visible',
        }}>
          {contentText.substring(0, contentIndex)}
          <Cursor show={phase === 'content'} />
        </p>
      )}
    </div>
  );
});

TextContent.displayName = 'TextContent';

/**
 * 滚动提示组件
 * @param {boolean} visible - 控制组件是否可见（淡入/淡出）
 */
const ScrollHint = memo(({ visible = true }) => (
  <div style={{
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.6s ease-out',
    pointerEvents: visible ? 'auto' : 'none',
  }}>
    <ScrollIndicator
      variant="reveal"
      position="bottom-center"
      color="#fff"
      layout="vertical"
      style={{
        bottom: '40px',
      }}
    />
  </div>
));

ScrollHint.displayName = 'ScrollHint';

export default IntroScreen;
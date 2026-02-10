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
  featherSize = 120,
  flashlightInitialPosition = null // 初始光圈位置 { x: 0-1, y: 0-1 }
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
              initialPosition={flashlightInitialPosition}
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
 * 文字内容组件 - 带打字动画效果
 * 排版层次：主题 → 标题 → 副标题
 */
const TextContent = memo(({ phaseNumber, titleEn, titleZh, content, textY, textOpacity }) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [revealedChars, setRevealedChars] = useState({ theme: 0, title: 0, subtitle: 0, content: 0 });
  const hasTriggeredRef = useRef(false);
  const timersRef = useRef([]);
  
  // 解析标题：如果包含冒号，分为标题和副标题
  const parseTitle = (title) => {
    if (!title) return { mainTitle: '', subtitle: '' };
    // 匹配中文冒号或英文冒号
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
  
  // 触发打字动画
  useEffect(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    
    const charInterval = 50; // 每个字符的间隔（毫秒）
    const phaseDelay = 300; // 每个阶段之间的延迟
    
    // 阶段 1: 主题
    let delay = 500; // 初始延迟
    [...theme].forEach((_, i) => {
      const timer = setTimeout(() => {
        setRevealedChars(prev => ({ ...prev, theme: i + 1 }));
      }, delay + i * charInterval);
      timersRef.current.push(timer);
    });
    
    // 阶段 2: 标题
    delay += theme.length * charInterval + phaseDelay;
    [...mainTitle].forEach((_, i) => {
      const timer = setTimeout(() => {
        setRevealedChars(prev => ({ ...prev, title: i + 1 }));
      }, delay + i * charInterval);
      timersRef.current.push(timer);
    });
    
    // 阶段 3: 副标题
    delay += mainTitle.length * charInterval + phaseDelay;
    [...subtitle].forEach((_, i) => {
      const timer = setTimeout(() => {
        setRevealedChars(prev => ({ ...prev, subtitle: i + 1 }));
      }, delay + i * charInterval);
      timersRef.current.push(timer);
    });
    
    // 阶段 4: 内容
    delay += subtitle.length * charInterval + phaseDelay;
    [...(content || '')].forEach((_, i) => {
      const timer = setTimeout(() => {
        setRevealedChars(prev => ({ ...prev, content: i + 1 }));
      }, delay + i * 25); // 内容打字速度更快
      timersRef.current.push(timer);
    });
    
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [theme, mainTitle, subtitle, content]);
  
  // 渲染带打字效果的文字
  const renderTypingText = (text, revealedCount, style = {}) => {
    return [...text].map((char, i) => (
      <span
        key={i}
        style={{
          opacity: i < revealedCount ? 1 : 0,
          transition: 'opacity 0.15s ease-out',
          ...style
        }}
      >
        {char}
      </span>
    ));
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
      {/* 主题 - Phase Label 带截断线（优化：灰色分隔线，间距调整） */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '40px',
      }}>
        <div style={{
          width: '48px',
          height: '1px',
          background: '#666',
        }} />
        <span style={{
          fontSize: '0.85rem',
          letterSpacing: '0.25em',
          color: '#999',
          fontWeight: '400',
          fontFamily: 'var(--font-sans)',
          textTransform: 'uppercase',
        }}>
          {renderTypingText(theme, revealedChars.theme)}
        </span>
        <div style={{
          width: '48px',
          height: '1px',
          background: '#666',
        }} />
      </div>

      {/* 标题 - 主标题（如 "产品 B"） */}
      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(3rem, 8vw, 5.5rem)',
        fontWeight: '400',
        lineHeight: 1.1,
        marginBottom: subtitle ? '16px' : '48px',
        letterSpacing: '0.08em',
        color: '#fff'
      }}>
        {renderTypingText(mainTitle, revealedChars.title)}
      </h1>

      {/* 副标题 - 如果有的话（如 "一致性中的差异化"） */}
      {subtitle && (
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: '300',
          lineHeight: 1.3,
          marginBottom: '48px',
          letterSpacing: '0.06em',
          color: '#fff',
          opacity: 0.85
        }}>
          {renderTypingText(subtitle, revealedChars.subtitle)}
        </h2>
      )}

      {/* 内容描述 */}
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
        {renderTypingText(content || '', revealedChars.content)}
      </p>
    </div>
  );
});

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
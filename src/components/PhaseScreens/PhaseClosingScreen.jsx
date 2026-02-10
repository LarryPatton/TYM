import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import FrostedDotsBackground from '../FrostedDotsBackground';

// ============================================
// 屏幕: Phase 封底 (PhaseClosingScreen) - 方案A 极简无边框
// 布局: Logo + 打字机效果总结语 + 导航按钮
// 用途: 作为每个 Phase 的最后一屏，AI助手与用户交流
// 特性: 动态磨砂背景、打字机效果、百叶窗过渡
// ============================================

// 百叶窗配置
const BLINDS_CONFIG = {
  count: 15,
  fromColor: '#000',
  animStart: 0.1,
  animEnd: 0.88
};

// 6个 Phase 的总结语（中英文）
const PHASE_SUMMARIES = {
  'phase-01': {
    zh: '想让品牌"看起来像同一个人"？我先把视觉语法写清楚，让每一次输出都有据可循。',
    en: 'Want your brand to look like one consistent identity? I start by defining the visual grammar, so every output follows a clear logic.',
  },
  'phase-02': {
    zh: '从概念到落地：你说"好看"还不够？那就把定位与 CMF 一路推到打样量产，用结果证明它能落地。',
    en: 'From concept to execution: "Good-looking" isn\'t enough? I push positioning and CMF all the way to sampling and production — proving it works in the real world.',
  },
  'phase-03': {
    zh: '一致性与差异化管理：系列要升级又不能变味？我在同一套骨架里做分化，让变化像进化，而不是推翻。',
    en: 'Consistency vs. differentiation: Need to upgrade the series without losing its essence? I evolve within the same framework — change as evolution, not revolution.',
  },
  'phase-04': {
    zh: '传播视觉系统化：跨市场、跨语言怎么不跑偏？把传播做成 KV 套件，让品牌在不同场景里都说同一种语气。',
    en: 'Visual communication system: How to stay on-brand across markets and languages? I turn campaigns into KV kits — same voice, different stages.',
  },
  'phase-05': {
    zh: '空间与终端物料体系：线下最挑剔，细节会"露馅"。我把空间、陈列、物料模块化，让识别度在动线里依然稳。',
    en: 'Space & retail materials: Offline is unforgiving — details will give you away. I modularize space, displays, and materials to keep recognition steady throughout the journey.',
  },
  'phase-06': {
    zh: '信息太多没人看？我把叙事压缩成视觉模块，让渠道好讲、客户好懂、团队好对齐。',
    en: 'Too much info, no one reads? I compress narratives into visual modules — easy to pitch, easy to understand, easy to align.',
  },
};

/**
 * 打字机效果组件
 */
const TypewriterText = ({ 
  text, 
  speed = 55, 
  delay = 600,
  onComplete,
  isDark,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(0);
  
  useEffect(() => {
    setDisplayedText('');
    indexRef.current = 0;
    setIsTyping(false);
    setShowCursor(true);
    
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);
    
    return () => clearTimeout(startTimeout);
  }, [text, delay]);
  
  useEffect(() => {
    if (!isTyping) return;
    
    if (indexRef.current < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      onComplete?.();
    }
  }, [isTyping, displayedText, text, speed, onComplete]);
  
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);
  
  return (
    <span>
      {displayedText}
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        style={{
          display: 'inline-block',
          width: '2px',
          height: '1.1em',
          background: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
          marginLeft: '2px',
          verticalAlign: 'text-bottom',
        }}
      />
    </span>
  );
};

/**
 * Logo 动画组件
 */
const AnimatedLogo = ({ size = 64, isDark }) => {
  const [logoTopIndex, setLogoTopIndex] = useState(0);
  const [logoRotation, setLogoRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoTopIndex(prev => (prev === 0 ? 1 : 0));
      setLogoRotation(prev => prev - 90);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const logoPrefix = isDark ? 'logo_black' : 'logo_white';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ position: 'relative', width: size, height: size }}
    >
      <motion.img 
        src={`/images/logo/${logoPrefix}_bottom.png`}
        alt="Logo" 
        animate={{ rotate: logoRotation }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} 
      />
      <motion.img 
        src={`/images/logo/${logoPrefix}_top.png`}
        alt="" 
        animate={{ opacity: logoTopIndex === 0 ? 1 : 0, scale: logoTopIndex === 0 ? 1 : 0.3 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} 
      />
      <motion.img 
        src={`/images/logo/${logoPrefix}_top2.png`}
        alt="" 
        animate={{ opacity: logoTopIndex === 1 ? 1 : 0, scale: logoTopIndex === 1 ? 1 : 0.3 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} 
      />
    </motion.div>
  );
};

export const PhaseClosingScreen = ({ 
  phaseId = 'phase-01',           // Phase ID，用于获取对应的总结语
  bgImage,                        // 背景图片（保留兼容，但不再使用）
  nextPhase,                      // 下一阶段信息 { id, titleZh }
  backLabel = '返回目录',
  nextLabel = '下一阶段',
  onNavigate,
  sticky = false,
  stickyHeight = 50,
  enableBlinds = true,
  blindsHeight = 100
}) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const isDark = theme === 'dark';
  const lang = i18n.language === 'en' ? 'en' : 'zh';
  
  const [isMobile, setIsMobile] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [shouldStartTyping, setShouldStartTyping] = useState(false); // 控制何时开始打字
  const containerRef = useRef(null);
  
  // 获取当前 Phase 的总结语
  const summary = PHASE_SUMMARIES[phaseId]?.[lang] || PHASE_SUMMARIES['phase-01'][lang];
  
  // 打字完成回调
  const handleTypingComplete = useCallback(() => {
    setIsTypingComplete(true);
  }, []);
  
  // 滚动进度追踪
  const hasBlindsTransition = enableBlinds && blindsHeight > 0 && !isMobile;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: hasBlindsTransition 
      ? ["start end", "start start"]
      : ["start 150%", "start 50%"]
  });
  
  // 监听滚动进度，百叶窗过渡完成后（进度 > 0.9）才开始打字
  // 当用户滑离开再滑回来时，重置状态重新播放
  useEffect(() => {
    if (!hasBlindsTransition) {
      // 无百叶窗过渡时，直接开始打字
      setShouldStartTyping(true);
      return;
    }
    
    const unsubscribe = scrollYProgress.on('change', (value) => {
      // 当滚动进度超过 90%（百叶窗基本完成）时开始打字
      if (value > 0.9) {
        if (!shouldStartTyping) {
          setShouldStartTyping(true);
        }
      } else if (value < 0.5) {
        // 当用户滑离开（进度 < 50%）时，重置所有状态
        if (shouldStartTyping || isTypingComplete) {
          setShouldStartTyping(false);
          setIsTypingComplete(false);
        }
      }
    });
    
    return () => unsubscribe();
  }, [scrollYProgress, hasBlindsTransition, shouldStartTyping, isTypingComplete]);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 百叶窗条带
  const blinds = Array.from({ length: BLINDS_CONFIG.count }, (_, i) => i);

  // 方案 A 极简无边框内容渲染
  const renderContent = () => (
    <>
      {/* 动态磨砂背景 */}
      <FrostedDotsBackground />
      
      {/* 中心内容区域 */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: isMobile ? '0 24px' : '0 40px',
      }}>
        {/* Logo 动画 */}
        <AnimatedLogo size={isMobile ? 56 : 64} isDark={isDark} />
        
        {/* 总结语文案 - 打字机效果 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            maxWidth: isMobile ? '100%' : 440,
            textAlign: 'center',
            marginTop: isMobile ? 20 : 24,
          }}
        >
          <p style={{
            fontSize: isMobile ? '0.95rem' : '1.05rem',
            fontWeight: '400',
            lineHeight: 1.9,
            color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
            margin: 0,
            letterSpacing: '0.02em',
            minHeight: isMobile ? '6em' : '4.5em',
          }}>
            {/* 只有当 shouldStartTyping 为 true 时才渲染打字机 */}
            {shouldStartTyping && (
              <TypewriterText
                text={summary}
                speed={45}
                delay={300}
                onComplete={handleTypingComplete}
                isDark={isDark}
              />
            )}
          </p>
        </motion.div>
        
        {/* 导航按钮 - 打字完成后逐个显示 */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 12 : 16,
          marginTop: isMobile ? 32 : 48,
          width: isMobile ? '100%' : 'auto',
          maxWidth: isMobile ? 280 : 'none',
        }}>
          {/* 第一个按钮：返回目录 */}
          <AnimatePresence>
            {isTypingComplete && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                onClick={() => onNavigate?.('/work/the-case')}
                style={{
                  padding: isMobile ? '12px 24px' : '12px 28px',
                  background: isDark 
                    ? 'rgba(255, 255, 255, 0.06)' 
                    : 'rgba(0, 0, 0, 0.04)',
                  border: isDark 
                    ? '1px solid rgba(255,255,255,0.15)' 
                    : '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 'var(--radius-full)',
                  color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                  fontSize: isMobile ? '0.85rem' : '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease, border-color 0.2s ease',
                  width: isMobile ? '100%' : 'auto',
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.target.style.background = isDark 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.target.style.background = isDark 
                      ? 'rgba(255, 255, 255, 0.06)' 
                      : 'rgba(0, 0, 0, 0.04)';
                  }
                }}
              >
                {backLabel}
              </motion.button>
            )}
          </AnimatePresence>

          {/* 第二个按钮：下一阶段（延迟出现） */}
          <AnimatePresence>
            {isTypingComplete && nextPhase && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
                onClick={() => onNavigate?.(`/work/the-case/${nextPhase.id}`)}
                style={{
                  padding: isMobile ? '12px 24px' : '12px 28px',
                  background: isDark ? '#fff' : '#1a1a1a',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  color: isDark ? '#1a1a1a' : '#fff',
                  fontSize: isMobile ? '0.85rem' : '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: isMobile ? '100%' : 'auto',
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = isDark 
                      ? '0 10px 30px rgba(255,255,255,0.15)' 
                      : '0 10px 30px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                <span>{isMobile ? nextPhase.titleZh : `${nextLabel}: ${nextPhase.titleZh}`}</span>
                <span>→</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );

  // 百叶窗遮罩层
  const renderBlindsOverlay = () => {
    if (isMobile || !enableBlinds) return null;
    
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        {blinds.map((index) => (
          <BlindSlat
            key={index}
            index={index}
            totalBlinds={BLINDS_CONFIG.count}
            scrollYProgress={scrollYProgress}
            color={BLINDS_CONFIG.fromColor}
          />
        ))}
      </div>
    );
  };

  // 移动端布局
  if (isMobile) {
    return (
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--frosted-bg)',
      }}>
        {renderContent()}
      </section>
    );
  }

  // 桌面端 Sticky 模式
  if (sticky) {
    return (
      <div 
        ref={containerRef}
        style={{
          height: `${stickyHeight}vh`,
          position: 'relative',
          background: 'var(--frosted-bg)',
        }}
      >
        <section style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {renderContent()}
          {renderBlindsOverlay()}
        </section>
      </div>
    );
  }

  // 带百叶窗过渡的布局
  if (hasBlindsTransition) {
    return (
      <div 
        ref={containerRef}
        style={{
          height: `${100 + blindsHeight}vh`,
          position: 'relative',
          background: 'var(--frosted-bg)',
        }}
      >
        {/* 百叶窗过渡区 */}
        <div style={{
          height: `${blindsHeight}vh`,
          position: 'relative',
          background: '#000'
        }}>
          <div style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
            background: '#000'
          }}>
            {renderBlindsOverlay()}
          </div>
        </div>
        
        {/* 尾页内容 */}
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {renderContent()}
        </div>
      </div>
    );
  }
  
  // 无过渡区的简单布局
  return (
    <section 
      ref={containerRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {renderContent()}
      {enableBlinds && renderBlindsOverlay()}
    </section>
  );
};

/**
 * 单个百叶窗条带
 * 初始完全展开，随滚动收缩（从底部向上收缩，揭示内容）
 */
const BlindSlat = ({ 
  index, 
  totalBlinds, 
  scrollYProgress, 
  color 
}) => {
  // 条带高度百分比
  const slatHeight = 100 / totalBlinds;
  
  // 计算条带位置 - 从顶部开始排布
  const topPosition = index * slatHeight;
  
  // 动画时机
  const { animStart, animEnd } = BLINDS_CONFIG;
  const totalAnimRange = animEnd - animStart;
  
  // 错落感：从下到上依次收缩（底部条带先动）
  // 反转索引，让底部的先收缩
  const reverseIndex = totalBlinds - 1 - index;
  const slatAnimDuration = totalAnimRange / totalBlinds * 1.8; // 1.8倍重叠，更流畅
  const slatAnimGap = totalAnimRange / totalBlinds;
  
  const startProgress = animStart + (reverseIndex * slatAnimGap);
  const endProgress = Math.min(startProgress + slatAnimDuration, 1);
  
  // 条带的 scaleY 动画 - 从 1 收缩到 0
  const scaleY = useTransform(
    scrollYProgress,
    [startProgress, endProgress],
    [1, 0]
  );

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${topPosition}%`,
        height: `${slatHeight + 0.5}%`, // +0.5% 防止缝隙
        background: color,
        transformOrigin: 'bottom center', // 向下收缩（从底部揭开）
        scaleY,
      }}
    />
  );
};
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import FrostedDotsBackground from '../../components/FrostedDotsBackground';

/**
 * Phase 尾页调试页面
 * 新设计：Logo主体 + 毛玻璃对话框 + 动态背景 + 百叶窗过渡 + 打字机效果
 * 访问路径：/demo/phase-closing
 */

/**
 * 打字机效果组件
 * 逐字显示文本，模拟AI助手打字的感觉
 */
const TypewriterText = ({ 
  text, 
  speed = 50, 
  delay = 500,
  onComplete,
  isDark,
  cursorColor
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(0);
  
  // 重置并开始打字
  useEffect(() => {
    setDisplayedText('');
    indexRef.current = 0;
    setIsTyping(false);
    setShowCursor(true);
    
    // 延迟开始打字
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);
    
    return () => clearTimeout(startTimeout);
  }, [text, delay]);
  
  // 打字动画
  useEffect(() => {
    if (!isTyping) return;
    
    if (indexRef.current < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      // 打字完成
      setIsTyping(false);
      onComplete?.();
    }
  }, [isTyping, displayedText, text, speed, onComplete]);
  
  // 光标闪烁
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);
  
  return (
    <span style={{ position: 'relative' }}>
      {displayedText}
      {/* 闪烁光标 */}
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        style={{
          display: 'inline-block',
          width: '2px',
          height: '1.2em',
          background: cursorColor || (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'),
          marginLeft: '2px',
          verticalAlign: 'text-bottom',
        }}
      />
    </span>
  );
};

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
 * 新版 Phase 尾页组件
 */
const NewPhaseClosingScreen = ({ 
  phaseId = 'phase-01',
  nextPhase,
  backLabel = '返回目录',
  nextLabel = '下一阶段',
  onNavigate,
  enableBlinds = true,
  blindsHeight = 100
}) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const isDark = theme === 'dark';
  const lang = i18n.language === 'en' ? 'en' : 'zh';
  const containerRef = useRef(null);
  
  // Logo 动画状态
  const [logoTopIndex, setLogoTopIndex] = useState(0);
  const [logoRotation, setLogoRotation] = useState(0);
  
  // 打字机状态
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [typingKey, setTypingKey] = useState(0); // 用于重置打字机
  
  // 当 phaseId 改变时重置打字机状态
  useEffect(() => {
    setIsTypingComplete(false);
    setTypingKey(prev => prev + 1);
  }, [phaseId]);
  
  // 打字完成回调
  const handleTypingComplete = useCallback(() => {
    setIsTypingComplete(true);
  }, []);
  
  // Logo 动画定时器
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoTopIndex(prev => (prev === 0 ? 1 : 0));
      setLogoRotation(prev => prev - 90);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // 百叶窗滚动进度
  const hasBlindsTransition = enableBlinds && blindsHeight > 0;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: hasBlindsTransition 
      ? ["start end", "start start"]
      : ["start 150%", "start 50%"]
  });
  
  // 获取当前 Phase 的总结语
  const summary = PHASE_SUMMARIES[phaseId]?.[lang] || PHASE_SUMMARIES['phase-01'][lang];
  
  // Logo 前缀
  const logoPrefix = isDark ? 'logo_black' : 'logo_white';
  
  // 百叶窗条带
  const blinds = Array.from({ length: BLINDS_CONFIG.count }, (_, i) => i);
  
  // 百叶窗遮罩层
  const renderBlindsOverlay = () => {
    if (!enableBlinds) return null;
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
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

  // 内容渲染
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
        padding: '0 24px',
      }}>
        {/* Logo 动画 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'relative',
            width: 80,
            height: 80,
            marginBottom: 32,
          }}
        >
          {/* 底层图片 - 逆时针旋转 */}
          <motion.img 
            src={`/images/logo/${logoPrefix}_bottom.png`}
            alt="Logo" 
            animate={{ rotate: logoRotation }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
            }} 
          />
          {/* 顶层图片1 */}
          <motion.img 
            src={`/images/logo/${logoPrefix}_top.png`}
            alt="" 
            initial={{ opacity: 1, scale: 1 }}
            animate={{ 
              opacity: logoTopIndex === 0 ? 1 : 0,
              scale: logoTopIndex === 0 ? 1 : 0.3,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }} 
          />
          {/* 顶层图片2 */}
          <motion.img 
            src={`/images/logo/${logoPrefix}_top2.png`}
            alt="" 
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ 
              opacity: logoTopIndex === 1 ? 1 : 0,
              scale: logoTopIndex === 1 ? 1 : 0.3,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }} 
          />
        </motion.div>
        
        {/* 对话框卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          style={{
            position: 'relative',
            maxWidth: 520,
            padding: '32px 40px',
            background: isDark 
              ? 'rgba(255, 255, 255, 0.06)' 
              : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 16,
            border: isDark 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: isDark 
              ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
              : '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* 小三角指示器（指向Logo） */}
          <div style={{
            position: 'absolute',
            top: -8,
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: 16,
            height: 16,
            background: isDark 
              ? 'rgba(255, 255, 255, 0.06)' 
              : 'rgba(255, 255, 255, 0.7)',
            borderTop: isDark 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.08)',
            borderLeft: isDark 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.08)',
          }} />
          
          {/* 总结语文案 - 打字机效果 */}
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            fontWeight: '400',
            lineHeight: 1.8,
            color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)',
            margin: 0,
            textAlign: 'center',
            minHeight: '4.5em', // 预留空间防止布局跳动
          }}>
            <TypewriterText
              key={typingKey}
              text={summary}
              speed={60}
              delay={800}
              onComplete={handleTypingComplete}
              isDark={isDark}
            />
          </p>
        </motion.div>
        
        {/* 导航按钮 - 打字完成后显示 */}
        <AnimatePresence>
          {isTypingComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                display: 'flex',
                gap: 16,
                marginTop: 40,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
          <button
            onClick={() => onNavigate?.('/work/the-case')}
            style={{
              padding: '14px 32px',
              background: isDark 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(10px)',
              border: isDark 
                ? '1px solid rgba(255,255,255,0.2)' 
                : '1px solid rgba(0,0,0,0.15)',
              borderRadius: 'var(--radius-full)',
              color: isDark ? '#fff' : '#1a1a1a',
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = isDark 
                ? 'rgba(255, 255, 255, 0.15)' 
                : 'rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = isDark 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.05)';
            }}
          >
            {backLabel}
          </button>

          {nextPhase && (
            <button
              onClick={() => onNavigate?.(`/work/the-case/${nextPhase.id}`)}
              style={{
                padding: '14px 32px',
                background: isDark ? '#fff' : '#1a1a1a',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                color: isDark ? '#1a1a1a' : '#fff',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = isDark 
                  ? '0 10px 30px rgba(255,255,255,0.2)' 
                  : '0 10px 30px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <span>{`${nextLabel}: ${nextPhase.titleZh}`}</span>
              <span>→</span>
            </button>
          )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  // 带百叶窗过渡的布局
  if (hasBlindsTransition) {
    return (
      <div 
        ref={containerRef}
        style={{
          height: `${100 + blindsHeight}vh`,
          position: 'relative',
          background: isDark ? 'var(--frosted-bg)' : 'var(--frosted-bg)',
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
        
        {/* 实际尾页内容 */}
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
 */
const BlindSlat = ({ 
  index, 
  totalBlinds, 
  scrollYProgress, 
  color 
}) => {
  const slatHeight = 100 / totalBlinds;
  const topPosition = index * slatHeight;
  
  const { animStart, animEnd } = BLINDS_CONFIG;
  const totalAnimRange = animEnd - animStart;
  
  const reverseIndex = totalBlinds - 1 - index;
  const slatAnimDuration = totalAnimRange / totalBlinds * 1.8;
  const slatAnimGap = totalAnimRange / totalBlinds;
  
  const startProgress = animStart + (reverseIndex * slatAnimGap);
  const endProgress = Math.min(startProgress + slatAnimDuration, 1);
  
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
        height: `${slatHeight + 0.5}%`,
        background: color,
        transformOrigin: 'bottom center',
        scaleY,
      }}
    />
  );
};

/**
 * Demo 页面 - 用于调试新的尾页设计
 */
const PhaseClosingDemo = () => {
  const [selectedPhase, setSelectedPhase] = useState('phase-01');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const phases = [
    { id: 'phase-01', title: '品牌视觉系统' },
    { id: 'phase-02', title: '产品 A' },
    { id: 'phase-03', title: '周边视觉系统' },
    { id: 'phase-04', title: '传播视觉体系' },
    { id: 'phase-05', title: '线下空间体系' },
    { id: 'phase-06', title: '叙事物料' },
  ];
  
  const currentIndex = phases.findIndex(p => p.id === selectedPhase);
  const nextPhase = currentIndex < phases.length - 1 
    ? { id: phases[currentIndex + 1].id, titleZh: phases[currentIndex + 1].title }
    : null;

  return (
    <div style={{ minHeight: '200vh' }}>
      {/* 顶部选择器 */}
      <div style={{
        position: 'fixed',
        top: 'calc(var(--nav-height) + 16px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        gap: 8,
        padding: 8,
        background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: 'var(--radius-full)',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      }}>
        {phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setSelectedPhase(phase.id)}
            style={{
              padding: '8px 16px',
              background: selectedPhase === phase.id 
                ? (isDark ? '#fff' : '#1a1a1a')
                : 'transparent',
              color: selectedPhase === phase.id 
                ? (isDark ? '#1a1a1a' : '#fff')
                : (isDark ? '#fff' : '#1a1a1a'),
              border: 'none',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {phase.id.replace('phase-0', 'P')}
          </button>
        ))}
      </div>
      
      {/* 模拟上一屏（黑色） */}
      <div style={{
        height: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '1.5rem',
      }}>
        ↓ 向下滚动查看尾页效果
      </div>
      
      {/* 新尾页组件 */}
      <NewPhaseClosingScreen
        phaseId={selectedPhase}
        nextPhase={nextPhase}
        backLabel="返回目录"
        nextLabel="下一阶段"
        onNavigate={(path) => console.log('Navigate to:', path)}
        enableBlinds={true}
        blindsHeight={100}
      />
    </div>
  );
};

export default PhaseClosingDemo;

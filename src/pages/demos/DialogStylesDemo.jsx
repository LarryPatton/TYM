import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import FrostedDotsBackground from '../../components/FrostedDotsBackground';

/**
 * 对话框设计方案调试页面
 * 展示多种优雅简洁的对话框风格，供用户选择
 * 访问路径：/demo/dialog-styles
 */

// 示例总结语
const SAMPLE_TEXT = '想让品牌"看起来像同一个人"？我先把视觉语法写清楚，让每一次输出都有据可循。';

/**
 * 打字机效果组件
 */
const TypewriterText = ({ 
  text, 
  speed = 50, 
  delay = 500,
  onComplete,
  isDark,
  cursorStyle = 'line' // 'line' | 'block' | 'underscore' | 'none'
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
  
  const renderCursor = () => {
    if (cursorStyle === 'none') return null;
    
    const cursorStyles = {
      line: {
        display: 'inline-block',
        width: '2px',
        height: '1.1em',
        background: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
        marginLeft: '2px',
        verticalAlign: 'text-bottom',
      },
      block: {
        display: 'inline-block',
        width: '0.6em',
        height: '1.1em',
        background: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)',
        marginLeft: '1px',
        verticalAlign: 'text-bottom',
      },
      underscore: {
        display: 'inline-block',
        width: '0.8em',
        height: '2px',
        background: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
        marginLeft: '2px',
        verticalAlign: 'baseline',
        marginBottom: '2px',
      },
    };
    
    return (
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        style={cursorStyles[cursorStyle]}
      />
    );
  };
  
  return (
    <span>
      {displayedText}
      {renderCursor()}
    </span>
  );
};

/**
 * Logo 动画组件
 */
const AnimatedLogo = ({ size = 60 }) => {
  const { theme } = useTheme();
  const [logoTopIndex, setLogoTopIndex] = useState(0);
  const [logoRotation, setLogoRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoTopIndex(prev => (prev === 0 ? 1 : 0));
      setLogoRotation(prev => prev - 90);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const logoPrefix = theme === 'dark' ? 'logo_black' : 'logo_white';
  
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
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
    </div>
  );
};

// ============================================
// 方案 A：极简无边框（推荐）
// ============================================
const StyleA = ({ isDark, text, isActive }) => {
  const [isComplete, setIsComplete] = useState(false);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 24,
    }}>
      <AnimatedLogo size={64} />
      
      {/* 纯文字，无边框无背景 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          maxWidth: 440,
          textAlign: 'center',
        }}
      >
        <p style={{
          fontSize: '1.05rem',
          fontWeight: '400',
          lineHeight: 1.9,
          color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
          margin: 0,
          letterSpacing: '0.02em',
        }}>
          {isActive ? (
            <TypewriterText
              text={text}
              speed={55}
              delay={600}
              onComplete={() => setIsComplete(true)}
              isDark={isDark}
              cursorStyle="line"
            />
          ) : text}
        </p>
      </motion.div>
    </div>
  );
};

// ============================================
// 方案 B：细线边框卡片
// ============================================
const StyleB = ({ isDark, text, isActive }) => {
  const [isComplete, setIsComplete] = useState(false);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 28,
    }}>
      <AnimatedLogo size={56} />
      
      {/* 细边框卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          maxWidth: 480,
          padding: '28px 36px',
          border: isDark 
            ? '1px solid rgba(255,255,255,0.12)' 
            : '1px solid rgba(0,0,0,0.08)',
          borderRadius: 2,
          background: 'transparent',
        }}
      >
        <p style={{
          fontSize: '1rem',
          fontWeight: '400',
          lineHeight: 1.85,
          color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
          margin: 0,
          textAlign: 'center',
        }}>
          {isActive ? (
            <TypewriterText
              text={text}
              speed={55}
              delay={600}
              onComplete={() => setIsComplete(true)}
              isDark={isDark}
              cursorStyle="underscore"
            />
          ) : text}
        </p>
      </motion.div>
    </div>
  );
};

// ============================================
// 方案 C：引号装饰
// ============================================
const StyleC = ({ isDark, text, isActive }) => {
  const [isComplete, setIsComplete] = useState(false);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
    }}>
      <AnimatedLogo size={60} />
      
      {/* 引号装饰的文字 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          maxWidth: 460,
          position: 'relative',
          padding: '0 24px',
        }}
      >
        {/* 左引号 */}
        <span style={{
          position: 'absolute',
          left: -8,
          top: -16,
          fontSize: '4rem',
          fontFamily: 'Georgia, serif',
          color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
          lineHeight: 1,
          userSelect: 'none',
        }}>"</span>
        
        <p style={{
          fontSize: '1.05rem',
          fontWeight: '400',
          lineHeight: 1.9,
          color: isDark ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.78)',
          margin: 0,
          textAlign: 'center',
          fontStyle: 'normal',
        }}>
          {isActive ? (
            <TypewriterText
              text={text}
              speed={55}
              delay={600}
              onComplete={() => setIsComplete(true)}
              isDark={isDark}
              cursorStyle="line"
            />
          ) : text}
        </p>
        
        {/* 右引号 */}
        <span style={{
          position: 'absolute',
          right: -8,
          bottom: -32,
          fontSize: '4rem',
          fontFamily: 'Georgia, serif',
          color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
          lineHeight: 1,
          userSelect: 'none',
        }}>"</span>
      </motion.div>
    </div>
  );
};

// ============================================
// 方案 D：左侧竖线装饰
// ============================================
const StyleD = ({ isDark, text, isActive }) => {
  const [isComplete, setIsComplete] = useState(false);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 28,
    }}>
      <AnimatedLogo size={56} />
      
      {/* 左侧竖线 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          maxWidth: 460,
          display: 'flex',
          alignItems: 'stretch',
          gap: 20,
        }}
      >
        <div style={{
          width: 2,
          background: isDark 
            ? 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.4), transparent)' 
            : 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.25), transparent)',
          borderRadius: 1,
          flexShrink: 0,
        }} />
        
        <p style={{
          fontSize: '1rem',
          fontWeight: '400',
          lineHeight: 1.85,
          color: isDark ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.78)',
          margin: 0,
          textAlign: 'left',
        }}>
          {isActive ? (
            <TypewriterText
              text={text}
              speed={55}
              delay={600}
              onComplete={() => setIsComplete(true)}
              isDark={isDark}
              cursorStyle="block"
            />
          ) : text}
        </p>
      </motion.div>
    </div>
  );
};

// ============================================
// 方案 E：底部横线装饰
// ============================================
const StyleE = ({ isDark, text, isActive }) => {
  const [isComplete, setIsComplete] = useState(false);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 24,
    }}>
      <AnimatedLogo size={60} />
      
      {/* 文字 + 底部横线 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          maxWidth: 440,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <p style={{
          fontSize: '1.05rem',
          fontWeight: '400',
          lineHeight: 1.9,
          color: isDark ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.78)',
          margin: 0,
          textAlign: 'center',
        }}>
          {isActive ? (
            <TypewriterText
              text={text}
              speed={55}
              delay={600}
              onComplete={() => setIsComplete(true)}
              isDark={isDark}
              cursorStyle="line"
            />
          ) : text}
        </p>
        
        {/* 底部装饰线 */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            width: 60,
            height: 1,
            background: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
          }} 
        />
      </motion.div>
    </div>
  );
};

// ============================================
// 方案 F：轻薄毛玻璃（优化版）
// ============================================
const StyleF = ({ isDark, text, isActive }) => {
  const [isComplete, setIsComplete] = useState(false);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 24,
    }}>
      <AnimatedLogo size={60} />
      
      {/* 轻薄毛玻璃卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          maxWidth: 480,
          padding: '24px 32px',
          background: isDark 
            ? 'rgba(255, 255, 255, 0.03)' 
            : 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 12,
          border: isDark 
            ? '1px solid rgba(255, 255, 255, 0.06)' 
            : '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: isDark 
            ? 'none' 
            : '0 4px 24px rgba(0, 0, 0, 0.04)',
        }}
      >
        <p style={{
          fontSize: '1rem',
          fontWeight: '400',
          lineHeight: 1.85,
          color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
          margin: 0,
          textAlign: 'center',
        }}>
          {isActive ? (
            <TypewriterText
              text={text}
              speed={55}
              delay={600}
              onComplete={() => setIsComplete(true)}
              isDark={isDark}
              cursorStyle="line"
            />
          ) : text}
        </p>
      </motion.div>
    </div>
  );
};

/**
 * 调试页面主组件
 */
const DialogStylesDemo = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeStyle, setActiveStyle] = useState('A');
  
  const styles = [
    { id: 'A', name: '极简无边框', component: StyleA, recommended: true },
    { id: 'B', name: '细线边框', component: StyleB },
    { id: 'C', name: '引号装饰', component: StyleC },
    { id: 'D', name: '左侧竖线', component: StyleD },
    { id: 'E', name: '底部横线', component: StyleE },
    { id: 'F', name: '轻薄毛玻璃', component: StyleF },
  ];

  const ActiveComponent = styles.find(s => s.id === activeStyle)?.component || StyleA;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--frosted-bg)',
      position: 'relative',
    }}>
      {/* 动态背景 */}
      <FrostedDotsBackground />
      
      {/* 顶部样式选择器 */}
      <div style={{
        position: 'fixed',
        top: 'calc(var(--nav-height) + 16px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        gap: 4,
        padding: 6,
        background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderRadius: 'var(--radius-full)',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
      }}>
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => setActiveStyle(style.id)}
            style={{
              padding: '8px 16px',
              background: activeStyle === style.id 
                ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)')
                : 'transparent',
              color: isDark ? '#fff' : '#1a1a1a',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: activeStyle === style.id ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {style.name}
            {style.recommended && (
              <span style={{
                fontSize: '0.65rem',
                padding: '2px 6px',
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                borderRadius: 'var(--radius-full)',
                opacity: 0.8,
              }}>推荐</span>
            )}
          </button>
        ))}
      </div>
      
      {/* 主内容区域 */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 80px',
      }}>
        {/* 当前样式预览 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ActiveComponent 
              isDark={isDark} 
              text={SAMPLE_TEXT}
              isActive={true}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* 示例导航按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 3.5 }}
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 48,
          }}
        >
          <button
            style={{
              padding: '12px 28px',
              background: isDark 
                ? 'rgba(255, 255, 255, 0.06)' 
                : 'rgba(0, 0, 0, 0.04)',
              border: isDark 
                ? '1px solid rgba(255,255,255,0.15)' 
                : '1px solid rgba(0,0,0,0.1)',
              borderRadius: 'var(--radius-full)',
              color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            返回目录
          </button>
          
          <button
            style={{
              padding: '12px 28px',
              background: isDark ? '#fff' : '#1a1a1a',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              color: isDark ? '#1a1a1a' : '#fff',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>下一阶段: 产品 A</span>
            <span>→</span>
          </button>
        </motion.div>
        
        {/* 样式说明 */}
        <div style={{
          marginTop: 60,
          padding: '20px 28px',
          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          borderRadius: 8,
          maxWidth: 500,
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '0.85rem',
            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
            margin: 0,
            lineHeight: 1.6,
          }}>
            {styles.find(s => s.id === activeStyle)?.id === 'A' && '方案 A：极简风格，Logo + 纯文字，无任何装饰元素，最大化留白空间'}
            {styles.find(s => s.id === activeStyle)?.id === 'B' && '方案 B：细边框卡片，精致的 1px 边框提供视觉边界，保持简洁感'}
            {styles.find(s => s.id === activeStyle)?.id === 'C' && '方案 C：使用大号装饰引号，增添文学气息和品味感'}
            {styles.find(s => s.id === activeStyle)?.id === 'D' && '方案 D：左侧渐变竖线装饰，文字左对齐，专业内敛'}
            {styles.find(s => s.id === activeStyle)?.id === 'E' && '方案 E：底部装饰短横线，简约而有设计感'}
            {styles.find(s => s.id === activeStyle)?.id === 'F' && '方案 F：轻薄毛玻璃效果，透明度极低，若有似无'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DialogStylesDemo;

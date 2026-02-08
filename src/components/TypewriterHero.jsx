import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSignature from './AnimatedSignature';
import { useTheme } from '../hooks/useTheme';

/**
 * 打字机效果 Hero 组件
 * 布局：所有内容聚集在屏幕中央区域
 */
const TypewriterHero = ({ name, role, desc1, desc2 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // 打字状态
  const [nameIndex, setNameIndex] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);
  const [desc1Index, setDesc1Index] = useState(0);
  const [desc2Index, setDesc2Index] = useState(0);
  
  // 当前打字阶段：'name' | 'role' | 'desc1' | 'desc2' | 'done'
  const [phase, setPhase] = useState('name');
  
  // PORTFOLIO 显示状态
  const [showPortfolio, setShowPortfolio] = useState(true);
  // 是否在 Contact 区域（用于跳过动画延迟）
  const [isInContactArea, setIsInContactArea] = useState(false);
  
  // 监听滚动，在 Hero 和 Contact 区域显示 PORTFOLIO
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Hero 区域：滚动小于 80% 视口高度
      const isInHero = scrollY < viewportHeight * 0.8;
      
      // Contact 区域：直接检测 contact-cta 元素是否在视口中
      let isInContact = false;
      const contactSection = document.getElementById('contact-cta');
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        // 当 contact 区域顶部进入视口时（考虑导航栏 80px）
        isInContact = rect.top <= 80 && rect.bottom > 0;
      }
      
      setShowPortfolio(isInHero || isInContact);
      setIsInContactArea(isInContact);
    };
    
    window.addEventListener('scroll', handleScroll);
    // 初始检查
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 打字速度配置（毫秒）
  const TYPING_SPEED = {
    name: 100,
    role: 40,
    desc: 30,
    pauseBetween: 300,
  };

  // 名字打字效果
  useEffect(() => {
    if (phase !== 'name') return;
    if (nameIndex < name.length) {
      const timer = setTimeout(() => setNameIndex(nameIndex + 1), TYPING_SPEED.name);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase('role'), TYPING_SPEED.pauseBetween);
      return () => clearTimeout(timer);
    }
  }, [nameIndex, name, phase]);

  // 职位打字效果
  useEffect(() => {
    if (phase !== 'role') return;
    if (roleIndex < role.length) {
      const timer = setTimeout(() => setRoleIndex(roleIndex + 1), TYPING_SPEED.role);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase('desc1'), TYPING_SPEED.pauseBetween);
      return () => clearTimeout(timer);
    }
  }, [roleIndex, role, phase]);

  // 描述1打字效果
  useEffect(() => {
    if (phase !== 'desc1') return;
    if (desc1Index < desc1.length) {
      const timer = setTimeout(() => setDesc1Index(desc1Index + 1), TYPING_SPEED.desc);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase('desc2'), TYPING_SPEED.pauseBetween);
      return () => clearTimeout(timer);
    }
  }, [desc1Index, desc1, phase]);

  // 描述2打字效果
  useEffect(() => {
    if (phase !== 'desc2') return;
    if (desc2Index < desc2.length) {
      const timer = setTimeout(() => setDesc2Index(desc2Index + 1), TYPING_SPEED.desc);
      return () => clearTimeout(timer);
    } else {
      setPhase('done');
    }
  }, [desc2Index, desc2, phase]);

  // 光标闪烁动画
  const cursorVariants = {
    blink: {
      opacity: [1, 0, 1],
      transition: { duration: 0.8, repeat: Infinity, ease: 'linear' },
    },
  };

  // 光标组件
  const Cursor = ({ show, size = 'normal' }) => {
    if (!show) return null;
    const height = size === 'large' ? 'clamp(2.5rem, 8vw, 6rem)' : 
                   size === 'medium' ? 'clamp(0.8rem, 1.2vw, 1rem)' : 
                   'clamp(0.9rem, 1.2vw, 1.1rem)';
    const width = size === 'large' ? '4px' : '2px';
    return (
      <motion.span
        variants={cursorVariants}
        animate="blink"
        style={{
          display: 'inline-block',
          width,
          height,
          backgroundColor: 'var(--color-text-main)',
          marginLeft: '4px',
          verticalAlign: 'middle',
        }}
      />
    );
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative', 
      zIndex: 1,
      padding: '20px 24px',
      boxSizing: 'border-box',
    }}>
      {/* 中央内容容器 - 所有内容紧凑排列 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
        maxWidth: '700px',
        width: '100%',
      }}>
        {/* ========== 区域1：大标题姓名（左对齐） ========== */}
        <h1 style={{ 
          fontFamily: 'var(--font-cn-display)',
          fontSize: 'clamp(2.5rem, 7vw, 5rem)', 
          fontWeight: '100', 
          lineHeight: 1, 
          margin: 0,
          marginBottom: '32px',
          letterSpacing: '0.15em',
          color: 'var(--color-text-main)',
        }}>
          {name.substring(0, nameIndex)}
          <Cursor show={phase === 'name'} size="large" />
        </h1>

        {/* ========== 区域2：签名 + / 2026（一行显示，居中） ========== */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '40px',
            minHeight: '50px',
          }}
        >
          {/* 签名 - 先出现 */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: phase === 'done' ? 1 : 0,
              x: phase === 'done' ? 0 : -10,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {phase === 'done' && (
              <AnimatedSignature 
                isDark={isDark} 
                width={100} 
                height={62} 
                duration={0.6}
                strokeWidth={0.8}
                initialDelay={0.1}
              />
            )}
          </motion.div>
          
          {/* / 2026 - 签名后出现 */}
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ 
              opacity: phase === 'done' ? 1 : 0,
              x: phase === 'done' ? 0 : 10,
            }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
            style={{
              fontFamily: "'Afacad', var(--font-sans)",
              fontSize: 'clamp(0.8rem, 1vw, 0.95rem)',
              fontWeight: '400',
              letterSpacing: '0.1em',
              color: 'var(--color-text-muted)',
            }}
          >
            / 2026
          </motion.span>
        </div>

        {/* ========== 区域3：职位/描述1 + 描述2（左对齐，与姓名对齐） ========== */}
        <div style={{ 
          textAlign: 'left',
        }}>
          {/* 第一行：职位 / 描述1 */}
          <p style={{ 
            fontSize: 'clamp(0.9rem, 1.1vw, 1rem)', 
            fontFamily: 'var(--font-cn)',
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.8, 
            margin: 0,
            marginBottom: '4px',
            visibility: phase === 'name' ? 'hidden' : 'visible',
          }}>
            <span style={{ color: 'var(--color-text-muted)' }}>
              {role.substring(0, roleIndex)}
            </span>
            <Cursor show={phase === 'role'} size="medium" />
            {phase !== 'name' && phase !== 'role' && (
              <>
                <span style={{ color: 'var(--color-text-muted)', margin: '0 6px' }}>/</span>
                <span>{desc1.substring(0, desc1Index)}</span>
                <Cursor show={phase === 'desc1'} size="normal" />
              </>
            )}
          </p>

          {/* 第二行：描述2 */}
          <p style={{ 
            fontSize: 'clamp(0.9rem, 1.1vw, 1rem)', 
            fontFamily: 'var(--font-cn)',
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.8, 
            margin: 0,
            visibility: (phase === 'name' || phase === 'role' || phase === 'desc1') ? 'hidden' : 'visible',
          }}>
            {desc2.substring(0, desc2Index)}
            <Cursor show={phase === 'desc2' || phase === 'done'} size="normal" />
          </p>
        </div>
      </div>

      {/* ========== 右下角：斜线推出 PORTFOLIO（固定在视口右下角，与回到顶部按钮对齐） ========== */}
      <AnimatePresence>
        {showPortfolio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: '52px', // 与 BackToTop 按钮垂直居中对齐 (40px + 25px - ~13px)
              right: '110px', // 横向错开：40px(按钮right) + 50px(按钮宽) + 20px(间距)
              display: 'flex',
              alignItems: 'center',
              gap: '0',
              zIndex: 10,
            }}
          >
            {/* 文字容器 - 使用 overflow:hidden 实现从右向左推出效果 */}
            <div style={{ overflow: 'hidden' }}>
              <motion.span
                initial={{ x: isInContactArea ? '0%' : '100%' }}
                animate={{ 
                  x: (isInContactArea || phase === 'done') ? '0%' : '100%',
                }}
                transition={{ 
                  duration: isInContactArea ? 0 : 0.4, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: isInContactArea ? 0 : 2.6,
                }}
                style={{
                  display: 'inline-block',
                  fontFamily: "'Afacad', var(--font-sans)",
                  fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
                  fontWeight: '500',
                  letterSpacing: '0.2em',
                  color: 'var(--color-text-main)',
                  textTransform: 'uppercase',
                  paddingRight: '12px',
                }}
              >
                PORTFOLIO
              </motion.span>
            </div>

            {/* 斜线 - SVG 实现从上到下画出效果 */}
            <motion.svg
              width="24"
              height="40"
              viewBox="0 0 24 40"
              fill="none"
              initial={{ opacity: isInContactArea ? 1 : 0 }}
              animate={{ opacity: (isInContactArea || phase === 'done') ? 1 : 0 }}
              transition={{ duration: isInContactArea ? 0 : 0.1, delay: isInContactArea ? 0 : 2.15 }}
              style={{ overflow: 'visible' }}
            >
              <motion.line
                x1="22"
                y1="0"
                x2="2"
                y2="40"
                stroke="var(--color-text-main)"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: isInContactArea ? 1 : 0 }}
                animate={{ pathLength: (isInContactArea || phase === 'done') ? 1 : 0 }}
                transition={{ 
                  duration: isInContactArea ? 0 : 0.25, 
                  ease: 'easeOut',
                  delay: isInContactArea ? 0 : 2.2,
                }}
              />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TypewriterHero;
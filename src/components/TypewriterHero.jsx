import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedSignature from './AnimatedSignature';
import { useTheme } from '../hooks/useTheme';

/**
 * 打字机效果 Hero 组件
 * 带有真实光标的逐字打出效果
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
  
  // 打字速度配置（毫秒）
  const TYPING_SPEED = {
    name: 100,      // 名字打字速度
    role: 40,       // 职位打字速度
    desc: 30,       // 描述打字速度
    pauseBetween: 300, // 阶段间停顿
  };

  // 名字打字效果
  useEffect(() => {
    if (phase !== 'name') return;
    
    if (nameIndex < name.length) {
      const timer = setTimeout(() => {
        setNameIndex(nameIndex + 1);
      }, TYPING_SPEED.name);
      return () => clearTimeout(timer);
    } else {
      // 名字打完，进入下一阶段
      const timer = setTimeout(() => {
        setPhase('role');
      }, TYPING_SPEED.pauseBetween);
      return () => clearTimeout(timer);
    }
  }, [nameIndex, name, phase]);

  // 职位打字效果
  useEffect(() => {
    if (phase !== 'role') return;
    
    if (roleIndex < role.length) {
      const timer = setTimeout(() => {
        setRoleIndex(roleIndex + 1);
      }, TYPING_SPEED.role);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setPhase('desc1');
      }, TYPING_SPEED.pauseBetween);
      return () => clearTimeout(timer);
    }
  }, [roleIndex, role, phase]);

  // 描述1打字效果
  useEffect(() => {
    if (phase !== 'desc1') return;
    
    if (desc1Index < desc1.length) {
      const timer = setTimeout(() => {
        setDesc1Index(desc1Index + 1);
      }, TYPING_SPEED.desc);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setPhase('desc2');
      }, TYPING_SPEED.pauseBetween);
      return () => clearTimeout(timer);
    }
  }, [desc1Index, desc1, phase]);

  // 描述2打字效果
  useEffect(() => {
    if (phase !== 'desc2') return;
    
    if (desc2Index < desc2.length) {
      const timer = setTimeout(() => {
        setDesc2Index(desc2Index + 1);
      }, TYPING_SPEED.desc);
      return () => clearTimeout(timer);
    } else {
      setPhase('done');
    }
  }, [desc2Index, desc2, phase]);

  // 光标闪烁动画
  const cursorVariants = {
    blink: {
      opacity: [1, 0, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: 'linear',
      },
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      position: 'relative', 
      zIndex: 1,
    }}>
      {/* SVG 签名 - 绝对定位作为背景层，在名字上方显示，打字完成后出现 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: phase === 'done' ? 1 : 0,
          scale: phase === 'done' ? 1 : 0.9,
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%) translateY(-30%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {phase === 'done' && (
          <AnimatedSignature 
            isDark={isDark} 
            width={600} 
            height={375} 
            duration={0.8}
            strokeWidth={1.5}
            initialDelay={0.2}
            style={{ opacity: 0.12 }}
          />
        )}
      </motion.div>

      {/* 主标题 */}
      <h1 style={{ 
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(3rem, 10vw, 8rem)', 
        fontWeight: '400', 
        lineHeight: 1.1, 
        marginBottom: '24px', 
        letterSpacing: '-0.02em',
        color: 'var(--color-text-main)',
        minHeight: 'clamp(3.5rem, 11vw, 9rem)', // 防止布局跳动
      }}>
        {name.substring(0, nameIndex)}
        <Cursor show={phase === 'name'} size="large" />
      </h1>

      {/* 职位标签 */}
      <h2 style={{ 
        fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', 
        fontWeight: '500', 
        color: 'var(--color-text-muted)', 
        marginBottom: '40px', 
        fontFamily: 'var(--font-sans)',
        textTransform: 'uppercase',
        letterSpacing: '4px',
        minHeight: 'clamp(1rem, 1.5vw, 1.2rem)', // 防止布局跳动
        visibility: phase === 'name' ? 'hidden' : 'visible',
      }}>
        {role.substring(0, roleIndex)}
        <Cursor show={phase === 'role'} size="medium" />
      </h2>

      {/* 描述文字 */}
      <div style={{ 
        maxWidth: '520px', 
        margin: '0 auto',
        minHeight: '80px', // 防止布局跳动
      }}>
        <p style={{ 
          fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)', 
          color: 'var(--color-text-secondary)', 
          lineHeight: 1.9, 
          margin: 0,
          visibility: (phase === 'name' || phase === 'role') ? 'hidden' : 'visible',
        }}>
          {desc1.substring(0, desc1Index)}
          <Cursor show={phase === 'desc1'} size="normal" />
        </p>
        <p style={{ 
          fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)', 
          color: 'var(--color-text-secondary)', 
          lineHeight: 1.9, 
          margin: 0,
          marginTop: '8px',
          visibility: (phase === 'name' || phase === 'role' || phase === 'desc1') ? 'hidden' : 'visible',
        }}>
          {desc2.substring(0, desc2Index)}
          <Cursor show={phase === 'desc2' || phase === 'done'} size="normal" />
        </p>
      </div>
    </div>
  );
};

export default TypewriterHero;

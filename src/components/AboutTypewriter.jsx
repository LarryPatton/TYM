import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * About 页面第一屏打字机效果组件
 * 依次打出: 标题 -> 第一段 -> 第二段 -> 第三段 -> 第四段
 */
const AboutTypewriter = ({ 
  greeting, 
  line1, 
  line2, 
  line3, 
  line4, 
  colors,
  onComplete,
}) => {
  // 打字状态
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [line1Index, setLine1Index] = useState(0);
  const [line2Index, setLine2Index] = useState(0);
  const [line3Index, setLine3Index] = useState(0);
  const [line4Index, setLine4Index] = useState(0);
  
  // 当前打字阶段
  const [phase, setPhase] = useState('greeting');
  
  // 🌐 语言切换时重置状态：当 props 变化时，如果已完成打字则立即显示完整内容
  useEffect(() => {
    if (phase === 'done') {
      setGreetingIndex(greeting.length);
      setLine1Index(line1.length);
      setLine2Index(line2.length);
      setLine3Index(line3.length);
      setLine4Index(line4.length);
    }
  }, [greeting, line1, line2, line3, line4, phase]);
  
  // 打字速度配置（毫秒）
  const TYPING_SPEED = {
    greeting: 80,    // 标题打字稍慢
    line: 25,        // 正文打字较快
    pauseBetween: 200, // 段落间停顿
  };

  // 标题打字效果
  useEffect(() => {
    if (phase !== 'greeting') return;
    if (greetingIndex < greeting.length) {
      const timer = setTimeout(() => setGreetingIndex(greetingIndex + 1), TYPING_SPEED.greeting);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase('line1'), TYPING_SPEED.pauseBetween);
      return () => clearTimeout(timer);
    }
  }, [greetingIndex, greeting, phase]);

  // Line1 打字效果
  useEffect(() => {
    if (phase !== 'line1') return;
    if (line1Index < line1.length) {
      const timer = setTimeout(() => setLine1Index(line1Index + 1), TYPING_SPEED.line);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase('line2'), TYPING_SPEED.pauseBetween);
      return () => clearTimeout(timer);
    }
  }, [line1Index, line1, phase]);

  // Line2 打字效果
  useEffect(() => {
    if (phase !== 'line2') return;
    if (line2Index < line2.length) {
      const timer = setTimeout(() => setLine2Index(line2Index + 1), TYPING_SPEED.line);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase('line3'), TYPING_SPEED.pauseBetween);
      return () => clearTimeout(timer);
    }
  }, [line2Index, line2, phase]);

  // Line3 打字效果
  useEffect(() => {
    if (phase !== 'line3') return;
    if (line3Index < line3.length) {
      const timer = setTimeout(() => setLine3Index(line3Index + 1), TYPING_SPEED.line);
      return () => clearTimeout(timer);
    } else {
      // 如果 line4 为空，直接完成；否则继续到 line4
      const nextPhase = (line4 && line4.trim()) ? 'line4' : 'done';
      const timer = setTimeout(() => {
        setPhase(nextPhase);
        if (nextPhase === 'done') onComplete?.();
      }, TYPING_SPEED.pauseBetween);
      return () => clearTimeout(timer);
    }
  }, [line3Index, line3, line4, phase, onComplete]);

  // Line4 打字效果
  useEffect(() => {
    if (phase !== 'line4') return;
    if (line4Index < line4.length) {
      const timer = setTimeout(() => setLine4Index(line4Index + 1), TYPING_SPEED.line);
      return () => clearTimeout(timer);
    } else {
      setPhase('done');
      onComplete?.();
    }
  }, [line4Index, line4, phase, onComplete]);

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
    const height = size === 'large' ? 'clamp(1.8rem, 3vw, 2.6rem)' : 'clamp(0.9rem, 1vw, 1.05rem)';
    const width = size === 'large' ? '3px' : '2px';
    return (
      <motion.span
        variants={cursorVariants}
        animate="blink"
        style={{
          display: 'inline-block',
          width,
          height,
          backgroundColor: colors.text,
          marginLeft: '3px',
          verticalAlign: 'middle',
        }}
      />
    );
  };

  return (
    <div>
      {/* 标题：你好，我是甜羊。 */}
      <h1 style={{ 
        fontFamily: 'var(--font-serif)', 
        fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', 
        fontWeight: '400', 
        marginBottom: 'clamp(16px, 2vw, 24px)', 
        lineHeight: 1.2, 
        color: colors.text,
        minHeight: 'clamp(2.2rem, 3.6vw, 3.1rem)', // 预留高度防止跳动
      }}>
        {greeting.substring(0, greetingIndex)}
        <Cursor show={phase === 'greeting'} size="large" />
      </h1>

      {/* 四行介绍文字 */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'clamp(10px, 1.5vw, 16px)', 
        color: colors.textMuted, 
        fontSize: 'clamp(0.9rem, 1vw, 1.05rem)', 
        lineHeight: 1.7 
      }}>
        {/* Line 1 */}
        <p style={{ 
          margin: 0,
          minHeight: '1.7em',
          visibility: phase === 'greeting' ? 'hidden' : 'visible',
        }}>
          {line1.substring(0, line1Index)}
          <Cursor show={phase === 'line1'} />
        </p>

        {/* Line 2 */}
        <p style={{ 
          margin: 0,
          minHeight: '1.7em',
          visibility: ['greeting', 'line1'].includes(phase) ? 'hidden' : 'visible',
        }}>
          {line2.substring(0, line2Index)}
          <Cursor show={phase === 'line2'} />
        </p>

        {/* Line 3 */}
        <p style={{ 
          margin: 0,
          minHeight: '1.7em',
          visibility: ['greeting', 'line1', 'line2'].includes(phase) ? 'hidden' : 'visible',
        }}>
          {line3.substring(0, line3Index)}
          <Cursor show={phase === 'line3'} />
        </p>

        {/* Line 4 - 仅在有内容时渲染 */}
        {line4 && line4.trim() && (
          <p style={{ 
            margin: 0,
            minHeight: '1.7em',
            visibility: phase === 'done' || phase === 'line4' ? 'visible' : 'hidden',
          }}>
            {line4.substring(0, line4Index)}
            <Cursor show={phase === 'line4' || phase === 'done'} />
          </p>
        )}
      </div>
    </div>
  );
};

export default AboutTypewriter;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Work/Gallery 页面打字机效果组件
 * 依次打出: 标题 -> 描述 -> CTA
 * 在图片斜切动画完成后开始（通过 startDelay 控制）
 * 
 * 布局结构：
 * - 整体容器：在页面中垂直居中
 * - 遮罩条：横穿整个屏幕宽度
 * - 文字+CTA Group：在遮罩内左对齐（带左边距），垂直居中
 */
const WorkGalleryTypewriter = ({ 
  title, 
  description, 
  ctaText,
  ctaLink,
  tags = [], // 可选的标签组
  styles,
  isDark,
  startDelay = 3500, // 默认等待 3.5 秒（斜切动画完成）
  onComplete,
}) => {
  // 打字状态
  const [titleIndex, setTitleIndex] = useState(0);
  const [descIndex, setDescIndex] = useState(0);
  
  // 当前打字阶段: 'waiting' -> 'title' -> 'desc' -> 'done'
  const [phase, setPhase] = useState('waiting');
  
  // 打字速度配置（毫秒）
  const TYPING_SPEED = {
    title: 50,       // 标题打字
    desc: 20,        // 描述打字较快
    pauseBetween: 150, // 段落间停顿
  };

  // 🌐 语言切换时重置状态：当 title 或 description 变化时，重新开始打字
  useEffect(() => {
    // 如果已经完成打字（phase === 'done'），切换语言后需要立即显示完整内容
    if (phase === 'done') {
      setTitleIndex(title.length);
      setDescIndex(description.length);
    }
  }, [title, description, phase]);

  // 遮罩显示状态（比文字早 500ms 出现）
  const [showMask, setShowMask] = useState(false);
  
  // 遮罩先出现
  useEffect(() => {
    const maskDelay = Math.max(0, startDelay - 500); // 比文字早 500ms
    const timer = setTimeout(() => setShowMask(true), maskDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);
  
  // 等待开始延迟
  useEffect(() => {
    const timer = setTimeout(() => setPhase('title'), startDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);

  // 标题打字效果
  useEffect(() => {
    if (phase !== 'title') return;
    if (titleIndex < title.length) {
      const timer = setTimeout(() => setTitleIndex(titleIndex + 1), TYPING_SPEED.title);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase('desc'), TYPING_SPEED.pauseBetween);
      return () => clearTimeout(timer);
    }
  }, [titleIndex, title, phase]);

  // 描述打字效果
  useEffect(() => {
    if (phase !== 'desc') return;
    if (descIndex < description.length) {
      const timer = setTimeout(() => setDescIndex(descIndex + 1), TYPING_SPEED.desc);
      return () => clearTimeout(timer);
    } else {
      setPhase('done');
      onComplete?.();
    }
  }, [descIndex, description, phase, onComplete]);

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
    const height = size === 'large' ? 'clamp(2.5rem, 6vw, 5rem)' : 'clamp(1rem, 1.5vw, 1.2rem)';
    const width = size === 'large' ? '4px' : '2px';
    return (
      <motion.span
        variants={cursorVariants}
        animate="blink"
        style={{
          display: 'inline-block',
          width,
          height,
          backgroundColor: styles.title?.color || '#fff',
          marginLeft: '4px',
          verticalAlign: 'middle',
        }}
      />
    );
  };

  // 标签组和CTA的淡入动画
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // 遮罩从左往右展开动画
  const maskVariants = {
    hidden: { 
      scaleX: 0,
      opacity: 1,
    },
    visible: { 
      scaleX: 1,
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] // 平滑缓动
      }
    }
  };

  // 遮罩条的内边距（上下）
  const maskPaddingY = 'clamp(30px, 4vh, 60px)';

  return (
    // 最外层容器：在页面中垂直居中，占满整个视口
    <div style={{ 
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center', // 垂直居中
      justifyContent: 'flex-start', // 水平靠左
      zIndex: 20,
      pointerEvents: 'none', // 不阻挡背景点击
    }}>
      {/* 遮罩 + 内容 整体容器 - 三者一体 */}
      <div style={{
        position: 'relative',
        width: '100%',
        pointerEvents: 'auto', // 恢复点击
      }}>
        {/* 遮罩条背景 - 横穿整个屏幕 */}
        <motion.div
          initial="hidden"
          animate={showMask ? 'visible' : 'hidden'}
          variants={maskVariants}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transformOrigin: 'left center', // 从左边开始展开
            background: 'rgba(0, 0, 0, 0.5)', // 50% 透明度
            zIndex: -1, // 在内容后面
          }}
        />
        
        {/* 内容区域 - 文字+CTA Group，在遮罩内居中 */}
        <div style={{ 
          padding: `${maskPaddingY} clamp(60px, 10vw, 120px)`, // 上下内边距 + 左右边距
          maxWidth: 'clamp(500px, 60vw, 750px)', // 内容最大宽度
        }}>
          {/* 标题 - 打字效果，响应式字体 */}
          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: 'clamp(1.8rem, 4vw, 4rem)', // 响应式字体大小
            fontWeight: styles.title?.fontWeight || '400',
            lineHeight: 1.1, 
            whiteSpace: 'nowrap',
            color: styles.title?.color || '#fff',
            textShadow: styles.title?.textShadow || 'none',
            minHeight: 'clamp(2.2rem, 5vw, 5rem)', // 响应式预留高度
            margin: 0,
          }}>
            {phase !== 'waiting' && title.substring(0, titleIndex)}
            <Cursor show={phase === 'title'} size="large" />
          </h2>

          {/* 描述 - 打字效果，响应式字体和间距 */}
          <p style={{ 
            fontSize: 'clamp(1rem, 1.4vw, 1.3rem)', // 响应式字体大小（增大20%）
            lineHeight: 1.6, // 固定行高
            maxWidth: 'clamp(400px, 50vw, 600px)',
            color: styles.desc?.color || '#ccc',
            textShadow: styles.desc?.textShadow || 'none',
            minHeight: 'clamp(2.5em, 3em, 3.6em)', // 响应式预留高度
            visibility: phase === 'waiting' || phase === 'title' ? 'hidden' : 'visible',
            margin: 'clamp(12px, 2vw, 24px) 0 clamp(16px, 2vw, 28px) 0', // 紧凑间距
          }}>
            {description.substring(0, descIndex)}
            <Cursor show={phase === 'desc'} />
          </p>

          {/* 标签组 - 淡入效果 */}
          {tags.length > 0 && (
            <motion.div 
              initial="hidden"
              animate={phase === 'done' ? 'visible' : 'hidden'}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
              style={{ 
                display: 'flex', 
                gap: '12px', 
                flexWrap: 'wrap', 
                marginBottom: 'clamp(16px, 2vw, 28px)',
                visibility: phase === 'done' ? 'visible' : 'hidden',
              }}
            >
              {tags.map(tag => (
                <motion.span 
                  key={tag} 
                  variants={fadeInVariants}
                  whileHover={{ scale: 1.05 }}
                  style={{ 
                    padding: '8px 20px', 
                    borderRadius: '100px', 
                    fontSize: '0.9rem',
                    ...styles.tag
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          )}

          {/* CTA - 淡入效果，亮色实心按钮样式 */}
          <motion.div 
            initial="hidden"
            animate={phase === 'done' ? 'visible' : 'hidden'}
            variants={fadeInVariants}
            style={{ 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px',
              visibility: phase === 'done' ? 'visible' : 'hidden',
              padding: '14px 28px',
              background: 'rgba(255, 255, 255, 0.95)', // 白色背景（更醒目）
              color: '#111', // 深色文字
              borderRadius: '100px', // 圆角胶囊形
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)', // 增强阴影提升层次
              border: 'none',
            }}
          >
            {ctaText} 
            <motion.span 
              style={{ fontSize: '1.2rem', display: 'inline-block' }}
              animate={phase === 'done' ? { x: [0, 5, 0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorkGalleryTypewriter;
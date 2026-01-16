import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useScreenTransition } from './TransitionContext';

// ============================================
// 流式文字组件 - 逐字出现效果
// ============================================
const StreamingText = ({ text, progress, highlightWords = [], highlightColor = '#FF4600', style = {} }) => {
  const chars = text.split('');
  
  return (
    <motion.p style={{ margin: 0, ...style }}>
      {chars.map((char, index) => {
        // 计算每个字符的出现时机 (0 到 1 之间均匀分布)
        const charStart = index / chars.length;
        const charEnd = (index + 1) / chars.length;
        
        // 检查当前字符是否属于高亮词
        let isHighlight = false;
        let currentPos = 0;
        for (let i = 0; i < index; i++) {
          currentPos++;
        }
        
        // 简单检查：遍历高亮词，看当前位置是否在其中
        highlightWords.forEach(word => {
          const wordStart = text.indexOf(word);
          if (wordStart !== -1 && index >= wordStart && index < wordStart + word.length) {
            isHighlight = true;
          }
        });
        
        return (
          <motion.span
            key={index}
            style={{
              opacity: useTransform(progress, [charStart, charEnd], [0, 1]),
              color: isHighlight ? highlightColor : undefined,
              fontWeight: isHighlight ? '500' : undefined,
              display: 'inline-block',
              whiteSpace: char === ' ' ? 'pre' : 'normal'
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </motion.p>
  );
};

// ============================================
// 稳定性原则文字高亮组件 (StabilityMessageScreen)
// 纯色背景 + 流式文字加载
// 
// 过渡配置位置: src/config/transitionConfig.js → SCREEN_TRANSITIONS['stability-message']
// ============================================
export const StabilityMessageScreen = () => {
  const ref = useRef(null);
  
  // 获取过渡配置 (支持实时调试)
  const T = useScreenTransition('stability-message');
  
  // ============================================
  // 【滚动监听配置】
  // ============================================
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // ============================================
  // 【品牌色定义】
  // ============================================
  const brandColor = '#FF4600';

  // ============================================
  // 【动效参数 - 从统一配置读取】
  // 修改过渡效果请编辑: src/config/transitionConfig.js
  // ============================================
  
  // 流式文字进度
  const line1Progress = useTransform(scrollYProgress, T.line1Progress.scrollRange, T.line1Progress.valueRange);
  const line2Progress = useTransform(scrollYProgress, T.line2Progress.scrollRange, T.line2Progress.valueRange);
  const line3Progress = useTransform(scrollYProgress, T.line3Progress.scrollRange, T.line3Progress.valueRange);

  // STABILITY 大字动画
  const stabilityOpacity = useTransform(scrollYProgress, T.stabilityOpacity.scrollRange, T.stabilityOpacity.valueRange);
  const stabilityScale = useTransform(scrollYProgress, T.stabilityScale.scrollRange, T.stabilityScale.valueRange);

  // 结论文字动画
  const conclusionOpacity = useTransform(scrollYProgress, T.conclusionOpacity.scrollRange, T.conclusionOpacity.valueRange);
  const conclusionY = useTransform(scrollYProgress, T.conclusionY.scrollRange, T.conclusionY.valueRange);

  // 离场动画
  const containerOpacity = useTransform(scrollYProgress, T.containerExitOpacity.scrollRange, T.containerExitOpacity.valueRange);
  const linesOpacity = useTransform(scrollYProgress, T.linesExitOpacity.scrollRange, T.linesExitOpacity.valueRange);
  
  // 滚动提示显隐
  const scrollHintOpacity = useTransform(scrollYProgress, T.scrollHintOpacity.scrollRange, T.scrollHintOpacity.valueRange);

  // 文字基础样式
  const textBaseStyle = {
    fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)', 
    lineHeight: 1.8, 
    fontWeight: '300', 
    color: 'rgba(255,255,255,0.9)', 
    fontFamily: 'var(--font-serif)',
    letterSpacing: '0.5px'
  };

  return (
    <div ref={ref} style={{ 
      height: '350vh',
      position: 'relative',
      background: '#0a0a0a' // 纯色背景，与上一屏一致
    }}>
      {/* Sticky 容器 */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '0 40px',
        overflow: 'hidden',
        background: '#0a0a0a' // 确保 sticky 容器也是纯色
      }}>
        
        {/* 主内容区域 */}
        <motion.div 
          style={{ 
            maxWidth: '900px', 
            width: '100%',
            textAlign: 'center',
            opacity: containerOpacity,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          {/* 文字容器 */}
          <motion.div style={{ opacity: linesOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            {/* 第一句 */}
            <StreamingText 
              text="标志设计并非追求形式复杂，而是强调结构稳定性。"
              progress={line1Progress}
              highlightWords={['结构稳定性']}
              highlightColor={brandColor}
              style={textBaseStyle}
            />

            {/* 第二句 */}
            <StreamingText 
              text="通过简洁且可控制的结构逻辑，"
              progress={line2Progress}
              style={{ ...textBaseStyle, color: 'rgba(255,255,255,0.7)' }}
            />

            {/* 第三句 */}
            <StreamingText 
              text="确保标志在不同尺寸与媒介中保持一致识别。"
              progress={line3Progress}
              highlightWords={['一致识别']}
              highlightColor="rgba(255,255,255,1)"
              style={{ ...textBaseStyle, color: 'rgba(255,255,255,0.7)' }}
            />
          </motion.div>

          {/* 分隔空间 */}
          <div style={{ height: '50px' }} />

          {/* STABILITY 大字 */}
          <motion.div 
            style={{ 
              fontSize: 'clamp(4rem, 12vw, 9rem)',
              fontWeight: '900', 
              color: 'transparent',
              WebkitTextStroke: `1.5px ${brandColor}`,
              fontFamily: 'var(--font-sans)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              opacity: stabilityOpacity,
              scale: stabilityScale
            }}
          >
            STABILITY
          </motion.div>
          
          {/* 稳定性 > 表现力 */}
          <motion.div 
            style={{ 
              fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', 
              fontWeight: 'bold', 
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '3px',
              textShadow: `0 0 30px ${brandColor}`,
              opacity: conclusionOpacity,
              y: conclusionY
            }}
          >
            稳定性 &gt; 表现力
          </motion.div>
        </motion.div>

        {/* 滚动提示 - 在展示完毕后出现 */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: scrollHintOpacity,
            zIndex: 5
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ 
              color: 'rgba(255,255,255,0.3)',
              fontSize: '1.5rem'
            }}
          >
            ↓
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};
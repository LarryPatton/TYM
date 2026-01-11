import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';

// ============================================
// 屏幕 01: 阶段引导页 (IntroScreen)
// 优化版：极简质感，深色过渡，中心扩散揭示效果
// ============================================
export const IntroScreen = ({ 
  phaseNumber, 
  titleEn, 
  titleZh, 
  content, 
  imageHint = '极简视觉：品牌标志展示',
  bgImage = null,
  showScrollHint = true 
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"] // 监听整个 250vh 的滚动过程
  });
  
  // 遮罩扩散效果
  // 0% -> 120%: 随着滚动，透明圆孔（揭示区域）从 0 扩大到覆盖全屏
  const maskRadius = useTransform(scrollYProgress, [0, 0.6], ["0%", "150%"]);
  
  // 呼呼吸层的不透明度：一旦开始滚动，迅速消失
  const breathingLayerOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  
  // 2. 文字离场阶段 (60% - 100%)
  // 迷雾散完后，文字才开始上移淡出
  const textY = useTransform(scrollYProgress, [0.6, 1], ["0%", "-50%"]);
  const textOpacity = useTransform(scrollYProgress, [0.6, 0.9], [1, 0]);
  
  // 3. 背景视差 (贯穿全程)
  // 稍微移动一点点，保持生动感，但不要移太多导致露底
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  // 动态生成 mask-image
  const maskImage = useMotionTemplate`radial-gradient(circle at center, transparent ${maskRadius}, black calc(${maskRadius} + 20%))`;

  return (
    <section ref={ref} style={{
      height: '250vh', // 增加高度，创造“停留”的时间
      width: '100%',
      position: 'relative',
      background: '#0a0a0a'
    }}>
      {/* Sticky 容器：将视觉内容固定在视口 */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* 1. 背景层 */}
        <motion.div style={{
          position: 'absolute',
          inset: 0,
          y: bgY, // 轻微视差
          zIndex: 0
        }}>
          {/* 1.1 底层：鲜艳的原始图片 */}
          <div style={{
            width: '100%',
            height: '120%', // 稍微冗余一点高度
            background: bgImage 
              ? `url(${import.meta.env.BASE_URL}${bgImage.replace(/^\//, '')}) center center / cover no-repeat` 
              : 'var(--color-bg-alt)',
            position: 'absolute',
            top: '-10%',
            left: 0,
            filter: 'brightness(1.1) saturate(1.1)'
          }} />
          
          {/* 1.2 顶层：黑色遮罩层 (随滚动被挖空) */}
          <motion.div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.9)', // 加深遮罩，初始几乎全黑
              zIndex: 1,
              WebkitMaskImage: maskImage,
              maskImage: maskImage
            }} 
          />

          {/* 1.3 呼呼吸层：仅在未滚动时显示，提供初始的呼吸引导 */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.9)',
              zIndex: 2, // 在普通遮罩之上
              opacity: breathingLayerOpacity,
              pointerEvents: 'none' // 不阻挡交互
            }}
            animate={{
              WebkitMaskImage: [
                "radial-gradient(circle at center, transparent 0%, black 10%)", // 初始：完全闭合
                "radial-gradient(circle at center, transparent 8%, black 25%)", // 扩张：幅度增大到 8%
                "radial-gradient(circle at center, transparent 0%, black 10%)"  // 收缩：回到闭合
              ],
              maskImage: [
                "radial-gradient(circle at center, transparent 0%, black 10%)",
                "radial-gradient(circle at center, transparent 8%, black 25%)",
                "radial-gradient(circle at center, transparent 0%, black 10%)"
              ]
            }}
            transition={{
              duration: 3, // 速度加快：4s -> 3s
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* 1.5 底部渐变过渡 - 固定在 Sticky 容器底部 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50vh',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.7) 50%, #0a0a0a 100%)',
          zIndex: 3,
          pointerEvents: 'none'
        }} />

        {/* 2. 内容层 */}
        <motion.div 
          style={{ 
            zIndex: 10, 
            textAlign: 'center', 
            maxWidth: '1000px',
            padding: '0 var(--space-xl)',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            y: textY, // 后半段才移动
            opacity: textOpacity // 后半段才淡出
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Phase Label */}
            <div style={{
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              marginBottom: '24px',
              color: '#fff',
              opacity: 0.7,
              fontWeight: '500',
              fontFamily: 'var(--font-sans)'
            }}>
              Phase {phaseNumber}
            </div>

            {/* English Title */}
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(3.5rem, 8vw, 6rem)',
              fontWeight: '400',
              lineHeight: 1.1,
              marginBottom: '16px',
              letterSpacing: '-0.02em',
              color: '#fff',
              textShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              {titleEn}
            </h1>

            {/* Chinese Title */}
            <div style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              color: '#fff',
              opacity: 0.9,
              marginBottom: '48px',
              fontWeight: '300',
              letterSpacing: '0.2em',
              fontFamily: 'var(--font-sans)'
            }}>
              {titleZh}
            </div>

            {/* Description */}
            <div style={{
              width: '1px',
              height: '40px',
              background: 'rgba(255,255,255,0.3)',
              margin: '0 auto 40px auto'
            }} />

            <p style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: 1.8,
              maxWidth: '640px',
              margin: '0 auto',
              color: '#fff',
              opacity: 0.8,
              fontWeight: '300',
              fontFamily: 'var(--font-sans)',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              {content}
            </p>
          </motion.div>
        </motion.div>

        {/* 3. 滚动提示 - 随文字一起淡出 */}
        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              color: '#fff',
              opacity: textOpacity // 绑定透明度
            }}
          >
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ 
                fontSize: '0.75rem', 
                letterSpacing: '3px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                textTransform: 'uppercase'
              }}
            >
              <span>Scroll</span>
              <div style={{ 
                width: '1px', 
                height: '24px', 
                background: 'linear-gradient(to bottom, #fff, transparent)' 
              }} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
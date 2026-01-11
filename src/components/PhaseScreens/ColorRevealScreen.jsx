import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ============================================
// 屏幕: 色彩揭示 (ColorRevealScreen)
// 优化版：更精致的视觉呈现
// ============================================
export const ColorRevealScreen = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 品牌橙色
  const brandColor = '#FF4600';
  const brandColorLight = '#FF7A3D';

  // 1. 粒子数据生成
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const isOrange = i % 5 === 0;
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: isOrange ? Math.random() * 30 + 20 : Math.random() * 20 + 10,
        color: isOrange ? brandColor : ['#FF4D4D', '#8A2BE2', '#007AFF', '#00CED1', '#FFD700'][Math.floor(Math.random() * 5)],
        isTarget: isOrange
      };
    });
  }, []);

  // 2. 动画控制
  const convergenceProgress = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const explosionScale = useTransform(scrollYProgress, [0.6, 0.8], [1, 50]);
  const explosionOpacity = useTransform(scrollYProgress, [0.75, 0.8], [1, 0]);
  const backgroundColor = useTransform(scrollYProgress, [0.7, 0.8], ['#0a0a0a', brandColor]);

  // 阶段 3: 文字内容动画
  const contentOpacity = useTransform(scrollYProgress, [0.8, 0.88], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.8, 0.88], [40, 0]);
  
  // 关键词圆圈依次出现
  const circle1Opacity = useTransform(scrollYProgress, [0.82, 0.88], [0, 1]);
  const circle1Scale = useTransform(scrollYProgress, [0.82, 0.88], [0.8, 1]);
  const circle2Opacity = useTransform(scrollYProgress, [0.85, 0.91], [0, 1]);
  const circle2Scale = useTransform(scrollYProgress, [0.85, 0.91], [0.8, 1]);
  const circle3Opacity = useTransform(scrollYProgress, [0.88, 0.94], [0, 1]);
  const circle3Scale = useTransform(scrollYProgress, [0.88, 0.94], [0.8, 1]);

  // 关键词数据
  const keywords = [
    { text: '快乐', sub: 'JOY', opacity: circle1Opacity, scale: circle1Scale },
    { text: '创造力', sub: 'CREATIVITY', opacity: circle2Opacity, scale: circle2Scale },
    { text: '趣味', sub: 'FUN', opacity: circle3Opacity, scale: circle3Scale }
  ];

  return (
    <div ref={containerRef} style={{ height: '400vh', background: '#0a0a0a' }}>
      <motion.div 
        style={{ 
          position: 'sticky', 
          top: 0, 
          height: '100vh', 
          width: '100%', 
          overflow: 'hidden',
          background: backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* 粒子层 */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {particles.map((p) => {
            const initialX = p.x;
            const initialY = p.y;
            const targetX = 50;
            const targetY = 50;
            const dx = p.x - 50;
            const dy = p.y - 50;
            const angle = Math.atan2(dy, dx);
            const distance = 100;
            const disperseX = 50 + Math.cos(angle) * distance;
            const disperseY = 50 + Math.sin(angle) * distance;

            const x = useTransform(convergenceProgress, [0, 1], [`${initialX}vw`, p.isTarget ? `${targetX}vw` : `${disperseX}vw`]);
            const y = useTransform(convergenceProgress, [0, 1], [`${initialY}vh`, p.isTarget ? `${targetY}vh` : `${disperseY}vh`]);
            const opacity = useTransform(convergenceProgress, [0, 0.8, 1], [1, p.isTarget ? 1 : 0, 0]);
            const scale = useTransform(convergenceProgress, [0, 1], [1, p.isTarget ? 1.5 : 0]);

            return (
              <motion.div
                key={p.id}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: p.size,
                  height: p.size,
                  borderRadius: '50%',
                  background: p.color,
                  x,
                  y,
                  opacity,
                  scale,
                  filter: 'blur(1px)',
                  boxShadow: p.isTarget ? `0 0 20px ${brandColor}` : '0 0 10px rgba(255,255,255,0.3)',
                  zIndex: p.isTarget ? 10 : 1
                }}
              />
            );
          })}
        </div>

        {/* 爆炸层 */}
        <motion.div
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: brandColor,
            scale: explosionScale,
            opacity: explosionOpacity,
            zIndex: 10
          }}
        />

        {/* 内容层 */}
        <motion.div
          style={{
            position: 'relative',
            zIndex: 20,
            opacity: contentOpacity,
            y: contentY,
            textAlign: 'center',
            color: '#fff',
            width: '100%',
            maxWidth: '1000px',
            padding: '0 40px'
          }}
        >
          {/* 顶部标签 */}
          <div style={{
            fontSize: '0.8rem',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '50px',
            opacity: 0.7
          }}>
            Brand Color · 品牌色彩
          </div>

          {/* 圆圈关键词 - 优化版 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '40px', 
            marginBottom: '60px',
            flexWrap: 'wrap'
          }}>
            {keywords.map((item, i) => (
              <motion.div 
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                  opacity: item.opacity,
                  scale: item.scale
                }}
              >
                {/* 圆圈 */}
                <div 
                  style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(255,255,255,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <span style={{ 
                    fontSize: '1.6rem', 
                    fontWeight: '500',
                    letterSpacing: '2px'
                  }}>
                    {item.text}
                  </span>
                </div>
                {/* 英文标签 */}
                <span style={{
                  fontSize: '0.7rem',
                  letterSpacing: '3px',
                  opacity: 0.5,
                  textTransform: 'uppercase'
                }}>
                  {item.sub}
                </span>
              </motion.div>
            ))}
          </div>

          {/* 分割线 */}
          <div style={{
            width: '60px',
            height: '1px',
            background: 'rgba(255,255,255,0.3)',
            margin: '0 auto 40px auto'
          }} />

          {/* 底部文案 */}
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
            fontWeight: '300', 
            letterSpacing: '3px',
            marginBottom: '16px',
            fontFamily: 'var(--font-serif)'
          }}>
            橙色的情绪感受
          </h2>
          <p style={{ 
            opacity: 0.7, 
            fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
            lineHeight: 1.8,
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            活力与温暖的结合，激发无限创意与探索欲
          </p>

          {/* 底部色值标注 */}
          <div style={{
            marginTop: '50px',
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            opacity: 0.6,
            fontSize: '0.75rem',
            letterSpacing: '1px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                background: brandColor, 
                borderRadius: '2px' 
              }} />
              <span>Primary · {brandColor}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                background: brandColorLight, 
                borderRadius: '2px' 
              }} />
              <span>Light · {brandColorLight}</span>
            </div>
          </div>
        </motion.div>

        {/* 滚动提示 */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '40px',
            color: '#fff',
            opacity: useTransform(scrollYProgress, [0, 0.1], [0.6, 0]),
            fontSize: '0.75rem',
            letterSpacing: '3px',
            textTransform: 'uppercase'
          }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Scroll
        </motion.div>

      </motion.div>
    </div>
  );
};
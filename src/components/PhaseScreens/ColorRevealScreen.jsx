import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ============================================
// 屏幕: 色彩揭示 (ColorRevealScreen)
// 优化版：更精致的视觉呈现
// ============================================
export const ColorRevealScreen = () => {
  const containerRef = useRef(null);
  
  // ============================================
  // 【滚动监听配置】
  // ============================================
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]    // 滚动范围: 元素顶部对齐视口顶部 → 元素底部对齐视口底部
  });

  // ============================================
  // 【品牌色定义】
  // ============================================
  const brandColor = '#FF4600';           // 品牌主色: 鲜橙色
  const brandColorLight = '#FF7A3D';      // 品牌亮色: 浅橙色

  // ============================================
  // 【粒子数据生成】
  // ============================================
  
  /**
   * 粒子配置
   * - 共 50 个粒子，每 5 个中有 1 个是橙色 (品牌色)
   * - 橙色粒子是"目标粒子"，会向中心聚合
   * - 其他颜色粒子会向外散开
   * 
   * 可调参数:
   * - length: 50 - 粒子总数
   * - i % 5 === 0 - 每5个粒子中有1个是橙色
   * - size 范围 - 橙色粒子更大 (20-50px)，其他更小 (10-30px)
   */
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const isOrange = i % 5 === 0;       // 每5个粒子中有1个是橙色
      return {
        id: i,
        x: Math.random() * 100,           // 初始 X 位置 (0-100vw)
        y: Math.random() * 100,           // 初始 Y 位置 (0-100vh)
        size: isOrange ? Math.random() * 30 + 20 : Math.random() * 20 + 10, // 粒子大小
        color: isOrange ? brandColor : ['#FF4D4D', '#8A2BE2', '#007AFF', '#00CED1', '#FFD700'][Math.floor(Math.random() * 5)],
        isTarget: isOrange                // 是否为目标粒子 (向中心聚合)
      };
    });
  }, []);

  // ============================================
  // 【动画时间线设计】(总滚动高度 400vh)
  // ============================================
  // 0.0 - 0.1:  静态等待
  // 0.1 - 0.5:  粒子聚合阶段 (橙色向中心，其他散开)
  // 0.6 - 0.8:  爆炸扩散阶段 (中心圆形放大)
  // 0.7 - 0.8:  背景色切换 (黑色 → 橙色)
  // 0.8 - 0.88: 文字内容淡入
  // 0.82 - 0.94: 关键词圆圈依次出现
  // ============================================

  // ============================================
  // 【动效参数 - 粒子聚合动画】
  // ============================================
  
  /**
   * 粒子聚合进度
   * - 滚动进度 10% → 50%: 从 0 到 1
   * - 效果: 控制粒子从散开状态向中心/外围移动的进度
   * 
   * 可调参数:
   * - [0.1, 0.5]: 聚合动画的滚动区间
   * - [0, 1]: 进度范围
   */
  const convergenceProgress = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  
  // ============================================
  // 【动效参数 - 爆炸扩散动画】
  // ============================================
  
  /**
   * 爆炸圆形缩放
   * - 滚动进度 60% → 80%: 从 1 倍放大到 50 倍
   * - 效果: 中心圆形急剧放大，填满屏幕
   * 
   * 可调参数:
   * - [0.6, 0.8]: 爆炸的滚动区间
   * - [1, 50]: 缩放范围 (1=原始大小, 50=放大50倍)
   */
  const explosionScale = useTransform(scrollYProgress, [0.6, 0.8], [1, 50]);
  
  /**
   * 爆炸圆形透明度
   * - 滚动进度 75% → 80%: 从完全可见到完全消失
   * - 效果: 爆炸圆形在放大过程中渐渐消失
   * 
   * 可调参数:
   * - [0.75, 0.8]: 淡出的滚动区间
   * - [1, 0]: 透明度范围
   */
  const explosionOpacity = useTransform(scrollYProgress, [0.75, 0.8], [1, 0]);
  
  /**
   * 背景色渐变
   * - 滚动进度 70% → 80%: 从深黑色过渡到品牌橙色
   * - 效果: 全屏背景色切换，强化品牌色视觉冲击
   * 
   * 可调参数:
   * - [0.7, 0.8]: 颜色过渡的滚动区间
   * - ['#0a0a0a', brandColor]: 起始和目标颜色
   */
  const backgroundColor = useTransform(scrollYProgress, [0.7, 0.8], ['#0a0a0a', brandColor]);

  // ============================================
  // 【动效参数 - 文字内容入场】
  // ============================================
  
  /**
   * 内容区透明度
   * - 滚动进度 80% → 88%: 淡入
   * - 效果: 背景色切换完成后，文字内容出现
   */
  const contentOpacity = useTransform(scrollYProgress, [0.8, 0.88], [0, 1]);
  
  /**
   * 内容区 Y 轴位移
   * - 滚动进度 80% → 88%: 从下方 40px 上浮到原位
   * - 效果: 上浮入场动画
   */
  const contentY = useTransform(scrollYProgress, [0.8, 0.88], [40, 0]);
  
  // ============================================
  // 【动效参数 - 关键词圆圈顺序出现】
  // ============================================
  
  /**
   * 第一个关键词 "快乐"
   * - 滚动进度 82% → 88%: 淡入 + 缩放
   */
  const circle1Opacity = useTransform(scrollYProgress, [0.82, 0.88], [0, 1]);
  const circle1Scale = useTransform(scrollYProgress, [0.82, 0.88], [0.8, 1]);
  
  /**
   * 第二个关键词 "创造力"
   * - 滚动进度 85% → 91%: 淡入 + 缩放
   */
  const circle2Opacity = useTransform(scrollYProgress, [0.85, 0.91], [0, 1]);
  const circle2Scale = useTransform(scrollYProgress, [0.85, 0.91], [0.8, 1]);
  
  /**
   * 第三个关键词 "趣味"
   * - 滚动进度 88% → 94%: 淡入 + 缩放
   */
  const circle3Opacity = useTransform(scrollYProgress, [0.88, 0.94], [0, 1]);
  const circle3Scale = useTransform(scrollYProgress, [0.88, 0.94], [0.8, 1]);

  /**
   * 关键词数据配置
   * - 可调整文字内容和动画参数
   */
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
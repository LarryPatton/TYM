import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ============================================
// 演示: 粒子汇聚色彩揭示 (ColorRevealDemo)
// 方案 C: 粒子汇聚 -> 炸开 -> 全屏展示
// ============================================
const ColorRevealDemo = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 品牌橙色
  const brandColor = '#FF6B00';

  // 1. 粒子数据生成
  // 生成 50 个随机粒子
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const isOrange = i % 5 === 0; // 20% 是橙色粒子
      return {
        id: i,
        x: Math.random() * 100, // 0-100%
        y: Math.random() * 100, // 0-100%
        size: isOrange ? Math.random() * 30 + 20 : Math.random() * 20 + 10, // 橙色粒子更大
        color: isOrange ? brandColor : ['#FF4D4D', '#8A2BE2', '#007AFF', '#00CED1', '#FFD700'][Math.floor(Math.random() * 5)],
        isTarget: isOrange
      };
    });
  }, []);

  // 2. 动画控制
  
  // 阶段 1: 粒子散开 (0 - 0.3) -> 汇聚 (0.3 - 0.6)
  // 橙色粒子汇聚到中心，其他粒子散开消失
  const convergenceProgress = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  
  // 阶段 2: 中心粒子炸开 (0.6 - 0.8)
  // 此时背景变色
  const explosionScale = useTransform(scrollYProgress, [0.6, 0.8], [1, 50]);
  const explosionOpacity = useTransform(scrollYProgress, [0.75, 0.8], [1, 0]); // 炸开后隐藏圆球，背景接管
  
  // 背景颜色过渡
  const backgroundColor = useTransform(scrollYProgress, [0.7, 0.8], ['#0a0a0a', brandColor]);

  // 阶段 3: 文字内容显现 (0.8 - 1.0)
  const contentOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.8, 0.9], [50, 0]);

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
            // 动态计算位置
            // 如果是目标粒子(橙色)，向中心(50, 50)汇聚
            // 如果是其他粒子，向四周散开
            
            // 初始位置
            const initialX = p.x;
            const initialY = p.y;
            
            // 目标位置 (中心)
            const targetX = 50;
            const targetY = 50;
            
            // 散开位置 (远离中心 - 径向散开)
            // 计算从中心指向粒子的向量
            const dx = p.x - 50;
            const dy = p.y - 50;
            // 计算角度
            const angle = Math.atan2(dy, dx);
            // 设定散开距离 (例如 100vw/vh，确保移出屏幕)
            const distance = 100;
            const disperseX = 50 + Math.cos(angle) * distance;
            const disperseY = 50 + Math.sin(angle) * distance;

            // 使用 useTransform 动态计算每个粒子的 x, y
            // 修正：使用 vw/vh 单位以确保 transform 是相对于视口的，而不是相对于元素自身尺寸
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
                  x, // 使用 x, y (transform) 配合 vw/vh 单位进行定位
                  y,
                  opacity,
                  scale,
                  filter: 'blur(1px)',
                  boxShadow: p.isTarget ? `0 0 20px ${brandColor}` : '0 0 10px rgba(255,255,255,0.3)', // 橙色粒子发光更强
                  zIndex: p.isTarget ? 10 : 1 // 橙色粒子在最上层
                }}
              />
            );
          })}
        </div>

        {/* 爆炸层 (中心橙色球) */}
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

        {/* 内容层 (最终展示) */}
        <motion.div
          style={{
            position: 'relative',
            zIndex: 20,
            opacity: contentOpacity,
            y: contentY,
            textAlign: 'center',
            color: '#fff',
            width: '100%',
            maxWidth: '1000px'
          }}
        >
          {/* 圆圈关键词 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '60px', 
            marginBottom: '60px' 
          }}>
            {['快乐', '创造力', '趣味'].map((text, i) => (
              <div 
                key={i}
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  letterSpacing: '2px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(5px)'
                }}
              >
                {text}
              </div>
            ))}
          </div>

          {/* 底部文案 */}
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '300', 
            letterSpacing: '4px',
            marginBottom: '20px'
          }}>
            橙色的情绪感受......
          </h2>
          <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>
            活力与温暖的结合，激发无限创意与探索欲。
          </p>
        </motion.div>

        {/* 滚动提示 */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '40px',
            color: '#fff',
            opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
            fontSize: '0.9rem',
            letterSpacing: '2px'
          }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SCROLL TO EXPLORE
        </motion.div>

      </motion.div>
    </div>
  );
};

export default ColorRevealDemo;
import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SECTION_PADDING, MAX_WIDTH_WIDE, itemVariants } from './Common';

/**
 * ============================================
 * 屏幕: 一致性马赛克展示 (ConsistencyMosaicScreen) - Gravity Wall + Scattered Float
 * ============================================
 * 设计概念:
 * - 模拟物理重力，悬挂陈列
 * - 挂绳 (Lanyards): 旋转90度垂直悬挂，随风摆动
 * - 产品 (Details): 自由散布，无边框限制，随机分布形成层次感
 * ============================================
 */

// 添加摆动动画的关键帧样式
const swingStyle = `
  @keyframes gentleSwing {
    0% { transform: rotate(90deg) translateX(0); }
    25% { transform: rotate(88deg) translateX(5px); }
    75% { transform: rotate(92deg) translateX(-5px); }
    100% { transform: rotate(90deg) translateX(0); }
  }
  @keyframes gentleFloat {
    0% { transform: translateY(0px) rotate(var(--base-rotate, 0deg)); }
    50% { transform: translateY(-10px) rotate(calc(var(--base-rotate, 0deg) + 1deg)); }
    100% { transform: translateY(0px) rotate(var(--base-rotate, 0deg)); }
  }
  @keyframes gentleDrift {
    0% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(2px, -3px) rotate(0.5deg); }
    50% { transform: translate(-1px, -4px) rotate(-0.5deg); }
    75% { transform: translate(-2px, -1px) rotate(0.25deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
`;

// 生成伪随机数的辅助函数（基于索引，确保每次渲染一致）
const seededRandom = (seed) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// 为每个产品生成网格位置
const generateGridPositions = (count, startY = 35) => {
  const positions = [];
  const cols = 5; // 5列网格
  const rowHeight = 22; // 行高
  
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    // 严格网格布局
    const baseX = (col / cols) * 100 + 4; // 调整边距，使网格居中
    const baseY = startY + row * rowHeight;
    
    // 极微小的随机扰动，避免完全死板，但视觉上看起来是整齐的
    const randomX = (seededRandom(i * 17) - 0.5) * 2; // ±1%
    const randomY = (seededRandom(i * 31) - 0.5) * 2; // ±1vh
    
    positions.push({
      x: baseX + randomX,
      y: baseY + randomY,
      rotate: 0, // 不旋转，保持端正
      scale: 1,  // 不缩放，保持原大小
      zIndex: 10,
      animationDelay: seededRandom(i * 89) * 2, // 0-2s diff
      animationDuration: 4 + seededRandom(i * 97) * 2, // 4-6s duration
    });
  }
  
  return positions;
};

export const ConsistencyMosaicScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  emphasis,
  images = [],
  lanyardCount = 5, // 挂绳数量，默认5张
  bgAlt = false
}) => {
  const containerRef = useRef(null);
  
  // 滚动进度追踪
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 动态分组逻辑 - 支持任意数量的图片
  const lanyards = images.slice(0, lanyardCount); // 挂绳 (app-xx)
  const products = images.slice(lanyardCount); // 所有剩余图片作为产品展示

  // 为产品生成散布位置（使用 useMemo 缓存） - 改用 generateGridPositions
  const productPositions = useMemo(() => 
    generateGridPositions(products.length, 38), 
    [products.length]
  );
  
  // 视差动画控制
  const lanyardY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  
  // 产品视差 - 不同层次不同速度
  const productY1 = useTransform(scrollYProgress, [0, 1], [50, -80]);
  const productY2 = useTransform(scrollYProgress, [0, 1], [80, -50]);
  const productY3 = useTransform(scrollYProgress, [0, 1], [30, -100]);

  // 强调文字动画
  const emphasisOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);
  const emphasisScale = useTransform(scrollYProgress, [0.75, 0.9], [0.95, 1]);

  // 根据产品数量动态计算区域高度
  const productCount = products.length;
  const rows = Math.ceil(productCount / 6);
  const dynamicHeight = Math.max(200, 120 + rows * 22); // 最小 200vh

  // 获取视差值
  const getParallaxY = (index) => {
    const mod = index % 3;
    if (mod === 0) return productY1;
    if (mod === 1) return productY2;
    return productY3;
  };

  return (
    <section 
      ref={containerRef}
      style={{ 
        height: `${dynamicHeight}vh`,
        position: 'relative',
        background: bgAlt ? '#111' : 'var(--phase-bg-color, #0a0a0a)',
        color: '#fff',
        padding: SECTION_PADDING,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <style>{swingStyle}</style>

      <div style={{
        maxWidth: MAX_WIDTH_WIDE,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 20
      }}>
        {/* 顶部文案区域 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
          style={{
            marginBottom: 'var(--space-3xl)',
            textAlign: 'center',
            position: 'relative',
            zIndex: 20
          }}
        >
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: 'var(--space-lg)'
          }}>
            {screenNumber} / {screenLabel}
          </div>
          
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '400',
            marginBottom: 'var(--space-xl)',
            lineHeight: 1.2,
            maxWidth: '900px',
            margin: '0 auto var(--space-xl)'
          }}>
            {title}
          </h2>
          
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 'var(--text-body-lg)',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {content}
          </p>
        </motion.div>
      </div>

      {/* 全屏散布容器 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}>
        
        {/* Layer 1: Hanging Lanyards (悬挂挂绳) */}
        {lanyards.map((image, index) => {
          const leftPos = 8 + (index * 18);
          const topOffset = -8 + (index % 3) * 4;
          const delay = index * 0.5;

          return (
            <motion.div
              key={`lanyard-${index}`}
              style={{
                position: 'absolute',
                left: `${leftPos}%`,
                top: `${topOffset}%`,
                y: lanyardY,
                width: '55vh',
                height: 'auto',
                transformOrigin: 'left center',
                zIndex: 2,
                animation: `gentleSwing ${4 + index}s ease-in-out infinite alternate`,
                animationDelay: `-${delay}s`,
                opacity: 0.7
              }}
            >
              <img 
                src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                alt={image.label}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(8px 8px 16px rgba(0,0,0,0.5))'
                }} 
              />
            </motion.div>
          );
        })}

        {/* Layer 2: Scattered Products (自由散布产品) */}
        {products.map((image, index) => {
          const pos = productPositions[index];
          const parallaxY = getParallaxY(index);
          
          return (
            <motion.div
              key={`product-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.05,
                ease: "easeOut" 
              }}
              style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                y: parallaxY,
                width: '14vw', // 稍微调大尺寸，适配5列网格
                height: 'auto', // 保持原始宽高比
                zIndex: pos.zIndex,
                animation: `gentleDrift ${pos.animationDuration}s ease-in-out infinite`,
                animationDelay: `-${pos.animationDelay}s`,
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
            >
              <motion.img 
                src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                alt={image.label}
                loading="lazy"
                whileHover={{ 
                  scale: 1.05,
                  zIndex: 50,
                  transition: { duration: 0.2 }
                }}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(6px 6px 12px rgba(0,0,0,0.4))',
                  transform: 'rotate(0deg)' // 保持端正
                }} 
              />
            </motion.div>
          );
        })}

      </div>

      {/* 强调信息 - 位于底部 */}
      {emphasis && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: '8%',
            left: 0,
            right: 0,
            opacity: emphasisOpacity,
            scale: emphasisScale,
            textAlign: 'center',
            zIndex: 30
          }}
        >
          <div style={{
            display: 'inline-block',
            padding: 'var(--space-xl) var(--space-3xl)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(12px)'
          }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: '400',
              color: '#fff',
              letterSpacing: '2px'
            }}>
              {emphasis}
            </span>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default ConsistencyMosaicScreen;
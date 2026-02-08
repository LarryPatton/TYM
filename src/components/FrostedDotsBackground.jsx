import React, { useMemo, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

/**
 * 单个互动的光斑组件
 * 处理鼠标排斥逻辑
 */
const InteractiveBlob = ({ blob, mouseX, mouseY, speed }) => {
  // 将百分比位置转换为近似的窗口坐标比例 (0-1)
  const xPercent = parseFloat(blob.initialX) / 100;
  const yPercent = parseFloat(blob.initialY) / 100;

  // 使用 useTransform 计算排斥偏移量
  // 当鼠标位置 (mouseX/Y) 变化时，重新计算
  const repulseX = useTransform(mouseX, (x) => {
    if (typeof window === 'undefined') return 0;
    const centerX = window.innerWidth * xPercent;
    const currentMouseX = x;
    const dist = currentMouseX - centerX;
    // 简单的距离计算，忽略 Y 轴只算 X 轴分量其实不准，但为了性能和 useTransform 的限制
    // 要做真正的 2D 距离计算，需要组合 X 和 Y。
    return 0; // 占位，实际逻辑在下面
  });
  
  // 由于 useTransform 只能处理单一面，做 2D 距离排斥需要自定义 Hook 或在 Render 层处理
  // 这里我们采用一种近似算法：
  // 直接将 mouseX/Y 传给 transform，在回调里取 current value
  
  // 更好方案：使用 useSpring 做平滑的鼠标跟随值，然后绑定到 style
  // 但是排斥是基于 "鼠标在哪里" 和 "我在哪里" 的关系。
  
  // 让我们用一个 ref 来不间断读取窗口尺寸，并在 useTransform 内部计算
  const moveX = useTransform([mouseX, mouseY], ([x, y]) => {
    if (typeof window === 'undefined') return 0;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const blobX = winW * xPercent;
    const blobY = winH * yPercent;
    
    const dx = x - blobX;
    const dy = y - blobY;
    const distSq = dx*dx + dy*dy;
    const radius = Math.min(winW, winH) * 0.4; // 感应半径
    const radiusSq = radius * radius;
    
    if (distSq < radiusSq) {
      const dist = Math.sqrt(distSq);
      const force = (1 - dist / radius) * 120; // 最大偏移 120px
      return -1 * (dx / dist) * force;
    }
    return 0;
  });

  const moveY = useTransform([mouseX, mouseY], ([x, y]) => {
    if (typeof window === 'undefined') return 0;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const blobX = winW * xPercent;
    const blobY = winH * yPercent;
    
    const dx = x - blobX;
    const dy = y - blobY;
    const distSq = dx*dx + dy*dy;
    const radius = Math.min(winW, winH) * 0.4;
    const radiusSq = radius * radius;
    
    if (distSq < radiusSq) {
      const dist = Math.sqrt(distSq);
      const force = (1 - dist / radius) * 120; 
      return -1 * (dy / dist) * force;
    }
    return 0;
  });
  
  // 添加弹簧物理效果，让排斥更顺滑
  const smoothX = useSpring(moveX, { stiffness: 150, damping: 20 });
  const smoothY = useSpring(moveY, { stiffness: 150, damping: 20 });

  return (
    <motion.div
      initial={{
        left: blob.initialX,
        top: blob.initialY,
      }}
      animate={{
        left: blob.animateX,
        top: blob.animateY,
      }}
      transition={{
        duration: blob.baseDuration / speed, 
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        width: blob.size,
        height: blob.size,
        borderRadius: '50%',
        background: `radial-gradient(circle, var(${blob.colorVar}) 0%, transparent 70%)`,
        transform: 'translate(-50%, -50%)', // 基础居中
        x: smoothX, // 叠加排斥偏移
        y: smoothY,
        willChange: 'transform, left, top', 
      }}
    />
  );
};

/**
 * 磨砂 + 柔和渐变光斑动态背景组件
 * 带有精细颗粒质感的磨砂效果
 * 
 * 颜色通过 CSS 变量控制，可在 index.css 中调整：
 * - --frosted-bg: 背景色
 * - --frosted-blob-1 ~ 5: 光斑颜色
 * - --frosted-grain-opacity-1 ~ 4: 颗粒透明度
 * - --frosted-grain-blend-1 ~ 3: 颗粒混合模式
 * - --frosted-gradient-overlay: 渐变遮罩颜色
 */
/**
 * @param {string} className - 自定义类名
 * @param {object} style - 自定义样式
 * @param {number} speed - 光斑移动速度倍数，默认 1。值越大移动越快，值越小移动越慢
 */
const FrostedDotsBackground = ({ className = '', style = {}, speed = 1.5 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 鼠标位置 MotionValue
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // 光斑配置 - 使用 CSS 变量
  // duration 会被 speed 参数调节：实际时长 = baseDuration / speed
  const blobs = useMemo(() => [
    {
      id: 1,
      size: 'clamp(300px, 50vw, 800px)',
      colorVar: '--frosted-blob-1',
      initialX: '15%',
      initialY: '20%',
      animateX: ['15%', '25%', '15%'],
      animateY: ['20%', '30%', '20%'],
      baseDuration: 20,
    },
    {
      id: 2,
      size: 'clamp(250px, 40vw, 600px)',
      colorVar: '--frosted-blob-2',
      initialX: '60%',
      initialY: '15%',
      animateX: ['60%', '70%', '55%', '60%'],
      animateY: ['15%', '25%', '20%', '15%'],
      baseDuration: 25,
    },
    {
      id: 3,
      size: 'clamp(350px, 55vw, 900px)',
      colorVar: '--frosted-blob-3',
      initialX: '40%',
      initialY: '50%',
      animateX: ['40%', '35%', '45%', '40%'],
      animateY: ['50%', '60%', '55%', '50%'],
      baseDuration: 22,
    },
    {
      id: 4,
      size: 'clamp(200px, 35vw, 500px)',
      colorVar: '--frosted-blob-4',
      initialX: '80%',
      initialY: '60%',
      animateX: ['80%', '75%', '85%', '80%'],
      animateY: ['60%', '70%', '65%', '60%'],
      baseDuration: 18,
    },
    {
      id: 5,
      size: 'clamp(280px, 45vw, 700px)',
      colorVar: '--frosted-blob-5',
      initialX: '10%',
      initialY: '70%',
      animateX: ['10%', '20%', '15%', '10%'],
      animateY: ['70%', '75%', '65%', '70%'],
      baseDuration: 24,
    },
  ], []);

  // 合并默认样式和外部传入样式
  const containerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 0,
    background: 'var(--frosted-bg)',
    ...style, // 外部样式覆盖
  };

  return (
    <div 
      className={className}
      style={containerStyle}
    >
      {/* 渐变光斑层 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'blur(80px)',
          WebkitFilter: 'blur(80px)',
        }}
      >
        {blobs.map((blob) => (
          <InteractiveBlob 
            key={blob.id} 
            blob={blob} 
            speed={speed} 
            mouseX={mouseX} 
            mouseY={mouseY} 
          />
        ))}
      </div>

      {/* === 多层精细颗粒纹理 === */}
      
      {/* 第一层：超细颗粒 - 高频噪点 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 'var(--frosted-grain-opacity-1)',
          mixBlendMode: 'var(--frosted-grain-blend-1)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise1'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='2' intercept='-0.5'/%3E%3CfeFuncG type='linear' slope='2' intercept='-0.5'/%3E%3CfeFuncB type='linear' slope='2' intercept='-0.5'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise1)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      {/* 第二层：中等颗粒 - 增加层次 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 'var(--frosted-grain-opacity-2)',
          mixBlendMode: 'var(--frosted-grain-blend-2)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='discrete' tableValues='0 1'/%3E%3CfeFuncG type='discrete' tableValues='0 1'/%3E%3CfeFuncB type='discrete' tableValues='0 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* 第三层：闪光/暗点颗粒 - 模拟金属粉末 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 'var(--frosted-grain-opacity-3)',
          mixBlendMode: 'var(--frosted-grain-blend-3)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='3' seed='5' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='discrete' tableValues='0 0 0 0 0 0 0 0 0 1'/%3E%3CfeFuncG type='discrete' tableValues='0 0 0 0 0 0 0 0 0 1'/%3E%3CfeFuncB type='discrete' tableValues='0 0 0 0 0 0 0 0 0 1'/%3E%3CfeFuncA type='discrete' tableValues='0 0 0 0 0 0 0 0 0 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise3)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px',
        }}
      />

      {/* 第四层：极细密颗粒 - 增加细腻感 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 'var(--frosted-grain-opacity-4)',
          mixBlendMode: isDark ? 'overlay' : 'soft-light',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise4'%3E%3CfeTurbulence type='turbulence' baseFrequency='4' numOctaves='6' seed='10' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='3' intercept='-1'/%3E%3CfeFuncG type='linear' slope='3' intercept='-1'/%3E%3CfeFuncB type='linear' slope='3' intercept='-1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise4)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* 第五层（仅亮色模式）：额外的细颗粒点增强质感 */}
      {!isDark && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.08,
            mixBlendMode: 'darken',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise5'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='4' seed='15' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='discrete' tableValues='0 0 0 0 0 0 1'/%3E%3CfeFuncG type='discrete' tableValues='0 0 0 0 0 0 1'/%3E%3CfeFuncB type='discrete' tableValues='0 0 0 0 0 0 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise5)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '150px 150px',
          }}
        />
      )}

      {/* 顶部渐变遮罩 - 让过渡更自然 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 0%, var(--frosted-gradient-overlay) 0%, transparent 50%)`,
        }}
      />
    </div>
  );
};

export default FrostedDotsBackground;
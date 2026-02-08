import React, { useMemo, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

/**
 * 磨砂 + 柔和渐变光斑动态背景组件
 * 带有精细颗粒质感的磨砂效果
 * 支持鼠标交互扰动（全局监听）
 */
const FrostedDotsBackground = ({ className = '', style = {}, speed = 1.5 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef(null);
  
  // 鼠标位置 - 低 stiffness 产生拖尾效果
  const mouseX = useSpring(50, { stiffness: 60, damping: 20 });
  const mouseY = useSpring(50, { stiffness: 60, damping: 20 });

  // 光斑配置 - 尺寸再+15%，移动速度加快
  const blobs = useMemo(() => [
    {
      id: 1,
      size: 'clamp(457px, 77vw, 1217px)',
      colorVar: '--frosted-blob-1',
      baseX: 15,
      baseY: 20,
      animateX: [15, 30, 18, 15],
      animateY: [20, 35, 22, 20],
      baseDuration: 8, // 加快
      sensitivity: 0.5,
    },
    {
      id: 2,
      size: 'clamp(384px, 61vw, 913px)',
      colorVar: '--frosted-blob-2',
      baseX: 65,
      baseY: 15,
      animateX: [65, 78, 55, 65],
      animateY: [15, 30, 18, 15],
      baseDuration: 9, // 加快
      sensitivity: 0.4,
    },
    {
      id: 3,
      size: 'clamp(529px, 84vw, 1369px)',
      colorVar: '--frosted-blob-3',
      baseX: 45,
      baseY: 50,
      animateX: [45, 28, 52, 45],
      animateY: [50, 65, 52, 50],
      baseDuration: 8.5, // 加快
      sensitivity: 0.6,
    },
    {
      id: 4,
      size: 'clamp(305px, 53vw, 760px)',
      colorVar: '--frosted-blob-4',
      baseX: 80,
      baseY: 60,
      animateX: [80, 70, 88, 80],
      animateY: [60, 72, 58, 60],
      baseDuration: 7, // 加快
      sensitivity: 0.35,
    },
    {
      id: 5,
      size: 'clamp(423px, 69vw, 1065px)',
      colorVar: '--frosted-blob-5',
      baseX: 10,
      baseY: 70,
      animateX: [10, 25, 12, 10],
      animateY: [70, 80, 58, 70],
      baseDuration: 10, // 加快
      sensitivity: 0.45,
    },
  ], []);

  // 全局鼠标监听 - 解决 pointerEvents: none 的问题
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // 检查鼠标是否在容器可见区域内
      const isInView = (
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right
      );
      
      if (isInView) {
        // 转换为百分比位置 (0-100)
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    // 监听全局鼠标移动
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

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
    ...style,
  };

  return (
    <div 
      ref={containerRef}
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
          pointerEvents: 'none',
        }}
      >
        {blobs.map((blob) => (
          <InteractiveBlob 
            key={blob.id}
            blob={blob}
            mouseX={mouseX}
            mouseY={mouseY}
            speed={speed}
          />
        ))}
      </div>

      {/* 鼠标跟随光斑 - 在彩色光斑之上，用背景色"划断" */}
      <MouseFollowerBlob 
        mouseX={mouseX} 
        mouseY={mouseY} 
        isDark={isDark}
      />

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
          pointerEvents: 'none',
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
          pointerEvents: 'none',
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
          pointerEvents: 'none',
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
          pointerEvents: 'none',
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
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 顶部渐变遮罩 - 让过渡更自然 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 0%, var(--frosted-gradient-overlay) 0%, transparent 50%)`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

/**
 * 交互式光斑组件
 * 响应鼠标位置产生位移（被推开效果）
 */
const InteractiveBlob = ({ blob, mouseX, mouseY, speed }) => {
  // 计算光斑受鼠标影响的偏移（排斥效果）
  const offsetX = useTransform(mouseX, (latest) => {
    const diff = latest - blob.baseX;
    // 排斥效果：鼠标越近，推开越远
    return -diff * blob.sensitivity * 10;
  });
  
  const offsetY = useTransform(mouseY, (latest) => {
    const diff = latest - blob.baseY;
    return -diff * blob.sensitivity * 10;
  });

  return (
    <motion.div
      initial={{
        left: `${blob.animateX[0]}%`,
        top: `${blob.animateY[0]}%`,
      }}
      animate={{
        left: blob.animateX.map(x => `${x}%`),
        top: blob.animateY.map(y => `${y}%`),
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
        x: offsetX,
        y: offsetY,
        transformOrigin: 'center center',
      }}
    />
  );
};

/**
 * 鼠标跟随光斑组件
 * 用与背景底色一致的颜色覆盖，产生"划断"效果
 */
const MouseFollowerBlob = ({ mouseX, mouseY, isDark }) => {
  // 将百分比转换为实际位置
  const x = useTransform(mouseX, (v) => `${v}%`);
  const y = useTransform(mouseY, (v) => `${v}%`);
  
  // 使用与背景视觉效果一致的颜色
  // 暗色模式：#050605 (用户校准)
  // 亮色模式：#e8e8e8
  const bgColor = isDark ? 'rgb(5, 6, 5)' : 'rgb(232, 232, 232)';
  const rgbValues = isDark ? '5,6,5' : '232,232,232';
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 'clamp(160px, 22vw, 320px)',
        height: 'clamp(160px, 22vw, 320px)',
        borderRadius: '50%',
        // 渐变从中心到透明 - 使用底色
        background: `radial-gradient(circle, ${bgColor} 0%, rgba(${rgbValues},0.85) 30%, rgba(${rgbValues},0.5) 50%, transparent 70%)`,
        transform: 'translate(-50%, -50%)',
        filter: 'blur(60px)',
        WebkitFilter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 1, // 在彩色光斑之上
      }}
    />
  );
};

export default FrostedDotsBackground;

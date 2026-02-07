import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

/**
 * 磨砂 + 柔和渐变光斑动态背景组件
 * 带有精细颗粒质感的磨砂效果
 */
const FrostedDotsBackground = ({ className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 光斑配置 - 黑白色调
  const blobs = useMemo(() => [
    {
      id: 1,
      size: 'clamp(300px, 50vw, 800px)',
      color: isDark ? 'rgba(60, 60, 60, 0.5)' : 'rgba(180, 180, 180, 0.6)',
      initialX: '15%',
      initialY: '20%',
      animateX: ['15%', '25%', '15%'],
      animateY: ['20%', '30%', '20%'],
      duration: 20,
    },
    {
      id: 2,
      size: 'clamp(250px, 40vw, 600px)',
      color: isDark ? 'rgba(80, 80, 80, 0.4)' : 'rgba(160, 160, 160, 0.5)',
      initialX: '60%',
      initialY: '15%',
      animateX: ['60%', '70%', '55%', '60%'],
      animateY: ['15%', '25%', '20%', '15%'],
      duration: 25,
    },
    {
      id: 3,
      size: 'clamp(350px, 55vw, 900px)',
      color: isDark ? 'rgba(50, 50, 50, 0.45)' : 'rgba(200, 200, 200, 0.55)',
      initialX: '40%',
      initialY: '50%',
      animateX: ['40%', '35%', '45%', '40%'],
      animateY: ['50%', '60%', '55%', '50%'],
      duration: 22,
    },
    {
      id: 4,
      size: 'clamp(200px, 35vw, 500px)',
      color: isDark ? 'rgba(70, 70, 70, 0.35)' : 'rgba(170, 170, 170, 0.45)',
      initialX: '80%',
      initialY: '60%',
      animateX: ['80%', '75%', '85%', '80%'],
      animateY: ['60%', '70%', '65%', '60%'],
      duration: 18,
    },
    {
      id: 5,
      size: 'clamp(280px, 45vw, 700px)',
      color: isDark ? 'rgba(40, 40, 40, 0.4)' : 'rgba(190, 190, 190, 0.5)',
      initialX: '10%',
      initialY: '70%',
      animateX: ['10%', '20%', '15%', '10%'],
      animateY: ['70%', '75%', '65%', '70%'],
      duration: 24,
    },
  ], [isDark]);

  // 背景基础色
  const bgColor = isDark ? '#0a0a0a' : '#f5f5f5';

  return (
    <div 
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        background: bgColor,
      }}
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
          <motion.div
            key={blob.id}
            initial={{
              left: blob.initialX,
              top: blob.initialY,
            }}
            animate={{
              left: blob.animateX,
              top: blob.animateY,
            }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              width: blob.size,
              height: blob.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {/* === 多层精细颗粒纹理 === */}
      
      {/* 第一层：超细颗粒 - 高频噪点 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isDark ? 0.15 : 0.08,
          mixBlendMode: isDark ? 'screen' : 'multiply',
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
          opacity: isDark ? 0.12 : 0.06,
          mixBlendMode: isDark ? 'overlay' : 'soft-light',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='discrete' tableValues='0 1'/%3E%3CfeFuncG type='discrete' tableValues='0 1'/%3E%3CfeFuncB type='discrete' tableValues='0 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* 第三层：闪光颗粒点 - 模拟金属粉末 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isDark ? 0.25 : 0.1,
          mixBlendMode: isDark ? 'screen' : 'overlay',
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
          opacity: isDark ? 0.08 : 0.04,
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise4'%3E%3CfeTurbulence type='turbulence' baseFrequency='4' numOctaves='6' seed='10' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='3' intercept='-1'/%3E%3CfeFuncG type='linear' slope='3' intercept='-1'/%3E%3CfeFuncB type='linear' slope='3' intercept='-1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise4)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* 顶部渐变遮罩 - 让过渡更自然 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDark
            ? 'radial-gradient(ellipse at 50% 0%, rgba(30, 30, 30, 0.3) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 50%)',
        }}
      />
    </div>
  );
};

export default FrostedDotsBackground;
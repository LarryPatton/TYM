import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * FlashlightMask - 手电筒遮罩组件 (V2 - 修复闪烁版本)
 * 
 * 在黑色背景上创建一个跟随鼠标的圆形透视区域，
 * 可以透过遮罩看到底层的内容，边缘带有羽化渐变效果。
 * 
 * 修复：不再使用条件渲染切换组件，避免 DOM 重新挂载导致的闪烁
 */
export const FlashlightMaskV2 = ({
  children,
  revealImage,
  spotlightSize = 200,
  featherSize = 100,
  scrollProgress, // 可以是 MotionValue 或普通数值
  backgroundColor = '#000'
}) => {
  const containerRef = useRef(null);
  const maskRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  
  // 鼠标位置 motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // 使用 spring 让跟随更平滑
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  const totalSpotlightSize = spotlightSize + featherSize * 2;
  
  // 检测是否为触摸设备
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  
  // 修复：组件挂载时检测鼠标是否已在容器内（解决 SPA 路由导航问题）
  useEffect(() => {
    if (!containerRef.current || isTouchDevice) return;
    
    const checkInitialMousePosition = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      // 检测鼠标是否在容器内
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        setIsHovering(true);
        mouseX.set(x - rect.left);
        mouseY.set(y - rect.top);
      }
    };
    
    // 监听一次 mousemove 来获取当前鼠标位置
    const handleFirstMove = (e) => {
      checkInitialMousePosition(e);
      window.removeEventListener('mousemove', handleFirstMove);
    };
    
    window.addEventListener('mousemove', handleFirstMove);
    
    return () => {
      window.removeEventListener('mousemove', handleFirstMove);
    };
  }, [isTouchDevice, mouseX, mouseY]);
  
  // 监听滚动进度变化（支持 MotionValue）
  useEffect(() => {
    if (scrollProgress && typeof scrollProgress.on === 'function') {
      // 是 MotionValue
      const unsub = scrollProgress.on('change', (v) => setCurrentProgress(v));
      setCurrentProgress(scrollProgress.get());
      return unsub;
    } else if (typeof scrollProgress === 'number') {
      // 是普通数值
      setCurrentProgress(scrollProgress);
    }
  }, [scrollProgress]);
  
  // 监听平滑后的坐标变化，更新遮罩
  useEffect(() => {
    if (!maskRef.current) return;
    
    const updateMask = () => {
      if (!maskRef.current) return;
      
      // 只有在 hover 且进度未超过阈值时才显示手电筒效果
      if (!isHovering || currentProgress > 0.35) {
        maskRef.current.style.maskImage = 'none';
        maskRef.current.style.webkitMaskImage = 'none';
        return;
      }
      
      const x = smoothX.get();
      const y = smoothY.get();
      
      const maskImage = `radial-gradient(
        circle ${totalSpotlightSize / 2}px at ${x}px ${y}px,
        transparent ${spotlightSize / 2}px,
        rgba(0,0,0,1) ${totalSpotlightSize / 2}px
      )`;
      
      maskRef.current.style.maskImage = maskImage;
      maskRef.current.style.webkitMaskImage = maskImage;
    };
    
    const unsubX = smoothX.on('change', updateMask);
    const unsubY = smoothY.on('change', updateMask);
    
    // 初始更新
    updateMask();
    
    return () => {
      unsubX();
      unsubY();
    };
  }, [smoothX, smoothY, isHovering, spotlightSize, totalSpotlightSize, currentProgress]);
  
  // 处理鼠标移动
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);
  
  // 处理触摸移动
  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(touch.clientX - rect.left);
    mouseY.set(touch.clientY - rect.top);
    setIsHovering(true);
  }, [mouseX, mouseY]);
  
  // 计算手电筒效果的透明度，随滚动渐消
  // 在 0-35% 进度内从 1 渐变到 0
  const flashlightOpacity = Math.max(0, 1 - currentProgress * 3);
  
  // 判断是否应该显示手电筒相关的视觉元素
  const showFlashlightEffects = isHovering && currentProgress < 0.35;
  
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchMove={handleTouchMove}
      onTouchStart={() => setIsHovering(true)}
      onTouchEnd={() => setIsHovering(false)}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        cursor: showFlashlightEffects ? 'none' : 'default',
        background: backgroundColor // 始终有背景色
      }}
    >
      {/* 底层：透过光圈要显示的图片 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: revealImage 
            ? `url(${revealImage}) center center / contain no-repeat`
            : 'var(--color-bg-alt)',
          backgroundColor: '#000', // 图片周围填充纯黑背景
          zIndex: 0,
          opacity: flashlightOpacity, // 手电筒透视图片随进度淡出
          transition: 'opacity 0.3s ease-out'
        }}
      />
      
      {/* 遮罩层 - 始终保持纯黑不透明，仅通过 mask 实现手电筒效果 */}
      <div
        ref={maskRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: backgroundColor,
          zIndex: 1
          // 移除 opacity 变化，让幕布始终保持纯黑
        }}
      />
      
      {/* 光圈边缘光晕效果 */}
      <motion.div
        style={{
          position: 'absolute',
          width: totalSpotlightSize + 40,
          height: totalSpotlightSize + 40,
          borderRadius: '50%',
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          background: `radial-gradient(
            circle,
            rgba(255, 255, 255, 0.02) 0%,
            transparent 70%
          )`,
          pointerEvents: 'none',
          zIndex: 2,
          opacity: showFlashlightEffects ? flashlightOpacity * 0.8 : 0,
          transition: 'opacity 0.2s ease-out'
        }}
      />
      
      {/* 自定义光标 */}
      <motion.div
        style={{
          position: 'absolute',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.5)',
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 4,
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.2)',
          opacity: (showFlashlightEffects && !isTouchDevice) ? 1 : 0,
          transition: 'opacity 0.2s ease-out'
        }}
      />
      
      {/* 文字内容层 */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default FlashlightMaskV2;
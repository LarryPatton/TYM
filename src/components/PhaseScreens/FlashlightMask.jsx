import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * FlashlightMask - 手电筒遮罩组件 (V2 - 修复闪烁版本)
 * 
 * 在黑色背景上创建一个跟随鼠标的圆形透视区域，
 * 可以透过遮罩看到底层的内容，边缘带有羽化渐变效果。
 * 
 * 修复：不再使用条件渲染切换组件，避免 DOM 重新挂载导致的闪烁
 * 
 * @param {Object} initialPosition - 初始光圈位置 { x: 0-1, y: 0-1 }，百分比坐标
 *                                   例如 { x: 0.7, y: 0.15 } 表示右上角
 * @param {boolean} visible - 控制手电筒效果是否可见（typing 阶段为 false，淡入隐藏）
 */
export const FlashlightMaskV2 = ({
  children,
  revealImage,
  spotlightSize = 200,
  featherSize = 100,
  scrollProgress, // 可以是 MotionValue 或普通数值
  backgroundColor = '#000',
  initialPosition = null, // 初始光圈位置 { x: 0-1, y: 0-1 }
  visible = true // 控制手电筒交互层整体可见性
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
  
  // 有 initialPosition 时，光圈始终可见（不依赖鼠标 hover）
  const hasInitialPosition = !!initialPosition;
  
  // 检测是否为触摸设备
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  
  // 新增：设置初始光圈位置（仅在 visible 后才执行）
  // 使用 ref 跟踪是否已经设置过初始位置，避免重复设置
  const initialPosSetRef = useRef(false);
  
  useEffect(() => {
    if (!containerRef.current || isTouchDevice || !initialPosition || !visible) return;
    
    // visible 变为 true 后立即同步设置初始位置（不延迟 RAF）
    const rect = containerRef.current.getBoundingClientRect();
    const initialX = rect.width * (initialPosition.x || 0.5);
    const initialY = rect.height * (initialPosition.y || 0.5);
    
    // 直接跳到目标位置（不走 spring 动画），确保首帧就在正确位置
    mouseX.jump(initialX);
    mouseY.jump(initialY);
    smoothX.jump(initialX);
    smoothY.jump(initialY);
    
    initialPosSetRef.current = true;
  }, [initialPosition, isTouchDevice, mouseX, mouseY, smoothX, smoothY, visible]);
  
  // 修复：组件挂载时直接检测鼠标位置（解决鼠标静止不动时手电筒不显示的问题）
  useEffect(() => {
    if (!containerRef.current || isTouchDevice || !visible) return;
    
    // 如果有 initialPosition，跳过自动检测（由上面的 useEffect 处理）
    if (initialPosition) return;
    
    // 使用 RAF 确保 DOM 完全渲染后再检测
    const timer = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // 方案 1: 尝试获取当前鼠标位置（通过 mouseenter 事件）
      let mouseDetected = false;
      
      const handleMouseEnterOnce = (e) => {
        if (mouseDetected) return;
        mouseDetected = true;
        
        const x = e.clientX;
        const y = e.clientY;
        
        // 检测鼠标是否在容器内
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          setIsHovering(true);
          mouseX.set(x - rect.left);
          mouseY.set(y - rect.top);
        }
        
        containerRef.current?.removeEventListener('mouseenter', handleMouseEnterOnce);
      };
      
      // 监听 mouseenter 事件（当鼠标已在容器内时会立即触发）
      containerRef.current?.addEventListener('mouseenter', handleMouseEnterOnce);
      
      // 方案 2: 使用 :hover 伪类检测（fallback）
      // 如果鼠标已经在元素上，立即设置为 hovering
      const checkIfAlreadyHovered = () => {
        if (!containerRef.current || mouseDetected) return;
        
        // 通过 matches(':hover') 检测鼠标是否已在元素上
        if (containerRef.current.matches(':hover')) {
          setIsHovering(true);
          // 设置默认位置为中心（因为无法获取精确坐标）
          mouseX.set(rect.width / 2);
          mouseY.set(rect.height / 2);
          mouseDetected = true;
        }
      };
      
      // 延迟检测，确保 CSS 伪类状态已更新
      setTimeout(checkIfAlreadyHovered, 50);
      
      // 方案 3: 监听第一次 mousemove 作为最后的 fallback
      const handleFirstMove = (e) => {
        if (!containerRef.current || mouseDetected) return;
        
        const x = e.clientX;
        const y = e.clientY;
        const currentRect = containerRef.current.getBoundingClientRect();
        
        // 检测鼠标是否在容器内
        if (x >= currentRect.left && x <= currentRect.right && 
            y >= currentRect.top && y <= currentRect.bottom) {
          setIsHovering(true);
          mouseX.set(x - currentRect.left);
          mouseY.set(y - currentRect.top);
          mouseDetected = true;
        }
        
        window.removeEventListener('mousemove', handleFirstMove);
      };
      
      window.addEventListener('mousemove', handleFirstMove);
      
      // 清理函数
      return () => {
        containerRef.current?.removeEventListener('mouseenter', handleMouseEnterOnce);
        window.removeEventListener('mousemove', handleFirstMove);
      };
    });
    
    return () => {
      cancelAnimationFrame(timer);
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
      
      // 有 initialPosition 时不依赖 isHovering，光圈始终显示
      const shouldShow = (isHovering || hasInitialPosition) && currentProgress <= 0.35;
      if (!shouldShow) {
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
  }, [smoothX, smoothY, isHovering, hasInitialPosition, visible, spotlightSize, totalSpotlightSize, currentProgress]);
  
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
  // visible=false 时强制隐藏所有效果
  // 有 initialPosition 时即使鼠标不在屏幕上也显示光圈
  const showFlashlightEffects = visible && (isHovering || hasInitialPosition) && currentProgress < 0.35;
  
  return (
    <div
      ref={containerRef}
      onMouseMove={visible ? handleMouseMove : undefined}
      onMouseEnter={visible ? () => setIsHovering(true) : undefined}
      onMouseLeave={visible ? () => {
        setIsHovering(false);
        // 鼠标离开时，如果有 initialPosition，光圈弹回初始位置
        if (initialPosition && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          mouseX.set(rect.width * (initialPosition.x || 0.5));
          mouseY.set(rect.height * (initialPosition.y || 0.5));
        }
      } : undefined}
      onTouchMove={visible ? handleTouchMove : undefined}
      onTouchStart={visible ? () => setIsHovering(true) : undefined}
      onTouchEnd={visible ? () => setIsHovering(false) : undefined}
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
          opacity: visible ? flashlightOpacity : 0, // visible=false 时完全隐藏底图
          transition: 'opacity 0.6s ease-out' // 淡入时间较长，营造渐显效果
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
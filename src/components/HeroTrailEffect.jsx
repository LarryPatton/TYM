import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 图片路径配置
const TRAIL_IMAGES = Array.from({ length: 9 }, (_, i) => 
  `/images/trail/Slide 16_9 - ${i + 1}.png`
);

const HeroTrailEffect = ({ isMobile }) => {
  const [trail, setTrail] = useState([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const imageIndexRef = useRef(0);
  const idCounter = useRef(0);
  const lastTimeRef = useRef(0);

  // 关键区域避让：是否在屏幕中心区域 (30%宽 x 20%高)
  const isInsideRestrictedArea = (x, y) => {
    const { innerWidth, innerHeight } = window;
    // 中心区域宽度 50% (加大避让范围，确保标题文字绝对清晰)
    const restrictWidth = innerWidth * 0.5;
    const restrictHeight = innerHeight * 0.4;
    // 中心点
    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;
    
    return (
      x > centerX - restrictWidth / 2 &&
      x < centerX + restrictWidth / 2 &&
      y > centerY - restrictHeight / 2 &&
      y < centerY + restrictHeight / 2
    );
  };

  useEffect(() => {
    // 移动端或不用时直接返回
    if (isMobile) return;

    const handleMouseMove = (e) => {
      // 仅在首屏（Hero区域范围）有效
      if (window.scrollY > window.innerHeight * 1.2) return;

      const now = Date.now();
      const { clientX, clientY } = e;

      // 检查是否在受保护的关键区域
      if (isInsideRestrictedArea(clientX, clientY)) return;
      
      // 计算移动距离
      const dist = Math.sqrt(
        Math.pow(clientX - lastMousePos.current.x, 2) + 
        Math.pow(clientY - lastMousePos.current.y, 2)
      );

      // 距离阈值：移动超过 80px 才生成一张新图（避免重叠太密）
      if (dist < 80) return;
      
      // 时间阈值：两次生成间隔至少 30ms
      if (now - lastTimeRef.current < 30) return;

      lastMousePos.current = { x: clientX, y: clientY };
      lastTimeRef.current = now;
      
      const newId = idCounter.current++;
      const newItem = {
        id: newId,
        x: clientX,
        y: clientY,
        image: TRAIL_IMAGES[imageIndexRef.current],
        // 随机旋转 -15 ~ 15 度
        rotation: (Math.random() - 0.5) * 30,
      };

      // 切换到下一张图
      imageIndexRef.current = (imageIndexRef.current + 1) % TRAIL_IMAGES.length;

      setTrail(prev => [...prev, newItem]);

      // 缩短存活时间至 350ms (原800ms)
      setTimeout(() => {
        setTrail(prev => prev.filter(item => item.id !== newId));
      }, 350);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 5, // 位于文字层(通常是有 z-index 的)上方或下方需根据效果调整，这里设为 5 试图覆盖普通内容
        overflow: 'hidden',
      }}
    >
      <AnimatePresence>
        {trail.map(item => (
          <motion.img
            key={item.id}
            src={item.image}
            alt=""
            // 初始状态：透明，缩小，位置在鼠标处
            initial={{ 
              opacity: 0, 
              scale: 0.5, 
              x: item.x, 
              y: item.y 
            }}
            // 进场状态：完全不透明，原尺寸
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: item.x,
              y: item.y
            }}
            // 离场状态：变淡，稍微变小
            exit={{ 
              opacity: 0, 
              scale: 0.6,
              transition: { duration: 0.15, ease: "easeOut" } // 极速离场
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              opacity: { duration: 0.2 }
            }}
            style={{
              position: 'absolute',
              width: '200px', // 尺寸+15%
              height: 'auto',
              // 重新计算偏移: 宽160, 中心偏移-80; 高约90, 偏移-45
              left: -80,
              top: -45,
              rotate: item.rotation,
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default HeroTrailEffect;
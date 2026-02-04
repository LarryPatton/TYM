import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * AutoSequencePopup - 自动顺序弹出组件
 * 当屏幕进入视口时，内容按固定间隔依次弹出
 * 
 * 移动端优化：支持双区域模式，上下两个区域分别播放不同的图片序列
 * 
 * @param {Array} images - 图片数组，每个图片对象包含 src 和 label
 * @param {Array} images2 - 第二组图片数组（移动端双区域模式用）
 * @param {Number} interval - 弹出间隔时间（毫秒），默认 300ms
 * @param {Number} duration - 单个动画持续时间（秒），默认 0.6s
 * @param {String} bgColor - 背景颜色，默认黑色
 * @param {Boolean} dualMode - 是否启用双区域模式（移动端自动启用）
 */
const AutoSequencePopup = ({ 
  images = [], 
  images2 = [], // 第二组图片（用于移动端双区域）
  interval = 300,
  duration = 0.6,
  bgColor = '#000',
  dualMode = false // 是否启用双区域模式
}) => {
  const [visibleIndices, setVisibleIndices] = useState([]);
  const [visibleIndices2, setVisibleIndices2] = useState([]); // 第二区域的可见索引
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  // 移动端检测
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 当图片数组变化时，重置状态
  useEffect(() => {
    // 重置状态（当组件重新挂载或图片变化时）
    setVisibleIndices([]);
    setVisibleIndices2([]);
    setHasTriggered(false);
    setIsMounted(false);
    
    // 延迟启用 IntersectionObserver，避免挂载时立即触发
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 200);
    
    return () => {
      clearTimeout(mountTimer);
      setIsMounted(false);
    };
  }, [images, images2]); // 当图片变化时重置

  // 判断是否使用双区域模式
  const useDualMode = dualMode && images2.length > 0;

  useEffect(() => {
    // 等待组件完全挂载后再设置观察器
    if (!isMounted) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 当屏幕进入视口且未触发过时，开始顺序弹出
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          
          // 依次显示第一组图片
          images.forEach((_, index) => {
            setTimeout(() => {
              setVisibleIndices(prev => [...prev, index]);
            }, index * interval);
          });
          
          // 如果是双区域模式，同时播放第二组
          if (useDualMode) {
            images2.forEach((_, index) => {
              setTimeout(() => {
                setVisibleIndices2(prev => [...prev, index]);
              }, index * interval);
            });
          }
        }
      },
      {
        threshold: 0.1, // 降低阈值，只需10%进入视口即触发
        rootMargin: '0px' // 移除负边距，更容易触发
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [images, images2, interval, hasTriggered, isMounted, useDualMode]);

  // 弹出动画变体
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: duration,
        ease: [0.25, 0.1, 0.25, 1] // cubic-bezier 缓动曲线
      }
    }
  };

  // 计算总滚动高度：根据图片数量和弹出动画时间
  const maxImagesCount = useDualMode ? Math.max(images.length, images2.length) : images.length;
  const totalAnimationTime = maxImagesCount * interval + duration * 1000;
  const scrollHeight = Math.max(200, Math.ceil(totalAnimationTime / 10));

  // 双区域模式渲染：上下两个区域分别播放
  if (useDualMode) {
    return (
      <div 
        ref={containerRef}
        style={{
          height: `${scrollHeight}vh`,
          position: 'relative',
          background: bgColor
        }}
      >
        {/* Sticky 容器 - 优化移动端布局 */}
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between', // 改为 space-between，让内容更分散
          overflow: 'hidden',
          padding: '8px 8px 64px 8px', // 减少水平 padding，底部留出导航栏空间
          boxSizing: 'border-box'
        }}>
          {/* 上半区域 - 第一组图片 */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '48%', // 固定高度比例，确保充分利用空间
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            {images.map((image, index) => (
              <motion.div
                key={`top-${index}`}
                variants={itemVariants}
                initial="hidden"
                animate={visibleIndices.includes(index) ? "visible" : "hidden"}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: index + 1,
                  padding: '4px' // 给图片留一点边距
                }}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                  alt={image.label || `Image ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                    borderRadius: '6px'
                  }}
                />
              </motion.div>
            ))}
          </div>
          
          {/* 中间分隔线 - 视觉分隔 */}
          <div style={{
            width: '60%',
            height: '1px',
            background: 'rgba(255, 255, 255, 0.1)',
            flexShrink: 0
          }} />
          
          {/* 下半区域 - 第二组图片 */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '48%', // 固定高度比例
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            {images2.map((image, index) => (
              <motion.div
                key={`bottom-${index}`}
                variants={itemVariants}
                initial="hidden"
                animate={visibleIndices2.includes(index) ? "visible" : "hidden"}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: index + 1,
                  padding: '4px'
                }}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                  alt={image.label || `Image ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                    borderRadius: '6px'
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 单区域模式渲染（桌面端默认）
  return (
    <div 
      ref={containerRef}
      style={{
        height: `${scrollHeight}vh`,
        position: 'relative',
        background: bgColor
      }}
    >
      {/* Sticky 容器 */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* 图片叠加容器 */}
        <div
          style={{
            position: 'relative',
            width: '90vw',
            height: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial="hidden"
              animate={visibleIndices.includes(index) ? "visible" : "hidden"}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: index + 1
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                alt={image.label || `Image ${index + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.3))'
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoSequencePopup;
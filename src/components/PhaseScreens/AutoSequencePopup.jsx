import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * AutoSequencePopup - 自动顺序弹出组件
 * 当屏幕进入视口时，内容按固定间隔依次弹出
 * 
 * @param {Array} images - 图片数组，每个图片对象包含 src 和 label
 * @param {Number} interval - 弹出间隔时间（毫秒），默认 300ms
 * @param {Number} duration - 单个动画持续时间（秒），默认 0.6s
 * @param {String} bgColor - 背景颜色，默认黑色
 */
const AutoSequencePopup = ({ 
  images = [], 
  interval = 300,
  duration = 0.6,
  bgColor = '#000'
}) => {
  const [visibleIndices, setVisibleIndices] = useState([]);
  const [hasTriggered, setHasTriggered] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 当屏幕进入视口且未触发过时，开始顺序弹出
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          
          // 依次显示每个图片
          images.forEach((_, index) => {
            setTimeout(() => {
              setVisibleIndices(prev => [...prev, index]);
            }, index * interval);
          });
        }
      },
      {
        threshold: 0.2, // 当20%进入视口时触发
        rootMargin: '-10% 0px' // 稍微延迟触发，避免过早执行
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
  }, [images, interval, hasTriggered]);

  // 弹出动画变体
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 40,
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
  // 每张图片需要足够的滚动空间来完成弹出动画
  const totalAnimationTime = images.length * interval + duration * 1000;
  const scrollHeight = Math.max(200, Math.ceil(totalAnimationTime / 10)); // 转换为vh单位

  return (
    <div 
      ref={containerRef}
      style={{
        height: `${scrollHeight}vh`, // 提供足够的滚动高度
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
                zIndex: index + 1 // 后面的图片层级更高
              }}
            >
              <img
                src={image.src}
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

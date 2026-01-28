import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * ============================================
 * 屏幕: 弹出序列展示 (PopupSequenceScreen)
 * ============================================
 * 设计概念:
 * - 多张透明图片在同一位置依次弹出
 * - 滚动驱动的序列动画
 * - 全屏尺寸展示，保持图片比例
 * ============================================
 */

export const PopupSequenceScreen = ({
  screenNumber,
  screenLabel,
  images = [],
  bgColor = '#000'
}) => {
  const containerRef = useRef(null);
  const imageCount = images.length;
  
  // 滚动进度追踪
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  if (imageCount === 0) return null;

  // 计算每张图片的显示区间
  // 图片依次弹出并保持显示
  const getImageAnimations = (index) => {
    const segmentSize = 1 / imageCount;
    const start = index * segmentSize;
    const showPoint = start + segmentSize * 0.3; // 30% 处开始显示
    
    // 缩放动画：从 0.3 弹出到 1
    const scale = useTransform(
      scrollYProgress,
      [start, showPoint],
      [0.3, 1]
    );
    
    // 透明度动画：从 0 到 1
    const opacity = useTransform(
      scrollYProgress,
      [start, showPoint],
      [0, 1]
    );
    
    // Y 轴位移：从下方弹入
    const y = useTransform(
      scrollYProgress,
      [start, showPoint],
      [100, 0]
    );
    
    return { scale, opacity, y };
  };

  return (
    <div 
      ref={containerRef}
      style={{
        height: `${Math.max(imageCount * 100, 300)}vh`, // 每张图片 100vh 滚动空间
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
        
        {/* 屏幕标识 */}
        {screenNumber && (
          <motion.div style={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            zIndex: 10
          }}>
            {screenNumber} / {screenLabel}
          </motion.div>
        )}

        {/* 图片层叠容器 */}
        <div style={{
          position: 'relative',
          width: '90vw',
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {images.map((image, index) => {
            const { scale, opacity, y } = getImageAnimations(index);
            
            return (
              <motion.div
                key={`popup-${index}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  scale,
                  opacity,
                  y,
                  zIndex: index + 1 // 后面的图片层级更高
                }}
              >
                <img 
                  src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                  alt={image.label || `Popup ${index + 1}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.5))'
                  }} 
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopupSequenceScreen;

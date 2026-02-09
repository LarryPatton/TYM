import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * ============================================
 * 屏幕: 弹出序列展示 (PopupSequenceScreen)
 * ============================================
 * 设计概念:
 * - 多张透明图片在同一位置依次弹出
 * - 滚动驱动的序列动画
 * - 全屏尺寸展示，保持图片比例
 * 
 * 移动端优化:
 * - 改为垂直堆叠展示
 * - 禁用滚动驱动动画
 * - 简化为普通滚动浏览
 * 
 * 注：文案展示已改用 scroll-text-bar 组件，本组件不再处理文案
 * ============================================
 */

export const PopupSequenceScreen = ({
  screenNumber,
  screenLabel,
  images = [],
  bgColor = '#000'
}) => {
  // 移动端检测
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const imageCount = images.length;
  if (imageCount === 0) return null;

  // 移动端：简化为垂直堆叠展示
  if (isMobile) {
    return (
      <MobilePopupSequence 
        screenNumber={screenNumber}
        screenLabel={screenLabel}
        images={images}
        bgColor={bgColor}
      />
    );
  }

  // 桌面端：滚动驱动的弹出动画
  return (
    <DesktopPopupSequence
      screenNumber={screenNumber}
      screenLabel={screenLabel}
      images={images}
      bgColor={bgColor}
    />
  );
};

/**
 * 移动端：垂直堆叠展示
 */
const MobilePopupSequence = ({ screenNumber, screenLabel, images, bgColor }) => {
  return (
    <section
      style={{
        background: bgColor,
        padding: '60px 16px 80px',
        color: '#fff'
      }}
    >
      {/* 屏幕标识 */}
      {(screenNumber || screenLabel) && (
        <div style={{
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          {screenNumber && screenLabel ? `${screenNumber} / ${screenLabel}` : (screenNumber || screenLabel)}
        </div>
      )}

      {/* 垂直堆叠图片 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '100%'
      }}>
        {images.map((image, index) => (
          <motion.div
            key={`mobile-popup-${index}`}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderRadius: 'var(--radius-image, 8px)'
            }}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: [0.16, 1, 0.3, 1]
            }}
            viewport={{ once: true, margin: '-10%' }}
          >
            <img
              src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
              alt={image.label || `Image ${index + 1}`}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                borderRadius: 'var(--radius-image, 8px)'
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

/**
 * 桌面端：滚动驱动的弹出动画
 */
const DesktopPopupSequence = ({ 
  screenNumber, 
  screenLabel, 
  images, 
  bgColor
}) => {
  const containerRef = useRef(null);
  const imageCount = images.length;
  
  // 滚动进度追踪
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div 
      ref={containerRef}
      style={{
        height: `${Math.max(imageCount * 100, 300)}vh`,
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
        {(screenNumber || screenLabel) && (
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
            {screenNumber && screenLabel ? `${screenNumber} / ${screenLabel}` : (screenNumber || screenLabel)}
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
          {images.map((image, index) => (
            <PopupImage
              key={`popup-${index}`}
              image={image}
              index={index}
              imageCount={imageCount}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * 单张弹出图片（带动画）
 */
const PopupImage = ({ image, index, imageCount, scrollYProgress }) => {
  const segmentSize = 1 / imageCount;
  const start = index * segmentSize;
  const showPoint = start + segmentSize * 0.3;
  
  // 缩放动画
  const scale = useTransform(
    scrollYProgress,
    [start, showPoint],
    [0.3, 1]
  );
  
  // 透明度动画
  const opacity = useTransform(
    scrollYProgress,
    [start, showPoint],
    [0, 1]
  );
  
  // Y 轴位移
  const y = useTransform(
    scrollYProgress,
    [start, showPoint],
    [100, 0]
  );

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        scale,
        opacity,
        y,
        zIndex: index + 1
      }}
    >
      <img 
        src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
        alt={image.label || `Popup ${index + 1}`}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          borderRadius: 'var(--radius-image, 12px)',
          filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.5))'
        }} 
      />
    </motion.div>
  );
};

export default PopupSequenceScreen;

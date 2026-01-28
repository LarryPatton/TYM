import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * StripRowScreen - 五图横排紧凑展示 (带 Sticky 停顿)
 * 
 * 特性：
 * - 5张图片紧挨着排成一行
 * - Sticky 停顿效果
 * - 透明底保留
 * - 整体居中展示
 * 
 * @param {Array} images - 图片数组 [{src, label}]
 * @param {string} bgColor - 背景颜色
 */
export const StripRowScreen = ({
  screenNumber,
  screenLabel,
  images = [],
  bgColor = '#0a0a0a'
}) => {
  const containerRef = useRef(null);

  if (images.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      style={{
        height: '150vh', // 1.5倍高度实现停顿
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
        overflow: 'hidden',
        padding: '60px 20px'
      }}>
        {/* 屏幕标识 */}
        <div style={{
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
        </div>

        {/* 五图横排容器 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true, margin: "-10%" }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0', // 紧挨着，无间隙
            maxWidth: '100%',
            overflow: 'hidden'
          }}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1]
              }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05, 
                zIndex: 10,
                transition: { duration: 0.3 }
              }}
              style={{
                flexShrink: 0,
                height: '50vh', // 统一高度
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                alt={image.label || `Strip ${index + 1}`}
                style={{
                  height: '100%',
                  width: 'auto',
                  objectFit: 'contain',
                  background: 'transparent', // 保留透明底
                  transition: 'transform 0.3s ease'
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default StripRowScreen;
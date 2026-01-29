import React from 'react';
import { motion } from 'framer-motion';

/**
 * TwoRowStaticScreen - 上下两行静态展示组件
 * 
 * 特点：
 * 1. 上下两行布局，每行独立配置数量和尺寸
 * 2. 纯纵向滚动，无横向切换动画
 * 3. 支持自定义标题和背景色
 * 
 * @param {string} title - 标题
 * @param {Object} layout - 布局配置 { rows: [{count, scale}, {count, scale}] }
 * @param {Array} images - 图片数组 [{src, label}]
 * @param {string} bgColor - 背景颜色
 */
export const TwoRowStaticScreen = ({
  screenNumber,
  screenLabel,
  title,
  layout,
  images = [],
  bgColor = '#000'
}) => {
  if (!layout || !layout.rows || images.length === 0) return null;

  return (
    <div 
      style={{
        minHeight: '100vh',
        position: 'relative',
        background: bgColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 60px'
      }}
    >
      {/* 屏幕标识 */}
      {screenNumber && (
        <motion.div 
          style={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            zIndex: 10
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {screenNumber} / {screenLabel}
        </motion.div>
      )}

      {/* 标题 */}
      {title && (
        <motion.h2 
          style={{
            fontSize: '2rem',
            fontWeight: 300,
            color: '#fff',
            marginBottom: '60px',
            letterSpacing: '6px',
            textTransform: 'uppercase'
          }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}
        </motion.h2>
      )}

      {/* 两行布局容器 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
        maxWidth: '1400px',
        width: '100%'
      }}>
        {layout.rows.map((rowConfig, rowIndex) => {
          // 计算当前行的图片范围
          const startIndex = layout.rows.slice(0, rowIndex).reduce((sum, r) => sum + r.count, 0);
          const endIndex = startIndex + rowConfig.count;
          const rowImages = images.slice(startIndex, endIndex);

          return (
            <motion.div
              key={`row-${rowIndex}`}
              style={{
                display: 'flex',
                gap: '24px',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + rowIndex * 0.2 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              {rowImages.map((img, imgIndex) => {
                const globalIndex = startIndex + imgIndex;
                const size = rowConfig.scale * 140; // 基础尺寸 140px

                return (
                  <motion.div
                    key={`img-${globalIndex}`}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      overflow: 'visible',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.5 + imgIndex * 0.1 
                    }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.08,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                      alt={img.label || `Image ${globalIndex + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                        filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.6))'
                      }}
                      onError={(e) => {
                        console.error('TwoRowStatic image load error:', img.src);
                        e.target.style.display = 'none';
                      }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          );
        })}
      </div>

      {/* 图片计数 */}
      <motion.div 
        style={{
          marginTop: '48px',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '2px'
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        {images.length} ITEMS
      </motion.div>
    </div>
  );
};

export default TwoRowStaticScreen;

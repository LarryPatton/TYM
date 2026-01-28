import React from 'react';
import { motion } from 'framer-motion';

/**
 * ============================================
 * 全屏图片展示屏幕 (FullscreenImageScreen)
 * ============================================
 * 简单地全屏展示一张图片，带淡入动画
 * ============================================
 */

const FullscreenImageScreen = ({ bgImage }) => {
  // 构建完整图片路径
  const getImageSrc = (src) => {
    if (!src) return '';
    return `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`;
  };

  return (
    <motion.section
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        overflow: 'hidden'
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {bgImage && (
        <motion.img
          src={getImageSrc(bgImage)}
          alt="Product Final"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          initial={{ scale: 1.05, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        />
      )}
    </motion.section>
  );
};

export { FullscreenImageScreen };
export default FullscreenImageScreen;

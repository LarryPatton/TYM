import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useAnimation } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

/**
 * ImageViewer - 全屏图片查看器组件
 * 
 * 功能：
 * - 全屏显示图片
 * - 鼠标滚轮/按钮缩放 (1x-4x)
 * - 缩放后拖拽移动
 * - 左右箭头翻页
 * - 键盘快捷键 (ESC/←/→)
 * - 显示当前位置 (3/39)
 * - 主题适配
 * - 移动端手势：滑动切换、捏合缩放
 */

const ImageViewer = ({ images = [], initialIndex = 0, isOpen = false, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);
  
  // 触摸手势状态
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [initialPinchDistance, setInitialPinchDistance] = useState(null);
  const [initialScale, setInitialScale] = useState(1);
  const [swipeOffset, setSwipeOffset] = useState(0);
  
  // 滑动动画
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  // 最小滑动距离阈值
  const minSwipeDistance = 50;
  
  // 检测是否移动端
  const isMobile = typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  
  // 同步外部索引并重置缩放
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setSwipeOffset(0);
      x.set(0);
    }
  }, [isOpen, initialIndex]);
  
  // 切换图片时重置缩放
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setSwipeOffset(0);
    x.set(0);
  }, [currentIndex]);
  
  // 上一张
  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);
  
  // 下一张
  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);
  
  // 键盘事件
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goPrev();
          break;
        case 'ArrowRight':
          goNext();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goPrev, goNext]);
  
  // 禁止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // ========== 触摸手势处理 ==========
  
  // 计算两指之间的距离
  const getDistance = (touches) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // 触摸开始
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // 捏合缩放开始
      setInitialPinchDistance(getDistance(e.touches));
      setInitialScale(scale);
    } else if (e.touches.length === 1) {
      // 单指滑动开始
      setTouchStart(e.touches[0].clientX);
      setTouchEnd(null);
      setIsDragging(true);
    }
  };
  
  // 触摸移动
  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialPinchDistance) {
      // 捏合缩放
      const currentDistance = getDistance(e.touches);
      const scaleChange = currentDistance / initialPinchDistance;
      const newScale = Math.min(4, Math.max(0.5, initialScale * scaleChange));
      setScale(newScale);
      e.preventDefault();
    } else if (e.touches.length === 1 && scale <= 1) {
      // 单指滑动（只在未缩放时启用）
      const currentX = e.touches[0].clientX;
      setTouchEnd(currentX);
      
      if (touchStart) {
        const diff = currentX - touchStart;
        setSwipeOffset(diff);
      }
    }
  };
  
  // 触摸结束
  const handleTouchEnd = () => {
    // 重置捏合状态
    setInitialPinchDistance(null);
    setIsDragging(false);
    
    if (scale <= 1 && touchStart && touchEnd) {
      const distance = touchStart - touchEnd;
      const isSwipe = Math.abs(distance) > minSwipeDistance;
      
      if (isSwipe) {
        if (distance > 0) {
          // 向左滑动 -> 下一张
          goNext();
        } else {
          // 向右滑动 -> 上一张
          goPrev();
        }
      }
    }
    
    // 重置滑动位置
    setSwipeOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
    
    // 如果缩放小于1，重置为1
    if (scale < 1) {
      setScale(1);
    }
  };
  
  if (!isOpen || images.length === 0) return null;
  
  const currentImage = images[currentIndex];
  
  // 样式
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: scale > 1 ? 'grab' : 'default',
      touchAction: 'none', // 禁用浏览器默认触摸行为
    },
    closeButton: {
      position: 'fixed',
      top: isMobile ? '16px' : '30px',
      right: isMobile ? '16px' : '30px',
      zIndex: 10002,
      width: isMobile ? '44px' : '50px',
      height: isMobile ? '44px' : '50px',
      borderRadius: '50%',
      border: `2px solid ${isDark ? '#fff' : '#1a1a1a'}`,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      color: isDark ? '#fff' : '#1a1a1a',
      fontSize: isMobile ? '20px' : '24px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      fontWeight: '300'
    },
    navButton: {
      position: 'fixed',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10002,
      width: isMobile ? '44px' : '60px',
      height: isMobile ? '44px' : '60px',
      borderRadius: '50%',
      border: `2px solid ${isDark ? '#fff' : '#1a1a1a'}`,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      color: isDark ? '#fff' : '#1a1a1a',
      fontSize: isMobile ? '24px' : '28px',
      cursor: 'pointer',
      display: isMobile ? 'none' : 'flex', // 移动端隐藏导航按钮（用滑动代替）
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      backdropFilter: 'blur(10px)'
    },
    prevButton: {
      left: '30px'
    },
    nextButton: {
      right: '30px'
    },
    counter: {
      position: 'fixed',
      bottom: isMobile ? '20px' : '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10002,
      padding: isMobile ? '10px 20px' : '12px 24px',
      borderRadius: '100px',
      border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      color: isDark ? '#fff' : '#1a1a1a',
      fontSize: isMobile ? '0.85rem' : '0.95rem',
      fontFamily: 'var(--font-mono, monospace)',
      backdropFilter: 'blur(20px)'
    },
    controls: {
      position: 'fixed',
      top: isMobile ? '16px' : '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10002,
      display: isMobile ? 'none' : 'flex', // 移动端隐藏缩放按钮（用捏合代替）
      gap: '12px'
    },
    controlButton: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      border: `2px solid ${isDark ? '#fff' : '#1a1a1a'}`,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      color: isDark ? '#fff' : '#1a1a1a',
      fontSize: '18px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      backdropFilter: 'blur(10px)'
    },
    imageContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: scale > 1 ? 'grab' : 'default',
      overflow: 'hidden'
    },
    image: {
      maxWidth: isMobile ? '100vw' : '90vw',
      maxHeight: isMobile ? '85vh' : '90vh',
      objectFit: 'contain',
      userSelect: 'none',
      transform: `scale(${scale}) translate(${position.x + (scale <= 1 ? swipeOffset * 0.3 : 0)}px, ${position.y}px)`,
      transformOrigin: 'center center',
      transition: isDragging ? 'none' : 'transform 0.2s ease-out',
      WebkitUserDrag: 'none',
    },
    imageInfo: {
      position: 'fixed',
      bottom: isMobile ? '70px' : '90px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10002,
      color: isDark ? '#888' : '#666',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      textAlign: 'center',
      maxWidth: '80vw',
      padding: '0 16px',
    },
    // 移动端滑动提示
    swipeHint: {
      position: 'fixed',
      bottom: isMobile ? '110px' : '120px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10001,
      color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
      fontSize: '0.75rem',
      display: isMobile && images.length > 1 ? 'flex' : 'none',
      alignItems: 'center',
      gap: '8px',
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={styles.overlay}
          onClick={(e) => {
            // 只有点击背景才关闭（非移动端或未拖动时）
            if (e.target === e.currentTarget && !isDragging) {
              onClose();
            }
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 关闭按钮 */}
          <motion.button
            style={styles.closeButton}
            onClick={onClose}
            whileHover={{ scale: 1.1, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            ✕
          </motion.button>
          
          {/* 上一张按钮 */}
          {images.length > 1 && (
            <motion.button
              style={{ ...styles.navButton, ...styles.prevButton }}
              onClick={goPrev}
              whileHover={{ scale: 1.1, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              ‹
            </motion.button>
          )}
          
          {/* 下一张按钮 */}
          {images.length > 1 && (
            <motion.button
              style={{ ...styles.navButton, ...styles.nextButton }}
              onClick={goNext}
              whileHover={{ scale: 1.1, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              ›
            </motion.button>
          )}
          
          {/* 缩放控制按钮 */}
          <motion.div
            style={styles.controls}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <motion.button
              style={styles.controlButton}
              onClick={() => setScale(prev => Math.max(1, prev - 0.5))}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="缩小"
            >
              −
            </motion.button>
            <motion.button
              style={styles.controlButton}
              onClick={() => {
                setScale(1);
                setPosition({ x: 0, y: 0 });
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="重置"
            >
              ⟲
            </motion.button>
            <motion.button
              style={styles.controlButton}
              onClick={() => setScale(prev => Math.min(4, prev + 0.5))}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="放大"
            >
              +
            </motion.button>
          </motion.div>
          
          {/* 图片容器 */}
          <div ref={imageContainerRef} style={styles.imageContainer}>
            <motion.img
              key={currentImage.id}
              src={currentImage.image}
              alt={currentImage.title}
              style={styles.image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              draggable={false}
            />
          </div>
          
          {/* 移动端滑动提示 */}
          {isMobile && images.length > 1 && (
            <motion.div
              style={styles.swipeHint}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ← 滑动切换 →
            </motion.div>
          )}
          
          {/* 图片信息 */}
          <motion.div
            style={styles.imageInfo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {currentImage.title}
          </motion.div>
          
          {/* 计数器 */}
          {images.length > 1 && (
            <motion.div
              style={styles.counter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentIndex + 1} / {images.length}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageViewer;

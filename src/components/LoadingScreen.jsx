import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { mapProgressWithEasing } from '../utils/easing';

/**
 * 方形边框描边进度指示器组件
 * 从左上角顺时针描边，进度 = 描边长度 / 周长
 */
const SquareProgressBorder = ({ progress, size = 160, strokeWidth = 2 }) => {
  // 计算周长（四边）
  const perimeter = size * 4;
  // 描边长度
  const strokeLength = (progress / 100) * perimeter;
  
  // SVG 路径：从左上角开始，顺时针绘制方形
  // M 0,0 → L size,0 → L size,size → L 0,size → Z
  const pathD = `M ${strokeWidth/2},${strokeWidth/2} 
                 L ${size - strokeWidth/2},${strokeWidth/2} 
                 L ${size - strokeWidth/2},${size - strokeWidth/2} 
                 L ${strokeWidth/2},${size - strokeWidth/2} 
                 Z`;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      {/* 背景边框（浅色） */}
      <path
        d={pathD}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      {/* 进度边框（描边动画） */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="var(--color-text-main)"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeDasharray={perimeter}
        strokeDashoffset={perimeter - strokeLength}
        initial={{ strokeDashoffset: perimeter }}
        animate={{ strokeDashoffset: perimeter - strokeLength }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </svg>
  );
};

/**
 * Logo 动画组件（复用导航栏逻辑）
 * 底层旋转 + 顶层交替
 */
const AnimatedLogo = ({ size = 60 }) => {
  const { theme } = useTheme();
  const [logoTopIndex, setLogoTopIndex] = useState(0);
  const [logoRotation, setLogoRotation] = useState(0);
  
  // Logo 动画定时器
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoTopIndex(prev => (prev === 0 ? 1 : 0));
      setLogoRotation(prev => prev - 90);
    }, 2000); // 加载页更快切换
    
    return () => clearInterval(interval);
  }, []);
  
  // 根据主题选择素材
  const logoPrefix = theme === 'dark' ? 'logo_black' : 'logo_white';
  
  return (
    <div style={{ 
      position: 'relative',
      width: size,
      height: size,
    }}>
      {/* 底层图片 - 逆时针旋转 */}
      <motion.img 
        src={`/images/logo/${logoPrefix}_bottom.png`}
        alt="Logo" 
        animate={{ rotate: logoRotation }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ 
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }} 
      />
      {/* 顶层图片1 - 交替显示 */}
      <motion.img 
        src={`/images/logo/${logoPrefix}_top.png`}
        alt="" 
        initial={{ opacity: 1, scale: 1 }}
        animate={{ 
          opacity: logoTopIndex === 0 ? 1 : 0,
          scale: logoTopIndex === 0 ? 1 : 0.3,
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }} 
      />
      {/* 顶层图片2 - 交替显示 */}
      <motion.img 
        src={`/images/logo/${logoPrefix}_top2.png`}
        alt="" 
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ 
          opacity: logoTopIndex === 1 ? 1 : 0,
          scale: logoTopIndex === 1 ? 1 : 0.3,
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }} 
      />
    </div>
  );
};

/**
 * 加载屏幕组件 - 全屏遮罩 + Logo + 方形边框进度
 * 
 * @param {boolean} isVisible - 是否显示加载屏幕
 * @param {number} realProgress - 真实加载进度（0-100）
 * @param {number} loadedCount - 已加载数量
 * @param {number} totalCount - 总数量
 * @param {string} phaseNumber - Phase 编号（如 "05"）
 * @param {number} threshold - 映射阈值（默认 50）
 * @param {number} minDuration - 最小动画时长（毫秒）
 * @param {function} onAnimationComplete - 动画完成回调
 */
const LoadingScreen = ({ 
  isVisible, 
  realProgress = 0, 
  loadedCount = 0, 
  totalCount = 0,
  phaseNumber = '',
  threshold = 50,
  minDuration = 2500,
  onAnimationComplete
}) => {
  const { t } = useTranslation();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [optimisticProgress, setOptimisticProgress] = useState(0);
  const lastRealProgressRef = useRef(0);
  
  // 乐观加载配置
  const OPTIMISTIC_MAX = 15;
  const OPTIMISTIC_SPEED = 0.3;
  const CATCH_UP_SPEED = 3;
  
  // 进度条动画控制器
  useEffect(() => {
    if (!isVisible) {
      setDisplayProgress(0);
      setStartTime(null);
      setOptimisticProgress(0);
      lastRealProgressRef.current = 0;
      return;
    }
    
    if (startTime === null) {
      setStartTime(Date.now());
    }
    
    const animationInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - (startTime || now);
      
      const timeBasedProgress = Math.min((elapsed / minDuration) * 100, 100);
      const mappedRealProgress = mapProgressWithEasing(realProgress, threshold);
      const realProgressIncreased = realProgress > lastRealProgressRef.current;
      lastRealProgressRef.current = realProgress;
      
      setOptimisticProgress(prev => {
        if (realProgress > 5) {
          return prev;
        }
        if (prev < OPTIMISTIC_MAX) {
          return Math.min(prev + OPTIMISTIC_SPEED, OPTIMISTIC_MAX);
        }
        return prev;
      });
      
      const effectiveProgress = Math.max(optimisticProgress, mappedRealProgress);
      const targetProgress = Math.min(timeBasedProgress, effectiveProgress);
      
      setDisplayProgress(prev => {
        if (mappedRealProgress > prev && realProgressIncreased) {
          return Math.min(prev + CATCH_UP_SPEED, mappedRealProgress);
        }
        if (targetProgress > prev) {
          return Math.min(prev + 1, targetProgress);
        }
        return prev;
      });
      
      if (displayProgress >= 100 && realProgress >= threshold) {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
        clearInterval(animationInterval);
      }
    }, 50);
    
    return () => clearInterval(animationInterval);
  }, [isVisible, realProgress, threshold, startTime, minDuration, displayProgress, optimisticProgress, onAnimationComplete]);

  // 配置
  const LOGO_SIZE = 60; // Logo 尺寸
  const BORDER_SIZE = 140; // 边框尺寸（Logo + 内间距）
  const BORDER_STROKE = 1.5; // 边框粗细

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* 内容容器 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-lg)',
              padding: 'var(--space-2xl)',
            }}
          >
            {/* Phase 标题（可选） */}
            {phaseNumber && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Phase {phaseNumber}
              </motion.div>
            )}
            
            {/* Logo + 方形边框进度容器 */}
            <div style={{
              position: 'relative',
              width: BORDER_SIZE,
              height: BORDER_SIZE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* 方形边框进度 */}
              <SquareProgressBorder 
                progress={displayProgress} 
                size={BORDER_SIZE} 
                strokeWidth={BORDER_STROKE}
              />
              
              {/* Logo 动画 */}
              <AnimatedLogo size={LOGO_SIZE} />
            </div>
            
            {/* 品牌名 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{
                fontFamily: "'Afacad', var(--font-sans)",
                fontWeight: '600',
                fontSize: '1.5rem',
                letterSpacing: '0.05em',
                color: 'var(--color-text-main)',
                marginTop: '-8px', // 稍微靠近边框
              }}
            >
              LUMI TIAN
            </motion.div>
            
            {/* 进度信息 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                marginTop: 'var(--space-md)',
              }}
            >
              {/* 百分比 */}
              <div
                style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: '600',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-text-main)',
                  letterSpacing: '0.05em',
                }}
              >
                {Math.round(displayProgress)}%
              </div>
              
              {/* 提示文本 */}
              <div
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {displayProgress < 20 && t('loading.text1')}
                {displayProgress >= 20 && displayProgress < 40 && t('loading.text2')}
                {displayProgress >= 40 && displayProgress < 60 && t('loading.text3')}
                {displayProgress >= 60 && displayProgress < 85 && t('loading.text4')}
                {displayProgress >= 85 && t('loading.text5')}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
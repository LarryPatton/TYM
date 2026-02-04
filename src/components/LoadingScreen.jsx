import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { mapProgressWithEasing } from '../utils/easing';

/**
 * 加载屏幕组件 - 全屏遮罩 + 中心进度条
 * 符合网站视觉风格，支持亮色/暗色主题切换
 * 
 * 乐观加载策略：
 * - 即使真实进度为 0%，也会缓慢推进显示进度（1, 2, 3...）
 * - 乐观进度有上限（默认 15%），避免用户等待时看到虚假的高进度
 * - 当真实进度追上来后，进度条会快速推进
 * 
 * @param {boolean} isVisible - 是否显示加载屏幕（由 !canEnter 控制）
 * @param {number} realProgress - 真实加载进度（0-100）
 * @param {number} loadedCount - 已加载数量
 * @param {number} totalCount - 总数量
 * @param {string} phaseNumber - Phase 编号（如 "05"）
 * @param {number} threshold - 映射阈值（默认 50，即真实 50% 映射到显示 100%）
 */
const LoadingScreen = ({ 
  isVisible, 
  realProgress = 0, 
  loadedCount = 0, 
  totalCount = 0,
  phaseNumber = '',
  threshold = 50,
  minDuration = 2500, // 最小动画时长（毫秒）
  onAnimationComplete // 动画完成回调
}) => {
  const { t } = useTranslation();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [optimisticProgress, setOptimisticProgress] = useState(0);
  const lastRealProgressRef = useRef(0);
  
  // 乐观加载配置
  const OPTIMISTIC_MAX = 15; // 乐观进度上限（%）
  const OPTIMISTIC_SPEED = 0.3; // 乐观进度增长速度（每50ms增加的%）
  const CATCH_UP_SPEED = 3; // 真实进度追上后的加速速度
  
  // 独立的进度条动画控制器
  useEffect(() => {
    if (!isVisible) {
      setDisplayProgress(0);
      setStartTime(null);
      setOptimisticProgress(0);
      lastRealProgressRef.current = 0;
      return;
    }
    
    // 记录开始时间
    if (startTime === null) {
      setStartTime(Date.now());
    }
    
    const animationInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - (startTime || now);
      
      // 计算基于时间的进度（确保至少 minDuration 才能到 100%）
      const timeBasedProgress = Math.min((elapsed / minDuration) * 100, 100);
      
      // 计算基于真实加载的进度（映射 0-50% → 0-100%）
      const mappedRealProgress = mapProgressWithEasing(realProgress, threshold);
      
      // 检测真实进度是否有增长
      const realProgressIncreased = realProgress > lastRealProgressRef.current;
      lastRealProgressRef.current = realProgress;
      
      setOptimisticProgress(prev => {
        // 如果真实进度已经开始增长，乐观进度不再单独增长
        if (realProgress > 5) {
          return prev; // 冻结乐观进度
        }
        // 否则，缓慢增长乐观进度，但不超过上限
        if (prev < OPTIMISTIC_MAX) {
          return Math.min(prev + OPTIMISTIC_SPEED, OPTIMISTIC_MAX);
        }
        return prev;
      });
      
      // 计算最终目标进度
      // 取 乐观进度 和 真实进度 的较大值
      const effectiveProgress = Math.max(optimisticProgress, mappedRealProgress);
      
      // 结合时间限制
      const targetProgress = Math.min(timeBasedProgress, effectiveProgress);
      
      setDisplayProgress(prev => {
        // 如果真实进度大于当前显示，快速追赶
        if (mappedRealProgress > prev && realProgressIncreased) {
          return Math.min(prev + CATCH_UP_SPEED, mappedRealProgress);
        }
        // 平滑增长到目标
        if (targetProgress > prev) {
          return Math.min(prev + 1, targetProgress);
        }
        return prev;
      });
      
      // 当显示进度到达 100% 时，触发完成回调
      if (displayProgress >= 100 && realProgress >= threshold) {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
        clearInterval(animationInterval);
      }
    }, 50); // 每 50ms 更新一次
    
    return () => clearInterval(animationInterval);
  }, [isVisible, realProgress, threshold, startTime, minDuration, displayProgress, optimisticProgress, onAnimationComplete]);

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
            zIndex: 999, // 低于导航栏的 1000，让导航栏始终可见
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
              gap: 'var(--space-xl)',
              padding: 'var(--space-2xl)',
              maxWidth: '480px',
              width: '100%',
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
            
            {/* 进度条容器 */}
            <div style={{ width: '100%' }}>
              {/* 进度条背景 */}
              <div
                style={{
                  width: '100%',
                  height: '4px',
                  background: 'var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* 进度条填充 */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${displayProgress}%` }}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{
                    height: '100%',
                    background: 'var(--color-text-main)',
                    borderRadius: 'var(--radius-full)',
                    position: 'relative',
                  }}
                >
                  {/* 进度条发光效果（暗色模式更明显） */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '50%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3))',
                      animation: 'shimmer 2s infinite',
                    }}
                  />
                </motion.div>
              </div>
            </div>
            
            {/* 进度信息 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-sm)',
              }}
            >
              {/* 百分比 - 显示映射后的进度 */}
              <div
                style={{
                  fontSize: 'var(--text-h3)',
                  fontWeight: '700',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-text-main)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {Math.round(displayProgress)}%
              </div>
              
              {/* 提示文本 - 根据进度变化 */}
              <div
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {displayProgress < 30 && t('loading.loadingAssets')}
                {displayProgress >= 30 && displayProgress < 70 && t('loading.preparingExperience')}
                {displayProgress >= 70 && displayProgress < 95 && t('loading.almostReady')}
                {displayProgress >= 95 && t('loading.welcome')}
              </div>
            </motion.div>
          </motion.div>
          
          {/* CSS 动画定义 */}
          <style>{`
            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(200%);
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { useTheme } from '../hooks/useTheme';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { useIsMobile } from '../hooks/useMediaQuery';
import { Link } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import WorkGalleryTypewriter from '../components/WorkGalleryTypewriter';

// 倾斜切割背景组件 - 使用 clip-path 实现真正的斜切效果，带层叠进入动画
const SlicedBackground = ({ phases, isDark }) => {
  const sliceCount = phases.length;
  const slantOffset = 15; // 倾斜偏移量 (百分比)
  const leftShift = -8;   // 整体向左偏移，减小第一个区域面积
  
  // 计算每个切片的 clip-path（斜线从右上向左下）
  const getClipPath = (index) => {
    const totalSlices = sliceCount;
    const sliceWidth = 100 / totalSlices;
    
    // 计算左右边界位置 - 顶部向右偏移，底部不偏移，整体向左移动
    const leftTop = index * sliceWidth + slantOffset + leftShift;
    const leftBottom = index * sliceWidth + leftShift;
    const rightTop = (index + 1) * sliceWidth + slantOffset + leftShift;
    const rightBottom = (index + 1) * sliceWidth + leftShift;
    
    // 第一个和最后一个切片需要特殊处理边界
    if (index === 0) {
      return `polygon(0% 0%, ${rightTop}% 0%, ${rightBottom}% 100%, 0% 100%)`;
    }
    if (index === totalSlices - 1) {
      return `polygon(${leftTop}% 0%, 100% 0%, 100% 100%, ${leftBottom}% 100%)`;
    }
    return `polygon(${leftTop}% 0%, ${rightTop}% 0%, ${rightBottom}% 100%, ${leftBottom}% 100%)`;
  };
  
  // 【新】两阶段动画变体：先整张滑入堆叠，再统一变成斜切
  const imageSlideIn = {
    hidden: { 
      x: '100%', // 初始位置：右侧外
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // 完整矩形
    },
    visible: (index) => ({ 
      x: '0%', // 阶段1：滑入到正常位置（保持矩形）
      clipPath: [
        'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // 滑入时保持矩形
        'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // 就位后仍是矩形
        getClipPath(index), // 阶段2：所有就位后才变成斜切
      ],
      transition: { 
        x: {
          duration: 1.6, // 滑入时长
          delay: index * 0.35, // 交错延迟
          ease: [0.16, 1, 0.3, 1]
        },
        clipPath: {
          times: [0, 0.7, 1], // 0-70%保持矩形，70-100%变斜切
          duration: 1.6 + 0.35 * 5 + 0.8, // 总时长：等所有图滑入 + 变形时间
          delay: index * 0.35,
          ease: [0.16, 1, 0.3, 1]
        }
      }
    })
  };
  
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
    }}>
      {phases.map((phase, index) => (
        <motion.div
          key={phase.id}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={imageSlideIn}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: index + 1, // 后一张叠在前一张上面
          }}
        >
          {/* 图片或渐变背景 - 无遮罩，保持原始亮度 */}
          {phase.image ? (
            <img
              src={`${import.meta.env.BASE_URL}${phase.image.replace(/^\//, '')}`}
              alt={phase.titleEn}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: isDark
                ? `linear-gradient(180deg, 
                    hsl(${180 + index * 15}, 30%, 25%) 0%, 
                    hsl(${180 + index * 15}, 25%, 15%) 100%)`
                : `linear-gradient(180deg, 
                    hsl(${200 + index * 12}, 15%, 85%) 0%, 
                    hsl(${200 + index * 12}, 20%, 75%) 100%)`,
            }} />
          )}
        </motion.div>
      ))}
      
      {/* 斜线分隔线 - 从右上向左下 */}
      {phases.slice(0, -1).map((_, index) => {
        const sliceWidth = 100 / sliceCount;
        const lineTopX = (index + 1) * sliceWidth + slantOffset + leftShift;  // 顶部向右偏移 + 整体左移
        const lineBottomX = (index + 1) * sliceWidth + leftShift;              // 底部不偏移 + 整体左移
        
        return (
          <svg
            key={`line-${index}`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <line
              x1={`${lineTopX}%`}
              y1="0%"
              x2={`${lineBottomX}%`}
              y2="100%"
              stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}
              strokeWidth="1"
            />
          </svg>
        );
      })}
    </div>
  );
};

// 移动端 2×3 网格组件 - 淡入 + 轻微上移动画
const MobileGridBackground = ({ phases, isDark }) => {
  const columns = 2;
  
  // 计算每个卡片在网格中的位置
  const getGridPosition = (index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    
    const cellWidth = 49; // 每个卡片宽度 49%
    const cellHeight = 32; // 每个卡片高度约 32%
    const gapX = 1;
    const gapY = 0.5;
    
    return {
      left: `${col * (cellWidth + gapX) + 0.5}%`,
      top: `${row * (cellHeight + gapY) + 0.5}%`,
      width: `${cellWidth}%`,
      height: `${cellHeight}%`,
    };
  };
  
  // 淡入 + 轻微上移动画
  const fadeInUp = {
    hidden: { 
      opacity: 0, 
      y: 24, // 从下方 24px 开始
    },
    visible: (index) => ({
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.7, // 更慢的淡入
        delay: 0.5 + index * 0.15, // 延迟 0.5s 后开始，每张间隔 0.15s
        ease: [0.25, 0.1, 0.25, 1], // 更平缓的缓动曲线
      }
    })
  };
  
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
    }}>
      {phases.map((phase, index) => {
        const pos = getGridPosition(index);
        return (
          <motion.div
            key={phase.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            style={{
              position: 'absolute',
              ...pos,
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {/* 图片或渐变背景 */}
            {phase.image ? (
              <img
                src={`${import.meta.env.BASE_URL}${phase.image.replace(/^\//, '')}`}
                alt={phase.titleEn}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: isDark
                  ? `linear-gradient(135deg, 
                      hsl(${180 + index * 20}, 30%, 25%) 0%, 
                      hsl(${180 + index * 20}, 25%, 15%) 100%)`
                  : `linear-gradient(135deg, 
                      hsl(${200 + index * 15}, 15%, 85%) 0%, 
                      hsl(${200 + index * 15}, 20%, 75%) 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{
                  fontSize: '1.5rem',
                  color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  fontWeight: '700',
                }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            )}
            
            {/* 序号标签 */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.15 + 0.4, duration: 0.3 }}
              style={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                padding: '3px 8px',
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '4px',
                fontSize: '0.7rem',
                color: '#fff',
                fontWeight: '600',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

const Work = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  useTitle(t('work.pageTitle'));

  // ========== 图片预加载逻辑 ==========
  
  // 定义 phases 数据用于倾斜背景（深度案例研究）
  // 移动端使用 /images/mobile/work/ 目录
  // 桌面端使用 /covers/work/phases/ 目录
  const phases = [
    {
      id: 'phase-01',
      titleEn: 'Brand Identity',
      image: isMobile ? '/images/mobile/work/Desktop - 1.png' : '/covers/work/phases/phase-01-cover.png',
    },
    {
      id: 'phase-02',
      titleEn: 'Product A',
      image: isMobile ? '/images/mobile/work/Desktop - 2.png' : '/covers/work/phases/phase-02-cover.png',
    },
    {
      id: 'phase-03',
      titleEn: 'Product B',
      image: isMobile ? '/images/mobile/work/Desktop - 3.png' : '/covers/work/phases/phase-03-cover.png',
    },
    {
      id: 'phase-04',
      titleEn: 'Packaging',
      image: isMobile ? '/images/mobile/work/Desktop - 4.png' : '/covers/work/phases/phase-04-cover.png',
    },
    {
      id: 'phase-05',
      titleEn: 'Retail & Experience Expansion',
      image: isMobile ? '/images/mobile/work/Desktop - 5.png' : '/covers/work/phases/phase-05-cover.png',
    },
    {
      id: 'phase-06',
      titleEn: 'Copywriting Visualization',
      image: isMobile ? '/images/mobile/work/Desktop - 6.png' : '/covers/work/phases/phase-06-cover.png',
    }
  ];

  // 收集所有需要预加载的图片 URL（Work 页和 CaseIndex 使用同一批图片）
  const imageUrls = useMemo(() => {
    const urls = [];
    const baseUrl = import.meta.env.BASE_URL || '/';
    const normalizeUrl = (path) => {
      if (!path || typeof path !== 'string') return null;
      const cleanPath = path.startsWith('/') ? path.substring(1) : path;
      return baseUrl + cleanPath;
    };
    
    // 收集 phases 图片
    phases.forEach(phase => {
      if (phase.image) {
        urls.push(normalizeUrl(phase.image));
      }
    });
    
    // 去重并过滤空值
    const uniqueUrls = [...new Set(urls)].filter(url => url && url.trim() !== '');
    
    console.log('[Work] Collected image URLs:', uniqueUrls.length, uniqueUrls);
    
    return uniqueUrls;
  }, []);
  
  // 添加标志位，确保只加载一次
  const [hasPreloaded, setHasPreloaded] = useState(false);
  // 添加 canEnter 状态，由动画完成回调控制
  const [canEnter, setCanEnter] = useState(false);
  
  // 使用图片预加载 Hook（30% 阈值策略，因为图片较少）
  const { isLoading, progress, loadedCount, totalCount, fromCache } = useImagePreloader(imageUrls, {
    enabled: !hasPreloaded,
    threshold: 30, // 加载 30% 后即可进入页面（资源少，降低阈值）
    pageId: 'work', // 页面级缓存标识
    onThresholdReached: (info) => {
      console.log('[Work] ✅ 30% threshold reached!', info);
    },
    onComplete: (stats) => {
      console.log('[Work] ✅ 100% loading complete!', stats);
      setHasPreloaded(true);
    },
    onProgress: (info) => {
      console.log('[Work] Progress update:', info);
    }
  });
  
  // 动画完成回调：只有动画播放完毕且真实加载 >= 30% 时才允许进入
  const handleAnimationComplete = useCallback(() => {
    if (progress >= 30) {
      console.log('[Work] ✅ Animation complete! User can enter page.');
      setCanEnter(true);
    }
  }, [progress]);
  
  // 🚀 缓存命中时直接跳过加载页（不等待动画）
  useEffect(() => {
    if (fromCache && !canEnter) {
      console.log('[Work] 🚀 Cache hit! Skipping loading screen.');
      setCanEnter(true);
    }
  }, [fromCache, canEnter]);
  
  // 调试输出
  useEffect(() => {
    console.log('[Work] Loading state:', { 
      isLoading, 
      canEnter, 
      progress, 
      loadedCount, 
      totalCount, 
      hasPreloaded,
      displayProgress: `真实 ${progress}% → 显示 ${progress >= 30 ? 100 : Math.round((progress / 30) * 100)}%`
    });
  }, [isLoading, canEnter, progress, loadedCount, totalCount, hasPreloaded]);

  // ========== 动画变体定义 ==========
  
  // 页面容器 - 控制整体交错
  const pageContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.6 // 延迟 0.6 秒开始动画（等待加载屏幕完全退出）
      }
    }
  };

  // 卡片容器 - 控制内部元素交错
  // PC端需要等待斜切动画完成 (3.5s)，移动端图片动画更快 (约1.8s)
  const cardContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: isMobile ? 0 : 3.5 // 移动端文字动画独立控制，不使用容器延迟
      }
    }
  };

  // 基础淡入上移
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // 标签淡入（带左侧滑入）- 不设置固定 delay，继承父容器的 delayChildren
  const labelReveal = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // 标题逐字淡入
  const titleContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0
      }
    }
  };

  const letterReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // 描述文字淡入
  const descReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // 标签组交错淡入
  const tagsContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0
      }
    }
  };

  const tagItem = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // CTA 按钮淡入（带箭头动画）
  const ctaReveal = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // 分割线生长动画
  const dividerLineLeft = {
    hidden: { scaleX: 0, originX: 1 },
    visible: { 
      scaleX: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const dividerLineRight = {
    hidden: { scaleX: 0, originX: 0 },
    visible: { 
      scaleX: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const dividerText = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // ========== 组件渲染函数 ==========

  // 逐字动画标题
  const AnimatedTitle = ({ text, style, as: Tag = 'h2' }) => (
    <Tag style={{ margin: 0, ...style }}>
      <motion.span
        variants={titleContainer}
        style={{ display: 'inline-block' }}
      >
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            variants={letterReveal}
            style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );

  // 左侧竖线标签（带动画）
  const AnimatedLabel = ({ text, isPrimary = true }) => (
    <motion.div 
      variants={labelReveal}
      style={{
        fontSize: isPrimary ? '0.9rem' : '0.8rem',
        color: styles.label.color,
        marginBottom: isPrimary ? '20px' : '14px',
        paddingLeft: '12px',
        borderLeft: `2px solid ${styles.label.borderColor}`,
        fontWeight: '500',
        letterSpacing: '0.02em',
        textShadow: styles.label.textShadow || 'none',
      }}
    >
      {text}
    </motion.div>
  );

  // ========== 样式定义 ==========

  // 暗色模式样式
  const darkStyles = {
    page: {
      backgroundColor: '#0a0a0a',
      color: '#fff'
    },
    primary: {
      height: 'calc(100vh - var(--nav-height))', // 单屏展示，扣除导航栏高度
      padding: 'clamp(60px, 10vw, 120px)',
      backgroundColor: '#0a0a0a',
      cursor: 'pointer',
      boxSizing: 'border-box', // 确保 padding 包含在高度内
      overflow: 'hidden' // 防止内容溢出
    },
    primaryHover: { backgroundColor: '#151515' },
    secondary: {
      minHeight: '40vh',
      padding: 'clamp(50px, 8vw, 100px)',
      backgroundColor: '#0a0a0a',
      cursor: 'pointer'
    },
    secondaryHover: { backgroundColor: '#151515' },
    dividerBg: '#0a0a0a',
    dividerLine: '#222',
    dividerText: '#555',
    label: { color: '#aaa', borderColor: '#555' },
    title: { color: '#fff', fontWeight: '400' },
    desc: { color: '#ccc' },
    quote: { color: '#999' },
    cta: { color: '#fff', fontWeight: '600' },
    tag: { border: '1px solid #555', color: '#ccc', backgroundColor: 'rgba(255,255,255,0.05)' }
  };

  // 亮色模式样式 - PC端：文字使用白色+阴影，确保在彩色背景上可读
  const lightStylesDesktop = {
    page: {
      backgroundColor: '#f8f8f8',
      color: '#1a1a1a'
    },
    primary: {
      height: 'calc(100vh - var(--nav-height))', // 单屏展示，扣除导航栏高度
      padding: 'clamp(60px, 10vw, 120px)',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      boxSizing: 'border-box', // 确保 padding 包含在高度内
      overflow: 'hidden' // 防止内容溢出
    },
    primaryHover: { backgroundColor: '#f0f0f0' },
    secondary: {
      minHeight: '40vh',
      padding: 'clamp(40px, 6vw, 80px)',
      backgroundColor: '#ffffff',
      cursor: 'pointer'
    },
    secondaryHover: { backgroundColor: '#f0f0f0' },
    dividerBg: '#f8f8f8',
    dividerLine: '#e5e5e5',
    dividerText: '#999',
    label: { color: '#fff', borderColor: 'rgba(255,255,255,0.6)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' },
    title: { color: '#fff', fontWeight: '500', textShadow: '0 2px 12px rgba(0,0,0,0.6)' },
    desc: { color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 6px rgba(0,0,0,0.5)' },
    quote: { color: 'rgba(255,255,255,0.8)' },
    cta: { color: '#fff', fontWeight: '600' },
    tag: { border: '1px solid rgba(255,255,255,0.5)', color: '#fff', backgroundColor: 'rgba(0,0,0,0.2)', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }
  };

  // 亮色模式样式 - 移动端：文字区域有白色背景，使用深色文字
  const lightStylesMobile = {
    page: {
      backgroundColor: '#f8f8f8',
      color: '#1a1a1a'
    },
    primary: {
      height: 'calc(100vh - var(--nav-height))',
      padding: 'clamp(60px, 10vw, 120px)',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      boxSizing: 'border-box',
      overflow: 'hidden'
    },
    primaryHover: { backgroundColor: '#f0f0f0' },
    secondary: {
      minHeight: '40vh',
      padding: 'clamp(40px, 6vw, 80px)',
      backgroundColor: '#ffffff',
      cursor: 'pointer'
    },
    secondaryHover: { backgroundColor: '#f0f0f0' },
    dividerBg: '#f8f8f8',
    dividerLine: '#e5e5e5',
    dividerText: '#999',
    // 移动端使用深色文字（白色背景）
    label: { color: '#666', borderColor: '#ccc' },
    title: { color: '#111', fontWeight: '500' },
    desc: { color: '#444' },
    quote: { color: '#666' },
    cta: { color: '#fff', fontWeight: '600' },
    tag: { border: '1px solid #ddd', color: '#555', backgroundColor: 'rgba(0,0,0,0.03)' }
  };

  // 根据设备和主题选择样式
  const styles = isDark ? darkStyles : (isMobile ? lightStylesMobile : lightStylesDesktop);

  // 滚动提示透明度控制
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <>
      {/* 加载屏幕 - 使用 !canEnter 控制显示，动画至少 1 秒 */}
      <LoadingScreen 
        isVisible={!canEnter}
        realProgress={progress}
        loadedCount={loadedCount}
        totalCount={totalCount}
        phaseNumber="" // Work 页面不显示 Phase 编号
        threshold={30}
        minDuration={1000} // 最小动画时长 1 秒
        onAnimationComplete={handleAnimationComplete}
      />
      
      <AnimatePresence mode="wait">
        {canEnter && (
          <motion.div 
            key={`work-content-${canEnter}`} // 使用 canEnter 作为 key 的一部分，确保重新挂载
            initial="hidden"
            animate="visible"
            variants={pageContainer}
            style={{ 
              minHeight: '100vh',
              position: 'relative',
              ...styles.page
            }}
          >
      {/* 主卡片：深度案例研究 */}
      {isMobile ? (
        // ========== 移动端：全屏飞入 → 收束到上部分区（flex 布局，区域不重叠）==========
        <Link to="/work/the-case" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <motion.div 
            variants={cardContainer}
            style={{ 
              height: 'calc(100vh - var(--nav-height))',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: isDark ? '#0a0a0a' : '#fff',
            }}
          >
            {/* 上部：图片网格区 (65%) - 允许内容溢出以实现全屏飞入 */}
            <div style={{
              flex: '0 0 65%',
              position: 'relative',
              overflow: 'visible', // 允许卡片溢出覆盖文字区
              zIndex: 10,
            }}>
              <MobileGridBackground phases={phases} isDark={isDark} containerHeight={65} />
            </div>
            
            {/* 下部：文字内容区 (35%) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 1.5, // 图片即将完成时开始（最后一张约 1.95s 完成，提前 0.4s 开始）
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1]
              }}
              style={{
                flex: '0 0 35%',
                padding: 'var(--space-md) var(--space-page-x)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: isDark ? '#0a0a0a' : '#fff',
                borderTop: `1px solid ${isDark ? '#222' : '#eee'}`,
                zIndex: 1,
              }}
            >
              {/* 标签 */}
              <AnimatedLabel text={t('work.featuredCaseStudy')} isPrimary={true} />
              
              {/* 标题 */}
              <motion.div variants={fadeInUp} style={{ marginBottom: '8px' }}>
                <AnimatedTitle 
                  text={t('work.featured.title')}
                  style={{ 
                    fontFamily: 'var(--font-serif)', 
                    fontSize: 'clamp(1.5rem, 6vw, 2rem)', 
                    lineHeight: 1.1,
                    ...styles.title
                  }}
                />
              </motion.div>
              
              {/* 描述 */}
              <motion.p 
                variants={descReveal}
                style={{ 
                  fontSize: '0.8rem', 
                  lineHeight: 1.5, 
                  marginBottom: '16px', 
                  ...styles.desc
                }}
              >
                {t('work.featured.desc')}
              </motion.p>
              
              {/* CTA 按钮 */}
              <motion.div 
                variants={ctaReveal}
                style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: '600', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '10px 18px',
                  background: isDark ? '#fff' : '#111',
                  color: isDark ? '#111' : '#fff',
                  borderRadius: 'var(--radius-full)',
                  width: 'fit-content',
                }}
              >
                {t('work.viewFullCase')} 
                <motion.span 
                  style={{ fontSize: '1rem', display: 'inline-block' }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>
        </Link>
      ) : (
        // ========== 桌面端：原有斜切布局 ==========
        <Link to="/work/the-case" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <motion.div 
            variants={cardContainer}
            whileHover={styles.primaryHover}
            transition={{ duration: 0.3 }}
            style={{ 
              ...styles.primary,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* 倾斜切割背景 */}
            <SlicedBackground phases={phases} isDark={isDark} />
            
            {/* 左侧渐变遮罩 - 仅深色模式显示 */}
            {isDark && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.8) 25%, rgba(10,10,10,0.4) 45%, transparent 60%)',
                pointerEvents: 'none',
                zIndex: 10, // 提高 z-index，确保在斜切图片之上
              }} />
            )}
            
            {/* 前景内容 - 打字机效果 */}
            <WorkGalleryTypewriter
              title={t('work.featured.title')}
              description={t('work.featured.desc')}
              ctaText={t('work.viewFullCase')}
              tags={[]} // 移除标签组
              styles={styles}
              isDark={isDark}
              startDelay={3500} // 等待斜切动画完成（3.5秒）
            />
          </motion.div>
        </Link>
      )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Work;

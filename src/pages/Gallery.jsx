import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle';
import { useTheme } from '../hooks/useTheme';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { useIsMobile } from '../hooks/useMediaQuery';
import LoadingScreen from '../components/LoadingScreen';

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
          duration: 1.6 + 0.35 * 4 + 0.8, // 总时长：等所有图滑入 + 变形时间
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

// 移动端网格组件 - 全屏飞入 → 收束到容器内网格
// Gallery 有 6 个项目，使用 2列×3行 网格布局
// containerHeight: 容器在整个页面中的高度比例（用于计算全屏飞入时的高度）
const MobileGridBackground = ({ phases, isDark, containerHeight = 65 }) => {
  const itemCount = phases.length; // 6 个项目
  const columns = 2;
  const rows = 3;
  
  // 计算每个卡片在网格中的最终位置（相对于容器 100%）
  const getGridPosition = (index) => {
    // 6 个项目布局（2×3 网格）：
    // [0] [1]  -> 第一行
    // [2] [3]  -> 第二行
    // [4] [5]  -> 第三行
    
    const col = index % columns;
    const row = Math.floor(index / columns);
    
    const cellWidth = 49; // 每个卡片宽度 49%
    const cellHeight = 32; // 每个卡片高度约 32%（100% / 3）
    const gapX = 1; // 水平间距 1%
    const gapY = 0.5; // 垂直间距 0.5%
    
    return {
      left: `${col * (cellWidth + gapX) + 0.5}%`,
      top: `${row * (cellHeight + gapY) + 0.5}%`,
      width: `${cellWidth}%`,
      height: `${cellHeight}%`,
    };
  };
  
  // 动画时间配置
  const flyInDuration = 0.7;
  const flyInDelay = 0.2;
  const totalFlyInTime = flyInDuration + flyInDelay * (itemCount - 1);
  const collapseDelay = totalFlyInTime + 0.4;
  const collapseDuration = 0.8;
  
  // 计算全屏飞入时的高度（相对于容器，需要放大到覆盖整个页面）
  const fullScreenHeight = `${(100 / containerHeight) * 100}%`;
  
  // 两阶段动画：全屏飞入 → 收束到容器内网格
  const cardAnimation = {
    hidden: { 
      x: '100%',
      top: '0%',
      left: '0%',
      width: '100%',
      height: fullScreenHeight, // 超出容器覆盖整个页面
      borderRadius: 0,
    },
    visible: (index) => {
      const finalPos = getGridPosition(index);
      return {
        x: ['100%', '0%', '0%'],
        top: ['0%', '0%', finalPos.top],
        left: ['0%', '0%', finalPos.left],
        width: ['100%', '100%', finalPos.width],
        height: [fullScreenHeight, fullScreenHeight, finalPos.height], // 从全屏高度收缩
        borderRadius: [0, 0, 8],
        transition: {
          x: {
            duration: flyInDuration,
            delay: index * flyInDelay,
            ease: [0.16, 1, 0.3, 1],
          },
          top: {
            duration: collapseDuration,
            delay: collapseDelay,
            ease: [0.16, 1, 0.3, 1],
          },
          left: {
            duration: collapseDuration,
            delay: collapseDelay,
            ease: [0.16, 1, 0.3, 1],
          },
          width: {
            duration: collapseDuration,
            delay: collapseDelay,
            ease: [0.16, 1, 0.3, 1],
          },
          height: {
            duration: collapseDuration,
            delay: collapseDelay,
            ease: [0.16, 1, 0.3, 1],
          },
          borderRadius: {
            duration: collapseDuration,
            delay: collapseDelay,
            ease: [0.16, 1, 0.3, 1],
          },
        }
      };
    }
  };
  
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'visible', // 允许内容溢出容器（飞入时覆盖整个页面）
    }}>
      {phases.map((phase, index) => (
        <motion.div
          key={phase.id}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={cardAnimation}
          style={{
            position: 'absolute',
            overflow: 'hidden',
            zIndex: index + 1,
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
          
          {/* 序号标签 - 收束完成后显示 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: collapseDelay + collapseDuration + 0.1, duration: 0.3 }}
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
      ))}
    </div>
  );
};

const Gallery = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  useTitle(t('gallery.pageTitle'));

  // 定义 gallery 数据用于艺术画廊斜切背景（使用占位图）
  // 飞入素材配置 - 自动按数字顺序读取 fly-in 文件夹中的图片
  const galleryItems = Array.from({ length: 6 }, (_, i) => ({
    id: `gallery-${String(i + 1).padStart(2, '0')}`,
    titleEn: `Artwork ${String(i + 1).padStart(2, '0')}`,
    image: `/covers/gallery/fly-in/${i + 1}.png`,
  }));

  // 收集所有需要预加载的图片 URL
  const imageUrls = useMemo(() => {
    const urls = [];
    const baseUrl = import.meta.env.BASE_URL || '/';
    const normalizeUrl = (path) => {
      if (!path || typeof path !== 'string') return null;
      const cleanPath = path.startsWith('/') ? path.substring(1) : path;
      return baseUrl + cleanPath;
    };
    
    // 收集 gallery 图片
    galleryItems.forEach(item => {
      if (item.image) {
        urls.push(normalizeUrl(item.image));
      }
    });
    
    // 去重并过滤空值
    const uniqueUrls = [...new Set(urls)].filter(url => url && url.trim() !== '');
    
    console.log('[Gallery] Collected image URLs:', uniqueUrls.length, uniqueUrls);
    
    return uniqueUrls;
  }, []);
  
  // 添加标志位，确保只加载一次
  const [hasPreloaded, setHasPreloaded] = useState(false);
  // 添加 canEnter 状态，由动画完成回调控制
  const [canEnter, setCanEnter] = useState(false);
  
  // 使用图片预加载 Hook（30% 阈值策略，因为图片较少）
  const { isLoading, progress, loadedCount, totalCount } = useImagePreloader(imageUrls, {
    enabled: !hasPreloaded,
    threshold: 30, // 加载 30% 后即可进入页面（资源少，降低阈值）
    onThresholdReached: (info) => {
      console.log('[Gallery] ✅ 30% threshold reached!', info);
    },
    onComplete: (stats) => {
      console.log('[Gallery] ✅ 100% loading complete!', stats);
      setHasPreloaded(true);
    },
    onProgress: (info) => {
      console.log('[Gallery] Progress update:', info);
    }
  });
  
  // 动画完成回调：只有动画播放完毕且真实加载 >= 30% 时才允许进入
  const handleAnimationComplete = useCallback(() => {
    if (progress >= 30) {
      console.log('[Gallery] ✅ Animation complete! User can enter page.');
      setCanEnter(true);
    }
  }, [progress]);

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

  // 卡片容器 - 控制内部元素交错（等待图片动画完成后再显示文字）
  const cardContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 3.2 // 延迟 3.2秒（等待所有图片就位：0.6 + 5*0.35 + 0.8 = 3.15s）
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

  // 标签淡入（带左侧滑入）
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

  // CTA 按钮淡入（带箭头动画）
  const ctaReveal = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // ========== 组件渲染函数 ==========

  // 逐字动画标题
  const AnimatedTitle = ({ text, style, as: Tag = 'h1' }) => (
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
        letterSpacing: '0.02em'
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
    card: {
      height: 'calc(100vh - var(--nav-height))', // 单屏展示，扣除导航栏高度
      padding: 'clamp(60px, 10vw, 120px)',
      backgroundColor: '#0a0a0a',
      boxSizing: 'border-box', // 确保 padding 包含在高度内
      overflow: 'hidden' // 防止内容溢出
    },
    label: { color: '#aaa', borderColor: '#555' },
    title: { color: '#fff', fontWeight: '400' },
    desc: { color: '#ccc' },
    cta: { color: '#fff', fontWeight: '600' },
  };

  // 亮色模式样式
  const lightStyles = {
    page: {
      backgroundColor: '#f8f8f8',
      color: '#1a1a1a'
    },
    card: {
      height: 'calc(100vh - var(--nav-height))', // 单屏展示，扣除导航栏高度
      padding: 'clamp(60px, 10vw, 120px)',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box', // 确保 padding 包含在高度内
      overflow: 'hidden' // 防止内容溢出
    },
    label: { color: '#333', borderColor: '#999' },
    title: { color: '#111', fontWeight: '500' },
    desc: { color: '#333' },
    cta: { color: '#111', fontWeight: '600' },
  };

  const styles = isDark ? darkStyles : lightStyles;

  return (
    <>
      {/* 加载屏幕 - 使用 !canEnter 控制显示，动画至少 1 秒 */}
      <LoadingScreen 
        isVisible={!canEnter}
        realProgress={progress}
        loadedCount={loadedCount}
        totalCount={totalCount}
        phaseNumber="" // Gallery 页面不显示 Phase 编号
        threshold={30}
        minDuration={1000} // 最小动画时长 1 秒
        onAnimationComplete={handleAnimationComplete}
      />
      
      <AnimatePresence mode="wait">
        {canEnter && (
          <motion.div 
            key={`gallery-content-${canEnter}`}
            initial="hidden"
            animate="visible"
            variants={pageContainer}
            style={{ 
              minHeight: '100vh',
              position: 'relative',
              ...styles.page
            }}
          >
            {/* 艺术画廊卡片 */}
            {isMobile ? (
              // ========== 移动端：全屏飞入 → 收束到上部分区（flex 布局，区域不重叠）==========
              <Link to="/gallery/list" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
                    <MobileGridBackground phases={galleryItems} isDark={isDark} containerHeight={65} />
                  </div>
                  
                  {/* 下部：文字内容区 (35%) */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 2.9, // 等待卡片收束完成（5个项目）
                      duration: 0.5,
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
                    <AnimatedLabel text={t('gallery.label')} isPrimary={true} />
                    
                    {/* 标题 */}
                    <motion.div variants={fadeInUp} style={{ marginBottom: '8px' }}>
                      <AnimatedTitle 
                        text={t('gallery.title')}
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
                      {t('gallery.desc')}
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
                      {t('gallery.exploreWorks')} 
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
              <Link to="/gallery/list" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <motion.div 
                  variants={cardContainer}
                  whileHover={{ backgroundColor: isDark ? '#151515' : '#f0f0f0' }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                    ...styles.card,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  {/* 倾斜切割背景 - 画廊版本 */}
                  <SlicedBackground phases={galleryItems} isDark={isDark} />
                  
                  {/* 左侧渐变遮罩 - 自然过渡 */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: isDark
                      ? 'linear-gradient(90deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.8) 25%, rgba(10,10,10,0.4) 45%, transparent 60%)'
                      : 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 25%, rgba(255,255,255,0.4) 45%, transparent 60%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }} />
                  
                  {/* 前景内容 */}
                  <div style={{ 
                    maxWidth: '600px', 
                    position: 'relative', 
                    zIndex: 2,
                  }}>
                    {/* 标签 - 左侧滑入 */}
                    <AnimatedLabel text={t('gallery.label')} isPrimary={true} />
                    
                    {/* 标题 - 逐字淡入 */}
                    <motion.div variants={fadeInUp} style={{ marginBottom: '32px' }}>
                      <AnimatedTitle 
                        text={t('gallery.title')}
                        style={{ 
                          fontFamily: 'var(--font-serif)', 
                          fontSize: 'clamp(2.5rem, 6vw, 5rem)', 
                          lineHeight: 1.1,
                          ...styles.title
                        }}
                      />
                    </motion.div>
                    
                    {/* 描述 - 淡入上移 */}
                    <motion.p 
                      variants={descReveal}
                      style={{ 
                        fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', 
                        lineHeight: 1.8, 
                        marginBottom: '50px', 
                        maxWidth: '600px',
                        ...styles.desc
                      }}
                    >
                      {t('gallery.desc')}
                    </motion.p>
                    
                    {/* CTA - 淡入 + 箭头动画 */}
                    <motion.div 
                      variants={ctaReveal}
                      style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: '500', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        ...styles.cta
                      }}
                    >
                      {t('gallery.exploreWorks')} 
                      <motion.span 
                        style={{ fontSize: '1.3rem', display: 'inline-block' }}
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        →
                      </motion.span>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle';
import { useTheme } from '../hooks/useTheme';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { useIsMobile } from '../hooks/useMediaQuery';
import LoadingScreen from '../components/LoadingScreen';
import WorkGalleryTypewriter from '../components/WorkGalleryTypewriter';

// 两行动态列数背景组件 - 根据屏幕尺寸动态计算每行显示图片数量，确保裁剪不超过10%
const FlyInStackBackground = ({ phases, isDark }) => {
  const [imagesPerRow, setImagesPerRow] = useState(5); // 默认每行5张
  
  // 图片原始宽高比
  const IMAGE_ASPECT_RATIO = 856 / 1400; // ≈ 0.611
  const MAX_CROP_RATIO = 0.10; // 最大裁剪比例 10%
  const MIN_IMAGES_PER_ROW = 3;
  const MAX_IMAGES_PER_ROW = 6;
  const ROWS = 2; // 两行布局
  
  // 计算每行最优显示数量
  useEffect(() => {
    const calculateOptimalCount = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight - 60; // 扣除导航栏高度
      const rowHeight = screenHeight / ROWS; // 每行高度
      
      // 图片在当前行高下的显示宽度
      const imageDisplayWidth = rowHeight * IMAGE_ASPECT_RATIO;
      
      // 公式：N ≤ 屏幕宽度 / ((1 - 最大裁剪比) × 图片显示宽度)
      const maxImages = Math.floor(screenWidth / ((1 - MAX_CROP_RATIO) * imageDisplayWidth));
      
      // 限制在 MIN 到 MAX 之间
      const optimalCount = Math.max(MIN_IMAGES_PER_ROW, Math.min(MAX_IMAGES_PER_ROW, maxImages));
      
      console.log('[Gallery] Screen:', screenWidth, 'x', screenHeight, 
                  '| Row height:', Math.round(rowHeight),
                  '| Image width:', Math.round(imageDisplayWidth),
                  '| Images per row:', optimalCount);
      
      setImagesPerRow(optimalCount);
    };
    
    // 初始计算
    calculateOptimalCount();
    
    // 监听窗口大小变化
    window.addEventListener('resize', calculateOptimalCount);
    return () => window.removeEventListener('resize', calculateOptimalCount);
  }, []);
  
  // 将图片分成两行（确保两行数量一致）
  // 计算每行实际可显示的数量：取素材总数的一半和计算值的较小者
  const actualImagesPerRow = Math.min(imagesPerRow, Math.floor(phases.length / ROWS));
  const row1Images = phases.slice(0, actualImagesPerRow);
  const row2Images = phases.slice(actualImagesPerRow, actualImagesPerRow * 2);
  const sliceWidth = 100 / actualImagesPerRow;
  
  console.log('[Gallery] Two rows:', actualImagesPerRow, 'images per row,', 
              'Row1:', row1Images.length, 'Row2:', row2Images.length);
  
  // 从右向左滑入动画变体
  const slideInVariants = {
    hidden: { 
      x: '100%', // 从右侧外开始
      opacity: 0,
    },
    visible: (delay) => ({
      x: '0%',
      opacity: 1,
      transition: {
        x: {
          duration: 0.8,
          delay: delay,
          ease: [0.16, 1, 0.3, 1], // 平滑缓动
        },
        opacity: {
          duration: 0.4,
          delay: delay,
        }
      }
    })
  };
  
  // 渲染单个图片（带滑入动画）
  const renderImage = (phase, index, isFirstImage = false, rowIndex = 0) => {
    // 计算交错延迟：同一列的两行图片接近同时出现，不同列依次延迟
    // 调整为与 /work 页面一致的总时长（约 3.5s）
    const baseDelay = 0.4; // 基础延迟（等待加载完成）
    const columnDelay = 0.35; // 每列间隔（与 /work 的 0.35 一致）
    const rowOffset = 0.08; // 上下行微小偏移
    const delay = baseDelay + index * columnDelay + rowIndex * rowOffset;
    
    return (
      <motion.div
        key={phase.id}
        custom={delay}
        initial="hidden"
        animate="visible"
        variants={slideInVariants}
        style={{
          position: 'relative',
          width: `${sliceWidth}%`,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {phase.image ? (
          <img
            src={`${import.meta.env.BASE_URL}${phase.image.replace(/^\//, '')}`}
            alt={phase.titleEn}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              // 第一张图左对齐（保留人脸），其他居中
              objectPosition: isFirstImage ? 'left center' : 'center center',
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
    );
  };
  
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 第一行 */}
      <div style={{
        display: 'flex',
        height: '50%',
      }}>
        {row1Images.map((phase, index) => renderImage(phase, index, index === 0, 0))}
      </div>
      
      {/* 第二行 */}
      <div style={{
        display: 'flex',
        height: '50%',
      }}>
        {row2Images.map((phase, index) => renderImage(phase, index, false, 1))}
      </div>
    </div>
  );
};

// 移动端网格组件 - 淡入 + 轻微上移动画
// Gallery 有多个项目，使用 2列 网格布局
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
        duration: 0.7, // 较慢的淡入
        delay: 0.5 + index * 0.15, // 延迟 0.5s 后开始，每张间隔 0.15s
        ease: [0.25, 0.1, 0.25, 1], // 平缓的缓动曲线
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

const Gallery = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  useTitle(t('gallery.pageTitle'));

  // 定义 gallery 数据用于艺术画廊斜切背景
  // 桌面端使用 /covers/gallery/fly-in/ 目录（10张）
  // 移动端使用 /images/mobile/gallery/ 目录（6张）
  const galleryItemCount = isMobile ? 6 : 10;
  const galleryItems = Array.from({ length: galleryItemCount }, (_, i) => ({
    id: `gallery-${String(i + 1).padStart(2, '0')}`,
    titleEn: `Artwork ${String(i + 1).padStart(2, '0')}`,
    image: isMobile 
      ? `/images/mobile/gallery/Desktop - ${i + 1}.png`
      : `/covers/gallery/fly-in/${i + 1}.png`,
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
  const { isLoading, progress, loadedCount, totalCount, fromCache } = useImagePreloader(imageUrls, {
    enabled: !hasPreloaded,
    threshold: 30, // 加载 30% 后即可进入页面（资源少，降低阈值）
    pageId: 'gallery', // 页面级缓存标识
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
  
  // 🚀 缓存命中时直接跳过加载页（不等待动画）
  useEffect(() => {
    if (fromCache && !canEnter) {
      console.log('[Gallery] 🚀 Cache hit! Skipping loading screen.');
      setCanEnter(true);
    }
  }, [fromCache, canEnter]);

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
  // PC端需要等待斜切动画完成 (3.2s)，移动端图片动画更快 (约1.8s)
  const cardContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: isMobile ? 0 : 3.2 // 移动端文字动画独立控制，不使用容器延迟
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
        letterSpacing: '0.02em',
        textShadow: styles.label.textShadow || 'none', // 添加阴影支持
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

  // 亮色模式样式 - PC端：文字使用白色+阴影，确保在彩色背景上可读（与 Work 页面一致）
  const lightStylesDesktop = {
    page: {
      backgroundColor: '#f8f8f8',
      color: '#1a1a1a'
    },
    card: {
      height: 'calc(100vh - var(--nav-height))',
      padding: 'clamp(60px, 10vw, 120px)',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box',
      overflow: 'hidden'
    },
    label: { color: '#fff', borderColor: 'rgba(255,255,255,0.6)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' },
    title: { color: '#fff', fontWeight: '500', textShadow: '0 2px 12px rgba(0,0,0,0.6)' },
    desc: { color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 6px rgba(0,0,0,0.5)' },
    cta: { color: '#fff', fontWeight: '600' },
  };

  // 亮色模式样式 - 移动端：文字区域有白色背景，使用深色文字（与 Work 页面一致）
  const lightStylesMobile = {
    page: {
      backgroundColor: '#f8f8f8',
      color: '#1a1a1a'
    },
    card: {
      height: 'calc(100vh - var(--nav-height))',
      padding: 'clamp(60px, 10vw, 120px)',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box',
      overflow: 'hidden'
    },
    label: { color: '#666', borderColor: '#ccc' },
    title: { color: '#111', fontWeight: '500' },
    desc: { color: '#444' },
    cta: { color: '#fff', fontWeight: '600' },
  };

  // 根据设备和主题选择样式（与 Work 页面一致）
  const styles = isDark ? darkStyles : (isMobile ? lightStylesMobile : lightStylesDesktop);

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
              height: 'calc(100vh - var(--nav-height))', // 单屏展示，扣除导航栏高度
              overflow: 'hidden', // 禁止滚动
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
                  {/* 飞入叠加背景 - 画廊版本 */}
                  <FlyInStackBackground phases={galleryItems} isDark={isDark} />
                  
                  {/* 前景内容 - 打字机效果（遮罩已统一到 WorkGalleryTypewriter 组件内） */}
                  <WorkGalleryTypewriter
                    title={t('gallery.title')}
                    description={t('gallery.desc')}
                    ctaText={t('gallery.exploreWorks')}
                    tags={[]} // Gallery 页面没有标签组
                    styles={styles}
                    isDark={isDark}
                    startDelay={3500} // 等待飞入动画完成（与 /work 页面一致，约 3.5 秒）
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

export default Gallery;

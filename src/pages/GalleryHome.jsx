import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { useTheme } from '../hooks/useTheme';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { Link } from 'react-router-dom';
import SlicedImageDisplay from '../components/SlicedImageDisplay';
import LoadingScreen from '../components/LoadingScreen';

const GalleryHome = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  useTitle(t('gallery.title'));

  // 模块配置 - 使用真实素材（每个模块 4 张斜切图片）
  const moduleConfigs = {
    'form-structure': {
      hueStart: 190, // 备用色系
      images: [
        { id: 'fs-1', image: '/images/gallery/module-1/1.png' },
        { id: 'fs-2', image: '/images/gallery/module-1/2.png' },
        { id: 'fs-3', image: '/images/gallery/module-1/3.png' },
        { id: 'fs-4', image: '/images/gallery/module-1/4.png' },
      ]
    },
    'material-texture': {
      hueStart: 250, // 备用色系
      images: [
        { id: 'mt-1', image: '/images/gallery/module-2/1.png' },
        { id: 'mt-2', image: '/images/gallery/module-2/2.png' },
        { id: 'mt-3', image: '/images/gallery/module-2/3.png' },
        { id: 'mt-4', image: '/images/gallery/module-2/4.png' },
      ]
    },
    'narrative-imagery': {
      hueStart: 310, // 备用色系
      images: [
        { id: 'ni-1', image: '/images/gallery/module-3/1.png' },
        { id: 'ni-2', image: '/images/gallery/module-3/2.png' },
        { id: 'ni-3', image: '/images/gallery/module-3/3.png' },
        { id: 'ni-4', image: '/images/gallery/module-3/4.png' },
      ]
    }
  };

  // 只显示前 3 个模块
  const moduleKeys = [
    'form-structure',
    'material-texture', 
    'narrative-imagery'
  ];

  // ========== 图片预加载逻辑 ==========
  
  // GalleryList 页面的图片（提前预加载）
  const galleryListImages = [
    '/covers/gallery/items/1.png',
    '/covers/gallery/items/2.png',
    '/covers/gallery/items/3.png',
    '/covers/gallery/items/4.png',
    '/covers/gallery/items/5.png',
    '/covers/gallery/items/6.png',
    '/covers/gallery/items/7.png',
    '/covers/gallery/items/8.png',
  ];

  // 收集所有需要预加载的图片 URL（当前页 + GalleryList 页）
  const imageUrls = useMemo(() => {
    const urls = [];
    const baseUrl = import.meta.env.BASE_URL || '/';
    const normalizeUrl = (path) => {
      if (!path || typeof path !== 'string') return null;
      const cleanPath = path.startsWith('/') ? path.substring(1) : path;
      return baseUrl + cleanPath;
    };
    
    // 1. 收集当前页模块的斜切图片
    Object.values(moduleConfigs).forEach(config => {
      config.images.forEach(img => {
        if (img.image) {
          urls.push(normalizeUrl(img.image));
        }
      });
    });
    
    // 2. 收集 GalleryList 页面的图片（提前预加载）
    galleryListImages.forEach(img => {
      urls.push(normalizeUrl(img));
    });
    
    // 去重并过滤空值
    const uniqueUrls = [...new Set(urls)].filter(url => url && url.trim() !== '');
    
    console.log('[GalleryHome] Collected image URLs:', uniqueUrls.length, uniqueUrls);
    
    return uniqueUrls;
  }, []);
  
  // 添加标志位，确保只加载一次
  const [hasPreloaded, setHasPreloaded] = useState(false);
  // 添加 canEnter 状态，由动画完成回调控制
  const [canEnter, setCanEnter] = useState(false);
  
  // 使用图片预加载 Hook（50% 阈值策略）
  const { isLoading, progress, loadedCount, totalCount } = useImagePreloader(imageUrls, {
    enabled: !hasPreloaded,
    threshold: 50, // 加载 50% 后即可进入页面
    onThresholdReached: (info) => {
      console.log('[GalleryHome] ✅ 50% threshold reached!', info);
    },
    onComplete: (stats) => {
      console.log('[GalleryHome] ✅ 100% loading complete!', stats);
      setHasPreloaded(true);
    },
    onProgress: (info) => {
      console.log('[GalleryHome] Progress update:', info);
    }
  });
  
  // 动画完成回调：只有动画播放完毕且真实加载 >= 50% 时才允许进入
  const handleAnimationComplete = useCallback(() => {
    if (progress >= 50) {
      console.log('[GalleryHome] ✅ Animation complete! User can enter page.');
      setCanEnter(true);
    }
  }, [progress]);
  
  // 调试输出
  useEffect(() => {
    console.log('[GalleryHome] Loading state:', { 
      isLoading, 
      canEnter, 
      progress, 
      loadedCount, 
      totalCount, 
      hasPreloaded,
      displayProgress: `真实 ${progress}% → 显示 ${progress >= 50 ? 100 : Math.round((progress / 50) * 100)}%`
    });
  }, [isLoading, canEnter, progress, loadedCount, totalCount, hasPreloaded]);

  // 动画配置
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // 样式
  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: isDark ? '#0a0a0a' : '#fafafa',
      color: isDark ? '#fff' : '#1a1a1a'
    },
    header: {
      // 使用与模块卡片相同的布局结构实现对齐
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '35% 65%',
      padding: isMobile 
        ? 'var(--space-lg) var(--space-page-x) var(--space-md)'
        : 'clamp(40px, 5vw, 60px) 0 clamp(24px, 3vw, 40px) 0',
    },
    headerContent: {
      padding: isMobile 
        ? '0'
        : 'clamp(50px, 6vw, 80px) clamp(30px, 3vw, 50px) clamp(50px, 6vw, 80px) clamp(60px, 8vw, 150px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    breadcrumb: {
      display: isMobile ? 'none' : 'flex', // 移动端隐藏面包屑
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.75rem',
      color: isDark ? '#555' : '#999',
      marginBottom: '8px',
    },
    breadcrumbLink: {
      color: isDark ? '#666' : '#888',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
    },
    breadcrumbSeparator: {
      color: isDark ? '#444' : '#ccc',
    },
    breadcrumbCurrent: {
      color: isDark ? '#888' : '#666',
    },
    headerTitle: {
      fontFamily: 'var(--font-serif)',
      fontSize: isMobile ? 'clamp(1.5rem, 6vw, 2rem)' : 'clamp(2rem, 3.5vw, 2.5rem)',
      fontWeight: '300',
      marginBottom: '12px',
      lineHeight: 1.1
    },
    headerDesc: {
      fontSize: isMobile ? '0.8rem' : 'clamp(0.85rem, 1.2vw, 0.95rem)',
      color: isDark ? '#888' : '#666',
      maxWidth: '500px',
      lineHeight: 1.6
    },
    modulesGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px', // 与斜切分隔线同样宽度 (strokeWidth="2")
      backgroundColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.9)' // 与分隔线颜色一致
    },
    moduleCard: {
      backgroundColor: isDark ? '#0a0a0a' : '#fff',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    moduleCardHover: {
      backgroundColor: isDark ? '#151515' : '#f5f5f5'
    },
    // 全宽布局：桌面端左右 35%:65%，移动端上下堆叠
    moduleInner: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'stretch',
      minHeight: isMobile ? 'auto' : '280px',
    },
    // 文字内容区
    leftSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '8px' : '12px',
      justifyContent: 'center',
      padding: isMobile 
        ? 'var(--space-md) var(--space-page-x)'
        : 'clamp(50px, 6vw, 80px) clamp(30px, 3vw, 50px) clamp(50px, 6vw, 80px) clamp(60px, 8vw, 150px)',
      maxWidth: isMobile ? 'none' : '600px',
      width: isMobile ? '100%' : '35%',
      flexShrink: 0,
      order: isMobile ? 2 : 1, // 移动端文字在下
    },
    // 移动端：序号和标题放在一行
    mobileHeader: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '8px',
      width: '100%',
    },
    moduleNumber: {
      fontFamily: 'var(--font-mono, monospace)',
      fontSize: isMobile ? '0.75rem' : 'clamp(2rem, 4vw, 3rem)',
      fontWeight: '300',
      color: isDark ? '#555' : '#999',
      lineHeight: 1,
    },
    moduleTitle: {
      fontFamily: 'var(--font-serif)',
      fontSize: isMobile ? '1.1rem' : 'clamp(1.5rem, 2.5vw, 2rem)',
      fontWeight: '500',
      marginBottom: 0,
      lineHeight: 1.2
    },
    moduleDesc: {
      fontSize: isMobile ? '0.8rem' : 'clamp(0.9rem, 1.1vw, 1rem)',
      color: isDark ? '#666' : '#666',
      lineHeight: 1.6,
      marginBottom: 0,
      width: '100%',
    },
    tagsRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: isMobile ? '6px' : '8px',
      width: '100%',
      marginTop: isMobile ? '4px' : '8px',
    },
    mediaTag: {
      padding: isMobile ? '4px 10px' : '4px 12px',
      fontSize: isMobile ? '0.7rem' : '0.8rem',
      borderRadius: '100px',
      backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
      color: isDark ? '#888' : '#666',
      border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`
    },
    // 右侧：斜切图片区（包含浮动箭头）- 无 padding，贴边显示
    rightSection: {
      position: 'relative',
      overflow: 'hidden',
      minHeight: isMobile ? '180px' : '200px',
      width: isMobile ? '100%' : '65%',
      order: isMobile ? 1 : 2, // 移动端图片在上
    },
    // 浮动箭头（位于图片右侧）
    floatingArrow: {
      position: 'absolute',
      right: isMobile ? '12px' : '24px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isMobile ? '36px' : '48px',
      height: isMobile ? '36px' : '48px',
      backgroundColor: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.95)',
      borderRadius: '50%',
      boxShadow: isDark 
        ? '0 4px 20px rgba(0,0,0,0.4)' 
        : '0 4px 20px rgba(0,0,0,0.15)',
      zIndex: 10,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    moduleArrow: {
      fontSize: isMobile ? '1rem' : '1.2rem',
      color: isDark ? '#1a1a1a' : '#333',
      fontWeight: '400',
    }
  };

  return (
    <>
      {/* 加载屏幕 */}
      <LoadingScreen 
        isVisible={!canEnter}
        realProgress={progress}
        loadedCount={loadedCount}
        totalCount={totalCount}
        phaseNumber="" // Gallery 页面不显示 Phase 编号
        threshold={50}
        minDuration={1500} // 最小动画时长 1.5 秒
        onAnimationComplete={handleAnimationComplete}
      />
      
      <AnimatePresence mode="wait">
        {canEnter && (
          <motion.div
            key="gallery-content"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={styles.page}
          >
            {/* Header Section */}
            <motion.header variants={itemVariants} style={styles.header}>
              <div style={styles.headerContent}>
                {/* 面包屑导航 */}
                <nav style={styles.breadcrumb}>
                  <Link to="/" style={styles.breadcrumbLink}>{t('nav.home')}</Link>
                  <span style={styles.breadcrumbSeparator}>/</span>
                  <span style={styles.breadcrumbCurrent}>{t('gallery.title')}</span>
                </nav>
                <h1 style={styles.headerTitle}>{t('gallery.title')}</h1>
                <p style={styles.headerDesc}>
                  {t('gallery.subtitle')}
                </p>
              </div>
            </motion.header>

            {/* Modules List */}
            <motion.div variants={containerVariants} style={styles.modulesGrid}>
              {moduleKeys.map((key, moduleIndex) => {
                const module = t(`gallery.modules.${key}`, { returnObjects: true });
                const config = moduleConfigs[key];
                
                return (
                  <Link 
                    key={key} 
                    to={`/gallery/${key}`} 
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <motion.div
                      variants={itemVariants}
                      whileHover={styles.moduleCardHover}
                      style={styles.moduleCard}
                    >
                      <div style={styles.moduleInner}>
                        {/* 左侧：文字内容 */}
                        <div style={styles.leftSection}>
                          {/* 移动端：编号和标题在一行 */}
                          {isMobile ? (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                              <span style={styles.moduleNumber}>{module.number}</span>
                              <h2 style={styles.moduleTitle}>{module.title}</h2>
                            </div>
                          ) : (
                            <>
                              <div style={styles.moduleNumber}>{module.number}</div>
                              <h2 style={styles.moduleTitle}>{module.title}</h2>
                            </>
                          )}
                          <p style={styles.moduleDesc}>{module.desc}</p>
                          <div style={styles.tagsRow}>
                            {module.media?.map((m, i) => (
                              <span key={i} style={styles.mediaTag}>{m}</span>
                            ))}
                          </div>
                        </div>
                        
                        {/* 右侧：斜切图片 + 浮动箭头 */}
                        <div style={styles.rightSection}>
                          {/* 斜切图片容器 - 绝对定位占满父元素 */}
                          <div style={{ position: 'absolute', inset: 0 }}>
                            <SlicedImageDisplay
                              images={config.images}
                              isDark={isDark}
                              slantOffset={6}
                              animated={!isMobile}
                              animationDelay={0.3 + moduleIndex * 0.2}
                              height="100%"
                              hueStart={config.hueStart}
                            />
                          </div>
                          {/* 浮动箭头 */}
                          <motion.div 
                            style={styles.floatingArrow}
                            whileHover={{ scale: 1.1, boxShadow: isDark ? '0 6px 24px rgba(0,0,0,0.5)' : '0 6px 24px rgba(0,0,0,0.2)' }}
                          >
                            <span style={styles.moduleArrow}>→</span>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryHome;
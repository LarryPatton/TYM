import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { useTheme } from '../hooks/useTheme';
import { useIsMobile } from '../hooks/useMediaQuery';
import { Link } from 'react-router-dom';
import SlicedImageDisplay from '../components/SlicedImageDisplay';

const GalleryHome = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  useTitle(t('gallery.title'));

  // 模块配置 - 使用占位素材（每个模块 4 张斜切图片，每张颜色递增）
  const moduleConfigs = {
    'form-structure': {
      // 蓝绿色系，hue 从 190 递增到 230
      hueStart: 190,
      images: Array.from({ length: 4 }, (_, i) => ({
        id: `fs-${i}`,
        image: null,
      }))
    },
    'material-texture': {
      // 紫色系，hue 从 250 递增到 290
      hueStart: 250,
      images: Array.from({ length: 4 }, (_, i) => ({
        id: `mt-${i}`,
        image: null,
      }))
    },
    'narrative-imagery': {
      // 粉色系，hue 从 310 递增到 350
      hueStart: 310,
      images: Array.from({ length: 4 }, (_, i) => ({
        id: `ni-${i}`,
        image: null,
      }))
    }
  };

  // 只显示前 3 个模块
  const moduleKeys = [
    'form-structure',
    'material-texture', 
    'narrative-imagery'
  ];

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
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: isMobile ? '0.7rem' : '0.75rem',
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
      gap: '1px',
      backgroundColor: isDark ? '#222' : '#e5e5e5'
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
    // 全宽布局：桌面端左右 35%:65%，移动端上下 30%:70%
    moduleInner: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '35% 65%',
      gridTemplateRows: isMobile ? '30% 70%' : 'auto',
      gap: 0,
      alignItems: 'stretch',
      minHeight: isMobile ? '320px' : '280px', // 移动端固定高度以便分配比例
    },
    // 文字内容区
    leftSection: {
      display: 'flex',
      flexDirection: isMobile ? 'row' : 'column', // 移动端横向布局
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      alignItems: isMobile ? 'flex-start' : 'stretch',
      gap: isMobile ? '4px 12px' : '12px',
      justifyContent: 'center',
      padding: isMobile 
        ? 'var(--space-sm) var(--space-page-x)'
        : 'clamp(50px, 6vw, 80px) clamp(30px, 3vw, 50px) clamp(50px, 6vw, 80px) clamp(60px, 8vw, 150px)',
      maxWidth: isMobile ? 'none' : '600px',
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
      fontSize: isMobile ? '0.9rem' : 'clamp(2rem, 4vw, 3rem)',
      fontWeight: '300',
      color: isDark ? '#555' : '#bbb',
      lineHeight: 1,
    },
    moduleTitle: {
      fontFamily: 'var(--font-serif)',
      fontSize: isMobile ? '1rem' : 'clamp(1.5rem, 2.5vw, 2rem)',
      fontWeight: '500',
      marginBottom: 0,
      lineHeight: 1.2
    },
    moduleDesc: {
      fontSize: isMobile ? '0.7rem' : 'clamp(0.9rem, 1.1vw, 1rem)',
      color: isDark ? '#666' : '#888',
      lineHeight: 1.5,
      marginBottom: 0,
      width: '100%',
      display: '-webkit-box',
      WebkitLineClamp: isMobile ? 2 : 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    tagsRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: isMobile ? '4px' : '8px',
      width: '100%',
      marginTop: isMobile ? '2px' : '8px',
    },
    mediaTag: {
      padding: isMobile ? '2px 6px' : '4px 12px',
      fontSize: isMobile ? '0.6rem' : '0.8rem',
      borderRadius: '100px',
      backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
      color: isDark ? '#888' : '#666',
      border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`
    },
    // 右侧：斜切图片区（包含浮动箭头）- 无 padding，贴边显示
    rightSection: {
      position: 'relative',
      overflow: 'hidden',
      minHeight: isMobile ? '120px' : '200px',
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
    <motion.div
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
                    <div style={styles.moduleNumber}>{module.number}</div>
                    <h2 style={styles.moduleTitle}>{module.title}</h2>
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
                        slantOffset={12}
                        leftShift={-5}
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
  );
};

export default GalleryHome;
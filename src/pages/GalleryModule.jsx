import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { useTheme } from '../hooks/useTheme';
import { useIsMobile } from '../hooks/useMediaQuery';
import { Link, useParams } from 'react-router-dom';
import { formStructureWorks, getAllMediaTypes as getAllMediaTypes1, filterWorks as filterWorks1 } from '../data/formStructureWorks';
import { materialTextureWorks, getAllMediaTypes as getAllMediaTypes2, filterWorks as filterWorks2 } from '../data/materialTextureWorks';
import { narrativeImageryWorks, getAllMediaTypes as getAllMediaTypes3, filterWorks as filterWorks3 } from '../data/narrativeImageryWorks';
import { enrichWorks } from '../utils/workAdapter';
import ImageViewer from '../components/ImageViewer';

const GalleryModule = () => {
  const { t } = useTranslation();
  const { module } = useParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  
  // 筛选状态
  const [selectedMedia, setSelectedMedia] = useState('all'); // 默认选中"全部"（单选模式，使用key而非文本）
  const [aspectType, setAspectType] = useState('portrait'); // 默认长图
  
  // 图片查看器状态
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  
  // 模块配置 - 包含每个模块的作品数据
  const moduleConfigs = {
    'form-structure': {
      worksCount: 12,
      aspectRatio: aspectType === 'portrait' ? '3/4' : '4/3'
    },
    'material-texture': {
      worksCount: 8,
      aspectRatio: aspectType === 'portrait' ? '3/4' : '4/3'
    },
    'narrative-imagery': {
      worksCount: 10,
      aspectRatio: aspectType === 'portrait' ? '3/4' : '4/3'
    },
    'light-atmosphere': {
      worksCount: 9,
      aspectRatio: '16/9'
    },
    'observation-reality': {
      worksCount: 15,
      aspectRatio: '4/3'
    }
  };

  const config = moduleConfigs[module] || { worksCount: 8, aspectRatio: '1/1' };
  const moduleData = t(`gallery.modules.${module}`, { returnObjects: true });
  
  useTitle(moduleData?.title || 'Gallery Module');

  // 转换后的作品数据（包含实际图片路径）
  const [enrichedWorks, setEnrichedWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 实际作品数据 - 根据模块加载
  const { allWorks, getAllMediaTypes, filterWorks } = useMemo(() => {
    if (module === 'form-structure') {
      return {
        allWorks: formStructureWorks,
        getAllMediaTypes: getAllMediaTypes1,
        filterWorks: filterWorks1
      };
    } else if (module === 'material-texture') {
      return {
        allWorks: materialTextureWorks,
        getAllMediaTypes: getAllMediaTypes2,
        filterWorks: filterWorks2
      };
    } else if (module === 'narrative-imagery') {
      return {
        allWorks: narrativeImageryWorks,
        getAllMediaTypes: getAllMediaTypes3,
        filterWorks: filterWorks3
      };
    }
    return { allWorks: [], getAllMediaTypes: () => [], filterWorks: () => [] };
  }, [module]);

  // 使用 workAdapter 转换作品路径
  useEffect(() => {
    const loadWorks = async () => {
      setLoading(true);
      try {
        const enriched = await enrichWorks(allWorks);
        setEnrichedWorks(enriched);
      } catch (error) {
        console.error('加载作品失败:', error);
        setEnrichedWorks(allWorks); // 失败时使用原始数据
      } finally {
        setLoading(false);
      }
    };
    
    if (allWorks.length > 0) {
      loadWorks();
    }
  }, [allWorks]);
  
  // 筛选后的作品（直接计算，不使用 useMemo 避免更新问题）
  let filteredWorks = [];
  if (!loading && enrichedWorks.length > 0) {
    const mediaTypes = selectedMedia === 'all' ? getAllMediaTypes() : [selectedMedia];
    filteredWorks = filterWorks(enrichedWorks, mediaTypes, aspectType);
  }

  // 计算当前 aspectType 下有作品的媒介类型
  const availableMediaTypes = useMemo(() => {
    if (loading || enrichedWorks.length === 0) return [];
    
    // 获取当前 aspectType 下的所有作品
    const worksInCurrentAspect = filterWorks(enrichedWorks, getAllMediaTypes(), aspectType);
    
    // 收集这些作品中出现的媒介类型
    const mediaSet = new Set(worksInCurrentAspect.map(work => work.media));
    
    // 只返回有作品的媒介类型
    return getAllMediaTypes().filter(media => mediaSet.has(media));
  }, [loading, enrichedWorks, aspectType, getAllMediaTypes, filterWorks]);

  // 当切换 aspectType 时，如果当前选中的媒介没有作品，重置为 'all'
  useEffect(() => {
    if (selectedMedia !== 'all' && !availableMediaTypes.includes(selectedMedia)) {
      setSelectedMedia('all');
    }
  }, [aspectType, availableMediaTypes, selectedMedia]);

  // 切换媒介选择（单选模式）
  const selectMedia = (media) => {
    setSelectedMedia(media);
  };
  
  // 打开图片查看器
  const openImageViewer = (index) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };
  
  // 关闭图片查看器
  const closeImageViewer = () => {
    setViewerOpen(false);
  };

  // 动画配置
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
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
      padding: isMobile 
        ? 'var(--space-xl) var(--space-page-x) var(--space-lg)'
        : 'clamp(80px, 10vw, 120px) clamp(40px, 8vw, 120px) clamp(40px, 6vw, 80px)',
      maxWidth: '1800px',
      margin: '0 auto'
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: isDark ? '#666' : '#888',
      textDecoration: 'none',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      marginBottom: isMobile ? '20px' : '40px',
      transition: 'color 0.2s ease'
    },
    moduleNumber: {
      fontFamily: 'var(--font-mono, monospace)',
      fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
      fontWeight: '200',
      color: isDark ? '#222' : '#e5e5e5',
      lineHeight: 1,
      marginBottom: '20px'
    },
    title: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      fontWeight: '400',
      marginBottom: '12px',
      lineHeight: 1.2
    },
    subtitle: {
      fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
      color: isDark ? '#888' : '#666',
      marginBottom: '28px'
    },
    desc: {
      fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
      color: isDark ? '#666' : '#888',
      maxWidth: '800px',
      lineHeight: 1.8,
      marginBottom: '40px'
    },
    tagsRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '20px'
    },
    mediaTag: {
      padding: '6px 16px',
      fontSize: '0.85rem',
      borderRadius: '100px',
      backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
      color: isDark ? '#888' : '#666',
      border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`
    },
    keywordsRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px'
    },
    keyword: {
      fontSize: '0.9rem',
      color: isDark ? '#555' : '#999',
      fontFamily: 'var(--font-mono, monospace)'
    },
    worksSection: {
      padding: isMobile
        ? 'var(--space-lg) var(--space-page-x) calc(var(--space-3xl) + 80px)' // 底部留出 toggle 空间
        : '60px clamp(40px, 8vw, 120px) clamp(80px, 10vw, 120px)',
      maxWidth: '1800px',
      margin: '0 auto'
    },
    worksHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
      paddingBottom: '20px',
      borderBottom: `1px solid ${isDark ? '#222' : '#e5e5e5'}`
    },
    worksCount: {
      fontSize: '0.9rem',
      color: isDark ? '#666' : '#888'
    },
    worksGrid: {
      display: 'grid',
      // 移动端：长图 3 列，宽图 2 列；桌面端：自适应
      gridTemplateColumns: isMobile
        ? (aspectType === 'landscape' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)')
        : (aspectType === 'landscape' 
            ? 'repeat(3, 1fr)' 
            : `repeat(auto-fill, minmax(${config.aspectRatio === '16/9' ? '320px' : '300px'}, 1fr))`),
      gap: isMobile
        ? (aspectType === 'landscape' ? '8px' : '6px')
        : (aspectType === 'landscape' ? 'clamp(16px, 2vw, 24px)' : 'clamp(30px, 4vw, 60px)')
    },
    workCard: {
      cursor: 'pointer'
    },
    workImage: {
      aspectRatio: config.aspectRatio,
      borderRadius: '8px',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isDark ? '#333' : '#ccc',
      fontSize: '0.85rem',
      transition: 'transform 0.3s ease'
    },
    workTitle: {
      fontSize: '1rem',
      fontWeight: '500',
      margin: '0 0 4px 0'
    },
    workMeta: {
      fontSize: '0.85rem',
      color: isDark ? '#666' : '#999'
    },
    filterSection: {
      padding: isMobile
        ? 'var(--space-lg) var(--space-page-x)'
        : '50px clamp(40px, 8vw, 120px) 50px',
      maxWidth: '1800px',
      margin: '0 auto',
      borderBottom: `1px solid ${isDark ? '#222' : '#e5e5e5'}`,
      // 移动端筛选器横向滚动
      ...(isMobile && {
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      })
    },
    filterLabel: {
      fontSize: isMobile ? '0.75rem' : '0.85rem',
      color: isDark ? '#666' : '#999',
      marginBottom: isMobile ? '12px' : '16px',
      fontFamily: 'var(--font-mono, monospace)'
    },
    mediaFilters: {
      display: 'flex',
      flexWrap: isMobile ? 'nowrap' : 'wrap',
      gap: isMobile ? '8px' : '12px',
      // 移动端不换行，允许横滑
      ...(isMobile && {
        paddingBottom: '4px',
      })
    },
    mediaPill: {
      padding: isMobile ? '8px 16px' : '10px 24px',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      borderRadius: '100px',
      border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '500',
      whiteSpace: 'nowrap', // 防止文字换行
      flexShrink: 0, // 移动端不压缩
    },
    mediaPillActive: {
      backgroundColor: isDark ? '#fff' : '#1a1a1a',
      color: isDark ? '#000' : '#fff',
      borderColor: isDark ? '#fff' : '#1a1a1a'
    },
    mediaPillInactive: {
      backgroundColor: isDark ? '#0a0a0a' : '#fafafa',
      color: isDark ? '#666' : '#888',
      borderColor: isDark ? '#333' : '#e0e0e0'
    },
    floatingToggle: {
      position: 'fixed',
      bottom: isMobile ? '24px' : '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
      border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
      borderRadius: '100px',
      padding: isMobile ? '4px' : '6px',
      display: 'flex',
      gap: isMobile ? '2px' : '4px',
      boxShadow: isDark 
        ? '0 10px 40px rgba(0,0,0,0.5)' 
        : '0 10px 40px rgba(0,0,0,0.15)'
    },
    toggleButton: {
      padding: isMobile ? '8px 20px' : '12px 32px',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      borderRadius: '100px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '500',
      backgroundColor: 'transparent',
      color: isDark ? '#666' : '#888',
      whiteSpace: 'nowrap', // 防止换行
    },
    toggleButtonActive: {
      backgroundColor: isDark ? '#fff' : '#1a1a1a',
      color: isDark ? '#000' : '#fff'
    },
    // 面包屑样式
    breadcrumb: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '6px' : '10px',
      marginBottom: isMobile ? '24px' : '40px',
      flexWrap: 'nowrap', // 不换行，保持一行
    },
    breadcrumbLink: {
      color: isDark ? '#666' : '#888',
      textDecoration: 'none',
      fontSize: isMobile ? '0.75rem' : '0.9rem',
      transition: 'color 0.2s ease',
      flexShrink: 0, // 不压缩
      lineHeight: 1.2,
      display: 'inline-block',
    },
    breadcrumbSeparator: {
      color: isDark ? '#444' : '#ccc',
      fontSize: isMobile ? '0.7rem' : '0.85rem',
      flexShrink: 0,
      lineHeight: 1.2,
      display: 'inline-block',
    },
    breadcrumbCurrent: {
      color: isDark ? '#aaa' : '#555',
      fontSize: isMobile ? '0.75rem' : '0.9rem',
      fontWeight: '500',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      lineHeight: 1.2,
      display: 'inline-block',
    }
  };

  // 如果模块不存在
  if (!moduleData || !moduleData.title) {
    return (
      <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Module Not Found</h2>
          <Link to="/gallery/list" style={{ color: isDark ? '#888' : '#666' }}>← Back to Gallery</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={styles.page}
    >
      {/* Header Section */}
      <header style={styles.header}>
        {/* 面包屑导航 - 紧凑文本模式 */}
        <nav style={{
          marginBottom: isMobile ? '24px' : '40px',
          fontSize: isMobile ? '0.75rem' : '0.9rem',
          lineHeight: 1.4,
        }}>
          <Link to="/" style={{
            color: isDark ? '#666' : '#888',
            textDecoration: 'none',
          }}>{t('nav.home')}</Link>
          <span style={{ color: isDark ? '#444' : '#ccc' }}> / </span>
          <Link to="/gallery" style={{
            color: isDark ? '#666' : '#888',
            textDecoration: 'none',
          }}>{t('nav.gallery')}</Link>
          <span style={{ color: isDark ? '#444' : '#ccc' }}> / </span>
          <span style={{
            color: isDark ? '#aaa' : '#555',
            fontWeight: '500',
          }}>{moduleData.title}</span>
        </nav>
        
        <motion.div variants={itemVariants} style={styles.moduleNumber}>
          {moduleData.number}
        </motion.div>
        
        <motion.h1 variants={itemVariants} style={styles.title}>
          {moduleData.title}
        </motion.h1>
        
        <motion.p variants={itemVariants} style={styles.desc}>
          {moduleData.desc}
        </motion.p>
        
        {/* Media Tags */}
        <motion.div variants={itemVariants} style={styles.tagsRow}>
          {moduleData.media?.map((m, i) => (
            <span key={i} style={styles.mediaTag}>{m}</span>
          ))}
        </motion.div>
      </header>

      {/* Media Filter Section */}
      <motion.section variants={itemVariants} style={styles.filterSection}>
        <div style={styles.filterLabel}>{t('gallery.filter.label')}</div>
        <div style={styles.mediaFilters}>
          {/* 全部选项 */}
          <motion.button
            onClick={() => selectMedia('all')}
            style={{
              ...styles.mediaPill,
              ...(selectedMedia === 'all' ? styles.mediaPillActive : styles.mediaPillInactive)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('gallery.filter.all')}
          </motion.button>
          
          {/* 各个媒介（只显示当前 aspectType 下有作品的） */}
          {availableMediaTypes.map(media => {
            const isActive = selectedMedia === media;
            return (
              <motion.button
                key={media}
                onClick={() => selectMedia(media)}
                style={{
                  ...styles.mediaPill,
                  ...(isActive ? styles.mediaPillActive : styles.mediaPillInactive)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {media}
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Works Section */}
      <section style={styles.worksSection}>
        {/* Works Grid */}
        <motion.div 
          key={`${selectedMedia}-${aspectType}-${loading}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={styles.worksGrid}
        >
          {filteredWorks.map((work, index) => (
              <motion.div 
                key={work.id}
                variants={itemVariants}
                whileHover={isMobile ? {} : { y: -5 }}
                style={{ ...styles.workCard, cursor: 'pointer' }}
                onClick={() => openImageViewer(index)}
              >
                  <img 
                    src={work.image} 
                    alt={work.title}
                    loading="lazy"
                    style={{ 
                      width: '100%',
                      aspectRatio: config.aspectRatio,
                      objectFit: 'cover',
                      borderRadius: isMobile ? '4px' : '8px',
                      marginBottom: isMobile ? '4px' : '12px',
                      backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
                      display: 'block',
                    }}
                  />
                {/* 标题：移动端使用更小字号 */}
                <h3 style={{
                  ...styles.workTitle,
                  fontSize: isMobile ? '0.7rem' : '1rem',
                  marginBottom: isMobile ? '8px' : '4px',
                  lineHeight: 1.3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: isMobile ? 'nowrap' : 'normal',
                }}>{work.title}</h3>
              </motion.div>
            ))}
          </motion.div>
      </section>

      {/* Floating Aspect Ratio Toggle */}
      <div style={styles.floatingToggle}>
        <button
          onClick={() => {
            setAspectType('portrait');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          style={{
            ...styles.toggleButton,
            ...(aspectType === 'portrait' ? styles.toggleButtonActive : {})
          }}
        >
          {t('gallery.aspectType.portrait')}
        </button>
        <button
          onClick={() => {
            setAspectType('landscape');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          style={{
            ...styles.toggleButton,
            ...(aspectType === 'landscape' ? styles.toggleButtonActive : {})
          }}
        >
          {t('gallery.aspectType.landscape')}
        </button>
      </div>
      
      {/* 图片查看器 */}
      <ImageViewer
        images={filteredWorks}
        initialIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={closeImageViewer}
      />
    </motion.div>
  );
};

export default GalleryModule;
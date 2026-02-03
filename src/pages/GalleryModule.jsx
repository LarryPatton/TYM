import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { useTheme } from '../hooks/useTheme';
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
  
  // 筛选后的作品（使用转换后的数据）
  const filteredWorks = useMemo(() => {
    if (loading || enrichedWorks.length === 0) {
      return [];
    }
    
    if (selectedMedia === 'all') {
      // 显示所有作品（只按比例筛选）
      return filterWorks(enrichedWorks, getAllMediaTypes(), aspectType);
    }
    // 显示选中媒介的作品
    return filterWorks(enrichedWorks, [selectedMedia], aspectType);
  }, [enrichedWorks, selectedMedia, aspectType, filterWorks, getAllMediaTypes, loading]);

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
      padding: 'clamp(80px, 10vw, 120px) clamp(40px, 8vw, 120px) clamp(40px, 6vw, 80px)',
      maxWidth: '1800px',
      margin: '0 auto'
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: isDark ? '#666' : '#888',
      textDecoration: 'none',
      fontSize: '0.9rem',
      marginBottom: '40px',
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
      padding: '60px clamp(40px, 8vw, 120px) clamp(80px, 10vw, 120px)',
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
      gridTemplateColumns: aspectType === 'landscape' 
        ? 'repeat(3, 1fr)' 
        : `repeat(auto-fill, minmax(${config.aspectRatio === '16/9' ? '320px' : '300px'}, 1fr))`,
      gap: aspectType === 'landscape' 
        ? 'clamp(16px, 2vw, 24px)' 
        : 'clamp(30px, 4vw, 60px)'
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
      padding: '50px clamp(40px, 8vw, 120px) 50px',
      maxWidth: '1800px',
      margin: '0 auto',
      borderBottom: `1px solid ${isDark ? '#222' : '#e5e5e5'}`
    },
    filterLabel: {
      fontSize: '0.85rem',
      color: isDark ? '#666' : '#999',
      marginBottom: '16px',
      fontFamily: 'var(--font-mono, monospace)'
    },
    mediaFilters: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px'
    },
    mediaPill: {
      padding: '10px 24px',
      fontSize: '0.9rem',
      borderRadius: '100px',
      border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '500'
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
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
      border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
      borderRadius: '100px',
      padding: '6px',
      display: 'flex',
      gap: '4px',
      boxShadow: isDark 
        ? '0 10px 40px rgba(0,0,0,0.5)' 
        : '0 10px 40px rgba(0,0,0,0.15)'
    },
    toggleButton: {
      padding: '12px 32px',
      fontSize: '0.9rem',
      borderRadius: '100px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '500',
      backgroundColor: 'transparent',
      color: isDark ? '#666' : '#888'
    },
    toggleButtonActive: {
      backgroundColor: isDark ? '#fff' : '#1a1a1a',
      color: isDark ? '#000' : '#fff'
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
        <Link to="/gallery/list" style={styles.backLink}>
          ← {t('gallery.backToGallery')}
        </Link>
        
        <motion.div variants={itemVariants} style={styles.moduleNumber}>
          {moduleData.number}
        </motion.div>
        
        <motion.h1 variants={itemVariants} style={styles.title}>
          {moduleData.title}
        </motion.h1>
        
        <motion.div variants={itemVariants} style={styles.subtitle}>
          {moduleData.subtitle}
        </motion.div>
        
        <motion.p variants={itemVariants} style={styles.desc}>
          {moduleData.desc}
        </motion.p>
        
        {/* Media Tags */}
        <motion.div variants={itemVariants} style={styles.tagsRow}>
          {moduleData.media?.map((m, i) => (
            <span key={i} style={styles.mediaTag}>{m}</span>
          ))}
        </motion.div>
        
        {/* Keywords */}
        <motion.div variants={itemVariants} style={styles.keywordsRow}>
          {moduleData.keywords?.map((k, i) => (
            <span key={i} style={styles.keyword}>{k}</span>
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
          
          {/* 各个媒介 */}
          {getAllMediaTypes().map(media => {
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
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${selectedMedia}-${aspectType}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={styles.worksGrid}
          >
            {filteredWorks.map((work, index) => (
              <motion.div 
                key={work.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                style={{ ...styles.workCard, cursor: 'pointer' }}
                onClick={() => openImageViewer(index)}
              >
                  <img 
                    src={work.image} 
                    alt={work.title}
                    style={{ 
                      ...styles.workImage,
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.background = isDark ? '#1a1a1a' : '#f0f0f0';
                      e.target.style.display = 'flex';
                      e.target.style.alignItems = 'center';
                      e.target.style.justifyContent = 'center';
                      e.target.textContent = work.category;
                    }}
                  />
                <h3 style={styles.workTitle}>{work.title}</h3>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Floating Aspect Ratio Toggle */}
      <div style={styles.floatingToggle}>
        <button
          onClick={() => setAspectType('portrait')}
          style={{
            ...styles.toggleButton,
            ...(aspectType === 'portrait' ? styles.toggleButtonActive : {})
          }}
        >
          {t('gallery.aspectType.portrait')}
        </button>
        <button
          onClick={() => setAspectType('landscape')}
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
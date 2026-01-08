import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { useTheme } from '../hooks/useTheme';
import { Link, useParams } from 'react-router-dom';

const GalleryModule = () => {
  const { t } = useTranslation();
  const { module } = useParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // 模块配置 - 包含每个模块的作品数据
  const moduleConfigs = {
    'form-structure': {
      worksCount: 12,
      aspectRatio: '3/4'
    },
    'material-texture': {
      worksCount: 8,
      aspectRatio: '1/1'
    },
    'narrative-imagery': {
      worksCount: 10,
      aspectRatio: '4/3'
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

  // Mock Works Data
  const works = Array.from({ length: config.worksCount }).map((_, i) => ({
    id: i + 1,
    title: t('gallery.workTitle', { num: i + 1 }),
    year: `202${3 - (i % 3)}`,
    cover: isDark ? '#1a1a1a' : '#f0f0f0'
  }));

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
      maxWidth: '1400px',
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
      fontSize: 'clamp(3rem, 8vw, 6rem)',
      fontWeight: '200',
      color: isDark ? '#222' : '#e5e5e5',
      lineHeight: 1,
      marginBottom: '16px'
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
      marginBottom: '24px'
    },
    desc: {
      fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
      color: isDark ? '#666' : '#888',
      maxWidth: '600px',
      lineHeight: 1.8,
      marginBottom: '32px'
    },
    tagsRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '16px'
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
      padding: '0 clamp(40px, 8vw, 120px) clamp(60px, 8vw, 100px)',
      maxWidth: '1600px',
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
      gridTemplateColumns: `repeat(auto-fill, minmax(${config.aspectRatio === '16/9' ? '350px' : '280px'}, 1fr))`,
      gap: 'clamp(20px, 3vw, 40px)'
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
    }
  };

  // 如果模块不存在
  if (!moduleData || !moduleData.title) {
    return (
      <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Module Not Found</h2>
          <Link to="/gallery" style={{ color: isDark ? '#888' : '#666' }}>← Back to Gallery</Link>
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
        <Link to="/gallery" style={styles.backLink}>
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

      {/* Works Section */}
      <section style={styles.worksSection}>
        <motion.div variants={itemVariants} style={styles.worksHeader}>
          <span style={styles.worksCount}>
            {t('gallery.allWorks')} ({works.length})
          </span>
          <select style={{ 
            padding: '8px 16px', 
            borderRadius: '8px', 
            border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
            background: isDark ? '#1a1a1a' : '#fff',
            color: isDark ? '#888' : '#666',
            fontSize: '0.85rem'
          }}>
            <option>{t('gallery.latestRelease')}</option>
            <option>{t('gallery.featuredRecommend')}</option>
          </select>
        </motion.div>

        {/* Works Grid */}
        <motion.div variants={containerVariants} style={styles.worksGrid}>
          {works.map(work => (
            <Link 
              key={work.id} 
              to={`/gallery/${module}/work/${work.id}`} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5 }}
                style={styles.workCard}
              >
                <div style={{ ...styles.workImage, background: work.cover }}>
                  {t('gallery.workImage')}
                </div>
                <h3 style={styles.workTitle}>{work.title}</h3>
                <div style={styles.workMeta}>{work.year}</div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
};

export default GalleryModule;
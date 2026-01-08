import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';

const GalleryHome = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  useTitle(t('gallery.title'));

  // 5 个模块的 key
  const moduleKeys = [
    'form-structure',
    'material-texture', 
    'narrative-imagery',
    'light-atmosphere',
    'observation-reality'
  ];

  // 动画配置
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
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
      padding: 'clamp(80px, 12vw, 150px) clamp(40px, 8vw, 120px) clamp(40px, 6vw, 80px)',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    headerLabel: {
      fontSize: '0.85rem',
      color: isDark ? '#666' : '#888',
      marginBottom: '16px',
      paddingLeft: '12px',
      borderLeft: `2px solid ${isDark ? '#333' : '#ddd'}`,
      fontWeight: '400'
    },
    headerTitle: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: '300',
      marginBottom: '24px',
      lineHeight: 1.1
    },
    headerDesc: {
      fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
      color: isDark ? '#888' : '#666',
      maxWidth: '600px',
      lineHeight: 1.8
    },
    modulesGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1px',
      backgroundColor: isDark ? '#222' : '#e5e5e5'
    },
    moduleCard: {
      backgroundColor: isDark ? '#0a0a0a' : '#fff',
      padding: 'clamp(40px, 6vw, 80px) clamp(40px, 8vw, 120px)',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    moduleCardHover: {
      backgroundColor: isDark ? '#151515' : '#f5f5f5'
    },
    moduleInner: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      gap: 'clamp(30px, 5vw, 80px)',
      alignItems: 'start'
    },
    moduleNumber: {
      fontFamily: 'var(--font-mono, monospace)',
      fontSize: 'clamp(2rem, 4vw, 3.5rem)',
      fontWeight: '200',
      color: isDark ? '#333' : '#ddd',
      lineHeight: 1,
      minWidth: '80px'
    },
    moduleContent: {
      flex: 1
    },
    moduleTitle: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
      fontWeight: '400',
      marginBottom: '8px',
      lineHeight: 1.2
    },
    moduleSubtitle: {
      fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
      color: isDark ? '#888' : '#666',
      marginBottom: '20px',
      fontWeight: '400'
    },
    moduleDesc: {
      fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
      color: isDark ? '#666' : '#888',
      lineHeight: 1.8,
      marginBottom: '24px',
      maxWidth: '500px'
    },
    tagsRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '16px'
    },
    mediaTag: {
      padding: '4px 12px',
      fontSize: '0.8rem',
      borderRadius: '100px',
      backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
      color: isDark ? '#888' : '#666',
      border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`
    },
    keywordsRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px'
    },
    keyword: {
      fontSize: '0.85rem',
      color: isDark ? '#555' : '#999',
      fontFamily: 'var(--font-mono, monospace)',
      letterSpacing: '0.5px'
    },
    moduleArrow: {
      fontSize: '1.5rem',
      color: isDark ? '#444' : '#ccc',
      alignSelf: 'center',
      transition: 'transform 0.3s ease, color 0.3s ease'
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
        <div style={styles.headerLabel}>Art Practice · Visual Exploration</div>
        <h1 style={styles.headerTitle}>{t('gallery.title')}</h1>
        <p style={styles.headerDesc}>
          {t('gallery.subtitle')}
        </p>
      </motion.header>

      {/* Modules List */}
      <motion.div variants={containerVariants} style={styles.modulesGrid}>
        {moduleKeys.map((key) => {
          const module = t(`gallery.modules.${key}`, { returnObjects: true });
          
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
                  {/* Number */}
                  <div style={styles.moduleNumber}>{module.number}</div>
                  
                  {/* Content */}
                  <div style={styles.moduleContent}>
                    <h2 style={styles.moduleTitle}>{module.title}</h2>
                    <div style={styles.moduleSubtitle}>{module.subtitle}</div>
                    <p style={styles.moduleDesc}>{module.desc}</p>
                    
                    {/* Media Tags */}
                    <div style={styles.tagsRow}>
                      {module.media?.map((m, i) => (
                        <span key={i} style={styles.mediaTag}>{m}</span>
                      ))}
                    </div>
                    
                    {/* Keywords */}
                    <div style={styles.keywordsRow}>
                      {module.keywords?.map((k, i) => (
                        <span key={i} style={styles.keyword}>{k}</span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <motion.div 
                    style={styles.moduleArrow}
                    whileHover={{ x: 5, color: isDark ? '#fff' : '#000' }}
                  >
                    →
                  </motion.div>
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
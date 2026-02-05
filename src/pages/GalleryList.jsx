import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { useTheme } from '../hooks/useTheme';
import { useIsMobile } from '../hooks/useMediaQuery';
import { Link } from 'react-router-dom';

const GalleryList = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  
  useTitle(t('gallery.pageTitle') || '画廊');

  const [activeCategory, setActiveCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('最新');

  const categories = ['全部', '平面设计', '插画', '动态设计', '3D 艺术', '实验性'];

  // Mock Data
  const galleryItems = [
    { id: 'g1', title: '霓虹城市', category: '3D 艺术', image: '/covers/gallery/items/1.png', height: '300px' },
    { id: 'g2', title: '抽象图形', category: '平面设计', image: '/covers/gallery/items/2.png', height: '400px' },
    { id: 'g3', title: '角色研究', category: '插画', image: '/covers/gallery/items/3.png', height: '350px' },
    { id: 'g4', title: 'Logo 合集', category: '平面设计', image: '/covers/gallery/items/4.png', height: '300px' },
    { id: 'g5', title: '动态字体', category: '动态设计', image: '/covers/gallery/items/5.png', height: '450px' },
    { id: 'g6', title: '海报系列', category: '平面设计', image: '/covers/gallery/items/6.png', height: '380px' },
    { id: 'g7', title: '超现实景观', category: '3D 艺术', image: '/covers/gallery/items/7.png', height: '320px' },
    { id: 'g8', title: '每日渲染', category: '实验性', image: '/covers/gallery/items/8.png', height: '400px' },
  ];

  const filteredItems = activeCategory === '全部' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  // 样式配置
  const styles = {
    page: {
      background: isDark ? '#0a0a0a' : '#f8f8f8',
      color: isDark ? '#fff' : '#1a1a1a',
      minHeight: '100vh',
    },
    title: {
      color: isDark ? '#fff' : '#111',
    },
    categoryActive: {
      background: isDark ? '#fff' : '#000',
      color: isDark ? '#000' : '#fff',
      border: isDark ? '1px solid #fff' : '1px solid #000',
    },
    categoryInactive: {
      background: isDark ? 'transparent' : '#fff',
      color: isDark ? '#999' : '#666',
      border: isDark ? '1px solid #333' : '1px solid #eee',
    },
    select: {
      background: isDark ? '#1a1a1a' : '#fff',
      color: isDark ? '#fff' : '#333',
      border: isDark ? '1px solid #333' : '1px solid #ddd',
    },
    cardBg: isDark ? '#1a1a1a' : '#fff',
    cardBorder: isDark ? '#222' : '#eee',
    textMuted: isDark ? '#888' : '#666',
  };

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    },
    exit: { opacity: 0, scale: 0.95 }
  };

  // ========== 移动端布局 ==========
  if (isMobile) {
    return (
      <div style={{ 
        ...styles.page,
        padding: 'var(--space-md) 0',
      }}>
        {/* 移动端头部 */}
        <div style={{ 
          padding: '0 var(--space-page-x)',
          marginBottom: 'var(--space-lg)',
        }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ 
              fontSize: 'clamp(1.8rem, 7vw, 2.5rem)', 
              fontWeight: '700', 
              marginBottom: 'var(--space-md)',
              fontFamily: 'var(--font-serif)',
              ...styles.title,
            }}
          >
            {t('gallery.title') || '画廊'}
          </motion.h1>
          
          {/* 分类标签 - 横向滚动 */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ 
              display: 'flex', 
              gap: '8px', 
              overflowX: 'auto', 
              paddingBottom: '8px',
              marginRight: 'calc(-1 * var(--space-page-x))',
              paddingRight: 'var(--space-page-x)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
            className="hide-scrollbar"
          >
            {categories.map(cat => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  ...(activeCategory === cat ? styles.categoryActive : styles.categoryInactive),
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* 移动端网格 - 2列 */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '12px',
            padding: '0 var(--space-page-x)',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                exit="exit"
                style={{ 
                  position: 'relative',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: styles.cardBg,
                  border: `1px solid ${styles.cardBorder}`,
                }}
              >
                <Link 
                  to={`/gallery/${item.id}`} 
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  {/* 图片区域 - 固定宽高比 */}
                  <div style={{ 
                    aspectRatio: '3/4',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {item.image.startsWith('/') ? (
                      <img
                        src={`${import.meta.env.BASE_URL}${item.image.replace(/^\//, '')}`}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {/* 占位背景 */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: isDark 
                        ? `linear-gradient(135deg, hsl(${200 + index * 30}, 30%, 20%) 0%, hsl(${200 + index * 30}, 25%, 12%) 100%)`
                        : `linear-gradient(135deg, hsl(${200 + index * 30}, 15%, 85%) 0%, hsl(${200 + index * 30}, 20%, 75%) 100%)`,
                      display: item.image.startsWith('/') ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      fontSize: '2rem',
                      fontWeight: '700',
                    }}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    
                    {/* 序号标签 */}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      padding: '4px 8px',
                      background: 'rgba(0,0,0,0.6)',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      color: '#fff',
                      fontWeight: '600',
                      fontFamily: 'var(--font-mono, monospace)',
                    }}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  
                  {/* 文字信息 */}
                  <div style={{ padding: '12px' }}>
                    <h3 style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: '600', 
                      margin: '0 0 4px',
                      color: styles.title.color,
                      lineHeight: 1.3,
                    }}>
                      {item.title}
                    </h3>
                    <p style={{ 
                      fontSize: '0.75rem', 
                      color: styles.textMuted,
                      margin: 0,
                    }}>
                      {item.category}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 底部间距 */}
        <div style={{ height: 'var(--space-xl)' }} />
        
        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      </div>
    );
  }

  // ========== 桌面端布局（原有代码优化） ==========
  return (
    <div style={{ 
      ...styles.page,
      padding: '40px var(--space-page-x)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '60px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ 
            fontSize: '3em', 
            fontWeight: '900', 
            marginBottom: '30px',
            fontFamily: 'var(--font-serif)',
            ...styles.title,
          }}
        >
          {t('gallery.title') || '画廊'}.
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '20px' 
          }}
        >
          {/* Categories */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            overflowX: 'auto', 
            paddingBottom: '5px', 
            scrollbarWidth: 'none' 
          }}>
            {categories.map(cat => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  ...(activeCategory === cat ? styles.categoryActive : styles.categoryInactive),
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontSize: '0.9em',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Sort */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ 
              padding: '8px 15px', 
              borderRadius: '8px', 
              ...styles.select,
              cursor: 'pointer',
            }}
          >
            <option value="最新">最新</option>
            <option value="热门">热门</option>
          </select>
        </motion.div>
      </div>

      {/* Masonry Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px',
          gridAutoRows: '10px'
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => {
            const rowSpan = Math.ceil(parseInt(item.height) / 10) + 5; 
            
            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                exit="exit"
                style={{ 
                  gridRowEnd: `span ${rowSpan}`,
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: styles.cardBg,
                }}
              >
                <Link 
                  to={`/gallery/${item.id}`} 
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
                >
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {item.image.startsWith('/') ? (
                      <img
                        src={`${import.meta.env.BASE_URL}${item.image.replace(/^\//, '')}`}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}
                    
                    {/* 占位背景 */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: isDark 
                        ? `linear-gradient(135deg, hsl(${200 + index * 30}, 30%, 20%) 0%, hsl(${200 + index * 30}, 25%, 12%) 100%)`
                        : `linear-gradient(135deg, hsl(${200 + index * 30}, 15%, 85%) 0%, hsl(${200 + index * 30}, 20%, 75%) 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                      fontSize: '3rem',
                      fontWeight: '700',
                      zIndex: -1,
                    }}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    
                    {/* Hover 信息层 */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '24px 20px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                        color: '#fff',
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                        {item.category}
                      </div>
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default GalleryList;
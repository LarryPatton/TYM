import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';

const Work = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  useTitle(t('work.pageTitle'));

  // ========== 动画变体定义 ==========
  
  // 页面容器 - 控制整体交错
  const pageContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  // 卡片容器 - 控制内部元素交错
  const cardContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
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
        fontSize: isPrimary ? '0.85rem' : '0.75rem',
        color: isDark ? '#666' : '#888',
        marginBottom: isPrimary ? '20px' : '14px',
        paddingLeft: '12px',
        borderLeft: `2px solid ${isDark ? '#333' : '#ddd'}`,
        fontWeight: '400'
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
      minHeight: '75vh',
      padding: 'clamp(80px, 12vw, 150px)',
      backgroundColor: '#0a0a0a',
      borderBottom: '1px solid #222',
      cursor: 'pointer'
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
    title: { color: '#fff', fontWeight: '300' },
    desc: { color: '#999' },
    quote: { color: '#777' },
    cta: { color: '#fff' },
    tag: { border: '1px solid #333', color: '#999', backgroundColor: 'transparent' }
  };

  // 亮色模式样式
  const lightStyles = {
    page: {
      backgroundColor: '#f8f8f8',
      color: '#1a1a1a'
    },
    primary: {
      minHeight: '70vh',
      padding: 'clamp(60px, 10vw, 120px)',
      backgroundColor: '#ffffff',
      cursor: 'pointer'
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
    title: { color: '#1a1a1a', fontWeight: '400' },
    desc: { color: '#666' },
    quote: { color: '#666' },
    cta: { color: '#1a1a1a' },
    tag: { border: '1px solid #e5e5e5', color: '#666', backgroundColor: 'transparent' }
  };

  const styles = isDark ? darkStyles : lightStyles;

  return (
    <motion.div 
      key={theme}
      initial="hidden"
      animate="visible"
      variants={pageContainer}
      style={{ 
        minHeight: '100vh',
        ...styles.page
      }}
    >
      {/* 主卡片：深度案例研究 */}
      <Link to="/work/the-case" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <motion.div 
          variants={cardContainer}
          whileHover={styles.primaryHover}
          transition={{ duration: 0.3 }}
          style={{ 
            ...styles.primary,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <div style={{ maxWidth: '800px' }}>
            {/* 标签 - 左侧滑入 */}
            <AnimatedLabel text={t('work.featuredCaseStudy')} isPrimary={true} />
            
            {/* 标题 - 逐字淡入 */}
            <motion.div variants={fadeInUp} style={{ marginBottom: '32px' }}>
              <AnimatedTitle 
                text={t('work.featured.title')}
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
                marginBottom: '40px', 
                maxWidth: '600px',
                ...styles.desc
              }}
            >
              {t('work.featured.desc')}
            </motion.p>
            
            {/* 标签组 - 交错缩放淡入 */}
            <motion.div 
              variants={tagsContainer}
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '50px' }}
            >
              {t('work.featured.tags', { returnObjects: true }).map(tag => (
                <motion.span 
                  key={tag} 
                  variants={tagItem}
                  whileHover={{ scale: 1.05 }}
                  style={{ 
                    padding: '8px 20px', 
                    borderRadius: '100px', 
                    fontSize: '0.9rem',
                    ...styles.tag
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
            
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
              {t('work.viewFullCase')} 
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

      {/* 分割线：艺术画廊 - 生长动画 */}
      <motion.div 
        variants={fadeInUp}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          padding: '20px clamp(40px, 8vw, 100px)'
        }}
      >
        <motion.div 
          variants={dividerLineLeft}
          style={{ flex: 1, height: '1px', background: styles.dividerLine }} 
        />
        <motion.span 
          variants={dividerText}
          style={{ fontSize: '0.85rem', color: styles.dividerText, fontWeight: '400', whiteSpace: 'nowrap' }}
        >
          {t('work.artGallery')}
        </motion.span>
        <motion.div 
          variants={dividerLineRight}
          style={{ flex: 1, height: '1px', background: styles.dividerLine }} 
        />
      </motion.div>

      {/* 画廊模块：两列并排 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      }}>
        {/* 造型 Form */}
        <Link to="/gallery/form" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <motion.div 
            variants={cardContainer}
            whileHover={styles.secondaryHover}
            transition={{ duration: 0.3 }}
            style={{ 
              ...styles.secondary,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRight: isDark ? '1px solid #222' : '1px solid #e5e5e5'
            }}
          >
            <AnimatedLabel text={t('work.modules.form.label')} isPrimary={false} />
            
            <motion.div variants={fadeInUp} style={{ marginBottom: '16px' }}>
              <AnimatedTitle 
                text={t('work.modules.form.title')}
                as="h3"
                style={{ 
                  fontFamily: 'var(--font-serif)', 
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)', 
                  lineHeight: 1.2,
                  ...styles.title
                }}
              />
            </motion.div>
            
            <motion.p 
              variants={descReveal}
              style={{ 
                fontSize: '1rem', 
                fontStyle: 'italic', 
                fontFamily: 'var(--font-serif)',
                marginBottom: '30px',
                ...styles.quote
              }}
            >
              {t('work.modules.form.quote')}
            </motion.p>
            
            <motion.div 
              variants={ctaReveal}
              style={{ fontSize: '1rem', fontWeight: '500', ...styles.cta }}
            >
              {t('work.modules.form.enter')} 
              <motion.span 
                style={{ display: 'inline-block', marginLeft: '4px' }}
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                →
              </motion.span>
            </motion.div>
          </motion.div>
        </Link>

        {/* 摄影 Photo */}
        <Link to="/gallery/photo" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <motion.div 
            variants={cardContainer}
            whileHover={styles.secondaryHover}
            transition={{ duration: 0.3 }}
            style={{ 
              ...styles.secondary,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <AnimatedLabel text={t('work.modules.photo.label')} isPrimary={false} />
            
            <motion.div variants={fadeInUp} style={{ marginBottom: '16px' }}>
              <AnimatedTitle 
                text={t('work.modules.photo.title')}
                as="h3"
                style={{ 
                  fontFamily: 'var(--font-serif)', 
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)', 
                  lineHeight: 1.2,
                  ...styles.title
                }}
              />
            </motion.div>
            
            <motion.p 
              variants={descReveal}
              style={{ 
                fontSize: '1rem', 
                fontStyle: 'italic', 
                fontFamily: 'var(--font-serif)',
                marginBottom: '30px',
                ...styles.quote
              }}
            >
              {t('work.modules.photo.quote')}
            </motion.p>
            
            <motion.div 
              variants={ctaReveal}
              style={{ fontSize: '1rem', fontWeight: '500', ...styles.cta }}
            >
              {t('work.modules.photo.enter')} 
              <motion.span 
                style={{ display: 'inline-block', marginLeft: '4px' }}
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                →
              </motion.span>
            </motion.div>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default Work;
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';

// 倾斜切割背景组件 - 使用 clip-path 实现真正的斜切效果
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
  
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
    }}>
      {phases.map((phase, index) => (
        <div
          key={phase.id}
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: getClipPath(index),
            WebkitClipPath: getClipPath(index),
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
        </div>
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
        staggerChildren: 0.15,
        delayChildren: 0
      }
    }
  };

  // 卡片容器 - 控制内部元素交错
  const cardContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0
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

  // 定义 phases 数据用于倾斜背景（深度案例研究）
  const phases = [
    {
      id: 'phase-01',
      titleEn: 'Brand Identity',
      image: '/images/case-index/phase-01-cover.png',
    },
    {
      id: 'phase-02',
      titleEn: 'Product A',
      image: '/images/case-index/phase-02-cover.png',
    },
    {
      id: 'phase-03',
      titleEn: 'Product B',
      image: '/images/case-index/phase-03-cover.png',
    },
    {
      id: 'phase-04',
      titleEn: 'Packaging',
      image: null, // 暂无封面
    },
    {
      id: 'phase-05',
      titleEn: 'Coming Soon',
      image: null,
    },
    {
      id: 'phase-06',
      titleEn: 'Coming Soon',
      image: null,
    }
  ];

  // 定义 gallery 数据用于艺术画廊斜切背景（使用占位图）
  const galleryItems = [
    {
      id: 'gallery-01',
      titleEn: 'Artwork 01',
      image: '/images/gallery/placeholder-01.svg',
    },
    {
      id: 'gallery-02',
      titleEn: 'Artwork 02',
      image: '/images/gallery/placeholder-02.svg',
    },
    {
      id: 'gallery-03',
      titleEn: 'Artwork 03',
      image: '/images/gallery/placeholder-03.svg',
    },
    {
      id: 'gallery-04',
      titleEn: 'Artwork 04',
      image: '/images/gallery/placeholder-04.svg',
    },
    {
      id: 'gallery-05',
      titleEn: 'Artwork 05',
      image: '/images/gallery/placeholder-05.svg',
    },
  ];

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
    label: { color: '#aaa', borderColor: '#555' },
    title: { color: '#fff', fontWeight: '400' },
    desc: { color: '#ccc' },
    quote: { color: '#999' },
    cta: { color: '#fff', fontWeight: '600' },
    tag: { border: '1px solid #555', color: '#ccc', backgroundColor: 'rgba(255,255,255,0.05)' }
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
    label: { color: '#333', borderColor: '#999' },
    title: { color: '#111', fontWeight: '500' },
    desc: { color: '#333' },
    quote: { color: '#444' },
    cta: { color: '#111', fontWeight: '600' },
    tag: { border: '1px solid #999', color: '#333', backgroundColor: 'rgba(0,0,0,0.03)' }
  };

  const styles = isDark ? darkStyles : lightStyles;

  // 滚动提示透明度控制
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <motion.div 
      key={theme}
      initial="hidden"
      animate="visible"
      variants={pageContainer}
      style={{ 
        minHeight: '100vh',
        position: 'relative',
        ...styles.page
      }}
    >
      {/* 滚动提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          opacity: scrollIndicatorOpacity,
          position: 'fixed',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--color-text-light)',
          fontSize: '0.75rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          zIndex: 50,
          pointerEvents: 'none',
        }}
      >
        <span>{t('common.scroll')}</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            width: '1px',
            height: '50px',
            background: isDark 
              ? 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)'
              : 'linear-gradient(to bottom, var(--color-text-light), transparent)',
          }}
        />
      </motion.div>

      {/* 主卡片：深度案例研究 */}
      <Link to="/work/the-case" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <motion.div 
          variants={cardContainer}
          whileHover={styles.primaryHover}
          transition={{ duration: 0.3 }}
          style={{ 
            ...styles.primary,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* 倾斜切割背景 */}
          <SlicedBackground phases={phases} isDark={isDark} />
          
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
          
          {/* 前景内容 - 无背景 */}
          <div style={{ 
            maxWidth: '600px', 
            position: 'relative', 
            zIndex: 2,
          }}>
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

      {/* 艺术画廊卡片 - 带斜切背景 */}
      <Link to="/gallery" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <motion.div 
          variants={cardContainer}
          whileHover={styles.primaryHover}
          transition={{ duration: 0.3 }}
          style={{ 
            ...styles.primary,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'hidden',
            borderTop: isDark ? '1px solid #222' : '1px solid #e5e5e5'
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
            <AnimatedLabel text={t('work.gallery.label')} isPrimary={true} />
            
            {/* 标题 - 逐字淡入 */}
            <motion.div variants={fadeInUp} style={{ marginBottom: '32px' }}>
              <AnimatedTitle 
                text={t('work.gallery.title')}
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
              {t('work.gallery.desc')}
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
              {t('work.gallery.enter')} 
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
    </motion.div>
  );
};

export default Work;
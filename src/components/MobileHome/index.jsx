import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/**
 * 移动端首页 - 全屏分屏布局
 * 禁用垂直滚动，通过侧边悬浮胶囊切换屏幕
 */
const MobileHome = ({ featuredCases, services, partners }) => {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 屏幕配置
  const screens = [
    { id: 'hero', name: t('home.sectionHero'), dark: false },
    { id: 'works', name: t('home.sectionWorks'), dark: false },
    { id: 'services', name: t('home.sectionServices'), dark: true },
    { id: 'partners', name: t('home.sectionPartners') || '合作品牌', dark: false },
    { id: 'contact', name: t('home.sectionContact'), dark: true },
  ];
  
  const totalScreens = screens.length;
  const isDark = screens[currentScreen]?.dark;
  
  // 切换屏幕
  const goToScreen = (index) => {
    if (isTransitioning || index === currentScreen) return;
    if (index < 0 || index >= totalScreens) return;
    
    setIsTransitioning(true);
    setCurrentScreen(index);
    
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  const goNext = () => goToScreen(currentScreen + 1);
  const goPrev = () => goToScreen(currentScreen - 1);
  
  // 禁用页面垂直滚动
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      top: 'var(--nav-height)',
      background: isDark ? '#111' : 'var(--color-bg)',
      transition: 'background 0.5s ease',
      overflow: 'hidden',
    }}>
      {/* 屏幕内容区 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {currentScreen === 0 && (
            <HeroScreen t={t} onNext={goNext} />
          )}
          {currentScreen === 1 && (
            <WorksScreen t={t} projects={featuredCases} onNext={goNext} />
          )}
          {currentScreen === 2 && (
            <ServicesScreen t={t} services={services} onNext={goNext} />
          )}
          {currentScreen === 3 && (
            <PartnersScreen t={t} partners={partners} onNext={goNext} />
          )}
          {currentScreen === 4 && (
            <ContactScreen t={t} onBackToTop={() => goToScreen(0)} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/**
 * 底部动态指示条 - 进度条 + 可拖动 + 箭头导航
 */
const SwipeIndicator = ({
  activeIndex,
  total,
  onScrollTo,
  isDark = false,
}) => {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const bgColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const activeColor = isDark ? '#fff' : 'var(--color-text-main)';
  const mutedColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
  
  const canPrev = activeIndex > 0;
  const canNext = activeIndex < total - 1;
  
  // 计算滑块位置和宽度
  const segmentWidth = 100 / total;
  const thumbLeft = activeIndex * segmentWidth;
  
  // 处理轨道点击/拖动
  const handleTrackInteraction = (e) => {
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newIndex = Math.round(percentage * (total - 1));
    
    if (newIndex !== activeIndex) {
      onScrollTo(newIndex);
    }
  };
  
  const handleTouchStart = (e) => {
    setIsDragging(true);
    handleTrackInteraction(e);
  };
  
  const handleTouchMove = (e) => {
    if (isDragging) {
      handleTrackInteraction(e);
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '0 var(--space-page-x)',
    }}>
      {/* 左箭头 */}
      <motion.button
        onClick={() => canPrev && onScrollTo(activeIndex - 1)}
        whileTap={{ scale: 0.9 }}
        style={{
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          borderRadius: '50%',
          color: canPrev ? activeColor : mutedColor,
          fontSize: '0.85rem',
          cursor: canPrev ? 'pointer' : 'default',
          transition: 'color 0.3s',
          flexShrink: 0,
        }}
        disabled={!canPrev}
      >
        ‹
      </motion.button>
      
      {/* 轨道 */}
      <div
        ref={trackRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleTrackInteraction}
        style={{
          flex: 1,
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          touchAction: 'none',
        }}
      >
        <div style={{
          width: '100%',
          height: '3px',
          background: bgColor,
          borderRadius: '2px',
          position: 'relative',
          overflow: 'visible',
        }}>
          {/* 活动滑块 */}
          <motion.div
            animate={{ 
              left: `${thumbLeft}%`,
              width: `${segmentWidth}%`,
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
            }}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              height: '3px',
              background: activeColor,
              borderRadius: '2px',
            }}
          />
          
          {/* 滑块上的圆点 */}
          <motion.div
            animate={{ 
              left: `${thumbLeft + segmentWidth / 2}%`,
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
            }}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: isDragging ? '14px' : '10px',
              height: isDragging ? '14px' : '10px',
              background: activeColor,
              borderRadius: '50%',
              boxShadow: isDark 
                ? '0 2px 8px rgba(255,255,255,0.2)' 
                : '0 2px 8px rgba(0,0,0,0.15)',
              transition: 'width 0.2s, height 0.2s',
            }}
          />
        </div>
      </div>
      
      {/* 右箭头 */}
      <motion.button
        onClick={() => canNext && onScrollTo(activeIndex + 1)}
        whileTap={{ scale: 0.9 }}
        animate={canNext && !isDragging ? { x: [0, 3, 0] } : {}}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          borderRadius: '50%',
          color: canNext ? activeColor : mutedColor,
          fontSize: '0.85rem',
          cursor: canNext ? 'pointer' : 'default',
          transition: 'color 0.3s',
          flexShrink: 0,
        }}
        disabled={!canNext}
      >
        ›
      </motion.button>
    </div>
  );
};

/**
 * 下一屏滑动提示组件
 */
const SwipeToNextHint = ({ label, isDark = false, onSwipe }) => {
  const [startY, setStartY] = useState(null);
  
  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };
  
  const handleTouchEnd = (e) => {
    if (startY === null) return;
    const endY = e.changedTouches[0].clientY;
    const diff = startY - endY;
    
    // 向上滑动超过 50px 触发
    if (diff > 50) {
      onSwipe?.();
    }
    setStartY(null);
  };
  
  const textColor = isDark ? 'rgba(255,255,255,0.5)' : 'var(--color-text-muted)';
  const lineColor = isDark ? 'rgba(255,255,255,0.2)' : 'var(--color-border)';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onSwipe}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '24px 20px',
        cursor: 'pointer',
      }}
    >
      {/* 上滑动画箭头 */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          fontSize: '1.2rem',
          color: textColor,
        }}
      >
        ↑
      </motion.div>
      
      {/* 文字提示 */}
      <span style={{
        fontSize: '0.75rem',
        color: textColor,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        fontWeight: '500',
      }}>
        {label}
      </span>
      
      {/* 装饰线 */}
      <div style={{
        width: '40px',
        height: '1px',
        background: lineColor,
      }} />
    </motion.div>
  );
};

/**
 * Hero 屏幕
 */
const HeroScreen = ({ t, onNext }) => {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 'var(--space-xl) var(--space-page-x) 0',
    }}>
      {/* 主内容区域 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.8rem, 12vw, 4rem)',
          fontWeight: '400',
          lineHeight: 1.1,
          marginBottom: '16px',
          letterSpacing: '-0.03em',
          color: 'var(--color-text-main)',
        }}
      >
        {t('home.heroName')}
      </motion.h1>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
          fontWeight: '400',
          color: 'var(--color-text-muted)',
          marginBottom: '24px',
        }}
      >
        {t('home.heroRole')}
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          fontSize: '1rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          marginBottom: '32px',
        }}
      >
        {t('home.heroDesc')}{t('home.heroDesc2')}
      </motion.p>
      
      {/* Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '32px',
        }}
      >
        {t('home.heroTags', { returnObjects: true }).map(tag => (
          <span
            key={tag}
            style={{
              padding: '8px 16px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: 'var(--color-text-muted)',
            }}
          >
            {tag}
          </span>
        ))}
      </motion.div>
      
      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={onNext}
          style={{
            padding: '14px 32px',
            background: 'var(--color-text-main)',
            color: 'var(--color-bg)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          {t('home.viewFeaturedCases')}
        </button>
        <Link to="/contact">
          <button
            style={{
              padding: '14px 32px',
              background: 'transparent',
              color: 'var(--color-text-main)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            {t('home.contactMe')}
          </button>
        </Link>
      </motion.div>
      </div>
      
      {/* 底部滑动提示 */}
      <SwipeToNextHint 
        label={t('common.swipeToViewWorks') || '上滑查看作品'} 
        isDark={false} 
        onSwipe={onNext} 
      />
    </div>
  );
};

/**
 * Works 屏幕 - 横向滑动卡片
 */
const WorksScreen = ({ t, projects, onNext }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  
  // 监听滚动位置更新当前项目
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const handleScroll = () => {
      const cardWidth = carousel.offsetWidth;
      const scrollLeft = carousel.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < projects.length) {
        setActiveIndex(newIndex);
      }
    };
    
    carousel.addEventListener('scroll', handleScroll, { passive: true });
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [projects.length, activeIndex]);
  
  const scrollToProject = (index) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 'var(--space-md)',
      paddingBottom: 'var(--space-lg)',
    }}>
      {/* Header */}
      <div style={{
        padding: '0 var(--space-page-x) var(--space-sm)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontSize: '0.7rem',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontWeight: '500',
        }}>
          {t('home.featuredTitle')}
        </span>
        <span style={{
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono, monospace)',
          color: 'var(--color-text-main)',
          fontWeight: '600',
        }}>
          {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div style={{
        margin: '0 var(--space-page-x) var(--space-sm)',
        height: '2px',
        background: 'var(--color-border)',
        borderRadius: '1px',
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ width: `${((activeIndex + 1) / projects.length) * 100}%` }}
          transition={{ duration: 0.3 }}
          style={{
            height: '100%',
            background: 'var(--color-text-main)',
          }}
        />
      </div>
      
      {/* Carousel */}
      <div
        ref={carouselRef}
        style={{
          flex: 1,
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="hide-scrollbar"
      >
        {projects.map((project, index) => (
          <div
            key={project.id}
            style={{
              flex: '0 0 100%',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              padding: 'var(--space-sm) var(--space-page-x)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
            }}
          >
            <Link
              to={`/work/the-case/${project.id}`}
              style={{ textDecoration: 'none', flex: 1, minHeight: 0 }}
            >
              <motion.div
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '40vh',
                  background: project.cover || '#eee',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 'clamp(1.3rem, 5vw, 2rem)',
                    fontWeight: '600',
                    textAlign: 'center',
                    padding: '20px',
                    fontFamily: 'var(--font-serif)',
                  }}>
                    {project.title}
                  </div>
                )}
                
                {/* Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  padding: '6px 12px',
                  background: 'rgba(0,0,0,0.7)',
                  borderRadius: '100px',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  fontFamily: 'var(--font-mono, monospace)',
                }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                {/* View Button */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '100px',
                  color: '#000',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                }}>
                  {t('work.viewProject')} →
                </div>
              </motion.div>
            </Link>
            
            {/* Text */}
            <div>
              <h3 style={{
                margin: '0 0 4px 0',
                fontSize: 'clamp(1.1rem, 4vw, 1.3rem)',
                fontFamily: 'var(--font-serif)',
                fontWeight: '500',
                lineHeight: 1.2,
                color: 'var(--color-text-main)',
              }}>
                {project.title}
              </h3>
              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.4,
              }}>
                {project.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* 底部区域：指示条 或 滑动提示 */}
      {activeIndex === projects.length - 1 ? (
        <SwipeToNextHint 
          label={t('common.swipeToServices') || '上滑查看服务'} 
          isDark={false} 
          onSwipe={onNext} 
        />
      ) : (
        <SwipeIndicator
          activeIndex={activeIndex}
          total={projects.length}
          onScrollTo={scrollToProject}
          isDark={false}
        />
      )}
      
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

/**
 * Services 屏幕 - 横向滑动卡片（带图片容器）
 */
const ServicesScreen = ({ t, services, onNext }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  
  // 服务图片配置（与桌面端 ServiceSection 保持一致）
  const serviceImages = {
    'brand-foundation': '/images/services/brand-1.jpg',
    'product-physical': '/images/services/product-1.jpg',
    'visual-communication': '/images/services/visual-1.jpg',
    'campaign-marketing': '/images/services/campaign-1.jpg',
    'offline-applications': '/images/services/offline-1.jpg',
    'creative-exploration': '/images/services/creative-1.jpg',
  };
  
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const handleScroll = () => {
      const cardWidth = carousel.offsetWidth;
      const scrollLeft = carousel.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < services.length) {
        setActiveIndex(newIndex);
      }
    };
    
    carousel.addEventListener('scroll', handleScroll, { passive: true });
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [services.length, activeIndex]);
  
  const scrollToService = (index) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 'var(--space-md)',
      paddingBottom: 'var(--space-lg)',
    }}>
      {/* Header */}
      <div style={{
        padding: '0 var(--space-page-x) var(--space-sm)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontWeight: '500',
        }}>
          SERVICES
        </span>
        <span style={{
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono, monospace)',
          color: '#fff',
          fontWeight: '600',
        }}>
          {String(activeIndex + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div style={{
        margin: '0 var(--space-page-x) var(--space-sm)',
        height: '2px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '1px',
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ width: `${((activeIndex + 1) / services.length) * 100}%` }}
          transition={{ duration: 0.3 }}
          style={{
            height: '100%',
            background: '#fff',
          }}
        />
      </div>
      
      {/* Carousel */}
      <div
        ref={carouselRef}
        style={{
          flex: 1,
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="hide-scrollbar"
      >
        {services.map((service, index) => {
          const serviceImage = serviceImages[service.id];
          return (
            <div
              key={service.id}
              style={{
                flex: '0 0 100%',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                padding: 'var(--space-xs) var(--space-page-x)',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-xs)',
                height: '100%',
              }}
            >
              {/* 图片容器 - 占据主要空间 */}
              <div style={{
                width: '100%',
                flex: 1,
                minHeight: '45vh',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.08)',
                position: 'relative',
              }}>
                {serviceImage ? (
                  <img
                    src={serviceImage}
                    alt={service.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.display = 'flex';
                      e.target.parentElement.style.alignItems = 'center';
                      e.target.parentElement.style.justifyContent = 'center';
                    }}
                  />
                ) : null}
                {/* 图片占位/标题叠加层 */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: serviceImage ? 'transparent' : 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.25)',
                  fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                  fontWeight: '500',
                  textAlign: 'center',
                  padding: '20px',
                  pointerEvents: 'none',
                }}>
                  {!serviceImage && service.title}
                </div>
                {/* 编号标签 */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  padding: '6px 12px',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '100px',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  fontFamily: 'var(--font-mono, monospace)',
                }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
              
              {/* 底部文字信息 - 紧凑布局 */}
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-sm)',
                flexShrink: 0,
              }}>
                {/* Title */}
                <h3 style={{
                  fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
                  fontWeight: '500',
                  color: '#fff',
                  margin: '0 0 6px 0',
                  lineHeight: 1.3,
                }}>
                  {service.title}
                </h3>
                
                {/* Problem - 单行或两行 */}
                {service.problem && (
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.4,
                    margin: '0 0 8px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {service.problem}
                  </p>
                )}
                
                {/* Tags - 横向滚动 */}
                {service.tags && (
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'nowrap',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    paddingBottom: '2px',
                  }}>
                    {service.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          padding: '4px 10px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.65rem',
                          color: 'rgba(255,255,255,0.7)',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 底部区域：指示条 或 滑动提示 */}
      {activeIndex === services.length - 1 ? (
        <SwipeToNextHint 
          label={t('common.swipeToPartners') || '上滑查看合作品牌'} 
          isDark={true} 
          onSwipe={onNext} 
        />
      ) : (
        <SwipeIndicator
          activeIndex={activeIndex}
          total={services.length}
          onScrollTo={scrollToService}
          isDark={true}
        />
      )}
    </div>
  );
};

/**
 * Partners 屏幕 - 合作品牌展示
 */
const PartnersScreen = ({ t, partners = [], onNext }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || !partners.length) return;
    
    const handleScroll = () => {
      const cardWidth = carousel.offsetWidth;
      const scrollLeft = carousel.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < partners.length) {
        setActiveIndex(newIndex);
      }
    };
    
    carousel.addEventListener('scroll', handleScroll, { passive: true });
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [partners.length, activeIndex]);
  
  const scrollToPartner = (index) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // 如果没有 partners 数据，直接跳到下一屏
  if (!partners || partners.length === 0) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'var(--space-xl) var(--space-page-x)',
      }}>
        <p style={{ color: 'var(--color-text-muted)' }}>暂无合作品牌</p>
        <SwipeToNextHint 
          label={t('common.swipeToContact') || '上滑联系我'} 
          isDark={false} 
          onSwipe={onNext} 
        />
      </div>
    );
  }
  
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 'var(--space-md)',
      paddingBottom: 'var(--space-lg)',
    }}>
      {/* Header */}
      <div style={{
        padding: '0 var(--space-page-x) var(--space-sm)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontSize: '0.7rem',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontWeight: '500',
        }}>
          {t('home.partnersTitle') || 'PARTNERS'}
        </span>
        <span style={{
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono, monospace)',
          color: 'var(--color-text-main)',
          fontWeight: '600',
        }}>
          {String(activeIndex + 1).padStart(2, '0')} / {String(partners.length).padStart(2, '0')}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div style={{
        margin: '0 var(--space-page-x) var(--space-sm)',
        height: '2px',
        background: 'var(--color-border)',
        borderRadius: '1px',
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ width: `${((activeIndex + 1) / partners.length) * 100}%` }}
          transition={{ duration: 0.3 }}
          style={{
            height: '100%',
            background: 'var(--color-text-main)',
          }}
        />
      </div>
      
      {/* Carousel */}
      <div
        ref={carouselRef}
        style={{
          flex: 1,
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="hide-scrollbar"
      >
        {partners.map((partner, index) => (
          <div
            key={partner.id}
            style={{
              flex: '0 0 100%',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              padding: 'var(--space-sm) var(--space-page-x)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
            }}
          >
            {/* Partner Logo Card */}
            <motion.div
              whileTap={{ scale: 0.98 }}
              style={{
                flex: 1,
                minHeight: '35vh',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-xl)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-border)',
              }}
            >
              {/* Logo */}
              <div style={{
                width: '100%',
                maxWidth: '200px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-lg)',
              }}>
                {partner.image ? (
                  <img
                    src={partner.image}
                    alt={t(`home.partners.${partner.id}.name`) || partner.id}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      filter: 'grayscale(100%)',
                      opacity: 0.8,
                      transition: 'all 0.3s ease',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: '600',
                    color: 'var(--color-text-muted)',
                  }}>
                    {(t(`home.partners.${partner.id}.name`) || partner.id).charAt(0)}
                  </div>
                )}
              </div>
              
              {/* Partner Name */}
              <h3 style={{
                fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                fontWeight: '500',
                color: 'var(--color-text-main)',
                margin: '0 0 8px',
                textAlign: 'center',
              }}>
                {t(`home.partners.${partner.id}.name`) || partner.id}
              </h3>
              
              {/* Partner Description */}
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-muted)',
                textAlign: 'center',
                lineHeight: 1.5,
                margin: 0,
                maxWidth: '280px',
              }}>
                {t(`home.partners.${partner.id}.desc`) || '合作伙伴'}
              </p>
            </motion.div>
            
            {/* Number Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono, monospace)',
                color: 'var(--color-text-muted)',
              }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'var(--color-border)',
              }} />
            </div>
          </div>
        ))}
      </div>
      
      {/* 底部区域：指示条 或 滑动提示 */}
      {activeIndex === partners.length - 1 ? (
        <SwipeToNextHint 
          label={t('common.swipeToContact') || '上滑联系我'} 
          isDark={false} 
          onSwipe={onNext} 
        />
      ) : (
        <SwipeIndicator
          activeIndex={activeIndex}
          total={partners.length}
          onScrollTo={scrollToPartner}
          isDark={false}
        />
      )}
    </div>
  );
};

/**
 * Contact 屏幕 - 内容完全居中
 */
const ContactScreen = ({ t, onBackToTop }) => {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 'var(--space-xl) var(--space-page-x)',
      textAlign: 'center',
    }}>
      {/* 主内容区域 - 垂直居中 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.8rem, 7vw, 2.5rem)',
            fontWeight: '400',
            color: '#fff',
            marginBottom: '16px',
            lineHeight: 1.2,
          }}
        >
          {t('home.ctaTitle')}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '32px',
            maxWidth: '300px',
            lineHeight: 1.5,
          }}
        >
          {t('home.ctaDesc')}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            maxWidth: '280px',
          }}
        >
          <a href="mailto:hello@example.com" style={{ textDecoration: 'none' }}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: '16px 32px',
                background: '#fff',
                color: '#000',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {t('home.emailMe')}
            </motion.button>
          </a>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '16px 32px',
              background: 'transparent',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            {t('home.wechatContact')}
          </motion.button>
        </motion.div>
      </div>
      
      {/* 底部回到顶部按钮 */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        onClick={onBackToTop}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '14px 24px',
          margin: '0 auto',
          background: 'rgba(255,255,255,0.08)',
          border: 'none',
          borderRadius: 'var(--radius-full)',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.8rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        <span style={{ fontSize: '1rem' }}>↑</span>
        {t('common.backToTop') || '回到顶部'}
      </motion.button>
    </div>
  );
};

export default MobileHome;

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScrollLock } from '../../contexts/ScrollLockContext';
import { useIsMobile } from '../../hooks/useMediaQuery';

/**
 * 滚动视差展示主组件 - Type C: Expandable Accordion (动态展开详情)
 * 
 * 布局逻辑：
 * - 桌面端：左侧固定 Sidebar (Sticky)，右侧滚动图片
 * - 移动端：顶部固定图片区 (40vh)，底部可滚动列表
 */
const ScrollParallaxShowcase = ({ projects, sectionTitle = "精选作品" }) => {
  const [activeId, setActiveId] = useState(projects[0]?.id);
  const { isScrollLocked } = useScrollLock();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const listContainerRef = useRef(null);

  const handleViewportEnter = (projectId) => {
    // 如果滚动被锁定，不更新 activeId
    if (isScrollLocked) return;
    setActiveId(projectId);
  };

  // 获取当前激活的项目
  const activeProject = projects.find(p => p.id === activeId) || projects[0];
  const activeIndex = projects.findIndex(p => p.id === activeId);
  
  // 移动端触摸滑动处理
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const sectionRef = useRef(null);
  const [isLocked, setIsLocked] = useState(false); // 是否锁定页面滚动
  const lastSwitchTime = useRef(0); // 防抖：上次切换时间

  // 切换到下一个/上一个项目
  const switchProject = (direction) => {
    const now = Date.now();
    // 防抖：300ms 内不重复切换
    if (now - lastSwitchTime.current < 300) return false;
    
    const currentIndex = projects.findIndex(p => p.id === activeId);
    let newIndex = currentIndex;
    
    if (direction === 'next' && currentIndex < projects.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      // 已经是第一个或最后一个，允许页面滚动
      return false;
    }
    
    if (newIndex !== currentIndex) {
      setActiveId(projects[newIndex].id);
      lastSwitchTime.current = now;
      return true; // 成功切换
    }
    return false;
  };

  // 触摸事件处理
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    // 只在组件可见区域内处理
    if (rect.top > window.innerHeight * 0.3 || rect.bottom < window.innerHeight * 0.7) {
      return; // 组件不在视口中心区域，不处理
    }
    
    touchEndY.current = e.touches[0].clientY;
    const deltaY = touchStartY.current - touchEndY.current;
    
    // 滑动超过 30px 触发切换
    if (Math.abs(deltaY) > 30) {
      const direction = deltaY > 0 ? 'next' : 'prev';
      const currentIndex = projects.findIndex(p => p.id === activeId);
      
      // 检查是否可以切换
      const canSwitch = (direction === 'next' && currentIndex < projects.length - 1) ||
                        (direction === 'prev' && currentIndex > 0);
      
      if (canSwitch) {
        e.preventDefault(); // 阻止页面滚动
        switchProject(direction);
        touchStartY.current = touchEndY.current; // 重置起点
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  // 鼠标滚轮处理（桌面端调试用）
  const handleWheel = (e) => {
    if (!isMobile) return;
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    // 组件在视口中心区域时处理
    if (rect.top <= 100 && rect.bottom >= window.innerHeight - 100) {
      const direction = e.deltaY > 0 ? 'next' : 'prev';
      const switched = switchProject(direction);
      if (switched) {
        e.preventDefault();
      }
    }
  };

  // 当滚动锁定解除时，检查并重置状态
  useEffect(() => {
    if (!isMobile || !sectionRef.current) return;
    if (isScrollLocked) return; // 锁定期间不处理
    
    // 锁定解除后，检查当前滚动位置
    const rect = sectionRef.current.getBoundingClientRect();
    
    // 如果页面在组件之前（已经回到顶部），重置为第一个项目
    if (rect.top > window.innerHeight * 0.5) {
      if (projects[0] && projects[0].id !== activeId) {
        setActiveId(projects[0].id);
      }
    }
  }, [isScrollLocked, isMobile, projects, activeId]);

  // 移动端滚动监听 - 根据滚动位置自动切换项目
  useEffect(() => {
    if (!isMobile || !sectionRef.current) return;
    
    const handleScroll = () => {
      if (!sectionRef.current) return;
      if (isScrollLocked) return; // 如果滚动被锁定（如点击回到顶部），不处理
      
      const rect = sectionRef.current.getBoundingClientRect();
      
      // 如果组件完全不在视口中
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        // 如果在视口上方，重置为第一个项目
        if (rect.top > window.innerHeight && projects[0] && projects[0].id !== activeId) {
          setActiveId(projects[0].id);
        }
        return;
      }
      
      // 计算组件顶部相对于文档的位置
      const sectionTop = window.scrollY + rect.top;
      const scrollProgress = window.scrollY - sectionTop;
      
      // 如果滚动进度为负（还没进入这个区块），显示第一个
      if (scrollProgress < 0) {
        if (projects[0] && projects[0].id !== activeId) {
          setActiveId(projects[0].id);
        }
        return;
      }
      
      const sectionHeight = sectionRef.current.offsetHeight;
      const itemHeight = sectionHeight / projects.length;
      
      // 计算当前应该显示第几个项目
      const rawIndex = Math.floor(scrollProgress / itemHeight);
      const clampedIndex = Math.max(0, Math.min(rawIndex, projects.length - 1));
      
      if (projects[clampedIndex] && projects[clampedIndex].id !== activeId) {
        setActiveId(projects[clampedIndex].id);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, projects, activeId, isScrollLocked]);

  // ==================== 移动端布局 - 横向滑动卡片 ====================
  if (isMobile) {
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showSwipeHint, setShowSwipeHint] = useState(true);
    
    // 滑动到指定项目
    const scrollToProject = (index) => {
      if (carouselRef.current) {
        const cardWidth = carouselRef.current.offsetWidth;
        carouselRef.current.scrollTo({
          left: index * cardWidth,
          behavior: 'smooth'
        });
      }
    };
    
    // 监听滚动位置更新当前项目
    useEffect(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;
      
      const handleScroll = () => {
        const cardWidth = carousel.offsetWidth;
        const scrollLeft = carousel.scrollLeft;
        const newIndex = Math.round(scrollLeft / cardWidth);
        const newActiveId = projects[newIndex]?.id;
        if (newActiveId && newActiveId !== activeId) {
          setActiveId(newActiveId);
        }
        // 用户滑动后隐藏提示
        if (showSwipeHint && scrollLeft > 20) {
          setShowSwipeHint(false);
        }
      };
      
      carousel.addEventListener('scroll', handleScroll, { passive: true });
      return () => carousel.removeEventListener('scroll', handleScroll);
    }, [projects, activeId, showSwipeHint]);
    
    // 3秒后自动隐藏滑动提示
    useEffect(() => {
      const timer = setTimeout(() => setShowSwipeHint(false), 3000);
      return () => clearTimeout(timer);
    }, []);
    
    return (
      <section
        ref={sectionRef}
        style={{
          minHeight: '100vh',
          background: 'var(--color-bg)',
          color: 'var(--color-text-main)',
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--space-lg) 0 var(--space-xl)',
        }}
      >
        {/* Section Title + Progress */}
        <div 
          style={{ 
            padding: '0 var(--space-page-x) var(--space-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            textTransform: 'uppercase', 
            letterSpacing: '2px',
            fontWeight: '500',
          }}>
            {sectionTitle}
          </span>
          {/* 进度指示 */}
          <span style={{
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono, monospace)',
            color: 'var(--color-text-main)',
            fontWeight: '600',
          }}>
            {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
        </div>
        
        {/* 进度条 */}
        <div style={{
          margin: '0 var(--space-page-x) var(--space-md)',
          height: '2px',
          background: 'var(--color-border)',
          borderRadius: '1px',
          overflow: 'hidden',
        }}>
          <motion.div
            animate={{ width: `${((activeIndex + 1) / projects.length) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'var(--color-text-main)',
              borderRadius: '1px',
            }}
          />
        </div>
        
        {/* 横向滑动卡片区 */}
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
            // 隐藏滚动条
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
                padding: '0 var(--space-page-x)',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-md)',
              }}
            >
              {/* 卡片图片区 */}
              <Link 
                to={`/work/the-case/${project.id}`}
                style={{ textDecoration: 'none', flex: 1, minHeight: 0 }}
              >
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '45vh',
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
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255,255,255,0.4)', 
                      fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', 
                      fontWeight: '600',
                      textAlign: 'center',
                      padding: '20px',
                      fontFamily: 'var(--font-serif)',
                    }}>
                      {project.title}
                    </div>
                  )}
                  
                  {/* 编号标签 */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '6px 12px',
                    background: 'rgba(0,0,0,0.7)',
                    borderRadius: '100px',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  {/* 查看按钮 */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '100px',
                    color: '#000',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                  }}>
                    {t('work.viewProject')} →
                  </div>
                </motion.div>
              </Link>
              
              {/* 卡片文字区 */}
              <div style={{ padding: '0 var(--space-xs)' }}>
                <h3 style={{
                  margin: '0 0 6px 0',
                  fontSize: 'clamp(1.2rem, 5vw, 1.5rem)',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: '500',
                  lineHeight: 1.2,
                  color: 'var(--color-text-main)',
                }}>
                  {project.title}
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.5,
                }}>
                  {project.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* 分页指示器 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          padding: 'var(--space-md) var(--space-page-x)',
        }}>
          {projects.map((p, index) => (
            <motion.button
              key={p.id}
              onClick={() => scrollToProject(index)}
              whileTap={{ scale: 0.8 }}
              style={{
                width: activeIndex === index ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                background: activeIndex === index 
                  ? 'var(--color-text-main)' 
                  : 'var(--color-border)',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
        
        {/* 横向滑动提示 - 首次显示 */}
        <AnimatePresence>
          {showSwipeHint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'fixed',
                bottom: '100px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'rgba(0,0,0,0.8)',
                borderRadius: '100px',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: '500',
                zIndex: 50,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              <motion.span
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                ← 
              </motion.span>
              {t('common.swipeToExplore') || '左右滑动浏览'}
              <motion.span
                animate={{ x: [0, -8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                 →
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 隐藏滚动条样式 */}
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </section>
    );
  }

  // ==================== 桌面端布局（原有逻辑）====================
  return (
    <section
      style={{
        display: 'flex',
        background: 'var(--color-bg)',
        color: 'var(--color-text-main)',
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      {/* Left Sidebar - Sticky Navigation & Details */}
      <div
        style={{
          width: 'clamp(300px, 35vw, 500px)',
          height: '100vh',
          position: 'sticky',
          top: 0,
          padding: 'clamp(40px, 6vh, 80px) clamp(30px, 4vw, 60px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRight: '1px solid var(--color-border)',
          background: 'var(--color-bg)',
          zIndex: 10,
        }}
      >
        {/* Section Title */}
        <div 
          style={{ 
            marginBottom: 'clamp(40px, 6vh, 60px)', 
            fontSize: '0.85rem', 
            color: 'var(--color-text-muted)', 
            textTransform: 'uppercase', 
            letterSpacing: '2px',
            fontWeight: '500'
          }}
        >
          {sectionTitle}
        </div>

        {/* Project List (Accordion) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {projects.map((p, index) => {
            const isActive = activeId === p.id;
            return (
              <motion.div
                key={p.id}
                animate={{
                  opacity: isActive ? 1 : 0.4,
                  marginBottom: isActive ? 30 : 10,
                }}
                style={{ 
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onClick={() => {
                  const element = document.getElementById(`project-${p.id}`);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {/* Title Row */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', marginBottom: '5px' }}>
                  <span 
                    style={{ 
                      fontSize: '0.9rem', 
                      fontFamily: 'var(--font-mono, monospace)', 
                      color: isActive ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                      fontWeight: '500'
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 
                    style={{ 
                      margin: 0, 
                      fontSize: isActive ? 'clamp(1.5rem, 2.5vw, 2rem)' : 'clamp(1.2rem, 2vw, 1.5rem)', 
                      fontFamily: 'var(--font-serif)',
                      fontWeight: isActive ? '600' : '400',
                      transition: 'font-size 0.3s ease',
                      lineHeight: 'var(--line-height-tight)',
                    }}
                  >
                    {p.title}
                  </h3>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ paddingTop: '15px', paddingLeft: '35px' }}>
                        {/* 两行 Subtitle */}
                        <p style={{ 
                          fontSize: 'clamp(0.9rem, 1.1vw, 1rem)', 
                          color: 'var(--color-text-secondary)', 
                          lineHeight: 'var(--line-height-base)', 
                          margin: '0 0 2px 0',
                          maxWidth: '90%'
                        }}>
                          {p.subtitle}
                        </p>
                        <p style={{ 
                          fontSize: 'clamp(0.9rem, 1.1vw, 1rem)', 
                          color: 'var(--color-text-secondary)', 
                          lineHeight: 'var(--line-height-base)', 
                          margin: '0 0 25px 0',
                          maxWidth: '90%'
                        }}>
                          {p.subtitle2}
                        </p>

                        {/* View Case Button */}
                        <Link 
                          to={`/work/the-case/${p.id}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <motion.div
                            whileHover={{ x: 5 }}
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '8px',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              color: 'var(--color-text-main)',
                              borderBottom: '1px solid var(--color-text-main)',
                              paddingBottom: '2px'
                            }}
                          >
                            {t('common.viewMore')} <span style={{ fontSize: '1.1rem' }}>→</span>
                          </motion.div>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Right Content - Scrollable Images */}
      <div style={{ flex: 1, background: 'var(--color-bg-subtle)' }}>
        {projects.map((project) => (
          <motion.div
            key={project.id}
            id={`project-${project.id}`}
            onViewportEnter={() => handleViewportEnter(project.id)}
            viewport={{ margin: "-45% 0px -45% 0px" }} // 视口中间 10% 区域触发
            style={{
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(40px, 8vw, 100px)',
              boxSizing: 'border-box',
            }}
          >
            <Link 
              to={`/work/the-case/${project.id}`}
              style={{ 
                width: '100%', 
                height: '100%', 
                display: 'block',
                textDecoration: 'none'
              }}
            >
              <motion.div
                whileHover={{ scale: 0.98 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: '100%',
                  height: '100%',
                  background: project.cover || '#eee',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {/* Image or Placeholder */}
                {project.coverImage ? (
                  <img 
                    src={project.coverImage} 
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div style={{ 
                    color: 'rgba(255,255,255,0.2)', 
                    fontSize: 'clamp(2rem, 5vw, 4rem)', 
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {project.title}
                  </div>
                )}

                {/* Hover Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <div style={{
                    padding: '15px 30px',
                    background: '#fff',
                    borderRadius: '100px',
                    color: '#000',
                    fontWeight: '600',
                    fontSize: '1rem',
                  }}>
                    {t('work.viewProject')}
                  </div>
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ScrollParallaxShowcase;
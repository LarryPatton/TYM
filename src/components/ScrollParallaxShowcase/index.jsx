import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScrollLock } from '../../contexts/ScrollLockContext';

/**
 * 滚动视差展示主组件 - Type C: Expandable Accordion (动态展开详情)
 * 
 * 布局逻辑：
 * - 左侧固定 Sidebar (Sticky)：展示项目列表，当前项目自动展开显示详情。
 * - 右侧滚动 Content：展示大图，随着页面滚动切换。
 */
const ScrollParallaxShowcase = ({ projects, sectionTitle = "精选作品" }) => {
  const [activeId, setActiveId] = useState(projects[0]?.id);
  const { isScrollLocked } = useScrollLock();
  const { t } = useTranslation();

  const handleViewportEnter = (projectId) => {
    // 如果滚动被锁定，不更新 activeId
    if (isScrollLocked) return;
    setActiveId(projectId);
  };

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
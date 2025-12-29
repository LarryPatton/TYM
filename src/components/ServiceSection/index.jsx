import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useScrollLock } from '../../contexts/ScrollLockContext';

/**
 * 服务区域主组件 - Scroll Triggered Interactive List Design
 */
const ServiceSection = ({ 
  services, 
  title = "SERVICE",
  sectionLabel = "专业能力",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const { isScrollLocked, targetSection } = useScrollLock();

  // 当导航到 services section 时，重置 activeIndex 为 0
  useEffect(() => {
    if (isScrollLocked && targetSection === 'services') {
      setActiveIndex(0);
    }
  }, [isScrollLocked, targetSection]);

  const handleViewportEnter = (index) => {
    // 如果滚动被锁定，不更新 activeIndex
    if (isScrollLocked) return;
    setActiveIndex(index);
  };

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        background: '#111', // Dark background
        color: '#fff',
        padding: '50px 0',
        overflow: 'hidden',
      }}
    >
      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 clamp(20px, 5vw, 40px)', scrollSnapType: 'y mandatory' }}>
        
        {/* Interactive List */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {services.map((service, index) => {
            const isActive = activeIndex === index;
            // Default colors if not provided
            const accentColor = service.color || ['#FF5733', '#33FF57', '#3357FF', '#F333FF'][index % 4];
            
            return (
              <motion.div
                key={service.id || index}
                onViewportEnter={() => handleViewportEnter(index)}
                viewport={{ margin: "-45% 0px -45% 0px" }} // 调整视口触发区域，使其更窄，需要滚动到更中间才触发
                initial={{ opacity: 0.3 }}
                animate={{ opacity: isActive ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
                style={{
                  borderTop: '1px solid #333',
                  borderBottom: index === services.length - 1 ? '1px solid #333' : 'none',
                  padding: '100px 0', // 增加高度，减缓切换频率
                  cursor: 'default',
                  position: 'relative',
                  background: 'transparent',
                  transition: 'background 0.3s ease',
                  scrollSnapAlign: 'center'
                }}
              >
                {/* Active Indicator Line */}
                <motion.div 
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: isActive ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '-30px',
                    width: '2px',
                    height: '100%',
                    background: '#fff', // Monochrome: White indicator
                    transformOrigin: 'top'
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                  {/* Left: ID & Title */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '30px' }}>
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', color: isActive ? '#fff' : '#666', fontSize: '1.2rem', transition: 'color 0.3s' }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 style={{ 
                      fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', 
                      margin: 0, 
                      fontWeight: '400',
                      color: isActive ? '#fff' : '#aaa',
                      transition: 'color 0.3s',
                      fontFamily: 'var(--font-sans)',
                      lineHeight: 'var(--line-height-tight)',
                    }}
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* Right: Arrow Icon */}
                  <motion.div
                    animate={{ rotate: isActive ? 45 : 0, color: isActive ? '#fff' : '#666' }}
                    style={{ fontSize: '2rem' }}
                  >
                    ↗
                  </motion.div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ paddingTop: '30px', paddingLeft: 'clamp(0px, 5vw, 60px)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '30px' }}>
                        
                        {/* Description & Tags */}
                        <div style={{ maxWidth: '600px' }}>
                          {/* 问题描述 */}
                          {service.problem && (
                            <p style={{ fontSize: '1rem', color: '#999', lineHeight: 'var(--line-height-base)', marginBottom: '8px' }}>
                              {service.problem}
                            </p>
                          )}
                          {/* 服务描述 */}
                          <p style={{ fontSize: '1rem', color: '#999', lineHeight: 'var(--line-height-base)', marginBottom: '20px' }}>
                            {service.desc}
                          </p>
                          {service.tags && (
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              {service.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  style={{ 
                                    padding: '6px 14px', 
                                    border: '1px solid #444', 
                                    borderRadius: 'var(--radius-full)', 
                                    fontSize: '0.85rem', 
                                    color: '#ccc' 
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* CTA Button */}
                        <button style={{
                          padding: '12px 30px',
                          background: '#fff',
                          color: '#000',
                          border: 'none',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                          View Projects
                        </button>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
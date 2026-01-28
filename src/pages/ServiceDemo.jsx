import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// Mock Data
const services = [
  {
    id: '01',
    title: 'Product Design',
    desc: '从用户研究到交互设计、视觉设计的全链路产品设计服务，打造卓越用户体验。',
    tags: ['UI/UX', 'Prototyping', 'Design Systems', 'User Research'],
    color: '#FF5733'
  },
  {
    id: '02',
    title: 'Development',
    desc: '基于 React/Vue 的现代前端开发，动效实现，响应式设计与性能优化。',
    tags: ['React', 'Next.js', 'WebGL', 'Creative Coding'],
    color: '#33FF57'
  },
  {
    id: '03',
    title: 'Brand Strategy',
    desc: '用户研究、竞品分析、产品策略规划，数据驱动的设计决策支持。',
    tags: ['Brand Identity', 'Market Analysis', 'Positioning'],
    color: '#3357FF'
  },
  {
    id: '04',
    title: 'Motion Design',
    desc: '为界面注入生命力的动效设计规范，提升交互反馈与品牌质感。',
    tags: ['Lottie', 'After Effects', 'Interaction', 'Micro-interactions'],
    color: '#F333FF'
  }
];

const ServiceDemo = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Parallax for background text
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        minHeight: '100vh', 
        background: '#111', 
        color: '#fff', 
        position: 'relative', 
        overflow: 'hidden',
        padding: '100px 0'
      }}
    >
      {/* Background Text with Mix Blend Mode */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '10%', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          pointerEvents: 'none',
          zIndex: 0,
          width: '100%',
          textAlign: 'center'
        }}
      >
        <motion.h1 
          style={{ 
            fontSize: 'clamp(5rem, 20vw, 20rem)', 
            fontWeight: '900', 
            margin: 0, 
            color: '#fff', 
            opacity: 0.1,
            y,
            lineHeight: 0.8
          }}
        >
          SERVICES
        </motion.h1>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 20px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '80px', textAlign: 'center' }}>
          <p style={{ color: '#888', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.9rem' }}>What I Do</p>
          <h2 style={{ fontSize: '3rem', margin: '20px 0' }}>专业能力与服务</h2>
        </div>

        {/* Interactive List */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {services.map((service, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <motion.div
                key={service.id}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  borderTop: '1px solid #333',
                  borderBottom: index === services.length - 1 ? '1px solid #333' : 'none',
                  padding: '40px 0',
                  cursor: 'pointer',
                  position: 'relative',
                  background: isHovered ? 'rgba(255,255,255,0.03)' : 'transparent',
                  transition: 'background 0.3s ease'
                }}
              >
                {/* Hover Background Reveal (Optional: Color Accent) */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: service.color,
                    originY: 0
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                  {/* Left: ID & Title */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '30px' }}>
                    <span style={{ fontFamily: 'monospace', color: isHovered ? service.color : '#666', fontSize: '1.2rem', transition: 'color 0.3s' }}>
                      {service.id}
                    </span>
                    <h3 style={{ 
                      fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
                      margin: 0, 
                      fontWeight: '400',
                      color: isHovered ? '#fff' : '#aaa',
                      transition: 'color 0.3s'
                    }}>
                      {service.title}
                    </h3>
                  </div>

                  {/* Right: Arrow Icon */}
                  <motion.div
                    animate={{ rotate: isHovered ? 45 : 0, color: isHovered ? service.color : '#666' }}
                    style={{ fontSize: '2rem' }}
                  >
                    ↗
                  </motion.div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ paddingTop: '30px', paddingLeft: 'clamp(0px, 5vw, 60px)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '30px' }}>
                        
                        {/* Description & Tags */}
                        <div style={{ maxWidth: '600px' }}>
                          <p style={{ fontSize: '1.1rem', color: '#999', lineHeight: 1.6, marginBottom: '20px' }}>
                            {service.desc}
                          </p>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {service.tags.map(tag => (
                              <span 
                                key={tag} 
                                style={{ 
                                  padding: '6px 14px', 
                                  border: '1px solid #444', 
                                  borderRadius: '100px', 
                                  fontSize: '0.85rem', 
                                  color: '#ccc' 
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button style={{
                          padding: '12px 30px',
                          background: '#fff',
                          color: '#000',
                          border: 'none',
                          borderRadius: '100px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}>
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
      
      {/* Footer Spacer */}
      <div style={{ height: '200px' }} />
    </div>
  );
};

export default ServiceDemo;

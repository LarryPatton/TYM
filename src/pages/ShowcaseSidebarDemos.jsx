import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Mock Data
const projects = [
  { 
    id: '01', 
    title: 'Brand Identity', 
    subtitle: 'Chapter 01', 
    desc: '从品牌战略到视觉表达的完整识别系统。', 
    tags: ['Strategy', 'Visual', 'System'],
    cover: '#2a2a3e' 
  },
  { 
    id: '02', 
    title: 'UI System', 
    subtitle: 'Chapter 02', 
    desc: '建立跨平台的数字视觉语言与组件库。', 
    tags: ['UI/UX', 'Components', 'React'],
    cover: '#1e3a5f' 
  },
  { 
    id: '03', 
    title: 'Product CMF', 
    subtitle: 'Chapter 03', 
    desc: '将数字美学转化为实体产品的材质与工艺。', 
    tags: ['Industrial', 'Material', 'Texture'],
    cover: '#3d2e1e' 
  },
  { 
    id: '04', 
    title: 'Motion Design', 
    subtitle: 'Chapter 04', 
    desc: '为界面注入生命力的动效设计规范。', 
    tags: ['Animation', 'Interaction', 'Lottie'],
    cover: '#2e3d2e' 
  },
  { 
    id: '05', 
    title: 'Data Viz', 
    subtitle: 'Chapter 05', 
    desc: '将复杂数据转化为直观可理解的视觉叙事。', 
    tags: ['D3.js', 'Dashboard', 'Analytics'],
    cover: '#3e2e3d' 
  },
];

// --- Type A: Editorial Index (极简排版目录) ---
const TypeA = () => {
  const [activeId, setActiveId] = useState(projects[0].id);

  return (
    <div style={{ display: 'flex', background: '#f9f9f9', color: '#111' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '350px', 
        height: '100vh', 
        position: 'sticky', 
        top: 0, 
        padding: '80px 40px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        borderRight: '1px solid #eee'
      }}>
        <div style={{ marginBottom: '40px', fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', letterSpacing: '2px' }}>Index</div>
        {projects.map(p => {
          const isActive = activeId === p.id;
          return (
            <motion.div 
              key={p.id}
              animate={{ 
                x: isActive ? 20 : 0,
                opacity: isActive ? 1 : 0.4,
              }}
              style={{ 
                padding: '15px 0', 
                cursor: 'pointer', 
                display: 'flex',
                alignItems: 'baseline',
                gap: '15px'
              }}
            >
              <span style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{p.id}</span>
              <span style={{ 
                fontSize: isActive ? '2rem' : '1.5rem', 
                fontFamily: isActive ? 'serif' : 'sans-serif',
                fontWeight: isActive ? '400' : '300',
                transition: 'all 0.3s ease'
              }}>
                {p.title}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {projects.map((project) => (
          <motion.div 
            key={project.id} 
            onViewportEnter={() => setActiveId(project.id)}
            viewport={{ margin: "-40% 0px -40% 0px" }}
            style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #eee' }}
          >
            <div style={{ width: '80%', height: '70%', background: project.cover, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff' }}>
              <h2 style={{ fontSize: '4rem', fontFamily: 'serif' }}>{project.title}</h2>
              <p style={{ opacity: 0.7 }}>{project.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Type B: Timeline Tracker (进度时间轴) ---
const TypeB = () => {
  const [activeId, setActiveId] = useState(projects[0].id);

  return (
    <div style={{ display: 'flex', background: '#111', color: '#fff' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '200px', 
        height: '100vh', 
        position: 'sticky', 
        top: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', height: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Vertical Line */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: '#333', transform: 'translateX(-50%)' }} />
          
          {projects.map(p => {
            const isActive = activeId === p.id;
            return (
              <div key={p.id} style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
                <motion.div 
                  animate={{ 
                    scale: isActive ? 1.5 : 1,
                    backgroundColor: isActive ? '#fff' : '#333',
                    borderColor: isActive ? 'rgba(255,255,255,0.3)' : 'transparent'
                  }}
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    border: '4px solid transparent',
                    cursor: 'pointer'
                  }}
                />
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 30 }}
                      exit={{ opacity: 0, x: 20 }}
                      style={{ position: 'absolute', left: '0', whiteSpace: 'nowrap', fontSize: '0.9rem', fontWeight: 'bold' }}
                    >
                      {p.id} — {p.title}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {projects.map((project) => (
          <motion.div 
            key={project.id} 
            onViewportEnter={() => setActiveId(project.id)}
            viewport={{ margin: "-40% 0px -40% 0px" }}
            style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div style={{ width: '85%', height: '80%', background: project.cover, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)', fontSize: '5rem', fontWeight: 'bold' }}>
              {project.id}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Type C: Expandable Accordion (动态展开详情) ---
const TypeC = () => {
  const [activeId, setActiveId] = useState(projects[0].id);

  return (
    <div style={{ display: 'flex', background: '#fff', color: '#000' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '400px', 
        height: '100vh', 
        position: 'sticky', 
        top: 0, 
        padding: '60px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        borderRight: '1px solid #eee'
      }}>
        {projects.map(p => {
          const isActive = activeId === p.id;
          return (
            <motion.div 
              key={p.id}
              animate={{ 
                opacity: isActive ? 1 : 0.3,
                marginBottom: isActive ? 40 : 20
              }}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{p.id}</span>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{p.title}</h3>
              </div>
              
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ paddingTop: '10px' }}>
                      <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.6, margin: '0 0 15px 0' }}>{p.desc}</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {p.tags.map(tag => (
                          <span key={tag} style={{ fontSize: '0.75rem', padding: '4px 10px', background: '#f0f0f0', borderRadius: '100px', color: '#555' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {projects.map((project) => (
          <motion.div 
            key={project.id} 
            onViewportEnter={() => setActiveId(project.id)}
            viewport={{ margin: "-40% 0px -40% 0px" }}
            style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div style={{ width: '100%', height: '100%', background: project.cover, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <h2 style={{ fontSize: '3rem' }}>{project.title} Visuals</h2>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Type D: Floating Capsule (悬浮胶囊导航) ---
const TypeD = () => {
  const [activeId, setActiveId] = useState(projects[0].id);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ background: '#000', color: '#fff', position: 'relative' }}>
      {/* Floating Nav */}
      <motion.div 
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{ 
          width: isHovered ? '280px' : '60px',
          height: isHovered ? 'auto' : 'auto'
        }}
        style={{ 
          position: 'fixed', 
          left: '40px', 
          bottom: '40px', 
          background: 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          padding: '20px 10px',
          zIndex: 100,
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}
      >
        {projects.map(p => {
          const isActive = activeId === p.id;
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', height: '30px', paddingLeft: '10px', cursor: 'pointer' }}>
              <motion.div 
                animate={{ 
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.3)'
                }}
                style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 }} 
              />
              <motion.span 
                animate={{ 
                  opacity: isHovered || isActive ? 1 : 0,
                  x: isHovered || isActive ? 15 : -10
                }}
                style={{ 
                  whiteSpace: 'nowrap', 
                  fontSize: '0.9rem', 
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isActive ? '#fff' : '#aaa'
                }}
              >
                {p.title}
              </motion.span>
            </div>
          );
        })}
      </motion.div>

      {/* Content */}
      <div>
        {projects.map((project) => (
          <motion.div 
            key={project.id} 
            onViewportEnter={() => setActiveId(project.id)}
            viewport={{ margin: "-40% 0px -40% 0px" }}
            style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
          >
            <div style={{ position: 'absolute', inset: 0, background: project.cover, opacity: 0.4 }} />
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <span style={{ display: 'block', marginBottom: '20px', letterSpacing: '4px', textTransform: 'uppercase' }}>{project.subtitle}</span>
              <h2 style={{ fontSize: '5rem', margin: 0 }}>{project.title}</h2>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ShowcaseSidebarDemos = () => {
  const [currentType, setCurrentType] = useState('A');

  const types = [
    { id: 'A', name: 'Type A: Editorial Index', component: TypeA },
    { id: 'B', name: 'Type B: Timeline Tracker', component: TypeB },
    { id: 'C', name: 'Type C: Expandable Accordion', component: TypeC },
    { id: 'D', name: 'Type D: Floating Capsule', component: TypeD },
  ];

  const CurrentComponent = types.find(t => t.id === currentType)?.component || TypeA;

  return (
    <div>
      {/* Control Panel */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        background: 'rgba(0,0,0,0.8)',
        padding: '20px',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        color: '#fff',
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem' }}>Sidebar Variations</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {types.map(t => (
            <button
              key={t.id}
              onClick={() => {
                setCurrentType(t.id);
                window.scrollTo(0, 0);
              }}
              style={{
                padding: '8px 16px',
                background: currentType === t.id ? '#fff' : 'transparent',
                color: currentType === t.id ? '#000' : '#aaa',
                border: '1px solid #444',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <CurrentComponent />
    </div>
  );
};

export default ShowcaseSidebarDemos;

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Mock Data
const projects = [
  { id: '01', title: '品牌视觉识别', subtitle: 'Chapter 01', desc: '从品牌战略到视觉表达的完整识别系统。', cover: '#2a2a3e' },
  { id: '02', title: 'UI 视觉规范', subtitle: 'Chapter 02', desc: '建立跨平台的数字视觉语言与组件库。', cover: '#1e3a5f' },
  { id: '03', title: '产品 CMF 定义', subtitle: 'Chapter 03', desc: '将数字美学转化为实体产品的材质与工艺。', cover: '#3d2e1e' },
  { id: '04', title: '动效设计系统', subtitle: 'Chapter 04', desc: '为界面注入生命力的动效设计规范。', cover: '#2e3d2e' },
];

// --- Scheme 1: Classic Split (左右分屏) ---
const Scheme1 = () => {
  return (
    <div style={{ background: '#0a0a0a' }}>
      {projects.map((project, i) => (
        <div key={i} style={{ height: '100vh', display: 'flex', position: 'sticky', top: 0, background: '#0a0a0a', borderBottom: '1px solid #222' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', color: '#fff' }}>
            <span style={{ color: '#666', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>{project.subtitle}</span>
            <h2 style={{ fontSize: '4rem', margin: '0 0 30px 0', fontFamily: 'serif' }}>{project.title}</h2>
            <p style={{ color: '#999', fontSize: '1.2rem', lineHeight: 1.6 }}>{project.desc}</p>
          </div>
          <div style={{ flex: 1, background: project.cover, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)', fontSize: '3rem', fontWeight: 'bold' }}>
            IMAGE AREA
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Scheme 2: Overlapping Layers (交错层叠) ---
const Scheme2Item = ({ project }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  
  return (
    <div ref={ref} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: '70%', height: '70%', background: project.cover, position: 'absolute', left: '10%', top: '15%' }} />
      <motion.div style={{ position: 'absolute', right: '15%', bottom: '20%', background: '#fff', padding: '60px', width: '400px', y }}>
        <span style={{ display: 'block', color: '#999', marginBottom: '10px' }}>{project.subtitle}</span>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 20px 0', color: '#000' }}>{project.title}</h2>
        <p style={{ color: '#444', lineHeight: 1.6 }}>{project.desc}</p>
      </motion.div>
    </div>
  );
};
const Scheme2 = () => <div style={{ background: '#111' }}>{projects.map((p, i) => <Scheme2Item key={i} project={p} />)}</div>;

// --- Scheme 3: Magazine Style (杂志排版) ---
const Scheme3 = () => {
  return (
    <div style={{ background: '#f5f5f5', padding: '100px 0' }}>
      {projects.map((project, i) => (
        <div key={i} style={{ maxWidth: '1200px', margin: '0 auto 200px', position: 'relative' }}>
          <div style={{ height: '600px', background: project.cover, marginBottom: '-100px', width: '80%', marginLeft: 'auto' }} />
          <h2 style={{ fontSize: '8rem', position: 'relative', zIndex: 1, mixBlendMode: 'difference', color: '#fff', margin: 0, lineHeight: 0.8 }}>{project.title}</h2>
          <div style={{ display: 'flex', gap: '40px', marginTop: '60px', paddingLeft: '5%' }}>
            <div style={{ width: '200px', borderTop: '2px solid #000', paddingTop: '20px' }}>{project.subtitle}</div>
            <div style={{ width: '400px', fontSize: '1.2rem', lineHeight: 1.6 }}>{project.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Scheme 4: Immersive Fullscreen (全屏沉浸) ---
const Scheme4Item = ({ project }) => {
  return (
    <div style={{ height: '100vh', width: '100%', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: project.cover, color: '#fff' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', padding: '0 20px' }}>
        <h2 style={{ fontSize: '5rem', marginBottom: '30px', textShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>{project.title}</h2>
        <p style={{ fontSize: '1.5rem', opacity: 0.8 }}>{project.desc}</p>
      </div>
    </div>
  );
};
const Scheme4 = () => <div>{projects.map((p, i) => <Scheme4Item key={i} project={p} />)}</div>;

// --- Scheme 5: Asymmetric Grid (非对称网格) ---
const Scheme5 = () => {
  return (
    <div style={{ background: '#fff', padding: '100px 40px' }}>
      {projects.map((project, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px', marginBottom: '200px', alignItems: 'center' }}>
          <div style={{ gridColumn: i % 2 === 0 ? '1 / 6' : '7 / 13', fontSize: '4rem', fontWeight: 'bold', lineHeight: 1.1 }}>
            {project.title}
          </div>
          <div style={{ gridColumn: i % 2 === 0 ? '7 / 12' : '2 / 6', height: '500px', background: project.cover }} />
          <div style={{ gridColumn: i % 2 === 0 ? '2 / 5' : '8 / 11', marginTop: '40px' }}>
            <div style={{ borderTop: '1px solid #000', paddingTop: '20px', marginBottom: '10px' }}>{project.subtitle}</div>
            <p>{project.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Scheme 6: Minimalist Card (极简卡片) ---
const Scheme6Item = ({ project }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div style={{ width: '500px', background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', scale, opacity }}>
        <div style={{ height: '300px', background: project.cover }} />
        <div style={{ padding: '40px' }}>
          <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '10px' }}>{project.subtitle}</div>
          <h3 style={{ fontSize: '2rem', margin: '0 0 15px 0' }}>{project.title}</h3>
          <p style={{ color: '#555' }}>{project.desc}</p>
        </div>
      </motion.div>
    </div>
  );
};
const Scheme6 = () => <div style={{ background: '#f0f0f0' }}>{projects.map((p, i) => <Scheme6Item key={i} project={p} />)}</div>;

// --- Scheme 7: Diagonal / Z-Pattern (对角线) ---
const Scheme7 = () => {
  return (
    <div style={{ background: '#1a1a1a', color: '#fff', overflow: 'hidden' }}>
      {projects.map((project, i) => (
        <div key={i} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '100px', position: 'relative' }}>
          <h2 style={{ fontSize: '6rem', alignSelf: 'flex-start', marginBottom: '40px' }}>{project.title}</h2>
          <div style={{ width: '60%', height: '400px', background: project.cover, alignSelf: 'center', transform: 'rotate(-5deg)', border: '10px solid rgba(255,255,255,0.1)' }} />
          <div style={{ alignSelf: 'flex-end', maxWidth: '400px', marginTop: '40px', textAlign: 'right' }}>
            <div style={{ color: '#666', marginBottom: '10px' }}>{project.subtitle}</div>
            <p style={{ fontSize: '1.2rem' }}>{project.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Scheme 8: Typography Driven (文字主导) ---
const Scheme8 = () => {
  return (
    <div style={{ background: '#fff' }}>
      {projects.map((project, i) => (
        <div key={i} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <h2 style={{ fontSize: '15vw', lineHeight: 0.8, textAlign: 'center', color: '#000', margin: 0, position: 'relative', zIndex: 2, mixBlendMode: 'multiply' }}>
            {project.title.split('').map((char, idx) => <span key={idx} style={{ display: 'inline-block' }}>{char}</span>)}
          </h2>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '30vw', height: '30vw', borderRadius: '50%', background: project.cover, zIndex: 1 }} />
          <div style={{ position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
            <p>{project.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Scheme 9: Sidebar / Sticky (侧边导航) ---
const Scheme9 = () => {
  const [activeId, setActiveId] = useState(projects[0].id);
  
  return (
    <div style={{ display: 'flex', background: '#111', color: '#fff' }}>
      <div style={{ width: '300px', height: '100vh', position: 'sticky', top: 0, padding: '60px 40px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {projects.map(p => (
          <div key={p.id} style={{ padding: '15px 0', color: activeId === p.id ? '#fff' : '#444', cursor: 'pointer', fontSize: '1.2rem', transition: 'color 0.3s' }}>
            {p.id} {p.title}
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        {projects.map((project, i) => (
          <motion.div 
            key={i} 
            onViewportEnter={() => setActiveId(project.id)}
            style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #222' }}
          >
            <div style={{ width: '80%', height: '70%', background: project.cover, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h2>{project.title}</h2>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Scheme 10: Gallery Slider (画廊幻灯片) ---
const Scheme10 = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  return (
    <div ref={containerRef} style={{ height: '400vh', background: '#000' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <motion.div style={{ display: 'flex', gap: '100px', paddingLeft: '100px', x }}>
          {projects.map((project, i) => (
            <div key={i} style={{ width: '80vw', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div style={{ height: '60vh', background: project.cover, borderRadius: '20px' }} />
              <div>
                <h2 style={{ color: '#fff', fontSize: '3rem', margin: 0 }}>{project.title}</h2>
                <p style={{ color: '#888', fontSize: '1.2rem' }}>{project.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const ShowcaseDemos = () => {
  const [currentScheme, setCurrentScheme] = useState(1);

  const schemes = [
    { id: 1, name: 'Classic Split', component: Scheme1 },
    { id: 2, name: 'Overlapping Layers', component: Scheme2 },
    { id: 3, name: 'Magazine Style', component: Scheme3 },
    { id: 4, name: 'Immersive Fullscreen', component: Scheme4 },
    { id: 5, name: 'Asymmetric Grid', component: Scheme5 },
    { id: 6, name: 'Minimalist Card', component: Scheme6 },
    { id: 7, name: 'Diagonal / Z-Pattern', component: Scheme7 },
    { id: 8, name: 'Typography Driven', component: Scheme8 },
    { id: 9, name: 'Sidebar / Sticky', component: Scheme9 },
    { id: 10, name: 'Gallery Slider', component: Scheme10 },
  ];

  const CurrentComponent = schemes.find(s => s.id === currentScheme)?.component || Scheme1;

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
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem' }}>Select Layout Scheme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {schemes.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentScheme(s.id);
                window.scrollTo(0, 0);
              }}
              style={{
                padding: '8px 16px',
                background: currentScheme === s.id ? '#fff' : 'transparent',
                color: currentScheme === s.id ? '#000' : '#aaa',
                border: '1px solid #444',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}
            >
              {s.id}. {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Demo Area */}
      <CurrentComponent />
      
      {/* Footer Spacer */}
      <div style={{ height: '50vh', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
        End of Demo
      </div>
    </div>
  );
};

export default ShowcaseDemos;

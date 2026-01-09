import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

// Mock Data
const projects = [
  { id: '01', title: '品牌视觉识别', subtitle: 'Chapter 01', desc: '从品牌战略到视觉表达的完整识别系统。', cover: '#2a2a3e' },
  { id: '02', title: 'UI 视觉规范', subtitle: 'Chapter 02', desc: '建立跨平台的数字视觉语言与组件库。', cover: '#1e3a5f' },
  { id: '03', title: '产品 CMF 定义', subtitle: 'Chapter 03', desc: '将数字美学转化为实体产品的材质与工艺。', cover: '#3d2e1e' },
  { id: '04', title: '动效设计系统', subtitle: 'Chapter 04', desc: '为界面注入生命力的动效设计规范。', cover: '#2e3d2e' },
];

// Scheme Metadata
const schemesMeta = [
  { id: 1, name: 'Classic Split', nameCn: '左右分屏' },
  { id: 2, name: 'Overlapping Layers', nameCn: '交错层叠' },
  { id: 3, name: 'Magazine Style', nameCn: '杂志排版' },
  { id: 4, name: 'Immersive Fullscreen', nameCn: '全屏沉浸' },
  { id: 5, name: 'Asymmetric Grid', nameCn: '非对称网格' },
  { id: 6, name: 'Minimalist Card', nameCn: '极简卡片' },
  { id: 7, name: 'Diagonal / Z-Pattern', nameCn: '对角线' },
  { id: 8, name: 'Typography Driven', nameCn: '文字主导' },
  { id: 9, name: 'Sidebar / Sticky', nameCn: '侧边导航' },
  { id: 10, name: 'Gallery Slider', nameCn: '画廊幻灯片' },
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
  const [activeId, setActiveId] = React.useState(projects[0].id);
  
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

// 方案映射
const schemeComponents = {
  1: Scheme1,
  2: Scheme2,
  3: Scheme3,
  4: Scheme4,
  5: Scheme5,
  6: Scheme6,
  7: Scheme7,
  8: Scheme8,
  9: Scheme9,
  10: Scheme10,
};

const SchemeDetail = () => {
  const { schemeId } = useParams();
  const id = parseInt(schemeId, 10);
  const schemeMeta = schemesMeta.find(s => s.id === id);
  const SchemeComponent = schemeComponents[id];

  // 计算上一个和下一个方案
  const prevId = id > 1 ? id - 1 : 10;
  const nextId = id < 10 ? id + 1 : 1;
  const prevMeta = schemesMeta.find(s => s.id === prevId);
  const nextMeta = schemesMeta.find(s => s.id === nextId);

  if (!SchemeComponent || !schemeMeta) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>方案不存在</h1>
          <Link to="/showcase-demos" style={{ color: '#888', textDecoration: 'underline' }}>返回目录</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 顶部导航栏 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(10px)',
        padding: '15px 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #333'
      }}>
        <Link 
          to="/showcase-demos" 
          style={{ 
            color: '#888', 
            textDecoration: 'none',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← 返回目录
        </Link>
        
        <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>
          {id}. {schemeMeta.name}
          <span style={{ color: '#666', marginLeft: '10px', fontWeight: 'normal' }}>({schemeMeta.nameCn})</span>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <Link 
            to={`/showcase-demos/${prevId}`} 
            style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}
          >
            ← {prevMeta.name}
          </Link>
          <Link 
            to={`/showcase-demos/${nextId}`} 
            style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}
          >
            {nextMeta.name} →
          </Link>
        </div>
      </div>

      {/* 方案内容 */}
      <div style={{ paddingTop: '60px' }}>
        <SchemeComponent />
      </div>
      
      {/* Footer */}
      <div style={{ 
        height: '30vh', 
        background: '#111', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ color: '#555' }}>— End of Demo —</div>
        <div style={{ display: 'flex', gap: '30px' }}>
          <Link 
            to={`/showcase-demos/${prevId}`} 
            style={{ 
              color: '#888', 
              textDecoration: 'none',
              padding: '10px 20px',
              border: '1px solid #333',
              borderRadius: '6px'
            }}
          >
            ← {prevMeta.name}
          </Link>
          <Link 
            to="/showcase-demos" 
            style={{ 
              color: '#fff', 
              textDecoration: 'none',
              padding: '10px 20px',
              background: '#333',
              borderRadius: '6px'
            }}
          >
            返回目录
          </Link>
          <Link 
            to={`/showcase-demos/${nextId}`} 
            style={{ 
              color: '#888', 
              textDecoration: 'none',
              padding: '10px 20px',
              border: '1px solid #333',
              borderRadius: '6px'
            }}
          >
            {nextMeta.name} →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetail;

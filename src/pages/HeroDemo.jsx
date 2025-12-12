import React from 'react';
import { motion } from 'framer-motion';

// --- 方案 1: 全屏沉浸式 (Full Screen Immersive) ---
// 特点：视觉冲击力最强，文字叠加在图片上，适合展示高质量渲染图
const HeroVariant1 = () => (
  <div style={{ position: 'relative', height: '90vh', background: '#333', color: '#fff', overflow: 'hidden' }}>
    {/* 模拟背景图 */}
    <div style={{ position: 'absolute', inset: 0, opacity: 0.6, background: 'linear-gradient(45deg, #222, #444)' }}></div>
    
    <div style={{ position: 'absolute', bottom: '80px', left: '60px', maxWidth: '800px' }}>
      <motion.h1 initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} style={{ fontSize: '5em', margin: 0, lineHeight: 1 }}>
        Project Title 01
      </motion.h1>
      <p style={{ fontSize: '1.5em', opacity: 0.8, marginTop: '20px' }}>
        Immersive full-screen experience. Best for high-quality visuals.
      </p>
      <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
        {['Character', 'Environment', 'UI'].map(tag => (
          <span key={tag} style={{ padding: '8px 20px', border: '1px solid #fff', borderRadius: '30px', fontSize: '0.9em' }}>{tag}</span>
        ))}
      </div>
    </div>
  </div>
);

// --- 方案 2: 左右分屏式 (Split Screen) ---
// 特点：左文右图，信息层级清晰，现代且专业
const HeroVariant2 = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '70vh', background: '#fff' }}>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px' }}>
      <div style={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#999', marginBottom: '20px' }}>Project Detail</div>
      <h1 style={{ fontSize: '4em', margin: '0 0 30px 0', color: '#000', lineHeight: 1.1 }}>
        Project<br/>Title 02
      </h1>
      <p style={{ fontSize: '1.2em', color: '#666', lineHeight: 1.6, maxWidth: '500px' }}>
        A clean split layout. Separates visual content from textual information for better readability.
      </p>
      <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
        <button style={{ padding: '12px 30px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px' }}>View Assets</button>
      </div>
    </div>
    <div style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '2em' }}>
      [ Hero Image ]
    </div>
  </div>
);

// --- 方案 3: 极简大字版 (Minimal Typography) ---
// 特点：无背景图干扰，纯粹靠排版支撑，极度干净，适合“性冷淡”风
const HeroVariant3 = () => (
  <div style={{ padding: '120px 60px 60px 60px', background: '#fff', minHeight: '50vh' }}>
    <div style={{ borderBottom: '1px solid #000', paddingBottom: '40px', marginBottom: '40px' }}>
      <h1 style={{ fontSize: '7em', margin: 0, lineHeight: 0.9, letterSpacing: '-3px', color: '#000' }}>
        PROJECT<br/>TITLE 03.
      </h1>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ width: '40%', fontSize: '1.5em', lineHeight: 1.4 }}>
        A typography-driven approach. Bold, direct, and uncluttered.
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {['Category A', 'Category B', 'Category C'].map(tag => (
          <button key={tag} style={{ padding: '10px 20px', background: '#f5f5f5', border: 'none', borderRadius: '0', fontSize: '0.9em' }}>{tag}</button>
        ))}
      </div>
    </div>
  </div>
);

// --- 方案 4: 悬浮卡片式 (Floating Card) ---
// 特点：背景模糊或纹理，内容收纳在卡片中，有层次感
const HeroVariant4 = () => (
  <div style={{ padding: '80px 40px', background: '#e0e0e0', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ 
      width: '100%', maxWidth: '1200px', background: '#111', color: '#fff', 
      borderRadius: '24px', padding: '80px', 
      boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
    }}>
      <div style={{ width: '80px', height: '80px', background: '#333', borderRadius: '50%', marginBottom: '30px' }}></div>
      <h1 style={{ fontSize: '3.5em', margin: '0 0 20px 0' }}>Project Title 04</h1>
      <p style={{ fontSize: '1.2em', color: '#aaa', maxWidth: '600px', marginBottom: '40px' }}>
        Content contained within a floating card. Creates depth and focus.
      </p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[1, 2, 3, 4].map(i => (
          <span key={i} style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>Section {i}</span>
        ))}
      </div>
    </div>
  </div>
);

// --- 方案 5: 杂志拼贴式 (Magazine Collage) ---
// 特点：右侧多图拼贴，展示丰富细节，左侧标题，时尚感强
const HeroVariant5 = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', height: '70vh', background: '#fff', overflow: 'hidden' }}>
    <div style={{ padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '4em', margin: '0 0 20px 0', lineHeight: 1 }}>Project<br/>Title 05</h1>
      <p style={{ color: '#666' }}>A collage style layout to showcase multiple assets at once.</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '10px', padding: '20px' }}>
      <div style={{ background: '#eee', borderRadius: '12px' }}></div>
      <div style={{ background: '#e5e5e5', borderRadius: '12px', gridRow: 'span 2' }}></div>
      <div style={{ background: '#ddd', borderRadius: '12px' }}></div>
    </div>
  </div>
);

// --- 方案 6: 底部大图 + 顶部标题 (Top Heavy) ---
// 特点：标题在最上方，图片在下方撑满，类似 Apple 官网风格
const HeroVariant6 = () => (
  <div style={{ background: '#fff', paddingTop: '80px', textAlign: 'center' }}>
    <div style={{ maxWidth: '800px', margin: '0 auto 60px auto' }}>
      <h1 style={{ fontSize: '4.5em', margin: '0 0 20px 0', letterSpacing: '-1px' }}>Project Title 06</h1>
      <p style={{ fontSize: '1.3em', color: '#666' }}>
        Apple-style layout. Title first, followed by a massive hero image.
      </p>
      <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <a href="#" style={{ color: '#000', fontWeight: 'bold' }}>Overview</a>
        <a href="#" style={{ color: '#999' }}>Specs</a>
        <a href="#" style={{ color: '#999' }}>Gallery</a>
      </div>
    </div>
    <div style={{ 
      height: '60vh', 
      background: '#f0f0f0', 
      margin: '0 40px', 
      borderRadius: '24px 24px 0 0',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '2em'
    }}>
      [ Massive Hero Image ]
    </div>
  </div>
);

const HeroDemo = () => {
  return (
    <div style={{ background: '#fff' }}>
      <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
        <h2>Hero Section Variants</h2>
        <p>请浏览以下 6 种方案，选择最适合的一种。</p>
      </div>

      <div style={{ borderBottom: '10px solid #eee' }}>
        <div style={{ padding: '10px', background: '#000', color: '#fff', fontSize: '0.8em' }}>方案 1: 全屏沉浸式</div>
        <HeroVariant1 />
      </div>

      <div style={{ borderBottom: '10px solid #eee' }}>
        <div style={{ padding: '10px', background: '#000', color: '#fff', fontSize: '0.8em' }}>方案 2: 左右分屏式</div>
        <HeroVariant2 />
      </div>

      <div style={{ borderBottom: '10px solid #eee' }}>
        <div style={{ padding: '10px', background: '#000', color: '#fff', fontSize: '0.8em' }}>方案 3: 极简大字版</div>
        <HeroVariant3 />
      </div>

      <div style={{ borderBottom: '10px solid #eee' }}>
        <div style={{ padding: '10px', background: '#000', color: '#fff', fontSize: '0.8em' }}>方案 4: 悬浮卡片式</div>
        <HeroVariant4 />
      </div>

      <div style={{ borderBottom: '10px solid #eee' }}>
        <div style={{ padding: '10px', background: '#000', color: '#fff', fontSize: '0.8em' }}>方案 5: 杂志拼贴式</div>
        <HeroVariant5 />
      </div>

      <div style={{ borderBottom: '10px solid #eee' }}>
        <div style={{ padding: '10px', background: '#000', color: '#fff', fontSize: '0.8em' }}>方案 6: 顶部标题 + 底部大图</div>
        <HeroVariant6 />
      </div>
    </div>
  );
};

export default HeroDemo;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * WorkPreview - /work 页面沉浸式布局方案预览
 */
const WorkPreview = () => {
  const [activeLayout, setActiveLayout] = useState('F');

  // 文案数据
  const content = {
    caseStudy: {
      label: '深度案例研究',
      title: 'Brand Building Practice',
      desc: '记录品牌在不同阶段中的设计决策与系统演进，关注设计如何在变化中保持一致性与判断力。',
      tags: ['Brand Strategy', 'System Thinking', 'Iteration', 'Application'],
      cta: '查看完整案例'
    },
    gallery: {
      label: '艺术画廊',
      modules: {
        form: {
          title: '造型 Form',
          quote: '"纸笔摩擦中的灵光乍现"',
          cta: '进入造型'
        },
        photo: {
          title: '摄影 Photo',
          quote: '"定格记忆的时光标本"',
          cta: '进入摄影'
        }
      }
    }
  };

  // 布局方案
  const layouts = [
    { id: 'F', name: '全屏卡片', desc: '主卡片占满视口' },
    { id: 'G', name: '无边框极简', desc: '去除所有边框' },
    { id: 'H', name: '大图背景', desc: '图片为主视觉' },
    { id: 'I', name: '滚动视差', desc: '层叠滚动效果' },
    { id: 'J', name: '暗色沉浸', desc: '深色背景氛围' },
  ];

  // 方案 F：全屏卡片
  const LayoutF = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {/* 主卡片 - 接近全屏 */}
      <motion.div
        whileHover={{ backgroundColor: 'var(--color-bg-alt)' }}
        style={{
          minHeight: '70vh',
          padding: 'clamp(60px, 10vw, 120px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'var(--color-bg)',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '800px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: '24px', letterSpacing: '0.1em' }}>
            {content.caseStudy.label}
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '400', marginBottom: '32px', lineHeight: 1.1 }}>
            {content.caseStudy.title}
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '40px', maxWidth: '600px' }}>
            {content.caseStudy.desc}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '50px' }}>
            {content.caseStudy.tags.map(tag => (
              <span key={tag} style={{ padding: '8px 20px', border: '1px solid var(--color-border)', borderRadius: '100px', fontSize: '0.9rem' }}>{tag}</span>
            ))}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {content.caseStudy.cta} <span style={{ fontSize: '1.5rem' }}>→</span>
          </div>
        </div>
      </motion.div>

      {/* 画廊区域 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {[content.gallery.modules.form, content.gallery.modules.photo].map((mod, i) => (
          <motion.div
            key={i}
            whileHover={{ backgroundColor: 'var(--color-bg-alt)' }}
            style={{
              minHeight: '40vh',
              padding: 'clamp(40px, 6vw, 80px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'var(--color-bg)',
              cursor: 'pointer',
              borderRight: i === 0 ? '1px solid var(--color-border)' : 'none'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '400', marginBottom: '16px' }}>{mod.title}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: '30px' }}>{mod.quote}</p>
            <div style={{ fontSize: '1rem', fontWeight: '500' }}>{mod.cta} →</div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // 方案 G：无边框极简
  const LayoutG = () => (
    <div style={{ padding: 'clamp(60px, 10vw, 120px)', maxWidth: '1000px', margin: '0 auto' }}>
      {/* 主区域 */}
      <motion.div whileHover={{ x: 10 }} style={{ cursor: 'pointer', marginBottom: '100px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '20px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>01</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: '400', marginBottom: '30px', lineHeight: 1.05 }}>
          {content.caseStudy.title}
        </h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', lineHeight: 1.8, maxWidth: '500px' }}>
          {content.caseStudy.desc}
        </p>
      </motion.div>

      {/* 分隔 */}
      <div style={{ height: '1px', background: 'var(--color-border)', marginBottom: '60px' }} />

      {/* 画廊 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
        {[content.gallery.modules.form, content.gallery.modules.photo].map((mod, i) => (
          <motion.div key={i} whileHover={{ x: 10 }} style={{ cursor: 'pointer' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '16px', letterSpacing: '0.15em' }}>0{i + 2}</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '400', marginBottom: '12px' }}>{mod.title}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{mod.quote}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // 方案 H：大图背景（模拟）
  const LayoutH = () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* 主卡片带背景图占位 */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.5 }}
        style={{
          minHeight: '80vh',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: '#fff',
          padding: 'clamp(60px, 10vw, 120px)',
          display: 'flex',
          alignItems: 'flex-end',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '20px', letterSpacing: '0.1em' }}>{content.caseStudy.label}</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '400', marginBottom: '24px', lineHeight: 1.1 }}>
            {content.caseStudy.title}
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, lineHeight: 1.7, marginBottom: '30px' }}>{content.caseStudy.desc}</p>
          <div style={{ fontSize: '1rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px' }}>{content.caseStudy.cta} →</div>
        </div>
      </motion.div>

      {/* 画廊 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {[
          { ...content.gallery.modules.form, bg: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)' },
          { ...content.gallery.modules.photo, bg: 'linear-gradient(135deg, #434343 0%, #000000 100%)' }
        ].map((mod, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            style={{
              minHeight: '35vh',
              background: mod.bg,
              color: '#fff',
              padding: 'clamp(40px, 6vw, 80px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              cursor: 'pointer'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '400', marginBottom: '12px' }}>{mod.title}</h3>
            <p style={{ fontSize: '0.95rem', opacity: 0.7, fontStyle: 'italic' }}>{mod.quote}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // 方案 I：滚动视差（静态预览）
  const LayoutI = () => (
    <div style={{ position: 'relative' }}>
      {/* 主卡片固定感 */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(40px, 8vw, 100px)',
        background: 'var(--color-bg)'
      }}>
        <motion.div whileHover={{ scale: 1.02 }} style={{ textAlign: 'center', maxWidth: '900px', cursor: 'pointer' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: '30px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {content.caseStudy.label}
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: '400', marginBottom: '40px', lineHeight: 1.05 }}>
            {content.caseStudy.title}
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto 50px' }}>
            {content.caseStudy.desc}
          </p>
          <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{content.caseStudy.cta} →</div>
        </motion.div>
      </div>

      {/* 画廊叠加感 */}
      <div style={{ display: 'flex' }}>
        {[content.gallery.modules.form, content.gallery.modules.photo].map((mod, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -20 }}
            style={{
              flex: 1,
              minHeight: '50vh',
              padding: 'clamp(50px, 8vw, 100px)',
              background: i === 0 ? 'var(--color-bg-alt)' : 'var(--color-bg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: i === 0 ? '10px 0 40px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '400', marginBottom: '16px' }}>{mod.title}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{mod.quote}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // 方案 J：暗色沉浸
  const LayoutJ = () => (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      {/* 主区域 */}
      <motion.div
        whileHover={{ backgroundColor: '#111' }}
        style={{
          minHeight: '75vh',
          padding: 'clamp(80px, 12vw, 150px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          cursor: 'pointer',
          borderBottom: '1px solid #222'
        }}
      >
        <div style={{ maxWidth: '900px' }}>
          <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '30px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {content.caseStudy.label}
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: '300', marginBottom: '40px', lineHeight: 1.08 }}>
            {content.caseStudy.title}
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#888', lineHeight: 1.8, maxWidth: '550px', marginBottom: '50px' }}>
            {content.caseStudy.desc}
          </p>
          <div style={{ fontSize: '1rem', fontWeight: '400', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {content.caseStudy.cta} <span style={{ fontSize: '1.3rem' }}>→</span>
          </div>
        </div>
      </motion.div>

      {/* 画廊 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {[content.gallery.modules.form, content.gallery.modules.photo].map((mod, i) => (
          <motion.div
            key={i}
            whileHover={{ backgroundColor: '#111' }}
            style={{
              minHeight: '40vh',
              padding: 'clamp(50px, 8vw, 100px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRight: i === 0 ? '1px solid #222' : 'none'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '300', marginBottom: '16px' }}>{mod.title}</h3>
            <p style={{ fontSize: '1rem', color: '#666', fontStyle: 'italic' }}>{mod.quote}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderLayout = () => {
    switch (activeLayout) {
      case 'F': return <LayoutF />;
      case 'G': return <LayoutG />;
      case 'H': return <LayoutH />;
      case 'I': return <LayoutI />;
      case 'J': return <LayoutJ />;
      default: return <LayoutF />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-subtle)' }}>
      {/* 顶部控制栏 */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        padding: '16px clamp(20px, 4vw, 60px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <Link to="/work" style={{ textDecoration: 'none', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          ← 返回 /work
        </Link>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {layouts.map(layout => (
            <button
              key={layout.id}
              onClick={() => setActiveLayout(layout.id)}
              style={{
                padding: '8px 16px',
                background: activeLayout === layout.id ? 'var(--color-primary)' : 'transparent',
                color: activeLayout === layout.id ? 'var(--color-text-inverse)' : 'var(--color-text-main)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {layout.name}
            </button>
          ))}
        </div>

        <div style={{ padding: '6px 12px', background: 'var(--color-accent)', color: '#fff', borderRadius: '100px', fontSize: '0.75rem' }}>
          沉浸式预览
        </div>
      </div>

      {/* 布局预览 */}
      <motion.div
        key={activeLayout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {renderLayout()}
      </motion.div>

      {/* 底部提示 */}
      <div style={{
        padding: '40px',
        textAlign: 'center',
        background: 'var(--color-bg)',
        borderTop: '1px solid var(--color-border)'
      }}>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
          选好后告诉我方案（F / G / H / I / J），我会立即应用
        </p>
      </div>
    </div>
  );
};

export default WorkPreview;
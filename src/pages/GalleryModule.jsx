import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTitle } from '../hooks/useTitle';
import { Link, useParams } from 'react-router-dom';

const GalleryModule = () => {
  const { module } = useParams();
  const isForm = module === 'form';
  
  useTitle(isForm ? '造型 Form' : '摄影 Photo');

  const moduleData = isForm ? {
    title: '造型 Form',
    subtitle: '“纸笔摩擦中的灵光乍现”',
    submodules: [
      { id: 'new-china-painter', title: '新国画人' },
      { id: 'mixed-media', title: '综合材料' },
      { id: 'illustration-story', title: '插画故事' },
      { id: 'stylized-board', title: '风格化板绘' }
    ]
  } : {
    title: '摄影 Photo',
    subtitle: '“定格记忆的时光标本”',
    submodules: [
      { id: 'product', title: '产品摄影' },
      { id: 'landscape', title: '风景摄影' }
    ]
  };

  // Mock Works Data
  const works = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    title: `作品标题 ${i + 1}`,
    submodule: moduleData.submodules[i % moduleData.submodules.length].title,
    year: '2023',
    cover: isForm ? '#f0f0f0' : '#e5e5e5'
  }));

  return (
    <div className="noise-bg" style={{ minHeight: '100vh', padding: '80px 40px' }}>
      
      {/* Header / Breadcrumb */}
      <div style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/gallery" style={{ textDecoration: 'none', color: '#666', fontSize: '0.9em', fontWeight: '500' }}>← 返回画廊首页</Link>
      </div>

      {/* Module Hero */}
      <section style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '4em', fontWeight: '400', marginBottom: '20px' }}>{moduleData.title}</h1>
        <p style={{ fontSize: '1.4em', color: '#666', fontStyle: 'italic' }}>{moduleData.subtitle}</p>
      </section>

      {/* Submodule Navigation */}
      <section style={{ marginBottom: '80px', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
        {moduleData.submodules.map(sub => (
          <Link key={sub.id} to={`/gallery/${module}/${sub.id}`} style={{ textDecoration: 'none' }}>
            <button className="pill-button">
              {sub.title}
            </button>
          </Link>
        ))}
      </section>

      {/* Filter & Sort (Simplified) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <div style={{ fontSize: '0.9em', color: '#999' }}>全部作品 ({works.length})</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <select style={{ padding: '8px', borderRadius: '8px', border: '1px solid #eee', background: 'transparent' }}>
            <option>最新发布</option>
            <option>精选推荐</option>
          </select>
        </div>
      </div>

      {/* Works Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isForm ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'repeat(auto-fill, minmax(400px, 1fr))', 
        gap: '40px' 
      }}>
        {works.map(work => (
          <Link key={work.id} to={`/gallery/${module}/all/${work.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <motion.div 
              whileHover={{ y: -5 }}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ 
                aspectRatio: isForm ? '3/4' : '4/3', 
                background: work.cover, 
                borderRadius: '8px', 
                marginBottom: '15px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#ccc'
              }}>
                [ 作品图 ]
              </div>
              <h3 style={{ fontSize: '1.1em', fontWeight: '500', margin: '0 0 5px 0' }}>{work.title}</h3>
              <div style={{ fontSize: '0.9em', color: '#999' }}>{work.submodule} • {work.year}</div>
            </motion.div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default GalleryModule;
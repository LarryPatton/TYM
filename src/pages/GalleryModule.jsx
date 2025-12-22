import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { Link, useParams } from 'react-router-dom';

const GalleryModule = () => {
  const { t } = useTranslation();
  const { module } = useParams();
  const isForm = module === 'form';
  const moduleKey = isForm ? 'form' : 'photo';
  
  useTitle(t(`gallery.modules.${moduleKey}.title`));

  const submoduleIds = isForm 
    ? ['new-china-painter', 'mixed-media', 'illustration-story', 'stylized-board']
    : ['product', 'landscape'];

  const moduleData = {
    title: t(`gallery.modules.${moduleKey}.title`),
    subtitle: t(`gallery.modules.${moduleKey}.quote`),
    submodules: submoduleIds.map(id => ({
      id,
      title: t(`gallery.submodules.${id}.title`)
    }))
  };

  // Mock Works Data
  const works = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    title: t('gallery.workTitle', { num: i + 1 }),
    submodule: moduleData.submodules[i % moduleData.submodules.length].title,
    year: '2023',
    cover: isForm ? '#f0f0f0' : '#e5e5e5'
  }));

  return (
    <div className="noise-bg" style={{ minHeight: '100vh', padding: '80px 40px' }}>
      
      {/* Header / Breadcrumb */}
      <div style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/gallery" style={{ textDecoration: 'none', color: '#666', fontSize: '0.9em', fontWeight: '500' }}>{t('gallery.backToGallery')}</Link>
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
        <div style={{ fontSize: '0.9em', color: '#999' }}>{t('gallery.allWorks')} ({works.length})</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <select style={{ padding: '8px', borderRadius: '8px', border: '1px solid #eee', background: 'transparent' }}>
            <option>{t('gallery.latestRelease')}</option>
            <option>{t('gallery.featuredRecommend')}</option>
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
                {t('gallery.workImage')}
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
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { Link, useParams } from 'react-router-dom';

const GallerySubmodule = () => {
  const { t } = useTranslation();
  const { module, submodule } = useParams();
  const isForm = module === 'form';
  const moduleKey = isForm ? 'form' : 'photo';
  
  // Submodule Data from translations
  const submoduleKey = submodule || 'unknown';
  const submoduleData = {
    title: t(`gallery.submodules.${submoduleKey}.title`),
    desc: t(`gallery.submodules.${submoduleKey}.desc`)
  };

  useTitle(`${submoduleData.title} - ${t(`gallery.modules.${moduleKey}.titleShort`)}`);

  const siblings = isForm 
    ? ['new-china-painter', 'mixed-media', 'illustration-story', 'stylized-board']
    : ['product', 'landscape'];

  const getSiblingTitle = (id) => t(`gallery.submodules.${id}.title`);

  // Mock Works
  const works = Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    title: `${submoduleData.title} ${t('gallery.work')} ${i + 1}`,
    year: '2023',
    cover: isForm ? '#f0f0f0' : '#e5e5e5'
  }));

  return (
    <div className="noise-bg" style={{ minHeight: '100vh', padding: '80px 40px' }}>
      
      {/* Breadcrumb */}
      <div style={{ marginBottom: '60px', fontSize: '0.9em', color: '#999' }}>
        <Link to="/gallery" style={{ textDecoration: 'none', color: '#999' }}>{t('gallery.title')}</Link>
        <span style={{ margin: '0 10px' }}>/</span>
        <Link to={`/gallery/${module}`} style={{ textDecoration: 'none', color: '#999' }}>{t(`gallery.modules.${moduleKey}.titleShort`)}</Link>
        <span style={{ margin: '0 10px' }}>/</span>
        <span style={{ color: '#111', fontWeight: '500' }}>{submoduleData.title}</span>
      </div>

      {/* Submodule Hero */}
      <section style={{ marginBottom: '60px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3em', fontWeight: '400', marginBottom: '15px' }}>{submoduleData.title}</h1>
        <p style={{ fontSize: '1.2em', color: '#666', maxWidth: '600px' }}>{submoduleData.desc}</p>
      </section>

      {/* Sibling Tabs */}
      <section style={{ marginBottom: '60px', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: '30px', overflowX: 'auto', paddingBottom: '15px' }}>
          {siblings.map(sib => (
            <Link key={sib} to={`/gallery/${module}/${sib}`} style={{ textDecoration: 'none' }}>
              <div style={{ 
                color: sib === submodule ? '#111' : '#999', 
                fontWeight: sib === submodule ? '600' : '400',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                position: 'relative'
              }}>
                {getSiblingTitle(sib)}
                {sib === submodule && (
                  <motion.div 
                    layoutId="underline"
                    style={{ position: 'absolute', bottom: '-16px', left: 0, right: 0, height: '2px', background: '#111' }} 
                  />
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Works Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '40px' 
      }}>
        {works.map(work => (
          <Link key={work.id} to={`/gallery/${module}/${submodule}/${work.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <motion.div 
              whileHover={{ y: -5 }}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ 
                aspectRatio: '1/1', 
                background: work.cover, 
                borderRadius: '8px', 
                marginBottom: '15px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#ccc'
              }}>
                {t('gallery.workImage')}
              </div>
              <h3 style={{ fontSize: '1.1em', fontWeight: '500', margin: '0 0 5px 0' }}>{work.title}</h3>
              <div style={{ fontSize: '0.9em', color: '#999' }}>{work.year}</div>
            </motion.div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default GallerySubmodule;
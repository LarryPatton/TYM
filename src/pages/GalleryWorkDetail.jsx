import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { Link, useParams } from 'react-router-dom';

const GalleryWorkDetail = () => {
  const { t } = useTranslation();
  const { module, submodule, slug } = useParams();
  const isForm = module === 'form';
  const moduleKey = isForm ? 'form' : 'photo';
  
  useTitle(`${t('gallery.workDetail')} - ${slug}`);

  const submoduleTitle = t(`gallery.submodules.${submodule}.title`);

  return (
    <div className="noise-bg" style={{ minHeight: '100vh', padding: '80px 40px' }}>
      
      {/* Breadcrumb & Nav */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.9em', color: '#999' }}>
          <Link to="/gallery" style={{ textDecoration: 'none', color: '#999' }}>{t('gallery.title')}</Link>
          <span style={{ margin: '0 10px' }}>/</span>
          <Link to={`/gallery/${module}`} style={{ textDecoration: 'none', color: '#999' }}>{t(`gallery.modules.${moduleKey}.titleShort`)}</Link>
          <span style={{ margin: '0 10px' }}>/</span>
          <Link to={`/gallery/${module}/${submodule}`} style={{ textDecoration: 'none', color: '#999' }}>{submoduleTitle}</Link>
          <span style={{ margin: '0 10px' }}>/</span>
          <span style={{ color: '#111', fontWeight: '500' }}>{t('gallery.work')} {slug}</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ padding: '8px 15px', border: '1px solid #eee', background: 'transparent', borderRadius: '8px', cursor: 'pointer' }}>{t('gallery.previous')}</button>
          <button style={{ padding: '8px 15px', border: '1px solid #eee', background: 'transparent', borderRadius: '8px', cursor: 'pointer' }}>{t('gallery.next')}</button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '60px', marginBottom: '120px' }}>
        
        {/* Left: Visuals */}
        <div>
          <div style={{ width: '100%', aspectRatio: '16/9', background: '#f0f0f0', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
            {t('gallery.mainVisual')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ aspectRatio: '1/1', background: '#f9f9f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eee' }}>
                {t('gallery.detail', { num: i })}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5em', fontWeight: '400', marginBottom: '20px', lineHeight: '1.1' }}>{t('gallery.workTitle', { num: slug })}</h1>
          
          <div style={{ marginBottom: '30px', fontSize: '0.95em', color: '#666', lineHeight: '1.8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span>{t('gallery.year')}</span>
              <span style={{ color: '#111' }}>2023</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span>{t('gallery.medium')}</span>
              <span style={{ color: '#111' }}>{isForm ? t('gallery.digitalPainting') : t('gallery.digitalPhotography')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span>{t('gallery.size')}</span>
              <span style={{ color: '#111' }}>Variable</span>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <p style={{ color: '#444', lineHeight: '1.6' }}>
              {t('gallery.workDesc')}
            </p>
          </div>

          {/* Capability Tags (New Component) */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ fontSize: '0.8em', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              {t('gallery.capabilityTags')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['#造型探索', '#构图实验', '#色彩语言', '#KV潜力', '#品牌延展'].map(tag => (
                <span key={tag} style={{ 
                  fontSize: '0.85em', 
                  color: '#111', 
                  background: '#fff', 
                  border: '1px solid #eee', 
                  padding: '4px 10px', 
                  borderRadius: '4px' 
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['#标签1', '#标签2', '#标签3'].map(tag => (
              <span key={tag} style={{ fontSize: '0.85em', color: '#999' }}>{tag}</span>
            ))}
          </div>
        </div>

      </div>

      {/* Related Works */}
      <section style={{ borderTop: '1px solid #eee', paddingTop: '60px' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2em', fontWeight: '400', marginBottom: '40px' }}>{t('gallery.relatedWorks')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ aspectRatio: '1/1', background: '#f9f9f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
              {t('gallery.related', { num: i })}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default GalleryWorkDetail;
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { Link } from 'react-router-dom';

const GalleryHome = () => {
  const { t } = useTranslation();
  useTitle(t('gallery.title'));

  return (
    <div className="noise-bg" style={{ minHeight: '100vh', padding: 'var(--space-4xl) var(--space-2xl)' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: 'var(--space-section)' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-display)', fontWeight: '400', marginBottom: 'var(--space-lg)', lineHeight: 'var(--line-height-tight)' }}>{t('gallery.title')}</h1>
        <p style={{ fontSize: 'var(--text-body-lg)', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 'var(--line-height-base)' }}>
          {t('gallery.subtitle')}
        </p>
      </section>

      {/* Module Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-xl)', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Form Module */}
        <Link to="/gallery/form" style={{ textDecoration: 'none', color: 'inherit' }}>
          <motion.div 
            whileHover={{ y: -10, boxShadow: 'var(--shadow-hover)' }}
            style={{ 
              background: 'var(--color-bg)', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ padding: 'var(--space-xl)', flex: 1 }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 'var(--space-sm)' }}>{t('gallery.modules.form.label')}</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)', marginBottom: 'var(--space-sm)', lineHeight: 'var(--line-height-tight)' }}>{t('gallery.modules.form.title')}</h2>
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: 'var(--space-lg)' }}>{t('gallery.modules.form.quote')}</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
                {t('gallery.modules.form.tags', { returnObjects: true }).map(tag => (
                  <span key={tag} style={{ padding: '6px 12px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{tag}</span>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-sm)' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ aspectRatio: '1/1', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}></div>
                ))}
              </div>
            </div>
            <div style={{ padding: 'var(--space-lg) var(--space-xl)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-subtle)' }}>
              <span style={{ fontWeight: '500', fontSize: 'var(--text-sm)' }}>{t('gallery.modules.form.enter')}</span>
              <span>→</span>
            </div>
          </motion.div>
        </Link>

        {/* Photo Module */}
        <Link to="/gallery/photo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <motion.div 
            whileHover={{ y: -10, boxShadow: 'var(--shadow-hover)' }}
            style={{ 
              background: 'var(--color-bg)', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ padding: 'var(--space-xl)', flex: 1 }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 'var(--space-sm)' }}>{t('gallery.modules.photo.label')}</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)', marginBottom: 'var(--space-sm)', lineHeight: 'var(--line-height-tight)' }}>{t('gallery.modules.photo.title')}</h2>
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: 'var(--space-lg)' }}>{t('gallery.modules.photo.quote')}</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
                {t('gallery.modules.photo.tags', { returnObjects: true }).map(tag => (
                  <span key={tag} style={{ padding: '6px 12px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{tag}</span>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-sm)' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ aspectRatio: '1/1', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}></div>
                ))}
              </div>
            </div>
            <div style={{ padding: 'var(--space-lg) var(--space-xl)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-subtle)' }}>
              <span style={{ fontWeight: '500', fontSize: 'var(--text-sm)' }}>{t('gallery.modules.photo.enter')}</span>
              <span>→</span>
            </div>
          </motion.div>
        </Link>

      </div>
    </div>
  );
};

export default GalleryHome;
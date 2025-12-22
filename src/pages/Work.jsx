import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { Link } from 'react-router-dom';

const Work = () => {
  const { t } = useTranslation();
  useTitle(t('work.pageTitle'));

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      style={{ 
        minHeight: '100vh', 
        padding: 'clamp(60px, 8vh, 100px) clamp(40px, 8vw, 120px)',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-bg-subtle)', // 与首页 Hero 背景一致
      }}
    >
      {/* 背景装饰元素 - 复用首页风格 */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: 'clamp(300px, 40vw, 800px)',
        height: 'clamp(300px, 40vw, 800px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 0, 0, 0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* 标题区域 */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', marginBottom: '80px', position: 'relative', zIndex: 1 }}>
        <motion.h1 
          variants={fadeInUp}
          style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: 'clamp(3rem, 10vw, 7rem)', 
            fontWeight: '400', 
            marginBottom: '20px', 
            letterSpacing: '-0.03em',
            color: 'var(--color-text-main)',
            lineHeight: 1.1
          }}
        >
          {t('work.title')}
        </motion.h1>
        <motion.p 
          variants={fadeInUp}
          style={{ 
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', 
            color: 'var(--color-text-muted)', 
            maxWidth: '600px',
            lineHeight: '1.6'
          }}
        >
          {t('work.subtitle')}<br/>
          {t('work.subtitle2')}
        </motion.p>
      </div>

      {/* Main Layout: 2 Columns */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
        gap: '40px', 
        maxWidth: '1400px', 
        margin: '0 auto',
        alignItems: 'start',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Left Column: Featured Case Study (Dominant) */}
        <Link to="/work/the-case" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -10, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.3 }}
            style={{ 
              background: 'var(--color-bg)', 
              padding: 'clamp(30px, 5vw, 60px)', 
              borderRadius: '24px', 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid var(--color-border)',
              position: 'relative',
              overflow: 'hidden',
              boxSizing: 'border-box',
              minHeight: '500px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top right, var(--color-bg-alt) 0%, transparent 60%)', opacity: 0.6 }}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                fontSize: '0.85rem', 
                fontWeight: '600', 
                color: 'var(--color-text-light)', 
                textTransform: 'uppercase', 
                letterSpacing: '2px', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--color-primary)', borderRadius: '50%' }}></span>
                {t('work.featuredCaseStudy')}
              </div>
              <h2 style={{ 
                fontFamily: 'var(--font-serif)', 
                fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
                fontWeight: '400', 
                marginBottom: '30px', 
                lineHeight: 1.1 
              }}>
                {t('work.featured.title')}
              </h2>
              <p style={{ 
                fontSize: '1.1rem', 
                color: 'var(--color-text-muted)', 
                lineHeight: 1.6, 
                maxWidth: '450px',
                marginBottom: '40px'
              }}>
                {t('work.featured.desc')}
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['Strategy', 'UI/UX', 'Branding'].map(tag => (
                  <span key={tag} style={{ 
                    padding: '6px 16px', 
                    border: '1px solid var(--color-border)', 
                    borderRadius: '100px', 
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ 
              marginTop: '60px', 
              fontWeight: '500', 
              fontSize: '1.1rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              color: 'var(--color-text-main)'
            }}>
              {t('work.viewFullCase')} <span style={{ transition: 'transform 0.3s', display: 'inline-block' }} className="arrow">→</span>
            </div>
          </motion.div>
        </Link>

        {/* Right Column: Gallery Modules */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '30px',
        }}>
          
          <motion.div variants={fadeInUp} style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '2px', paddingLeft: '10px' }}>
            {t('work.artGallery')}
          </motion.div>

          {/* Form Module Card */}
          <Link to="/gallery/form" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6, boxShadow: '0 15px 30px -5px rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.3 }}
              style={{ 
                background: 'var(--color-bg)', 
                padding: '40px', 
                borderRadius: '20px', 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--color-border)',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box',
                minHeight: '280px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>{t('work.modules.form.label')}</div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: '400', marginBottom: '15px', lineHeight: 1.2 }}>{t('work.modules.form.title')}</h2>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>{t('work.modules.form.quote')}</p>
              </div>
              <div style={{ marginTop: '30px', fontWeight: '500', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-main)' }}>
                {t('work.modules.form.enter')} <span style={{ fontSize: '1.1em' }}>→</span>
              </div>
            </motion.div>
          </Link>

          {/* Photo Module Card */}
          <Link to="/gallery/photo" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6, boxShadow: '0 15px 30px -5px rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.3 }}
              style={{ 
                background: 'var(--color-bg)', 
                padding: '40px', 
                borderRadius: '20px', 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--color-border)',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box',
                minHeight: '280px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>{t('work.modules.photo.label')}</div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: '400', marginBottom: '15px', lineHeight: 1.2 }}>{t('work.modules.photo.title')}</h2>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>{t('work.modules.photo.quote')}</p>
              </div>
              <div style={{ marginTop: '30px', fontWeight: '500', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-main)' }}>
                {t('work.modules.photo.enter')} <span style={{ fontSize: '1.1em' }}>→</span>
              </div>
            </motion.div>
          </Link>

        </div>
      </div>
    </motion.div>
  );
};

export default Work;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { Link } from 'react-router-dom';

const CaseIndex = () => {
  const { t } = useTranslation();
  useTitle(t('case.pageTitle'));

  const [hoveredChapter, setHoveredChapter] = useState(null);

  const chapterIds = [
    '01-background', '02-ui-guidelines', '03-cmf', '04-packaging',
    '05-poster-kv', '06-marketing-plan', '07-offline-materials', '08-results-review'
  ];

  const chapters = chapterIds.map((id, index) => ({
    id,
    number: String(index + 1).padStart(2, '0'),
    title: t(`case.chapters.${id}.title`),
    desc: t(`case.chapters.${id}.desc`),
    output: t(`case.chapters.${id}.output`),
    time: `${t(`case.chapters.${id}.time`)} ${t('case.minutes')}`
  }));

  const totalTime = chapterIds.reduce((sum, id) => sum + parseInt(t(`case.chapters.${id}.time`)), 0);

  return (
    <div className="noise-bg" style={{ minHeight: '100vh', padding: 'var(--space-4xl) var(--space-2xl)' }}>
      
      {/* 1. Case Hero */}
      <section style={{ marginBottom: 'var(--space-section)', textAlign: 'center', maxWidth: '1000px', margin: '0 auto var(--space-section) auto' }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 'var(--space-xl)' }}>{t('case.featuredCaseStudy')}</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-display)', fontWeight: '400', lineHeight: 'var(--line-height-tight)', marginBottom: 'var(--space-xl)', letterSpacing: '-0.03em' }}>
          {t('case.projectTitle')}
        </h1>
        <p style={{ fontSize: 'var(--text-h3)', color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto var(--space-3xl) auto', lineHeight: 'var(--line-height-base)' }}>
          {t('case.projectDesc')}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3xl)', marginBottom: 'var(--space-3xl)', flexWrap: 'wrap', fontSize: 'var(--text-body)', color: 'var(--color-text-main)' }}>
          <div>
            <div style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 'var(--text-xs)' }}>{t('case.role')}</div>
            <div style={{ fontWeight: '600' }}>{t('case.roleValue')}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 'var(--text-xs)' }}>{t('case.duration')}</div>
            <div style={{ fontWeight: '600' }}>{t('case.durationValue')}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 'var(--text-xs)' }}>{t('case.team')}</div>
            <div style={{ fontWeight: '600' }}>{t('case.teamValue')}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 'var(--text-xs)' }}>{t('case.scope')}</div>
            <div style={{ fontWeight: '600' }}>{t('case.scopeValue')}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)' }}>
          <Link to="/work/the-case/01-background">
            <button style={{ padding: '16px 40px', background: 'var(--color-text-main)', color: 'var(--color-bg)', border: 'none', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-body-lg)', cursor: 'pointer', fontWeight: '500', transition: 'transform 0.2s' }}>
              {t('case.startReading')}
            </button>
          </Link>
        </div>
      </section>

      {/* 2. Chapter Grid (Bento Style) */}
      <section id="chapter-list" style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 'var(--space-3xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)', margin: 0 }}>{t('case.tableOfContents')}</h2>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-body)' }}>{t('case.chaptersInfo', { count: chapters.length, time: totalTime })}</div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 'var(--space-lg)' 
        }}>
          {chapters.map((chapter, index) => (
            <Link 
              key={chapter.id} 
              to={`/work/the-case/${chapter.id}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <motion.div 
                whileHover={{ y: -5, boxShadow: 'var(--shadow-hover)' }}
                style={{ 
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-xl)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '280px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ 
                  position: 'absolute', 
                  top: '-20px', 
                  right: '-10px', 
                  fontSize: '5em', 
                  fontWeight: '900', 
                  color: 'var(--color-bg-alt)', 
                  opacity: 0.8,
                  zIndex: 0,
                  fontFamily: 'var(--font-serif)',
                  lineHeight: 1,
                  pointerEvents: 'none'
                }}>
                  {chapter.number}
                </div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: '1px' }}>Chapter {chapter.number}</div>
                  <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: '600', marginBottom: 'var(--space-sm)', lineHeight: 'var(--line-height-snug)' }}>{chapter.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-body)', lineHeight: 'var(--line-height-base)', margin: 0 }}>{chapter.desc}</p>
                </div>

                <div style={{ position: 'relative', zIndex: 1, marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  <span>{chapter.time}</span>
                  <span style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>{t('case.read')} →</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Quick Access */}
      <section style={{ marginTop: 'var(--space-section)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4xl)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-xl)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 'var(--text-sm)' }}>{t('case.quickAccess')}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)' }}>
          <Link to="/work/the-case/08-results-review">
            <button style={{ padding: '12px 30px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontWeight: '500', color: 'var(--color-text-muted)', transition: 'all 0.2s' }} className="hover:border-black hover:text-black">
              {t('case.viewResults')}
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default CaseIndex;
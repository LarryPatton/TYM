import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { Link } from 'react-router-dom';

const CaseIndex = () => {
  const { t } = useTranslation();
  useTitle(t('case.pageTitle'));

  const [hoveredPhase, setHoveredPhase] = useState(null);

  // 4 Phase 结构
  const phases = [
    {
      id: 'phase-01',
      number: '01',
      titleEn: 'Brand Identity 0–1',
      titleZh: t('case.phases.phase-01.title'),
      desc: t('case.phases.phase-01.desc'),
      image: '/images/case/phase-01-cover.jpg',
      imagePlaceholder: 'Logo · VI · 色彩系统'
    },
    {
      id: 'phase-02',
      number: '02',
      titleEn: 'Product A · From Concept to Launch',
      titleZh: t('case.phases.phase-02.title'),
      desc: t('case.phases.phase-02.desc'),
      image: '/images/case/phase-02-cover.jpg',
      imagePlaceholder: '概念 · 设计 · 落地'
    },
    {
      id: 'phase-03',
      number: '03',
      titleEn: 'Product B · Consistency with Variation',
      titleZh: t('case.phases.phase-03.title'),
      desc: t('case.phases.phase-03.desc'),
      image: '/images/case/phase-03-cover.jpg',
      imagePlaceholder: '差异化 · 一致性'
    },
    {
      id: 'phase-04',
      number: '04',
      titleEn: 'Packaging & Marketing Extensions',
      titleZh: t('case.phases.phase-04.title'),
      desc: t('case.phases.phase-04.desc'),
      image: '/images/case/phase-04-cover.jpg',
      imagePlaceholder: '包装 · 营销 · 触点'
    }
  ];

  // 响应式 CSS
  const responsiveCSS = `
    .case-index-container {
      min-height: 100vh;
      height: 100vh;
      padding: 80px var(--space-2xl) var(--space-xl);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background: var(--color-bg);
      overflow: hidden;
    }
    .case-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-2xl);
      flex-wrap: wrap;
      gap: var(--space-md);
    }
    .case-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: var(--space-lg);
      flex: 1;
      min-height: 0;
    }
    .case-card {
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      display: flex;
      flex-direction: row;
      height: 100%;
      transition: all 0.3s ease;
    }
    .case-card:hover {
      border-color: var(--color-text-light);
      box-shadow: var(--shadow-hover);
    }
    .case-card-image {
      position: relative;
      overflow: hidden;
      background: var(--color-bg-alt);
      width: 160px;
      min-width: 160px;
      flex-shrink: 0;
    }
    .case-card-content {
      padding: var(--space-lg) var(--space-xl);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      min-width: 0;
    }
    @media (max-width: 1200px) {
      .case-grid {
        grid-template-columns: 1fr;
        gap: var(--space-lg);
      }
      .case-card {
        max-width: 700px;
      }
      .case-card-image {
        width: 180px;
        min-width: 180px;
      }
    }
    @media (max-width: 640px) {
      .case-index-container {
        padding: 80px var(--space-lg) var(--space-2xl);
      }
      .case-card {
        flex-direction: column;
        max-width: 100%;
      }
      .case-card-image {
        width: 100%;
        min-width: 100%;
        height: 140px;
      }
      .case-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `;

  return (
    <>
      <style>{responsiveCSS}</style>
      <div className="case-index-container">
        
        {/* 1. 紧凑头部 */}
        <header className="case-header">
          <Link 
            to="/work" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              fontSize: 'var(--text-body)',
              transition: 'color 0.2s'
            }}
          >
            <span>←</span>
            <span>{t('case.backToIndex')}</span>
          </Link>
          
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            fontWeight: '400',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            {t('case.projectTitle')}
          </h1>
          
          <div style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-sm)'
          }}>
            {t('case.phasesInfo', { count: phases.length })}
          </div>
        </header>

        {/* 2. Phase 卡片网格 */}
        <section className="case-grid">
          {phases.map((phase) => (
            <Link 
              key={phase.id} 
              to={`/work/the-case/${phase.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              onMouseEnter={() => setHoveredPhase(phase.id)}
              onMouseLeave={() => setHoveredPhase(null)}
            >
              <motion.article 
                className="case-card"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {/* 左侧：配图区 */}
                <div className="case-card-image">
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, var(--color-bg-alt) 0%, rgba(255,255,255,0.05) 100%)',
                    color: 'var(--color-text-light)',
                    fontSize: 'var(--text-sm)',
                    textAlign: 'center',
                    padding: 'var(--space-md)'
                  }}>
                    <div style={{
                      fontSize: '2.5rem',
                      fontWeight: '700',
                      fontFamily: 'var(--font-serif)',
                      opacity: 0.4,
                      marginBottom: 'var(--space-xs)'
                    }}>
                      {phase.number}
                    </div>
                    <div style={{ opacity: 0.6, fontSize: 'var(--text-xs)' }}>
                      {phase.imagePlaceholder}
                    </div>
                  </div>
                </div>
                
                {/* 右侧：文字区 */}
                <div className="case-card-content">
                  <div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-light)',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      fontWeight: '600',
                      marginBottom: 'var(--space-sm)'
                    }}>
                      Phase {phase.number}
                    </div>
                    <h3 style={{
                      fontSize: 'var(--text-h4)',
                      fontWeight: '500',
                      lineHeight: 'var(--line-height-snug)',
                      fontFamily: 'var(--font-serif)',
                      marginBottom: 'var(--space-xs)',
                      color: 'var(--color-text-main)'
                    }}>
                      {phase.titleEn}
                    </h3>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-muted)',
                      marginBottom: 'var(--space-sm)'
                    }}>
                      {phase.titleZh}
                    </div>
                    <p style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-muted)',
                      lineHeight: 'var(--line-height-relaxed)',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {phase.desc}
                    </p>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingTop: 'var(--space-md)',
                    borderTop: '1px solid var(--color-border)',
                    marginTop: 'var(--space-md)'
                  }}>
                    <motion.span 
                      animate={{ x: hoveredPhase === phase.id ? 4 : 0 }}
                      style={{
                        color: 'var(--color-text-main)',
                        fontWeight: '500',
                        fontSize: 'var(--text-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-xs)'
                      }}
                    >
                      {t('case.explore')}
                      <span>→</span>
                    </motion.span>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </section>

      </div>
    </>
  );
};

export default CaseIndex;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { Link } from 'react-router-dom';

const CaseIndex = () => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'zh' || i18n.language?.startsWith('zh');
  useTitle(t('case.pageTitle'));

  const [hoveredPhase, setHoveredPhase] = useState(null);

  // 6 Phase 结构 (2行3列)
  const phases = [
    {
      id: 'phase-01',
      number: '01',
      titleEn: 'Brand Identity 0–1',
      titleZh: t('case.phases.phase-01.title'),
      desc: t('case.phases.phase-01.desc'),
      image: '/images/case-index/phase-01-cover.png',
      imagePlaceholder: 'Logo · VI · 色彩系统',
      isPlaceholder: false
    },
    {
      id: 'phase-02',
      number: '02',
      titleEn: 'Product A · From Concept to Launch',
      titleZh: t('case.phases.phase-02.title'),
      desc: t('case.phases.phase-02.desc'),
      image: '/images/case-index/phase-02-cover.png',
      imagePlaceholder: '概念 · 设计 · 落地',
      isPlaceholder: false
    },
    {
      id: 'phase-03',
      number: '03',
      titleEn: 'Product B · Consistency with Variation',
      titleZh: t('case.phases.phase-03.title'),
      desc: t('case.phases.phase-03.desc'),
      image: '/images/case-index/phase-03-cover.png',
      imagePlaceholder: '差异化 · 一致性',
      isPlaceholder: false
    },
    {
      id: 'phase-04',
      number: '04',
      titleEn: 'Packaging & Marketing Extensions',
      titleZh: t('case.phases.phase-04.title'),
      desc: t('case.phases.phase-04.desc'),
      image: null, // 暂无封面
      imagePlaceholder: '包装 · 营销 · 触点',
      isPlaceholder: false
    },
    // 占位 Phase 05
    {
      id: 'phase-05',
      number: '05',
      titleEn: 'Coming Soon',
      titleZh: '即将上线',
      desc: '更多精彩内容正在准备中...',
      image: null,
      imagePlaceholder: '敬请期待',
      isPlaceholder: true
    },
    // 占位 Phase 06
    {
      id: 'phase-06',
      number: '06',
      titleEn: 'Coming Soon',
      titleZh: '即将上线',
      desc: '更多精彩内容正在准备中...',
      image: null,
      imagePlaceholder: '敬请期待',
      isPlaceholder: true
    }
  ];

  // 响应式 CSS - 2行3列网格
  const responsiveCSS = `
    .case-index-container {
      min-height: calc(100vh - 60px);
      padding: 100px var(--space-2xl) var(--space-2xl);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background: var(--color-bg);
    }
    .case-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-xl);
      flex-wrap: wrap;
      gap: var(--space-md);
      flex-shrink: 0;
      position: relative;
    }
    .case-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-lg);
      flex: 1;
    }
    .case-card {
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
    }
    .case-card:hover {
      border-color: var(--color-text-light);
      box-shadow: var(--shadow-hover);
    }
    .case-card.placeholder {
      opacity: 0.5;
      pointer-events: none;
    }
    .case-card-image {
      position: relative;
      overflow: hidden;
      background: var(--color-bg-alt);
      width: 100%;
      padding-top: 56.25%; /* 16:9 比例 */
      flex-shrink: 0;
    }
    .case-card-content {
      padding: var(--space-md) var(--space-lg);
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--space-xs);
    }
    @media (max-width: 1400px) {
      .case-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 900px) {
      .case-index-container {
        padding: 100px var(--space-lg) var(--space-xl);
      }
      .case-grid {
        grid-template-columns: 1fr;
        gap: var(--space-md);
      }
    }
    @media (max-width: 640px) {
      .case-index-container {
        padding: 80px var(--space-md) var(--space-xl);
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
        
        {/* 1. 头部：面包屑导航 + 标题 */}
        <header className="case-header">
          {/* 面包屑导航 */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            fontSize: 'var(--text-sm)',
          }}>
            <Link 
              to="/work" 
              style={{
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-text-main)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
            >
              {t('nav.work')}
            </Link>
            <span style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>/</span>
            <span style={{ color: 'var(--color-text-main)' }}>
              {t('case.projectTitle')}
            </span>
          </nav>
          
          {/* 居中标题 - 支持中英文 */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            fontWeight: '400',
            margin: 0,
            letterSpacing: '-0.02em',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            {t('case.projectTitle')}
          </h1>
          
          {/* 右侧留空，保持布局平衡 */}
          <div style={{ width: '1px' }}></div>
        </header>

        {/* 2. Phase 卡片网格 - 2行3列 */}
        <section className="case-grid">
          {phases.map((phase) => (
            <Link 
              key={phase.id} 
              to={phase.isPlaceholder ? '#' : `/work/the-case/${phase.id}`}
              style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                cursor: phase.isPlaceholder ? 'default' : 'pointer'
              }}
              onMouseEnter={() => !phase.isPlaceholder && setHoveredPhase(phase.id)}
              onMouseLeave={() => setHoveredPhase(null)}
              onClick={(e) => phase.isPlaceholder && e.preventDefault()}
            >
              <motion.article 
                className={`case-card ${phase.isPlaceholder ? 'placeholder' : ''}`}
                whileHover={phase.isPlaceholder ? {} : { y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {/* 顶部：配图区 */}
                <div className="case-card-image">
                  {phase.image ? (
                    // 有封面图时显示图片
                    <img 
                      src={`${import.meta.env.BASE_URL}${phase.image.replace(/^\//, '')}`}
                      alt={phase.titleEn}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                  ) : (
                    // 无封面图时显示占位
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: phase.isPlaceholder 
                        ? 'linear-gradient(135deg, rgba(50,50,50,0.3) 0%, rgba(30,30,30,0.3) 100%)'
                        : 'linear-gradient(135deg, var(--color-bg-alt) 0%, rgba(255,255,255,0.05) 100%)',
                      color: 'var(--color-text-light)',
                      fontSize: 'var(--text-sm)',
                      textAlign: 'center',
                      padding: 'var(--space-md)'
                    }}>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        fontFamily: 'var(--font-serif)',
                        opacity: phase.isPlaceholder ? 0.2 : 0.4,
                        marginBottom: 'var(--space-xs)'
                      }}>
                        {phase.number}
                      </div>
                      <div style={{ opacity: 0.6, fontSize: 'var(--text-xs)' }}>
                        {phase.imagePlaceholder}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 底部：文字区 - 方案 D */}
                <div className="case-card-content">
                  <div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-light)',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      fontWeight: '600',
                      marginBottom: 'var(--space-xs)'
                    }}>
                      {isZh ? `阶段 ${phase.number}` : `Phase ${phase.number}`}
                    </div>
                    {/* 主标题：根据语言切换 */}
                    <h3 style={{
                      fontSize: 'var(--text-body)',
                      fontWeight: '500',
                      lineHeight: 'var(--line-height-snug)',
                      fontFamily: 'var(--font-serif)',
                      marginBottom: isZh ? 'var(--space-xs)' : 0,
                      color: 'var(--color-text-main)'
                    }}>
                      {isZh ? phase.titleZh : phase.titleEn}
                    </h3>
                    {/* 副标题：仅中文模式显示英文原名 */}
                    {isZh && (
                      <div style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-muted)',
                      }}>
                        {phase.titleEn}
                      </div>
                    )}
                  </div>
                  
                  {!phase.isPlaceholder && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      paddingTop: 'var(--space-sm)',
                      borderTop: '1px solid var(--color-border)',
                      marginTop: 'var(--space-sm)'
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
                  )}
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
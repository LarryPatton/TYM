import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';
import FrostedDotsBackground from '../components/FrostedDotsBackground';

const CaseIndex = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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
      image: '/images/mobile/work/Desktop - 1.png',
      imagePlaceholder: 'Logo · VI · 色彩系统',
      isPlaceholder: false
    },
    {
      id: 'phase-02',
      number: '02',
      titleEn: 'Product A · From Concept to Launch',
      titleZh: t('case.phases.phase-02.title'),
      desc: t('case.phases.phase-02.desc'),
      image: '/images/mobile/work/Desktop - 2.png',
      imagePlaceholder: '概念 · 设计 · 落地',
      isPlaceholder: false
    },
    {
      id: 'phase-03',
      number: '03',
      titleEn: 'Product B · Consistency with Variation',
      titleZh: t('case.phases.phase-03.title'),
      desc: t('case.phases.phase-03.desc'),
      image: '/images/mobile/work/Desktop - 3.png',
      imagePlaceholder: '差异化 · 一致性',
      isPlaceholder: false
    },
    {
      id: 'phase-04',
      number: '04',
      titleEn: 'Packaging & Marketing Extensions',
      titleZh: t('case.phases.phase-04.title'),
      desc: t('case.phases.phase-04.desc'),
      image: '/images/mobile/work/Desktop - 4.png',
      imagePlaceholder: '包装 · 营销 · 触点',
      isPlaceholder: false
    },
    // 占位 Phase 05
    {
      id: 'phase-05',
      number: '05',
      titleEn: 'Retail & Experience Expansion',
      titleZh: t('case.phases.phase-05.title'),
      desc: t('case.phases.phase-05.desc'),
      image: '/images/mobile/work/Desktop - 5.png',
      imagePlaceholder: '零售 · 场景 · 体验',
      isPlaceholder: false
    },
    // Phase 06
    {
      id: 'phase-06',
      number: '06',
      titleEn: 'Copywriting Visualization',
      titleZh: t('case.phases.phase-06.title'),
      desc: t('case.phases.phase-06.desc'),
      image: '/images/mobile/work/Desktop - 6.png',
      imagePlaceholder: '文案 · 可视化',
      isPlaceholder: false
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
      background: transparent;
      position: relative;
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
    /* 桌面端：标题居中 */
    .case-title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
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
        padding: var(--space-md) var(--space-page-x) var(--space-lg);
      }
      .case-header {
        flex-direction: row;
        align-items: center;
        gap: var(--space-sm);
        margin-bottom: var(--space-md);
      }
      /* 移动端：隐藏面包屑，显示返回按钮 */
      .case-breadcrumb {
        display: none !important;
      }
      .case-back-btn {
        display: flex !important;
      }
      /* 移动端：标题正常流，不绝对定位 */
      .case-title {
        position: static;
        transform: none;
        font-size: clamp(1.3rem, 5vw, 1.6rem) !important;
        margin: 0;
      }
      /* 移动端：隐藏右侧占位 */
      .case-header-spacer {
        display: none;
      }
      /* 移动端：压缩卡片内容区 */
      .case-card-content {
        padding: var(--space-sm) var(--space-md) !important;
        gap: 2px !important;
      }
      .case-card-content h3 {
        font-size: var(--text-sm) !important;
      }
    }
  `;

  return (
    <>
      <style>{responsiveCSS}</style>
      
      {/* 动态磨砂光斑背景 - 与 About 页面一致 */}
      <div style={{ 
        position: 'fixed', 
        inset: 0,
        top: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <FrostedDotsBackground />
      </div>
      
      <div className="case-index-container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* 1. 头部：面包屑导航 + 标题 */}
        <header className="case-header">
          {/* 返回按钮 - 仅移动端显示 */}
          <Link 
            to="/work" 
            className="case-back-btn"
            style={{
              display: 'none', // 默认隐藏，移动端通过 CSS 显示
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-bg-alt)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-main)',
              textDecoration: 'none',
              fontSize: '1.1rem',
              flexShrink: 0,
            }}
          >
            ←
          </Link>
          
          {/* 面包屑导航 - 按钮式设计（仅桌面端显示） */}
          <nav className="case-breadcrumb">
            <Link 
              to="/work" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-main)',
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                padding: '8px 16px',
                borderRadius: '20px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
              }}
            >
              <span>←</span>
              <span style={{ fontWeight: 500 }}>{t('nav.work')}</span>
              <span style={{ opacity: 0.4, margin: '0 2px' }}>|</span>
              <span style={{ opacity: 0.7 }}>{t('case.projectTitle')}</span>
            </Link>
          </nav>
          
          {/* 居中标题 - 桌面端绝对定位居中，移动端正常流 */}
          <h1 className="case-title" style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            fontWeight: '400',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            {t('case.projectTitle')}
          </h1>
          
          {/* 右侧留空，保持布局平衡 - 仅桌面端 */}
          <div className="case-header-spacer" style={{ width: '1px' }}></div>
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
                    // 有封面图时显示图片（对空格进行URL编码）
                    <img 
                      src={`${import.meta.env.BASE_URL}${phase.image.replace(/^\//, '')}`.replace(/ /g, '%20')}
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
                
                {/* 底部：文字区 */}
                <div className="case-card-content">
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                  }}>
                    {/* 左侧：阶段信息和标题 */}
                    <div className="case-card-title-row" style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 'var(--space-sm)',
                      flexWrap: 'wrap',
                      flex: 1,
                    }}>
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-light)',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        fontWeight: '600',
                        flexShrink: 0,
                      }}>
                        {isZh ? `阶段 ${phase.number}` : `Phase ${phase.number}`}
                      </span>
                      {/* 主标题：根据语言切换 */}
                      <h3 style={{
                        fontSize: 'var(--text-body)',
                        fontWeight: '500',
                        lineHeight: 'var(--line-height-snug)',
                        fontFamily: 'var(--font-serif)',
                        margin: 0,
                        color: 'var(--color-text-main)'
                      }}>
                        {isZh ? phase.titleZh : phase.titleEn}
                      </h3>
                    </div>
                    
                    {/* 右侧：探索按钮 */}
                    {!phase.isPlaceholder && (
                      <motion.span 
                        animate={{ x: hoveredPhase === phase.id ? 4 : 0 }}
                        style={{
                          color: 'var(--color-text-main)',
                          fontWeight: '500',
                          fontSize: 'var(--text-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-xs)',
                          flexShrink: 0,
                        }}
                      >
                        {t('case.explore')}
                        <span>→</span>
                      </motion.span>
                    )}
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
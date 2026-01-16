import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Leva } from 'leva';
import { useTitle } from '../hooks/useTitle';
import { phasesConfig, getNextPhase } from '../config/phaseConfig';
import {
  IntroScreen,
  PrinciplesScreen,
  ContentScreen,
  ComparisonScreen,
  GalleryScreen,
  SummaryScreen,
  LogoScrollScreen,
  LogoMarqueeScreen,
  LogoStructureScreen,
  LogoFocusLensScreen,
  BrandIdentityScreen,
  CorePrinciplesScreen,
  StabilityMessageScreen,
  PhaseClosingScreen,
  ValidationStickyScreen,
  TypographyStickyScreen,
  SummaryTextHighlightScreen,
  ColorRevealScreen,
  BoundariesScreen,
  PriorityGridScreen,
  PackagingGalleryScreen,
  ConsistencyMosaicScreen,
  ProgressIndicator,
  responsiveStyles,
  TransitionProvider,
  TransitionDebugger,
} from '../components/PhaseScreens';
import { ExportConfigButton } from '../components/PhaseScreens/ExportConfigButton';

// 主组件
const PhaseDetail = () => {
  const { phaseId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(1);
  
  const phase = phasesConfig[phaseId];
  const nextPhaseConfig = getNextPhase(phaseId);
  
  useTitle(t(`case.phases.${phaseId}.title`) + ' | ' + t('case.pageTitle'));
  
  // 滚动监听更新当前屏幕
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const scrollTop = window.scrollY + window.innerHeight / 2;
      
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;
        
        if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
          setCurrentScreen(index + 1);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 页面切换时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentScreen(1);
  }, [phaseId]);
  
  if (!phase) {
    return (
      <div style={{ padding: 'var(--space-4xl)', textAlign: 'center' }}>
        <h1>Phase not found</h1>
        <Link to="/work/the-case">← Back to Index</Link>
      </div>
    );
  }

  // 渲染单个屏幕
  const renderScreen = (screenConfig, index) => {
    const screenNumber = String(index + 1).padStart(2, '0');
    const screenLabel = t(`case.screenLabels.${screenConfig.id}`, { defaultValue: screenConfig.id });
    const screenData = t(`case.phases.${phase.id}.screens.${screenConfig.id}`, { returnObjects: true });
    
    // 特殊处理 Logo 屏幕 (旧逻辑，现在通过 type 判断)
    if (screenConfig.id === 'logo' && phase.id === 'phase-01') {
      return (
        <LogoScrollScreen
          key={screenConfig.id}
          screenNumber={screenNumber}
          screenLabel={screenLabel}
          title={screenData?.title || ''}
          content={screenData?.content || ''}
        />
      );
    }

    // 特殊处理 Validation 屏幕 (Phase 01) - 使用 Sticky 布局
    if (screenConfig.id === 'validation' && phase.id === 'phase-01') {
      return (
        <ValidationStickyScreen
          key={screenConfig.id}
          screenNumber={screenNumber}
          screenLabel={screenLabel}
          title={screenData?.title || ''}
          content={screenData?.content || ''}
        />
      );
    }

    // 特殊处理 Typography 屏幕 (Phase 01) - 使用 Sticky 布局
    if (screenConfig.id === 'typography' && phase.id === 'phase-01') {
      return (
        <TypographyStickyScreen
          key={screenConfig.id}
          screenNumber={screenNumber}
          screenLabel={screenLabel}
          title={screenData?.title || ''}
          content={screenData?.content || ''}
        />
      );
    }

    // 特殊处理 Summary 屏幕 (Phase 01) - 使用 Text Highlight 布局
    if (screenConfig.id === 'summary' && phase.id === 'phase-01') {
      return (
        <SummaryTextHighlightScreen
          key={screenConfig.id}
          title={screenData?.title || ''}
          content={screenData?.content || ''}
        />
      );
    }

    // 特殊处理 Color Reveal 屏幕 (Phase 01)
    if (screenConfig.type === 'color-reveal') {
      return (
        <ColorRevealScreen key={screenConfig.id} />
      );
    }

    switch (screenConfig.type) {
      case 'intro':
        return (
          <IntroScreen
            key={screenConfig.id}
            phaseNumber={phase.number}
            titleEn={phase.titleEn}
            titleZh={t(`case.phases.${phase.id}.title`)}
            content={screenData?.content || ''}
            imageHint={screenConfig.imageHint}
            bgImage={screenConfig.bgImage}
          />
        );
      
      case 'core-principles':
        return (
          <CorePrinciplesScreen key={screenConfig.id} />
        );

      case 'sticky-scroll':
        return (
          <ValidationStickyScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            images={screenConfig.images} // Pass images from config
          />
        );

      case 'boundaries':
        return (
          <BoundariesScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            emphasis={screenData?.emphasis || ''}
            images={screenConfig.images || []}
          />
        );

      case 'priority-grid':
        return (
          <PriorityGridScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            emphasis={screenData?.emphasis || ''}
            images={screenConfig.images || []}
            bgAlt={screenConfig.bgAlt}
          />
        );

      case 'packaging-gallery':
        return (
          <PackagingGalleryScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            emphasis={screenData?.emphasis || ''}
            images={screenConfig.images || []}
            bgAlt={screenConfig.bgAlt}
          />
        );

      case 'consistency-mosaic':
        return (
          <ConsistencyMosaicScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            emphasis={screenData?.emphasis || ''}
            images={screenConfig.images || []}
            bgAlt={screenConfig.bgAlt}
          />
        );

      case 'stability-message':
        return (
          <StabilityMessageScreen key={screenConfig.id} />
        );

      case 'principles':
        return (
          <PrinciplesScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            principles={screenConfig.items?.map(key => ({
              key,
              title: screenData?.items?.[key]?.title || key,
              desc: screenData?.items?.[key]?.desc || ''
            })) || []}
          />
        );
      
      case 'brand-identity':
        return (
          <BrandIdentityScreen key={screenConfig.id} />
        );
      
      case 'logo-scroll':
        return (
          <LogoScrollScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
          />
        );
      
      case 'logo-marquee':
        return (
          <LogoMarqueeScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
          />
        );
      
      case 'logo-structure':
        return (
          <LogoStructureScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            // 显式传入图片路径，确保正确
            imageSrc={`${import.meta.env.BASE_URL}images/phase-01/logo-structure.png`}
          />
        );
      
      case 'logo-focus-lens':
        return (
          <LogoFocusLensScreen
            key={screenConfig.id}
          />
        );
      
      case 'content':
        return (
          <ContentScreen
            key={screenConfig.id}
            id={screenConfig.id} // Pass ID
            phaseId={phase.id}   // Pass Phase ID
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            note={screenData?.note}
            imageHint={screenConfig.imageHint}
            reverse={screenConfig.reverse}
            bgAlt={screenConfig.bgAlt}
            customImage={screenConfig.bgImage} // Pass customImage from config
          />
        );
      
      case 'comparison':
        return (
          <ComparisonScreen
            key={screenConfig.id}
            id={screenConfig.id} // Pass ID
            phaseId={phase.id}   // Pass Phase ID
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            note={screenData?.note}
            leftHint={screenConfig.leftHint}
            rightHint={screenConfig.rightHint}
            leftLabel={screenConfig.leftLabel}
            rightLabel={screenConfig.rightLabel}
            bgAlt={screenConfig.bgAlt}
          />
        );
      
      case 'gallery':
        return (
          <GalleryScreen
            key={screenConfig.id}
            id={screenConfig.id} // Pass ID
            phaseId={phase.id}   // Pass Phase ID
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            images={screenConfig.images || []}
            columns={screenConfig.columns || 2}
            bgAlt={screenConfig.bgAlt}
          />
        );
      
      case 'phase-closing':
        return (
          <PhaseClosingScreen
            key={screenConfig.id}
            bgImage={screenConfig.bgImage}
            nextPhase={nextPhaseConfig ? {
              id: nextPhaseConfig.id,
              titleZh: t(`case.phases.${nextPhaseConfig.id}.title`)
            } : null}
            backLabel={t('case.backToIndex')}
            nextLabel={t('case.nextPhase')}
            onNavigate={navigate}
          />
        );
      
      case 'summary':
        return (
          <SummaryScreen
            key={screenConfig.id}
            id={screenConfig.id} // Pass ID
            phaseId={phase.id}   // Pass Phase ID
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            imageHint={screenConfig.imageHint}
            nextPhase={nextPhaseConfig ? {
              id: nextPhaseConfig.id,
              titleZh: t(`case.phases.${nextPhaseConfig.id}.title`)
            } : null}
            backLabel={t('case.backToIndex')}
            nextLabel={t('case.nextPhase')}
            onNavigate={navigate}
          />
        );
      
      default:
        return null;
    }
  };

  // 开发环境启用调试模式
  const isDev = import.meta.env.DEV;

  return (
    <TransitionProvider debug={isDev}>
      <style>{responsiveStyles}</style>
      
      {/* Leva 调试面板 - 仅开发环境显示 */}
      {isDev && (
        <>
          <Leva 
            collapsed={true}
            oneLineLabels={false}
            flat={false}
            theme={{
              colors: {
                accent1: '#FF4600',
                accent2: '#FF7A3D',
                accent3: '#FF4600',
                elevation1: '#1a1a1a',
                elevation2: '#2a2a2a',
                elevation3: '#3a3a3a',
              },
              fontSizes: {
                root: '11px',
              },
            }}
            titleBar={{
              title: '🎛️ Transition Debugger',
              drag: true,
              filter: true,
            }}
          />
          {/* 导出配置按钮 - 添加到 Leva 面板 */}
          <ExportConfigButton />
        </>
      )}
      
      <div style={{ position: 'relative', background: 'var(--color-bg)' }}>
        {/* 顶部导航 - 改造为左上角悬浮胶囊 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: currentScreen > 1 ? 1 : 0, 
            y: currentScreen > 1 ? 0 : -20,
            pointerEvents: currentScreen > 1 ? 'auto' : 'none'
          }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: '24px',
            left: '24px',
            zIndex: 100,
          }}
        >
          <Link 
            to="/work/the-case" 
            style={{ 
              textDecoration: 'none', 
              color: '#fff', 
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <span>←</span>
            <span style={{ fontWeight: 500 }}>{t('case.backToToc')}</span>
            <span style={{ opacity: 0.5, margin: '0 4px' }}>|</span>
            <span style={{ opacity: 0.8 }}>Phase {phase.number}</span>
          </Link>
        </motion.div>
        
        {/* 进度指示器 */}
        <ProgressIndicator 
          currentScreen={currentScreen} 
          totalScreens={phase.totalScreens} 
        />
        
        {/* 渲染所有屏幕 */}
        {phase.screens.map((screenConfig, index) => 
          renderScreen(screenConfig, index)
        )}
      </div>
    </TransitionProvider>
  );
};

export default PhaseDetail;
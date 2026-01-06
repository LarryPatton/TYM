import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { phasesConfig, getNextPhase } from '../config/phaseConfig';
import {
  IntroScreen,
  PrinciplesScreen,
  ContentScreen,
  ComparisonScreen,
  GalleryScreen,
  SummaryScreen,
  ProgressIndicator,
  responsiveStyles
} from '../components/PhaseScreens';

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
          />
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
      
      case 'content':
        return (
          <ContentScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            note={screenData?.note}
            imageHint={screenConfig.imageHint}
            reverse={screenConfig.reverse}
            bgAlt={screenConfig.bgAlt}
          />
        );
      
      case 'comparison':
        return (
          <ComparisonScreen
            key={screenConfig.id}
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
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            images={screenConfig.images || []}
            columns={screenConfig.columns || 2}
            bgAlt={screenConfig.bgAlt}
          />
        );
      
      case 'summary':
        return (
          <SummaryScreen
            key={screenConfig.id}
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

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={{ position: 'relative', background: 'var(--color-bg)' }}>
        {/* 顶部导航 */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            padding: 'var(--space-lg) var(--space-2xl)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 100,
            background: 'linear-gradient(to bottom, var(--color-bg), transparent)'
          }}
        >
          <Link 
            to="/work/the-case" 
            style={{ 
              textDecoration: 'none', 
              color: 'var(--color-text-muted)', 
              fontSize: 'var(--text-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)'
            }}
          >
            ← {t('case.backToToc')}
          </Link>
          
          <div style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--color-text-light)',
            fontWeight: '500'
          }}>
            Phase {phase.number} — {phase.titleEn}
          </div>
        </motion.header>
        
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
    </>
  );
};

export default PhaseDetail;